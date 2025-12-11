import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'home-assistant-js-websocket';
import './adaptive-hvac-card'; // Reuse the card logic for now

console.log("AdaptiveHvacPanel: Module Loaded! Top-level execution.");

export class AdaptiveHvacPanel extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Boolean }) public narrow!: boolean;
  @property({ attribute: false }) public route!: any;
  @property({ attribute: false }) public panel!: any;

  @state() private _entries: any[] = [];
  @state() private _error: string | undefined;

  constructor() {
    super();
    console.log("AdaptiveHvacPanel: Constructor called.");
  }

  protected firstUpdated() {
    console.log("AdaptiveHvacPanel: firstUpdated called. Hass:", this.hass);
    this._fetchEntries();
  }

  private async _fetchEntries() {
    if (!this.hass) {
      this._error = "Home Assistant object not available.";
      return;
    }

    try {
      const entries = await this.hass.callWS({ type: 'config_entries/get', domain: 'adaptive_hvac' });
      console.log("Fetched config entries:", entries);
      this._entries = entries;
      this._error = undefined;
      this.requestUpdate(); // Force update just in case
    } catch (err: any) {
      console.error("Could not fetch entries:", err);
      this._error = `Error fetching zones: ${err.message || err}`;
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        background-color: var(--primary-background-color);
        height: 100vh;
        overflow: auto;
      }
      .header {
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color, white);
        padding: 16px;
        display: flex;
        align-items: center;
      }
      .header h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 400;
      }
      .content {
        padding: 16px;
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 24px;
      }
      .error-message {
        color: var(--error-color, red);
        padding: 16px;
        background-color: var(--warning-color, yellow);
        border-radius: 4px;
        margin-bottom: 24px;
        grid-column: 1 / -1;
      }
      .zone-card-container {
        /* No margin needed due to grid gap */
      }
      h2 {
        margin-top: 0;
        margin-bottom: 16px;
        font-weight: 500;
      }
      pre.raw-data {
        white-space: pre-wrap;
        word-break: break-all;
        grid-column: 1 / -1;
      }
    `;
  }

  render() {
    console.log("AdaptiveHvacPanel: render called. Entries:", this._entries);
    return html`
      <div class="header">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <h1>Adaptive HVAC Control Center</h1>
      </div>
      <div class="content">

        ${this._error
        ? html`<div class="error-message">${this._error}</div>`
        : this._entries.length === 0
          ? html`<p>No Adaptive HVAC zones found. Please add the integration first.</p>`
          : this._entries.map(entry => html`
                <div class="zone-card-container">
                  <adaptive-hvac-card 
                    .hass=${this.hass} 
                    .config=${{
              zone_id: entry.entry_id,
              title: entry.title
            }}
                  ></adaptive-hvac-card>
                </div>
              `)
      }
      </div>
    `;
  }
}

if (!customElements.get('adaptive-hvac-panel')) {
  customElements.define('adaptive-hvac-panel', AdaptiveHvacPanel);
  console.log("AdaptiveHvacPanel: Custom element defined.");
}

console.log("AdaptiveHvacPanel: End of module execution.");



