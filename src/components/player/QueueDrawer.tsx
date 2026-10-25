import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { formatTime } from '../../utils/formatters';
import { X, Trash2, Play, Volume2 } from 'lucide-react';

export const QueueDrawer: React.FC = () => {
  const {
    queue,
    queueIndex,
    currentTrack,
    isPlaying,
    isQueueDrawerOpen,
    setIsQueueDrawerOpen,
    playTrack,
    removeFromQueue,
    clearQueue,
  } = useAudio();

  if (!isQueueDrawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Queue Drawer"
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-surface/95 backdrop-blur-xl border-l border-border shadow-2xl flex flex-col animate-slide-left"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="font-bold text-base text-foreground">
            Playback Queue
          </h3>
          <p className="text-xs text-foreground-muted">
            {queue.length} track{queue.length !== 1 ? 's' : ''} in queue
          </p>
        </div>

        <div className="flex items-center gap-2">
          {queue.length > 1 && (
            <button
              type="button"
              aria-label="Clear queue"
              onClick={clearQueue}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-rose-500 hover:bg-surface-active transition-colors text-xs flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          <button
            type="button"
            aria-label="Close queue"
            onClick={() => setIsQueueDrawerOpen(false)}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-active transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 divide-y divide-border/30">
        {/* Now Playing Section */}
        {currentTrack && (
          <div className="pb-3 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent block mb-2">
              Now Playing
            </span>
            <div className="flex items-center gap-3 p-2 rounded-xl bg-accent/10 border border-accent/20">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-accent truncate">
                  {currentTrack.title}
                </h4>
                <p className="text-xs text-foreground-muted truncate">
                  {currentTrack.artist}
                </p>
              </div>
              {isPlaying && (
                <Volume2 className="w-4 h-4 text-accent animate-pulse shrink-0" />
              )}
            </div>
          </div>
        )}

        {/* Next Up Section */}
        <div className="pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted block mb-2">
            Next Up
          </span>

          {queue.length <= 1 ? (
            <div className="text-center py-10 text-foreground-muted text-xs">
              <p>Queue is empty.</p>
              <p className="text-foreground-subtle mt-1">
                Add tracks from Home or Search to line up what plays next.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {queue.map((track, idx) => {
                const isCurrent = idx === queueIndex;
                if (isCurrent) return null; // Already rendered in Now Playing section
                return (
                  <div
                    key={`${track.id}-${idx}`}
                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-surface-hover transition-colors text-xs"
                  >
                    <div
                      className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                      onClick={() => playTrack(track, queue)}
                    >
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h5 className="font-semibold text-foreground truncate group-hover:text-accent">
                          {track.title}
                        </h5>
                        <p className="text-[11px] text-foreground-muted truncate">
                          {track.artist}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[11px] font-mono text-foreground-muted">
                        {formatTime(track.duration)}
                      </span>
                      <button
                        type="button"
                        aria-label={`Play ${track.title}`}
                        onClick={() => playTrack(track, queue)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surface-active text-foreground-muted hover:text-foreground"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Remove ${track.title} from queue`}
                        onClick={() => removeFromQueue(idx)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/20 text-foreground-muted hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
