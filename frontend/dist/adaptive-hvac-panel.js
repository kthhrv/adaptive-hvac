import { r as c, i as p, a as h, x as o, n as i } from "./adaptive-hvac-card-DVI2USjv.mjs";
var v = Object.defineProperty, a = (n, e, d, g) => {
  for (var r = void 0, s = n.length - 1, l; s >= 0; s--)
    (l = n[s]) && (r = l(e, d, r) || r);
  return r && v(e, d, r), r;
};
console.log("AdaptiveHvacPanel: Module Loaded! Top-level execution.");
class t extends p {
  constructor() {
    super(), this._entries = [], console.log("AdaptiveHvacPanel: Constructor called.");
  }
  firstUpdated() {
    console.log("AdaptiveHvacPanel: firstUpdated called. Hass:", this.hass), this._fetchEntries();
  }
  async _fetchEntries() {
    if (!this.hass) {
      this._error = "Home Assistant object not available.";
      return;
    }
    try {
      const e = await this.hass.callWS({ type: "config_entries/get", domain: "adaptive_hvac" });
      console.log("Fetched config entries:", e), this._entries = e, this._error = void 0, this.requestUpdate();
    } catch (e) {
      console.error("Could not fetch entries:", e), this._error = `Error fetching zones: ${e.message || e}`;
    }
  }
  static get styles() {
    return h`
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
    return console.log("AdaptiveHvacPanel: render called. Entries:", this._entries), o`
      <div class="header">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <h1>Adaptive HVAC Control Center</h1>
      </div>
      <div class="content">

        ${this._error ? o`<div class="error-message">${this._error}</div>` : this._entries.length === 0 ? o`<p>No Adaptive HVAC zones found. Please add the integration first.</p>` : this._entries.map((e) => o`
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
    `;
  }
}
a([
  i({ attribute: !1 })
], t.prototype, "hass");
a([
  i({ type: Boolean })
], t.prototype, "narrow");
a([
  i({ attribute: !1 })
], t.prototype, "route");
a([
  i({ attribute: !1 })
], t.prototype, "panel");
a([
  c()
], t.prototype, "_entries");
a([
  c()
], t.prototype, "_error");
customElements.get("adaptive-hvac-panel") || (customElements.define("adaptive-hvac-panel", t), console.log("AdaptiveHvacPanel: Custom element defined."));
console.log("AdaptiveHvacPanel: End of module execution.");
export {
  t as AdaptiveHvacPanel
};
