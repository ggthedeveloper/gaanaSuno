import { describe, it, expect } from 'vitest';
import { parseMusicIntent, normalizeMusicQuery } from '../services/intentParser';

describe('Natural-Language Music Intent Parser ("Ask GaanaSuno")', () => {
  it('normalizes punctuation and whitespace correctly', () => {
    const raw = '  Rainy, evening... ke liye  soft Hindi songs! ';
    expect(normalizeMusicQuery(raw)).toBe('rainy evening ke liye soft hindi songs');
  });

  it('parses "Rainy evening ke liye soft Hindi songs" into monsoon, slow tempo, and Hindi language', () => {
    const result = parseMusicIntent('Rainy evening ke liye soft Hindi songs');
    expect(result.detectedMood).toBe('monsoon');
    expect(result.detectedLanguage).toBe('Hindi');
    expect(result.detectedTempo).toBe('slow');
    expect(result.filters.some((f) => f.key === 'mood' && f.value === 'monsoon')).toBe(true);
    expect(result.matchedTracks.length).toBeGreaterThan(0);
  });

  it('parses "Play energetic tracks for a long drive" into energetic mood and drive activity', () => {
    const result = parseMusicIntent('Play energetic tracks for a long drive');
    expect(result.detectedMood).toBe('energetic');
    expect(result.detectedActivity).toBe('Long Drive');
    expect(result.filters.some((f) => f.key === 'activity')).toBe(true);
  });

  it('parses "Something peaceful for 30 minutes of studying" into chill mood, study activity and 30m duration', () => {
    const result = parseMusicIntent('Something peaceful for 30 minutes of studying');
    expect(result.detectedMood).toBe('chill');
    expect(result.detectedActivity).toBe('Study Session');
    expect(result.durationMinutes).toBe(30);
    expect(result.filters.some((f) => f.key === 'duration' && f.value === '30m')).toBe(true);
  });

  it('parses "Purane classic romantic gaane" into nostalgic mood and romantic mood', () => {
    const result = parseMusicIntent('Purane classic romantic gaane');
    expect(result.detectedMood === 'nostalgic' || result.detectedMood === 'romantic').toBe(true);
    expect(result.matchedTracks.length).toBeGreaterThan(0);
  });

  it('detects artist keywords like "Arijit" accurately', () => {
    const result = parseMusicIntent('Play Arijit songs');
    expect(result.artistKeyword).toBe('Arijit Singh');
    expect(result.matchedTracks.every((t) => t.artist.includes('Arijit'))).toBe(true);
  });

  it('supports interactive filter tag overrides when user dismisses a filter', () => {
    const initial = parseMusicIntent('Rainy evening soft Hindi songs');
    expect(initial.detectedMood).toBe('monsoon');

    // User removes mood filter by overriding it with undefined
    const overridden = parseMusicIntent('Rainy evening soft Hindi songs', { mood: undefined });
    expect(overridden.detectedMood).toBeUndefined();
    expect(overridden.filters.some((f) => f.key === 'mood')).toBe(false);
  });

  it('handles unrecognized query gracefully with fallback suggestions and zero fabricated claims', () => {
    const result = parseMusicIntent('xyzrandomstringthatmatchesnothing');
    expect(result.filters.length).toBe(0);
    expect(result.fallbackSuggestions.length).toBeGreaterThan(0);
  });
});
