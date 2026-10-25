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
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  allTracks,
  onOpenDetail,
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
      className="group relative flex flex-col p-3 rounded-2xl bg-surface/50 hover:bg-surface-hover/90 border border-white/5 hover:border-white/15 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer select-none"
    >
      {/* Vinyl record peek container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-md bg-surface-subtle">
        {/* Subtle grooved vinyl disc sliding out on hover */}
        <div
          className={`absolute top-2 right-2 bottom-2 w-full rounded-full bg-[#111319] border border-white/10 opacity-70 group-hover:translate-x-3.5 group-hover:opacity-100 transition-all duration-500 pointer-events-none flex items-center justify-center ${
            isCardPlaying ? 'animate-spin-slow' : ''
          }`}
          style={{
            boxShadow: 'inset 0 0 16px rgba(0,0,0,0.8), 0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          {/* Vinyl grooves */}
          <div className="w-3/4 h-3/4 rounded-full border border-white/5 flex items-center justify-center">
            <div className="w-1/2 h-1/2 rounded-full border border-white/10 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-accent/80 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-black" />
              </div>
            </div>
          </div>
        </div>

        {/* Front Album Sleeve Artwork */}
        <div className="relative z-10 w-full h-full rounded-xl overflow-hidden shadow-sm">
          <img
            src={imgSrc}
            alt={track.title}
            onError={handleImageError}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Floating Mood Badge */}
          {track.moods[0] && (
            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/60 text-white/95 backdrop-blur-md border border-white/10 shadow-sm">
              {track.moods[0]}
            </span>
          )}

          {/* Favorite Heart Button */}
          <button
            type="button"
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={handleLike}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all active:scale-90 ${
              liked
                ? 'bg-rose-500/20 text-rose-500 opacity-100'
                : 'bg-black/50 text-white/80 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-black/80'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
          </button>

          {/* Center / Bottom Play Button */}
          <button
            type="button"
            aria-label={isCardPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
            onClick={handlePlayClick}
            className={`absolute bottom-3 right-3 w-11 h-11 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 active:scale-90 ${
              isCurrent
                ? 'opacity-100 scale-100 bg-accent text-accent-foreground ring-4 ring-accent/30 shadow-accent/50'
                : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 bg-accent text-accent-foreground hover:scale-105 hover:shadow-accent/40'
            }`}
          >
            {isCardPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Track Metadata */}
      <div className="mt-3 relative z-10">
        <h4
          className={`font-bold text-sm tracking-tight truncate ${
            isCurrent ? 'text-accent' : 'text-foreground group-hover:text-accent transition-colors'
          }`}
        >
          {track.title}
        </h4>
        <p className="text-xs text-foreground-muted truncate mt-0.5 font-medium">
          {track.artist}
        </p>
        <p className="text-[11px] text-foreground-subtle truncate mt-1">
          {track.genre} • {track.year}
        </p>
      </div>
    </div>
  );
};
