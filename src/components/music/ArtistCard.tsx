import React from 'react';
import { Artist } from '../../types/music';
import { CheckCircle2 } from 'lucide-react';

interface ArtistCardProps {
  artist: Artist;
  onSelect: (artist: Artist) => void;
  className?: string;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onSelect, className = '' }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect(artist);
      }}
      onClick={() => onSelect(artist)}
      className={`group flex flex-col items-center p-3 sm:p-3.5 rounded-[1.25rem] bg-surface/40 hover:bg-surface-hover/80 border border-white/[0.07] hover:border-accent/40 shadow-sm hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer select-none text-center shrink-0 w-40 sm:w-44 lg:w-48 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
    >
      {/* Outer circular shell */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-surface-subtle border border-white/10 group-hover:border-accent group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-500 shadow-xl">
        <div className="w-full h-full rounded-full overflow-hidden">
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </div>

      <div className="mt-3 w-full px-1">
        <div className="flex items-center justify-center gap-1">
          <h4 className="font-extrabold text-sm text-foreground truncate group-hover:text-accent transition-colors">
            {artist.name}
          </h4>
          <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
        </div>

        {artist.nameDevanagari && (
          <p className="text-[11px] text-foreground-subtle font-hindi truncate mt-0.5">
            {artist.nameDevanagari}
          </p>
        )}

        <p className="text-xs text-foreground-muted font-medium truncate mt-0.5">
          {artist.role}
        </p>

        <span className="inline-block mt-1.5 text-[10px] font-semibold text-foreground-subtle bg-white/5 px-2 py-0.5 rounded-full border border-white/[0.04]">
          {artist.monthlyListeners} monthly
        </span>
      </div>
    </div>
  );
};
