from __future__ import annotations

import logging
import datetime
from datetime import timedelta
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, CALLBACK_TYPE, Event, DOMAIN as HA_DOMAIN
from homeassistant.core import HomeAssistant, CALLBACK_TYPE, Event, DOMAIN as HA_DOMAIN
from homeassistant.const import ATTR_TEMPERATURE, Platform
from homeassistant.helpers.event import async_track_state_change_event, async_track_time_interval
from homeassistant.helpers.event import async_track_state_change_event, async_track_time_interval
from homeassistant.util import dt as dt_util

from .const import CONF_CLIMATE_ENTITY
from .storage import AdaptiveHvacStorage, ZoneData

_LOGGER = logging.getLogger(__name__)


class HvacCoordinator:
    """Coordinator to manage logic for a single zone."""

    def __init__(
        self, 
        hass: HomeAssistant, 
        entry: ConfigEntry, 
        storage: AdaptiveHvacStorage
    ) -> None:
        """Initialize the coordinator."""
        self.hass = hass
        self.entry = entry
        self.storage = storage
        self.climate_entity = entry.data[CONF_CLIMATE_ENTITY]
        self.zone_data: ZoneData = storage.get_zone_data(entry.entry_id)
        
        self._remove_listeners: list[CALLBACK_TYPE] = []
        self._override_end: datetime.datetime | None = None

    async def async_setup(self) -> None:
        """Set up listeners and initial state."""
        _LOGGER.debug("Setting up HvacCoordinator for %s", self.climate_entity)
        
        # Example: track time interval every minute
        self._remove_listeners.append(
            async_track_time_interval(
                self.hass, self._async_handle_time_tick, datetime.timedelta(minutes=1)
            )
        )
        
        # Listen for state changes on the climate entity
        self._remove_listeners.append(
            async_track_state_change_event(
                self.hass, [self.climate_entity], self._async_handle_state_change
            )
        )

        # Initial calculation
        await self.async_recalculate()

    async def async_unload(self) -> None:
        """Unload the coordinator."""
        for remove in self._remove_listeners:
            remove()
        self._remove_listeners.clear()

    async def _async_handle_time_tick(self, now: Any) -> None:
        """Handle time tick."""
        await self.async_recalculate()

    async def _async_handle_state_change(self, event: Event) -> None:
        """Handle state change event."""
        # Detect Manual Override
        new_state = event.data.get("new_state")
        if new_state:
            current_temp = new_state.attributes.get("temperature")
            schedule_target = self._get_current_schedule_target()
            
            if current_temp is not None:
                try:
                    current_temp = float(current_temp)
                except ValueError:
                    pass
                
                # If the reported temp differs from schedule, it's a manual change
                if current_temp != schedule_target:
                    delay = self.zone_data.get("rescheduling_delay", 30)
                    _LOGGER.info("Manual override detected on %s. Pausing for %s min.", self.climate_entity, delay)
                    self._override_end = dt_util.now() + timedelta(minutes=delay)
                else:
                    # Aligned with schedule (either by us or user)
                    if self._override_end:
                         _LOGGER.debug("Manual override cleared (aligned with schedule).")
                    self._override_end = None

        await self.async_recalculate()

    @property
    def runtime_data(self) -> dict[str, Any]:
        """Return runtime data for the frontend."""
        state = self.hass.states.get(self.climate_entity)
        if not state:
            return {
                "current_temp": None,
                "target_temp": None,
                "hvac_action": None,
                "hvac_mode": None,
            }
        
        attrs = state.attributes
        return {
            "current_temp": attrs.get("current_temperature"),
            "target_temp": attrs.get("temperature"),
            "hvac_action": attrs.get("hvac_action"), # e.g., heating, idle, cooling
            "hvac_mode": state.state, # e.g., heat, off, auto
            "override_end": self._override_end.isoformat() if self._override_end else None,
        }

    def _get_current_schedule_target(self) -> float:
        """Get the target temperature based on the schedule."""
        now = dt_util.now()
        day_str = now.strftime("%a").lower() # mon, tue, etc.
        current_minute = now.hour * 60 + now.minute
        
        # Default to Eco
        target_temp = 18.0 
        
        week_profile = self.zone_data.get("week_profile", [])
        
        for rule in week_profile:
            if day_str in rule["days"]:
                start_h, start_m = map(int, rule["start"].split(":"))
                end_h, end_m = map(int, rule["end"].split(":"))
                start_min = start_h * 60 + start_m
                end_min = end_h * 60 + end_m
                
                if start_min <= current_minute < end_min:
                    # simplistic: if any rule matches, it's Comfort
                    # In future, rule might specify the target or preset
                    if "target" in rule and "temp" in rule["target"]:
                         target_temp = float(rule["target"]["temp"])
                    else:
                         target_temp = 21.0 # Default Comfort
                    break
        
        return target_temp

    async def async_recalculate(self) -> None:
        """Recalculate the target state."""
        _LOGGER.debug("Recalculating target for %s", self.climate_entity)
        
        # Check Override
        if self._override_end:
            if dt_util.now() < self._override_end:
                _LOGGER.debug("Skipping enforcement due to manual override (expires %s)", self._override_end)
                return
            else:
                _LOGGER.info("Manual override expired for %s", self.climate_entity)
                self._override_end = None
        
        runtime = self.runtime_data
        
        # 1. Calculate Target
        calculated_target = self._get_current_schedule_target()
        
        # 2. Compare with Actual
        current_target = runtime["target_temp"]
        
        if current_target is not None:
             try:
                 current_target = float(current_target)
             except ValueError:
                 pass

        if current_target != calculated_target:
            _LOGGER.info(
                "Adjusting %s: %s -> %s", 
                self.climate_entity, current_target, calculated_target
            )
            
            try:
                await self.hass.services.async_call(
                    Platform.CLIMATE,
                    "set_temperature",
                    {
                        "entity_id": self.climate_entity,
                        ATTR_TEMPERATURE: calculated_target
                    }
                )
            except (ValueError, Exception) as err:
                 _LOGGER.warning("Could not set temperature for %s: %s", self.climate_entity, err)
        else:
             _LOGGER.debug("State is correct (%s)", current_target)
