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
  Flame,
  X,
} from 'lucide-react';
import { useLibrary } from '../../context/LibraryContext';

export type NavRoute =
  | 'home'
  | 'mehfil'
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
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  onOpenCreatePlaylist,
  onSelectPlaylist,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const { likedTrackIds, customPlaylists } = useLibrary();

  const navItems = [
    { id: 'home' as NavRoute, label: 'Home', icon: Home },
    { id: 'mehfil' as NavRoute, label: 'Lounge', icon: Flame, badge: 'NEW' },
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

  const handleMobileNav = (route: NavRoute) => {
    onNavigate(route);
    onCloseMobile?.();
  };

  const handleMobileSelectPlaylist = (id: string) => {
    onSelectPlaylist(id);
    onCloseMobile?.();
  };

  const sidebarContent = (isMobileDrawer: boolean) => (
    <>
      {/* Top Branding & Main Navigation */}
      <div className="flex flex-col flex-1 overflow-hidden p-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div
            role="button"
            tabIndex={0}
            onClick={() => (isMobileDrawer ? handleMobileNav('home') : onNavigate('home'))}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Music className="w-5 h-5 text-white" />
            </div>

            {(!isCollapsed || isMobileDrawer) && (
              <div>
                <h1 className="font-extrabold text-base tracking-tight text-foreground flex items-center gap-1.5">
                  GaanaSuno
                </h1>
                <p className="text-[11px] text-foreground-muted font-medium">
                  Music Sanctuary
                </p>
              </div>
            )}
          </div>

          {/* Close button for mobile or collapse for desktop */}
          {isMobileDrawer ? (
            <button
              type="button"
              aria-label="Close menu"
              onClick={onCloseMobile}
              className="p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-surface-active transition-colors hidden lg:flex"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
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
                onClick={() => (isMobileDrawer ? handleMobileNav(item.id) : onNavigate(item.id))}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-accent text-accent-foreground shadow-md shadow-accent/20 font-bold'
                    : 'text-foreground-muted hover:text-foreground hover:bg-surface-hover'
                } ${isCollapsed && !isMobileDrawer ? 'justify-center px-0' : ''}`}
                title={item.label}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-accent-foreground' : ''}`} />
                {(!isCollapsed || isMobileDrawer) && (
                  <div className="flex items-center justify-between flex-1 min-w-0 text-left">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-accent-foreground/20 text-accent-foreground'
                            : item.badge === 'NEW'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
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
        {(!isCollapsed || isMobileDrawer) && (
          <div className="mt-8 flex-1 flex flex-col min-h-0 border-t border-border/50 pt-4">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-foreground-muted">
                Your Playlists
              </span>
              <button
                type="button"
                aria-label="Create new playlist"
                onClick={() => {
                  onOpenCreatePlaylist();
                  if (isMobileDrawer) onCloseMobile?.();
                }}
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
                    onClick={() =>
                      isMobileDrawer
                        ? handleMobileSelectPlaylist(pl.id)
                        : onSelectPlaylist(pl.id)
                    }
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
      <div className="p-4 border-t border-border/50" style={{ paddingBottom: isMobileDrawer ? 'calc(1rem + env(safe-area-inset-bottom, 0px))' : undefined }}>
        <button
          type="button"
          onClick={() => (isMobileDrawer ? handleMobileNav('settings') : onNavigate('settings'))}
          className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            currentRoute === 'settings'
              ? 'bg-accent text-accent-foreground font-bold'
              : 'text-foreground-muted hover:text-foreground hover:bg-surface-hover'
          } ${isCollapsed && !isMobileDrawer ? 'justify-center px-0' : ''}`}
          title="Settings & Themes"
        >
          <Settings className="w-5 h-5 shrink-0" />
          {(!isCollapsed || isMobileDrawer) && <span>Settings & Style</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside
        className={`hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0 bg-surface/40 backdrop-blur-2xl border-r border-border/60 transition-all duration-300 z-30 select-none ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile Slide-Over Drawer (< 768px) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden select-none">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Slide-in Drawer */}
          <aside
            className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-surface border-r border-border shadow-2xl flex flex-col justify-between"
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
          >
            {sidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};
