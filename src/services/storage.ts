import { Playlist, UserPreferences, Track } from '../types/music';

const STORAGE_KEYS = {
  LIKES: 'gaanasuno_liked_tracks_v1',
  PLAYLISTS: 'gaanasuno_custom_playlists_v1',
  RECENTLY_PLAYED: 'gaanasuno_recent_history_v1',
  PREFERENCES: 'gaanasuno_user_preferences_v1',
  LAST_PLAYBACK: 'gaanasuno_last_playback_v1',
  CACHED_TRACKS: 'gaanasuno_cached_dynamic_tracks_v1',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  accent: 'saffron',
  density: 'comfortable',
  animationIntensity: 'balanced',
  enableAmbientGlow: true,
  enableVisualizer: true,
  preferredLanguage: 'all',
  preferredLanguages: ['all'],
  preferredGenres: ['all'],
  hasCompletedOnboarding: false,
};

export const storage = {
  getLikedTracks(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIKES);
      return data ? JSON.parse(data) : ['track-1', 'track-2']; // Seed with a couple favourites for warm welcome
    } catch {
      return ['track-1', 'track-2'];
    }
  },

  setLikedTracks(trackIds: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(trackIds));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  },

  toggleLike(trackId: string): string[] {
    const likes = this.getLikedTracks();
    const next = likes.includes(trackId)
      ? likes.filter((id) => id !== trackId)
      : [...likes, trackId];
    this.setLikedTracks(next);
    return next;
  },

  getCustomPlaylists(): Playlist[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomPlaylists(playlists: Playlist[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch (e) {
      console.warn('Playlist save error:', e);
    }
  },

  getRecentlyPlayed(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED);
      return data ? JSON.parse(data) : ['track-1', 'track-3', 'track-7'];
    } catch {
      return ['track-1', 'track-3', 'track-7'];
    }
  },

  addRecentlyPlayed(trackId: string): string[] {
    const recent = this.getRecentlyPlayed().filter((id) => id !== trackId);
    const updated = [trackId, ...recent].slice(0, 30);
    try {
      localStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(updated));
    } catch (e) {
      console.warn('History save error:', e);
    }
    return updated;
  },

  getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (!data) return DEFAULT_PREFERENCES;
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Preferences save error:', e);
    }
  },

  getDynamicTracks(): Record<string, Track> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CACHED_TRACKS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },

  saveDynamicTrack(track: Track): void {
    try {
      const existing = this.getDynamicTracks();
      existing[track.id] = track;
      // Cap at 200 dynamic tracks to keep localStorage compact
      const keys = Object.keys(existing);
      if (keys.length > 200) {
        delete existing[keys[0]];
      }
      localStorage.setItem(STORAGE_KEYS.CACHED_TRACKS, JSON.stringify(existing));
    } catch (e) {
      console.warn('Dynamic track cache error:', e);
    }
  },

  getDynamicTrack(id: string): Track | null {
    const existing = this.getDynamicTracks();
    return existing[id] || null;
  },
};
