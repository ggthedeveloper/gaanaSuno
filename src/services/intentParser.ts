import { TRACKS, ARTISTS } from '../data/catalog';
import { Track, MoodTag } from '../types/music';

export interface IntentFilterTag {
  key: 'mood' | 'language' | 'genre' | 'tempo' | 'activity' | 'duration' | 'artist';
  label: string;
  value: string;
}

export interface ParsedMusicIntent {
  originalQuery: string;
  detectedMood?: MoodTag;
  detectedLanguage?: string;
  detectedGenre?: string;
  detectedTempo?: 'slow' | 'medium' | 'fast';
  detectedActivity?: string;
  durationMinutes?: number;
  artistKeyword?: string;
  filters: IntentFilterTag[];
  explanation: string;
  matchedTracks: Track[];
  fallbackSuggestions: string[];
}

/**
 * Normalizes input text across English, Hindi, and common Hinglish variations.
 */
export function normalizeMusicQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Natural-Language Music Intent Parser ("Ask GaanaSuno")
 *
 * Deterministic, offline-first intent resolution across English, Hindi, and Hinglish.
 * Detects listening context, mood, activity, duration, tempo, and genre without remote AI dependency.
 */
export function parseMusicIntent(
  rawQuery: string,
  overrides?: Partial<Record<IntentFilterTag['key'], string | undefined>>
): ParsedMusicIntent {
  const normalized = normalizeMusicQuery(rawQuery);

  let detectedMood: MoodTag | undefined = (overrides?.mood as MoodTag) || undefined;
  let detectedLanguage: string | undefined = overrides?.language;
  let detectedGenre: string | undefined = overrides?.genre;
  let detectedTempo: 'slow' | 'medium' | 'fast' | undefined =
    (overrides?.tempo as any) || undefined;
  let detectedActivity: string | undefined = overrides?.activity;
  let durationMinutes: number | undefined = overrides?.duration
    ? parseInt(overrides.duration, 10)
    : undefined;
  let artistKeyword: string | undefined = overrides?.artist;

  // 1. Mood Detection (Multilingual & Hinglish)
  if (!detectedMood && !overrides?.hasOwnProperty('mood')) {
    if (
      normalized.includes('rain') ||
      normalized.includes('rainy') ||
      normalized.includes('baarish') ||
      normalized.includes('barish') ||
      normalized.includes('monsoon') ||
      normalized.includes('barsaat')
    ) {
      detectedMood = 'monsoon';
    } else if (
      normalized.includes('romantic') ||
      normalized.includes('love') ||
      normalized.includes('ishq') ||
      normalized.includes('pyar') ||
      normalized.includes('pyaar') ||
      normalized.includes('mohabbat') ||
      normalized.includes('dil')
    ) {
      detectedMood = 'romantic';
    } else if (
      normalized.includes('sad') ||
      normalized.includes('heartbreak') ||
      normalized.includes('dard') ||
      normalized.includes('gham') ||
      normalized.includes('breakup') ||
      normalized.includes('broken') ||
      normalized.includes('judai') ||
      normalized.includes('dard bhare')
    ) {
      detectedMood = 'heartbreak';
    } else if (
      normalized.includes('sukoon') ||
      normalized.includes('peace') ||
      normalized.includes('peaceful') ||
      normalized.includes('calm') ||
      normalized.includes('soft') ||
      normalized.includes('chill') ||
      normalized.includes('relax') ||
      normalized.includes('shanti') ||
      normalized.includes('rahat')
    ) {
      detectedMood = 'chill';
      if (!detectedTempo) detectedTempo = 'slow';
    } else if (
      normalized.includes('party') ||
      normalized.includes('dance') ||
      normalized.includes('josh') ||
      normalized.includes('energetic') ||
      normalized.includes('high energy') ||
      normalized.includes('bhangra') ||
      normalized.includes('nachne')
    ) {
      detectedMood = 'energetic';
      if (!detectedTempo) detectedTempo = 'fast';
    } else if (
      normalized.includes('purane') ||
      normalized.includes('purana') ||
      normalized.includes('old') ||
      normalized.includes('nostalgic') ||
      normalized.includes('90s') ||
      normalized.includes('golden') ||
      normalized.includes('retro') ||
      normalized.includes('yaadein')
    ) {
      detectedMood = 'nostalgic';
    } else if (
      normalized.includes('sufi') ||
      normalized.includes('bhakti') ||
      normalized.includes('bhajan') ||
      normalized.includes('devotional') ||
      normalized.includes('spiritual') ||
      normalized.includes('qawwali') ||
      normalized.includes('khusro') ||
      normalized.includes('kabir')
    ) {
      detectedMood = 'devotional';
    } else if (
      normalized.includes('study') ||
      normalized.includes('focus') ||
      normalized.includes('padhai') ||
      normalized.includes('work') ||
      normalized.includes('coding')
    ) {
      detectedMood = 'focus';
    }
  }

  // 2. Activity Context Detection
  if (!detectedActivity && !overrides?.hasOwnProperty('activity')) {
    if (
      normalized.includes('drive') ||
      normalized.includes('driving') ||
      normalized.includes('long drive') ||
      normalized.includes('car') ||
      normalized.includes('road trip') ||
      normalized.includes('safar')
    ) {
      detectedActivity = 'Long Drive';
      if (!detectedTempo) detectedTempo = 'medium';
    } else if (
      normalized.includes('study') ||
      normalized.includes('padhai') ||
      normalized.includes('homework') ||
      normalized.includes('deep work')
    ) {
      detectedActivity = 'Study Session';
      if (!detectedMood) detectedMood = 'focus';
    } else if (
      normalized.includes('evening') ||
      normalized.includes('shaam') ||
      normalized.includes('sunset') ||
      normalized.includes('chai')
    ) {
      detectedActivity = 'Evening Unwind';
    } else if (
      normalized.includes('sleep') ||
      normalized.includes('sone') ||
      normalized.includes('night') ||
      normalized.includes('bedtime')
    ) {
      detectedActivity = 'Bedtime Calm';
      if (!detectedTempo) detectedTempo = 'slow';
    } else if (
      normalized.includes('workout') ||
      normalized.includes('gym') ||
      normalized.includes('running') ||
      normalized.includes('kasrat')
    ) {
      detectedActivity = 'Workout';
      if (!detectedTempo) detectedTempo = 'fast';
    }
  }

  // 3. Tempo / Energy Detection
  if (!detectedTempo && !overrides?.hasOwnProperty('tempo')) {
    if (
      normalized.includes('slow') ||
      normalized.includes('dheere') ||
      normalized.includes('mellow') ||
      normalized.includes('acoustic') ||
      normalized.includes('soft')
    ) {
      detectedTempo = 'slow';
    } else if (
      normalized.includes('fast') ||
      normalized.includes('tez') ||
      normalized.includes('high energy') ||
      normalized.includes('upbeat')
    ) {
      detectedTempo = 'fast';
    } else if (normalized.includes('medium') || normalized.includes('mid tempo')) {
      detectedTempo = 'medium';
    }
  }

  // 4. Language Detection
  if (!detectedLanguage && !overrides?.hasOwnProperty('language')) {
    if (normalized.includes('punjabi') || normalized.includes('panjabi')) {
      detectedLanguage = 'Punjabi';
    } else if (normalized.includes('urdu')) {
      detectedLanguage = 'Urdu';
    } else if (normalized.includes('awadhi')) {
      detectedLanguage = 'Awadhi';
    } else if (normalized.includes('hindi') || normalized.includes('bollywood')) {
      detectedLanguage = 'Hindi';
    }
  }

  // 5. Genre Detection
  if (!detectedGenre && !overrides?.hasOwnProperty('genre')) {
    if (normalized.includes('acoustic')) detectedGenre = 'Acoustic';
    else if (normalized.includes('lofi') || normalized.includes('lo-fi')) detectedGenre = 'Lo-Fi';
    else if (normalized.includes('sufi')) detectedGenre = 'Sufi';
    else if (normalized.includes('classical') || normalized.includes('raag') || normalized.includes('raaga'))
      detectedGenre = 'Indian Classical';
    else if (normalized.includes('qawwali')) detectedGenre = 'Qawwali';
    else if (normalized.includes('rock')) detectedGenre = 'Rock';
    else if (normalized.includes('folk')) detectedGenre = 'Folk';
    else if (normalized.includes('ghazal')) detectedGenre = 'Ghazal';
    else if (normalized.includes('pop')) detectedGenre = 'Pop';
  }

  // 6. Duration Extraction (e.g. "30 minutes", "1 hour", "45 min")
  if (!durationMinutes && !overrides?.hasOwnProperty('duration')) {
    const minMatch = normalized.match(/(\d+)\s*(?:min|minute|minutes)/);
    if (minMatch) {
      durationMinutes = parseInt(minMatch[1], 10);
    } else {
      const hrMatch = normalized.match(/(\d+)\s*(?:hr|hour|hours|ghante|ghanta)/);
      if (hrMatch) {
        durationMinutes = parseInt(hrMatch[1], 10) * 60;
      }
    }
  }

  // 7. Artist Keyword Extraction
  if (!artistKeyword && !overrides?.hasOwnProperty('artist')) {
    for (const artist of ARTISTS) {
      const firstName = artist.name.split(' ')[0].toLowerCase();
      if (normalized.includes(artist.name.toLowerCase()) || normalized.includes(firstName)) {
        artistKeyword = artist.name;
        break;
      }
    }
  }

  // Build Filter Tags List
  const filters: IntentFilterTag[] = [];
  if (detectedMood) filters.push({ key: 'mood', label: 'Mood', value: detectedMood });
  if (detectedActivity) filters.push({ key: 'activity', label: 'Activity', value: detectedActivity });
  if (detectedTempo) filters.push({ key: 'tempo', label: 'Tempo', value: detectedTempo });
  if (detectedLanguage) filters.push({ key: 'language', label: 'Language', value: detectedLanguage });
  if (detectedGenre) filters.push({ key: 'genre', label: 'Genre', value: detectedGenre });
  if (artistKeyword) filters.push({ key: 'artist', label: 'Artist', value: artistKeyword });
  if (durationMinutes)
    filters.push({ key: 'duration', label: 'Duration', value: `${durationMinutes}m` });

  // 8. Match Against Real Catalog (Deterministic rule scoring)
  let candidates = TRACKS.filter((track) => {
    if (detectedMood && !track.moods.includes(detectedMood)) return false;
    if (detectedLanguage && track.language !== detectedLanguage) return false;
    if (detectedGenre && !track.genre.toLowerCase().includes(detectedGenre.toLowerCase()))
      return false;
    if (detectedTempo && track.tempo && track.tempo !== detectedTempo) return false;
    if (artistKeyword && !track.artist.toLowerCase().includes(artistKeyword.toLowerCase()))
      return false;
    return true;
  });

  // If no strict matches, relax criteria progressively (e.g. drop tempo or genre constraint)
  if (candidates.length === 0 && (detectedMood || detectedLanguage || detectedGenre)) {
    candidates = TRACKS.filter((track) => {
      let score = 0;
      if (detectedMood && track.moods.includes(detectedMood)) score += 3;
      if (detectedLanguage && track.language === detectedLanguage) score += 2;
      if (detectedGenre && track.genre.toLowerCase().includes(detectedGenre.toLowerCase())) score += 2;
      if (artistKeyword && track.artist.toLowerCase().includes(artistKeyword.toLowerCase())) score += 4;
      return score >= 2;
    });
  }

  // If duration is specified, select tracks up to that total duration
  if (durationMinutes && candidates.length > 0) {
    const targetSeconds = durationMinutes * 60;
    let accumulated = 0;
    const durationLimited: Track[] = [];

    for (const track of candidates) {
      if (accumulated + track.duration <= targetSeconds + 180) {
        durationLimited.push(track);
        accumulated += track.duration;
      }
    }
    if (durationLimited.length > 0) {
      candidates = durationLimited;
    }
  }

  // Compose Truthful Explanation
  const explanationParts: string[] = [];
  if (detectedMood) explanationParts.push(`Mood: ${detectedMood}`);
  if (detectedActivity) explanationParts.push(`Activity: ${detectedActivity}`);
  if (detectedTempo) explanationParts.push(`Tempo: ${detectedTempo}`);
  if (detectedLanguage) explanationParts.push(`Language: ${detectedLanguage}`);
  if (detectedGenre) explanationParts.push(`Genre: ${detectedGenre}`);
  if (artistKeyword) explanationParts.push(`Artist: ${artistKeyword}`);
  if (durationMinutes) explanationParts.push(`Session: ~${durationMinutes} mins`);

  const explanation =
    explanationParts.length > 0
      ? `Parsed intent: ${explanationParts.join(' • ')}.`
      : 'Searching catalog titles, artists, lyrics, and genres.';

  const fallbackSuggestions = [
    'Rainy evening ke liye soft Hindi songs',
    'Play energetic tracks for a long drive',
    'Something peaceful for 30 minutes of studying',
    'Purane classic romantic gaane',
    'Sufi peace for late night',
  ];

  return {
    originalQuery: rawQuery,
    detectedMood,
    detectedLanguage,
    detectedGenre,
    detectedTempo,
    detectedActivity,
    durationMinutes,
    artistKeyword,
    filters,
    explanation,
    matchedTracks: candidates,
    fallbackSuggestions,
  };
}
