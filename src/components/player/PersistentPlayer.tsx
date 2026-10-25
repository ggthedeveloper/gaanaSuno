import React, { useState, useRef } from 'react';
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
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

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

  const handleProgressBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverSeekTime(pos * duration);
  };

  return (
    <footer
      role="region"
      aria-label="Audio Player"
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface/92 backdrop-blur-2xl border-t border-white/[0.08] shadow-[0_-12px_40px_rgba(0,0,0,0.5)] select-none transition-all"
    >
      {/* ============================================================== */}
      {/* MOBILE MINI PLAYER (< 640px)                                   */}
      {/* ============================================================== */}
      <div
        className="flex sm:hidden items-center justify-between px-3.5 py-2.5 cursor-pointer"
        onClick={() => setIsExpandedNowPlaying(true)}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className={`w-full h-full object-cover ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-extrabold text-sm text-foreground truncate">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-foreground-muted truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={() => toggleLike(currentTrack.id)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              liked ? 'text-rose-500' : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg active:scale-95 cursor-pointer"
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
            className="p-2 rounded-lg text-foreground-muted hover:text-foreground active:scale-95 cursor-pointer"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Seek Progress Indicator Line */}
      <div className="block sm:hidden w-full bg-white/5 h-1 relative">
        <div
          className="bg-accent h-full transition-all duration-150 shadow-[0_0_8px_var(--accent)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ============================================================== */}
      {/* DESKTOP & TABLET PLAYER (>= 640px)                             */}
      {/* ============================================================== */}
      <div className="hidden sm:flex items-center justify-between px-4 lg:px-8 py-3 max-w-7xl mx-auto gap-4">
        {/* Left: Track Information & Quick Heart */}
        <div className="flex items-center gap-3.5 w-1/4 min-w-[200px]">
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsExpandedNowPlaying(true)}
            aria-label="Expand Now Playing"
            className="group relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-lg border border-white/10 cursor-pointer"
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
            <h4
              onClick={() => setIsExpandedNowPlaying(true)}
              className="font-extrabold text-sm text-foreground truncate hover:text-accent cursor-pointer transition-colors"
            >
              {currentTrack.title}
            </h4>
            <p className="text-xs text-foreground-muted truncate font-medium mt-0.5">
              {currentTrack.artist}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-accent font-semibold truncate mt-0.5">
              {isPlaying && (
                <span className="flex items-end gap-0.5 h-2.5">
                  <span className="w-0.5 bg-accent rounded-full animate-bounce h-2.5" />
                  <span className="w-0.5 bg-accent rounded-full animate-bounce h-1.5 delay-100" />
                  <span className="w-0.5 bg-accent rounded-full animate-bounce h-2 delay-200" />
                </span>
              )}
              <span>{currentTrack.genre}</span>
            </div>
          </div>

          <button
            type="button"
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={() => toggleLike(currentTrack.id)}
            className={`p-2 rounded-xl transition-all active:scale-90 cursor-pointer ${
              liked
                ? 'text-rose-500 hover:text-rose-600 bg-rose-500/10'
                : 'text-foreground-muted hover:text-foreground hover:bg-white/5'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Center: Playback Controls & Precision Scrubber Bar */}
        <div className="flex flex-col items-center w-2/4 max-w-xl">
          <div className="flex items-center gap-4 md:gap-6 mb-1.5">
            <button
              type="button"
              aria-label="Toggle shuffle"
              onClick={toggleShuffle}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                isShuffle
                  ? 'text-accent bg-accent/15 border border-accent/25'
                  : 'text-foreground-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              type="button"
              aria-label="Previous track"
              onClick={previousTrack}
              className="p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              type="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              className="w-11 h-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all shadow-accent/30 cursor-pointer"
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
              className="p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              type="button"
              aria-label="Cycle repeat mode"
              onClick={cycleRepeat}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                repeatMode !== 'off'
                  ? 'text-accent bg-accent/15 border border-accent/25'
                  : 'text-foreground-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Progress Scrubber Bar with Hover Tooltip */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[11px] font-mono text-foreground-muted w-9 text-right font-medium">
              {formatTime(currentTime)}
            </span>

            <div
              ref={progressBarRef}
              onMouseMove={handleProgressBarMouseMove}
              onMouseLeave={() => setHoverSeekTime(null)}
              className="relative flex-1 group py-1.5 cursor-pointer"
            >
              {/* Tooltip on hover */}
              {hoverSeekTime !== null && (
                <div
                  className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-mono pointer-events-none border border-white/10 shadow-lg backdrop-blur-md"
                  style={{
                    left: `${(hoverSeekTime / (duration || 1)) * 100}%`,
                  }}
                >
                  {formatTime(hoverSeekTime)}
                </div>
              )}

              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeekChange}
                aria-label="Seek track position"
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </div>

            <span className="text-[11px] font-mono text-foreground-muted w-9 font-medium">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Volume, Queue, and Fullscreen */}
        <div className="flex items-center justify-end gap-3 w-1/4 min-w-[200px]">
          {/* Volume Control Slider */}
          <div className="flex items-center gap-2 group/volume">
            <button
              type="button"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              onClick={toggleMute}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground transition-colors cursor-pointer"
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
              className="w-20 lg:w-24 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </div>

          {/* Queue Drawer Button */}
          <button
            type="button"
            aria-label="Toggle Queue"
            onClick={() => setIsQueueDrawerOpen(!isQueueDrawerOpen)}
            className={`relative p-2 rounded-xl transition-all cursor-pointer ${
              isQueueDrawerOpen
                ? 'text-accent bg-accent/15 border border-accent/30'
                : 'text-foreground-muted hover:text-foreground hover:bg-white/5'
            }`}
          >
            <ListMusic className="w-4 h-4" />
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[9px] font-black px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-md">
                {queue.length}
              </span>
            )}
          </button>

          {/* Expand Now Playing Button */}
          <button
            type="button"
            aria-label="Open immersive player"
            onClick={() => setIsExpandedNowPlaying(true)}
            className="p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
