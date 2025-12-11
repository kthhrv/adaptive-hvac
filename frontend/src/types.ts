export interface HomeAssistant {
    auth: any;
    connection: any;
    connected: boolean;
    states: any;
    services: any;
    config: any;
    themes: any;
    selectedTheme: any;
    helpers: any;
    localize: (key: string, ...args: any[]) => string;
    language: string;
    callWS: (msg: any) => Promise<any>;
}

export interface Overlay {
    id: string;
    name: string;
    trigger_entity: string;
    trigger_state: string;
    type: "absolute" | "relative";
    action: {
        hvac_mode?: string;
        temp_offset?: number;
    };
    active: boolean;
}

export interface WeekProfileRule {
    days: string[];
    start: string;
    end: string;
    target: {
        temp: number;
    };
}

export interface ZoneData {
    active: boolean;
    week_profile: WeekProfileRule[];
    overlays: Overlay[];
    rescheduling_delay?: number;
    climate_entity_id?: string;
    current_temp?: number;
    target_temp?: number;
    hvac_action?: string;
    hvac_mode?: string;
    override_end?: string | null;
}
