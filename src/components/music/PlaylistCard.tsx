import React from 'react';
import { Playlist, Track } from '../../types/music';
import { useAudio } from '../../context/AudioContext';
import { TRACKS } from '../../data/catalog';
import { Play, Music2 } from 'lucide-react';

interface PlaylistCardProps {
  playlist: Playlist;
  onSelect: (playlist: Playlist) => void;
  className?: string;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onSelect, className = '' }) => {
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
      className={`group relative flex flex-col p-2 sm:p-2.5 rounded-[1.25rem] bg-surface/40 hover:bg-surface-hover/80 border border-border hover:border-accent/40 shadow-sm hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer select-none shrink-0 w-48 sm:w-52 lg:w-56 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-inner bg-surface-subtle">
        <img
          src={playlist.coverUrl}
          alt={playlist.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
          loading="lazy"
        />

        {/* Ambient bottom shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Track count pill */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-black/60 text-white backdrop-blur-md border border-white/10 shadow-sm flex items-center gap-1">
            <Music2 className="w-2.5 h-2.5 text-accent" />
            <span>{playlist.trackIds.length} Songs</span>
          </span>
        </div>

        {/* Quick Play Button */}
        {playlistTracks.length > 0 && (
          <button
            type="button"
            aria-label={`Play ${playlist.title}`}
            onClick={handleQuickPlay}
            className="absolute bottom-2.5 right-2.5 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-xl opacity-90 sm:opacity-0 translate-y-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
        )}
      </div>

      <div className="mt-2.5 px-0.5">
        <h4 className="font-bold text-sm text-foreground truncate group-hover:text-accent transition-colors">
          {playlist.title}
        </h4>

        <p className="text-xs text-foreground-muted line-clamp-1 mt-0.5 font-medium">
          {playlist.description}
        </p>

        <div className="flex items-center gap-1.5 text-[10px] text-foreground-subtle mt-1.5 pt-1 border-t border-border/60">
          <span className="truncate">{playlist.curator}</span>
        </div>
      </div>
    </div>
  );
};
