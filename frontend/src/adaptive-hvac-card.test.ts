import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AdaptiveHvacCard } from './adaptive-hvac-card';
import './adaptive-hvac-card'; // Register custom element

describe('AdaptiveHvacCard', () => {
    let element: AdaptiveHvacCard;

    beforeEach(() => {
        // Stub ha-entity-picker if not defined
        if (!customElements.get('ha-entity-picker')) {
            class HaEntityPicker extends HTMLElement {
                set hass(val: any) { }
                set value(val: any) { }
            }
            customElements.define('ha-entity-picker', HaEntityPicker);
        }

        element = document.createElement('adaptive-hvac-card') as AdaptiveHvacCard;
        // Mock config
        element.config = { zone_id: 'test_zone', title: 'Test Zone', entry_id: 'test_zone' };
        // Mock hass
        element.hass = {
            states: {
                'climate.test_zone': {
                    state: 'heat',
                    attributes: { temperature: 20, current_temperature: 19 }
                }
            },
            callWS: async () => ({
                active: true,
                week_profile: [],
                overlays: []
            })
        } as any;
        document.body.appendChild(element);
    });

    afterEach(() => {
        document.body.removeChild(element);
    });

    it('renders with correct title', async () => {
        await element.updateComplete;
        const card = element.shadowRoot?.querySelector('ha-card');
        expect(card).toBeTruthy();

        // Check mini view (default)
        const name = element.shadowRoot?.querySelector('.zone-name');
        expect(name?.textContent).toContain('Test Zone');
    });

    it('displays temperature from zone data', async () => {
        // Trigger data load simulation
        // The element calls _fetchZoneData on connect. 
        // We mocked callWS to return empty data.
        // Let's manually set _zoneData to verify rendering
        (element as any)._zoneData = {
            active: true,
            current_temp: 22.5,
            target_temp: 23,
            hvac_action: 'heating',
            overlays: []
        };
        element.requestUpdate();
        await element.updateComplete;

        const current = element.shadowRoot?.querySelector('.current');
        const target = element.shadowRoot?.querySelector('.target');

        expect(current?.textContent).toContain('22.5');
        expect(target?.textContent).toContain('23');
    });

    it('toggles detail view on click', async () => {
        await element.updateComplete;

        // Initially Mini
        let detail = element.shadowRoot?.querySelector('.header');
        expect(detail).toBeNull();

        // Click
        const miniCard = element.shadowRoot?.querySelector('.zone-mini-card') as HTMLElement;
        miniCard.click();
        await element.updateComplete;

        // Now Detail
        detail = element.shadowRoot?.querySelector('.header');
        expect(detail).toBeTruthy();
    });

    it('sends update_zone_data when saving a new overlay', async () => {
        // Mock hass spy
        const callWSSpy = vi.fn().mockResolvedValue({});
        element.hass = { ...element.hass, callWS: callWSSpy } as any;

        // Force to detail view and overlays tab
        (element as any)._viewMode = 'detail';
        (element as any)._activeTab = 'overlays';
        element.requestUpdate();
        await element.updateComplete;

        // Click Add Overlay
        const addBtn = element.shadowRoot?.querySelector('#btn-add-overlay') as HTMLElement;
        expect(addBtn).toBeTruthy();
        addBtn.click();
        await element.updateComplete;

        // Verify Save is Disabled initially
        const saveBtn = element.shadowRoot?.querySelector('#btn-save-overlay') as HTMLButtonElement;
        expect(saveBtn.disabled).toBe(true);

        // Find inputs
        const nameInput = element.shadowRoot?.querySelector('input[type="text"]') as HTMLInputElement;
        const entityPicker = element.shadowRoot?.querySelector('ha-entity-picker') as HTMLElement;

        expect(nameInput).toBeTruthy();
        expect(entityPicker).toBeTruthy();

        // Change Name
        nameInput.value = 'New Test Rule';
        nameInput.dispatchEvent(new Event('input'));
        await element.updateComplete;

        // Still disabled (no entity)
        expect(saveBtn.disabled).toBe(true);

        // Select Entity via custom event
        entityPicker.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: 'binary_sensor.door' }
        }));
        await element.updateComplete;

        // Now Enabled
        expect(saveBtn.disabled).toBe(false);

        // Save
        saveBtn.click();

        expect(callWSSpy).toHaveBeenCalledWith(expect.objectContaining({
            type: 'adaptive_hvac/update_zone_data',
            data: expect.objectContaining({
                overlays: expect.arrayContaining([
                    expect.objectContaining({
                        name: 'New Test Rule',
                        trigger_entity: 'binary_sensor.door'
                    })
                ])
            })
        }));
    });

    it('sends update_zone_data when deleting an overlay', async () => {
        // Setup existing overlay
        (element as any)._zoneData = {
            active: true,
            overlays: [{ name: 'To Delete', trigger_entity: 'binary_sensor.x', trigger_state: 'on', type: 'absolute', action: {} }]
        };
        (element as any)._viewMode = 'detail';
        (element as any)._activeTab = 'overlays';

        // Mock confirm
        global.confirm = vi.fn(() => true);

        // Mock spy
        const callWSSpy = vi.fn().mockResolvedValue({});
        element.hass = { ...element.hass, callWS: callWSSpy } as any;

        element.requestUpdate();
        await element.updateComplete;

        // Find delete button
        const delBtn = element.shadowRoot?.querySelector('#delete-overlay-0') as HTMLElement;
        expect(delBtn).toBeTruthy();

        delBtn.click();

        expect(global.confirm).toHaveBeenCalled();
        expect(callWSSpy).toHaveBeenCalledWith(expect.objectContaining({
            type: 'adaptive_hvac/update_zone_data',
            data: { overlays: [] } // Empty array means it was deleted
        }));
    });
    it('sends clear_manual_override when clicking status bar', async () => {
        // Mock hass spy
        const callWSSpy = vi.fn().mockResolvedValue({});
        element.hass = { ...element.hass, callWS: callWSSpy } as any;

        // Force to status view and set override_end
        (element as any)._viewMode = 'detail';
        (element as any)._activeTab = 'status';
        (element as any)._zoneId = 'test_zone';
        (element as any)._zoneData = {
            ...element.hass.states['climate.test_zone'].attributes,
            override_end: new Date(Date.now() + 100000).toISOString()
        };

        element.requestUpdate();
        await element.updateComplete;

        // Find status bar using data-testid
        const statusBar = element.shadowRoot?.querySelector('[data-testid="status-bar-override"]');

        expect(statusBar).toBeTruthy();
        (statusBar as HTMLElement).click();

        expect(callWSSpy).toHaveBeenCalledWith(expect.objectContaining({
            type: 'adaptive_hvac/clear_manual_override',
            entry_id: 'test_zone'
        }));
    });
});
