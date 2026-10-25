import React, { useState } from 'react';
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
} from 'lucide-react';

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

  if (!isExpandedNowPlaying || !currentTrack) return null;

  const liked = isLiked(currentTrack.id);

  // Active lyric calculation
  const currentLyric = currentTrack.lyrics?.slice().reverse().find((l) => currentTime >= l.time);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Now Playing"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-background/95 backdrop-blur-2xl overflow-y-auto animate-fade-in"
    >
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-accent/15 blur-[120px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
            Now Playing • GaanaSuno
          </span>
        </div>

        {/* Tab Switcher: Visualizer vs Lyrics */}
        <div className="flex items-center bg-surface-subtle p-1 rounded-xl border border-border/50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('visualizer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'visualizer'
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Visualizer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lyrics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'lyrics'
                ? 'bg-accent text-accent-foreground shadow-sm'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Lyrics ({currentTrack.lyrics?.length || 0})
          </button>
        </div>

        <button
          type="button"
          aria-label="Close now playing"
          onClick={() => setIsExpandedNowPlaying(false)}
          className="p-2 rounded-full bg-surface-hover hover:bg-surface-active text-foreground-muted hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-4 max-w-4xl mx-auto w-full">
        {activeTab === 'visualizer' ? (
          <div className="flex flex-col items-center w-full max-w-md">
            {/* Big Artwork with Glowing Ring */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-2 border-border/60 mb-6 group">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'animate-spin-slow' : ''
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white drop-shadow">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 uppercase">
                  {currentTrack.genre}
                </span>
                <span className="text-xs font-mono font-medium">
                  {currentTrack.year}
                </span>
              </div>
            </div>

            {/* Hardware Canvas Audio Visualizer */}
            <div className="w-full px-4 mb-4">
              <AudioVisualizer mode="bars" height={54} className="w-full" />
            </div>
          </div>
        ) : (
          /* Lyrics & Poetry View */
          <div className="w-full max-w-lg h-80 sm:h-96 overflow-y-auto px-4 py-6 rounded-2xl bg-surface/50 border border-border/60 text-center flex flex-col items-center justify-center">
            {currentTrack.lyrics && currentTrack.lyrics.length > 0 ? (
              <div className="space-y-6">
                {currentTrack.lyrics.map((lyric, idx) => {
                  const isActive = currentLyric?.text === lyric.text;
                  return (
                    <div
                      key={idx}
                      className={`transition-all duration-300 ${
                        isActive
                          ? 'scale-105 text-accent font-bold drop-shadow-md'
                          : 'text-foreground-muted/70 hover:text-foreground font-medium'
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
              <div className="text-foreground-muted text-sm">
                <p>No verified lyrics available for this classical/instrumental piece.</p>
                <p className="text-xs text-foreground-subtle mt-1">
                  Enjoy the acoustic raga instrumentation!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Track Metadata & Heart */}
        <div className="w-full max-w-md flex items-center justify-between mt-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight truncate">
              {currentTrack.title}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-semibold text-accent truncate">
                {currentTrack.artist}
              </span>
              <span className="text-xs text-foreground-muted">•</span>
              <span className="text-xs text-foreground-muted truncate font-hindi">
                {currentTrack.titleDevanagari}
              </span>
            </div>
          </div>

          <button
            type="button"
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={() => toggleLike(currentTrack.id)}
            className={`p-3 rounded-full transition-transform active:scale-90 ${
              liked
                ? 'text-rose-500 bg-rose-500/10'
                : 'text-foreground-muted hover:text-foreground bg-surface-hover'
            }`}
          >
            <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Seekable Progress Bar */}
        <div className="w-full max-w-md mt-6">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            aria-label="Seek track"
            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
          />
          <div className="flex items-center justify-between text-xs font-mono text-foreground-muted mt-1.5">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-6 sm:gap-8 mt-6">
          <button
            type="button"
            aria-label="Toggle shuffle"
            onClick={toggleShuffle}
            className={`p-2 rounded-lg transition-colors ${
              isShuffle ? 'text-accent' : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            type="button"
            aria-label="Previous track"
            onClick={previousTrack}
            className="p-2 text-foreground-muted hover:text-foreground transition-colors active:scale-90"
          >
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          <button
            type="button"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
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
            className="p-2 text-foreground-muted hover:text-foreground transition-colors active:scale-90"
          >
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          <button
            type="button"
            aria-label="Cycle repeat mode"
            onClick={cycleRepeat}
            className={`p-2 rounded-lg transition-colors ${
              repeatMode !== 'off'
                ? 'text-accent'
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
            className="text-foreground-muted hover:text-foreground"
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
            className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>
      </main>

      {/* Bottom Mood & Transparency Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-border/40 max-w-4xl mx-auto w-full text-xs text-foreground-muted flex flex-col sm:flex-row items-center justify-between gap-3">
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
    </div>
  );
};
