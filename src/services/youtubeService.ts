import { Track, MoodTag } from '../types/music';
import { storage } from './storage';

export const YOUTUBE_API_KEY = 'AIzaSyDETX0Dwk6VsWOFcLt3Umckc9J5pZp6Hm0';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Cache expiration: 12 hours
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheItem<any>>();

function getCached<T>(key: string): T | null {
  // Check memory
  const mem = memoryCache.get(key);
  if (mem && Date.now() - mem.timestamp < CACHE_TTL_MS) {
    return mem.data as T;
  }
  // Check localStorage
  try {
    const raw = localStorage.getItem(`yt_cache_${key}`);
    if (raw) {
      const parsed: CacheItem<T> = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        memoryCache.set(key, parsed);
        return parsed.data;
      }
    }
  } catch {}
  return null;
}

function setCached<T>(key: string, data: T): void {
  const item: CacheItem<T> = { data, timestamp: Date.now() };
  memoryCache.set(key, item);
  try {
    localStorage.setItem(`yt_cache_${key}`, JSON.stringify(item));
  } catch {}
}

/**
 * Parses ISO 8601 duration format (e.g., PT3M45S, PT1H2M10S) into seconds.
 */
export function parseISO8601Duration(iso: string): number {
  if (!iso) return 210;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 210;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  const total = hours * 3600 + minutes * 60 + seconds;
  return total > 0 ? total : 210;
}

/**
 * Cleans noisy YouTube titles and extracts clean Song Title, Artist, and Album.
 */
export function parseYouTubeMusicTitle(rawTitle: string, channelTitle = ''): {
  title: string;
  artist: string;
  album: string;
} {
  // Decode common HTML entities
  let clean = rawTitle
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

  // Strip common noisy suffixes
  clean = clean.replace(
    /(\(|\[)?(Official\s*(Music\s*)?(Video|Audio|Song|Lyrical|Track)?|4K|HD|Full\s*Video|Full\s*Song|Video\s*Song|Remastered|Studio\s*Version|Audio\s*Track|Visualizer)(\)|\])?/gi,
    ''
  );
  clean = clean.replace(/#\w+/g, ''); // strip hashtags
  clean = clean.trim();

  let title = clean;
  let artist = channelTitle.replace(/ - Topic|VEVO|Entertainment|Music India|Official/gi, '').trim() || 'Various Artists';
  let album = 'Single / Soundtrack';

  // Check delimiter patterns
  if (clean.includes(':')) {
    // e.g. "Diljit Dosanjh: LOVER | Raj Ranjodh | MoonChild Era"
    const parts = clean.split(':').map((p) => p.trim());
    artist = parts[0];
    const rest = parts.slice(1).join(' ');
    title = rest.split('|')[0].trim();
    if (rest.includes('|')) {
      const subParts = rest.split('|').map((s) => s.trim());
      album = subParts[subParts.length - 1];
    }
  } else if (clean.includes(' - ')) {
    const parts = clean.split(' - ').map((p) => p.trim());
    if (parts.length >= 2) {
      // e.g. "Kesariya - Brahmāstra | Ranbir Kapoor... | Arijit Singh"
      title = parts[0];
      const remainder = parts.slice(1).join(' - ');
      const subParts = remainder.split('|').map((s) => s.trim());
      if (subParts.length >= 1) {
        album = subParts[0];
      }
      if (subParts.length >= 2) {
        artist = subParts[subParts.length - 1];
      }
    }
  } else if (clean.includes('|')) {
    const parts = clean.split('|').map((p) => p.trim());
    if (parts.length >= 2) {
      if (
        parts[0].toLowerCase().includes('coke studio') ||
        parts[0].toLowerCase().includes('season') ||
        parts[0].toLowerCase().includes('episode')
      ) {
        album = parts[0];
        title = parts[1];
        if (parts.length > 2) {
          artist = parts[2];
        }
      } else {
        title = parts[0];
        if (parts.length > 1) {
          album = parts[1];
        }
        if (parts.length > 2) {
          artist = parts[2];
        }
      }
    }
  }

  // Clean remaining punctuation from title
  title = title.replace(/^[\s-:–—|]+|[\s-:–—|]+$/g, '').trim();
  artist = artist.replace(/^[\s-:–—|]+|[\s-:–—|]+$/g, '').trim();

  return {
    title: title || rawTitle,
    artist: artist || channelTitle || 'Indian Music Artist',
    album: album || 'GaanaSuno Live Music',
  };
}

/**
 * Infers musical moods from title, tags, and channel metadata.
 */
function inferMoodsFromMetadata(text: string): MoodTag[] {
  const lower = text.toLowerCase();
  const moods: MoodTag[] = [];

  if (lower.includes('love') || lower.includes('romantic') || lower.includes('ishq') || lower.includes('pyaar') || lower.includes('dil') || lower.includes('shringara')) {
    moods.push('romantic');
  }
  if (lower.includes('sad') || lower.includes('dard') || lower.includes('judaai') || lower.includes('heartbreak') || lower.includes('bewafa') || lower.includes('tanhai')) {
    moods.push('heartbreak');
  }
  if (lower.includes('sufi') || lower.includes('bhajan') || lower.includes('devotional') || lower.includes('qawwali') || lower.includes('krishna') || lower.includes('shiva') || lower.includes('aarti') || lower.includes('mantra')) {
    moods.push('devotional', 'spiritual');
  }
  if (lower.includes('lofi') || lower.includes('lo-fi') || lower.includes('chill') || lower.includes('acoustic') || lower.includes('unplugged') || lower.includes('slowed') || lower.includes('reverb')) {
    moods.push('chill');
  }
  if (lower.includes('party') || lower.includes('dance') || lower.includes('bhangra') || lower.includes('dhol') || lower.includes('club') || lower.includes('dj') || lower.includes('energetic')) {
    moods.push('party', 'energetic');
  }
  if (lower.includes('rain') || lower.includes('baarish') || lower.includes('barso') || lower.includes('monsoon') || lower.includes('rimjhim')) {
    moods.push('monsoon');
  }
  if (lower.includes('raag') || lower.includes('raga') || lower.includes('sitar') || lower.includes('bansuri') || lower.includes('flute') || lower.includes('classical') || lower.includes('meditation')) {
    moods.push('focus');
  }
  if (lower.includes('90s') || lower.includes('retro') || lower.includes('evergreen') || lower.includes('purane') || lower.includes('classic') || lower.includes('kishore') || lower.includes('rafi') || lower.includes('lata')) {
    moods.push('nostalgic');
  }

  // Fallback default
  if (moods.length === 0) {
    moods.push('romantic', 'chill');
  }

  return Array.from(new Set(moods));
}

/**
 * Transforms raw YouTube Video and Snippet items into GaanaSuno Track objects.
 */
function transformYouTubeItemToTrack(item: any): Track {
  const videoId = typeof item.id === 'string' ? item.id : item.id?.videoId;
  const snippet = item.snippet || {};
  const contentDetails = item.contentDetails || {};

  const { title, artist, album } = parseYouTubeMusicTitle(snippet.title || '', snippet.channelTitle || '');
  const duration = parseISO8601Duration(contentDetails.duration || 'PT3M30S');

  // Choose the highest resolution thumbnail available
  const thumbnails = snippet.thumbnails || {};
  const coverUrl =
    thumbnails.maxres?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  const metaString = `${snippet.title || ''} ${snippet.description || ''} ${(snippet.tags || []).join(' ')}`;
  const moods = inferMoodsFromMetadata(metaString);

  const track: Track = {
    id: `yt-${videoId}`,
    title,
    titleDevanagari: title,
    artist,
    artistDevanagari: artist,
    album,
    albumDevanagari: album,
    duration,
    coverUrl,
    youtubeId: videoId,
    audioUrl: `https://www.youtube.com/watch?v=${videoId}`,
    moods,
    genre: snippet.channelTitle?.includes('Sufi') ? 'Sufi & Devotional' : 'Indian Music',
    year: snippet.publishedAt ? new Date(snippet.publishedAt).getFullYear() : 2024,
    language: 'Hindi',
    licenseNote: `Official YouTube Music stream by ${snippet.channelTitle || 'Artist'}. Streamed legally via YouTube IFrame API.`,
    vibeDescription: snippet.description
      ? snippet.description.slice(0, 150).replace(/\n/g, ' ') + '...'
      : 'Authentic Indian music experience streamed via YouTube.',
    tempo: duration > 280 ? 'slow' : duration < 190 ? 'fast' : 'medium',
  };

  // Cache in storage so any liked track or playlist addition retains full metadata
  storage.saveDynamicTrack(track);

  return track;
}

/**
 * Searches YouTube for Indian music using the YouTube Data v3 API.
 */
export async function searchYouTubeMusic(query: string, maxResults = 15): Promise<Track[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const cacheKey = `search_${trimmed.toLowerCase()}_${maxResults}`;
  const cached = getCached<Track[]>(cacheKey);
  if (cached) return cached;

  try {
    // 1. Search videos in category 10 (Music)
    const searchParams = new URLSearchParams({
      part: 'snippet',
      q: `${trimmed} music song`,
      type: 'video',
      videoCategoryId: '10',
      maxResults: String(maxResults),
      key: YOUTUBE_API_KEY,
    });

    const searchRes = await fetch(`${BASE_URL}/search?${searchParams.toString()}`);
    if (!searchRes.ok) {
      console.warn('YouTube search API error status:', searchRes.status);
      return [];
    }

    const searchData = await searchRes.json();
    const items = searchData.items || [];
    const videoIds = items
      .map((i: any) => i.id?.videoId)
      .filter((id: any): id is string => Boolean(id));

    if (videoIds.length === 0) return [];

    // 2. Fetch detailed video metrics (durations, high-res thumbnails, content details)
    const detailsParams = new URLSearchParams({
      part: 'snippet,contentDetails',
      id: videoIds.join(','),
      key: YOUTUBE_API_KEY,
    });

    const detailsRes = await fetch(`${BASE_URL}/videos?${detailsParams.toString()}`);
    if (!detailsRes.ok) {
      // Fallback to basic snippet results
      const fallbackTracks = items.map(transformYouTubeItemToTrack);
      setCached(cacheKey, fallbackTracks);
      return fallbackTracks;
    }

    const detailsData = await detailsRes.json();
    const detailedItems = detailsData.items || [];

    const tracks = detailedItems.map(transformYouTubeItemToTrack);
    setCached(cacheKey, tracks);
    return tracks;
  } catch (err) {
    console.warn('YouTube search API exception:', err);
    return [];
  }
}

/**
 * Fetches Live Trending Indian Music from YouTube India Charts.
 */
export async function getTrendingIndianMusic(maxResults = 15): Promise<Track[]> {
  const cacheKey = `trending_in_${maxResults}`;
  const cached = getCached<Track[]>(cacheKey);
  if (cached) return cached;

  try {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      chart: 'mostPopular',
      regionCode: 'IN',
      videoCategoryId: '10',
      maxResults: String(maxResults),
      key: YOUTUBE_API_KEY,
    });

    const res = await fetch(`${BASE_URL}/videos?${params.toString()}`);
    if (!res.ok) {
      console.warn('Trending YouTube API response error:', res.status);
      return [];
    }

    const data = await res.json();
    const items = data.items || [];
    const tracks = items.map(transformYouTubeItemToTrack);

    setCached(cacheKey, tracks);
    return tracks;
  } catch (err) {
    console.warn('Trending YouTube fetch failed:', err);
    return [];
  }
}

/**
 * Fetches related tracks based on a given track for endless discovery.
 */
export async function getRelatedMusic(track: Track, maxResults = 8): Promise<Track[]> {
  const query = `${track.artist} ${track.genre} Hindi song`;
  return searchYouTubeMusic(query, maxResults);
}
