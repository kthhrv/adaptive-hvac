import { r as h, i as v, a as g, x as l, n as c } from "./adaptive-hvac-card-De56Mz-T.mjs";
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const u = (s, e, t) => (t.configurable = !0, t.enumerable = !0, Reflect.decorate && typeof e != "object" && Object.defineProperty(s, e, t), t);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function _(s, e) {
  return (t, r, a) => {
    const i = (d) => {
      var p;
      return ((p = d.renderRoot) == null ? void 0 : p.querySelector(s)) ?? null;
    };
    return u(t, r, { get() {
      return i(this);
    } });
  };
}
var f = Object.defineProperty, n = (s, e, t, r) => {
  for (var a = void 0, i = s.length - 1, d; i >= 0; i--)
    (d = s[i]) && (a = d(e, t, a) || a);
  return a && f(e, t, a), a;
};
console.log("AdaptiveHvacPanel: Module Loaded! Top-level execution.");
class o extends v {
  constructor() {
    super(), this._entries = [], this._climateEntities = [], console.log("AdaptiveHvacPanel: Constructor called.");
  }
  async firstUpdated() {
    console.log("AdaptiveHvacPanel: firstUpdated called. Hass:", this.hass), await this._loadHelpers(), this._fetchEntries();
  }
  updated(e) {
    e.has("_climateEntities") && this._climateEntities.length > 0 && this._updateGraph(), this._historyCard && this.hass && (this._historyCard.hass = this.hass);
  }
  async _loadHelpers() {
    window.loadCardHelpers ? (console.log("AdaptiveHvacPanel: loadCardHelpers found on window."), this._cardHelpers = await window.loadCardHelpers()) : console.error("AdaptiveHvacPanel: loadCardHelpers NOT found on window.");
  }
  async _fetchEntries() {
    if (!this.hass) {
      this._error = "Home Assistant object not available.";
      return;
    }
    try {
      const e = await this.hass.callWS({ type: "config_entries/get", domain: "adaptive_hvac" });
      console.log("AdaptiveHvacPanel: Fetched config entries:", e);
      const t = e.map(
        (a) => this.hass.callWS({ type: "adaptive_hvac/get_zone_data", entry_id: a.entry_id }).then((i) => i.climate_entity_id).catch((i) => (console.error(`Failed to fetch details for ${a.entry_id}`, i), null))
      ), r = (await Promise.all(t)).filter(Boolean);
      console.log("AdaptiveHvacPanel: Resolved climate entities:", r), this._entries = e, this._climateEntities = r, this._error = void 0;
    } catch (e) {
      console.error("AdaptiveHvacPanel: Could not fetch entries:", e), this._error = `Error fetching zones: ${e.message || e}`;
    }
  }
  async _updateGraph() {
    if (console.log("AdaptiveHvacPanel: _updateGraph called."), console.log("AdaptiveHvacPanel: State - Container:", !!this._graphContainer, "Helpers:", !!this._cardHelpers, "Entries:", this._entries.length, "ClimateEntities:", this._climateEntities.length), !this._graphContainer || !this._cardHelpers || !this._climateEntities.length) {
      console.warn("AdaptiveHvacPanel: _updateGraph prerequisites not met.");
      return;
    }
    if (this._historyCard) {
      console.log("AdaptiveHvacPanel: Graph already created.");
      return;
    }
    const e = this._climateEntities;
    if (console.log("AdaptiveHvacPanel: Graph Entity IDs:", e), e.length === 0) {
      console.warn("AdaptiveHvacPanel: No entity IDs found for graph.");
      return;
    }
    const t = {
      type: "history-graph",
      entities: e.map((r) => ({ entity: r })),
      hours_to_show: 24,
      refresh_interval: 60
    };
    try {
      console.log("AdaptiveHvacPanel: Creating card element with config:", t), this._historyCard = await this._cardHelpers.createCardElement(t), this._historyCard ? (console.log("AdaptiveHvacPanel: Card created successfully. Appending to DOM."), this._historyCard.hass = this.hass, this._graphContainer.appendChild(this._historyCard)) : console.error("AdaptiveHvacPanel: createCardElement returned null/undefined.");
    } catch (r) {
      console.error("AdaptiveHvacPanel: Failed to create history-graph card:", r);
    }
  }
  static get styles() {
    return g`
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
    return console.log("AdaptiveHvacPanel: render called. Entries:", this._entries), l`
      <div class="header">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <h1>Adaptive HVAC Control Center</h1>
      </div>
      <div class="content">

        ${this._error ? l`<div class="error-message">${this._error}</div>` : ""}

        ${this._entries.length > 0 ? l`
            <div class="chart-container" id="history-graph-container"></div>
        ` : ""}

        ${this._entries.length === 0 && !this._error ? l`<p>No Adaptive HVAC zones found. Please add the integration first.</p>` : l`
            <div class="grid">
                ${this._entries.map((e) => l`
                    <div class="zone-card-container">
                    <adaptive-hvac-card 
                        .hass=${this.hass} 
                        .config=${{
      zone_id: e.entry_id,
      title: e.title
    }}
                    ></adaptive-hvac-card>
                    </div>
                `)}
            </div>
          `}
      </div>
    `;
  }
}
n([
  c({ attribute: !1 })
], o.prototype, "hass");
n([
  c({ type: Boolean })
], o.prototype, "narrow");
n([
  c({ attribute: !1 })
], o.prototype, "route");
n([
  c({ attribute: !1 })
], o.prototype, "panel");
n([
  h()
], o.prototype, "_entries");
n([
  h()
], o.prototype, "_climateEntities");
n([
  h()
], o.prototype, "_error");
n([
  _("#history-graph-container")
], o.prototype, "_graphContainer");
customElements.get("adaptive-hvac-panel") || (customElements.define("adaptive-hvac-panel", o), console.log("AdaptiveHvacPanel: Custom element defined."));
console.log("AdaptiveHvacPanel: End of module execution.");
export {
  o as AdaptiveHvacPanel
};
