import React from 'react';
import { MoodOption } from '../../types/music';

interface MoodCardProps {
  mood: MoodOption;
  isSelected?: boolean;
  onSelect: (mood: MoodOption) => void;
  className?: string;
}

export const MoodCard: React.FC<MoodCardProps> = ({
  mood,
  isSelected,
  onSelect,
  className = '',
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect(mood);
      }}
      onClick={() => onSelect(mood)}
      className={`group relative overflow-hidden rounded-[1.25rem] p-4 sm:p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl cursor-pointer select-none bg-gradient-to-br ${mood.gradient} border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white shrink-0 ${
        isSelected
          ? 'ring-4 ring-white shadow-2xl scale-[1.03]'
          : 'opacity-95 hover:opacity-100'
      } ${className}`}
    >
      {/* Background ambient lighting orb */}
      <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/15 blur-xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-28 sm:h-32">
        <div className="flex items-start justify-between">
          <span className="text-3xl sm:text-4xl filter drop-shadow transition-transform duration-300 group-hover:scale-110">
            {mood.emoji}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/90 bg-black/35 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/10">
            Mood
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight drop-shadow-sm">
              {mood.label}
            </h3>
            {mood.labelDevanagari && (
              <span className="text-[11px] font-hindi text-white/80 font-medium">
                {mood.labelDevanagari}
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-white/90 line-clamp-1 mt-0.5">
            {mood.tagline}
          </p>
        </div>
      </div>
    </div>
  );
};
