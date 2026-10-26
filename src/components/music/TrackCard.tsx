import React, { useState } from 'react';
import { Track } from '../../types/music';
import { useAudio } from '../../context/AudioContext';
import { useLibrary } from '../../context/LibraryContext';
import { generateCoverArt } from '../../data/catalog';
import { Play, Pause, Heart } from 'lucide-react';

interface TrackCardProps {
  track: Track;
  allTracks?: Track[];
  onOpenDetail?: (track: Track) => void;
  className?: string;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  allTracks,
  onOpenDetail,
  className = '',
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const { isLiked, toggleLike } = useLibrary();
  const [imgSrc, setImgSrc] = useState(track.coverUrl);

  const isCurrent = currentTrack?.id === track.id;
  const isCardPlaying = isCurrent && isPlaying;
  const liked = isLiked(track.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, allTracks);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(track.id);
  };

  const handleImageError = () => {
    setImgSrc(generateCoverArt(track.title, track.artist, ['#1e1b4b', '#0f172a'], '#f59e0b'));
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpenDetail?.(track);
      }}
      onClick={() => onOpenDetail?.(track)}
      className={`group relative flex flex-col p-2.5 rounded-[1.5rem] bg-surface/40 hover:bg-surface-hover/80 border border-white/[0.08] hover:border-accent/40 shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.6)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-2 cursor-pointer select-none shrink-0 w-44 sm:w-48 lg:w-52 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-xl ${
        isCurrent ? 'ring-1 ring-accent/50 bg-surface/75 shadow-accent/20' : ''
      } ${className}`}
    >
      {/* Vinyl record peek container */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-inner bg-surface-subtle">
        {/* Pulsating Glowing Aura Ring when playing */}
        {isCardPlaying && (
          <div className="absolute inset-0 rounded-2xl ring-2 ring-accent animate-wave-pulse pointer-events-none" />
        )}

        {/* Grooved vinyl disc sliding out on hover with center label */}
        <div
          className="absolute top-1.5 right-1.5 bottom-1.5 w-full rounded-full bg-[#0c0e14] border border-white/10 opacity-70 group-hover:translate-x-4 group-hover:opacity-100 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none flex items-center justify-center"
          style={{
            boxShadow: 'inset 0 0 16px rgba(0,0,0,0.95), 0 4px 16px rgba(0,0,0,0.7)',
          }}
        >
          {/* Vinyl concentric micro-grooves */}
          <div className="w-3/4 h-3/4 rounded-full border border-white/5 flex items-center justify-center">
            <div className="w-1/2 h-1/2 rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-7 h-7 rounded-full bg-accent/80 flex items-center justify-center shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-black" />
              </div>
            </div>
          </div>
        </div>

        {/* Front Album Sleeve Artwork */}
        <div className="relative z-10 w-full h-full rounded-[1rem] overflow-hidden shadow-sm">
          <img
            src={imgSrc}
            alt={track.title}
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-108"
            loading="lazy"
          />

          {/* Liquid Glass Sheen Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.08] to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Top Gradient Shadow */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

          {/* Floating Genre / Language Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
            {track.moods[0] && (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-black/60 text-white backdrop-blur-md border border-white/15 shadow-sm">
                {track.moods[0]}
              </span>
            )}
            {track.licenseNote.toLowerCase().includes('youtube') && (
              <span className="px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-red-600/90 text-white backdrop-blur-md shadow-sm">
                YT
              </span>
            )}
          </div>

          {/* Favorite Heart Button */}
          <button
            type="button"
            aria-label={liked ? `Unlike ${track.title}` : `Like ${track.title}`}
            onClick={handleLike}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
              liked
                ? 'bg-rose-500/20 text-rose-500 opacity-100 ring-1 ring-rose-500/30'
                : 'bg-black/50 text-white/80 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-black/80'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
          </button>

          {/* Center Equalizer or Play Button */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
            {isCurrent && (
              <div className="flex items-end gap-0.5 h-3.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-accent/40 shadow-sm">
                <span className={`w-0.5 bg-accent rounded-full ${isCardPlaying ? 'animate-bounce h-3.5' : 'h-1.5'}`} />
                <span className={`w-0.5 bg-accent rounded-full ${isCardPlaying ? 'animate-bounce h-2 delay-100' : 'h-2.5'}`} />
                <span className={`w-0.5 bg-accent rounded-full ${isCardPlaying ? 'animate-bounce h-3 delay-200' : 'h-1'}`} />
              </div>
            )}

            <button
              type="button"
              aria-label={isCardPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
              onClick={handlePlayClick}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 cursor-pointer ${
                isCurrent
                  ? 'opacity-100 scale-100 bg-accent text-accent-foreground ring-4 ring-accent/30 shadow-accent/50'
                  : 'opacity-90 sm:opacity-0 translate-y-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 bg-accent text-accent-foreground hover:scale-110 hover:shadow-accent/40'
              }`}
            >
              {isCardPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Track Metadata with Devanagari Touch */}
      <div className="mt-3 px-1 relative z-10">
        <h4
          className={`font-black text-sm tracking-tight truncate ${
            isCurrent ? 'text-accent' : 'text-foreground group-hover:text-accent transition-colors'
          }`}
        >
          {track.title}
        </h4>

        {track.titleDevanagari && (
          <p className="text-[11px] text-foreground-subtle font-hindi truncate mt-0.5">
            {track.titleDevanagari}
          </p>
        )}

        <p className="text-xs text-foreground-muted truncate mt-0.5 font-medium">
          {track.artist}
        </p>

        <div className="flex items-center justify-between text-[10px] text-foreground-subtle mt-1.5 pt-1.5 border-t border-white/[0.05]">
          <span className="truncate max-w-[100px] font-medium">{track.genre}</span>
          <span className="font-mono">{track.year}</span>
        </div>
      </div>
    </div>
  );
};
