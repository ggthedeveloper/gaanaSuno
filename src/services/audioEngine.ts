export type AudioEventListener = {
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onDurationChange?: (duration: number) => void;
  onEnded?: () => void;
  onError?: (errorMessage: string) => void;
  onLoading?: (isLoading: boolean) => void;
};

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

class AudioEngine {
  private static instance: AudioEngine;
  private audio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private frequencyData: Uint8Array = new Uint8Array(64);
  private listeners: Set<AudioEventListener> = new Set();

  // YouTube IFrame Player State
  private ytPlayer: any = null;
  private ytPlayerReady: boolean = false;
  private ytLoadingPromise: Promise<any> | null = null;
  private activeSource: 'html5' | 'youtube' = 'youtube';
  private isYtPlaying: boolean = false;
  private ytTicker: any = null;
  private currentVolume: number = 0.85;
  private currentYoutubeId: string | null = null;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
      // Pre-warm YouTube Player API
      this.initYouTubePlayer().catch(() => {});
    }
  }

  public static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  private initAudioElement(): void {
    if (this.audio) return;
    this.audio = new Audio();
    this.audio.preload = 'auto';

    this.audio.addEventListener('play', () => {
      this.ensureAudioContext();
      if (this.activeSource === 'html5') {
        this.listeners.forEach((l) => l.onPlay?.());
      }
    });

    this.audio.addEventListener('pause', () => {
      if (this.activeSource === 'html5') {
        this.listeners.forEach((l) => l.onPause?.());
      }
    });

    this.audio.addEventListener('timeupdate', () => {
      if (!this.audio || this.activeSource !== 'html5') return;
      const current = this.audio.currentTime || 0;
      const dur = this.audio.duration || 0;
      this.listeners.forEach((l) => l.onTimeUpdate?.(current, dur));
    });

    this.audio.addEventListener('durationchange', () => {
      if (!this.audio || this.activeSource !== 'html5') return;
      const dur = this.audio.duration || 0;
      this.listeners.forEach((l) => l.onDurationChange?.(dur));
    });

    this.audio.addEventListener('ended', () => {
      if (this.activeSource === 'html5') {
        this.listeners.forEach((l) => l.onEnded?.());
      }
    });

    this.audio.addEventListener('waiting', () => {
      if (this.activeSource === 'html5') {
        this.listeners.forEach((l) => l.onLoading?.(true));
      }
    });

    this.audio.addEventListener('canplay', () => {
      if (this.activeSource === 'html5') {
        this.listeners.forEach((l) => l.onLoading?.(false));
      }
    });

    this.audio.addEventListener('error', () => {
      if (this.activeSource === 'html5') {
        const err = this.audio?.error;
        const message = err ? `Audio error code ${err.code}: ${err.message}` : 'Playback error occurred';
        this.listeners.forEach((l) => l.onError?.(message));
      }
    });
  }

  private ensureAudioContext(): void {
    if (!this.audioContext && typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioCtx();
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 128;
        this.analyser.smoothingTimeConstant = 0.82;
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      } catch (e) {
        console.warn('AudioContext init note:', e);
      }
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
  }

  /**
   * Initializes the official YouTube IFrame Player instance in a dedicated background element
   */
  public initYouTubePlayer(): Promise<any> {
    if (typeof window === 'undefined') {
      return Promise.resolve(null);
    }
    if (this.ytPlayerReady && this.ytPlayer) {
      return Promise.resolve(this.ytPlayer);
    }
    if (this.ytLoadingPromise) {
      return this.ytLoadingPromise;
    }

    this.ytLoadingPromise = new Promise((resolve) => {
      const createPlayer = () => {
        try {
          let container = document.getElementById('gaanasuno-yt-player');
          if (!container) {
            container = document.createElement('div');
            container.id = 'gaanasuno-yt-player';
            container.style.position = 'fixed';
            container.style.bottom = '90px';
            container.style.right = '12px';
            container.style.width = '240px';
            container.style.height = '135px';
            container.style.opacity = '0.001';
            container.style.pointerEvents = 'none';
            container.style.zIndex = '-1';
            container.style.overflow = 'hidden';
            container.style.borderRadius = '12px';
            document.body.appendChild(container);
          }

          this.ytPlayer = new window.YT.Player('gaanasuno-yt-player', {
            height: '135',
            width: '240',
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              playsinline: 1,
              rel: 0,
              enablejsapi: 1,
              origin: window.location.origin,
            },
            events: {
              onReady: () => {
                this.ytPlayerReady = true;
                if (this.currentVolume !== undefined) {
                  this.ytPlayer.setVolume(Math.round(this.currentVolume * 100));
                }
                resolve(this.ytPlayer);
              },
              onStateChange: (event: any) => {
                // -1 = unstarted, 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = video cued
                const state = event.data;
                if (state === 1) {
                  // PLAYING
                  this.isYtPlaying = true;
                  this.startYtTicker();
                  this.listeners.forEach((l) => l.onPlay?.());
                  this.listeners.forEach((l) => l.onLoading?.(false));
                } else if (state === 2) {
                  // PAUSED
                  this.isYtPlaying = false;
                  this.stopYtTicker();
                  this.listeners.forEach((l) => l.onPause?.());
                  this.listeners.forEach((l) => l.onLoading?.(false));
                } else if (state === 0) {
                  // ENDED
                  this.isYtPlaying = false;
                  this.stopYtTicker();
                  this.listeners.forEach((l) => l.onEnded?.());
                } else if (state === 3) {
                  // BUFFERING
                  this.listeners.forEach((l) => l.onLoading?.(true));
                }
              },
              onError: (err: any) => {
                console.warn('YouTube Player Event Error:', err);
                this.listeners.forEach((l) =>
                  l.onError?.('YouTube playback error (code ' + (err.data || 'unknown') + ')')
                );
              },
            },
          });
        } catch (e) {
          console.warn('YouTube Player creation warning:', e);
          resolve(null);
        }
      };

      if (window.YT && window.YT.Player) {
        createPlayer();
      } else {
        const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
        if (!existingScript) {
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
        }

        const prevHandler = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          prevHandler?.();
          createPlayer();
        };
      }
    });

    return this.ytLoadingPromise;
  }

  private startYtTicker(): void {
    this.stopYtTicker();
    this.ytTicker = setInterval(() => {
      if (this.ytPlayer && this.ytPlayerReady && this.activeSource === 'youtube') {
        try {
          const cur = this.ytPlayer.getCurrentTime?.() || 0;
          const dur = this.ytPlayer.getDuration?.() || 0;
          if (dur > 0) {
            this.listeners.forEach((l) => l.onTimeUpdate?.(cur, dur));
          }
        } catch {}
      }
    }, 250);
  }

  private stopYtTicker(): void {
    if (this.ytTicker) {
      clearInterval(this.ytTicker);
      this.ytTicker = null;
    }
  }

  public subscribe(listener: AudioEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Unified load and play method.
   * If youtubeId is provided, streams legally via YouTube IFrame API.
   * Otherwise falls back to HTML5 audio element.
   */
  public async loadAndPlay(src?: string, youtubeId?: string): Promise<boolean> {
    this.stop();

    if (youtubeId) {
      this.activeSource = 'youtube';
      this.currentYoutubeId = youtubeId;
      this.listeners.forEach((l) => l.onLoading?.(true));

      try {
        await this.initYouTubePlayer();
        if (this.ytPlayer && this.ytPlayerReady) {
          this.ytPlayer.loadVideoById(youtubeId);
          this.ytPlayer.setVolume(Math.round(this.currentVolume * 100));
          this.isYtPlaying = true;
          return true;
        }
      } catch (err) {
        console.warn('YouTube loadAndPlay error:', err);
      }
    }

    // HTML5 fallback when src is available
    if (src) {
      this.activeSource = 'html5';
      if (!this.audio) this.initAudioElement();
      if (!this.audio) return false;

      try {
        const currentSrc = this.audio.getAttribute('src') || this.audio.src || '';
        if (currentSrc !== src && !this.audio.src.endsWith(src)) {
          this.audio.src = src;
          this.audio.load();
        }
        this.ensureAudioContext();
        await this.audio.play();
        return true;
      } catch (err: any) {
        if (err?.name === 'AbortError') return false;
        console.warn('Playback error for:', src, err);
        this.listeners.forEach((l) => l.onError?.('Unable to play audio'));
        return false;
      }
    }

    return false;
  }

  public async play(): Promise<boolean> {
    if (this.activeSource === 'youtube') {
      if (this.ytPlayer && this.ytPlayerReady) {
        try {
          this.ytPlayer.playVideo();
          this.isYtPlaying = true;
          this.startYtTicker();
          this.listeners.forEach((l) => l.onPlay?.());
          return true;
        } catch (e) {
          console.warn('YouTube play error:', e);
        }
      }
      return false;
    }

    if (!this.audio) return false;
    try {
      this.ensureAudioContext();
      this.listeners.forEach((l) => l.onPlay?.());
      await this.audio.play();
      return true;
    } catch (err: any) {
      if (err?.name === 'AbortError') return false;
      console.warn('Play error:', err);
      return false;
    }
  }

  public pause(): void {
    if (this.activeSource === 'youtube') {
      this.isYtPlaying = false;
      this.stopYtTicker();
      if (this.ytPlayer && this.ytPlayerReady) {
        try {
          this.ytPlayer.pauseVideo();
        } catch {}
      }
      this.listeners.forEach((l) => l.onPause?.());
      return;
    }

    if (this.audio) {
      this.audio.pause();
      this.listeners.forEach((l) => l.onPause?.());
    }
  }

  public stop(): void {
    this.stopYtTicker();
    this.isYtPlaying = false;

    if (this.ytPlayer && this.ytPlayerReady) {
      try {
        this.ytPlayer.stopVideo();
      } catch {}
    }

    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  public seek(seconds: number): void {
    if (Number.isFinite(seconds) && seconds >= 0) {
      if (this.activeSource === 'youtube' && this.ytPlayer && this.ytPlayerReady) {
        try {
          this.ytPlayer.seekTo(seconds, true);
          const dur = this.ytPlayer.getDuration?.() || 0;
          this.listeners.forEach((l) => l.onTimeUpdate?.(seconds, dur));
          return;
        } catch {}
      }

      if (this.audio) {
        const max =
          Number.isFinite(this.audio.duration) && this.audio.duration > 0
            ? this.audio.duration
            : Infinity;
        const clamped = Math.max(0, Math.min(seconds, max));
        this.audio.currentTime = clamped;
        this.listeners.forEach((l) => l.onTimeUpdate?.(clamped, this.audio?.duration || 0));
      }
    }
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    this.currentVolume = clamped;

    if (this.audio) {
      this.audio.volume = clamped;
    }

    if (this.ytPlayer && this.ytPlayerReady) {
      try {
        this.ytPlayer.setVolume(Math.round(clamped * 100));
      } catch {}
    }
  }

  public setMuted(muted: boolean): void {
    if (this.audio) {
      this.audio.muted = muted;
    }

    if (this.ytPlayer && this.ytPlayerReady) {
      try {
        if (muted) {
          this.ytPlayer.mute();
        } else {
          this.ytPlayer.unMute();
        }
      } catch {}
    }
  }

  public setPlaybackRate(rate: number): void {
    const clampedRate = Math.max(0.5, Math.min(2, rate));
    if (this.audio) {
      this.audio.playbackRate = clampedRate;
    }
    if (this.ytPlayer && this.ytPlayerReady) {
      try {
        this.ytPlayer.setPlaybackRate(clampedRate);
      } catch {}
    }
  }

  public getCurrentTime(): number {
    if (this.activeSource === 'youtube' && this.ytPlayer && this.ytPlayerReady) {
      try {
        return this.ytPlayer.getCurrentTime?.() || 0;
      } catch {}
    }
    return this.audio?.currentTime || 0;
  }

  public getDuration(): number {
    if (this.activeSource === 'youtube' && this.ytPlayer && this.ytPlayerReady) {
      try {
        return this.ytPlayer.getDuration?.() || 0;
      } catch {}
    }
    return this.audio?.duration || 0;
  }

  public isPaused(): boolean {
    if (this.activeSource === 'youtube') {
      return !this.isYtPlaying;
    }
    return this.audio?.paused ?? true;
  }

  public getActiveSource(): 'html5' | 'youtube' {
    return this.activeSource;
  }

  public getCurrentYoutubeId(): string | null {
    return this.currentYoutubeId;
  }

  /**
   * Returns frequency data for visualizer. Reads from Web Audio when active,
   * otherwise synthesizes rhythmic dancing frequencies while playing.
   */
  public getFrequencyData(): Uint8Array {
    if (this.activeSource === 'html5' && this.analyser && !this.isPaused()) {
      try {
        this.analyser.getByteFrequencyData(this.frequencyData as any);
        let sum = 0;
        for (let i = 0; i < 16; i++) sum += this.frequencyData[i];
        if (sum > 0) return this.frequencyData;
      } catch {}
    }

    // Dynamic wave simulation when audio is playing (either YouTube or HTML5)
    if (!this.isPaused()) {
      const now = performance.now() * 0.005;
      for (let i = 0; i < this.frequencyData.length; i++) {
        const wave = Math.sin(now + i * 0.3) * 0.5 + 0.5;
        const wave2 = Math.cos(now * 0.7 + i * 0.2) * 0.5 + 0.5;
        this.frequencyData[i] = Math.floor((wave * 0.6 + wave2 * 0.4) * 220 + 20);
      }
    } else {
      this.frequencyData.fill(0);
    }

    return this.frequencyData;
  }
}

export const audioEngine = AudioEngine.getInstance();
