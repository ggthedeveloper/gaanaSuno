# 🎵 GaanaSuno | गाने सुनो
### Distinctive, Modern Multilingual Music Companion & Discovery App for Web, Android & iOS

[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.0-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![Android](https://img.shields.io/badge/Platform-Android-3DDC84?logo=android&logoColor=white)](https://developer.android.com/)
[![iOS](https://img.shields.io/badge/Platform-iOS-000000?logo=apple&logoColor=white)](https://developer.apple.com/ios/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-80%20Passing-brightgreen?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**GaanaSuno** (*गाने सुनो*) is an original, culturally rich music listening and discovery application built specifically for mobile devices (Android, iOS) and modern web browsers. Designed for lovers of Bollywood melodies, indie acoustic pop, soulful Sufi qawwalis, late-night Dilli lo-fi beats, morning devotional ragas, and energetic Punjabi dance anthems.

GaanaSuno redefines music discovery with user-controlled exploration ("Beyond Your Taste"), natural-language Hinglish music intent search ("Ask GaanaSuno"), tailored time-bounded "Moment Mixes" with sleep timers, and 100% on-device privacy-first personalization.

---

## 🌟 Distinctive Innovations & Signature Features

### 1. 🎚️ "Beyond Your Taste" User-Controlled Discovery Mode
Unlike generic algorithmic black boxes that trap listeners in repetitive echo chambers, GaanaSuno provides an intentional exploration control slider directly on the Home feed:
- **Familiar (90/10):** Anchors primarily to your liked artists and preferred languages, introducing only 10% adjacent genres.
- **Balanced (60/40):** A balanced blend matching your primary affinity while branching into related Indian indie and regional rhythms.
- **Experimental (30/70):** Consciously stretches your musical horizons across classical ragas, underground lo-fi, and unfamiliar genres.
- **Transparent Explanations:** Every recommended card explicitly details *why* it was selected (e.g., *"Matched to your high affinity for Arijit Singh and Hindi romantic melodies"* or *"Broadening your listening into Sufi classical with Amjad Sabri"*).
- **Active Taste Feedback:** Interactive feedback buttons ("More like this", "Not for me", "Surprise me") dynamically update your on-device discovery profile.
- **Diversity Cap:** Strictly caps any single artist at a maximum of 2 tracks in any discovery feed to guarantee variety.

### 2. 💬 "Ask GaanaSuno" Natural-Language & Hinglish Music Intent Search
Listeners don't always search by exact song titles—they search by life context, feelings, and multilingual phrases. GaanaSuno includes a deterministic, zero-latency natural-language query parser:
- **Hinglish & Multilingual Processing:** Understands queries like *"baarish romantic song"*, *"late night drive slow songs"*, *"30 minutes padhai focus lofi"*, *"subah pooja devotional"*, or *"gym high energy punjabi beats"*.
- **Multi-Dimensional Intent Extraction:** Parses queries into structured facets: Mood, Activity, Language, Genre, Tempo, Duration, and Target Artist.
- **Interactive Understood Chips:** Displays parsed intent chips with dismissible remove tags (`×`) so users can modify or broaden their query without retyping.
- **Fast Client-Side Matching:** Normalizes transliteration (e.g., *dard bhare*, *shant*, *raat*, *sufiyana*) with instant local indexing.

### 3. ⏱️ "Moment Mixes" & Context-Aware Listening Sessions
Music should fit your actual time window. GaanaSuno transforms passive playlists into intentional listening sessions:
- **7 Moment Archetypes:** Focus & Study, Unwind & Relax, Long Drive, Morning Energy, Late-Night Calm, 90s Nostalgia, and Discovery Journey.
- **Target Duration Packing:** Choose your session duration (15m, 30m, 45m, 60m), and GaanaSuno automatically packs a cohesive tracklist respecting the time budget with artist diversity caps.
- **Save as Playlist:** One-click option to save any generated Moment Mix directly to your personal library.
- **Interactive Session Sleep Timer:** Features presets (15m, 30m, 45m, 60m), custom minutes, and an **"End of this track"** option that gently fades and pauses playback when the current song finishes.

### 4. 🎧 Polished Persistent Audio & "Now Playing" Experience
- **Instant Playback Engine:** Singleton `AudioEngine` wrapping HTML5 Audio and Web Audio API with zero UI stutter and immediate play/pause response.
- **Hardware-Accelerated Visualizer:** Real-time audio spectrum bars and waveform rendered via HTML5 Canvas reacting directly to active playback frequencies.
- **Ambient Aura Glow:** Dynamic blurred backlight matching the current track's album artwork palette.
- **Spinning Vinyl Artwork:** Smooth rotating vinyl artwork responding to playback state (with full `prefers-reduced-motion` compliance).
- **Synchronized Lyrics:** Time-synced lyrics with poetic translations.
- **Mobile Bottom Mini-Player:** Swipeable and expandable bottom mini-player engineered with native safe-area inset padding (`env(safe-area-inset-bottom)`).

### 5. 🔒 100% On-Device Privacy & Signal Transparency
- **Zero Cloud Tracking:** All taste signals, playback counts, liked tracks, and custom playlists remain 100% on your local device (`localStorage`).
- **Signal Inventory in Settings:** Transparent audit counters in Settings displaying your exact liked songs count, playback history count, and active "more like this" / "not for me" signal counts.
- **One-Click Reset:** Instantly reset discovery signals or purge playback history whenever you want a fresh start.

### 6. 📱 Mobile-First Architecture (Android & iOS via Capacitor)
- Built for touch screens with generous touch targets (min 44px), smooth momentum scrolling, and notch / home bar awareness (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`).
- Complete Capacitor 8 native projects for both Android (`android/`) and iOS (`ios/`).

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js:** v18.0.0 or higher (Tested with Node v25.6.1)
- **npm:** v9.0.0 or higher
- **Android Studio** (optional, for Android native APK/bundle build)
- **Xcode** (optional, for iOS native IPA/simulator build on macOS)

### 1. Web Local Development

```bash
# Clone the repository
git clone https://github.com/ggthedeveloper/gaanaSuno.git
cd gaanaSuno

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📱 Mobile Platform Builds (Android & iOS)

GaanaSuno uses **Capacitor 8** to run natively on mobile devices.

### Android Setup & Build

```bash
# 1. Build the web distribution
npm run build

# 2. Sync web assets into Android native project
npm run android:sync

# 3. Open in Android Studio
npm run android:open
```

In Android Studio:
- Select your target device or emulator.
- Click **Run** (`Ctrl+R` or green play button) or build an APK via **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

### iOS Setup & Build (macOS with Xcode)

```bash
# 1. Build the web distribution
npm run build

# 2. Sync web assets into iOS native project
npm run ios:sync

# 3. Open in Xcode
npm run ios:open
```

In Xcode:
- Select an iOS Simulator (e.g. iPhone 16) or connected iOS device.
- Press **Cmd + R** to build and run.

---

## 🧪 Automated Testing & Production Build

GaanaSuno has an extensive test suite powered by **Vitest** and **@testing-library/react**:

```bash
# Run complete test suite (80 tests across 11 test suites)
npm test

# Run tests in watch mode
npm run test:watch

# Compile TypeScript and bundle with Vite
npm run build
```

### Test Suite Highlights (80 Passing Tests)
- `discoveryEngine.test.ts` — 9 tests: Discovery levels (Familiar, Balanced, Experimental), affinity scoring, artist diversity caps, and signal reset.
- `intentParser.test.ts` — 8 tests: Hinglish and English intent normalization, mood/activity/tempo extraction, and candidate catalog matching.
- `sessionMixService.test.ts` — 6 tests: Moment mix generation, duration packing, artist diversity cap, and singleton session sleep timer.
- `recommendation.test.ts` — 14 tests: Mood engine, tempo filtering, bilingual search indexing.
- `audioEngine.test.ts` — 8 tests: Audio playback singleton, volume, mute, seek, and tone fallback generator.
- `storage.test.ts` — 10 tests: Schema validation, liked songs, custom playlist CRUD, history de-duplication.
- `formatters.test.ts` — 9 tests: Time formatting, duration strings, and text sanitizers.
- `components.test.tsx` — 5 tests: Component rendering, responsive states, accessibility.
- `App.test.tsx` — 4 tests: Top-level navigation, view routing, layout integration.
- `catalog.test.ts` — 5 tests: Catalog data integrity, Devanagari string presence, and artwork validation.
- `visualizer.test.ts` — 2 tests: Web Audio API analyser node connection and canvas rendering fallbacks.

---

## 📂 Project Structure

```
gaanaSuno/
├── android/                     # Capacitor Android native project (Gradle / Kotlin)
├── ios/                         # Capacitor iOS native project (Xcode / Swift Package Manager)
├── docs/
│   └── PRODUCT_AUDIT.md         # Full architectural audit, baseline checklist & roadmap
├── public/
│   └── logo.svg                 # GaanaSuno branding vector
├── src/
│   ├── components/
│   │   ├── layout/              # AppShell, Sidebar, TopBar, MobileNav
│   │   ├── modals/              # CreatePlaylistModal, TrackDetailModal
│   │   ├── music/
│   │   │   ├── BeyondTasteDiscovery.tsx  # Discovery level slider & feedback cards
│   │   │   ├── MomentMixModal.tsx        # Moment intention session builder
│   │   │   ├── TrackCard.tsx, TrackRow.tsx, PlaylistCard.tsx, ArtistCard.tsx
│   │   └── player/
│   │       ├── PersistentPlayer.tsx      # Desktop & tablet persistent audio player
│   │       ├── NowPlayingModal.tsx       # Immersive modal with visualizer & timer trigger
│   │       ├── SessionTimerModal.tsx     # Session sleep timer with "End of Track" mode
│   │       ├── AudioVisualizer.tsx       # Hardware-accelerated canvas visualizer
│   │       └── QueueDrawer.tsx           # Reorderable playback queue drawer
│   ├── context/
│   │   ├── AudioContext.tsx     # Audio state management & session timer event hooks
│   │   ├── LibraryContext.tsx   # Liked songs, custom playlists, recent history
│   │   └── ThemeContext.tsx     # High-contrast themes, Indian accents, density & motion
│   ├── data/
│   │   └── catalog.ts           # Curated music catalog with SVG artwork & lyrics
│   ├── services/
│   │   ├── audioEngine.ts       # Singleton HTML5 Audio + Web Audio Analyser
│   │   ├── discoveryEngine.ts   # "Beyond Your Taste" deterministic exploration engine
│   │   ├── intentParser.ts      # Natural-language & Hinglish music intent search parser
│   │   ├── sessionMixService.ts # Contextual Moment Mixes & Session Timer singleton
│   │   ├── recommendation.ts    # Rule-based mood discovery & multi-attribute search
│   │   └── storage.ts           # Local-first persistence service
│   ├── test/                    # 11 Vitest test suites (80 automated tests)
│   ├── types/
│   │   └── music.ts             # TypeScript domain interfaces
│   ├── utils/
│   │   └── formatters.ts        # Time and string formatting utilities
│   ├── views/
│   │   ├── HomeView.tsx         # Welcoming hub with Beyond Taste & Moment Mix triggers
│   │   ├── SearchView.tsx       # Intent-driven search with parsed interactive chips
│   │   ├── MoodDiscoveryView.tsx# Emotion & tempo recommendation view
│   │   ├── LibraryView.tsx      # Personal collections & liked songs
│   │   ├── PlaylistDetailView.tsx # Playlist detail & tracklist
│   │   ├── ArtistDetailView.tsx # Artist profile & discography
│   │   └── SettingsView.tsx     # Themes, taste signal audit & privacy controls
│   ├── App.tsx                  # Root application component
│   ├── index.css                # Tailwind CSS v4 design tokens, safe areas & keyframes
│   └── main.tsx                 # React DOM mount point
├── capacitor.config.ts          # Capacitor configuration for Android & iOS
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚖️ Audio Strategy, Copyright & Legal Attribution

GaanaSuno strictly adheres to intellectual property and music streaming compliance:
- **Audio Streams:** Playable demonstration streams use royalty-free Creative Commons demonstration audio (SoundHelix CC BY 4.0 Audio) and public domain classical Indian recordings.
- **Harmonic Tone Fallback:** Includes a Web Audio API harmonic drone tone generator for offline or network-constrained testing environments, ensuring play controls are genuinely functional.
- **Provider Ready:** Architecture cleanly abstracts audio playback through `audioEngine.ts`, allowing seamless plug-in of licensed Spotify Web Playback SDK, YouTube Music embeds, or JioSaavn partner APIs in future releases.

---

## 👤 Author & Genuine Work
- **Developer:** Gaurav Gautam ([@ggthedeveloper](https://github.com/ggthedeveloper))
- **Email:** ggraipurchor@gmail.com
- **Repository:** [https://github.com/ggthedeveloper/gaanaSuno](https://github.com/ggthedeveloper/gaanaSuno)

---
*सुरों का सफर, आपके साथ — GaanaSuno* 🎶
