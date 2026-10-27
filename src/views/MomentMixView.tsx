import React, { useState, useMemo } from 'react';
import { Track } from '../types/music';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';
import {
  MomentId,
  MOMENT_CONFIGS,
  generateMomentMix,
  sessionTimer,
} from '../services/sessionMixService';
import { audioEngine } from '../services/audioEngine';
import { formatTime, formatDurationLong } from '../utils/formatters';
import {
  Clock,
  Sparkles,
  Play,
  BookmarkPlus,
  Check,
  Timer,
} from 'lucide-react';

interface MomentMixViewProps {
  onSelectTrack: (track: Track) => void;
}

export const MomentMixView: React.FC<MomentMixViewProps> = ({ onSelectTrack }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const { likedTrackIds, createPlaylist, addTrackToPlaylist } = useLibrary();

  const [selectedMoment, setSelectedMoment] = useState<MomentId>('focus');
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [enableTimer, setEnableTimer] = useState<boolean>(true);
  const [savedToast, setSavedToast] = useState<string | null>(null);

  const momentKeys = Object.keys(MOMENT_CONFIGS) as MomentId[];

  const mixResult = useMemo(() => {
    return generateMomentMix(selectedMoment, selectedDuration, likedTrackIds);
  }, [selectedMoment, selectedDuration, likedTrackIds]);

  const handleStartSession = () => {
    if (mixResult.tracks.length > 0) {
      playTrack(mixResult.tracks[0], mixResult.tracks);

      if (enableTimer) {
        sessionTimer.setTimer(selectedDuration, () => {
          audioEngine.pause();
        });
      }
    }
  };

  const handleSaveAsPlaylist = () => {
    const plTitle = `${mixResult.config.title} Mix (${selectedDuration}m)`;
    const newPl = createPlaylist(plTitle, mixResult.config.description);
    mixResult.tracks.forEach((t) => {
      addTrackToPlaylist(newPl.id, t.id);
    });
    setSavedToast(`Saved "${plTitle}" to your Library!`);
    setTimeout(() => setSavedToast(null), 3500);
  };

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      {/* Editorial Hero Header */}
      <section className="relative overflow-hidden rounded-[2rem] p-6 sm:p-10 bg-gradient-to-br from-indigo-500/10 via-surface to-surface border border-indigo-500/25 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-500/15 blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Timer className="w-3.5 h-3.5" />
            <span>Time-Bounded Listening</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Contextual <span className="text-gradient-accent">Moment Mixes</span>
          </h1>

          <p className="text-sm sm:text-base text-foreground-muted leading-relaxed font-medium">
            Curated listening sessions calibrated to your schedule with automatic sleep timer shutoff.
          </p>
        </div>
      </section>

      {/* Moment Selector Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <span>1. Choose Your Listening Intention</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {momentKeys.map((mKey) => {
            const cfg = MOMENT_CONFIGS[mKey];
            const isSelected = selectedMoment === mKey;
            return (
              <button
                key={cfg.id}
                type="button"
                onClick={() => setSelectedMoment(mKey)}
                className={`relative overflow-hidden text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-accent border-accent bg-accent/10 shadow-lg scale-[1.02]'
                    : 'border-border bg-surface hover:bg-surface-hover hover:border-border-hover'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl filter drop-shadow">{cfg.emoji}</span>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-accent text-accent-foreground">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-sm text-foreground">{cfg.title}</h3>
                <p className="text-xs text-foreground-muted line-clamp-2 mt-1 leading-snug">
                  {cfg.tagline}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Duration and Settings */}
      <section className="p-6 rounded-2xl bg-surface border border-border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-accent" />
              <span>2. Select Session Duration</span>
            </h3>
            <p className="text-xs text-foreground-muted">
              Packs tracks strictly calibrated to fit your exact time window.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[15, 30, 45, 60].map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => setSelectedDuration(dur)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedDuration === dur
                    ? 'bg-accent text-accent-foreground shadow-md'
                    : 'bg-surface-subtle text-foreground hover:bg-surface-hover border border-border'
                }`}
              >
                {dur} min
              </button>
            ))}
          </div>
        </div>

        {/* Timer toggle & actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={enableTimer}
              onChange={(e) => setEnableTimer(e.target.checked)}
              className="w-4 h-4 rounded text-accent focus:ring-accent border-border"
            />
            <span className="text-xs font-semibold text-foreground">
              Auto-stop playback when this session completes ({selectedDuration} mins)
            </span>
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveAsPlaylist}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-surface-hover text-xs font-bold text-foreground transition-all cursor-pointer"
            >
              <BookmarkPlus className="w-4 h-4 text-accent" />
              <span>Save as Playlist</span>
            </button>

            <button
              type="button"
              onClick={handleStartSession}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent text-accent-foreground font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Session Mix</span>
            </button>
          </div>
        </div>
      </section>

      {/* Generated Tracklist Preview */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-foreground">
              Packed Session: {mixResult.tracks.length} Songs ({formatDurationLong(mixResult.actualDurationSeconds)})
            </h3>
            <p className="text-xs text-foreground-muted mt-0.5">
              {mixResult.explanation}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {mixResult.tracks.map((track, idx) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <div
                key={`${track.id}-${idx}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-surface border border-border/80 hover:border-accent/40 transition-all group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="w-6 text-center text-xs font-mono font-bold text-foreground-muted">
                    {idx + 1}
                  </span>
                  <div
                    onClick={() => {
                      if (isThisPlaying) togglePlay();
                      else playTrack(track, mixResult.tracks);
                    }}
                    className="relative w-11 h-11 rounded-xl overflow-hidden cursor-pointer shrink-0"
                  >
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {isThisPlaying ? (
                        <div className="w-3 h-3 rounded-sm bg-accent animate-pulse" />
                      ) : (
                        <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p
                      onClick={() => onSelectTrack(track)}
                      className="text-sm font-extrabold text-foreground hover:text-accent transition-colors truncate cursor-pointer"
                    >
                      {track.title}
                    </p>
                    <p className="text-xs text-foreground-muted truncate">
                      {track.artist} • <span className="font-mono text-[10px]">{track.tempo}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-foreground-muted">
                    {formatTime(track.duration)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (isThisPlaying) togglePlay();
                      else playTrack(track, mixResult.tracks);
                    }}
                    className="p-2 rounded-xl bg-accent/10 hover:bg-accent text-accent hover:text-accent-foreground transition-all cursor-pointer"
                    aria-label={`Play ${track.title}`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Saved Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-24 right-6 z-50 p-4 rounded-2xl bg-surface border border-accent shadow-2xl flex items-center gap-3 animate-fade-in text-sm font-bold text-foreground">
          <div className="p-1.5 rounded-full bg-accent/20 text-accent">
            <Check className="w-4 h-4" />
          </div>
          <span>{savedToast}</span>
        </div>
      )}
    </div>
  );
};
