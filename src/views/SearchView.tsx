import React, { useState, useMemo } from 'react';
import { Track, Playlist, Artist, MoodTag } from '../types/music';
import { searchCatalog } from '../services/recommendation';
import { ARTISTS, MOOD_OPTIONS } from '../data/catalog';
import { TrackRow } from '../components/music/TrackRow';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { Search, Sparkles, X, Music, Disc, User } from 'lucide-react';

interface SearchViewProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onSelectArtist: (artist: Artist) => void;
  onSelectTrack: (track: Track) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  searchQuery,
  onSearchChange,
  onSelectPlaylist,
  onSelectArtist,
  onSelectTrack,
}) => {
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<MoodTag | 'all'>('all');

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
    <div className="space-y-8 pb-12 animate-fade-in">
      {/* Search Header & Filter Chips */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          खोजें और सुरों को पहचानें
        </h2>
        <p className="text-xs sm:text-sm text-foreground-muted mt-1">
          Search across Bollywood melodies, Sufi Qawwalis, Indie Lo-Fi, or lyrics
        </p>

        {/* Search Bar Input */}
        <div className="relative mt-4 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Type song name, artist (e.g. Arijit, Amjad Sabri), raga, or lyrics..."
            aria-label="Search"
            autoFocus
            className="w-full pl-12 pr-10 py-3 rounded-2xl bg-surface border border-border text-foreground placeholder:text-foreground-muted/60 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-foreground-muted hover:text-foreground hover:bg-surface-active"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mood Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedMoodFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedMoodFilter === 'all'
                ? 'bg-accent text-accent-foreground shadow-sm'
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                selectedMoodFilter === mood.id
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'bg-surface hover:bg-surface-hover border border-border text-foreground-muted'
              }`}
            >
              <span>{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {totalResults === 0 ? (
        <div className="text-center py-16 bg-surface/40 rounded-3xl border border-border/50 p-6">
          <Sparkles className="w-12 h-12 text-accent/50 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-foreground">
            No matching tracks found for "{searchQuery}"
          </h3>
          <p className="text-xs text-foreground-muted max-w-md mx-auto mt-1">
            Try searching for artists like "Arijit", "Amjad Sabri", moods like "Romantic" or "Sufi", or clear filters.
          </p>
          <button
            type="button"
            onClick={() => {
              onSearchChange('');
              setSelectedMoodFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-bold hover:scale-105 transition-all"
          >
            Clear Filters & Show All
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Matching Songs */}
          {tracks.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Music className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-lg text-foreground">
                  Songs ({tracks.length})
                </h3>
              </div>

              <div className="bg-surface/60 rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden">
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
              <div className="flex items-center gap-2 mb-3">
                <Disc className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-lg text-foreground">
                  Playlists ({playlists.length})
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
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
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-accent" />
                <h3 className="font-bold text-lg text-foreground">
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
