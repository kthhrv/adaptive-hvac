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
}
