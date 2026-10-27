import React, { useState, useRef } from 'react';
import { useAudio } from '../../context/AudioContext';
import { useLibrary } from '../../context/LibraryContext';
import { formatTime } from '../../utils/formatters';
import { AudioVisualizer } from './AudioVisualizer';
import {
  X,
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
  Sparkles,
  Info,
  Radio,
  FileText,
  ListMusic,
  Timer,
} from 'lucide-react';
import { SessionTimerModal } from './SessionTimerModal';
import { sessionTimer } from '../../services/sessionMixService';

export const NowPlayingModal: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isExpandedNowPlaying,
    setIsExpandedNowPlaying,
    setIsQueueDrawerOpen,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
  } = useAudio();

  const { isLiked, toggleLike } = useLibrary();
  const [activeTab, setActiveTab] = useState<'visualizer' | 'lyrics'>('visualizer');
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [hoverSeekTime, setHoverSeekTime] = useState<number | null>(null);

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
    const clickX = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seek(ratio * duration);
  };

  const handleProgressBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    setHoverSeekTime(ratio * duration);
  };

  if (!isExpandedNowPlaying || !currentTrack) return null;

  const liked = isLiked(currentTrack.id);
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  // Active lyric calculation
  const currentLyric = currentTrack.lyrics?.slice().reverse().find((l) => currentTime >= l.time);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Now Playing"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-background/98 backdrop-blur-3xl overflow-y-auto animate-fade-in select-none"
    >
      {/* Dynamic Ambient Background Mesh Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-rose-600/10 blur-[130px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
            Now Playing • GaanaSuno Studio
          </span>
        </div>

        {/* Tab Switcher: Visualizer vs Interactive Lyrics */}
        <div className="flex items-center bg-surface-subtle p-1 rounded-2xl border border-white/10 text-xs font-semibold shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('visualizer')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'visualizer'
                ? 'bg-accent text-accent-foreground shadow-sm font-bold'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Visualizer</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lyrics')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'lyrics'
                ? 'bg-accent text-accent-foreground shadow-sm font-bold'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lyrics ({currentTrack.lyrics?.length || 0})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Sleep / Session Timer Toggle */}
          <button
            type="button"
            aria-label="Sleep & Session Timer"
            onClick={() => setIsTimerModalOpen(true)}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              sessionTimer.isTimerActive()
                ? 'bg-accent/20 text-accent ring-1 ring-accent/40 shadow-sm'
                : 'bg-surface-hover hover:bg-surface-active text-foreground-muted hover:text-foreground'
            }`}
            title="Set Sleep Timer"
          >
            <Timer className="w-5 h-5" />
          </button>

          {/* Quick Queue Toggle */}
          <button
            type="button"
            aria-label="Open Queue"
            onClick={() => {
              setIsExpandedNowPlaying(false);
              setIsQueueDrawerOpen(true);
            }}
            className="p-2 rounded-full bg-surface-hover hover:bg-surface-active text-foreground-muted hover:text-foreground transition-all cursor-pointer"
          >
            <ListMusic className="w-5 h-5" />
          </button>

          <button
            type="button"
            aria-label="Close now playing"
            onClick={() => setIsExpandedNowPlaying(false)}
            className="p-2 rounded-full bg-surface-hover hover:bg-surface-active text-foreground-muted hover:text-foreground transition-all cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-4 max-w-4xl mx-auto w-full">
        {activeTab === 'visualizer' ? (
          <div className="flex flex-col items-center w-full max-w-md">
            {/* Big Artwork Vinyl Turntable Disc with Smooth Circular Spin */}
            <div className="relative mb-6 group flex items-center justify-center">
              {/* Ambient Turntable Glow */}
              {isPlaying && (
                <div className="absolute -inset-6 rounded-full bg-accent/25 blur-3xl animate-pulse pointer-events-none" />
              )}

              <div
                className={`relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-4 border-white/15 bg-[#0c0e14] flex items-center justify-center transition-transform duration-700 ${
                  isPlaying ? 'animate-spin-disc' : ''
                }`}
                style={{
                  animationDuration: '18s',
                  animationPlayState: isPlaying ? 'running' : 'paused',
                }}
              >
                {/* Vinyl Grooves concentric rings */}
                <div className="absolute inset-2.5 rounded-full border border-white/5 pointer-events-none z-10" />
                <div className="absolute inset-7 rounded-full border border-white/5 pointer-events-none z-10" />
                <div className="absolute inset-12 rounded-full border border-white/10 pointer-events-none z-10" />

                {/* Album Artwork Label */}
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover rounded-full"
                />

                {/* Center Turntable Spindle and Label Hub */}
                <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-surface-subtle/90 border-2 border-accent/60 shadow-2xl flex items-center justify-center z-20 pointer-events-none backdrop-blur-md">
                  <div className="w-4 h-4 rounded-full bg-[#0c0e14] border border-white/50 shadow-inner flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </div>
                </div>

                {/* Vinyl Light Glare Sweep */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-10" />
              </div>
            </div>

            {/* Studio Canvas Audio Visualizer */}
            <div className="w-full px-2 mb-4">
              <AudioVisualizer mode="bars" height={56} className="w-full" />
            </div>
          </div>
        ) : (
          /* Interactive Lyrics & Translation View */
          <div className="w-full max-w-lg h-80 sm:h-96 overflow-y-auto px-5 py-6 rounded-[1.75rem] bg-surface/50 border border-white/10 text-center flex flex-col items-center justify-center shadow-xl backdrop-blur-md">
            {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
              <div className="space-y-6 w-full">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/15 px-3 py-1 rounded-full border border-accent/20 inline-block mb-2">
                  Tap line to seek
                </span>
                {currentTrack.lyrics.map((lyric, idx) => {
                  const isActive = currentLyric?.text === lyric.text;
                  return (
                    <div
                      key={idx}
                      role="button"
                      tabIndex={0}
                      onClick={() => seek(lyric.time)}
                      className={`cursor-pointer transition-all duration-300 p-2 rounded-xl ${
                        isActive
                          ? 'scale-105 text-accent font-extrabold drop-shadow-md bg-accent/10 border border-accent/25'
                          : 'text-foreground-muted/70 hover:text-foreground hover:bg-white/5 font-medium'
                      }`}
                    >
                      <p className="text-lg sm:text-xl font-hindi leading-relaxed">
                        {lyric.text}
                      </p>
                      {lyric.translation && (
                        <p className="text-xs sm:text-sm text-foreground-subtle italic mt-1 font-sans">
                          {lyric.translation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-foreground-muted text-sm space-y-2">
                <p className="font-semibold text-foreground">
                  Traditional Acoustic Instrumental
                </p>
                <p className="text-xs text-foreground-subtle max-w-xs">
                  This track is a classical Indian raga composition featuring authentic instruments. Let the meditative notes transport you!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Track Title, Artist & Heart Button */}
        <div className="w-full max-w-md flex items-center justify-between mt-3 px-1">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight truncate">
              {currentTrack.title}
            </h2>
            {currentTrack.titleDevanagari && (
              <p className="text-xs text-foreground-subtle font-hindi truncate mt-0.5">
                {currentTrack.titleDevanagari}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-accent truncate">
                {currentTrack.artist}
              </span>
              <span className="text-xs text-foreground-muted">•</span>
              <span className="text-xs text-foreground-muted truncate font-medium">
                {currentTrack.album}
              </span>
            </div>
          </div>

          <button
            type="button"
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={() => toggleLike(currentTrack.id)}
            className={`p-3 rounded-full transition-transform active:scale-90 cursor-pointer ${
              liked
                ? 'text-rose-500 bg-rose-500/15 ring-1 ring-rose-500/30'
                : 'text-foreground-muted hover:text-foreground bg-surface-hover'
            }`}
          >
            <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Seekable Progress Bar */}
        <div className="w-full max-w-md mt-6">
          <div
            ref={progressBarRef}
            onClick={handleBarClick}
            onTouchStart={handleBarClick}
            onMouseMove={handleProgressBarMouseMove}
            onMouseLeave={() => setHoverSeekTime(null)}
            className="relative w-full group py-3 cursor-pointer select-none"
            role="slider"
            aria-label="Seek track"
            aria-valuemin={0}
            aria-valuemax={duration || 100}
            aria-valuenow={currentTime}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') seek(Math.min(duration, currentTime + 5));
              if (e.key === 'ArrowLeft') seek(Math.max(0, currentTime - 5));
            }}
          >
            {/* Tooltip on hover */}
            {hoverSeekTime !== null && (
              <div
                className="absolute -top-6 -translate-x-1/2 px-2.5 py-0.5 rounded-md bg-foreground text-background text-xs font-mono pointer-events-none border border-border shadow-xl backdrop-blur-md"
                style={{
                  left: `${Math.max(6, Math.min(94, (hoverSeekTime / (duration || 1)) * 100))}%`,
                }}
              >
                {formatTime(hoverSeekTime)}
              </div>
            )}

            {/* Visual Track Base */}
            <div className="w-full h-2 rounded-full bg-foreground/10 overflow-hidden relative group-hover:h-2.5 transition-all">
              {/* Filled Progress Bar Track */}
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent via-orange-500 to-accent transition-all duration-75 shadow-[0_0_12px_var(--accent)]"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>

            {/* Scrubber Thumb Knob */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg ring-2 ring-accent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -ml-2"
              style={{ left: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-foreground-muted mt-1 px-0.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Large Playback Controls */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mt-6">
          <button
            type="button"
            aria-label="Toggle shuffle"
            onClick={toggleShuffle}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isShuffle ? 'text-accent bg-accent/15' : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            type="button"
            aria-label="Previous track"
            onClick={previousTrack}
            className="p-2 text-foreground-muted hover:text-foreground transition-colors active:scale-90 cursor-pointer"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          <button
            type="button"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all shadow-accent/40 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>

          <button
            type="button"
            aria-label="Next track"
            onClick={nextTrack}
            className="p-2 text-foreground-muted hover:text-foreground transition-colors active:scale-90 cursor-pointer"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          <button
            type="button"
            aria-label="Cycle repeat mode"
            onClick={cycleRepeat}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              repeatMode !== 'off'
                ? 'text-accent bg-accent/15'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center justify-center gap-3 w-full max-w-xs mt-6">
          <button
            type="button"
            aria-label="Toggle mute"
            onClick={toggleMute}
            className="text-foreground-muted hover:text-foreground cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4" />
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
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            aria-label="Volume"
            className="w-full h-1.5 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>
      </main>

      {/* Bottom Legal & Attribution Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-border/60 max-w-4xl mx-auto w-full text-xs text-foreground-muted flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent shrink-0" />
          <span>
            Mood tags: <strong className="text-foreground">{currentTrack.moods.join(', ')}</strong>
            {currentTrack.vibeDescription && ` — ${currentTrack.vibeDescription}`}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-foreground-subtle shrink-0">
          <Info className="w-3.5 h-3.5" />
          <span>{currentTrack.licenseNote}</span>
        </div>
      </footer>

      {/* Sleep & Session Timer Modal */}
      <SessionTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
      />
    </div>
  );
};
