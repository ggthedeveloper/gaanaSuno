import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Playlist, Track } from '../types/music';
import { storage } from '../services/storage';
import { PLAYLISTS, TRACKS, generateCoverArt } from '../data/catalog';

interface LibraryContextType {
  likedTrackIds: string[];
  likedTracks: Track[];
  isLiked: (trackId: string) => boolean;
  toggleLike: (trackId: string) => void;
  customPlaylists: Playlist[];
  allPlaylists: Playlist[];
  createPlaylist: (title: string, description?: string) => Playlist;
  renamePlaylist: (id: string, newTitle: string) => void;
  deletePlaylist: (id: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  recentlyPlayedTracks: Track[];
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>(() => storage.getLikedTracks());
  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>(() => storage.getCustomPlaylists());
  const [recentlyPlayedIds, setRecentlyPlayedIds] = useState<string[]>(() => storage.getRecentlyPlayed());

  // Listen to storage sync or periodic update
  useEffect(() => {
    const handleStorageUpdate = () => {
      setRecentlyPlayedIds(storage.getRecentlyPlayed());
    };
    const interval = setInterval(handleStorageUpdate, 2000);
    return () => clearInterval(interval);
  }, []);

  const isLiked = useCallback(
    (trackId: string) => likedTrackIds.includes(trackId),
    [likedTrackIds]
  );

  const toggleLike = useCallback((trackId: string) => {
    const next = storage.toggleLike(trackId);
    setLikedTrackIds(next);
  }, []);

  const createPlaylist = useCallback((title: string, description = 'My personalized Hindi music mix'): Playlist => {
    const newPlaylist: Playlist = {
      id: `custom-pl-${Date.now()}`,
      title,
      description,
      coverUrl: generateCoverArt(title, 'Custom Mix', ['#4338ca', '#312e81'], '#a5b4fc'),
      trackIds: [],
      isCustom: true,
      createdDate: new Date().toLocaleDateString('hi-IN'),
      curator: 'You',
    };

    setCustomPlaylists((prev) => {
      const updated = [newPlaylist, ...prev];
      storage.saveCustomPlaylists(updated);
      return updated;
    });

    return newPlaylist;
  }, []);

  const renamePlaylist = useCallback((id: string, newTitle: string) => {
    setCustomPlaylists((prev) => {
      const updated = prev.map((pl) => (pl.id === id ? { ...pl, title: newTitle } : pl));
      storage.saveCustomPlaylists(updated);
      return updated;
    });
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setCustomPlaylists((prev) => {
      const updated = prev.filter((pl) => pl.id !== id);
      storage.saveCustomPlaylists(updated);
      return updated;
    });
  }, []);

  const addTrackToPlaylist = useCallback((playlistId: string, trackId: string) => {
    setCustomPlaylists((prev) => {
      const updated = prev.map((pl) => {
        if (pl.id === playlistId && !pl.trackIds.includes(trackId)) {
          return { ...pl, trackIds: [...pl.trackIds, trackId] };
        }
        return pl;
      });
      storage.saveCustomPlaylists(updated);
      return updated;
    });
  }, []);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setCustomPlaylists((prev) => {
      const updated = prev.map((pl) => {
        if (pl.id === playlistId) {
          return { ...pl, trackIds: pl.trackIds.filter((id) => id !== trackId) };
        }
        return pl;
      });
      storage.saveCustomPlaylists(updated);
      return updated;
    });
  }, []);

  const likedTracks = useMemo(() => {
    return likedTrackIds
      .map((id) => TRACKS.find((t) => t.id === id))
      .filter((t): t is Track => Boolean(t));
  }, [likedTrackIds]);

  const recentlyPlayedTracks = useMemo(() => {
    return recentlyPlayedIds
      .map((id) => TRACKS.find((t) => t.id === id))
      .filter((t): t is Track => Boolean(t));
  }, [recentlyPlayedIds]);

  const allPlaylists = useMemo(() => {
    return [...customPlaylists, ...PLAYLISTS];
  }, [customPlaylists]);

  const value = useMemo(
    () => ({
      likedTrackIds,
      likedTracks,
      isLiked,
      toggleLike,
      customPlaylists,
      allPlaylists,
      createPlaylist,
      renamePlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      recentlyPlayedTracks,
    }),
    [
      likedTrackIds,
      likedTracks,
      isLiked,
      toggleLike,
      customPlaylists,
      allPlaylists,
      createPlaylist,
      renamePlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      recentlyPlayedTracks,
    ]
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};
