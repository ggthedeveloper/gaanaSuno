import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Track, Playlist, Artist, MoodTag } from '../types/music';
import { searchCatalog } from '../services/recommendation';
import { parseMusicIntent } from '../services/intentParser';
import { PLAYLISTS, ARTISTS, MOOD_OPTIONS } from '../data/catalog';
import { TrackRow } from '../components/music/TrackRow';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { useAudio } from '../context/AudioContext';
import { searchYouTubeMusic, getTrendingIndianMusic } from '../services/youtubeService';
import { formatTime } from '../utils/formatters';
import {
  Search,
  Sparkles,
  X,
  Music,
  Disc,
  User,
  Command,
  Play,
  Plus,
  Flame,
  Loader2,
} from 'lucide-react';

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface SearchViewProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onSelectArtist: (artist: Artist) => void;
  onSelectTrack: (track: Track) => void;
}

export function extractYouTubeId(urlOrId: string): string | null {
  const clean = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
  const match = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

const POPULAR_SUGGESTIONS = [
  'Diljit Dosanjh',
  'Arijit Singh',
  'Shreya Ghoshal',
  'A.R. Rahman',
  'Anuv Jain',
  'Coke Studio',
  'The Local Train',
  'Kishore Kumar',
  'Sant Kabir',
  'Morning Ragas',
];

const NATURAL_INTENT_PROMPTS = [
  { label: '🌧️ Rainy evening soft Hindi songs', query: 'Rainy evening ke liye soft Hindi songs' },
  { label: '🚗 Energetic long drive songs', query: 'Play energetic tracks for a long drive' },
  { label: '📚 Peaceful 30m study tracks', query: 'Something peaceful for 30 minutes of studying' },
  { label: '📻 90s Classic romantic hits', query: 'Purane classic romantic gaane' },
  { label: '✨ Late night Sufi peace', query: 'Sufi peace for late night' },
];

export const SearchView: React.FC<SearchViewProps> = ({
  searchQuery,
  onSearchChange,
  onSelectPlaylist,
  onSelectArtist,
  onSelectTrack,
}) => {
  const { playTrack, addToQueue } = useAudio();
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<MoodTag | 'all'>('all');
  const [filterOverrides, setFilterOverrides] = useState<Record<string, string | undefined>>({});
  const [ytMetadata, setYtMetadata] = useState<{ title: string; author: string } | null>(null);
  const [ytLoading, setYtLoading] = useState(false);
  const [ytSearchResults, setYtSearchResults] = useState<Track[]>([]);
  const [ytTrendingTracks, setYtTrendingTracks] = useState<Track[]>([]);
  const [isYtSearching, setIsYtSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'curated' | 'youtube'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Load live YouTube trending music on initial mount
  useEffect(() => {
    let active = true;
    getTrendingIndianMusic(12).then((tracks) => {
      if (active && tracks.length > 0) {
        setYtTrendingTracks(tracks);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Compute Natural-Language Intent
  const parsedIntent = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) return null;
    return parseMusicIntent(searchQuery, filterOverrides);
  }, [searchQuery, filterOverrides]);

  const isIntentMode = Boolean(parsedIntent && parsedIntent.filters.length > 0);
  const detectedYtId = useMemo(() => extractYouTubeId(searchQuery), [searchQuery]);

  // Live YouTube Search via YouTube Data v3 API with 350ms debounce
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed || trimmed.length < 2 || detectedYtId) {
      setYtSearchResults([]);
      setIsYtSearching(false);
      return;
    }

    setIsYtSearching(true);
    const timer = setTimeout(() => {
      searchYouTubeMusic(trimmed, 15)
        .then((results) => {
          setYtSearchResults(results);
        })
        .finally(() => {
          setIsYtSearching(false);
        });
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, detectedYtId]);

  // Direct YouTube Link Detection
  useEffect(() => {
    if (!detectedYtId) {
      setYtMetadata(null);
      return;
    }
    let active = true;
    setYtLoading(true);
    fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${detectedYtId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data && data.title) {
          setYtMetadata({
            title: data.title,
            author: data.author_name || 'YouTube Audio',
          });
        } else {
          setYtMetadata({
            title: `YouTube Stream (${detectedYtId})`,
            author: 'Direct YouTube Stream',
          });
        }
      })
      .catch(() => {
        if (!active) return;
        setYtMetadata({
          title: `YouTube Stream (${detectedYtId})`,
          author: 'Direct YouTube Stream',
        });
      })
      .finally(() => {
        if (active) setYtLoading(false);
      });

    return () => {
      active = false;
    };
  }, [detectedYtId]);

  const handlePlayDetectedYt = (id: string, customTitle?: string, customArtist?: string) => {
    const trackObj: Track = {
      id: `yt-stream-${id}`,
      title: customTitle || ytMetadata?.title || `YouTube Audio (${id})`,
      titleDevanagari: customTitle || ytMetadata?.title || 'YouTube Audio',
      artist: customArtist || ytMetadata?.author || 'YouTube Stream',
      artistDevanagari: customArtist || ytMetadata?.author || 'YouTube Stream',
      album: 'YouTube Music Portal',
      duration: 260,
      coverUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      youtubeId: id,
      audioUrl: `https://www.youtube.com/watch?v=${id}`,
      moods: ['chill'],
      genre: 'YouTube Direct',
      year: new Date().getFullYear(),
      language: 'Hindi',
      licenseNote: 'Direct YouTube Stream via Official Player',
    };
    playTrack(trackObj);
  };

  const handleQueueDetectedYt = (id: string, customTitle?: string, customArtist?: string) => {
    const trackObj: Track = {
      id: `yt-stream-${id}`,
      title: customTitle || ytMetadata?.title || `YouTube Audio (${id})`,
      titleDevanagari: customTitle || ytMetadata?.title || 'YouTube Audio',
      artist: customArtist || ytMetadata?.author || 'YouTube Stream',
      artistDevanagari: customArtist || ytMetadata?.author || 'YouTube Stream',
      album: 'YouTube Music Portal',
      duration: 260,
      coverUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      youtubeId: id,
      audioUrl: `https://www.youtube.com/watch?v=${id}`,
      moods: ['chill'],
      genre: 'YouTube Direct',
      year: new Date().getFullYear(),
      language: 'Hindi',
      licenseNote: 'Direct YouTube Stream via Official Player',
    };
    addToQueue(trackObj);
  };

  // Global `/` keyboard shortcut to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const { tracks, playlists } = useMemo(() => {
    if (isIntentMode && parsedIntent) {
      const moodFilteredPlaylists = parsedIntent.detectedMood
        ? PLAYLISTS.filter((p) => p.mood === parsedIntent.detectedMood)
        : PLAYLISTS;
      return {
        tracks: parsedIntent.matchedTracks,
        playlists: moodFilteredPlaylists,
      };
    }
    return searchCatalog(searchQuery, selectedMoodFilter);
  }, [searchQuery, selectedMoodFilter, isIntentMode, parsedIntent]);

  const matchingArtists = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ARTISTS;
    return ARTISTS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.nameDevanagari.includes(q) ||
        a.bio.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalCuratedResults = tracks.length + playlists.length + (searchQuery ? matchingArtists.length : 0);
  const totalResults = totalCuratedResults + ytSearchResults.length;

  return (
    <div className="space-y-8 pb-16 animate-fade-in select-none">
      {/* Search Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] p-6 sm:p-8 bg-gradient-to-br from-surface via-surface-subtle to-surface border border-border shadow-xl">
        <div className="absolute top-0 right-1/4 -mt-16 w-80 h-80 rounded-full bg-accent/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>YouTube Data v3 Powered Search</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
            Search any Indian song or artist
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1 font-medium">
            Search millions of songs live on YouTube Music or explore curated classics with 100% loss-free playback.
          </p>

          {/* Search Input Bar */}
          <div className="relative mt-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search any song, artist, album (e.g. 'Diljit Dosanjh', 'Kesariya', 'Coke Studio')..."
              aria-label="Ask GaanaSuno search"
              autoFocus
              className="w-full pl-12 pr-28 py-4 rounded-2xl bg-surface/90 backdrop-blur-xl border border-border text-foreground placeholder:text-foreground-muted/60 text-sm focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all shadow-2xl"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isYtSearching && (
                <Loader2 className="w-4 h-4 text-accent animate-spin" />
              )}
              {searchQuery ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => onSearchChange('')}
                  className="p-1 rounded-full text-foreground-muted hover:text-foreground hover:bg-surface-active transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-surface-subtle border border-border text-foreground-subtle">
                  <Command className="w-2.5 h-2.5" />
                  <span>/</span>
                </span>
              )}
            </div>
          </div>

          {/* Understood Natural Intent Feedback Strip */}
          {isIntentMode && parsedIntent && (
            <div className="mt-3.5 p-3 rounded-2xl bg-accent/10 border border-accent/25 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-accent">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Understood Music Intent</span>
                </div>
                <span className="text-[10px] uppercase font-mono font-medium text-foreground-muted">
                  Tap × to dismiss filter
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {parsedIntent.filters.map((f) => (
                  <span
                    key={f.key}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface border border-accent/30 text-xs font-semibold text-foreground shadow-sm"
                  >
                    <span className="text-accent font-bold">{f.label}:</span>
                    <span>{f.value}</span>
                    <button
                      type="button"
                      onClick={() => setFilterOverrides((prev) => ({ ...prev, [f.key]: undefined }))}
                      className="p-0.5 rounded-full hover:bg-surface-active text-foreground-muted hover:text-foreground cursor-pointer"
                      aria-label={`Remove ${f.label} filter`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <p className="text-[11px] text-foreground-muted font-medium">
                {parsedIntent.explanation}
              </p>
            </div>
          )}

          {/* Quick Popular Keyword Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted mr-1">
              Top Artists & Searches:
            </span>
            {POPULAR_SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => onSearchChange(sug)}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-subtle hover:bg-surface-hover text-foreground-muted hover:text-foreground border border-border hover:border-accent/30 transition-all cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Natural Intent Suggestions */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted mr-1">
              Try Intent Prompts:
            </span>
            {NATURAL_INTENT_PROMPTS.map((prompt) => (
              <button
                key={prompt.query}
                type="button"
                onClick={() => onSearchChange(prompt.query)}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent/10 hover:bg-accent/20 text-foreground border border-accent/20 hover:border-accent/40 transition-all cursor-pointer"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Mood Filter Chips */}
          <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            <button
              type="button"
              onClick={() => setSelectedMoodFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedMoodFilter === 'all'
                  ? 'bg-accent text-accent-foreground shadow-md'
                  : 'bg-surface hover:bg-surface-hover border border-border text-foreground-muted'
              }`}
            >
              All Vibes
            </button>
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.id}
                type="button"
                onClick={() =>
                  setSelectedMoodFilter(selectedMoodFilter === mood.id ? 'all' : mood.id)
                }
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedMoodFilter === mood.id
                    ? 'bg-accent text-accent-foreground shadow-md'
                    : 'bg-surface hover:bg-surface-hover border border-border text-foreground-muted'
                }`}
              >
                <span>{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Direct YouTube Link Detection */}
      {detectedYtId && (
        <div className="relative overflow-hidden rounded-[2rem] p-6 sm:p-7 bg-gradient-to-r from-red-950/50 via-surface to-amber-950/40 border-2 border-red-500/40 shadow-2xl animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-36 h-24 sm:w-44 sm:h-28 shrink-0 rounded-2xl overflow-hidden shadow-lg border border-border bg-black">
              <img
                src={`https://img.youtube.com/vi/${detectedYtId}/hqdefault.jpg`}
                alt="YouTube Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                <span className="text-[10px] font-mono text-red-400 font-bold flex items-center gap-1">
                  <YouTubeIcon className="w-3.5 h-3.5" />
                  YouTube Link
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>YouTube Stream Ready</span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-foreground truncate">
                {ytLoading ? 'Fetching video information...' : ytMetadata?.title || `YouTube Audio (${detectedYtId})`}
              </h3>
              <p className="text-xs text-foreground-muted truncate">
                {ytMetadata?.author || 'YouTube Channel'} • Lossless Web Streaming
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handlePlayDetectedYt(detectedYtId)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Stream on Player</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQueueDetectedYt(detectedYtId)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-border text-foreground font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Queue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* When no query is typed: Show Trending on YouTube Music India */}
      {!searchQuery.trim() && ytTrendingTracks.length > 0 && (
        <section className="bg-surface/50 p-5 sm:p-7 rounded-[2rem] border border-border shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg sm:text-xl text-foreground flex items-center gap-2">
                  <span>Trending on YouTube Music</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-bold">
                    India Charts
                  </span>
                </h3>
                <p className="text-xs text-foreground-muted">
                  Live popular tracks streaming right now across India
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => playTrack(ytTrendingTracks[0], ytTrendingTracks)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play All</span>
            </button>
          </div>

          <div className="rounded-2xl border border-border divide-y divide-border/60 overflow-hidden bg-surface/40">
            {ytTrendingTracks.map((track, idx) => (
              <div
                key={track.id}
                className="flex items-center justify-between p-3 sm:p-3.5 hover:bg-surface-hover transition-colors group cursor-pointer"
                onClick={() => playTrack(track, ytTrendingTracks)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-5 text-center text-xs font-mono font-bold text-foreground-muted group-hover:text-accent">
                    {idx + 1}
                  </span>
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-black border border-border">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-foreground truncate group-hover:text-accent transition-colors">
                      {track.title}
                    </h4>
                    <p className="text-xs text-foreground-muted truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-mono font-semibold text-foreground-muted">
                    {formatTime(track.duration)}
                  </span>
                  <button
                    type="button"
                    aria-label="Add to Queue"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToQueue(track);
                    }}
                    className="p-1.5 rounded-lg text-foreground-muted hover:text-accent hover:bg-surface-active transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Search Results Filter Tabs (Curated vs Live YouTube Music) */}
      {searchQuery.trim() && (
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'bg-surface hover:bg-surface-hover text-foreground-muted hover:text-foreground'
            }`}
          >
            All Results ({totalResults})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'youtube'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-surface hover:bg-surface-hover text-foreground-muted hover:text-foreground'
            }`}
          >
            <YouTubeIcon className="w-3.5 h-3.5 text-red-500" />
            <span>YouTube Live Music ({ytSearchResults.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('curated')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'curated'
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'bg-surface hover:bg-surface-hover text-foreground-muted hover:text-foreground'
            }`}
          >
            Curated Sanctuary ({totalCuratedResults})
          </button>
        </div>
      )}

      {/* Results Rendering */}
      {searchQuery.trim() && totalResults === 0 && !isYtSearching ? (
        <div className="text-center py-16 bg-surface/40 rounded-[2rem] border border-border p-8 shadow-xl">
          <Sparkles className="w-12 h-12 text-accent/50 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-foreground">
            No matching tracks found for "{searchQuery}"
          </h3>
          <p className="text-xs sm:text-sm text-foreground-muted max-w-md mx-auto mt-2">
            Try searching for artists like "Arijit", "Diljit", "Shreya", "Rahman", or paste any YouTube URL.
          </p>
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              setSelectedMoodFilter('all');
            }}
            className="mt-5 px-5 py-2.5 rounded-full bg-accent text-accent-foreground text-xs font-extrabold hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            Clear Filters & View Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Live YouTube Music Search Results */}
          {(activeTab === 'all' || activeTab === 'youtube') && ytSearchResults.length > 0 && (
            <section className="bg-surface/40 p-5 sm:p-7 rounded-[1.75rem] border border-border shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <YouTubeIcon className="w-4 h-4 text-red-500" />
                  <h3 className="font-extrabold text-lg sm:text-xl text-foreground">
                    Live YouTube Music ({ytSearchResults.length})
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">
                  YouTube Data v3
                </span>
              </div>

              <div className="rounded-2xl border border-border divide-y divide-border/60 overflow-hidden bg-surface/30">
                {ytSearchResults.map((track, idx) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-3 hover:bg-surface-hover transition-colors group cursor-pointer"
                    onClick={() => playTrack(track, ytSearchResults)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-5 text-center text-xs font-mono font-bold text-foreground-muted group-hover:text-accent">
                        {idx + 1}
                      </span>
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-black border border-border">
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-4 h-4 text-white fill-current" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-foreground truncate group-hover:text-accent transition-colors">
                          {track.title}
                        </h4>
                        <p className="text-xs text-foreground-muted truncate">
                          {track.artist} • {track.album}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-semibold text-foreground-muted">
                        {formatTime(track.duration)}
                      </span>
                      <button
                        type="button"
                        aria-label="Add to Queue"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToQueue(track);
                        }}
                        className="p-1.5 rounded-lg text-foreground-muted hover:text-accent hover:bg-surface-active transition-colors"
                        title="Add to queue"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Curated Matching Songs */}
          {(activeTab === 'all' || activeTab === 'curated') && tracks.length > 0 && (
            <section className="bg-surface/40 p-5 sm:p-7 rounded-[1.75rem] border border-border shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-4 h-4 text-accent" />
                <h3 className="font-extrabold text-lg sm:text-xl text-foreground">
                  Curated Songs ({tracks.length})
                </h3>
              </div>

              <div className="rounded-2xl border border-border divide-y divide-border/60 overflow-hidden bg-surface/30">
                {tracks.map((track, idx) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={idx}
                    queueContext={tracks}
                    onOpenDetail={onSelectTrack}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Matching Playlists */}
          {(activeTab === 'all' || activeTab === 'curated') && playlists.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Disc className="w-4 h-4 text-accent" />
                <h3 className="font-extrabold text-lg sm:text-xl text-foreground">
                  Playlists ({playlists.length})
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
                {playlists.map((playlist) => (
                  <PlaylistCard
                    key={playlist.id}
                    playlist={playlist}
                    onSelect={onSelectPlaylist}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Matching Artists */}
          {(activeTab === 'all' || activeTab === 'curated') && matchingArtists.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-accent" />
                <h3 className="font-extrabold text-lg sm:text-xl text-foreground">
                  Artists & Maestros ({matchingArtists.length})
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {matchingArtists.map((artist) => (
                  <ArtistCard
                    key={artist.id}
                    artist={artist}
                    onSelect={onSelectArtist}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
