import React, { useState, useMemo } from 'react';
import { Track } from '../../types/music';
import { Play, Pause, Sparkles, Music, Disc } from 'lucide-react';

export interface PlayingCardDeckProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayTrack: (track: Track) => void;
  onTogglePlay: () => void;
  onSelectTrack: (track: Track) => void;
  catalog: Track[];
  className?: string;
}

export const PlayingCardDeck: React.FC<PlayingCardDeckProps> = ({
  currentTrack,
  isPlaying,
  onPlayTrack,
  onTogglePlay,
  onSelectTrack,
  catalog,
  className = '',
}) => {
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  // Active front card: currently playing track, or fallback to the top featured catalog track
  const frontTrack = currentTrack || catalog[0] || null;
  const isFrontActivePlaying = currentTrack?.id === frontTrack?.id && isPlaying;

  // Background playing cards: the next 3 tracks in line to form the stacked deck
  const backgroundCards = useMemo(() => {
    if (!catalog || catalog.length === 0) return [];
    const currentIndex = catalog.findIndex((t) => t.id === frontTrack?.id);
    const validIndex = currentIndex >= 0 ? currentIndex : 0;

    const cards: Track[] = [];
    for (let i = 1; i <= 3; i++) {
      const candidate = catalog[(validIndex + i) % catalog.length];
      if (candidate && candidate.id !== frontTrack?.id && !cards.some((c) => c.id === candidate.id)) {
        cards.push(candidate);
      }
    }
    return cards;
  }, [catalog, frontTrack?.id]);

  if (!frontTrack) return null;

  return (
    <div
      className={`relative w-full sm:w-[22rem] shrink-0 pt-6 pb-2 select-none perspective-[1200px] ${className}`}
      onMouseEnter={() => setIsDeckHovered(true)}
      onMouseLeave={() => {
        setIsDeckHovered(false);
        setHoveredCardIndex(null);
      }}
    >
      {/* Visual Deck Container */}
      <div className="relative w-full aspect-[1/1.22]">
        {/* ========================================================== */}
        {/* BACKGROUND PLAYING CARD 3 (Deep Center / Top Peek)        */}
        {/* ========================================================== */}
        {backgroundCards[2] && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => onPlayTrack(backgroundCards[2])}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPlayTrack(backgroundCards[2]);
              }
            }}
            onMouseEnter={() => setHoveredCardIndex(3)}
            onMouseLeave={() => setHoveredCardIndex(null)}
            aria-label={`Play next in deck: ${backgroundCards[2].title} by ${backgroundCards[2].artist}`}
            title={`Play "${backgroundCards[2].title}"`}
            style={{
              transform:
                hoveredCardIndex === 3
                  ? 'translate3d(0, -62px, 0) scale(1.02)'
                  : isDeckHovered
                  ? 'translate3d(0, -48px, 0) scale(0.92)'
                  : 'translate3d(0, -32px, 0) scale(0.88)',
              zIndex: hoveredCardIndex === 3 ? 45 : 5,
              opacity: hoveredCardIndex === 3 ? 1 : isDeckHovered ? 0.95 : 0.65,
              transition: 'all 450ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="absolute inset-0 rounded-[1.75rem] bg-surface/90 dark:bg-surface/80 backdrop-blur-xl border border-border/80 dark:border-white/10 shadow-lg cursor-pointer p-4 overflow-hidden group/card3 flex flex-col justify-between"
          >
            {/* Top Peek Bar */}
            <div className="flex items-center justify-between text-[11px] font-bold text-foreground-muted">
              <span className="flex items-center gap-1.5 truncate max-w-[170px] text-foreground">
                <Disc className="w-3 h-3 text-accent shrink-0" />
                <span className="truncate">{backgroundCards[2].title}</span>
              </span>
              <span className="text-[10px] text-foreground-muted truncate ml-1">{backgroundCards[2].artist}</span>
            </div>

            {/* Thumbnail and Hover Play Preview */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden mt-2 bg-surface-subtle border border-border/60">
              <img
                src={backgroundCards[2].coverUrl}
                alt={backgroundCards[2].title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/card3:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/card3:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground shadow-xl flex items-center justify-center scale-90 group-hover/card3:scale-100 transition-transform">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* BACKGROUND PLAYING CARD 2 (Left Fan Peek)                 */}
        {/* ========================================================== */}
        {backgroundCards[1] && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => onPlayTrack(backgroundCards[1])}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPlayTrack(backgroundCards[1]);
              }
            }}
            onMouseEnter={() => setHoveredCardIndex(2)}
            onMouseLeave={() => setHoveredCardIndex(null)}
            aria-label={`Play next in deck: ${backgroundCards[1].title} by ${backgroundCards[1].artist}`}
            title={`Play "${backgroundCards[1].title}"`}
            style={{
              transform:
                hoveredCardIndex === 2
                  ? 'translate3d(-42px, -36px, 0) rotate(-1.5deg) scale(1.03)'
                  : isDeckHovered
                  ? 'translate3d(-34px, -24px, 0) rotate(-7deg) scale(0.96)'
                  : 'translate3d(-14px, -18px, 0) rotate(-4deg) scale(0.92)',
              zIndex: hoveredCardIndex === 2 ? 45 : 10,
              opacity: hoveredCardIndex === 2 ? 1 : isDeckHovered ? 1 : 0.82,
              transition: 'all 450ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="absolute inset-0 rounded-[1.75rem] bg-surface/90 dark:bg-surface/85 backdrop-blur-xl border border-border/80 dark:border-white/10 shadow-xl cursor-pointer p-4 overflow-hidden group/card2 flex flex-col justify-between"
          >
            {/* Top Peek Bar */}
            <div className="flex items-center justify-between text-[11px] font-bold text-foreground-muted">
              <span className="flex items-center gap-1.5 truncate max-w-[170px] text-foreground">
                <Music className="w-3 h-3 text-accent shrink-0" />
                <span className="truncate">{backgroundCards[1].title}</span>
              </span>
              <span className="text-[10px] text-foreground-muted truncate ml-1">{backgroundCards[1].artist}</span>
            </div>

            {/* Thumbnail and Hover Play Preview */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden mt-2 bg-surface-subtle border border-border/60">
              <img
                src={backgroundCards[1].coverUrl}
                alt={backgroundCards[1].title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/card2:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/card2:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground shadow-xl flex items-center justify-center scale-90 group-hover/card2:scale-100 transition-transform">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* BACKGROUND PLAYING CARD 1 (Right Fan Peek)                */}
        {/* ========================================================== */}
        {backgroundCards[0] && (
          <div
            role="button"
            tabIndex={0}
            onClick={() => onPlayTrack(backgroundCards[0])}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPlayTrack(backgroundCards[0]);
              }
            }}
            onMouseEnter={() => setHoveredCardIndex(1)}
            onMouseLeave={() => setHoveredCardIndex(null)}
            aria-label={`Play next in deck: ${backgroundCards[0].title} by ${backgroundCards[0].artist}`}
            title={`Play "${backgroundCards[0].title}"`}
            style={{
              transform:
                hoveredCardIndex === 1
                  ? 'translate3d(42px, -32px, 0) rotate(1.5deg) scale(1.03)'
                  : isDeckHovered
                  ? 'translate3d(34px, -18px, 0) rotate(7deg) scale(0.98)'
                  : 'translate3d(14px, -12px, 0) rotate(4deg) scale(0.96)',
              zIndex: hoveredCardIndex === 1 ? 45 : 20,
              opacity: hoveredCardIndex === 1 ? 1 : isDeckHovered ? 1 : 0.92,
              transition: 'all 450ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            className="absolute inset-0 rounded-[1.75rem] bg-surface/90 dark:bg-surface/85 backdrop-blur-xl border border-border/80 dark:border-white/10 shadow-xl cursor-pointer p-4 overflow-hidden group/card1 flex flex-col justify-between"
          >
            {/* Top Peek Bar */}
            <div className="flex items-center justify-between text-[11px] font-bold text-foreground-muted">
              <span className="flex items-center gap-1.5 truncate max-w-[170px] text-foreground">
                <Sparkles className="w-3 h-3 text-accent shrink-0" />
                <span className="truncate">{backgroundCards[0].title}</span>
              </span>
              <span className="text-[10px] text-accent font-semibold truncate ml-1">{backgroundCards[0].artist}</span>
            </div>

            {/* Thumbnail and Hover Play Preview */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden mt-2 bg-surface-subtle border border-border/60">
              <img
                src={backgroundCards[0].coverUrl}
                alt={backgroundCards[0].title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover/card1:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/card1:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground shadow-xl flex items-center justify-center scale-90 group-hover/card1:scale-100 transition-transform">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* MAIN FRONT CARD (CURRENTLY PLAYING / SPOTLIGHT)           */}
        {/* ========================================================== */}
        <div
          style={{
            transform:
              hoveredCardIndex !== null && hoveredCardIndex > 0
                ? 'translate3d(0, 0, 0) scale(0.97)'
                : isDeckHovered
                ? 'translate3d(0, -4px, 0) scale(1.01)'
                : 'translate3d(0, 0, 0) scale(1)',
            opacity: hoveredCardIndex !== null && hoveredCardIndex > 0 ? 0.85 : 1,
            zIndex: 30,
            transition: 'all 450ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="relative w-full h-full bg-surface/95 dark:bg-surface/90 backdrop-blur-2xl p-5 rounded-[1.75rem] border border-border shadow-[0_20px_45px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-between group/front"
        >
          {/* Cover Image Container */}
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-xl mb-4 bg-surface-subtle border border-border/70">
            <img
              src={frontTrack.coverUrl}
              alt={frontTrack.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover/front:scale-105"
            />
            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

            {/* Top Badge: Spotlight or Now Playing */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              {isFrontActivePlaying ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#34d399]" />
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950/80 text-emerald-300 backdrop-blur-md border border-emerald-500/30">
                    Now Playing
                  </span>
                </>
              ) : currentTrack?.id === frontTrack.id ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 text-amber-300 backdrop-blur-md border border-amber-500/30">
                    In Player
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/15">
                    Spotlight of the Day
                  </span>
                </>
              )}
            </div>

            {/* Bottom Controls Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-accent drop-shadow truncate">
                    {frontTrack.genre}
                  </p>
                  {isFrontActivePlaying && (
                    <span className="flex items-end gap-0.5 h-3 px-1.5 py-0.5 rounded-full bg-accent/20 border border-accent/30 shrink-0">
                      <span className="w-0.5 bg-accent rounded-full animate-bounce h-3" />
                      <span className="w-0.5 bg-accent rounded-full animate-bounce h-1.5 delay-100" />
                      <span className="w-0.5 bg-accent rounded-full animate-bounce h-2.5 delay-200" />
                    </span>
                  )}
                </div>
              </div>

              {/* Play / Pause Circular Button */}
              <button
                type="button"
                aria-label={isFrontActivePlaying ? 'Pause currently playing' : 'Play track'}
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentTrack?.id === frontTrack.id) {
                    onTogglePlay();
                  } else {
                    onPlayTrack(frontTrack);
                  }
                }}
                className="w-12 h-12 shrink-0 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
              >
                {isFrontActivePlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3
                onClick={() => onSelectTrack(frontTrack)}
                className="font-extrabold text-base text-foreground truncate cursor-pointer hover:text-accent transition-colors"
                title={frontTrack.title}
              >
                {frontTrack.title}
              </h3>
              <p className="text-xs text-foreground-muted font-medium truncate mt-0.5" title={frontTrack.artist}>
                {frontTrack.artist}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectTrack(frontTrack)}
              className="text-xs font-bold text-accent hover:underline shrink-0 pt-1 cursor-pointer"
            >
              Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
