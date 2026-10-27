import React, { useState, useEffect } from 'react';
import { audioEngine } from '../../services/audioEngine';
import { sessionTimer } from '../../services/sessionMixService';
import { Clock, X, Check, Timer, Moon } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

interface SessionTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionTimerModal: React.FC<SessionTimerModalProps> = ({ isOpen, onClose }) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(() =>
    sessionTimer.getRemainingSeconds()
  );
  const [isEndOfTrack, setIsEndOfTrack] = useState<boolean>(() =>
    sessionTimer.isEndOfTrackActive()
  );

  useEffect(() => {
    const unsubscribe = sessionTimer.subscribe((rem, endOfTrack) => {
      setRemainingSeconds(rem);
      setIsEndOfTrack(endOfTrack);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const handleSetTimer = (minutes: number) => {
    sessionTimer.setTimer(minutes, () => {
      audioEngine.pause();
    });
    onClose();
  };

  const handleSetEndOfTrack = () => {
    sessionTimer.setTimer('end_of_track', () => {
      audioEngine.pause();
    });
    onClose();
  };

  const handleCancelTimer = () => {
    sessionTimer.cancelTimer();
  };

  const timerOptions = [
    { label: '15 Minutes', value: 15 },
    { label: '30 Minutes', value: 30 },
    { label: '45 Minutes', value: 45 },
    { label: '60 Minutes', value: 60 },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sleep & Session Timer"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none"
    >
      <div className="relative w-full max-w-sm rounded-[2rem] bg-surface border border-border shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-accent/15 text-accent">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-foreground">
                Session Sleep Timer
              </h2>
              <p className="text-xs text-foreground-muted">
                Auto-pause playback when time expires
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Close timer modal"
            onClick={onClose}
            className="p-1.5 rounded-full text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Active Countdown Status */}
        {sessionTimer.isTimerActive() && (
          <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Timer className="w-5 h-5 text-accent animate-pulse" />
              <div>
                <span className="text-xs font-bold text-accent block">
                  {isEndOfTrack ? 'Pausing at End of Track' : 'Timer Active'}
                </span>
                {!isEndOfTrack && remainingSeconds !== null && (
                  <span className="text-sm font-mono font-black text-foreground">
                    {formatTime(remainingSeconds)} remaining
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCancelTimer}
              className="px-2.5 py-1 rounded-lg bg-surface hover:bg-surface-hover border border-border text-foreground-muted hover:text-rose-500 text-xs font-bold transition-all cursor-pointer"
            >
              Turn Off
            </button>
          </div>
        )}

        {/* Preset Duration Buttons */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted block">
            Select Duration:
          </span>

          <div className="grid grid-cols-2 gap-2">
            {timerOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSetTimer(opt.value)}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-border text-xs font-bold text-foreground transition-all cursor-pointer active:scale-95"
              >
                <span>{opt.label}</span>
                <Clock className="w-3.5 h-3.5 text-accent" />
              </button>
            ))}
          </div>

          {/* End of Track Option */}
          <button
            type="button"
            onClick={handleSetEndOfTrack}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer active:scale-95 ${
              isEndOfTrack
                ? 'bg-accent/15 border-accent text-accent'
                : 'bg-surface-subtle hover:bg-surface-hover border-border text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-accent" />
              <span>End of this track</span>
            </div>
            {isEndOfTrack && <Check className="w-4 h-4 text-accent" />}
          </button>
        </div>

        {/* Truthful Native Clarification */}
        <p className="text-[11px] text-foreground-muted leading-relaxed">
          The sleep timer operates locally in-session. When the timer expires, audio playback pauses gracefully without abrupt cutoff.
        </p>
      </div>
    </div>
  );
};
