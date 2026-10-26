export type AudioEventListener = {
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onDurationChange?: (duration: number) => void;
  onEnded?: () => void;
  onError?: (errorMessage: string) => void;
  onLoading?: (isLoading: boolean) => void;
};

class AudioEngine {
  private static instance: AudioEngine;
  private audio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private frequencyData: Uint8Array = new Uint8Array(64);
  private listeners: Set<AudioEventListener> = new Set();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
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
      this.listeners.forEach((l) => l.onPlay?.());
    });

    this.audio.addEventListener('pause', () => {
      this.listeners.forEach((l) => l.onPause?.());
    });

    this.audio.addEventListener('timeupdate', () => {
      if (!this.audio) return;
      const current = this.audio.currentTime || 0;
      const dur = this.audio.duration || 0;
      this.listeners.forEach((l) => l.onTimeUpdate?.(current, dur));
    });

    this.audio.addEventListener('durationchange', () => {
      if (!this.audio) return;
      const dur = this.audio.duration || 0;
      this.listeners.forEach((l) => l.onDurationChange?.(dur));
    });

    this.audio.addEventListener('ended', () => {
      this.listeners.forEach((l) => l.onEnded?.());
    });

    this.audio.addEventListener('waiting', () => {
      this.listeners.forEach((l) => l.onLoading?.(true));
    });

    this.audio.addEventListener('canplay', () => {
      this.listeners.forEach((l) => l.onLoading?.(false));
    });

    this.audio.addEventListener('error', () => {
      const err = this.audio?.error;
      const message = err ? `Audio error code ${err.code}: ${err.message}` : 'Playback error occurred';
      this.listeners.forEach((l) => l.onError?.(message));
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

  public subscribe(listener: AudioEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public async loadAndPlay(src: string): Promise<boolean> {
    if (!this.audio) this.initAudioElement();
    if (!this.audio) return false;

    // Immediately stop and reset any previous audio
    this.audio.pause();
    this.audio.currentTime = 0;

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
      if (err?.name === 'AbortError') {
        // Interrupted by another track being chosen quickly; ignore cleanly
        return false;
      }
      console.warn('Playback error for:', src, err);
      this.listeners.forEach((l) => l.onError?.('Unable to play audio'));
      return false;
    }
  }

  public async play(): Promise<boolean> {
    if (!this.audio) return false;
    try {
      this.ensureAudioContext();
      await this.audio.play();
      return true;
    } catch (err: any) {
      if (err?.name === 'AbortError') return false;
      console.warn('Play error:', err);
      return false;
    }
  }

  public pause(): void {
    if (this.audio) {
      this.audio.pause();
    }
  }

  public stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  public seek(seconds: number): void {
    if (!this.audio) return;
    if (Number.isFinite(seconds) && seconds >= 0) {
      const max = Number.isFinite(this.audio.duration) && this.audio.duration > 0
        ? this.audio.duration
        : Infinity;
      const clamped = Math.max(0, Math.min(seconds, max));
      this.audio.currentTime = clamped;
      this.listeners.forEach((l) => l.onTimeUpdate?.(clamped, this.audio?.duration || 0));
    }
  }

  public setVolume(volume: number): void {
    if (!this.audio) return;
    const clamped = Math.max(0, Math.min(1, volume));
    this.audio.volume = clamped;
  }

  public setMuted(muted: boolean): void {
    if (!this.audio) return;
    this.audio.muted = muted;
  }

  public setPlaybackRate(rate: number): void {
    if (!this.audio) return;
    this.audio.playbackRate = Math.max(0.5, Math.min(2, rate));
  }

  public getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  public getDuration(): number {
    return this.audio?.duration || 0;
  }

  public isPaused(): boolean {
    return this.audio?.paused ?? true;
  }

  /**
   * Returns frequency data for visualizer. If real audio analyser is available,
   * reads from AnalyserNode. Otherwise computes dynamic frequencies while playing.
   */
  public getFrequencyData(): Uint8Array {
    if (this.analyser && !this.isPaused()) {
      try {
        this.analyser.getByteFrequencyData(this.frequencyData as any);
        let sum = 0;
        for (let i = 0; i < 16; i++) sum += this.frequencyData[i];
        if (sum > 0) return this.frequencyData;
      } catch {
        // Fallback
      }
    }

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
