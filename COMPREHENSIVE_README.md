# KANHA Neural OS - Complete Electron Desktop AI

> Deep Sea Neural OS: Premium local-first desktop AI operating layer

![KANHA](https://img.shields.io/badge/KANHA-Neural%20OS-38bdf8?style=flat-square&logo=electron)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=flat-square)
![React](https://img.shields.io/badge/React-18.2-61dafb?style=flat-square)
![Electron](https://img.shields.io/badge/Electron-27-9fedf9?style=flat-square)

## 🌊 Overview

KANHA is a cinematic, voice-first desktop AI operating system with a deep blue/sea blue neural aesthetic. Built with **Electron + React + TypeScript + Vite**, it features premium security, system awareness, and phone control capabilities.

### ✨ Key Features

- **Deep Blue Neural UI** - Glassmorphic panels, scan lines, glow effects, cinematic animations
- **Voice-First Interface** - Wake word activation ("Hey Kanha"), real-time voice visualization, local transcripts
- **Multi-Factor Authentication** - PIN, Face Recognition (face-api.js), Custom Fingerprint Scanner
- **System Telemetry Dashboard** - Real-time CPU, RAM, battery, network, temperature monitoring
- **Android Phone Control** - ADB over Wi-Fi for device control via voice commands
- **Local Notes** - Voice-enabled note taking with encrypted storage
- **Hardware Permissions** - Granular control over microphone, camera, screen capture, etc.
- **Settings Panel** - Configurable wake word, personality, API keys (encrypted)
- **Secure Storage** - Electron safeStorage for API keys, bcrypt PIN hashing

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ (18+ recommended)
- **npm** or **yarn**
- **ADB** (Android Debug Bridge) - for Phone Control features
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/kreetverse-creator/KANHA.git
cd KANHA

# Install dependencies
npm install
```

### Development

```bash
# Start dev server + Electron
npm start

# Or run separately:
# Terminal 1: Vite dev server
npm run dev

# Terminal 2: Electron
npm run electron-dev
```

### Build

```bash
# Build for your platform
npm run electron-build

# Output: ./release/
```

## 📁 Project Structure

```
KANHA/
├── electron/                    # Main & IPC process
│   ├── main.ts                  # App entry point
│   ├── preload.ts               # IPC bridge (whitelisted)
│   ├── ipc.ts                   # IPC handlers (30+ channels)
│   ├── system-monitor.ts        # System telemetry
│   └── adb-controller.ts        # Android device control
├── src/
│   ├── screens/                 # Full-screen views
│   │   ├── BootScreen.tsx       # Startup sequence + greeting
│   │   ├── LockScreen.tsx       # Multi-auth (PIN/Face/Print)
│   │   └── Dashboard.tsx        # Main UI hub
│   ├── components/
│   │   ├── auth/
│   │   │   ├── PINAuth.tsx      # PIN entry (6-digit)
│   │   │   ├── FaceAuth.tsx     # face-api.js webcam
│   │   │   └── FingerprintAuth.tsx  # Custom scanner UI
│   │   ├── voice/
│   │   │   ├── VoiceVisualization.tsx  # 3D particles (React Three Fiber)
│   │   │   └── VoiceTranscript.tsx     # Live transcript
│   │   ├── DashboardNav.tsx     # Tab navigation
│   │   ├── SystemTelemetry.tsx  # Real-time stats
│   │   ├── Notes.tsx            # Create/edit/delete notes
│   │   ├── PhoneControl.tsx     # ADB device management
│   │   ├── Hardware.tsx         # Permission toggles
│   │   └── Settings.tsx         # Wake word, API keys, profile
│   ├── services/
│   │   └── VoiceService.ts      # Audio processing, wake-word
│   ├── utils/
│   │   ├── SecureStorage.ts     # Encrypted key management
│   │   ├── SystemTelemetryService.ts
│   │   ├── HardwarePermissionService.ts
│   │   ├── AndroidController.ts # ADB wrapper
│   │   └── NotesService.ts
│   ├── App.tsx                  # Root component
│   ├── App.css                  # Global styles + animations
│   └── main.tsx                 # React entry
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite bundler config
├── tailwind.config.js           # Tailwind theme
├── postcss.config.js            # PostCSS plugins
└── README.md                    # This file
```

## 🎨 UI/UX Design

### Color Palette

```css
--neural-dark:     #020817;  /* Deep space black */
--neural-darker:   #03111f;  /* Dark navy */
--neural-deepest:  #041b2d;  /* Darkest navy */
--neural-cyan:     #38bdf8;  /* Bright cyan accent */
--neural-teal:     #06b6d4;  /* Sea teal */
--neural-sea:      #14b8a6;  /* Ocean green */
--neural-accent:   #0ea5e9;  /* Sky blue */
```

### Effects & Animations

- **Glassmorphism**: `bg-slate-950/50 backdrop-blur-xl border border-cyan-400/10`
- **Glow Effects**: Animated box-shadow with cyan/teal radiance
- **Scan Lines**: Repeating linear gradients for CRT feel
- **Framer Motion**: Screen transitions, state-based animations
- **GSAP**: Biometric scan sequences, boot animations, error shakes
- **React Three Fiber**: 3D particle visualization with real-time audio reactivity

## 🔐 Security Architecture

### Authentication

1. **PIN Lock**
   - 6-digit PIN entry
   - Bcrypt hashing with salt (10 rounds)
   - Stored in `electron-store` (OS-level encryption on Windows)

2. **Face Recognition**
   - Uses `face-api.js` + TensorFlow.js models
   - Local enrollment (128-dim descriptors)
   - Euclidean distance matching (threshold: 0.6)
   - No data sent to servers

3. **Custom Fingerprint Scanner**
   - Mock fingerprint template system
   - Canvas-based scan visualization
   - Multi-pass enrollment (3 scans)
   - Local template matching

### API Key Storage

- Encrypted with `Electron.safeStorage.encryptString()`
- Decrypted on-demand via IPC
- Never accessible to renderer in plaintext

### IPC Hardening

- **Whitelist-only**: `electron/preload.ts` exposes 35+ channels explicitly
- **No `nodeIntegration`**: Renderer cannot access Node.js
- **Sandbox enabled**: Renderer runs in OS sandbox
- **Context isolation**: `contextBridge` exposes minimal API

## 🎤 Voice System

### Wake Word Detection

- Default: **"Hey Kanha"**
- Configurable in Settings
- Passive listening (low CPU, wake-on-demand)
- Real-time transcript buffering

### Audio Pipeline

1. Microphone stream (if permitted)
2. Downsample to 16 kHz PCM
3. Base64 encode audio chunks
4. Send to Gemini Live API (WebSocket)
5. Stream response audio
6. Update visualization in real-time

### Visualization States

| State | Appearance |
|-------|------------|
| **Sleeping** | Dim blue pulse, slow rotation |
| **Wake Detected** | Cyan ripple effect, quick activation |
| **Listening** | Expanding cyan rings, waveform reactivity |
| **Thinking** | Rotating particle bands, scan lines |
| **Speaking** | Bright sea-blue burst, audio analyzer |

## 📱 Phone Control (ADB)

### Setup

1. Enable **USB Debugging** on Android device
2. Connect PC and phone to **same Wi-Fi**
3. Run `adb tcpip 5555` on phone (via USB once)
4. In KANHA: Enter phone's IP + port 5555

### Supported Commands

```python
# Voice commands
"Hey Kanha, open YouTube on my phone"
"Hey Kanha, swipe down on my phone"
"Hey Kanha, tap the center of my screen"
"Hey Kanha, send this file to my phone"
```

### IPC Channels

- `adb-connect-wifi(ip, port)` - Establish connection
- `adb-disconnect(ip)` - Disconnect device
- `adb-telemetry(ip)` - Get battery, model, etc.
- `adb-screenshot(ip)` - Capture screen
- `adb-open-app(ip, packageName)` - Launch app
- `adb-close-app(ip, packageName)` - Force stop
- `adb-tap(ip, x, y)` - Tap at coordinates
- `adb-swipe(ip, x1, y1, x2, y2, duration)` - Gesture
- `adb-push-file(ip, localPath, remotePath)` - Upload
- `adb-pull-file(ip, remotePath, localPath)` - Download

## 🖥️ System Telemetry

Real-time monitoring displayed on Dashboard:

- **CPU Usage** (%) - Averaged across cores
- **Memory** (%) - RAM used vs. total
- **Battery** (%) - Device power level + charging state
- **Network** - Active interfaces, IP addresses
- **Platform** - OS (Windows, macOS, Linux)
- **Architecture** - CPU arch (x64, arm64, etc.)
- **Uptime** - System uptime in seconds
- **Load Average** - 1, 5, 15-minute load

## 🔧 Hardware Permissions

Granular toggles for sensitive hardware:

| Permission | Default | Purpose |
|------------|---------|----------|
| **Microphone** | ✅ ON | Voice input |
| **Camera** | ❌ OFF | Face auth, video calls |
| **Screen Capture** | ❌ OFF | Desktop streaming |
| **Location** | ❌ OFF | Geolocation services |
| **Notifications** | ✅ ON | System notifications |
| **File System** | ✅ ON | File read/write |
| **Terminal** | ❌ OFF | Shell command execution |
| **Android** | ✅ ON | ADB phone control |

## 📝 Notes

- **Storage**: Local `electron-store` (user data folder)
- **Format**: JSON with timestamp
- **Voice Integration**: "Hey Kanha, save this as a note" → auto-create
- **Edit/Delete**: Full CRUD via UI
- **Encryption**: Not encrypted by default (can add via SecureStorage)

## ⚙️ Settings

### Configurable

- **Wake Word** - Custom activation phrase
- **User Name** - Personalization
- **Personality** - Professional / Casual / Technical
- **Voice Profile** - Voice model selection
- **API Keys** - Gemini, etc. (encrypted)
- **Theme** - Dark only (for now)

## 🎬 Boot Sequence

1. **Splash Screen** with KANHA logo
2. **Boot Messages**:
   - "INITIALIZING KANHA NEURAL CORE"
   - "SYNCING HARDWARE MATRIX"
   - "SCANNING LOCAL SYSTEM TELEMETRY"
   - "VOICE UPLINK READY"
   - "NEURAL PATHWAYS ACTIVE"
   - "BOOT SEQUENCE COMPLETE"
3. **Time-based Greeting**:
   - Morning (< 12:00) → "Good morning"
   - Afternoon (< 17:00) → "Good afternoon"
   - Evening (< 21:00) → "Good evening"
   - Night (≥ 21:00) → "Good night"
4. **Transition** to Lock Screen
5. **Authentication** → Dashboard

## 📦 Dependencies

### Core

- **Electron 27** - Desktop framework
- **React 18** - UI library
- **TypeScript 5** - Type safety
- **Vite 5** - Build bundler

### UI/Animation

- **Tailwind CSS 3** - Utility styling
- **Framer Motion 10** - React animations
- **GSAP 3** - Advanced animations
- **Three.js + React Three Fiber** - 3D visualization

### Security

- **bcryptjs 2.4** - Password hashing
- **electron-store 8** - Persistent storage
- **face-api.js 0.22** - Face recognition

### Utilities

- **axios** - HTTP client
- **clsx** - Class name utilities
- **class-variance-authority** - Component variants

## 🛠️ Development

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Build Preview

```bash
npm run build && npm run preview
```

## 📋 API Reference

### IPC Channels (Complete List)

#### Security (4)
- `secure-save-keys` - Encrypt & store API keys
- `secure-get-keys` - Decrypt & retrieve keys
- `setup-vault-pin` - Register PIN
- `verify-vault-pin` - Verify PIN

#### Biometric (4)
- `setup-vault-face` - Enroll face descriptor
- `verify-vault-face` - Verify face match
- `setup-vault-fingerprint` - Enroll fingerprint template
- `verify-vault-fingerprint` - Verify fingerprint match

#### System (3)
- `get-system-stats` - CPU, memory, platform
- `get-battery-status` - Battery percentage & charging
- `get-network-status` - Network interfaces & IPs

#### Permissions (2)
- `get-hardware-permissions` - Get all permission states
- `set-hardware-permission` - Toggle permission

#### Phone (10)
- `adb-connect-wifi` - Connect Android device
- `adb-disconnect` - Disconnect device
- `adb-telemetry` - Get device info
- `adb-screenshot` - Capture screen
- `adb-open-app` - Launch app
- `adb-close-app` - Close app
- `adb-tap` - Tap screen
- `adb-swipe` - Swipe gesture
- `adb-push-file` - Push file
- `adb-pull-file` - Pull file
- `adb-get-notifications` - Read notifications

#### Files (3)
- `read-file` - Read file contents
- `write-file` - Write file contents
- `read-directory` - List directory

#### Notes (3)
- `save-note` - Create/update note
- `get-notes` - Retrieve all notes
- `delete-note` - Delete note

#### Voice (2)
- `wake-word-detected` - Trigger wake-word
- `voice-state-change` - Update voice state

#### Utility (2)
- `run-shell-command` - Execute shell (if permitted)
- `take-screenshot` - Capture desktop

## 🚀 Roadmap

- [ ] Real **Gemini Live WebSocket** integration
- [ ] Advanced **ML-based face recognition** (better accuracy)
- [ ] **Hardware biometric SDK** for fingerprint (currently mock)
- [ ] **Multi-device sync** across desktops
- [ ] **Voice macro recording** and playback
- [ ] **Dark/Light theme** toggle
- [ ] **Multi-user profiles** with separate vaults
- [ ] **Cloud backup** (optional, encrypted)
- [ ] **Browser extension** for web integration
- [ ] **Custom neural network** voice model

## 📜 License

**MIT** - See LICENSE file

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 💬 Support

For issues, feature requests, or questions:

- 🐛 [GitHub Issues](https://github.com/kreetverse-creator/KANHA/issues)
- 💌 Email: kreetverse@gmail.com
- 🌐 Website: (Coming soon)

## ✨ Credits

- **Electron** - Desktop framework
- **React** - UI library
- **face-api.js** - Face recognition models
- **Three.js** - 3D graphics
- **GSAP** - Animation library
- **Framer Motion** - React animations
- **Tailwind CSS** - Utility-first CSS

---

**KANHA - Where AI meets Neural Architecture** 🌊

Built with ❤️ by [Kreetverse Creator](https://github.com/kreetverse-creator)
