import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import { HomeAssistant } from './types';

// Helper to check if we are in a "panel" context or standalone card
// For now, we assume the card handles its own expansion state.

interface ZoneData {
  active?: boolean;
  week_profile?: any[];
  overlays?: any[];
  current_temp?: number | null;
  target_temp?: number | null;
  hvac_action?: string | null;
  hvac_mode?: string | null;
  override_end?: string | null;
}

export class AdaptiveHvacCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config: any;
  @state() private _zoneId: string | undefined;
  @state() private _zoneData: ZoneData = {};

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

  public connectedCallback() {
    super.connectedCallback();
    this._fetchZoneData();
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
          /* ha-card handles background, border, shadow */
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
      
      input[type="time"] { font-family: inherit; font-size: 0.9rem; color: var(--primary-text-color); background: var(--secondary-background-color); }
    `;
  }

  render() {
    if (!this._zoneId) return html`<ha-card>No Zone ID</ha-card>`;

    return html`
      <ha-card class="card">
        ${this._viewMode === 'mini' ? this._renderMini() : this._renderDetail()}
      </ha-card>
    `;
  }

  private _renderMini() {
    const isHeating = this._zoneData.hvac_action === 'heating';
    const currentTemp = this._zoneData.current_temp ?? '--';
    const targetTemp = this._zoneData.target_temp ?? '--';

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
            <button id="tab-status" class="${this._activeTab === 'status' ? 'active' : ''}" @click="${() => this._activeTab = 'status'}">
                Status
            </button>
            <button id="tab-schedule" class="${this._activeTab === 'schedule' ? 'active' : ''}" @click="${() => this._activeTab = 'schedule'}">
                Schedule
            </button>
            <button id="tab-overlays" class="${this._activeTab === 'overlays' ? 'active' : ''}" @click="${() => this._activeTab = 'overlays'}">
                Overlays
            </button>
        </div>

        <div class="content-area">
            ${this._renderContent()}
        </div>
    `;
  }

  private _renderContent() {
    switch (this._activeTab) {
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

    const dayMaps: { [key: string]: number[] } = {};
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
            <div class="hint-text"><ha-icon icon="mdi:gesture-tap" style="--mdc-icon-size: 16px;"></ha-icon> Tap a day to edit the schedule</div>
            ${visualSchedule.map((d: any) => html`
                <div class="day-row hoverable" @click="${() => this._openEditor(d.day)}" data-testid="day-row-${d.day.toLowerCase()}">
                    <div class="day-label">${d.day}</div>
                    <div class="timeline">
                        ${d.slots.map((s: any) => html`
                            <div class="slot ${s.type}" style="width: ${s.w}%"></div>
                        `)}
                    </div>
                    <ha-icon icon="mdi:pencil" style="--mdc-icon-size: 16px; color: var(--secondary-text-color); margin-left: 8px;"></ha-icon>
                </div>
            `)}
        </div>
        <div class="legend">
            <span class="dot day"></span> Comfort
            <span class="dot night"></span> Eco
        </div>
        
        ${this._editingDay ? this._renderEditor() : ''}
    `;
  }

  @state() private _tempRules: any[] = [];

  private _openEditor(visualDay: string) {
    this._editingDay = visualDay;
    const shortDay = visualDay.substring(0, 3).toLowerCase();

    // Filter generic week profile for this day
    const existingRules = (this._zoneData.week_profile || [])
      .filter((r: any) => r.days.includes(shortDay))
      .map((r: any) => ({ ...r, days: [shortDay] })); // Clone and isolate day

    this._tempRules = JSON.parse(JSON.stringify(existingRules));
  }

  private _closeEditor() {
    this._editingDay = null;
    this._tempRules = [];
  }

  private _addRule() {
    this._tempRules = [...this._tempRules, { start: "09:00", end: "17:00", days: [this._editingDay!.substring(0, 3).toLowerCase()] }];
  }

  private _removeRule(index: number) {
    this._tempRules = this._tempRules.filter((_, i) => i !== index);
  }

  private _updateRule(index: number, field: string, value: string) {
    const newRules = [...this._tempRules];
    newRules[index] = { ...newRules[index], [field]: value };
    this._tempRules = newRules;
  }

  private async _saveSchedule() {
    if (!this._editingDay) return;

    const shortDay = this._editingDay.substring(0, 3).toLowerCase();

    // 1. Get all OTHER rules not for this day
    const otherDayRules = (this._zoneData.week_profile || []).filter((r: any) => !r.days.includes(shortDay));

    // 2. If a rule in "other" had multiple days including this one, we implicitly split it above. 
    //    Wait, simpler strategy:
    //    We need to fully reconstruct the profile. The backend expects a list of generic rules.
    //    For this MVP editor, we act as if we are editing "This Day Only" rules.
    //    So we remove THIS day from any shared rules, and then append our new rules for THIS day.

    let newProfile: any[] = [];

    // Keep existing rules, removing 'shortDay' from them
    (this._zoneData.week_profile || []).forEach((r: any) => {
      const days = r.days.filter((d: string) => d !== shortDay);
      if (days.length > 0) {
        newProfile.push({ ...r, days });
      }
    });

    // Add new rules
    this._tempRules.forEach(r => {
      newProfile.push({ ...r, days: [shortDay] });
    });

    // Optimization: (Optional) Merge identical rules back together? 
    // For now, let's keep it simple. Explicit per-day rules are fine.

    await this._saveZoneData({ ...this._zoneData, week_profile: newProfile });
    this._closeEditor();
  }

  private _renderEditor() {
    return html`
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 100; display: flex; align-items: center; justify-content: center;">
            <div style="background: var(--card-background-color, white); padding: 24px; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
                <h3 style="margin-top: 0;">Edit ${this._editingDay}</h3>
                <p>Define "Comfort" periods. Rest is Eco.</p>
                
                <div style="max-height: 200px; overflow-y: auto; margin-bottom: 16px;">
                    ${this._tempRules.length === 0 ? html`<div style="text-align: center; padding: 20px; color: var(--secondary-text-color);">No Comfort Blocks (All Day Eco)</div>` : ''}
                    
                    ${this._tempRules.map((rule, idx) => html`
                        <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;" data-testid="rule-row-${idx}">
                            <input type="time" .value="${rule.start}" @change="${(e: any) => this._updateRule(idx, 'start', e.target.value)}" style="padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color);" data-testid="input-start-${idx}">
                            <span>to</span>
                            <input type="time" .value="${rule.end}" @change="${(e: any) => this._updateRule(idx, 'end', e.target.value)}" style="padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color);" data-testid="input-end-${idx}">
                            <ha-icon icon="mdi:delete" @click="${() => this._removeRule(idx)}" style="cursor: pointer; color: var(--error-color, red);" data-testid="btn-delete-${idx}"></ha-icon>
                        </div>
                    `)}
                </div>
                
                <div style="display: flex; justify-content: space-between; gap: 8px;">
                    <button id="btn-add-rule" @click="${this._addRule}" style="flex: 1; padding: 12px; background: var(--accent-color); color: white; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
                        <ha-icon icon="mdi:plus"></ha-icon> Add Block
                    </button>
                </div>
                
                <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; border-top: 1px solid var(--divider-color); padding-top: 16px;">
                    <button id="btn-cancel-editor" @click="${this._closeEditor}" style="padding: 8px 16px; background: none; border: 1px solid var(--divider-color); border-radius: 4px; cursor: pointer;">Cancel</button>
                    <button id="btn-save-schedule" @click="${this._saveSchedule}" style="padding: 8px 16px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Save</button>
                </div>
            </div>
        </div>
      `;
  }

  private _renderStatus() {
    const currentTemp = this._zoneData.current_temp ?? '--';
    const targetTemp = this._zoneData.target_temp ?? '--';
    const isHeating = this._zoneData.hvac_action === 'heating';

    return html`
        <div class="thermostat-visual">
            <div class="ring ${isHeating ? 'heating' : ''}">
                <div class="current">${currentTemp}°</div>
                <div class="target">Target: ${targetTemp}°</div>
            </div>
        </div>
        ${this._renderOverrideStatus()}
        <div>
            <h3>Logic Trace</h3>
            <p>HVAC Mode: ${this._zoneData.hvac_mode ?? 'Unknown'}</p>
            <p>Action: ${this._zoneData.hvac_action ?? 'Idle'}</p>
        </div>
    `;
  }

  private _renderOverrideStatus() {
    if (!this._zoneData.override_end) return html``;

    const endTime = new Date(this._zoneData.override_end);
    const timeStr = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return html`
      <div style="background: var(--warning-color, #ff9800); color: black; padding: 8px; border-radius: 8px; margin-top: 10px; text-align: center; font-weight: bold;">
        <ha-icon icon="mdi:clock-alert-outline"></ha-icon>
        Manual Override (Ends ${timeStr})
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
