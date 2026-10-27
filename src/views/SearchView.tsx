import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Track, Playlist, Artist, MoodTag } from '../types/music';
import { searchCatalog } from '../services/recommendation';
import { ARTISTS, MOOD_OPTIONS } from '../data/catalog';
import { TrackRow } from '../components/music/TrackRow';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { useAudio } from '../context/AudioContext';
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

const YOUTUBE_PRESETS = [
  { title: 'Tum Hi Ho', artist: 'Arijit Singh', id: 'IJq0ywW283o' },
  { title: 'Pasoori', artist: 'Ali Sethi & Shae Gill', id: '5Eqb_-j3FDA' },
  { title: 'Kun Faya Kun', artist: 'A.R. Rahman', id: 'T94PHkuydcw' },
  { title: 'Kalank Title Track', artist: 'Arijit Singh', id: 'Grr0Exhy-lQ' },
  { title: 'Chaiyya Chaiyya', artist: 'Sukhwinder Singh', id: 'PQmrmVs10X8' },
];

const POPULAR_SUGGESTIONS = [
  'Arijit Singh',
  'Sant Kabir',
  'Amjad Sabri',
  'Kesariya',
  'Raga Bhairavi',
  'Chai',
  'Bhangra',
  'Amir Khusro',
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
  const [ytMetadata, setYtMetadata] = useState<{ title: string; author: string } | null>(null);
  const [ytLoading, setYtLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const detectedYtId = useMemo(() => extractYouTubeId(searchQuery), [searchQuery]);

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
      titleDevanagari: customTitle || ytMetadata?.title || 'यूट्यूब ऑडियो',
      artist: customArtist || ytMetadata?.author || 'YouTube Stream',
      artistDevanagari: customArtist || ytMetadata?.author || 'यूट्यूब स्ट्रीम',
      album: 'YouTube Magic Portal',
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
      titleDevanagari: customTitle || ytMetadata?.title || 'यूट्यूब ऑडियो',
      artist: customArtist || ytMetadata?.author || 'YouTube Stream',
      artistDevanagari: customArtist || ytMetadata?.author || 'यूट्यूब स्ट्रीम',
      album: 'YouTube Magic Portal',
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
    return searchCatalog(searchQuery, selectedMoodFilter);
  }, [searchQuery, selectedMoodFilter]);

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

  const totalResults = tracks.length + playlists.length + (searchQuery ? matchingArtists.length : 0);

  return (
    <div className="space-y-8 pb-16 animate-fade-in select-none">
      {/* Search Header Banner */}
      <div className="relative overflow-hidden rounded-[2rem] p-6 sm:p-8 bg-gradient-to-br from-surface via-surface-subtle to-surface border border-white/[0.08] shadow-xl">
        <div className="absolute top-0 right-1/4 -mt-16 w-80 h-80 rounded-full bg-accent/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real-time Discovery</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">
            Search songs, artists, ragas, or lyrics
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted mt-1 font-medium">
            Explore 24 handpicked Hindi masterworks, Sufi kalams, and Kabir bhajans
          </p>

          {/* Search Input Bar */}
          <div className="relative mt-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by title, artist, raga (e.g. Bhairavi, Yaman), or lyric text..."
              aria-label="Search"
              autoFocus
              className="w-full pl-12 pr-24 py-4 rounded-2xl bg-surface/90 backdrop-blur-xl border border-white/10 text-foreground placeholder:text-foreground-muted/60 text-sm focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/20 transition-all shadow-2xl"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => onSearchChange('')}
                  className="p-1 rounded-full text-foreground-muted hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-foreground-subtle">
                  <Command className="w-2.5 h-2.5" />
                  <span>/</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Suggestion Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted mr-1">
              Popular:
            </span>
            {POPULAR_SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                type="button"
                onClick={() => onSearchChange(sug)}
                className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-subtle hover:bg-surface-hover text-foreground-muted hover:text-foreground border border-white/[0.06] hover:border-accent/30 transition-all cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Mood Filter Chips */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            <button
              type="button"
              onClick={() => setSelectedMoodFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedMoodFilter === 'all'
                  ? 'bg-accent text-accent-foreground shadow-md'
                  : 'bg-surface hover:bg-surface-hover border border-white/10 text-foreground-muted'
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
                    : 'bg-surface hover:bg-surface-hover border border-white/10 text-foreground-muted'
                }`}
              >
                <span>{mood.emoji}</span>
                <span>{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* YOUTUBE MAGIC PORTAL CARD (DIRECT LINK DETECTION & PRESETS)   */}
      {/* ============================================================== */}
      {detectedYtId && (
        <div className="relative overflow-hidden rounded-[2rem] p-6 sm:p-7 bg-gradient-to-r from-red-950/50 via-surface to-amber-950/40 border-2 border-red-500/40 shadow-2xl animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-36 h-24 sm:w-44 sm:h-28 shrink-0 rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-black">
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
                <span>YouTube Magic Stream Ready</span>
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
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-white/10 text-foreground font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Queue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Magic Portal Drawer / Quick Presets */}
      <div className="rounded-2xl p-4 sm:p-5 bg-surface/60 border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <YouTubeIcon className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              YouTube Magic Portal (जादुई पोर्टल)
            </span>
          </div>
          <span className="text-[11px] text-foreground-muted hidden sm:inline">
            Paste any YouTube URL in search to stream instantly
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted mr-1">
            Tap to Stream:
          </span>
          {YOUTUBE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePlayDetectedYt(preset.id, preset.title, preset.artist)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-subtle hover:bg-surface-hover text-foreground-muted hover:text-foreground border border-white/5 hover:border-red-500/30 transition-all cursor-pointer group"
            >
              <Play className="w-3 h-3 text-red-400 group-hover:scale-110 transition-transform fill-current" />
              <span>{preset.title}</span>
              <span className="text-[10px] text-foreground-subtle hidden sm:inline">
                ({preset.artist})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {totalResults === 0 ? (
        <div className="text-center py-16 bg-surface/40 rounded-[2rem] border border-white/[0.07] p-8 shadow-xl">
          <Sparkles className="w-12 h-12 text-accent/50 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-foreground">
            No matching tracks found for "{searchQuery}"
          </h3>
          <p className="text-xs sm:text-sm text-foreground-muted max-w-md mx-auto mt-2">
            Try searching for artists like "Arijit", "Kabir", "Amjad Sabri", moods like "Romantic" or "Sufi", or clear filters.
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
          {/* Matching Songs */}
          {tracks.length > 0 && (
            <section className="bg-surface/40 p-5 sm:p-7 rounded-[1.75rem] border border-white/[0.07] shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-4 h-4 text-accent" />
                <h3 className="font-extrabold text-lg sm:text-xl text-foreground">
                  Songs ({tracks.length})
                </h3>
              </div>

              <div className="rounded-2xl border border-white/[0.05] divide-y divide-white/[0.05] overflow-hidden bg-surface/30">
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
          {playlists.length > 0 && (
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
          {matchingArtists.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-accent" />
                <h3 className="font-extrabold text-lg sm:text-xl text-foreground">
                  Artists & Composers ({matchingArtists.length})
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
