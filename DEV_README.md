# Adaptive HVAC - Development Guide

This guide explains how to set up and run the development environment for the **Adaptive HVAC** Home Assistant integration and its custom frontend panel.

## Prerequisites

*   **uv**: Python package manager (`pip install uv` or `curl -LsSf https://astral.sh/uv/install.sh | sh`)
*   **Node.js & npm**: For frontend development.

## 1. Backend Development (Home Assistant)

We use `uv` to manage the Python environment and run Home Assistant.

### Setup & Run

1.  **Initialize/Update Environment**:
    ```bash
    uv sync
    ```

2.  **Run Home Assistant**:
    This command starts HA using the configuration in `.dev_config`.
    ```bash
    uv run hass -c .dev_config
    ```
    *   Access HA at: `http://localhost:8123`
    *   Default User/Pass: (Create one on first launch)

### Directory Structure
*   `custom_components/adaptive_hvac/`: The Python backend logic.
*   `.dev_config/`: Configuration directory for the dev HA instance.
    *   `configuration.yaml`: Defines dummy entities (`fake_heater`, `climate.study`).
    *   `www/`: Symlinked frontend assets (see below).

## 2. Frontend Development (Panel & Card)

The frontend is a Lit-based application built with Vite. It supports Hot Module Replacement (HMR) for rapid development.

### Setup

1.  **Install Dependencies**:
    ```bash
    cd frontend
    npm install
    ```

### Development Mode (HMR) - *Recommended*

This allows you to see changes instantly without restarting HA.

1.  **Start Vite Server**:
    ```bash
    cd frontend
    npm run dev
    ```
    *   Runs on: `http://localhost:5173`

2.  **Ensure HA loads from Vite** (and keep HA running):
    *   `custom_components/adaptive_hvac/__init__.py` **MUST** point `module_url` to the dev server.
    *   **Current setting (Development):**
        ```python
        module_url="http://localhost:5173/src/adaptive-hvac-panel.ts",
        ```
    *   If you change `__init__.py` to point to the production build, you will need to restart HA once to pick up the new path.

### Production Build

To build the static assets for deployment or final testing:

1.  **Build**:
    ```bash
    cd frontend
    npm run build
    ```
    *   Output: `frontend/dist/`

2.  **Deploy to HA**:
    Copy the built files to the `www` folder served by HA.
    ```bash
    cp -r frontend/dist/* .dev_config/www/
    ```

3.  **Update HA Config**:
    *   `custom_components/adaptive_hvac/__init__.py` **MUST** point `module_url` to the local static file.
    *   **Example setting (Production):**
        ```python
        module_url="/local/adaptive-hvac-panel.js?v=4", # Increment v=X on each release/change
        ```
    *   Restart HA after changing `__init__.py` to pick up the new `module_url`.

## 3. Architecture

*   **Panel**: `adaptive-hvac-panel.ts`
    *   Registered via `panel_custom.async_register_panel`.
    *   Fetches all `adaptive_hvac` config entries via WebSocket.
    *   Renders a grid of `adaptive-hvac-card` components.
*   **Card**: `adaptive-hvac-card.ts`
    *   Receives `zone_id` and `title`.
    *   Fetches specific zone data (`week_profile`, `overlays`) via `adaptive_hvac/get_zone_data`.
    *   Supports "Mini" (Dashboard) and "Detail" (Editor) views.

## 4. Troubleshooting

*   **Blank Panel**: Check Browser Console (F12).
    *   If `404` for `.js` files: Check `.dev_config/www/` contents or `module_url`.
    *   If `Uncaught SyntaxError`: Ensure file is loaded as module (Vite handles this).
*   **"No zones found"**: Ensure integration is added in HA Settings.
*   **Changes not showing**: Browser cache.
    *   Dev Mode: Check Vite terminal for errors.
    *   Prod Mode: Bump `v=X` in `module_url` or Disable Cache in DevTools.
