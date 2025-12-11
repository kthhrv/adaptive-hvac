"""Tests for the Adaptive HVAC Coordinator."""
from datetime import timedelta
import pytest
from unittest.mock import MagicMock, patch

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from homeassistant.const import ATTR_TEMPERATURE, STATE_ON
from homeassistant.components.climate import DOMAIN as CLIMATE_DOMAIN

from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.adaptive_hvac.coordinator import HvacCoordinator
from custom_components.adaptive_hvac.const import CONF_CLIMATE_ENTITY

@pytest.fixture
def mock_entry():
    """Mock a config entry."""
    entry = MagicMock()
    entry.entry_id = "test_entry"
    entry.data = {CONF_CLIMATE_ENTITY: "climate.test_hvac"}
    return entry

@pytest.fixture
def mock_storage():
    """Mock the storage manager."""
    storage = MagicMock()
    # default empty data
    storage.get_zone_data.return_value = {
        "active": True,
        "week_profile": [],
        "overlays": []
    }
    return storage

@pytest.fixture
async def coordinator(hass: HomeAssistant, mock_entry, mock_storage):
    """Create the coordinator instance."""
    return HvacCoordinator(hass, mock_entry, mock_storage)

@pytest.mark.asyncio
async def test_schedule_default(hass: HomeAssistant, coordinator):
    """Test default temperature when no rules match."""
    # Set time to Mon Oct 02 2023 12:00:00
    now = dt_util.now().replace(year=2023, month=10, day=2, hour=12, minute=0, second=0)
    
    with patch("custom_components.adaptive_hvac.coordinator.dt_util.now", return_value=now):
        target = coordinator._get_current_schedule_target()
        assert target == 18.0

@pytest.mark.asyncio
async def test_schedule_match(hass: HomeAssistant, coordinator):
    """Test matching a schedule rule."""
    coordinator.zone_data = {
        "active": True,
        "week_profile": [
            {"days": ["mon"], "start": "09:00", "end": "17:00", "target": {"temp": 21.0}}
        ],
        "overlays": []
    }

    # Match: Mon 10:00
    now = dt_util.now().replace(year=2023, month=10, day=2, hour=10, minute=0, second=0)
    with patch("custom_components.adaptive_hvac.coordinator.dt_util.now", return_value=now):
        target = coordinator._get_current_schedule_target()
        assert target == 21.0

    # No Match: Mon 17:01 (Just after)
    now = dt_util.now().replace(year=2023, month=10, day=2, hour=17, minute=1, second=0)
    with patch("custom_components.adaptive_hvac.coordinator.dt_util.now", return_value=now):
        target = coordinator._get_current_schedule_target()
        assert target == 18.0

@pytest.mark.asyncio
async def test_overlay_absolute_enforcement(hass: HomeAssistant, coordinator):
    """Test absolute overlay forcing an HVAC mode via proper state machine."""
    coordinator.zone_data = {
        "active": True,
        "week_profile": [],
        "overlays": [
            {
                "name": "Window",
                "trigger_entity": "binary_sensor.window",
                "trigger_state": "on",
                "type": "absolute",
                "action": {"hvac_mode": "off"},
                "active": True
            }
        ]
    }

    # 1. Setup entities in HA State Machine
    hass.states.async_set("climate.test_hvac", "heat", {"temperature": 20, "hvac_action": "heating"})
    hass.states.async_set("binary_sensor.window", "on")

    # 2. Mock Service Call
    service_calls = []
    async def mock_service(call):
        service_calls.append(call)
    
    hass.services.async_register(CLIMATE_DOMAIN, "set_hvac_mode", mock_service)

    # 3. Trigger recalculation
    # We need to mock time or manually trigger properties since async_track_state_change_event 
    # needs us to wait or fire events. For unit testing the logic, calling async_recalculate is fine.
    
    # But wait, coordinator reads from `runtime_data` property which reads `hass.states`. 
    # Since we set the state above, it should work!
    
    await coordinator.async_recalculate()

    # 4. Verify
    assert len(service_calls) == 1
    assert service_calls[0].data["entity_id"] == "climate.test_hvac"
    assert service_calls[0].data["hvac_mode"] == "off"

@pytest.mark.asyncio
async def test_overlay_relative_enforcement(hass: HomeAssistant, coordinator):
    """Test relative overlay adjusting temperature."""
    coordinator.zone_data = {
        "active": True,
        "week_profile": [], # Defaults to 18.0
        "overlays": [
            {
                "name": "Guest",
                "trigger_entity": "input_boolean.guest",
                "trigger_state": "on",
                "type": "relative",
                "action": {"temp_offset": 2.0},
                "active": True
            }
        ]
    }

    # 1. Setup State: Heat, Target 18.0 (Base)
    hass.states.async_set("climate.test_hvac", "heat", {"temperature": 18.0, "hvac_action": "heating"})
    hass.states.async_set("input_boolean.guest", "on")

    # 2. Mock Service
    service_calls = []
    async def mock_service(call):
        service_calls.append(call)
    
    hass.services.async_register(CLIMATE_DOMAIN, "set_temperature", mock_service)

    # 3. Recalculate
    # Base 18.0 + Offset 2.0 = 20.0
    # Current is 18.0, so it SHOULD call set_temperature to 20.0
    await coordinator.async_recalculate()

    # 4. Verify
    assert len(service_calls) == 1
    assert service_calls[0].data["entity_id"] == "climate.test_hvac"
    assert service_calls[0].data["temperature"] == 20.0
