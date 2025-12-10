import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('adaptive-hvac-card')
export class AdaptiveHvacCard extends LitElement {
  @property() hass: any;
  @property() config: any;

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        border: 1px solid var(--primary-text-color);
        border-radius: var(--ha-card-border-radius, 12px);
      }
    `;
  }

  render() {
    return html`
      <div>
        <h2>Adaptive HVAC</h2>
        <p>Frontend initialized.</p>
      </div>
    `;
  }

  setConfig(config: any) {
    this.config = config;
  }

  getCardSize() {
    return 3;
  }
}
