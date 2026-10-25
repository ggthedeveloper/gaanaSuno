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
import { Play, Pause, Sparkles, Disc, ArrowRight, Radio, Volume2 } from 'lucide-react';

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
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const { recentlyPlayedTracks } = useLibrary();
  const { preferences } = useTheme();

  const featuredTrack = TRACKS[0]; // Kesariya Ishq
  const isFeaturedPlaying = currentTrack?.id === featuredTrack?.id && isPlaying;

  const filteredTracks = preferences.preferredLanguage === 'all'
    ? TRACKS
    : TRACKS.filter((t) => t.language === preferences.preferredLanguage);

  return (
    <div className="space-y-12 pb-16 animate-fade-in">
      {/* Editorial Master Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-surface via-surface-subtle/80 to-surface border border-white/8 shadow-2xl">
        {/* Dynamic ambient radial lighting */}
        <div className="absolute top-0 right-1/4 -mt-24 w-96 h-96 rounded-full bg-accent/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 -mr-20 w-80 h-80 rounded-full bg-orange-600/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left: Headline & Mood Quick-Selector */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Indian & Hindi Music Discovery</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              What do you want to <span className="text-gradient-accent">listen to today?</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-foreground-muted leading-relaxed max-w-xl">
              Immerse yourself in handpicked Bollywood romances, soulful Sufi qawwalis, midnight Delhi lo-fi, and high-energy Punjabi beats.
            </p>

            {/* Quick Vibe Radar */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted block mb-2.5">
                Quick Vibe Selector
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {MOOD_OPTIONS.slice(0, 5).map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => onNavigateToMoods(mood)}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-subtle hover:bg-surface-hover border border-white/10 hover:border-accent/40 text-xs font-semibold text-foreground transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    <span>{mood.emoji}</span>
                    <span>{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Featured Masterpiece Spotlight Card */}
          {featuredTrack && (
            <div className="w-full lg:w-96 shrink-0 bg-surface/90 backdrop-blur-2xl p-5 rounded-3xl border border-white/10 shadow-2xl group relative overflow-hidden">
              <div className="flex items-center gap-4">
                {/* Vinyl Preview Artwork with Slow Spin */}
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-xl shrink-0 border border-white/10">
                  <img
                    src={featuredTrack.coverUrl}
                    alt={featuredTrack.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      isFeaturedPlaying ? 'animate-spin-slow' : 'group-hover:scale-105'
                    }`}
                  />
                  <button
                    type="button"
                    aria-label={isFeaturedPlaying ? 'Pause featured' : 'Play featured'}
                    onClick={() => {
                      if (isFeaturedPlaying) togglePlay();
                      else playTrack(featuredTrack, TRACKS);
                    }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {isFeaturedPlaying ? (
                      <Pause className="w-8 h-8 text-white fill-current" />
                    ) : (
                      <Play className="w-8 h-8 text-accent fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                      Song of the Day
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-foreground truncate mt-1">
                    {featuredTrack.title}
                  </h3>
                  <p className="text-xs text-foreground-muted truncate font-medium">
                    {featuredTrack.artist}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-foreground-subtle">
                      Lossless 24-bit
                    </span>
                    <span className="text-[10px] text-foreground-muted">
                      {featuredTrack.genre}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    if (isFeaturedPlaying) togglePlay();
                    else playTrack(featuredTrack, TRACKS);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  {isFeaturedPlaying ? (
                    <>
                      <Volume2 className="w-4 h-4 animate-pulse" />
                      <span>Now Playing</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      <span>Listen Now</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTrack(featuredTrack)}
                  className="text-xs text-foreground-muted hover:text-foreground font-medium"
                >
                  View Details →
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
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Continue Listening
              </h2>
              <p className="text-xs text-foreground-muted mt-0.5 font-medium">
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
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Radio className="w-5 h-5 text-accent" />
              <span>Browse by Mood & Emotion</span>
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5 font-medium">
              Let your current feeling guide your playlist
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToMoods()}
            className="flex items-center gap-1.5 text-xs font-bold text-accent hover:underline group"
          >
            <span>Explore All Vibes</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Disc className="w-5 h-5 text-accent" />
              <span>Featured Hindi Playlists</span>
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5 font-medium">
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

      {/* Top Trending Hindi Songs List Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Top Trending Hindi Songs
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5 font-medium">
              Most loved Bollywood and Indie melodies
            </p>
          </div>
        </div>

        <div className="bg-surface/50 rounded-2xl border border-white/5 divide-y divide-white/5 overflow-hidden shadow-lg backdrop-blur-md">
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

      {/* Legendary Indian Artists Spotlight Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              Legendary Indian Artists & Maestros
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5 font-medium">
              Iconic voices who shaped Indian music history
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
