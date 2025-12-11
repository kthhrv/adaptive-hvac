import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant } from 'home-assistant-js-websocket';

// Helper to check if we are in a "panel" context or standalone card
// For now, we assume the card handles its own expansion state.

export class AdaptiveHvacCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  
  @state() private _config: any;
  @state() private _zoneId: string | undefined;
  @state() private _zoneData: any = {};
  
  // UI States
  @state() private _viewMode: 'mini' | 'detail' = 'mini';
  @state() private _activeTab: 'status' | 'schedule' | 'overlays' = 'status';
  @state() private _scheduleView: 'weekly' | 'all_zones' = 'weekly'; // 'all_zones' might be out of scope for single card
  @state() private _editingDay: string | null = null;
  @state() private _applyDays: string[] = [];

  // Lovelace API
  public setConfig(config: any): void {
    this.config = config;
  }

  // Property setter for Lit binding
  @property({ attribute: false })
  public set config(config: any) {
    if (!config || !config.zone_id) {
      throw new Error('You need to define a zone_id in your card configuration.');
    }
    this._config = config;
    this._zoneId = config.zone_id;
    if (this.isConnected) {
      this._fetchZoneData();
    }
  }

  public get config() {
    return this._config;
  }

  protected async connectedCallback(): Promise<void> {
    super.connectedCallback();
    if (this.hass && this._zoneId) {
      await this._fetchZoneData();
    }
  }

  private async _fetchZoneData(): Promise<void> {
    if (!this.hass || !this._zoneId) return;
    try {
      const data = await this.hass.callWS({
        type: 'adaptive_hvac/get_zone_data',
        entry_id: this._zoneId,
      });
      this._zoneData = data;
    } catch (err) {
      console.error('Error fetching zone data:', err);
    }
  }

  private async _saveZoneData(newData: any): Promise<void> {
    if (!this.hass || !this._zoneId) return;
    try {
      await this.hass.callWS({
        type: 'adaptive_hvac/update_zone_data',
        entry_id: this._zoneId,
        data: newData,
      });
      this._zoneData = newData; 
    } catch (err) {
      console.error('Error saving zone data:', err);
      await this._fetchZoneData();
    }
  }

  static get styles() {
    return css`
      :host { display: block; width: 100%; position: relative; }
      .card {
          background: var(--ha-card-background, #fff);
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14));
          color: var(--primary-text-color);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
      }

      /* MINI CARD STYLES */
      .zone-mini-card {
          padding: 12px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid transparent;
      }
      .zone-mini-card:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-color: var(--primary-color); }
      
      .mini-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .zone-name { font-weight: bold; font-size: 1.1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80%; }
      .mini-badge { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; }
      .mini-badge.heating { background: rgba(255, 152, 0, 0.15); color: var(--accent-color); }
      .mini-badge.idle { background: var(--secondary-background-color); color: var(--secondary-text-color); }
      
      .mini-body { text-align: center; }
      .temp-display { font-size: 1.5rem; font-weight: 300; margin: 4px 0; }
      .temp-display .target { font-size: 0.9rem; color: var(--secondary-text-color); }
      .next-event { font-size: 0.85rem; color: var(--secondary-text-color); display: flex; align-items: center; justify-content: center; gap: 4px; }

      /* DETAIL HEADER */
      .header { padding: 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--divider-color); }
      .nav-cluster { display: flex; align-items: center; gap: 12px; }
      .zone-title { font-size: 1.2rem; font-weight: 500; }
      .nav-btn { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 50%; color: var(--secondary-text-color); display: flex; }
      .nav-btn:hover { background: rgba(0,0,0,0.05); color: var(--primary-color); }
      .badges .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; }
      .badge.heating { background: var(--accent-color); color: white; }
      .badge.idle { background: var(--secondary-background-color); color: var(--secondary-text-color); }

      /* TABS */
      .tabs { display: flex; background: var(--secondary-background-color); }
      .tabs button { flex: 1; background: none; border: none; padding: 12px; cursor: pointer; font-weight: 500; color: var(--secondary-text-color); border-bottom: 3px solid transparent; transition: 0.2s; }
      .tabs button.active { color: var(--primary-color); border-bottom-color: var(--primary-color); background: rgba(255,255,255,0.5); }

      .content-area { padding: 24px; min-height: 300px; }

      /* STATUS TAB */
      .thermostat-visual { display: flex; justify-content: center; margin-bottom: 32px; }
      .ring { width: 150px; height: 150px; border-radius: 50%; border: 8px solid var(--divider-color); display: flex; flex-direction: column; justify-content: center; align-items: center; }
      .ring.heating { border-color: var(--accent-color); }
      .ring .current { font-size: 3rem; font-weight: 300; }
      .ring .target { font-size: 0.9rem; color: var(--secondary-text-color); }
      
      /* ICONS */
      ha-icon { --mdc-icon-size: 20px; }

      .schedule-grid { margin-bottom: 16px; }
      .day-row { display: flex; align-items: center; gap: 12px; padding: 4px 8px; border-radius: 6px; transition: background 0.2s; }
      .day-row.hoverable:hover { background: var(--secondary-background-color); cursor: pointer; }
      .day-label { width: 40px; font-weight: bold; font-size: 0.9rem; color: var(--secondary-text-color); text-align: right;}
      .timeline { flex: 1; height: 24px; background: #eee; border-radius: 4px; overflow: hidden; display: flex; }
      .slot.day { background: var(--accent-color); opacity: 0.8; }
      .slot.night { background: var(--primary-color); opacity: 0.2; }
      .hint-text { text-align: center; color: var(--secondary-text-color); font-size: 0.8rem; margin-bottom: 12px; opacity: 0.7; }
      
      .legend { margin-top: 16px; display: flex; gap: 16px; font-size: 0.9rem; justify-content: center; }
      .legend .dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 4px; }
      .legend .dot.day { background: var(--accent-color); opacity: 0.8; }
      .legend .dot.night { background: var(--primary-color); opacity: 0.2; }
    `;
  }

  render() {
    if (!this._zoneId) return html`<ha-card>No Zone ID</ha-card>`;

    return html`
      <div class="card">
        ${this._viewMode === 'mini' ? this._renderMini() : this._renderDetail()}
      </div>
    `;
  }

  private _renderMini() {
    // TODO: Get real state (heating/idle) and current temp from entities
    const isHeating = this._zoneData.active; // Placeholder logic
    const currentTemp = 20.5; // Placeholder
    const targetTemp = 21.0; // Placeholder

    return html`
        <div class="zone-mini-card" @click="${() => this._viewMode = 'detail'}">
            <div class="mini-header">
                <span class="zone-name">${this._config.title || 'Zone ' + this._zoneId}</span>
                ${isHeating 
                    ? html`<span class="mini-badge heating"><ha-icon icon="mdi:fire"></ha-icon></span>` 
                    : html`<span class="mini-badge idle"><ha-icon icon="mdi:power-sleep"></ha-icon></span>`
                }
            </div>
            <div class="mini-body">
                <div class="temp-display">
                    <span class="current">${currentTemp}°</span>
                    <span class="target">/ ${targetTemp}°</span>
                </div>
                <div class="next-event">
                    <ha-icon icon="mdi:clock-outline" style="--mdc-icon-size: 16px;"></ha-icon> 22:00 -> 18°C
                </div>
            </div>
        </div>
    `;
  }

  private _renderDetail() {
    const isHeating = this._zoneData.active; 

    return html`
        <div class="header">
            <div class="nav-cluster">
                <button class="nav-btn" @click="${() => this._viewMode = 'mini'}">
                    <ha-icon icon="mdi:arrow-left"></ha-icon>
                </button>
                <div class="zone-title">
                    ${this._config.title || 'Zone ' + this._zoneId}
                </div>
            </div>
            <div class="badges">
                ${isHeating ? html`<span class="badge heating">Heating</span>` : html`<span class="badge idle">Idle</span>`}
            </div>
        </div>

        <div class="tabs">
            <button class="${this._activeTab === 'status' ? 'active' : ''}" @click="${() => this._activeTab = 'status'}">
                Status
            </button>
            <button class="${this._activeTab === 'schedule' ? 'active' : ''}" @click="${() => this._activeTab = 'schedule'}">
                Schedule
            </button>
            <button class="${this._activeTab === 'overlays' ? 'active' : ''}" @click="${() => this._activeTab = 'overlays'}">
                Overlays
            </button>
        </div>

        <div class="content-area">
            ${this._renderContent()}
        </div>
    `;
  }

  private _renderContent() {
    switch(this._activeTab) {
        case 'status': return this._renderStatus();
        case 'schedule': return this._renderSchedule();
        case 'overlays': return html`<p>Overlay View (Coming Soon)</p>`; 
    }
  }

  private _timeToPercent(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / 1440) * 100;
  }

  private _computeVisualSchedule() {
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    // Default: 100% Eco (night)
    const schedule: any = {};
    days.forEach(d => schedule[d] = [{ start: 0, w: 100, type: 'night' }]);

    // Backend profiles are list of rules. 
    // Simplified visualization: Just show the rules as "day" blocks on top of a "night" background?
    // Or simpler: Build a timeline.
    
    // Let's iterate days and build slots.
    // 1. Create a 1440-minute array for each day, fill with 0 (Eco).
    // 2. Mark 1 (Comfort) for rule ranges.
    // 3. Compress into slots.
    
    const dayMaps: {[key: string]: number[]} = {};
    days.forEach(d => {
        dayMaps[d] = new Array(1440).fill(0); // 0 = Eco
    });

    const profiles = this._zoneData.week_profile || [];
    profiles.forEach((rule: any) => {
        const [startH, startM] = rule.start.split(':').map(Number);
        const [endH, endM] = rule.end.split(':').map(Number);
        const startMin = startH * 60 + startM;
        const endMin = endH * 60 + endM;
        
        rule.days.forEach((d: string) => {
            if (dayMaps[d]) {
                for (let i = startMin; i < endMin; i++) {
                    dayMaps[d][i] = 1; // 1 = Comfort
                }
            }
        });
    });

    // Compress to slots
    const visualSchedule = days.map(d => {
        const slots = [];
        let currentType = dayMaps[d][0] === 1 ? 'day' : 'night';
        let currentStart = 0;
        
        for (let i = 1; i < 1440; i++) {
            const type = dayMaps[d][i] === 1 ? 'day' : 'night';
            if (type !== currentType) {
                // End of slot
                slots.push({
                    start: (currentStart / 1440) * 100,
                    w: ((i - currentStart) / 1440) * 100,
                    type: currentType
                });
                currentType = type;
                currentStart = i;
            }
        }
        // Last slot
        slots.push({
            start: (currentStart / 1440) * 100,
            w: ((1440 - currentStart) / 1440) * 100,
            type: currentType
        });
        
        return { day: d.charAt(0).toUpperCase() + d.slice(1), slots };
    });

    return visualSchedule;
  }

  private _renderSchedule() {
    const visualSchedule = this._computeVisualSchedule();

    return html`
        <div class="schedule-grid">
            <div class="hint-text"><ha-icon icon="mdi:gesture-tap" style="--mdc-icon-size: 16px;"></ha-icon> Read-Only View (Editing Coming Soon)</div>
            ${visualSchedule.map((d: any) => html`
                <div class="day-row hoverable">
                    <div class="day-label">${d.day}</div>
                    <div class="timeline">
                        ${d.slots.map((s: any) => html`
                            <div class="slot ${s.type}" style="width: ${s.w}%"></div>
                        `)}
                    </div>
                </div>
            `)}
        </div>
        <div class="legend">
            <span class="dot day"></span> Comfort
            <span class="dot night"></span> Eco
        </div>
    `;
  }

  private _renderStatus() {
    // Placeholders
    const currentTemp = 20.5;
    const targetTemp = 21.0;
    const isHeating = this._zoneData.active;

    return html`
        <div class="thermostat-visual">
            <div class="ring ${isHeating ? 'heating' : ''}">
                <div class="current">${currentTemp}°</div>
                <div class="target">Target: ${targetTemp}°</div>
            </div>
        </div>
        <div>
            <h3>Logic Trace</h3>
            <p>Trace data visualization coming here...</p>
        </div>
    `;
  }
}

if (!customElements.get('adaptive-hvac-card')) {
  customElements.define('adaptive-hvac-card', AdaptiveHvacCard);
}

declare global {
  interface HTMLElementTagNameMap {
    "adaptive-hvac-card": AdaptiveHvacCard;
  }
}
