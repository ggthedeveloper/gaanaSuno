import React, { useState, useMemo } from 'react';
import { Track } from '../../types/music';
import { useAudio } from '../../context/AudioContext';
import { useLibrary } from '../../context/LibraryContext';
import {
  DiscoveryLevel,
  getBeyondTasteRecommendations,
  recordDiscoverySignal,
  resetDiscoverySignals,
  getDiscoveryFeedback,
  surpriseMeDiscovery,
  saveDiscoveryLevel,
  getSavedDiscoveryLevel,
} from '../../services/discoveryEngine';
import {
  Compass,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Dice5,
  Play,
  Pause,
  Info,
} from 'lucide-react';

interface BeyondTasteDiscoveryProps {
  onSelectTrack: (track: Track) => void;
  className?: string;
}

export const BeyondTasteDiscovery: React.FC<BeyondTasteDiscoveryProps> = ({
  onSelectTrack,
  className = '',
}) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const { likedTrackIds, recentlyPlayedTracks } = useLibrary();

  const [discoveryLevel, setDiscoveryLevel] = useState<DiscoveryLevel>(getSavedDiscoveryLevel);
  const [feedbackState, setFeedbackState] = useState(getDiscoveryFeedback);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const recentIds = useMemo(() => recentlyPlayedTracks.map((t) => t.id), [recentlyPlayedTracks]);

  // Compute recommendations dynamically
  const discoveryResult = useMemo(() => {
    return getBeyondTasteRecommendations({
      level: discoveryLevel,
      likedIds: likedTrackIds,
      recentIds,
      feedback: feedbackState,
      limit: 4,
    });
  }, [discoveryLevel, likedTrackIds, recentIds, feedbackState]);

  const handleLevelChange = (newLevel: DiscoveryLevel) => {
    setDiscoveryLevel(newLevel);
    saveDiscoveryLevel(newLevel);
  };

  const handleSignal = (trackId: string, trackTitle: string, signal: 'more' | 'less') => {
    const updated = recordDiscoverySignal(trackId, signal);
    setFeedbackState(updated);
    const msg =
      signal === 'more'
        ? `Added signal: More like "${trackTitle}"`
        : `Removed from suggestions: "${trackTitle}"`;
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleResetSignals = () => {
    resetDiscoverySignals();
    setFeedbackState({ moreLikeThisIds: [], notForMeIds: [] });
    setFeedbackToast('Discovery preference signals reset to neutral baseline.');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleSurpriseMe = () => {
    const surpriseTracks = surpriseMeDiscovery();
    if (surpriseTracks.length > 0) {
      playTrack(surpriseTracks[0], surpriseTracks);
      setFeedbackToast('Playing randomized eclectic surprise mix!');
      setTimeout(() => setFeedbackToast(null), 3000);
    }
  };

  const levels: { id: DiscoveryLevel; label: string; tag: string; desc: string }[] = [
    {
      id: 'familiar',
      label: 'Familiar Comfort',
      tag: '0% Drift',
      desc: 'Deep cuts strictly within your favorite moods and genres',
    },
    {
      id: 'balanced',
      label: 'Balanced Horizon',
      tag: '50% Drift',
      desc: 'Harmonious blend of your taste with adjacent indie & regional styles',
    },
    {
      id: 'experimental',
      label: 'Frontier Territory',
      tag: '100% Drift',
      desc: 'Acoustic classical ragas, folk poetry, and unexpected regional masterworks',
    },
  ];

  return (
    <section
      role="region"
      aria-label="Beyond Your Taste Discovery Engine"
      className={`relative overflow-hidden rounded-[2rem] p-5 sm:p-7 bg-surface/70 border border-border shadow-xl backdrop-blur-xl ${className}`}
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Beyond Your Taste • Discovery Mode</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            User-Controlled Taste Horizon
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted mt-0.5 font-medium max-w-xl">
            Choose how far you want to venture outside your familiar listening comfort zone.
          </p>
        </div>

        {/* Action Controls: Surprise Me & Reset */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent text-accent-foreground text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
            title="Surprise me with varied catalog gems"
          >
            <Dice5 className="w-3.5 h-3.5" />
            <span>Surprise Me</span>
          </button>

          {(feedbackState.moreLikeThisIds.length > 0 || feedbackState.notForMeIds.length > 0) && (
            <button
              type="button"
              onClick={handleResetSignals}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-border text-foreground-muted hover:text-foreground text-xs font-semibold transition-all cursor-pointer"
              title="Reset discovery signals"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Taste Signals</span>
            </button>
          )}
        </div>
      </div>

      {/* Toast Feedback Notification */}
      {feedbackToast && (
        <div className="relative z-10 mb-4 p-2.5 rounded-xl bg-accent/15 border border-accent/30 text-accent text-xs font-bold flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Discovery Level Accessible Segmented Control */}
      <div className="relative z-10 bg-surface-subtle p-1.5 rounded-2xl border border-border mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {levels.map((lvl) => {
            const isSelected = discoveryLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleLevelChange(lvl.id)}
                className={`flex flex-col text-left p-3 rounded-xl transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-surface text-foreground shadow-lg border border-accent/40 ring-1 ring-accent/20'
                    : 'text-foreground-muted hover:text-foreground hover:bg-surface/50 border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-black ${isSelected ? 'text-accent' : ''}`}>
                    {lvl.label}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-accent/20 text-accent'
                        : 'bg-foreground/5 text-foreground-muted'
                    }`}
                  >
                    {lvl.tag}
                  </span>
                </div>
                <p className="text-[11px] leading-snug text-foreground-muted line-clamp-2">
                  {lvl.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rationale Banner */}
      <div className="relative z-10 flex items-start gap-2.5 p-3 rounded-xl bg-surface/50 border border-border/60 text-xs text-foreground-muted mb-5">
        <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <div>
          <strong className="text-foreground">Transparent Recommendation Rationale: </strong>
          <span>{discoveryResult.rationale}</span>
        </div>
      </div>

      {/* Recommendation Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {discoveryResult.items.map(({ track, explanation, category }) => {
          const isCurrent = currentTrack?.id === track.id;
          const isCardPlaying = isCurrent && isPlaying;

          return (
            <div
              key={track.id}
              className="flex flex-col justify-between p-3.5 rounded-2xl bg-surface/90 border border-border hover:border-accent/40 transition-all shadow-sm hover:shadow-md group"
            >
              <div className="flex items-start gap-3">
                {/* Artwork with play button */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-md border border-border bg-surface-subtle">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    aria-label={isCardPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
                    onClick={() => {
                      if (isCurrent) togglePlay();
                      else playTrack(track, discoveryResult.items.map((i) => i.track));
                    }}
                    className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-md cursor-pointer"
                  >
                    {isCardPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3
                      role="button"
                      tabIndex={0}
                      onClick={() => onSelectTrack(track)}
                      className={`text-sm font-extrabold truncate hover:text-accent cursor-pointer ${
                        isCurrent ? 'text-accent' : 'text-foreground'
                      }`}
                    >
                      {track.title}
                    </h3>
                    <span className="text-[10px] text-foreground-subtle shrink-0">
                      • {track.language}
                    </span>
                  </div>

                  <p className="text-xs text-foreground-muted truncate font-medium">
                    {track.artist} • {track.genre}
                  </p>

                  {/* Plain-Language Recommendation Explanation */}
                  <div className="mt-1.5 p-1.5 rounded-lg bg-surface-subtle/80 border border-border/40 text-[11px] text-foreground-muted leading-tight">
                    <span className="font-semibold text-accent/90">Why: </span>
                    <span>{explanation}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Feedback Actions */}
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/40 text-xs">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    category === 'core_taste'
                      ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      : category === 'bridge_discovery'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}
                >
                  {category === 'core_taste'
                    ? 'Familiar Core'
                    : category === 'bridge_discovery'
                    ? 'Taste Bridge'
                    : 'Frontier Gem'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleSignal(track.id, track.title, 'more')}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-surface-hover text-foreground-muted hover:text-accent text-[11px] font-medium transition-colors cursor-pointer"
                    title="Recommend more tracks like this"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>More</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSignal(track.id, track.title, 'less')}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-surface-hover text-foreground-muted hover:text-rose-500 text-[11px] font-medium transition-colors cursor-pointer"
                    title="Not for me (dismiss from recommendations)"
                  >
                    <ThumbsDown className="w-3 h-3" />
                    <span>Not for me</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
