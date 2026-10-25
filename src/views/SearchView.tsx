import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Track, Playlist, Artist, MoodTag } from '../types/music';
import { searchCatalog } from '../services/recommendation';
import { ARTISTS, MOOD_OPTIONS } from '../data/catalog';
import { TrackRow } from '../components/music/TrackRow';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { Search, Sparkles, X, Music, Disc, User, Command } from 'lucide-react';

interface SearchViewProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onSelectArtist: (artist: Artist) => void;
  onSelectTrack: (track: Track) => void;
}

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
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<MoodTag | 'all'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

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
