from unittest.mock import AsyncMock, MagicMock
import pytest
from custom_components.adaptive_hvac.storage import AdaptiveHvacStorage

@pytest.fixture
def mock_hass():
    hass = MagicMock()
    return hass

@pytest.mark.asyncio
async def test_storage_load_defaults(mock_hass):
    """Test that storage loads default values when file is missing."""
    storage = AdaptiveHvacStorage(mock_hass)
    
    # Mock the internal store
    storage._store = AsyncMock()
    storage._store.async_load.return_value = None
    
    await storage.async_load()
    
    assert storage._data == {"zones": {}}
    assert storage.get_zone_data("test_entry") == {
        "active": True, 
        "week_profile": [], 
        "overlays": []
    }

@pytest.mark.asyncio
async def test_storage_save(mock_hass):
    """Test saving zone data."""
    storage = AdaptiveHvacStorage(mock_hass)
    storage._store = AsyncMock()
    storage._store.async_load.return_value = None
    await storage.async_load()
    
    new_data = {
        "active": False,
        "week_profile": [{"days": ["mon"], "start": "08:00", "end": "17:00", "target": {"temp": 20}}],
        "overlays": []
    }
    
    await storage.async_save_zone_data("entry_123", new_data)
    
    assert storage._data["zones"]["entry_123"] == new_data
    storage._store.async_save.assert_called_once()
