import React from 'react';
import { Track } from '../../types/music';
import { useAudio } from '../../context/AudioContext';
import { useLibrary } from '../../context/LibraryContext';
import { formatTime } from '../../utils/formatters';
import { X, Play, Pause, Heart, Sparkles, Shield } from 'lucide-react';

interface TrackDetailModalProps {
  track: Track | null;
  onClose: () => void;
}

export const TrackDetailModal: React.FC<TrackDetailModalProps> = ({ track, onClose }) => {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const { isLiked, toggleLike } = useLibrary();

  if (!track) return null;

  const isCurrent = currentTrack?.id === track.id;
  const isPlayingThis = isCurrent && isPlaying;
  const liked = isLiked(track.id);

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Track Details"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in"
    >
      <div className="w-full max-w-lg bg-surface border border-border shadow-2xl rounded-3xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-foreground-muted hover:text-foreground hover:bg-surface-active transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-xl shrink-0 border border-border/50">
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent bg-accent/15 px-2.5 py-0.5 rounded-full">
              {track.genre}
            </span>

            <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight mt-2">
              {track.title}
            </h3>

            <p className="text-xs text-foreground font-semibold mt-1">
              {track.artist}
            </p>

            {/* Play & Like Buttons */}
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
              <button
                type="button"
                onClick={handlePlay}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-accent text-accent-foreground font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                {isPlayingThis ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    <span>Play Track</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleLike(track.id)}
                className={`p-2 rounded-full border transition-colors ${
                  liked
                    ? 'text-rose-500 border-rose-500/40 bg-rose-500/10'
                    : 'text-foreground-muted border-border hover:text-foreground'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-6 pt-5 border-t border-border/60 text-xs">
          <div className="p-2.5 rounded-xl bg-surface-subtle border border-border/40">
            <span className="text-[10px] uppercase font-bold text-foreground-muted block">
              Album
            </span>
            <span className="font-semibold text-foreground truncate block mt-0.5">
              {track.album}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-subtle border border-border/40">
            <span className="text-[10px] uppercase font-bold text-foreground-muted block">
              Duration
            </span>
            <span className="font-semibold text-foreground font-mono block mt-0.5">
              {formatTime(track.duration)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-subtle border border-border/40">
            <span className="text-[10px] uppercase font-bold text-foreground-muted block">
              Release Year
            </span>
            <span className="font-semibold text-foreground block mt-0.5">
              {track.year}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-subtle border border-border/40">
            <span className="text-[10px] uppercase font-bold text-foreground-muted block">
              Language
            </span>
            <span className="font-semibold text-foreground block mt-0.5">
              {track.language}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-subtle border border-border/40">
            <span className="text-[10px] uppercase font-bold text-foreground-muted block">
              Tempo
            </span>
            <span className="font-semibold text-foreground capitalize block mt-0.5">
              {track.tempo || 'Medium'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-subtle border border-border/40">
            <span className="text-[10px] uppercase font-bold text-foreground-muted block">
              Audio Format
            </span>
            <span className="font-semibold text-foreground block mt-0.5">
              {track.youtubeId ? 'YouTube Stream (100% Legal)' : 'Lossless HD'}
            </span>
          </div>
        </div>

        {/* Mood Tags */}
        <div className="mt-4">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Assigned Mood & Emotion Tags</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {track.moods.map((m) => (
              <span
                key={m}
                className="px-2.5 py-1 rounded-lg bg-surface-hover border border-border text-xs font-semibold text-foreground-muted capitalize"
              >
                {m}
              </span>
            ))}
          </div>
          {track.vibeDescription && (
            <p className="text-xs text-foreground-muted mt-2 italic">
              "{track.vibeDescription}"
            </p>
          )}
        </div>

        {/* Legal Attribution */}
        <div className="mt-5 p-3 rounded-xl bg-surface-subtle border border-border/50 text-[11px] text-foreground-muted flex items-start gap-2">
          <Shield className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>{track.licenseNote}</span>
        </div>
      </div>
    </div>
  );
};
