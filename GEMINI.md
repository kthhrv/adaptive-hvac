# GEMINI.md - Project Context & Architecture

## Project Identity
**Project Name:** Adaptive HVAC (Native HA Integration)
**Type:** Home Assistant Custom Component (Integration + Frontend)
**Goal:** Build the "Gold Standard" HVAC scheduling engine for Home Assistant. It replaces external tools like Schedy with a performant, event-driven Python integration and a native Lit-based frontend.
**Unique Value:** Unlike standard schedulers, this engine runs a **Continuous Re-evaluation Loop**. It adapts target temperatures dynamically based on state changes (windows opening, presence detected) rather than just time of day.
**Distibution** Via HACS until it makes home-assistant/core

## Technical Stack
* **Backend:** Python 3.11+ (Standard `custom_component`).
* **Frontend:** TypeScript + [Lit](https://lit.dev/).
* **Configuration:** Standard HA **Config Flow** (UI-based setup).
* **Communication:** WebSocket API (`homeassistant.components.websocket_api`).
* **Storage:** `homeassistant.helpers.storage` (JSON store in `/config/.storage/`).

## Core Architecture
The project follows the "Hybrid Integration" model:

### 1. The Backend (`custom_components/adaptive_hvac`)
* **Lifecycle:** Managed via `async_setup_entry`.
* **Config Flow:** User adds "Adaptive HVAC" integration. Each entry represents a **Zone Manager** (e.g., "Living Room") linked to a `climate.*` entity.
* **Logic Engine (`HvacCoordinator`):**
    * **State Listener:** Subscribes to `async_track_state_change_event` for all "Overlay" entities (Windows, Guests).
    * **Time Listener:** Subscribes to `async_track_time_interval` (1-min heartbeat) for schedule slots.
    * **Re-evaluation Loop:** On *any* trigger, calculates the "Target State" by layering:
        1. Base Schedule (Time-based)
        2. Absolute Overlays (e.g., Window Open -> OFF)
        3. Relative Overlays (e.g., Guest -> +2°C)
* **Actuator:** Calls `climate.set_temperature` ONLY if the calculated target differs from the actual state.

### 2. The Frontend (`adaptive-hvac-card`)
* **Type:** Custom Lovelace Card (JS Module).
* **UX/UI:** Uses `@home-assistant/components` for native look/feel.
* **Data Flow:**
    * **Read:** Subscribes to backend updates via WebSocket.
    * **Write:** Sends schedule/rule edits via `hass.callWS`.

## Data Model (The "Gold Standard")
*Strict separation of Configuration (Setup) and Data (Rules).*

### A. Configuration (Managed by HA Core)
* **Location:** `core.config_entries`.
* **Data:** `{ "entry_id": "...", "data": { "climate_entity": "climate.kitchen", "name": "Kitchen" } }`

### B. Storage (Managed by Integration)
* **Location:** `/config/.storage/adaptive_hvac.json`
* **Structure:**
    ```json
    {
      "zones": {
        "a1b2c3d4": { 
          "active": true,
          "week_profile": [
            { "days": ["mon"], "start": "08:00", "end": "17:00", "target": { "temp": 21 } }
          ],
          "overlays": [
            { 
              "trigger_entity": "binary_sensor.window", 
              "state": "on", 
              "type": "absolute", 
              "action": { "hvac_mode": "off" }, 
              "priority": 10 
            }
          ]
        }
      }
    }
    ```

## Development Constraints
1.  **Async First:** No blocking I/O. Use `async/await` everywhere.
2.  **No YAML:** Configuration must be done via the UI Config Flow.
3.  **Strict Typing:** Full Python type hints and strict TypeScript.
4.  **Linting:** `ruff` (Python) and `eslint` (TS).

## Key Terminology
* **Coordinator:** The central class managing logic for a specific Zone.
* **Re-evaluation:** The process of recalculating the target temperature based on all inputs (Time + Schedule + Overlays).
* **Overlay:** A conditional rule that overrides the base schedule (The "Schedy" logic).
