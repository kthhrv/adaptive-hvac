from __future__ import annotations

from typing import Any, TypedDict

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import DOMAIN

STORAGE_VERSION = 1
STORAGE_KEY = DOMAIN


class ZoneData(TypedDict):
    """Data structure for a single zone."""
    active: bool
    week_profile: list[dict[str, Any]]
    overlays: list[dict[str, Any]]


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
            self._data = {"zones": {}}
        else:
            self._data = data

    def get_zone_data(self, entry_id: str) -> ZoneData:
        """Get data for a specific zone."""
        if self._data is None:
            return {"active": True, "week_profile": [], "overlays": []}
        
        return self._data["zones"].get(
            entry_id, 
            {"active": True, "week_profile": [], "overlays": []}
        )

    async def async_save_zone_data(self, entry_id: str, data: ZoneData) -> None:
        """Save data for a specific zone."""
        if self._data is None:
            self._data = {"zones": {}}
        
        self._data["zones"][entry_id] = data
        await self._store.async_save(self._data)
