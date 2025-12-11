from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from .const import DOMAIN
from .storage import AdaptiveHvacStorage

@callback
def async_setup(hass: HomeAssistant) -> None:
    """Set up the websocket API."""
    websocket_api.async_register_command(hass, ws_get_zone_data)
    websocket_api.async_register_command(hass, ws_update_zone_data)
    websocket_api.async_register_command(hass, ws_clear_manual_override)

@websocket_api.websocket_command({
    vol.Required("type"): "adaptive_hvac/get_zone_data",
    vol.Required("entry_id"): str,
})
@websocket_api.async_response
async def ws_get_zone_data(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Handle get zone data command."""
    entry_id = msg["entry_id"]
    storage: AdaptiveHvacStorage = hass.data[DOMAIN]["storage"]
    data = storage.get_zone_data(entry_id)
    
    # Enrich with climate_entity_id from config entry
    climate_entity_id = None
    if entry := hass.config_entries.async_get_entry(entry_id):
        climate_entity_id = entry.data.get("climate_entity")

    # Enrich with runtime data from coordinator
    runtime_data = {}
    if coordinator := hass.data[DOMAIN]["coordinators"].get(entry_id):
        runtime_data = coordinator.runtime_data

    response_data = {
        **data,
        "climate_entity_id": climate_entity_id,
        **runtime_data
    }
    
    connection.send_result(msg["id"], response_data)

@websocket_api.websocket_command({
    vol.Required("type"): "adaptive_hvac/update_zone_data",
    vol.Required("entry_id"): str,
    vol.Required("data"): dict,
})
@websocket_api.async_response
async def ws_update_zone_data(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Handle update zone data command."""
    entry_id = msg["entry_id"]
    data = msg["data"]
    storage: AdaptiveHvacStorage = hass.data[DOMAIN]["storage"]
    
    await storage.async_save_zone_data(entry_id, data)
    
    # Notify coordinator to recalculate
    if coordinator := hass.data[DOMAIN]["coordinators"].get(entry_id):
        coordinator.zone_data = data # Update local cache
        await coordinator.async_recalculate()

    connection.send_result(msg["id"])

@websocket_api.websocket_command({
    vol.Required("type"): "adaptive_hvac/clear_manual_override",
    vol.Required("entry_id"): str,
})
@websocket_api.async_response
async def ws_clear_manual_override(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Handle clear manual override command."""
    entry_id = msg["entry_id"]
    
    if coordinator := hass.data[DOMAIN]["coordinators"].get(entry_id):
        await coordinator.async_clear_manual_override()

    connection.send_result(msg["id"])
