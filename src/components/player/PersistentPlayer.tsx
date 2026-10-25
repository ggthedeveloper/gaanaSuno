import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { useLibrary } from '../../context/LibraryContext';
import { formatTime } from '../../utils/formatters';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Heart,
  ListMusic,
  Maximize2,
  Sparkles,
} from 'lucide-react';

export const PersistentPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    queue,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    setIsExpandedNowPlaying,
    isQueueDrawerOpen,
    setIsQueueDrawerOpen,
  } = useAudio();

  const { isLiked, toggleLike } = useLibrary();

  if (!currentTrack) return null;

  const liked = isLiked(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
  };

  return (
    <footer
      role="region"
      aria-label="Audio Player"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-xl border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.25)] select-none transition-all"
    >
      {/* Mobile Mini Player (< 640px) */}
      <div
        className="flex sm:hidden items-center justify-between px-3 py-2 cursor-pointer"
        onClick={() => setIsExpandedNowPlaying(true)}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-border/50">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className={`w-full h-full object-cover ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-foreground truncate">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-foreground-muted truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={() => toggleLike(currentTrack.id)}
            className={`p-2 rounded-lg ${
              liked ? 'text-rose-500' : 'text-foreground-muted'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-md active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            aria-label="Next track"
            onClick={nextTrack}
            className="p-2 rounded-lg text-foreground-muted active:text-foreground"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Seek Progress Indicator */}
      <div className="block sm:hidden w-full bg-border/40 h-1 relative">
        <div
          className="bg-accent h-full transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Desktop Player (>= 640px) */}
      <div className="hidden sm:flex items-center justify-between px-4 lg:px-8 py-3 max-w-7xl mx-auto gap-4">
        {/* Left: Track Information */}
        <div className="flex items-center gap-3.5 w-1/4 min-w-[200px]">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsExpandedNowPlaying(true)}
            aria-label="Expand Now Playing"
            className="group relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-md border border-border/60 cursor-pointer"
          >
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4
                onClick={() => setIsExpandedNowPlaying(true)}
                className="font-bold text-sm text-foreground truncate hover:text-accent cursor-pointer transition-colors"
              >
                {currentTrack.title}
              </h4>
            </div>
            <p className="text-xs text-foreground-muted truncate">
              {currentTrack.artist}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-accent/80 font-medium truncate mt-0.5">
              <Sparkles className="w-3 h-3" />
              <span>{currentTrack.titleDevanagari}</span>
            </div>
          </div>

          <button
            type="button"
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={() => toggleLike(currentTrack.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              liked
                ? 'text-rose-500 hover:text-rose-600'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Center: Playback Controls & Progress Bar */}
        <div className="flex flex-col items-center w-2/4 max-w-xl">
          <div className="flex items-center gap-3 md:gap-5 mb-1.5">
            <button
              type="button"
              aria-label="Toggle shuffle"
              onClick={toggleShuffle}
              className={`p-1.5 rounded-lg transition-colors ${
                isShuffle
                  ? 'text-accent bg-accent/15'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              type="button"
              aria-label="Previous track"
              onClick={previousTrack}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground transition-colors active:scale-95"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              type="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              aria-label="Next track"
              onClick={nextTrack}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground transition-colors active:scale-95"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              type="button"
              aria-label="Cycle repeat mode"
              onClick={cycleRepeat}
              className={`p-1.5 rounded-lg transition-colors ${
                repeatMode !== 'off'
                  ? 'text-accent bg-accent/15'
                  : 'text-foreground-muted hover:text-foreground'
              }`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Progress Scrubber */}
          <div className="w-full flex items-center gap-2.5">
            <span className="text-[11px] font-mono text-foreground-muted w-9 text-right">
              {formatTime(currentTime)}
            </span>

            <div className="relative flex-1 group py-1 cursor-pointer">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeekChange}
                aria-label="Seek track position"
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </div>

            <span className="text-[11px] font-mono text-foreground-muted w-9">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Volume, Queue, Fullscreen */}
        <div className="flex items-center justify-end gap-3 w-1/4 min-w-[200px]">
          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              onClick={toggleMute}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-foreground-muted" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-label="Volume slider"
              className="w-20 lg:w-24 h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          {/* Queue Drawer Button */}
          <button
            type="button"
            aria-label="Toggle Queue"
            onClick={() => setIsQueueDrawerOpen(!isQueueDrawerOpen)}
            className={`relative p-2 rounded-lg transition-colors ${
              isQueueDrawerOpen
                ? 'text-accent bg-accent/15'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-active'
            }`}
          >
            <ListMusic className="w-4 h-4" />
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center">
                {queue.length}
              </span>
            )}
          </button>

          {/* Expand Modal Button */}
          <button
            type="button"
            aria-label="Open immersive player"
            onClick={() => setIsExpandedNowPlaying(true)}
            className="p-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-active transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
