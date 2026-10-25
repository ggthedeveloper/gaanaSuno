import React from 'react';
import { MoodOption } from '../../types/music';

interface MoodCardProps {
  mood: MoodOption;
  isSelected?: boolean;
  onSelect: (mood: MoodOption) => void;
}

export const MoodCard: React.FC<MoodCardProps> = ({ mood, isSelected, onSelect }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect(mood);
      }}
      onClick={() => onSelect(mood)}
      className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer select-none bg-gradient-to-br ${mood.gradient} ${
        isSelected
          ? 'ring-4 ring-white shadow-2xl scale-[1.02]'
          : 'opacity-95 hover:opacity-100'
      }`}
    >
      {/* Background disc blur */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between h-28 sm:h-32">
        <div className="flex items-start justify-between">
          <span className="text-3xl sm:text-4xl filter drop-shadow">
            {mood.emoji}
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/80 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-md">
            Mood
          </span>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight drop-shadow-sm">
            {mood.label}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-white/90 truncate mt-0.5">
            {mood.tagline}
          </p>
        </div>
      </div>
    </div>
  );
};
