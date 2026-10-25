import React from 'react';
import { Track } from '../../types/music';
import { useAudio } from '../../context/AudioContext';
import { useLibrary } from '../../context/LibraryContext';
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

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpenDetail?.(track);
      }}
      onClick={() => onOpenDetail?.(track)}
      className="group relative flex flex-col p-3 rounded-2xl bg-surface/60 hover:bg-surface-hover/80 border border-border/40 hover:border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 select-none cursor-pointer"
    >
      {/* Cover Artwork Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-md bg-surface-subtle">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Floating Mood Badge */}
        {track.moods[0] && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-black/60 text-white/90 backdrop-blur-md border border-white/10">
            {track.moods[0]}
          </span>
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          aria-label={liked ? 'Unlike' : 'Like'}
          onClick={handleLike}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-all ${
            liked
              ? 'bg-rose-500/20 text-rose-500 opacity-100'
              : 'bg-black/50 text-white/80 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-black/80'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
        </button>

        {/* Play / Pause Overlay Button */}
        <button
          type="button"
          aria-label={isCardPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
          onClick={handlePlayClick}
          className={`absolute bottom-3 right-3 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
            isCurrent
              ? 'opacity-100 scale-100 bg-accent text-accent-foreground ring-4 ring-accent/30'
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

      {/* Track Info */}
      <div className="mt-3">
        <h4
          className={`font-bold text-sm truncate ${
            isCurrent ? 'text-accent' : 'text-foreground'
          }`}
        >
          {track.title}
        </h4>
        <p className="text-xs text-foreground-muted truncate mt-0.5">
          {track.artist}
        </p>
        <p className="text-[11px] text-foreground-subtle/80 font-normal truncate mt-0.5">
          {track.titleDevanagari}
        </p>
      </div>
    </div>
  );
};
