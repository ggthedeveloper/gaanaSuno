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
      className="group relative flex flex-col p-3 rounded-2xl bg-surface/50 hover:bg-surface-hover/90 border border-white/5 hover:border-white/15 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer select-none"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-md bg-surface-subtle">
        <img
          src={playlist.coverUrl}
          alt={playlist.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick Play Button */}
        {playlistTracks.length > 0 && (
          <button
            type="button"
            aria-label={`Play ${playlist.title}`}
            onClick={handleQuickPlay}
            className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-2xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        )}
      </div>

      <div className="mt-3">
        <h4 className="font-bold text-sm text-foreground truncate group-hover:text-accent transition-colors">
          {playlist.title}
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-foreground-muted mt-1 font-medium">
          <Music2 className="w-3.5 h-3.5 text-accent" />
          <span>{playlist.trackIds.length} tracks</span>
          <span>•</span>
          <span className="truncate">{playlist.curator}</span>
        </div>
      </div>
    </div>
  );
};
