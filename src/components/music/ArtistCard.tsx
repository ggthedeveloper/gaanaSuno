import React from 'react';
import { Artist } from '../../types/music';
import { CheckCircle2 } from 'lucide-react';

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
      className="group flex flex-col items-center p-4 rounded-3xl bg-surface/40 hover:bg-surface-hover/80 border border-white/5 hover:border-white/15 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer select-none text-center"
    >
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-xl border-2 border-white/10 group-hover:border-accent group-hover:shadow-[0_0_30px_rgba(245,158,11,0.25)] transition-all duration-500">
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="mt-3.5 w-full">
        <div className="flex items-center justify-center gap-1">
          <h4 className="font-extrabold text-sm text-foreground truncate group-hover:text-accent transition-colors">
            {artist.name}
          </h4>
          <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
        </div>
        <p className="text-xs text-foreground-muted font-medium truncate mt-0.5">
          {artist.role}
        </p>
        <span className="inline-block mt-1 text-[11px] font-semibold text-foreground-subtle bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
          {artist.monthlyListeners} monthly
        </span>
      </div>
    </div>
  );
};
