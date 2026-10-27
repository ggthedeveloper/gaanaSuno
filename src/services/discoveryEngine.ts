import { TRACKS } from '../data/catalog';
import { Track, MoodTag } from '../types/music';

export type DiscoveryLevel = 'familiar' | 'balanced' | 'experimental';

export interface DiscoveryFeedback {
  moreLikeThisIds: string[];
  notForMeIds: string[];
  lastResetAt?: number;
}

export interface RecommendedTrackItem {
  track: Track;
  explanation: string;
  category: 'core_taste' | 'bridge_discovery' | 'frontier_experimental';
}

export interface BeyondTasteResult {
  level: DiscoveryLevel;
  items: RecommendedTrackItem[];
  summary: string;
  rationale: string;
  affinityProfile: {
    topMoods: MoodTag[];
    topGenres: string[];
    topLanguages: string[];
  };
}

const STORAGE_KEYS = {
  FEEDBACK: 'gaanasuno_discovery_feedback_v1',
  LEVEL: 'gaanasuno_discovery_level_v1',
};

/**
 * Retrieve saved discovery feedback signals from local storage.
 */
export function getDiscoveryFeedback(): DiscoveryFeedback {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACK);
    if (!raw) return { moreLikeThisIds: [], notForMeIds: [] };
    return JSON.parse(raw);
  } catch {
    return { moreLikeThisIds: [], notForMeIds: [] };
  }
}

/**
 * Save user feedback signals to local storage.
 */
export function saveDiscoveryFeedback(feedback: DiscoveryFeedback): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FEEDBACK, JSON.stringify(feedback));
  } catch (err) {
    console.warn('Failed to save discovery feedback:', err);
  }
}

/**
 * Record a positive or negative discovery signal for a track.
 */
export function recordDiscoverySignal(trackId: string, signal: 'more' | 'less'): DiscoveryFeedback {
  const current = getDiscoveryFeedback();
  let moreLikeThisIds = current.moreLikeThisIds.filter((id) => id !== trackId);
  let notForMeIds = current.notForMeIds.filter((id) => id !== trackId);

  if (signal === 'more') {
    moreLikeThisIds.push(trackId);
  } else {
    notForMeIds.push(trackId);
  }

  const updated: DiscoveryFeedback = {
    moreLikeThisIds: moreLikeThisIds.slice(-20),
    notForMeIds: notForMeIds.slice(-20),
  };
  saveDiscoveryFeedback(updated);
  return updated;
}

/**
 * Completely clear discovery signals and reset discovery baseline.
 */
export function resetDiscoverySignals(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.FEEDBACK);
  } catch (err) {
    console.warn('Failed to reset discovery feedback:', err);
  }
}

/**
 * Save current discovery slider level.
 */
export function saveDiscoveryLevel(level: DiscoveryLevel): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LEVEL, level);
  } catch {
    // ignore
  }
}

/**
 * Get current discovery slider level with fallback to 'balanced'.
 */
export function getSavedDiscoveryLevel(): DiscoveryLevel {
  try {
    const lvl = localStorage.getItem(STORAGE_KEYS.LEVEL) as DiscoveryLevel | null;
    if (lvl === 'familiar' || lvl === 'balanced' || lvl === 'experimental') return lvl;
  } catch {
    // fallback
  }
  return 'balanced';
}

/**
 * Deterministic taste affinity extractor based on user history, likes, and explicit signals.
 */
export function extractAffinityProfile(
  likedIds: string[],
  recentIds: string[],
  feedback?: DiscoveryFeedback
) {
  const profileTracks = [...likedIds, ...recentIds]
    .map((id) => TRACKS.find((t) => t.id === id))
    .filter((t): t is Track => Boolean(t));

  const moodCounts: Record<string, number> = {};
  const genreCounts: Record<string, number> = {};
  const langCounts: Record<string, number> = {};

  profileTracks.forEach((t) => {
    t.moods.forEach((m) => {
      moodCounts[m] = (moodCounts[m] || 0) + 1;
    });
    genreCounts[t.genre] = (genreCounts[t.genre] || 0) + 1;
    langCounts[t.language] = (langCounts[t.language] || 0) + 1;
  });

  // Boost explicitly favored items
  if (feedback?.moreLikeThisIds) {
    feedback.moreLikeThisIds.forEach((id) => {
      const t = TRACKS.find((item) => item.id === id);
      if (t) {
        t.moods.forEach((m) => {
          moodCounts[m] = (moodCounts[m] || 0) + 2;
        });
        genreCounts[t.genre] = (genreCounts[t.genre] || 0) + 2;
      }
    });
  }

  const topMoods = Object.entries(moodCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([m]) => m as MoodTag);

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([g]) => g);

  const topLanguages = Object.entries(langCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([l]) => l);

  return {
    topMoods: topMoods.length > 0 ? topMoods : (['romantic', 'chill'] as MoodTag[]),
    topGenres: topGenres.length > 0 ? topGenres : ['Bollywood Romantic', 'Indie Hindi Acoustic'],
    topLanguages: topLanguages.length > 0 ? topLanguages : ['Hindi'],
  };
}

/**
 * Signature "Beyond Your Taste" Recommendation Engine
 *
 * Provides a user-controlled discovery slider between:
 * - Familiar: Deep cuts and high-affinity matches in user's core comfort zone.
 * - Balanced: A tasteful bridge combining familiar mood/tempo with new artists, languages, and genres.
 * - Experimental: Frontier exploration into non-mainstream raagas, classical Sufi poetry, and cross-regional styles.
 */
export function getBeyondTasteRecommendations(params: {
  level: DiscoveryLevel;
  likedIds?: string[];
  recentIds?: string[];
  feedback?: DiscoveryFeedback;
  limit?: number;
  catalog?: Track[];
}): BeyondTasteResult {
  const {
    level,
    likedIds = [],
    recentIds = [],
    feedback = getDiscoveryFeedback(),
    limit = 6,
    catalog = TRACKS,
  } = params;

  if (catalog.length === 0) {
    return {
      level,
      items: [],
      summary: 'Catalog currently empty.',
      rationale: 'No tracks available to build recommendations.',
      affinityProfile: { topMoods: [], topGenres: [], topLanguages: [] },
    };
  }

  const affinity = extractAffinityProfile(likedIds, recentIds, feedback);
  const dismissedSet = new Set(feedback.notForMeIds || []);

  // Filter out tracks the user explicitly dismissed with "Not for me"
  const pool = catalog.filter((t) => !dismissedSet.has(t.id));

  const items: RecommendedTrackItem[] = [];
  const selectedIds = new Set<string>();
  const artistCounts: Record<string, number> = {};

  const canAdd = (track: Track): boolean => {
    if (selectedIds.has(track.id)) return false;
    if ((artistCounts[track.artist] || 0) >= 2) return false; // Diversity cap per artist
    return true;
  };

  const primaryMood = affinity.topMoods[0] || 'romantic';
  const primaryGenre = affinity.topGenres[0] || 'Bollywood Romantic';

  if (level === 'familiar') {
    // 100% familiar matches matching top moods/genres
    const candidates = [...pool].sort((a, b) => {
      const aScore =
        (a.moods.includes(primaryMood) ? 3 : 0) +
        (affinity.topGenres.includes(a.genre) ? 2 : 0) +
        (feedback.moreLikeThisIds.includes(a.id) ? 4 : 0);
      const bScore =
        (b.moods.includes(primaryMood) ? 3 : 0) +
        (affinity.topGenres.includes(b.genre) ? 2 : 0) +
        (feedback.moreLikeThisIds.includes(b.id) ? 4 : 0);
      return bScore - aScore;
    });

    for (const track of candidates) {
      if (canAdd(track)) {
        selectedIds.add(track.id);
        artistCounts[track.artist] = (artistCounts[track.artist] || 0) + 1;
        items.push({
          track,
          category: 'core_taste',
          explanation: `Recommended because you enjoy ${track.genre.toLowerCase()} and ${track.moods[0] || 'melodic'} sounds.`,
        });
        if (items.length >= limit) break;
      }
    }
  } else if (level === 'balanced') {
    // 50% Familiar core + 50% Bridge exploration
    const coreCandidates = pool.filter(
      (t) => t.moods.includes(primaryMood) || affinity.topGenres.includes(t.genre)
    );
    const bridgeCandidates = pool.filter(
      (t) =>
        !affinity.topGenres.includes(t.genre) ||
        t.language !== affinity.topLanguages[0] ||
        t.genre.includes('Sufi') ||
        t.genre.includes('Folk') ||
        t.genre.includes('Acoustic')
    );

    // Pick familiar core items
    for (const track of coreCandidates) {
      if (canAdd(track)) {
        selectedIds.add(track.id);
        artistCounts[track.artist] = (artistCounts[track.artist] || 0) + 1;
        items.push({
          track,
          category: 'core_taste',
          explanation: `Rooted in your familiar comfort: soulful ${track.genre} rhythm.`,
        });
        if (items.length >= Math.ceil(limit / 2)) break;
      }
    }

    // Pick bridge discovery items
    for (const track of bridgeCandidates) {
      if (canAdd(track)) {
        selectedIds.add(track.id);
        artistCounts[track.artist] = (artistCounts[track.artist] || 0) + 1;
        const bridgeReason =
          track.language !== 'Hindi'
            ? `Suggested because you like ${primaryGenre}; this introduces an authentic ${track.language} soundscape.`
            : `Shared emotional vibe with ${primaryMood}, but expands into ${track.genre}.`;
        items.push({
          track,
          category: 'bridge_discovery',
          explanation: bridgeReason,
        });
        if (items.length >= limit) break;
      }
    }
  } else {
    // Experimental: Frontier territory (Public domain raagas, sufi kalams, regional acoustics)
    const experimentalCandidates = [...pool].sort((a, b) => {
      // Prioritize genres not in top genres, or traditional/heritage forms
      const aIsFrontier = !affinity.topGenres.includes(a.genre) ? 2 : 0;
      const bIsFrontier = !affinity.topGenres.includes(b.genre) ? 2 : 0;
      const aIsClassical = a.genre.includes('Classical') || a.genre.includes('Sufi') || a.language !== 'Hindi' ? 3 : 0;
      const bIsClassical = b.genre.includes('Classical') || b.genre.includes('Sufi') || b.language !== 'Hindi' ? 3 : 0;
      return bIsFrontier + bIsClassical - (aIsFrontier + aIsClassical);
    });

    for (const track of experimentalCandidates) {
      if (canAdd(track)) {
        selectedIds.add(track.id);
        artistCounts[track.artist] = (artistCounts[track.artist] || 0) + 1;
        items.push({
          track,
          category: 'frontier_experimental',
          explanation: `Stepping into new territory: ${track.genre} by ${track.artist} (${track.year}).`,
        });
        if (items.length >= limit) break;
      }
    }
  }

  // Fallback if pool is small
  if (items.length < limit) {
    for (const track of pool) {
      if (canAdd(track)) {
        selectedIds.add(track.id);
        items.push({
          track,
          category: 'bridge_discovery',
          explanation: `Catalog discovery: handcrafted ${track.genre}.`,
        });
        if (items.length >= limit) break;
      }
    }
  }

  const summaries: Record<DiscoveryLevel, string> = {
    familiar: 'Familiar Comfort: Curated tracks aligned with your most played moods and genres.',
    balanced: 'Balanced Discovery: Half your usual vibe, half new musical horizons and acoustic styles.',
    experimental: 'Frontier Territory: Uncharted raagas, poetry, and regional folk outside your rotation.',
  };

  const rationales: Record<DiscoveryLevel, string> = {
    familiar: `Anchored around your interest in ${primaryGenre} and ${primaryMood} listening sessions.`,
    balanced: `Bridging your love for ${primaryGenre} with varied regional languages and acoustic forms.`,
    experimental: `Intentionally introduces diverse genres and historical roots to expand musical taste.`,
  };

  return {
    level,
    items,
    summary: summaries[level],
    rationale: rationales[level],
    affinityProfile: affinity,
  };
}

/**
 * Randomize discovery pool for the "Surprise Me" instant trigger.
 */
export function surpriseMeDiscovery(allTracks: Track[] = TRACKS): Track[] {
  const shuffled = [...allTracks].sort(() => Math.random() - 0.5);
  // Pick 5 varied tracks with distinct genres
  const seenGenres = new Set<string>();
  const results: Track[] = [];

  for (const track of shuffled) {
    if (!seenGenres.has(track.genre)) {
      seenGenres.add(track.genre);
      results.push(track);
      if (results.length >= 5) break;
    }
  }
  return results.length > 0 ? results : shuffled.slice(0, 5);
}
