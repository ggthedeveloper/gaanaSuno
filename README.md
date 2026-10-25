# 🎵 GaanaSuno | गाने सुनो
### Modern Hindi-First Music Discovery & Streaming Web Platform

[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-26%20Passing-brightgreen?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**GaanaSuno** (*गाने सुनो*) is an original, culturally rich Hindi-first music listening web application. Designed for lovers of Bollywood melodies, indie acoustic pop, soulful Sufi qawwalis, late-night Dilli lo-fi beats, morning devotional ragas, and energetic Punjabi dance anthems.

Built from the ground up with high visual taste, responsive layouts (mobile, tablet, desktop), client-side real search, persistent audio playback, hardware-accelerated audio visualizer, transparent mood recommendations, and local-first persistence.

---

## ✨ Features & Architecture

### 1. 🎧 Persistent Music Player
- **Real Playback Engine:** Powered by a singleton `AudioEngine` wrapping HTML5 Audio and Web Audio API with seamless state management.
- **Full Playback Controls:** Play/Pause, Seek bar with elapsed/total duration, Next/Previous, Shuffle, and Repeat (Off / All / One).
- **Volume & Mute:** Interactive volume slider with quick mute toggle.
- **Queue Management:** Slide-out playback queue drawer with reordering, track removal, and instant play.
- **Mobile Mini-Player:** Swipeable bottom mini-player expanding to full view on touch.
- **Keyboard Shortcuts:**
  - `Space` — Play / Pause
  - `ArrowLeft` / `ArrowRight` — Seek -5s / +5s
  - `ArrowUp` / `ArrowDown` — Volume +5% / -5%
  - `M` — Mute / Unmute

### 2. 🌌 Immersive "Now Playing" Modal & Visualizer
- **Hardware-Accelerated Canvas Visualizer:** Real-time audio spectrum bars and waveform reacting directly to active playback frequencies.
- **Ambient Aura Glow:** Dynamic blurred backlight matching the current track's album artwork palette.
- **Vinyl Disk Rotation:** Subtle rotating vinyl artwork responding to playback state (with full `prefers-reduced-motion` compliance).
- **Synchronized Hindi Poetry & Lyrics:** Time-synced lyrics with poetic English translations.

### 3. 🧠 "मन की धुन" (Mood-Based Discovery Engine)
- **Transparent Recommendation Model:** 100% deterministic, rule-based matching based on metadata tags (`romantic`, `heartbreak`, `chill`, `devotional`, `nostalgic`, `energetic`, `monsoon`, `focus`).
- **"How are you feeling?" Selector:** 8 distinct emotional categories with tempo filtering (`slow`, `medium`, `fast`).
- **No Fabricated Claims:** Zero fake AI claims; all recommendation logic is openly documented and verified.

### 4. 🔍 Real Client-Side Search
- **Multi-Attribute Query Engine:** Instant search across English titles, Devanagari Hindi titles, artist names, albums, and lyrical lines.
- **Quick Vibe Chips:** Filter immediately by mood (All, Romantic, Sufi, Lo-Fi, Devotional, Punjabi, 90s Nostalgia, Classical).
- **Categorized Results:** Clean grouping into Songs, Playlists, and Artists with responsive empty states.

### 5. 💖 Personalization & Local-First Storage
- **Liked Songs:** Instant heart toggle, persisted across browser refreshes via safe `localStorage` schema.
- **Custom Playlists:** Create, rename, delete playlists, and add/remove songs directly from track rows.
- **Recently Played History:** Automatic de-duplicated playback logging.

### 6. 🎨 Customization & Indian Cultural Palettes
- **Themes:** Dark Mode (deep obsidian surfaces), Light Mode (clean high-contrast editorial), or System Default.
- **Accent Palettes:**
  - 🟠 *Saffron Gold (केसरिया सुनहरी)* — Default signature warm accent
  - 🌹 *Rose Romance (गुलाबी इश्क़)* — Bollywood romantic pink
  - 🌌 *Royal Indigo (शाही नील)* — Midnight ghazal deep violet-blue
  - 🌿 *Emerald Sufi (ज़मुर्रद सूफ़ी)* — Mystic jade green
  - ⚡ *Electric Violet (बैंगनी धुन)* — High-energy modern Desi
- **Density & Motion:** Comfortable vs Compact density, plus Reduced / Balanced / Expressive animation intensities.

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js:** v18.0.0 or higher (Tested with Node v25.6.1)
- **npm:** v9.0.0 or higher

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/ggthedeveloper/gaanaSuno.git
cd gaanaSuno

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Production Build

### Running Automated Tests
GaanaSuno includes automated unit and integration tests powered by **Vitest** and **@testing-library/react**:

```bash
# Run test suite once
npm test

# Run tests in watch mode
npm run test:watch
```

**Test Coverage Highlights:**
- Audio calculation and time formatters (`mm:ss`, duration strings).
- Catalog data integrity and Devanagari string presence.
- Mood discovery engine and tempo filtering algorithms.
- Search indexing across bilingual queries and lyrics snippets.
- LocalStorage persistence and preferences state management.
- React component rendering and UI error boundary validation.

### Production Build
```bash
# Compile TypeScript and bundle with Vite
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
gaanaSuno/
├── public/
│   └── logo.svg                 # GaanaSuno branding vector
├── src/
│   ├── components/
│   │   ├── layout/              # AppShell, Sidebar, TopBar, MobileNav
│   │   ├── music/               # TrackCard, TrackRow, PlaylistCard, ArtistCard, MoodCard
│   │   ├── modals/              # CreatePlaylistModal, TrackDetailModal
│   │   └── player/              # PersistentPlayer, NowPlayingModal, AudioVisualizer, QueueDrawer
│   ├── context/
│   │   ├── AudioContext.tsx     # Audio playback & queue state management
│   │   ├── LibraryContext.tsx   # Liked songs, custom playlists, recent history
│   │   └── ThemeContext.tsx     # Themes, accents, density, and animation settings
│   ├── data/
│   │   └── catalog.ts           # Curated Hindi music catalog with SVG artwork & lyrics
│   ├── services/
│   │   ├── audioEngine.ts       # Singleton HTML5 Audio + Web Audio Analyser
│   │   ├── recommendation.ts    # Deterministic rule-based mood discovery & search
│   │   └── storage.ts           # Local-first persistence service
│   ├── test/                    # Automated Vitest test specifications & setup
│   ├── types/
│   │   └── music.ts             # TypeScript domain interfaces
│   ├── utils/
│   │   └── formatters.ts        # Time and string formatting utilities
│   ├── views/
│   │   ├── HomeView.tsx         # Welcoming Hindi discovery hub
│   │   ├── SearchView.tsx       # Real client-side search & filtering
│   │   ├── MoodDiscoveryView.tsx# "मन की धुन" emotion recommendation view
│   │   ├── LibraryView.tsx      # Personal collections & liked songs
│   │   ├── PlaylistDetailView.tsx # Playlist detail & tracklist
│   │   ├── ArtistDetailView.tsx # Artist profile & discography
│   │   └── SettingsView.tsx     # Themes & customization panel
│   ├── App.tsx                  # Root application component
│   ├── index.css                # Tailwind CSS v4 design tokens & keyframes
│   └── main.tsx                 # React DOM mount point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## ⚖️ Audio Strategy, Copyright & Legal Attribution

GaanaSuno respects intellectual property and music copyright:
- **Audio Streams:** Playable streams in this project use royalty-free Creative Commons demonstration audio (SoundHelix CC BY 4.0 Audio) and public domain classical Indian recordings.
- **Synthetic Fallback:** Includes a Web Audio API harmonic drone tone generator for offline or network-constrained testing environments, ensuring play controls are genuinely functional.
- **Metadata Homages:** Song titles and artist names celebrate iconic Indian artists (Arijit Singh, Pt. Ravi Shankar, Amjad Sabri, Shreya Ghoshal, Diljit Dosanjh) for product demonstration without distributing copyrighted master recordings.
- **Provider Ready:** Architecture abstracts audio playback through `audioEngine.ts` and `recommendation.ts`, allowing seamless plug-in of licensed Spotify Web Playback SDK, YouTube Music embeds, or JioSaavn partner APIs in future releases.

---

## 👤 Author & Genuine Work
- **Developer:** Gaurav Gautam ([@ggthedeveloper](https://github.com/ggthedeveloper))
- **Email:** ggraipurchor@gmail.com
- **Repository:** [https://github.com/ggthedeveloper/gaanaSuno](https://github.com/ggthedeveloper/gaanaSuno)

---
*सुरों का सफर, आपके साथ — GaanaSuno* 🎶
