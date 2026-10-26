import { describe, it, expect } from 'vitest';
import { TRACKS, PLAYLISTS, ARTISTS, ALBUMS, MOOD_OPTIONS } from '../data/catalog';

describe('GaanaSuno Catalog Integrity', () => {
  it('contains at least 15 curated Hindi tracks', () => {
    expect(TRACKS.length).toBeGreaterThanOrEqual(15);
  });

  it('validates every track has non-empty titles and Devanagari text', () => {
    TRACKS.forEach((track) => {
      expect(track.id).toBeTruthy();
      expect(track.title).toBeTruthy();
      expect(track.titleDevanagari).toBeTruthy();
      expect(track.artist).toBeTruthy();
      expect(track.artistDevanagari).toBeTruthy();
      expect(track.duration).toBeGreaterThan(0);
      expect(track.audioUrl).toMatch(/^(\/|https?:\/\/)/);
      expect(track.coverUrl).toBeTruthy();
      expect(track.moods.length).toBeGreaterThan(0);
      expect(track.licenseNote).toBeTruthy();
    });
  });

  it('validates all playlists reference valid track IDs', () => {
    const validTrackIds = new Set(TRACKS.map((t) => t.id));
    PLAYLISTS.forEach((pl) => {
      expect(pl.id).toBeTruthy();
      expect(pl.title).toBeTruthy();
      expect(pl.trackIds.length).toBeGreaterThan(0);
      pl.trackIds.forEach((id) => {
        expect(validTrackIds.has(id)).toBe(true);
      });
    });
  });

  it('validates all mood options have label, Devanagari label, and emoji', () => {
    MOOD_OPTIONS.forEach((m) => {
      expect(m.id).toBeTruthy();
      expect(m.label).toBeTruthy();
      expect(m.labelDevanagari).toBeTruthy();
      expect(m.emoji).toBeTruthy();
      expect(m.gradient).toBeTruthy();
    });
  });

  it('validates artists catalog structure', () => {
    ARTISTS.forEach((a) => {
      expect(a.id).toBeTruthy();
      expect(a.name).toBeTruthy();
      expect(a.nameDevanagari).toBeTruthy();
      expect(a.bio).toBeTruthy();
      expect(a.monthlyListeners).toBeTruthy();
    });
  });

  it('validates albums catalog structure', () => {
    ALBUMS.forEach((alb) => {
      expect(alb.id).toBeTruthy();
      expect(alb.title).toBeTruthy();
      expect(alb.artist).toBeTruthy();
      expect(alb.year).toBeGreaterThan(1900);
      expect(alb.trackIds.length).toBeGreaterThan(0);
    });
  });

  it('validates non-copyright Indian heritage tracks and playlist exist', () => {
    const heritagePlaylist = PLAYLISTS.find((p) => p.id === 'pl-heritage');
    expect(heritagePlaylist).toBeDefined();
    expect(heritagePlaylist?.trackIds.length).toBeGreaterThanOrEqual(8);

    const nonCopyrightTracks = TRACKS.filter((t) =>
      t.licenseNote.toLowerCase().includes('public domain') ||
      t.licenseNote.toLowerCase().includes('non-copyright') ||
      t.licenseNote.toLowerCase().includes('creative commons') ||
      t.licenseNote.toLowerCase().includes('cc by')
    );
    expect(nonCopyrightTracks.length).toBeGreaterThanOrEqual(8);
  });
});
