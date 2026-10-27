import React, { useState, useEffect } from 'react';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Sidebar, NavRoute } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { AmbientAura } from './AmbientAura';
import { PersistentPlayer } from '../player/PersistentPlayer';
import { NowPlayingModal } from '../player/NowPlayingModal';
import { QueueDrawer } from '../player/QueueDrawer';
import { CreatePlaylistModal } from '../modals/CreatePlaylistModal';
import { TrackDetailModal } from '../modals/TrackDetailModal';

import { HomeView } from '../../views/HomeView';
import { MehfilView } from '../../views/MehfilView';
import { SearchView } from '../../views/SearchView';
import { MoodDiscoveryView } from '../../views/MoodDiscoveryView';
import { LibraryView } from '../../views/LibraryView';
import { PlaylistDetailView } from '../../views/PlaylistDetailView';
import { ArtistDetailView } from '../../views/ArtistDetailView';
import { SettingsView } from '../../views/SettingsView';

import { Playlist, Artist, Track, MoodOption } from '../../types/music';
import { useLibrary } from '../../context/LibraryContext';
import { PLAYLISTS } from '../../data/catalog';

export const AppShell: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<NavRoute>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [selectedTrackForDetail, setSelectedTrackForDetail] = useState<Track | null>(null);

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<MoodOption | undefined>(undefined);

  const { allPlaylists } = useLibrary();

  // Native Android hardware back button & status bar integration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
        StatusBar.setBackgroundColor({ color: '#0c0a09' }).catch(() => {});
      } catch {}

      const listenerPromise = CapApp.addListener('backButton', () => {
        if (selectedTrackForDetail) {
          setSelectedTrackForDetail(null);
          return;
        }
        if (isCreatePlaylistOpen) {
          setIsCreatePlaylistOpen(false);
          return;
        }
        if (currentRoute !== 'home') {
          setCurrentRoute('home');
          return;
        }
        CapApp.exitApp();
      });

      return () => {
        listenerPromise.then((h) => h.remove()).catch(() => {});
      };
    }
  }, [currentRoute, selectedTrackForDetail, isCreatePlaylistOpen]);

  const handleNavigate = (route: NavRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPlaylistById = (playlistId: string) => {
    const pl = allPlaylists.find((p) => p.id === playlistId) || PLAYLISTS[0];
    setSelectedPlaylist(pl);
    setCurrentRoute('playlist-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setCurrentRoute('playlist-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setCurrentRoute('artist-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToMoods = (mood?: MoodOption) => {
    setSelectedMoodFilter(mood);
    setCurrentRoute('moods');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative flex h-screen overflow-hidden bg-background text-foreground antialiased selection:bg-accent/30 selection:text-accent">
      {/* Dynamic Fluid Ambient Lighting Aura */}
      <AmbientAura />

      {/* Desktop Collapsible Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
        onSelectPlaylist={handleSelectPlaylistById}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navigation Bar */}
        <TopBar
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (currentRoute !== 'search') setCurrentRoute('search');
          }}
        />

        {/* Scrollable Page Body */}
        <main
          role="main"
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-36 md:pb-28"
        >
          <div className="max-w-7xl mx-auto">
            {currentRoute === 'home' && (
              <HomeView
                onNavigateToSearch={() => handleNavigate('search')}
                onNavigateToMehfil={() => handleNavigate('mehfil')}
                onNavigateToMoods={handleNavigateToMoods}
                onSelectPlaylist={handleSelectPlaylist}
                onSelectArtist={handleSelectArtist}
                onSelectTrack={setSelectedTrackForDetail}
              />
            )}

            {currentRoute === 'mehfil' && (
              <MehfilView onSelectTrack={setSelectedTrackForDetail} />
            )}

            {currentRoute === 'search' && (
              <SearchView
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSelectPlaylist={handleSelectPlaylist}
                onSelectArtist={handleSelectArtist}
                onSelectTrack={setSelectedTrackForDetail}
              />
            )}

            {currentRoute === 'moods' && (
              <MoodDiscoveryView
                initialMood={selectedMoodFilter}
                onSelectPlaylist={handleSelectPlaylist}
                onSelectTrack={setSelectedTrackForDetail}
              />
            )}

            {(currentRoute === 'library' || currentRoute === 'liked') && (
              <LibraryView
                onSelectPlaylist={handleSelectPlaylist}
                onSelectTrack={setSelectedTrackForDetail}
                onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
              />
            )}

            {currentRoute === 'playlist-detail' && selectedPlaylist && (
              <PlaylistDetailView
                playlist={selectedPlaylist}
                onBack={() => handleNavigate('home')}
                onSelectTrack={setSelectedTrackForDetail}
              />
            )}

            {currentRoute === 'artist-detail' && selectedArtist && (
              <ArtistDetailView
                artist={selectedArtist}
                onBack={() => handleNavigate('home')}
                onSelectTrack={setSelectedTrackForDetail}
              />
            )}

            {currentRoute === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (< 768px) */}
      <MobileNav currentRoute={currentRoute} onNavigate={handleNavigate} />

      {/* Persistent Audio Player (Always mounted at bottom) */}
      <PersistentPlayer />

      {/* Immersive Now Playing Modal */}
      <NowPlayingModal />

      {/* Slide-out Queue Drawer */}
      <QueueDrawer />

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        onPlaylistCreated={(newPl) => {
          setSelectedPlaylist(newPl);
          setCurrentRoute('playlist-detail');
        }}
      />

      {/* Track Details Modal */}
      <TrackDetailModal
        track={selectedTrackForDetail}
        onClose={() => setSelectedTrackForDetail(null)}
      />
    </div>
  );
};
