import React, { useMemo } from 'react';
import { TRACKS, PLAYLISTS, ARTISTS, MOOD_OPTIONS } from '../data/catalog';
import { Track, Playlist, Artist, MoodOption } from '../types/music';
import { TrackCard } from '../components/music/TrackCard';
import { TrackRow } from '../components/music/TrackRow';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { MoodCard } from '../components/music/MoodCard';
import { HorizontalCarousel } from '../components/music/HorizontalCarousel';
import { PlayingCardDeck } from '../components/music/PlayingCardDeck';
import { BeyondTasteDiscovery } from '../components/music/BeyondTasteDiscovery';
import { MomentId, MOMENT_CONFIGS } from '../services/sessionMixService';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';
import { useTheme } from '../context/ThemeContext';
import {
  Play,
  Pause,
  Sparkles,
  Disc,
  Radio,
  Volume2,
  Heart,
  Flame,
  Coffee,
  Music,
} from 'lucide-react';

interface HomeViewProps {
  onNavigateToSearch: () => void;
  onNavigateToBeyondTaste?: () => void;
  onNavigateToMehfil?: () => void;
  onNavigateToMoods: (mood?: MoodOption) => void;
  onOpenMomentMix?: (momentId?: MomentId) => void;
  onSelectPlaylist: (playlist: Playlist) => void;
  onSelectArtist: (artist: Artist) => void;
  onSelectTrack: (track: Track) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToMehfil,
  onNavigateToMoods,
  onOpenMomentMix,
  onSelectPlaylist,
  onSelectArtist,
  onSelectTrack,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const { recentlyPlayedTracks } = useLibrary();
  const { preferences } = useTheme();

  // Dynamic greeting based on current local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      return { time: 'Good Morning 🌅', sub: 'Start your day with uplifting melodies and serene acoustics' };
    }
    if (hour >= 12 && hour < 17) {
      return { time: 'Good Afternoon ☀️', sub: 'Ease into smooth rhythms, lo-fi, and acoustic hits' };
    }
    if (hour >= 17 && hour < 22) {
      return { time: 'Good Evening 🪔', sub: 'Immerse in soulful music and timeless melodies' };
    }
    return { time: 'Late Night Chill 🌙', sub: 'Peaceful lo-fi, soothing acoustics and solace' };
  }, []);

  // Filtered tracks based on user preference
  const filteredTracks = useMemo(() => {
    if (preferences.preferredLanguage === 'all') return TRACKS;
    return TRACKS.filter((t) => t.language === preferences.preferredLanguage);
  }, [preferences.preferredLanguage]);

  const youtubeHitsTracks = useMemo(
    () => TRACKS.filter((t) => ['track-1', 'track-4', 'track-7', 'track-14', 'track-17', 'track-18', 'track-11', 'track-9', 'track-10', 'track-12', 'track-20', 'track-8'].includes(t.id)),
    []
  );

  // Vocal Legends & Chartbuster Hits
  const vocalLegendsTracks = useMemo(
    () => TRACKS.filter((t) => ['track-21', 'track-22', 'track-23', 'track-24', 'track-33', 'track-34', 'track-35', 'track-36', 'track-37', 'track-38', 'track-39', 'track-40', 'track-41', 'track-42'].includes(t.id)),
    []
  );

  const globalHitsTracks = useMemo(
    () => TRACKS.filter((t) => ['track-43', 'track-44', 'track-45', 'track-46'].includes(t.id)),
    []
  );

  const romanticTracks = useMemo(
    () => TRACKS.filter((t) => t.moods.includes('romantic')),
    []
  );

  const sufiDevotionalTracks = useMemo(
    () => TRACKS.filter((t) => t.moods.includes('devotional')),
    []
  );

  const lofiChillTracks = useMemo(
    () => TRACKS.filter((t) => t.moods.includes('chill') || t.moods.includes('monsoon')),
    []
  );

  const partyTracks = useMemo(
    () => TRACKS.filter((t) => t.moods.includes('energetic') || t.genre.includes('Punjabi') || t.genre.includes('Dance')),
    []
  );

  return (
    <div className="space-y-10 sm:space-y-12 pb-20 animate-fade-in">
      {/* ============================================================== */}
      {/* CINEMATIC MASTER HERO SECTION                                 */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden rounded-[2rem] p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-surface/80 via-surface-subtle/60 to-surface/90 border border-border shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        {/* Ambient mesh lighting orbs */}
        <div className="absolute top-0 right-1/4 -mt-24 w-96 h-96 rounded-full bg-accent/20 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 -mr-20 w-80 h-80 rounded-full bg-rose-600/15 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-72 h-72 rounded-full bg-purple-600/10 blur-[110px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 lg:gap-12">
          {/* Left Column: Greeting, Slogan, and Actions */}
          <div className="max-w-2xl flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{greeting.time}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.08]">
              Discover <span className="text-gradient-accent">Global & Indian Music</span>
            </h1>

            <p className="mt-2.5 text-sm sm:text-base text-foreground-muted max-w-lg font-medium">
              Bollywood chartbusters, indie acoustics, and timeless melodies.
            </p>

            {/* Quick Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const targetTrack = currentTrack || TRACKS[0];
                  if (targetTrack) {
                    if (isPlaying) togglePlay();
                    else playTrack(targetTrack, TRACKS);
                  }
                }}
                className="group relative inline-flex items-center gap-3 pl-6 pr-2.5 py-2 rounded-full bg-accent text-accent-foreground font-extrabold text-sm shadow-[0_10px_25px_-5px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{isPlaying ? 'Pause Playback' : currentTrack ? `Resume: ${currentTrack.title}` : 'Listen Now'}</span>
                <div className="w-8 h-8 rounded-full bg-black/15 flex items-center justify-center transition-transform group-hover:scale-105">
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToMoods()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-subtle hover:bg-surface-hover border border-border text-xs font-bold text-foreground transition-all active:scale-[0.98] cursor-pointer"
              >
                <Radio className="w-4 h-4 text-accent" />
                <span>Vibe Radios</span>
              </button>
            </div>

            {/* Quick Vibe Selector Pills */}
            <div className="mt-6 pt-5 border-t border-border/50">
              <div className="flex flex-wrap items-center gap-2">
                {MOOD_OPTIONS.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => onNavigateToMoods(mood)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-subtle/80 hover:bg-surface-hover border border-border hover:border-accent/40 text-xs font-semibold text-foreground transition-all hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                  >
                    <span>{mood.emoji}</span>
                    <span>{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Playing Card Deck */}
          <PlayingCardDeck
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onPlayTrack={(track) => playTrack(track, TRACKS)}
            onTogglePlay={togglePlay}
            onSelectTrack={onSelectTrack}
            catalog={TRACKS}
          />
        </div>
      </section>

      {/* ============================================================== */}
      {/* BEYOND YOUR TASTE — SIGNATURE TASTE HORIZON DISCOVERY          */}
      {/* ============================================================== */}
      <BeyondTasteDiscovery onSelectTrack={onSelectTrack} />

      {/* ============================================================== */}
      {/* MOMENT MIXES — CONTEXT-AWARE LISTENING SESSIONS                */}
      {/* ============================================================== */}
      <HorizontalCarousel
        title="Moment Mix Sessions"
        subtitle="Timer-enabled listening flows"
        icon={<Sparkles className="w-5 h-5 text-accent" />}
      >
        {(Object.keys(MOMENT_CONFIGS) as MomentId[]).map((mKey) => {
          const cfg = MOMENT_CONFIGS[mKey];
          return (
            <div
              key={cfg.id}
              role="button"
              tabIndex={0}
              onClick={() => onOpenMomentMix?.(cfg.id)}
              className={`group relative overflow-hidden rounded-[1.5rem] p-5 w-60 sm:w-68 bg-gradient-to-br ${cfg.gradient} text-white shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 cursor-pointer select-none shrink-0 flex flex-col justify-between h-44`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl filter drop-shadow">{cfg.emoji}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                  {cfg.defaultDurationMinutes} mins
                </span>
              </div>

              <div>
                <h3 className="font-black text-base tracking-tight">{cfg.title}</h3>
                <p className="text-xs text-white/80 line-clamp-2 mt-1 leading-snug">
                  {cfg.tagline}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-white/90 pt-2 border-t border-white/15">
                <span>Start Session →</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          );
        })}
      </HorizontalCarousel>

      {/* ============================================================== */}
      {/* MEHFIL BAITHAK SANCTUARY PROMO BANNER                          */}
      {/* ============================================================== */}
      {onNavigateToMehfil && (
        <section
          onClick={onNavigateToMehfil}
          className="relative overflow-hidden rounded-[2rem] p-6 sm:p-8 bg-gradient-to-r from-amber-950/60 via-stone-900 to-rose-950/60 border border-amber-500/30 shadow-2xl cursor-pointer group hover:border-amber-400/50 transition-all"
        >
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                <span>Vinyl & Cassette</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-100 tracking-tight">
                The Listening Lounge
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-medium">
                Vintage cassette deck, sitar turntable & acoustic Tanpura drone.
              </p>
            </div>

            <button
              type="button"
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg group-hover:scale-105 active:scale-95 cursor-pointer"
            >
              Enter Lounge →
            </button>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* CONTINUE LISTENING / RECENTLY PLAYED CAROUSEL                  */}
      {/* ============================================================== */}
      {recentlyPlayedTracks.length > 0 && (
        <HorizontalCarousel
          title="Continue Listening"
          subtitle="Pick up where you left off"
          icon={<Flame className="w-5 h-5" />}
        >
          {recentlyPlayedTracks.map((track) => (
            <TrackCard
              key={`recent-${track.id}`}
              track={track}
              allTracks={recentlyPlayedTracks}
              onOpenDetail={onSelectTrack}
            />
          ))}
        </HorizontalCarousel>
      )}

      {/* ============================================================== */}
      {/* YOUTUBE TRENDING HITS                                         */}
      {/* ============================================================== */}
      <HorizontalCarousel
        title="Trending Now"
        subtitle="Chartbusters & viral hits"
        icon={
          <div className="w-5 h-5 rounded-md bg-red-600 flex items-center justify-center text-white shadow-sm">
            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
          </div>
        }
      >
        {youtubeHitsTracks.map((track) => (
          <TrackCard
            key={`yt-${track.id}`}
            track={track}
            allTracks={youtubeHitsTracks}
            onOpenDetail={onSelectTrack}
          />
        ))}
      </HorizontalCarousel>

      {/* ============================================================== */}
      {/* BOLLYWOOD VOCAL LEGENDS & CHARTBUSTERS CAROUSEL                */}
      {/* ============================================================== */}
      <HorizontalCarousel
        title="Bollywood Superstars"
        subtitle="Arijit, Armaan, Jubin, Ankit, Stebin & more"
        icon={<Sparkles className="w-5 h-5 text-accent" />}
      >
        {vocalLegendsTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            allTracks={vocalLegendsTracks}
            onOpenDetail={onSelectTrack}
          />
        ))}
      </HorizontalCarousel>

      {/* ============================================================== */}
      {/* GLOBAL BILLBOARD & ENGLISH POP HITS                           */}
      {/* ============================================================== */}
      <HorizontalCarousel
        title="Global Pop Hits"
        subtitle="The Weeknd, Ed Sheeran, Dua Lipa & more"
        icon={<Flame className="w-5 h-5 text-accent" />}
      >
        {globalHitsTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            allTracks={globalHitsTracks}
            onOpenDetail={onSelectTrack}
          />
        ))}
      </HorizontalCarousel>

      {/* ============================================================== */}
      {/* ROMANTIC EVENINGS CAROUSEL                                     */}
      {/* ============================================================== */}
      <HorizontalCarousel
        title="Romantic Melodies"
        subtitle="Heartfelt ballads & love duets"
        icon={<Heart className="w-5 h-5 text-rose-500" />}
      >
        {romanticTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            allTracks={romanticTracks}
            onOpenDetail={onSelectTrack}
          />
        ))}
      </HorizontalCarousel>

      {/* ============================================================== */}
      {/* BROWSE BY MOOD & EMOTION                                       */}
      {/* ============================================================== */}
      <HorizontalCarousel
        title="Browse by Mood"
        subtitle="Find music for your current feeling"
        icon={<Radio className="w-5 h-5 text-accent" />}
        actionText="Explore All Vibes →"
        onAction={() => onNavigateToMoods()}
      >
        {MOOD_OPTIONS.map((mood) => (
          <MoodCard
            key={mood.id}
            mood={mood}
            className="w-56 sm:w-64"
            onSelect={() => onNavigateToMoods(mood)}
          />
        ))}
      </HorizontalCarousel>

      {/* ============================================================== */}
      {/* SUFI & DEVOTIONAL RUHANIYAT CAROUSEL                           */}
      {/* ============================================================== */}
      <HorizontalCarousel
        title="Sufi & Devotional"
        subtitle="Spiritual kalams & peace"
        icon={<Sparkles className="w-5 h-5 text-amber-500" />}
      >
        {sufiDevotionalTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            allTracks={sufiDevotionalTracks}
            onOpenDetail={onSelectTrack}
          />
        ))}
      </HorizontalCarousel>

      {/* ============================================================== */}
      {/* CHAI, MONSOON & LO-FI CAROUSEL                                 */}
      {/* ============================================================== */}
      <HorizontalCarousel
        title="Monsoon & Lo-Fi"
        subtitle="Acoustic warmth & chill beats"
        icon={<Coffee className="w-5 h-5 text-cyan-500" />}
      >
        {lofiChillTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            allTracks={lofiChillTracks}
            onOpenDetail={onSelectTrack}
          />
        ))}
      </HorizontalCarousel>

      {/* ============================================================== */}
      {/* FEATURED PLAYLISTS                                             */}
      {/* ============================================================== */}
      <HorizontalCarousel
        title="Curated Playlists"
        subtitle="Made for every moment"
        icon={<Disc className="w-5 h-5 text-accent" />}
      >
        {PLAYLISTS.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onSelect={onSelectPlaylist}
          />
        ))}
      </HorizontalCarousel>

      {/* ============================================================== */}
      {/* PARTY & GROOVE CAROUSEL                                        */}
      {/* ============================================================== */}
      <HorizontalCarousel
        title="Party Anthems"
        subtitle="High-octane dance beats"
        icon={<Music className="w-5 h-5 text-emerald-500" />}
      >
        {partyTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            allTracks={partyTracks}
            onOpenDetail={onSelectTrack}
          />
        ))}
      </HorizontalCarousel>

      {/* ============================================================== */}
      {/* TOP TRENDING SONGS (LIST VIEW)                                 */}
      {/* ============================================================== */}
      <section className="bg-surface/40 p-5 sm:p-7 rounded-[1.75rem] border border-border shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-accent" />
              <span>Top Songs</span>
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5 font-medium">
              Most loved this week
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border divide-y divide-border/60 overflow-hidden bg-surface/30">
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

      {/* ============================================================== */}
      {/* LEGENDARY ARTISTS & MAESTROS                                   */}
      {/* ============================================================== */}
      <HorizontalCarousel
        title="Popular Artists"
        subtitle="Iconic voices & creators"
        icon={<Sparkles className="w-5 h-5 text-accent" />}
      >
        {ARTISTS.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onSelect={onSelectArtist}
          />
        ))}
      </HorizontalCarousel>
    </div>
  );
};
