import React, { useState, useMemo } from 'react';
import { Track } from '../../types/music';
import { useAudio } from '../../context/AudioContext';
import { useLibrary } from '../../context/LibraryContext';
import {
  MomentId,
  MOMENT_CONFIGS,
  generateMomentMix,
  sessionTimer,
} from '../../services/sessionMixService';
import { audioEngine } from '../../services/audioEngine';
import { formatTime, formatDurationLong } from '../../utils/formatters';
import {
  Sparkles,
  Clock,
  Play,
  X,
  BookmarkPlus,
  Check,
  Timer,
} from 'lucide-react';

interface MomentMixModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMoment?: MomentId;
  onSelectTrack: (track: Track) => void;
}

export const MomentMixModal: React.FC<MomentMixModalProps> = ({
  isOpen,
  onClose,
  initialMoment = 'unwind',
  onSelectTrack,
}) => {
  const { playTrack } = useAudio();
  const { likedTrackIds, createPlaylist, addTrackToPlaylist } = useLibrary();

  const [selectedMoment, setSelectedMoment] = useState<MomentId>(initialMoment);
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [enableTimer, setEnableTimer] = useState<boolean>(true);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const momentKeys = Object.keys(MOMENT_CONFIGS) as MomentId[];

  // Generate mix
  const mixResult = useMemo(() => {
    return generateMomentMix(selectedMoment, selectedDuration, likedTrackIds);
  }, [selectedMoment, selectedDuration, likedTrackIds]);

  if (!isOpen) return null;

  const handleStartSession = () => {
    if (mixResult.tracks.length > 0) {
      playTrack(mixResult.tracks[0], mixResult.tracks);

      // If user enabled timer, activate session sleep timer
      if (enableTimer) {
        sessionTimer.setTimer(selectedDuration, () => {
          audioEngine.pause();
        });
      }

      onClose();
    }
  };

  const handleSaveAsPlaylist = () => {
    const plTitle = `${mixResult.config.title} Mix`;
    const newPl = createPlaylist(
      plTitle,
      mixResult.config.description
    );
    // Add tracks to new playlist
    mixResult.tracks.forEach((t) => {
      addTrackToPlaylist(newPl.id, t.id);
    });
    setSavedToast(`Saved "${plTitle}" to your Library!`);
    setTimeout(() => setSavedToast(null), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Moment Mix Listening Sessions"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fade-in select-none"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] bg-surface border border-border shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-accent/15 text-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                Moment Mix Sessions
              </h2>
              <p className="text-xs text-foreground-muted">
                Curated listening sessions tailored for your present moment
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close session modal"
            onClick={onClose}
            className="p-2 rounded-full text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast */}
        {savedToast && (
          <div className="p-3 rounded-xl bg-accent/15 border border-accent/30 text-accent text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{savedToast}</span>
          </div>
        )}

        {/* Moment Choice Horizontal Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted block">
            1. Select Session Intention:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {momentKeys.map((key) => {
              const cfg = MOMENT_CONFIGS[key];
              const isSelected = selectedMoment === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedMoment(key)}
                  className={`flex items-center gap-2 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-accent/15 border-accent text-foreground shadow-md ring-1 ring-accent/30 scale-[1.02]'
                      : 'bg-surface-subtle hover:bg-surface-hover border-border text-foreground-muted hover:text-foreground'
                  }`}
                >
                  <span className="text-xl shrink-0">{cfg.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-extrabold truncate">{cfg.title}</h3>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
              2. Session Duration:
            </span>
            <span className="text-xs font-mono font-bold text-accent">
              ~{mixResult.targetDurationMinutes} Minutes ({mixResult.tracks.length} Tracks)
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[15, 30, 45, 60].map((mins) => {
              const isSelected = selectedDuration === mins;
              return (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setSelectedDuration(mins)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-accent text-accent-foreground border-accent shadow-sm'
                      : 'bg-surface-subtle hover:bg-surface-hover border-border text-foreground-muted hover:text-foreground'
                  }`}
                >
                  {mins} min
                </button>
              );
            })}
          </div>
        </div>

        {/* Auto-pause Sleep Timer Toggle */}
        <label className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-subtle border border-border cursor-pointer">
          <div className="flex items-center gap-3">
            <Timer className="w-5 h-5 text-accent" />
            <div>
              <span className="text-xs font-bold text-foreground block">
                Auto-pause when session ends (Session Timer)
              </span>
              <span className="text-[11px] text-foreground-muted">
                Pauses playback automatically after {selectedDuration} minutes.
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={enableTimer}
            onChange={(e) => setEnableTimer(e.target.checked)}
            className="w-5 h-5 accent-accent rounded cursor-pointer"
          />
        </label>

        {/* Active Session Overview Banner */}
        <div className={`p-5 rounded-3xl bg-gradient-to-br ${mixResult.config.gradient} text-white shadow-xl`}>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80 mb-1">
            <span>{mixResult.config.emoji}</span>
            <span>{mixResult.config.tagline}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">{mixResult.config.title}</h3>
          <p className="text-xs sm:text-sm text-white/90 mt-1 max-w-lg leading-relaxed">
            {mixResult.config.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-white/80 mt-3 pt-3 border-t border-white/15">
            <span className="flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              {formatDurationLong(mixResult.actualDurationSeconds)}
            </span>
            <span>•</span>
            <span>{mixResult.tracks.length} Handpicked Tracks</span>
          </div>
        </div>

        {/* Track Preview List */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted block">
            Session Tracklist:
          </span>

          <div className="rounded-2xl border border-border divide-y divide-border/60 overflow-hidden bg-surface-subtle max-h-52 overflow-y-auto">
            {mixResult.tracks.map((track, idx) => (
              <div
                key={track.id}
                onClick={() => onSelectTrack(track)}
                className="flex items-center justify-between p-3 hover:bg-surface-hover transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xs font-mono text-foreground-subtle w-4">{idx + 1}</span>
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-9 h-9 rounded-lg object-cover shrink-0 border border-border"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-foreground truncate">{track.title}</h4>
                    <p className="text-[11px] text-foreground-muted truncate">
                      {track.artist} • {track.genre}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-foreground-muted shrink-0 ml-2">
                  {formatTime(track.duration)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleSaveAsPlaylist}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-surface-subtle hover:bg-surface-hover border border-border text-foreground font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <BookmarkPlus className="w-4 h-4 text-accent" />
            <span>Save as Playlist</span>
          </button>

          <button
            type="button"
            onClick={handleStartSession}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-accent text-accent-foreground font-extrabold text-sm uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
            <span>Start Session Mix</span>
          </button>
        </div>
      </div>
    </div>
  );
};
