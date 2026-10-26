export type MoodTag =
  | 'romantic'
  | 'heartbreak'
  | 'chill'
  | 'focus'
  | 'party'
  | 'devotional'
  | 'nostalgic'
  | 'energetic'
  | 'monsoon'
  | 'spiritual';

export interface LyricLine {
  time: number; // in seconds
  text: string;
  translation?: string;
}

export interface Track {
  id: string;
  title: string;
  titleDevanagari: string;
  artist: string;
  artistDevanagari: string;
  album: string;
  albumDevanagari?: string;
  duration: number; // in seconds
  coverUrl: string;
  audioUrl?: string;
  youtubeId?: string;
  moods: MoodTag[];
  genre: string;
  year: number;
  language: 'Hindi' | 'Urdu' | 'Punjabi' | 'Awadhi';
  licenseNote: string;
  lyrics?: LyricLine[];
  tempo?: 'slow' | 'medium' | 'fast';
  vibeDescription?: string;
}

export interface Playlist {
  id: string;
  title: string;
  titleDevanagari?: string;
  description: string;
  coverUrl: string;
  trackIds: string[];
  isCustom?: boolean;
  createdDate?: string;
  curator: string;
  mood?: MoodTag;
}

export interface Artist {
  id: string;
  name: string;
  nameDevanagari: string;
  role: string;
  bio: string;
  imageUrl: string;
  popularTrackIds: string[];
  monthlyListeners: string;
}

export interface Album {
  id: string;
  title: string;
  titleDevanagari?: string;
  artist: string;
  year: number;
  coverUrl: string;
  trackIds: string[];
  genre: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlaybackState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 1
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  queueIndex: number;
  playbackSpeed: number;
}

export type AccentColor = 'saffron' | 'rose' | 'indigo' | 'emerald' | 'violet';
export type DensityMode = 'comfortable' | 'compact';
export type AnimationIntensity = 'reduced' | 'balanced' | 'expressive';

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  accent: AccentColor;
  density: DensityMode;
  animationIntensity: AnimationIntensity;
  enableAmbientGlow: boolean;
  enableVisualizer: boolean;
  preferredLanguage: 'all' | 'Hindi' | 'Urdu' | 'Punjabi';
}

export interface MoodOption {
  id: MoodTag;
  label: string;
  labelDevanagari: string;
  tagline: string;
  gradient: string;
  iconName: string;
  emoji: string;
}
