import React, { useState } from 'react';
import { Track } from '../../types/music';
import { useAudio } from '../../context/AudioContext';
import { useLibrary } from '../../context/LibraryContext';
import { formatTime } from '../../utils/formatters';
import { Play, Pause, Heart, MoreVertical, Plus, Check } from 'lucide-react';

interface TrackRowProps {
  track: Track;
  index: number;
  queueContext?: Track[];
  onOpenDetail?: (track: Track) => void;
}

export const TrackRow: React.FC<TrackRowProps> = ({
  track,
  index,
  queueContext,
  onOpenDetail,
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue } = useAudio();
  const { isLiked, toggleLike, customPlaylists, addTrackToPlaylist } = useLibrary();
  const [showMenu, setShowMenu] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const isCurrent = currentTrack?.id === track.id;
  const isRowPlaying = isCurrent && isPlaying;
  const liked = isLiked(track.id);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, queueContext);
    }
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(track.id);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(track);
    setShowMenu(false);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  return (
    <div
      role="row"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handlePlayClick(e as any);
        }
      }}
      className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-accent ${
        isCurrent
          ? 'bg-accent/10 border border-accent/20 text-accent'
          : 'hover:bg-surface-hover text-foreground/90'
      }`}
      onClick={() => onOpenDetail?.(track)}
    >
      {/* Left: Index / Play Icon & Track Metadata */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <div className="w-8 flex items-center justify-center text-sm font-semibold text-foreground-muted">
          <button
            type="button"
            aria-label={isRowPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
            onClick={handlePlayClick}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              isCurrent
                ? 'opacity-100 bg-accent text-accent-foreground'
                : 'opacity-0 group-hover:opacity-100 bg-foreground/10 hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {isRowPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
          {!isCurrent && (
            <span className="group-hover:hidden text-foreground-muted/70 text-xs font-mono">
              {index + 1}
            </span>
          )}
          {isCurrent && !isRowPlaying && (
            <span className="group-hover:hidden text-accent text-xs font-mono">
              ▶
            </span>
          )}
          {isRowPlaying && (
            <div className="group-hover:hidden flex items-end gap-0.5 h-3.5 w-3.5">
              <span className="w-1 bg-accent rounded-full animate-bounce h-3" />
              <span className="w-1 bg-accent rounded-full animate-bounce h-2 delay-100" />
              <span className="w-1 bg-accent rounded-full animate-bounce h-3.5 delay-200" />
            </div>
          )}
        </div>

        {/* Thumbnail Artwork */}
        <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-md border border-border bg-surface-subtle">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Titles & Artist */}
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold text-sm truncate ${
                isCurrent ? 'text-accent' : 'text-foreground'
              }`}
            >
              {track.title}
            </span>
            {track.licenseNote.toLowerCase().includes('youtube') && (
              <span className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-red-600/90 text-white shadow-xs">
                YT
              </span>
            )}
          </div>
          <div className="text-xs text-foreground-muted truncate font-medium">
            {track.artist}
          </div>
        </div>
      </div>

      {/* Center: Album (Desktop only) */}
      <div className="hidden md:block w-1/4 text-xs text-foreground-muted truncate pr-4">
        {track.album}
      </div>

      {/* Right: Actions & Duration */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          aria-label={liked ? `Remove ${track.title} from favorites` : `Add ${track.title} to favorites`}
          onClick={handleLikeClick}
          className={`p-1.5 rounded-lg transition-colors ${
            liked
              ? 'text-rose-500 hover:text-rose-600'
              : 'text-foreground-muted/50 hover:text-foreground group-hover:opacity-100 opacity-0 sm:opacity-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </button>

        <span className="text-xs text-foreground-muted/80 font-mono w-10 text-right">
          {formatTime(track.duration)}
        </span>

        {/* More Actions Dropdown Menu */}
        <div className="relative">
          <button
            type="button"
            aria-label="More options"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-active transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div
              className="absolute right-0 top-full mt-1.5 w-48 bg-surface border border-border shadow-2xl rounded-xl py-1.5 z-40 text-xs backdrop-blur-md"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleAddToQueue}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-foreground hover:bg-surface-hover text-left"
              >
                <Plus className="w-3.5 h-3.5 text-accent" />
                Add to Next in Queue
              </button>

              {customPlaylists.length > 0 && (
                <div className="border-t border-border/50 my-1 pt-1">
                  <span className="px-3 py-1 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider block">
                    Add to Playlist
                  </span>
                  {customPlaylists.map((pl) => (
                    <button
                      key={pl.id}
                      type="button"
                      onClick={() => {
                        addTrackToPlaylist(pl.id, track.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-foreground-muted hover:text-foreground hover:bg-surface-hover text-left"
                    >
                      <span className="truncate">{pl.title}</span>
                      {pl.trackIds.includes(track.id) && (
                        <Check className="w-3 h-3 text-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Added to queue confirmation badge */}
      {addedToast && (
        <div className="absolute right-12 bottom-full mb-1 bg-accent text-accent-foreground text-[11px] font-medium px-2 py-0.5 rounded shadow-lg pointer-events-none animate-fade-in">
          Added to Queue!
        </div>
      )}
    </div>
  );
};
