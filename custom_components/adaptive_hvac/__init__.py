from __future__ import annotations

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .const import DOMAIN
from .coordinator import HvacCoordinator
from .storage import AdaptiveHvacStorage
from . import websocket
from homeassistant.components import panel_custom

# TODO: Add specific platforms as we implement them (e.g., CLIMATE, SENSOR)
PLATFORMS: list[Platform] = []

async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Adaptive HVAC component."""
    # Register the frontend panel
    await panel_custom.async_register_panel(
        hass,
        frontend_url_path="adaptive_hvac",
        webcomponent_name="adaptive-hvac-panel", # <-- Added this line
        sidebar_title="Adaptive HVAC",
        sidebar_icon="mdi:thermostat-auto",
        module_url="http://localhost:5173/src/adaptive-hvac-panel.ts", # Point to Vite dev server
        require_admin=False,
    )
    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Adaptive HVAC from a config entry."""
    hass.data.setdefault(DOMAIN, {})
    
    if "storage" not in hass.data[DOMAIN]:
        storage = AdaptiveHvacStorage(hass)
        await storage.async_load()
        hass.data[DOMAIN]["storage"] = storage
        websocket.async_setup(hass)
    else:
        storage = hass.data[DOMAIN]["storage"]

    coordinator = HvacCoordinator(hass, entry, storage)
    await coordinator.async_setup()

    hass.data[DOMAIN].setdefault("coordinators", {})[entry.entry_id] = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    if unload_ok := await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        if coordinator := hass.data[DOMAIN]["coordinators"].pop(entry.entry_id, None):
            await coordinator.async_unload()

    return unload_ok
