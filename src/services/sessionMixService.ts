import { TRACKS } from '../data/catalog';
import { Track, MoodTag } from '../types/music';

export type MomentId =
  | 'focus'
  | 'unwind'
  | 'drive'
  | 'morning'
  | 'latenight'
  | 'nostalgia'
  | 'discover';

export interface MomentMixConfig {
  id: MomentId;
  title: string;
  tagline: string;
  description: string;
  emoji: string;
  gradient: string;
  targetTempo?: 'slow' | 'medium' | 'fast';
  preferredMoods: MoodTag[];
  defaultDurationMinutes: number;
}

export interface MomentMixResult {
  config: MomentMixConfig;
  targetDurationMinutes: number;
  actualDurationSeconds: number;
  tracks: Track[];
  explanation: string;
}

export const MOMENT_CONFIGS: Record<MomentId, MomentMixConfig> = {
  focus: {
    id: 'focus',
    title: 'Deep Focus & Study',
    tagline: 'Steady acoustic rhythm for concentration',
    description: 'Subtle acoustic melodies, mellow lo-fi beats, and distraction-free instrumental calm.',
    emoji: '🧠',
    gradient: 'from-indigo-600 via-slate-800 to-indigo-950',
    targetTempo: 'slow',
    preferredMoods: ['focus', 'chill'],
    defaultDurationMinutes: 30,
  },
  unwind: {
    id: 'unwind',
    title: 'Evening Unwind',
    tagline: 'Gentle melodies to ease your evening',
    description: 'Soulful acoustic ballads, rainy day acoustics, and calming vocals to close your day.',
    emoji: '☕',
    gradient: 'from-amber-600 via-rose-900 to-stone-950',
    targetTempo: 'slow',
    preferredMoods: ['chill', 'monsoon', 'romantic'],
    defaultDurationMinutes: 30,
  },
  drive: {
    id: 'drive',
    title: 'Open Road Drive',
    tagline: 'Rhythmic melodies for traveling',
    description: 'Upbeat indie acoustics, Punjabi beats, and melodic anthems for smooth highway miles.',
    emoji: '🚗',
    gradient: 'from-orange-500 via-amber-800 to-zinc-950',
    targetTempo: 'medium',
    preferredMoods: ['energetic', 'romantic'],
    defaultDurationMinutes: 45,
  },
  morning: {
    id: 'morning',
    title: 'Morning Awakening',
    tagline: 'Fresh acoustic dawn energy',
    description: 'Uplifting morning raagas, bright acoustic strumming, and devotional calmness to welcome the sun.',
    emoji: '🌅',
    gradient: 'from-amber-400 via-orange-600 to-rose-950',
    targetTempo: 'medium',
    preferredMoods: ['devotional', 'chill', 'romantic'],
    defaultDurationMinutes: 20,
  },
  latenight: {
    id: 'latenight',
    title: 'Late-Night Calm',
    tagline: 'Soothing peace for the midnight hours',
    description: 'Quiet midnight lo-fi, contemplative Urdu ghazals, and restful strings.',
    emoji: '🌙',
    gradient: 'from-purple-900 via-slate-900 to-black',
    targetTempo: 'slow',
    preferredMoods: ['chill', 'heartbreak', 'devotional'],
    defaultDurationMinutes: 30,
  },
  nostalgia: {
    id: 'nostalgia',
    title: '90s & Classic Nostalgia',
    tagline: 'Golden melodies from cherished memories',
    description: 'Evergreen Hindi classics, historical thumris, and timeless golden era melodies.',
    emoji: '📻',
    gradient: 'from-rose-600 via-amber-700 to-stone-950',
    preferredMoods: ['nostalgic', 'romantic'],
    defaultDurationMinutes: 30,
  },
  discover: {
    id: 'discover',
    title: 'Eclectic Discovery',
    tagline: 'Handpicked cross-regional masterworks',
    description: 'Sufi kalams, Kabir bhajans, and acoustic gems curated across diverse regions and eras.',
    emoji: '✨',
    gradient: 'from-teal-600 via-cyan-900 to-slate-950',
    preferredMoods: ['devotional', 'monsoon', 'chill'],
    defaultDurationMinutes: 40,
  },
};

/**
 * Builds a curated listening session mix for a designated intention and duration.
 */
export function generateMomentMix(
  momentId: MomentId,
  durationMinutes: number = 30,
  userLikedIds: string[] = []
): MomentMixResult {
  const config = MOMENT_CONFIGS[momentId] || MOMENT_CONFIGS.unwind;
  const targetSeconds = durationMinutes * 60;

  // Score candidate tracks according to moment intent
  const scored = [...TRACKS].map((track) => {
    let score = 0;
    // Mood alignment
    for (const m of config.preferredMoods) {
      if (track.moods.includes(m)) score += 3;
    }
    // Tempo alignment
    if (config.targetTempo && track.tempo === config.targetTempo) {
      score += 2;
    }
    // User affinity
    if (userLikedIds.includes(track.id)) {
      score += 1.5;
    }
    return { track, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const selected: Track[] = [];
  const selectedArtists: Record<string, number> = {};
  let accumulatedSeconds = 0;

  // Add tracks respecting target duration and artist diversity
  for (const item of scored) {
    const artist = item.track.artist;
    if ((selectedArtists[artist] || 0) >= 2) continue; // diversity limit
    if (accumulatedSeconds + item.track.duration > targetSeconds + 180 && selected.length >= 2) {
      continue;
    }

    selected.push(item.track);
    selectedArtists[artist] = (selectedArtists[artist] || 0) + 1;
    accumulatedSeconds += item.track.duration;

    if (accumulatedSeconds >= targetSeconds) break;
  }

  // Fallback if catalog is too small
  if (selected.length === 0) {
    selected.push(...TRACKS.slice(0, 4));
    accumulatedSeconds = selected.reduce((sum, t) => sum + t.duration, 0);
  }

  const actualMinutes = Math.round(accumulatedSeconds / 60);

  return {
    config,
    targetDurationMinutes: durationMinutes,
    actualDurationSeconds: accumulatedSeconds,
    tracks: selected,
    explanation: `Curated ${selected.length} tracks (~${actualMinutes} mins) matching your "${config.title}" session intention.`,
  };
}

/**
 * Interactive Session & Sleep Timer Singleton Service
 */
type TimerSubscriber = (remainingSeconds: number | null, isEndOfTrack: boolean) => void;

class SessionTimerService {
  private static instance: SessionTimerService;
  private intervalId: any = null;
  private targetTimestamp: number | null = null;
  private endOfTrackMode: boolean = false;
  private onExpireCallback: (() => void) | null = null;
  private subscribers: Set<TimerSubscriber> = new Set();

  private constructor() {}

  public static getInstance(): SessionTimerService {
    if (!SessionTimerService.instance) {
      SessionTimerService.instance = new SessionTimerService();
    }
    return SessionTimerService.instance;
  }

  public setTimer(
    minutesOrEndOfTrack: number | 'end_of_track',
    onExpire: () => void
  ): void {
    this.cancelTimer();
    this.onExpireCallback = onExpire;

    if (minutesOrEndOfTrack === 'end_of_track') {
      this.endOfTrackMode = true;
      this.targetTimestamp = null;
      this.notifySubscribers(null, true);
      return;
    }

    this.endOfTrackMode = false;
    const durationMs = minutesOrEndOfTrack * 60 * 1000;
    this.targetTimestamp = Date.now() + durationMs;

    this.notifySubscribers(minutesOrEndOfTrack * 60, false);

    this.intervalId = setInterval(() => {
      if (!this.targetTimestamp) return;
      const remainingMs = this.targetTimestamp - Date.now();
      const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000));

      this.notifySubscribers(remainingSeconds, false);

      if (remainingSeconds <= 0) {
        this.triggerExpire();
      }
    }, 1000);
  }

  public handleTrackEnded(): void {
    if (this.endOfTrackMode) {
      this.triggerExpire();
    }
  }

  public cancelTimer(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.targetTimestamp = null;
    this.endOfTrackMode = false;
    this.onExpireCallback = null;
    this.notifySubscribers(null, false);
  }

  public getRemainingSeconds(): number | null {
    if (this.endOfTrackMode) return null;
    if (!this.targetTimestamp) return null;
    const remainingMs = this.targetTimestamp - Date.now();
    return Math.max(0, Math.ceil(remainingMs / 1000));
  }

  public isEndOfTrackActive(): boolean {
    return this.endOfTrackMode;
  }

  public isTimerActive(): boolean {
    return this.endOfTrackMode || this.targetTimestamp !== null;
  }

  public subscribe(fn: TimerSubscriber): () => void {
    this.subscribers.add(fn);
    fn(this.getRemainingSeconds(), this.endOfTrackMode);
    return () => {
      this.subscribers.delete(fn);
    };
  }

  private triggerExpire(): void {
    const callback = this.onExpireCallback;
    this.cancelTimer();
    if (callback) {
      try {
        callback();
      } catch (e) {
        console.warn('Session timer callback error:', e);
      }
    }
  }

  private notifySubscribers(remaining: number | null, isEndOfTrack: boolean): void {
    this.subscribers.forEach((fn) => fn(remaining, isEndOfTrack));
  }
}

export const sessionTimer = SessionTimerService.getInstance();
