import React from 'react';
import { Search, Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
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
  const { preferences, setTheme, setPreferredLanguage } = useTheme();

  const handleSearchFocus = () => {
    onNavigate('search');
  };

  const toggleTheme = () => {
    setTheme(preferences.theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-background/80 backdrop-blur-xl border-b border-border select-none">
      {/* Search Input Box */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={handleSearchFocus}
          placeholder="Search Bollywood, Ghazals, Arijit, Sufi, Lo-Fi..."
          aria-label="Search catalog"
          className="w-full pl-10 pr-4 py-2 rounded-full bg-surface text-foreground placeholder:text-foreground-muted/60 text-xs sm:text-sm border border-border/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
        />
      </div>

      {/* Right Controls: Language Filter & Theme Toggle */}
      <div className="flex items-center gap-2 sm:gap-3 ml-3">
        {/* Language Filter Dropdown */}
        <div className="flex items-center gap-1 bg-surface border border-border/60 rounded-full px-2.5 py-1 text-xs text-foreground-muted">
          <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
          <select
            value={preferences.preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value as any)}
            aria-label="Filter language"
            className="bg-transparent text-foreground text-xs font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Languages</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="Urdu">اردو (Urdu)</option>
            <option value="Punjabi">ਪੰਜਾਬੀ (Punjabi)</option>
          </select>
        </div>

        {/* Theme Toggle Button */}
        <button
          type="button"
          aria-label={`Switch to ${preferences.theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={toggleTheme}
          className="p-2 rounded-full bg-surface border border-border/60 text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
        >
          {preferences.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
        </button>
      </div>
    </header>
  );
};
