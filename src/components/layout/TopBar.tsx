import React from 'react';
import { Search, Sun, Moon, Sparkles, Mic, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAudio } from '../../context/AudioContext';
import { NavRoute } from './Sidebar';

interface TopBarProps {
  onNavigate: (route: NavRoute) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenVoice?: () => void;
  onOpenMobileSidebar?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenVoice,
  onOpenMobileSidebar,
}) => {
  const { preferences, toggleTheme } = useTheme();
  const { currentTrack, isPlaying, setIsExpandedNowPlaying } = useAudio();

  const handleSearchFocus = () => {
    onNavigate('search');
  };

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    toggleTheme(e);
  };

  return (
    <header className="sticky top-3.5 z-20 px-3 sm:px-6 mb-2 pointer-events-none select-none">
      <div className="pointer-events-auto flex items-center justify-between gap-2.5 sm:gap-3 px-3 sm:px-6 py-2.5 rounded-full bg-surface/90 backdrop-blur-2xl border border-border shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.5)] ring-1 ring-border/40 transition-all">
        {/* Mobile Hamburger Menu Toggle */}
        {onOpenMobileSidebar && (
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={onOpenMobileSidebar}
            className="md:hidden p-1.5 -ml-1 rounded-full text-foreground-muted hover:text-foreground hover:bg-surface-hover active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5 text-accent" />
          </button>
        )}

        {/* Search Box */}
        <div className="relative flex-1 max-w-xs sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={handleSearchFocus}
            placeholder="Search songs, artists, genres, or lyrics..."
            aria-label="Search catalog"
            className="w-full pl-10 pr-4 py-1.5 rounded-full bg-foreground/5 text-foreground placeholder:text-foreground-muted/70 text-xs sm:text-sm border border-border/80 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all font-medium"
          />
        </div>

        {/* Voice Assistant Mic Button */}
        {onOpenVoice && (
          <button
            type="button"
            onClick={onOpenVoice}
            title="Ask Voice Assistant"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/15 hover:bg-accent/25 border border-accent/30 text-accent text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm group shrink-0"
          >
            <Mic className="w-3.5 h-3.5 text-accent group-hover:animate-pulse" />
            <span className="hidden sm:inline font-bold">Voice AI</span>
          </button>
        )}

        {/* Center: Live Sound Aura Pill (Desktop only) */}
        {currentTrack && (
          <button
            type="button"
            onClick={() => setIsExpandedNowPlaying(true)}
            className="hidden lg:flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-subtle hover:bg-surface-hover border border-border text-xs font-semibold text-foreground transition-all cursor-pointer group"
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
            <span className="truncate max-w-[150px] group-hover:text-accent transition-colors font-bold">
              {currentTrack.title}
            </span>
          </button>
        )}

        {/* Right Controls: Theme Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label={`Switch to ${preferences.theme === 'dark' ? 'light' : 'dark'} mode`}
            onClick={handleThemeToggle}
            className="group relative w-8 h-8 rounded-full bg-surface-subtle hover:bg-surface-hover border border-border shadow-sm hover:shadow-md flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-105 cursor-pointer overflow-hidden"
          >
            <span className="absolute inset-0 rounded-full bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative transition-transform duration-300 ease-out">
              {preferences.theme === 'dark' ? (
                <Moon className="w-4 h-4 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-transform group-hover:scale-110" />
              ) : (
                <Sun className="w-4 h-4 text-amber-600 transition-transform group-hover:rotate-45 group-hover:scale-110" />
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
