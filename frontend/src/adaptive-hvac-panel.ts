import { LitElement, html, css, PropertyValues } from 'lit';
import { property, state, query } from 'lit/decorators.js';
// import { HomeAssistant } from 'home-assistant-js-websocket'; // Type not exported
import './adaptive-hvac-card';


console.log("AdaptiveHvacPanel: Module Loaded! Top-level execution.");

export class AdaptiveHvacPanel extends LitElement {
  @property({ attribute: false }) public hass!: any;
  @property({ type: Boolean }) public narrow!: boolean;
  @property({ attribute: false }) public route!: any;
  @property({ attribute: false }) public panel!: any;

  @state() private _entries: any[] = [];
  @state() private _climateEntities: string[] = [];
  @state() private _error: string | undefined;

  @query('#history-graph-container')
  private _graphContainer?: HTMLDivElement;

  private _cardHelpers?: any;
  private _historyCard?: HTMLElement;

  constructor() {
    super();
    console.log("AdaptiveHvacPanel: Constructor called.");
  }

  protected async firstUpdated() {
    console.log("AdaptiveHvacPanel: firstUpdated called. Hass:", this.hass);
    await this._loadHelpers();
    this._fetchEntries();
  }

  protected updated(changedProps: PropertyValues) {
    if (changedProps.has('_climateEntities') && this._climateEntities.length > 0) {
      this._updateGraph();
    }

    // Pass hass to the card if it exists
    if (this._historyCard && this.hass) {
      (this._historyCard as any).hass = this.hass;
    }
  }

  private async _loadHelpers() {
    if ((window as any).loadCardHelpers) {
      console.log("AdaptiveHvacPanel: loadCardHelpers found on window.");
      this._cardHelpers = await (window as any).loadCardHelpers();
    } else {
      console.error("AdaptiveHvacPanel: loadCardHelpers NOT found on window.");
    }
  }

  private async _fetchEntries() {
    if (!this.hass) {
      this._error = "Home Assistant object not available.";
      return;
    }

    try {
      const entries = await this.hass.callWS({ type: 'config_entries/get', domain: 'adaptive_hvac' });
      console.log("AdaptiveHvacPanel: Fetched config entries:", entries);

      // Resolve climate entities
      const promises = entries.map((entry: any) =>
        this.hass.callWS({ type: 'adaptive_hvac/get_zone_data', entry_id: entry.entry_id })
          .then((data: any) => data.climate_entity_id)
          .catch((e: any) => {
            console.error(`Failed to fetch details for ${entry.entry_id}`, e);
            return null;
          })
      );

      const climates = (await Promise.all(promises)).filter(Boolean);
      console.log("AdaptiveHvacPanel: Resolved climate entities:", climates);

      this._entries = entries;
      this._climateEntities = climates;
      this._error = undefined;
    } catch (err: any) {
      console.error("AdaptiveHvacPanel: Could not fetch entries:", err);
      this._error = `Error fetching zones: ${err.message || err}`;
    }
  }

  private async _updateGraph() {
    console.log("AdaptiveHvacPanel: _updateGraph called.");
    console.log("AdaptiveHvacPanel: State - Container:", !!this._graphContainer, "Helpers:", !!this._cardHelpers, "Entries:", this._entries.length, "ClimateEntities:", this._climateEntities.length);

    if (!this._graphContainer || !this._cardHelpers || !this._climateEntities.length) {
      console.warn("AdaptiveHvacPanel: _updateGraph prerequisites not met.");
      return;
    }
    if (this._historyCard) {
      console.log("AdaptiveHvacPanel: Graph already created.");
      return;
    }

    const entityIds = this._climateEntities;

    console.log("AdaptiveHvacPanel: Graph Entity IDs:", entityIds);

    if (entityIds.length === 0) {
      console.warn("AdaptiveHvacPanel: No entity IDs found for graph.");
      return;
    }

    const config = {
      type: 'history-graph',
      entities: entityIds.map((eid: string) => ({ entity: eid })),
      hours_to_show: 24,
      refresh_interval: 60
    };

    try {
      console.log("AdaptiveHvacPanel: Creating card element with config:", config);
      this._historyCard = await this._cardHelpers.createCardElement(config);
      if (this._historyCard) {
        console.log("AdaptiveHvacPanel: Card created successfully. Appending to DOM.");
        (this._historyCard as any).hass = this.hass;
        this._graphContainer.appendChild(this._historyCard);
      } else {
        console.error("AdaptiveHvacPanel: createCardElement returned null/undefined.");
      }
    } catch (e) {
      console.error("AdaptiveHvacPanel: Failed to create history-graph card:", e);
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
        margin-left: 16px;
      }
      .content {
        padding: 16px;
        max-width: 1200px;
        margin: 0 auto;
      }
      .chart-container {
        margin-bottom: 24px;
        min-height: 200px;
        display: block;
      }
      .grid {
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
      }
      h2 {
        margin-top: 0;
        margin-bottom: 16px;
        font-weight: 500;
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

        ${this._error ? html`<div class="error-message">${this._error}</div>` : ''}

        ${this._entries.length > 0 ? html`
            <div class="chart-container" id="history-graph-container"></div>
        ` : ''}

        ${this._entries.length === 0 && !this._error
        ? html`<p>No Adaptive HVAC zones found. Please add the integration first.</p>`
        : html`
            <div class="grid">
                ${this._entries.map(entry => html`
                    <div class="zone-card-container">
                    <adaptive-hvac-card 
                        .hass=${this.hass} 
                        .config=${{
            zone_id: entry.entry_id,
            title: entry.title
          }}
                    ></adaptive-hvac-card>
                    </div>
                `)}
            </div>
          `
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



