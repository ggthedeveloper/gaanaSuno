import React from 'react';
import { TRACKS, PLAYLISTS, ARTISTS, MOOD_OPTIONS } from '../data/catalog';
import { Track, Playlist, Artist, MoodOption } from '../types/music';
import { TrackCard } from '../components/music/TrackCard';
import { TrackRow } from '../components/music/TrackRow';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { MoodCard } from '../components/music/MoodCard';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';
import { useTheme } from '../context/ThemeContext';
import { Play, Sparkles, Disc, ArrowRight } from 'lucide-react';

interface HomeViewProps {
  onNavigateToSearch: () => void;
  onNavigateToMoods: (mood?: MoodOption) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onSelectArtist: (artist: Artist) => void;
  onSelectTrack: (track: Track) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToMoods,
  onSelectPlaylist,
  onSelectArtist,
  onSelectTrack,
}) => {
  const { playTrack } = useAudio();
  const { recentlyPlayedTracks } = useLibrary();
  const { preferences } = useTheme();

  // Featured track of the day
  const featuredTrack = TRACKS[0]; // Kesariya Ishq

  // Filter catalog based on preferred language if set
  const filteredTracks = preferences.preferredLanguage === 'all'
    ? TRACKS
    : TRACKS.filter((t) => t.language === preferences.preferredLanguage);

  return (
    <div className="space-y-10 pb-12 animate-fade-in">
      {/* Hindi Welcome Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-surface via-surface-subtle to-surface border border-border/60 shadow-xl">
        {/* Ambient Gradient Glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome to GaanaSuno</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              What do you want to <span className="text-gradient-accent">listen to today?</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base text-foreground-muted leading-relaxed">
              Discover timeless Bollywood classics, soulful Sufi ghazals, midnight Hindi lo-fi, and high-octane Punjabi beats crafted for your heart.
            </p>

            {/* Quick Mood Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
              {MOOD_OPTIONS.slice(0, 4).map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => onNavigateToMoods(mood)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-hover hover:bg-surface-active border border-border/80 text-xs font-semibold text-foreground transition-all hover:scale-105"
                >
                  <span>{mood.emoji}</span>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Song Hero Card */}
          {featuredTrack && (
            <div className="w-full lg:w-80 shrink-0 bg-surface/90 backdrop-blur-md p-4 rounded-2xl border border-border shadow-2xl flex items-center gap-4 group">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md shrink-0">
                <img
                  src={featuredTrack.coverUrl}
                  alt={featuredTrack.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <button
                  type="button"
                  aria-label={`Play ${featuredTrack.title}`}
                  onClick={() => playTrack(featuredTrack, TRACKS)}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Play className="w-7 h-7 text-accent fill-current" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  Song of the Day
                </span>
                <h4 className="font-bold text-sm text-foreground truncate mt-0.5">
                  {featuredTrack.title}
                </h4>
                <p className="text-xs text-foreground-muted truncate">
                  {featuredTrack.artist}
                </p>
                <button
                  type="button"
                  onClick={() => playTrack(featuredTrack, TRACKS)}
                  className="mt-2 flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Listen Now</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Continue Listening / Recently Played Section */}
      {recentlyPlayedTracks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-extrabold text-foreground tracking-tight">
                Continue Listening
              </h3>
              <p className="text-xs text-foreground-muted mt-0.5">
                Pick up where you left off
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {recentlyPlayedTracks.slice(0, 6).map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                allTracks={recentlyPlayedTracks}
                onOpenDetail={onSelectTrack}
              />
            ))}
          </div>
        </section>
      )}

      {/* Mood & Emotion Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span>Browse by Mood & Emotion</span>
            </h3>
            <p className="text-xs text-foreground-muted mt-0.5">
              Let your current feeling guide your playlist
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToMoods()}
            className="flex items-center gap-1 text-xs font-bold text-accent hover:underline"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {MOOD_OPTIONS.map((mood) => (
            <MoodCard
              key={mood.id}
              mood={mood}
              onSelect={() => onNavigateToMoods(mood)}
            />
          ))}
        </div>
      </section>

      {/* Featured Playlists Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <Disc className="w-5 h-5 text-accent" />
              <span>Featured Hindi Playlists</span>
            </h3>
            <p className="text-xs text-foreground-muted mt-0.5">
              Curated collections for every vibe
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {PLAYLISTS.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onSelect={onSelectPlaylist}
            />
          ))}
        </div>
      </section>

      {/* Trending Songs List Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-foreground tracking-tight">
              Top Trending Hindi Songs
            </h3>
            <p className="text-xs text-foreground-muted mt-0.5">
              Most loved Bollywood and Indie melodies
            </p>
          </div>
        </div>

        <div className="bg-surface/60 rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden">
          {filteredTracks.slice(0, 8).map((track, idx) => (
            <TrackRow
              key={track.id}
              track={track}
              index={idx}
              queueContext={filteredTracks}
              onOpenDetail={onSelectTrack}
            />
          ))}
        </div>
      </section>

      {/* Legendary Artists Spotlight Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-foreground tracking-tight">
              Legendary Indian Artists & Maestros
            </h3>
            <p className="text-xs text-foreground-muted mt-0.5">
              Artists who shaped Indian music history
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {ARTISTS.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onSelect={onSelectArtist}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
