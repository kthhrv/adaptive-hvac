import './adaptive-hvac-card';
import { AdaptiveHvacCard } from './adaptive-hvac-card';

// Mock Data
let mockZoneData = {
    active: true,
    climate_entity_id: "climate.study",
    current_temp: 21.5,
    target_temp: 22,
    hvac_action: "heating",
    hvac_mode: "heat",
    week_profile: [
        { days: ["mon", "tue", "wed", "thu", "fri"], start: "08:00", end: "17:00", target: { temp: 21 } }
    ],
    overlays: [
        {
            id: "overlay_1",
            name: "Window Open",
            trigger_entity: "binary_sensor.window",
            trigger_state: "on",
            type: "absolute",
            action: { hvac_mode: "off" },
            active: false
        }
    ],
    active_overlays: []
};

// Mock Home Assistant Object
const mockHass = {
    auth: {} as any,
    connection: {} as any,
    connected: true,
    states: {},
    services: {},
    config: {},
    themes: {},
    selectedTheme: {},
    helpers: {},
    localize: (key: string) => key,
    language: "en",
    callWS: async (msg: any) => {
        console.log("[MockWS] Request:", msg);
        if (msg.type === 'adaptive_hvac/get_zone_data') {
            return mockZoneData;
        } else if (msg.type === 'adaptive_hvac/update_zone_data') {
            console.log("[MockWS] Update Data:", msg.zone_data);
            if (msg.zone_data.overlays) {
                mockZoneData.overlays = msg.zone_data.overlays;
            }
            if (msg.zone_data.week_profile) {
                mockZoneData.week_profile = msg.zone_data.week_profile;
            }
            // Simulate server response delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return;
        }
    }
};

// Initialize Card
const card = document.querySelector('adaptive-hvac-card') as AdaptiveHvacCard;
if (card) {
    card.setConfig({ zone_id: "mock_zone", title: "Mock Zone" });
    card.hass = mockHass as any;
}
