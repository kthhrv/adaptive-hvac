from typing import Any

import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.data_entry_flow import FlowResult
from homeassistant.helpers import selector

from .const import DOMAIN

class AdaptiveHvacConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Adaptive HVAC."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            return self.async_create_entry(title=user_input["name"], data=user_input)

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required("name"): str,
                    vol.Required("climate_entity"): selector.EntitySelector(
                        selector.EntitySelectorConfig(domain="climate")
                    ),
                }
            ),
            errors=errors,
        )
    @staticmethod
    @callback
    def async_get_options_flow(
        config_entry: config_entries.ConfigEntry,
    ) -> config_entries.OptionsFlow:
        """Create the options flow."""
        return AdaptiveHvacOptionsFlowHandler(config_entry)


class AdaptiveHvacOptionsFlowHandler(config_entries.OptionsFlow):
    """Handle options flow for Adaptive HVAC."""

    def __init__(self, config_entry: config_entries.ConfigEntry) -> None:
        """Initialize options flow."""
        self._config_entry = config_entry

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Manage the options."""
        if user_input is not None:
             # Update the entry with new data
             self.hass.config_entries.async_update_entry(
                 self._config_entry, data=self._config_entry.data | user_input
             )
             return self.async_create_entry(title="", data={})

        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        "climate_entity",
                        default=self._config_entry.data.get("climate_entity"),
                    ): selector.EntitySelector(
                        selector.EntitySelectorConfig(domain="climate")
                    ),
                }
            ),
        )
