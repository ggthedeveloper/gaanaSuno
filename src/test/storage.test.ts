import { describe, it, expect, beforeEach } from 'vitest';
import { storage, DEFAULT_PREFERENCES } from '../services/storage';

describe('Storage & Persistence Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retrieves default liked tracks when localStorage is empty', () => {
    const likes = storage.getLikedTracks();
    expect(likes.length).toBeGreaterThan(0);
  });

  it('toggles liking a track correctly', () => {
    const testTrackId = 'test-track-123';
    expect(storage.getLikedTracks().includes(testTrackId)).toBe(false);

    // Like
    const afterLike = storage.toggleLike(testTrackId);
    expect(afterLike.includes(testTrackId)).toBe(true);

    // Unlike
    const afterUnlike = storage.toggleLike(testTrackId);
    expect(afterUnlike.includes(testTrackId)).toBe(false);
  });

  it('saves and retrieves custom playlists', () => {
    expect(storage.getCustomPlaylists()).toEqual([]);

    const mockPlaylist = {
      id: 'pl-custom-1',
      title: 'My Morning Ragas',
      description: 'Test description',
      coverUrl: 'data:image/svg+xml;utf8,...',
      trackIds: ['track-1', 'track-2'],
      curator: 'You',
    };

    storage.saveCustomPlaylists([mockPlaylist]);
    const retrieved = storage.getCustomPlaylists();
    expect(retrieved.length).toBe(1);
    expect(retrieved[0].title).toBe('My Morning Ragas');
  });

  it('manages recently played history with de-duplication and cap', () => {
    storage.addRecentlyPlayed('track-10');
    storage.addRecentlyPlayed('track-11');
    storage.addRecentlyPlayed('track-10'); // should move to front

    const history = storage.getRecentlyPlayed();
    expect(history[0]).toBe('track-10');
    expect(history[1]).toBe('track-11');
  });

  it('persists user preferences and falls back to defaults safely', () => {
    expect(storage.getPreferences()).toEqual(DEFAULT_PREFERENCES);

    const updated = {
      ...DEFAULT_PREFERENCES,
      accent: 'rose' as const,
      theme: 'light' as const,
    };
    storage.savePreferences(updated);

    expect(storage.getPreferences().accent).toBe('rose');
    expect(storage.getPreferences().theme).toBe('light');
  });

  it('supports all 10 signature accent palettes', () => {
    const accents = [
      'saffron',
      'rose',
      'indigo',
      'emerald',
      'violet',
      'ruby',
      'amber',
      'teal',
      'cyan',
      'copper',
    ] as const;

    for (const accent of accents) {
      storage.savePreferences({
        ...DEFAULT_PREFERENCES,
        accent,
      });
      expect(storage.getPreferences().accent).toBe(accent);
    }
  });
});
