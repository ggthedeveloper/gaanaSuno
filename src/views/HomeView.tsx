import React, { useMemo } from 'react';
import { TRACKS, PLAYLISTS, ARTISTS, MOOD_OPTIONS } from '../data/catalog';
import { Track, Playlist, Artist, MoodOption } from '../types/music';
import { TrackCard } from '../components/music/TrackCard';
import { TrackRow } from '../components/music/TrackRow';
import { PlaylistCard } from '../components/music/PlaylistCard';
import { ArtistCard } from '../components/music/ArtistCard';
import { MoodCard } from '../components/music/MoodCard';
import { HorizontalCarousel } from '../components/music/HorizontalCarousel';
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
  ShieldCheck,
  Compass,
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
  onNavigateToBeyondTaste,
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

  const featuredTrack = TRACKS[0]; // Kesariya Ishq
  const isFeaturedPlaying = currentTrack?.id === featuredTrack?.id && isPlaying;

  // Filtered tracks based on user preference
  const filteredTracks = useMemo(() => {
    if (preferences.preferredLanguage === 'all') return TRACKS;
    return TRACKS.filter((t) => t.language === preferences.preferredLanguage);
  }, [preferences.preferredLanguage]);

  const youtubeHitsTracks = useMemo(
    () => TRACKS.filter((t) => ['track-1', 'track-4', 'track-7', 'track-14', 'track-17', 'track-18', 'track-11', 'track-9', 'track-10', 'track-12', 'track-20', 'track-8'].includes(t.id)),
    []
  );

  // Specific thematic track collections
  const heritageTracks = useMemo(
    () => TRACKS.filter((t) => ['track-21', 'track-22', 'track-23', 'track-24', 'track-2', 'track-13', 'track-6'].includes(t.id)),
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
              Discover the soul of <span className="text-gradient-accent">Global & Indian Music</span>
            </h1>

            <p className="mt-3.5 text-sm sm:text-base text-foreground-muted leading-relaxed max-w-xl font-medium">
              Stream Bollywood hits, Punjabi anthems, Indie acoustics, Lo-Fi beats, and timeless melodies in lossless sound.
            </p>

            {/* Nested CTA & Play Pill Button Architecture */}
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  if (featuredTrack) {
                    if (isFeaturedPlaying) togglePlay();
                    else playTrack(featuredTrack, TRACKS);
                  }
                }}
                className="group relative inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-accent text-accent-foreground font-extrabold text-sm shadow-[0_10px_25px_-5px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>{isFeaturedPlaying ? 'Pause Featured' : 'Listen to Featured Mix'}</span>
                <div className="w-9 h-9 rounded-full bg-black/15 flex items-center justify-center transition-transform group-hover:scale-105 group-hover:rotate-12">
                  {isFeaturedPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToMoods()}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-surface-subtle hover:bg-surface-hover border border-border text-xs font-bold text-foreground transition-all active:scale-[0.98] cursor-pointer"
              >
                <Radio className="w-4 h-4 text-accent" />
                <span>Explore Vibe Radios</span>
              </button>

              {onNavigateToBeyondTaste && (
                <button
                  type="button"
                  onClick={onNavigateToBeyondTaste}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-xs font-black text-amber-300 transition-all hover:scale-105 active:scale-[0.98] cursor-pointer shadow-sm"
                >
                  <Compass className="w-4 h-4 text-amber-400" />
                  <span>🎚️ Beyond Taste Slider</span>
                </button>
              )}

              {onOpenMomentMix && (
                <button
                  type="button"
                  onClick={() => onOpenMomentMix('unwind')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent/15 hover:bg-accent/25 border border-accent/30 text-xs font-bold text-accent transition-all hover:scale-105 active:scale-[0.98] cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span>Moment Mix Sessions</span>
                </button>
              )}

              {onNavigateToMehfil && (
                <button
                  type="button"
                  onClick={onNavigateToMehfil}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-accent/15 hover:bg-accent/25 border border-accent/30 text-xs font-bold text-accent transition-all hover:scale-105 active:scale-[0.98] cursor-pointer shadow-lg"
                >
                  <Flame className="w-4 h-4 text-accent" />
                  <span>The Listening Lounge (Vinyl & Cassette)</span>
                </button>
              )}
            </div>

            {/* Quick Vibe Selector Pills */}
            <div className="mt-7 pt-5 border-t border-border/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted block mb-2.5">
                Instant Mood Tuner
              </span>
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

          {/* Right Column: 3D Layered Artwork Composition Spotlight */}
          {featuredTrack && (
            <div className="w-full lg:w-[22rem] shrink-0">
              <div className="relative group">
                {/* Background Layer 2: Adjacent track peek with tilt */}
                <div className="absolute -top-3 -right-3 w-full h-full rounded-3xl bg-surface/40 border border-border shadow-lg transform rotate-3 pointer-events-none opacity-60 group-hover:rotate-6 transition-transform duration-500" />

                {/* Main Card: Spotlight */}
                <div className="relative z-10 bg-surface/90 backdrop-blur-2xl p-5 rounded-[1.75rem] border border-border shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)] overflow-hidden">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-xl mb-4 bg-surface-subtle border border-border">
                    <img
                      src={featuredTrack.coverUrl}
                      alt={featuredTrack.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/10">
                        Spotlight of the Day
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold uppercase tracking-wider text-accent drop-shadow">
                            {featuredTrack.genre}
                          </p>
                          {isFeaturedPlaying && (
                            <span className="flex items-end gap-0.5 h-3 px-1.5 py-0.5 rounded-full bg-accent/20 border border-accent/30">
                              <span className="w-0.5 bg-accent rounded-full animate-bounce h-3" />
                              <span className="w-0.5 bg-accent rounded-full animate-bounce h-1.5 delay-100" />
                              <span className="w-0.5 bg-accent rounded-full animate-bounce h-2.5 delay-200" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/80 font-mono mt-0.5">
                          24-Bit Lossless Audio
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label={isFeaturedPlaying ? 'Pause featured' : 'Play featured'}
                        onClick={() => {
                          if (isFeaturedPlaying) togglePlay();
                          else playTrack(featuredTrack, TRACKS);
                        }}
                        className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all cursor-pointer"
                      >
                        {isFeaturedPlaying ? (
                          <Pause className="w-5 h-5 fill-current" />
                        ) : (
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Metadata and Details */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3
                        onClick={() => onSelectTrack(featuredTrack)}
                        className="font-extrabold text-base text-foreground truncate cursor-pointer hover:text-accent transition-colors"
                      >
                        {featuredTrack.title}
                      </h3>
                      <p className="text-xs text-foreground-muted font-medium truncate mt-0.5">
                        {featuredTrack.artist}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectTrack(featuredTrack)}
                      className="text-xs font-bold text-accent hover:underline shrink-0 pt-1"
                    >
                      Details →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Badges Strip */}
        <div className="relative z-10 mt-8 pt-6 border-t border-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-2 rounded-xl bg-surface/30 border border-border">
            <p className="text-base sm:text-lg font-black text-foreground">{TRACKS.length} Songs</p>
            <p className="text-[11px] text-foreground-muted">Handpicked Catalog</p>
          </div>
          <div className="p-2 rounded-xl bg-surface/30 border border-border">
            <p className="text-base sm:text-lg font-black text-accent">{heritageTracks.length} Heritage</p>
            <p className="text-[11px] text-foreground-muted">Non-Copyright & Public Domain</p>
          </div>
          <div className="p-2 rounded-xl bg-surface/30 border border-border">
            <p className="text-base sm:text-lg font-black text-foreground">{PLAYLISTS.length} Playlists</p>
            <p className="text-[11px] text-foreground-muted">Mood & Genre Curations</p>
          </div>
          <div className="p-2 rounded-xl bg-surface/30 border border-border">
            <p className="text-base sm:text-lg font-black text-foreground">0ms Latency</p>
            <p className="text-[11px] text-foreground-muted">Instant Offline Playback</p>
          </div>
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
        subtitle="Curated flows for your intention with customizable duration & sleep timer"
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
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5" />
                <span>Tactile Acoustic Experience</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-100 tracking-tight">
                Enter the Listening Lounge
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-medium">
                Step into a tactile listening sanctuary with our 90s Magnetic Cassette Deck, Sitar Turntable, Procedural Tanpura Drone, and Emotional Sound Compass.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-amber-300 bg-black/40 px-3.5 py-2 rounded-xl border border-amber-500/20">
                <span>🪔 Tanpura Synthesizer</span>
                <span>•</span>
                <span>📻 Vintage Decks</span>
              </div>
              <button
                type="button"
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg group-hover:scale-105 active:scale-95 cursor-pointer"
              >
                Enter Lounge →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* CONTINUE LISTENING / RECENTLY PLAYED CAROUSEL                  */}
      {/* ============================================================== */}
      {recentlyPlayedTracks.length > 0 && (
        <HorizontalCarousel
          title="Continue Listening"
          subtitle="Pick up right where you left off"
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
        title="YouTube Trending — Global & Bollywood Hits"
        subtitle="The definitive chart-topping hits by Arijit Singh, Anuv Jain, Pritam, The Local Train & Vishal Mishra"
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
      {/* SANSKRITI — NON-COPYRIGHT INDIAN HERITAGE CAROUSEL             */}
      {/* ============================================================== */}
      <HorizontalCarousel
        title="Sanskriti — Non-Copyright Indian Heritage"
        subtitle="Public domain classical ragas, Amir Khusro Sufi kalams, and Sant Kabir bhajans"
        icon={<ShieldCheck className="w-5 h-5 text-accent" />}
      >
        {heritageTracks.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            allTracks={heritageTracks}
            onOpenDetail={onSelectTrack}
          />
        ))}
      </HorizontalCarousel>

      {/* ============================================================== */}
      {/* ROMANTIC EVENINGS CAROUSEL                                     */}
      {/* ============================================================== */}
      <HorizontalCarousel
        title="Soulful Romance & Love"
        subtitle="Heartfelt Bollywood ballads, soulful duets, and timeless love melodies"
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
        title="Browse by Mood & Emotion"
        subtitle="Let your current feeling guide your listening journey"
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
        title="Ruhaniyat — Sufi & Devotional Peace"
        subtitle="Transcendental qawwalis, bamboo bansuri, and morning stotrams"
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
        title="Chai, Baarish & Lo-Fi Beats"
        subtitle="Midnight Delhi vibes, warm vinyl crackle, and acoustic fingerpicking"
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
        title="Featured Curated Playlists"
        subtitle="Curated collections crafted for every moment"
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
        title="Desi Party & Dholak Groove"
        subtitle="High-octane Punjabi beats and wedding dancefloor anthems"
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
              <span>Top Trending Songs</span>
            </h2>
            <p className="text-xs text-foreground-muted mt-0.5 font-medium">
              Most loved hits and timeless indie melodies
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
        title="Legendary Indian Artists & Maestros"
        subtitle="Iconic voices and virtuosos who shaped Indian musical history"
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
