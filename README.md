# Adaptive HVAC for Home Assistant

**Adaptive HVAC** is a "Gold Standard" climate control engine for Home Assistant. It goes beyond simple scheduling by continuously re-evaluating your home's state—adapting to open windows, presence, and manual overrides in real-time.

![Adaptive HVAC Panel](https://raw.githubusercontent.com/kthhrv/adaptive_hvac/main/assets/banner.png) -> *Note: User should replace this with a real screenshot eventually*

## 🌟 Key Features

*   **🧠 Context-Aware Scheduling**: Define your ideal comfort times, but let the engine decide when to actually heat or cool based on presence, windows, and more.
*   **📉 Integrated 24h History**: See your zone's temperature performance at a glance with the native, built-in history graph.
*   **🛑 Smart Manual Overrides**: Touch your thermostat? We notice. The card immediately reflects "Manual Mode" and pauses automation for a set duration.
*   **⚡ Instant Updates**: Built on a high-performance, event-driven architecture using Home Assistant's native WebSocket API.

## 📦 Installation

### Via HACS (Recommended)
1.  Open HACS in Home Assistant.
2.  Go to **Integrations** > **3 Dots** (Top Right) > **Custom Repositories**.
3.  Paste the URL of this repository.
4.  Select **Integration** as the category.
5.  Click **Add**, then find **Adaptive HVAC** in the list and install.
6.  **Restart Home Assistant**.

### Manual Installation
1.  Copy the `custom_components/adaptive_hvac` folder to your HA `config/custom_components/` directory.
2.  Restart Home Assistant.

## ⚙️ Configuration

1.  Go to **Settings** > **Devices & Services**.
2.  Click **Add Integration** and search for **Adaptive HVAC**.
3.  Follow the setup flow to link an existing `climate.*` entity to a new Adaptive Zone.

### Managing Zones
*   **Edit Config**: Click the 3-dots menu on an integration entry and select **Configure** to change the linked entity or other settings.
*   **Edit Schedule**: Use the Adaptive HVAC panel in your sidebar to manage comfort times and overlays.

---
*Built with ❤️ for the Home Assistant Community.*
