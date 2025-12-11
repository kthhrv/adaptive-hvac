from __future__ import annotations

from typing import Any, TypedDict

import logging
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

STORAGE_VERSION = 1
STORAGE_KEY = DOMAIN


class Overlay(TypedDict):
    id: str
    name: str
    trigger_entity: str
    trigger_state: str # e.g., "on", "home", or ">25" (advanced later)
    type: str # Literal["absolute", "relative"]
    action: dict[str, Any] # {"hvac_mode": "off"} or {"temp_offset": 2}
    active: bool


class ZoneData(TypedDict):
    """Data structure for a single zone."""
    active: bool
    week_profile: list[dict[str, Any]]
    overlays: list[Overlay]
    rescheduling_delay: int # in minutes


class AdaptiveHvacData(TypedDict):
    """Data structure for the global storage."""
    zones: dict[str, ZoneData]


class AdaptiveHvacStorage:
    """Class to handle storage for Adaptive HVAC."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the storage."""
        self.hass = hass
        self._store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._data: AdaptiveHvacData | None = None

    async def async_load(self) -> None:
        """Load data from storage."""
        data = await self._store.async_load()
        if data is None:
            _LOGGER.debug("Storage loaded NO data")
            self._data = {"zones": {}}
        else:
            _LOGGER.debug("Storage loaded data: %s", data)
            self._data = data

    def get_zone_data(self, entry_id: str) -> ZoneData:
        """Get data for a specific zone."""
        if self._data is None:
            return {"active": True, "week_profile": [], "overlays": []}
        
        return self._data["zones"].get(
            entry_id, 
            {"active": True, "week_profile": [], "overlays": [], "rescheduling_delay": 30}
        )

    async def async_save_zone_data(self, entry_id: str, data: ZoneData) -> None:
        """Save data for a specific zone."""
        if self._data is None:
            self._data = {"zones": {}}
        
        self._data["zones"][entry_id] = data
        await self._store.async_save(self._data)
