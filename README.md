# KANHA - Deep Sea Neural OS

> Premium local-first desktop AI operating layer built with Electron + React + TypeScript + Vite

## 🌊 Overview

KANHA is a cinematic, voice-first desktop AI operating system with a deep blue/sea blue neural aesthetic. It features:

- **Deep Blue Neural UI** - Glassmorphic panels, scan lines, glow effects
- **Voice-First Interface** - Wake word activation ("Hey Kanha"), real-time voice visualization
- **Local-First Security** - PIN, Face, and custom Fingerprint authentication
- **System Telemetry** - Real-time CPU, memory, battery, network monitoring
- **Phone Control** - ADB over Wi-Fi for Android device control
- **Local Notes** - Voice-enabled note taking
- **Hardware Permissions** - Granular control over microphone, camera, etc.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- ADB (Android Debug Bridge) for Phone Control features

### Installation

```bash
git clone https://github.com/kreetverse-creator/KANHA.git
cd KANHA
npm install
```

### Development

```bash
npm start
```

This will start:
- Vite dev server on http://localhost:5173
- Electron app pointing to the dev server

### Build

```bash
npm run electron-build
```

## 📋 Architecture

### Project Structure

```
KANHA/
├── electron/
│   ├── main.ts           # Main process
│   ├── preload.ts        # IPC bridge
│   ├── ipc.ts            # IPC handlers
│   ├── system-monitor.ts # System telemetry
│   └── adb-controller.ts # Android device control
├── src/
│   ├── screens/
│   │   ├── BootScreen.tsx      # Startup sequence
│   │   ├── LockScreen.tsx      # Multi-auth
│   │   └── Dashboard.tsx       # Main UI
│   ├── components/
│   │   ├── auth/
│   │   │   ├── PINAuth.tsx
│   │   │   ├── FaceAuth.tsx
│   │   │   └── FingerprintAuth.tsx
│   │   ├── voice/
│   │   │   ├── VoiceVisualization.tsx
│   │   │   └── VoiceTranscript.tsx
│   │   ├── DashboardNav.tsx
│   │   ├── SystemTelemetry.tsx
│   │   ├── Notes.tsx
│   │   ├── PhoneControl.tsx
│   │   ├── Hardware.tsx
│   │   └── Settings.tsx
│   └── App.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### IPC Channels

All IPC channels are whitelisted in `electron/preload.ts`:

- **Security**: `secure-save-keys`, `secure-get-keys`
- **Vault**: `setup-vault-pin`, `verify-vault-pin`, `setup-vault-face`, `verify-vault-face`, `setup-vault-fingerprint`, `verify-vault-fingerprint`
- **System**: `get-system-stats`, `get-battery-status`, `get-network-status`
- **Permissions**: `get-hardware-permissions`, `set-hardware-permission`
- **Phone**: `adb-*` commands for device control
- **Files**: `read-file`, `write-file`, `read-directory`
- **Notes**: `save-note`, `get-notes`, `delete-note`

## 🎨 Styling

### Color Palette

- **Primary Dark**: `#020817`
- **Secondary Dark**: `#03111f`
- **Tertiary Dark**: `#041b2d`
- **Cyan Accent**: `#38bdf8`
- **Teal Accent**: `#06b6d4`
- **Sea Accent**: `#14b8a6`

### CSS Features

- Glassmorphic panels with backdrop blur
- Scan line effects
- Glow animations
- Neural network backgrounds
- Three.js particle visualizations

## 🔐 Security

- **No Windows Hello** - Custom in-app authentication
- **Encrypted Storage** - Electron safeStorage for API keys
- **Bcrypt Hashing** - PIN hashing with salt
- **IPC Whitelisting** - Only approved channels exposed
- **Sandbox Mode** - Renderer process sandboxed

## 📱 Phone Control

Connect Android devices over Wi-Fi using ADB:

1. Enable USB Debugging on Android device
2. Connect to same Wi-Fi network
3. Use IP and port 5555 to connect
4. Control via voice: "Hey Kanha, open YouTube on my phone"

## 🎤 Voice System

- Wake word detection (default: "Hey Kanha")
- Configurable in Settings
- Real-time voice visualization
- Local transcript history
- Tool calling for hardware actions

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please check CONTRIBUTING.md

## ✨ Features Roadmap

- [ ] Real Gemini Live WebSocket integration
- [ ] Advanced fingerprint biometric SDK
- [ ] ML-based face recognition
- [ ] Custom macro recording
- [ ] Gallery for media management
- [ ] Advanced AI tool calling
- [ ] Multi-user support
- [ ] Cross-platform desktop sync
