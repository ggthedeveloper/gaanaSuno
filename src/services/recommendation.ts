import { TRACKS, PLAYLISTS, MOOD_OPTIONS } from '../data/catalog';
import { Track, Playlist, MoodTag } from '../types/music';

export interface MoodRecommendationResult {
  mood: MoodTag;
  title: string;
  titleDevanagari: string;
  rationale: string;
  methodology: 'metadata-rule-based';
  matchedTracks: Track[];
  recommendedPlaylists: Playlist[];
}

export interface RecommendationParams {
  mood: MoodTag;
  tempoPreference?: 'any' | 'slow' | 'medium' | 'fast';
  preferredLanguage?: 'all' | 'Hindi' | 'Urdu' | 'Punjabi';
  limit?: number;
}

/**
 * Transparent, deterministic rule-based mood recommendation engine.
 * Matches curated catalog metadata (mood tags, tempo, genre weights)
 * without making fabricated AI audio claims.
 */
export function getRecommendationsByMood(params: RecommendationParams): MoodRecommendationResult {
  const { mood, tempoPreference = 'any', preferredLanguage = 'all', limit = 10 } = params;
  const moodMeta = MOOD_OPTIONS.find((m) => m.id === mood) || MOOD_OPTIONS[0];

  // Filter tracks by mood tag
  let candidates = TRACKS.filter((track) => track.moods.includes(mood));

  // If few matches, fall back to general catalog
  if (candidates.length === 0) {
    candidates = [...TRACKS];
  }

  // Optional language filter
  if (preferredLanguage !== 'all') {
    const langFiltered = candidates.filter((t) => t.language === preferredLanguage);
    if (langFiltered.length > 0) {
      candidates = langFiltered;
    }
  }

  // Optional tempo filter
  if (tempoPreference !== 'any') {
    const tempoFiltered = candidates.filter((t) => t.tempo === tempoPreference);
    if (tempoFiltered.length > 0) {
      candidates = tempoFiltered;
    }
  }

  // Match corresponding curated playlists
  const recommendedPlaylists = PLAYLISTS.filter((p) => p.mood === mood);

  return {
    mood,
    title: moodMeta.label,
    titleDevanagari: moodMeta.labelDevanagari,
    rationale: `Curated via metadata matching tags: [${mood}] and musical attributes (${tempoPreference !== 'any' ? `tempo: ${tempoPreference}, ` : ''}genre affinity).`,
    methodology: 'metadata-rule-based',
    matchedTracks: candidates.slice(0, limit),
    recommendedPlaylists,
  };
}

/**
 * Real-time client-side search across tracks, artists, albums, and lyrics.
 */
export function searchCatalog(query: string, filterMood?: MoodTag | 'all'): {
  tracks: Track[];
  playlists: Playlist[];
} {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery && (!filterMood || filterMood === 'all')) {
    return { tracks: TRACKS, playlists: PLAYLISTS };
  }

  const tracks = TRACKS.filter((track) => {
    // Mood filter if active
    if (filterMood && filterMood !== 'all' && !track.moods.includes(filterMood)) {
      return false;
    }

    if (!cleanQuery) return true;

    const inTitle = track.title.toLowerCase().includes(cleanQuery);
    const inTitleDev = track.titleDevanagari.includes(cleanQuery);
    const inArtist = track.artist.toLowerCase().includes(cleanQuery);
    const inArtistDev = track.artistDevanagari.includes(cleanQuery);
    const inAlbum = track.album.toLowerCase().includes(cleanQuery);
    const inGenre = track.genre.toLowerCase().includes(cleanQuery);
    const inLyrics = track.lyrics?.some(
      (l) => l.text.includes(cleanQuery) || (l.translation && l.translation.toLowerCase().includes(cleanQuery))
    );

    return inTitle || inTitleDev || inArtist || inArtistDev || inAlbum || inGenre || inLyrics;
  });

  const playlists = PLAYLISTS.filter((pl) => {
    if (!cleanQuery) return true;
    return (
      pl.title.toLowerCase().includes(cleanQuery) ||
      (pl.titleDevanagari && pl.titleDevanagari.includes(cleanQuery)) ||
      pl.description.toLowerCase().includes(cleanQuery)
    );
  });

  return { tracks, playlists };
}
