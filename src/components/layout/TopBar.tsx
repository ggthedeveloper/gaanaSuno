import React from 'react';
import { Search, Sun, Moon, Globe, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { NavRoute } from './Sidebar';

interface TopBarProps {
  onNavigate: (route: NavRoute) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onNavigate,
  searchQuery,
  onSearchChange,
}) => {
  const { preferences, toggleTheme, setPreferredLanguage } = useTheme();
  const { currentTrack, isPlaying, setIsExpandedNowPlaying } = useAudio();

  const handleSearchFocus = () => {
    onNavigate('search');
  };

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleTheme(e);
  };

  return (
    <header className="sticky top-3.5 z-20 px-3 sm:px-6 mb-2 pointer-events-none select-none">
      <div className="pointer-events-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 rounded-full bg-surface/85 backdrop-blur-2xl border border-border shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.5)] ring-1 ring-border/40 transition-all">
        {/* Left: Search Box */}
        <div className="relative flex-1 max-w-xs sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={handleSearchFocus}
            placeholder="Search Bollywood, Ghazals, Arijit, Sufi, Lo-Fi..."
            aria-label="Search catalog"
            className="w-full pl-10 pr-4 py-1.5 rounded-full bg-foreground/5 text-foreground placeholder:text-foreground-muted/60 text-xs sm:text-sm border border-border/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
          />
        </div>

        {/* Center: Live Sound Aura Pill (Desktop only) */}
        {currentTrack && (
          <button
            type="button"
            onClick={() => setIsExpandedNowPlaying(true)}
            className="hidden lg:flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-accent/30 text-xs font-semibold text-foreground transition-all cursor-pointer group"
          >
            {isPlaying ? (
              <span className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 bg-accent rounded-full animate-bounce h-3" />
                <span className="w-0.5 bg-accent rounded-full animate-bounce h-1.5 delay-100" />
                <span className="w-0.5 bg-accent rounded-full animate-bounce h-2.5 delay-200" />
              </span>
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-accent" />
            )}
            <span className="truncate max-w-[150px] group-hover:text-accent transition-colors">
              {currentTrack.title}
            </span>
          </button>
        )}

        {/* Right Controls: Language Filter & Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-foreground-muted">
            <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
            <select
              value={preferences.preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as any)}
              aria-label="Filter language"
              className="bg-transparent text-foreground text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-surface text-foreground">All Languages</option>
              <option value="Hindi" className="bg-surface text-foreground">हिंदी (Hindi)</option>
              <option value="Punjabi" className="bg-surface text-foreground">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="Awadhi" className="bg-surface text-foreground">अवधी (Awadhi)</option>
              <option value="Urdu" className="bg-surface text-foreground">اردو (Urdu)</option>
            </select>
          </div>

          {/* Interactive Theme Toggle Button */}
          <button
            type="button"
            aria-label={`Switch to ${preferences.theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={handleThemeToggle}
            className="group relative w-8 h-8 rounded-full bg-surface-subtle hover:bg-surface-hover border border-border shadow-sm hover:shadow-md flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-105 cursor-pointer overflow-hidden"
          >
            {/* Ambient inner glow */}
            <span className="absolute inset-0 rounded-full bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative transition-transform duration-300 ease-out">
              {preferences.theme === 'dark' ? (
                <Moon className="w-4 h-4 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-transform group-hover:scale-110" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] transition-transform group-hover:rotate-45" />
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
