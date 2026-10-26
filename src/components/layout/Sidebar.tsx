import React from 'react';
import {
  Home,
  Compass,
  Sparkles,
  Library,
  Heart,
  PlusCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Music,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export type NavRoute =
  | 'home'
  | 'search'
  | 'moods'
  | 'library'
  | 'liked'
  | 'settings'
  | 'playlist-detail'
  | 'artist-detail'
  | 'track-detail';

interface SidebarProps {
  currentRoute: NavRoute;
  onNavigate: (route: NavRoute) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenCreatePlaylist: () => void;
  onSelectPlaylist: (playlistId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  onOpenCreatePlaylist,
  onSelectPlaylist,
}) => {
  const { likedTrackIds, customPlaylists } = useLibrary();

  const navItems = [
    { id: 'home' as NavRoute, label: 'Home', icon: Home },
    { id: 'search' as NavRoute, label: 'Search & Explore', icon: Compass },
    { id: 'moods' as NavRoute, label: 'Mood Discovery', icon: Sparkles },
    { id: 'library' as NavRoute, label: 'Your Library', icon: Library },
    {
      id: 'liked' as NavRoute,
      label: 'Liked Songs',
      icon: Heart,
      badge: likedTrackIds.length,
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0 bg-surface/40 backdrop-blur-2xl border-r border-border/60 transition-all duration-300 z-30 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding & Main Navigation */}
      <div className="flex flex-col flex-1 overflow-hidden p-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div
            role="button"
            tabIndex={0}
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Music className="w-5 h-5 text-white" />
            </div>

            {!isCollapsed && (
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-foreground flex items-center gap-1.5">
                  GaanaSuno
                  <span className="text-[10px] font-bold text-accent uppercase tracking-wider bg-accent/15 px-1.5 py-0.5 rounded">
                    Hindi
                  </span>
                </h1>
                <p className="text-[11px] text-foreground-muted">
                  Hindi & Indian Music
                </p>
              </div>
            )}
          </div>

          {/* Collapse Toggle Button */}
          <button
            type="button"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-active transition-colors hidden lg:flex"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-accent text-accent-foreground shadow-md shadow-accent/20 font-bold'
                    : 'text-foreground-muted hover:text-foreground hover:bg-surface-hover'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-accent-foreground' : ''}`} />
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0 text-left">
                    <span className="truncate">{item.label}</span>
                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-accent-foreground/20 text-accent-foreground'
                            : 'bg-surface-active text-foreground-muted'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Playlists Section */}
        {!isCollapsed && (
          <div className="mt-8 flex-1 flex flex-col min-h-0 border-t border-border/50 pt-4">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                Your Playlists
              </span>
              <button
                type="button"
                aria-label="Create new playlist"
                onClick={onOpenCreatePlaylist}
                className="p-1 rounded text-foreground-muted hover:text-accent hover:bg-surface-active transition-colors"
                title="Create Playlist"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 text-xs">
              {customPlaylists.length === 0 ? (
                <p className="px-3 py-2 text-foreground-muted text-[11px]">
                  No custom playlists yet. Click + to create one!
                </p>
              ) : (
                customPlaylists.map((pl) => (
                  <button
                    key={pl.id}
                    type="button"
                    onClick={() => onSelectPlaylist(pl.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-hover truncate transition-colors"
                  >
                    {pl.title}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Settings Link */}
      <div className="p-4 border-t border-border/50">
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            currentRoute === 'settings'
              ? 'bg-accent text-accent-foreground font-bold'
              : 'text-foreground-muted hover:text-foreground hover:bg-surface-hover'
          } ${isCollapsed ? 'justify-center px-0' : ''}`}
          title="Settings & Themes"
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Settings & Style</span>}
        </button>
      </div>
    </aside>
  );
};
