import { describe, it, expect } from 'vitest';
import { getRecommendationsByMood, searchCatalog } from '../services/recommendation';

describe('Mood Discovery & Recommendation Engine', () => {
  it('returns recommendations matching romantic mood', () => {
    const result = getRecommendationsByMood({ mood: 'romantic' });
    expect(result.mood).toBe('romantic');
    expect(result.methodology).toBe('metadata-rule-based');
    expect(result.matchedTracks.length).toBeGreaterThan(0);
    result.matchedTracks.forEach((track) => {
      expect(track.moods).toContain('romantic');
    });
  });

  it('filters recommendations by tempo preference', () => {
    const result = getRecommendationsByMood({
      mood: 'romantic',
      tempoPreference: 'slow',
    });
    expect(result.matchedTracks.length).toBeGreaterThan(0);
    result.matchedTracks.forEach((track) => {
      expect(track.tempo).toBe('slow');
    });
  });

  it('matches curated playlists tagged with corresponding mood', () => {
    const result = getRecommendationsByMood({ mood: 'devotional' });
    expect(result.recommendedPlaylists.length).toBeGreaterThan(0);
    result.recommendedPlaylists.forEach((pl) => {
      expect(pl.mood).toBe('devotional');
    });
  });
});

describe('Catalog Search Engine', () => {
  it('searches tracks by title in English', () => {
    const { tracks } = searchCatalog('Kesariya');
    expect(tracks.length).toBeGreaterThan(0);
    expect(tracks[0].title).toContain('Kesariya');
  });

  it('searches tracks by title in Devanagari Hindi', () => {
    const { tracks } = searchCatalog('केसरिया');
    expect(tracks.length).toBeGreaterThan(0);
    expect(tracks[0].titleDevanagari).toContain('केसरिया');
  });

  it('searches tracks by artist name', () => {
    const { tracks } = searchCatalog('Arijit');
    expect(tracks.length).toBeGreaterThan(0);
    expect(tracks.some((t) => t.artist.includes('Arijit'))).toBe(true);
  });

  it('searches tracks by lyrics content', () => {
    const { tracks } = searchCatalog('नैना मिलाइके');
    expect(tracks.length).toBeGreaterThan(0);
    expect(tracks[0].id).toBe('track-2'); // Chaap Tilak
  });

  it('combines text query with mood filter', () => {
    const { tracks } = searchCatalog('', 'devotional');
    expect(tracks.length).toBeGreaterThan(0);
    tracks.forEach((t) => {
      expect(t.moods).toContain('devotional');
    });
  });

  it('returns empty array gracefully when no results match', () => {
    const { tracks } = searchCatalog('xyznotarealsongname999');
    expect(tracks.length).toBe(0);
  });
});
