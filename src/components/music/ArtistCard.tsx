import React from 'react';
import { Artist } from '../../types/music';

interface ArtistCardProps {
  artist: Artist;
  onSelect: (artist: Artist) => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onSelect }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect(artist);
      }}
      onClick={() => onSelect(artist)}
      className="group flex flex-col items-center p-3.5 rounded-2xl bg-surface/40 hover:bg-surface-hover/80 border border-border/30 hover:border-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer select-none text-center"
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-lg border-2 border-border/50 group-hover:border-accent transition-colors duration-300">
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="mt-3.5 w-full">
        <h4 className="font-bold text-sm text-foreground truncate group-hover:text-accent transition-colors">
          {artist.name}
        </h4>
        <p className="text-xs text-foreground-muted font-normal truncate mt-0.5">
          {artist.nameDevanagari}
        </p>
        <span className="inline-block mt-1 text-[11px] font-medium text-foreground-subtle">
          {artist.monthlyListeners} listeners
        </span>
      </div>
    </div>
  );
};
