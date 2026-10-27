import React from 'react';
import { Playlist, Track } from '../types/music';
import { TRACKS } from '../data/catalog';
import { TrackRow } from '../components/music/TrackRow';
import { useAudio } from '../context/AudioContext';
import { useLibrary } from '../context/LibraryContext';
import { formatDurationLong } from '../utils/formatters';
import { Play, Shuffle, ArrowLeft, Clock, Music2, Trash2 } from 'lucide-react';

interface PlaylistDetailViewProps {
  playlist: Playlist;
  onBack: () => void;
  onSelectTrack: (track: Track) => void;
}

export const PlaylistDetailView: React.FC<PlaylistDetailViewProps> = ({
  playlist,
  onBack,
  onSelectTrack,
}) => {
  const { playTrack } = useAudio();
  const { removeTrackFromPlaylist } = useLibrary();

  const playlistTracks = playlist.trackIds
    .map((id) => TRACKS.find((t) => t.id === id))
    .filter((t): t is Track => Boolean(t));

  const totalDurationSeconds = playlistTracks.reduce((acc, t) => acc + t.duration, 0);

  const handlePlayAll = () => {
    if (playlistTracks.length > 0) {
      playTrack(playlistTracks[0], playlistTracks);
    }
  };

  const handleShuffle = () => {
    if (playlistTracks.length > 0) {
      const shuffled = [...playlistTracks].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0], shuffled);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Back Button */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground-muted hover:text-foreground transition-colors py-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Playlist Hero Banner */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-6 sm:p-8 rounded-3xl bg-surface/70 border border-border/60 shadow-xl">
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-2xl shrink-0 border border-border/50">
          <img
            src={playlist.coverUrl}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent/15 px-2.5 py-1 rounded-full">
            {playlist.isCustom ? 'Custom Playlist' : 'GaanaSuno Playlist'}
          </span>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight mt-3">
            {playlist.title}
          </h2>

          <p className="text-xs sm:text-sm text-foreground-muted mt-2 max-w-xl leading-relaxed">
            {playlist.description}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-foreground-subtle mt-4">
            <span className="font-semibold text-foreground">{playlist.curator}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Music2 className="w-3.5 h-3.5" />
              {playlistTracks.length} tracks
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDurationLong(totalDurationSeconds)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center md:justify-start gap-3 mt-6">
            <button
              type="button"
              disabled={playlistTracks.length === 0}
              onClick={handlePlayAll}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent text-accent-foreground font-bold text-sm shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <span>Play All</span>
            </button>

            <button
              type="button"
              disabled={playlistTracks.length === 0}
              onClick={handleShuffle}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface-hover hover:bg-surface-active border border-border text-foreground font-semibold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tracklist Table */}
      {playlistTracks.length === 0 ? (
        <div className="text-center py-16 bg-surface/40 rounded-2xl border border-border/50 p-6">
          <Music2 className="w-12 h-12 text-foreground-muted/40 mx-auto mb-2" />
          <h4 className="font-bold text-base text-foreground">
            This playlist has no tracks yet
          </h4>
          <p className="text-xs text-foreground-muted mt-1 max-w-sm mx-auto">
            Browse Home or Search, click the three dots on any Hindi song, and select "Add to Playlist".
          </p>
        </div>
      ) : (
        <div className="bg-surface/60 rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden">
          {playlistTracks.map((track, idx) => (
            <div key={`${track.id}-${idx}`} className="relative group">
              <TrackRow
                track={track}
                index={idx}
                queueContext={playlistTracks}
                onOpenDetail={onSelectTrack}
              />
              {playlist.isCustom && (
                <button
                  type="button"
                  aria-label={`Remove ${track.title} from playlist`}
                  onClick={() => removeTrackFromPlaylist(playlist.id, track.id)}
                  className="absolute right-14 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-foreground-muted hover:text-rose-500 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1"
                  title="Remove from playlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
