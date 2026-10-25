import React from 'react';
import { Playlist, Track } from '../../types/music';
import { useAudio } from '../../context/AudioContext';
import { TRACKS } from '../../data/catalog';
import { Play, Music2 } from 'lucide-react';

interface PlaylistCardProps {
  playlist: Playlist;
  onSelect: (playlist: Playlist) => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onSelect }) => {
  const { playTrack } = useAudio();

  const playlistTracks = playlist.trackIds
    .map((id) => TRACKS.find((t) => t.id === id))
    .filter((t): t is Track => Boolean(t));

  const handleQuickPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlistTracks.length > 0) {
      playTrack(playlistTracks[0], playlistTracks);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect(playlist);
      }}
      onClick={() => onSelect(playlist)}
      className="group relative flex flex-col p-3 rounded-2xl bg-surface/60 hover:bg-surface-hover/80 border border-border/40 hover:border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer select-none"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-md bg-surface-subtle">
        <img
          src={playlist.coverUrl}
          alt={playlist.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick Play Button */}
        {playlistTracks.length > 0 && (
          <button
            type="button"
            aria-label={`Play ${playlist.title}`}
            onClick={handleQuickPlay}
            className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        )}
      </div>

      <div className="mt-3">
        <h4 className="font-bold text-sm text-foreground truncate group-hover:text-accent transition-colors">
          {playlist.title}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-foreground-muted mt-1">
          <Music2 className="w-3 h-3 text-foreground-subtle" />
          <span>{playlist.trackIds.length} tracks</span>
          <span>•</span>
          <span className="truncate">{playlist.curator}</span>
        </div>
      </div>
    </div>
  );
};
