import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Track, RepeatMode } from '../types/music';
import { audioEngine } from '../services/audioEngine';
import { TRACKS } from '../data/catalog';
import { storage } from '../services/storage';

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  queue: Track[];
  queueIndex: number;
  isExpandedNowPlaying: boolean;
  isQueueDrawerOpen: boolean;
  setIsExpandedNowPlaying: (open: boolean) => void;
  setIsQueueDrawerOpen: (open: boolean) => void;
  playTrack: (track: Track, newQueue?: Track[]) => Promise<void>;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  getFrequencyData: () => Uint8Array;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with the first track for instant readiness, paused
  const [currentTrack, setCurrentTrack] = useState<Track | null>(() => TRACKS[0]);
  const [queue, setQueue] = useState<Track[]>(() => [...TRACKS]);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(() => TRACKS[0]?.duration || 0);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
  const [isExpandedNowPlaying, setIsExpandedNowPlaying] = useState<boolean>(false);
  const [isQueueDrawerOpen, setIsQueueDrawerOpen] = useState<boolean>(false);

  // Subscribe to audio engine events
  useEffect(() => {
    audioEngine.setVolume(volume);
    audioEngine.setMuted(isMuted);

    const unsubscribe = audioEngine.subscribe({
      onPlay: () => setIsPlaying(true),
      onPause: () => setIsPlaying(false),
      onTimeUpdate: (cur, dur) => {
        setCurrentTime(cur);
        if (dur > 0) setDuration(dur);
      },
      onDurationChange: (dur) => {
        if (dur > 0) setDuration(dur);
      },
      onLoading: (loading) => setIsLoading(loading),
      onEnded: () => {
        handleTrackEnd();
      },
      onError: (msg) => {
        console.warn('Audio playback error:', msg);
        setIsLoading(false);
      },
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleTrackEnd = useCallback(() => {
    if (repeatMode === 'one') {
      audioEngine.seek(0);
      audioEngine.play();
      return;
    }

    if (queue.length === 0) {
      setIsPlaying(false);
      return;
    }

    if (queueIndex < queue.length - 1) {
      const nextIdx = queueIndex + 1;
      setQueueIndex(nextIdx);
      const next = queue[nextIdx];
      setCurrentTrack(next);
      storage.addRecentlyPlayed(next.id);
      audioEngine.loadAndPlay(next.audioUrl);
    } else if (repeatMode === 'all') {
      const nextIdx = 0;
      setQueueIndex(nextIdx);
      const next = queue[nextIdx];
      setCurrentTrack(next);
      storage.addRecentlyPlayed(next.id);
      audioEngine.loadAndPlay(next.audioUrl);
    } else {
      setIsPlaying(false);
      audioEngine.seek(0);
    }
  }, [repeatMode, queue, queueIndex]);

  const playTrack = useCallback(
    async (track: Track, newQueue?: Track[]) => {
      setCurrentTrack(track);
      storage.addRecentlyPlayed(track.id);

      let targetQueue = queue;
      if (newQueue && newQueue.length > 0) {
        targetQueue = isShuffle
          ? [track, ...newQueue.filter((t) => t.id !== track.id).sort(() => Math.random() - 0.5)]
          : newQueue;
        setQueue(targetQueue);
      }

      const foundIdx = targetQueue.findIndex((t) => t.id === track.id);
      setQueueIndex(foundIdx >= 0 ? foundIdx : 0);

      setIsLoading(true);
      await audioEngine.loadAndPlay(track.audioUrl);
      setIsLoading(false);
    },
    [queue, isShuffle]
  );

  const togglePlay = useCallback(() => {
    if (!currentTrack) {
      if (TRACKS.length > 0) {
        playTrack(TRACKS[0]);
      }
      return;
    }

    if (isPlaying) {
      audioEngine.pause();
    } else {
      audioEngine.play();
    }
  }, [isPlaying, currentTrack, playTrack]);

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;

    let nextIdx = queueIndex + 1;
    if (nextIdx >= queue.length) {
      if (repeatMode === 'all') {
        nextIdx = 0;
      } else {
        return;
      }
    }

    setQueueIndex(nextIdx);
    const track = queue[nextIdx];
    setCurrentTrack(track);
    storage.addRecentlyPlayed(track.id);
    audioEngine.loadAndPlay(track.audioUrl);
  }, [queue, queueIndex, repeatMode]);

  const previousTrack = useCallback(() => {
    // If playing more than 3 seconds, rewind to beginning
    if (currentTime > 3) {
      audioEngine.seek(0);
      return;
    }

    if (queue.length === 0) return;

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      if (repeatMode === 'all') {
        prevIdx = queue.length - 1;
      } else {
        prevIdx = 0;
      }
    }

    setQueueIndex(prevIdx);
    const track = queue[prevIdx];
    setCurrentTrack(track);
    storage.addRecentlyPlayed(track.id);
    audioEngine.loadAndPlay(track.audioUrl);
  }, [queue, queueIndex, currentTime, repeatMode]);

  const seek = useCallback((seconds: number) => {
    setCurrentTime(seconds);
    audioEngine.seek(seconds);
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    audioEngine.setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
      audioEngine.setMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      audioEngine.setMuted(next);
      return next;
    });
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const next = !prev;
      if (next && currentTrack) {
        // Shuffle rest of queue
        const remaining = queue.filter((t) => t.id !== currentTrack.id).sort(() => Math.random() - 0.5);
        setQueue([currentTrack, ...remaining]);
        setQueueIndex(0);
      }
      return next;
    });
  }, [queue, currentTrack]);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  const removeFromQueue = useCallback(
    (index: number) => {
      setQueue((prev) => prev.filter((_, i) => i !== index));
      if (index < queueIndex) {
        setQueueIndex((idx) => idx - 1);
      }
    },
    [queueIndex]
  );

  const clearQueue = useCallback(() => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  }, [currentTrack]);

  const getFrequencyData = useCallback(() => {
    return audioEngine.getFrequencyData();
  }, []);

  // Global keyboard shortcuts (Space: play/pause, ArrowLeft/Right: seek, ArrowUp/Down: vol, M: mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seek(Math.min(duration, currentTime + 5));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seek(Math.max(0, currentTime - 5));
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setVolume(Math.min(1, volume + 0.05));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setVolume(Math.max(0, volume - 0.05));
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seek, currentTime, duration, setVolume, volume, toggleMute]);

  const value = useMemo(
    () => ({
      currentTrack,
      isPlaying,
      isLoading,
      currentTime,
      duration,
      volume,
      isMuted,
      isShuffle,
      repeatMode,
      queue,
      queueIndex,
      isExpandedNowPlaying,
      isQueueDrawerOpen,
      setIsExpandedNowPlaying,
      setIsQueueDrawerOpen,
      playTrack,
      togglePlay,
      nextTrack,
      previousTrack,
      seek,
      setVolume,
      toggleMute,
      toggleShuffle,
      cycleRepeat,
      addToQueue,
      removeFromQueue,
      clearQueue,
      getFrequencyData,
    }),
    [
      currentTrack,
      isPlaying,
      isLoading,
      currentTime,
      duration,
      volume,
      isMuted,
      isShuffle,
      repeatMode,
      queue,
      queueIndex,
      isExpandedNowPlaying,
      isQueueDrawerOpen,
      playTrack,
      togglePlay,
      nextTrack,
      previousTrack,
      seek,
      setVolume,
      toggleMute,
      toggleShuffle,
      cycleRepeat,
      addToQueue,
      removeFromQueue,
      clearQueue,
      getFrequencyData,
    ]
  );

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
