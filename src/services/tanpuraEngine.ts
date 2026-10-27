/**
 * Acoustic Indian Tanpura Drone Synthesizer Engine
 * Pure procedural Web Audio synthesis for authentic Indian acoustic resonance.
 * Pluck sequence: Pa (5th) -> Jod Sa (Tonic) -> Jod Sa (Tonic) -> Kharaj Sa (Bass Tonic)
 * With authentic Javari harmonic overtone simulation.
 */

export type TanpuraTuning = 'Pa' | 'Ma' | 'Ni';
export type TanpuraRoot = 'C' | 'C#' | 'D' | 'D#' | 'A#';

export interface TanpuraState {
  isPlaying: boolean;
  root: TanpuraRoot;
  tuning: TanpuraTuning;
  volume: number;
  tempo: number; // in BPM
  currentString: number; // 0 to 3
}

const ROOT_FREQUENCIES: Record<TanpuraRoot, number> = {
  'A#': 116.54,
  'C': 130.81,
  'C#': 138.59,
  'D': 146.83,
  'D#': 155.56,
};

class TanpuraEngine {
  private static instance: TanpuraEngine;
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying: boolean = false;
  private timerId: any = null;
  private root: TanpuraRoot = 'C#';
  private tuning: TanpuraTuning = 'Pa';
  private volume: number = 0.35;
  private tempo: number = 28; // Serene 28 BPM cycle
  private currentStringIndex: number = 0;
  private listeners: Set<(state: TanpuraState) => void> = new Set();

  private constructor() {}

  public static getInstance(): TanpuraEngine {
    if (!TanpuraEngine.instance) {
      TanpuraEngine.instance = new TanpuraEngine();
    }
    return TanpuraEngine.instance;
  }

  private initContext(): void {
    if (!this.audioContext && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        this.masterGain.connect(this.audioContext.destination);
      }
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
  }

  public subscribe(callback: (state: TanpuraState) => void): () => void {
    this.listeners.add(callback);
    callback(this.getState());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(): void {
    const st = this.getState();
    this.listeners.forEach((l) => l(st));
  }

  public getState(): TanpuraState {
    return {
      isPlaying: this.isPlaying,
      root: this.root,
      tuning: this.tuning,
      volume: this.volume,
      tempo: this.tempo,
      currentString: this.currentStringIndex,
    };
  }

  public toggle(): void {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  public start(): void {
    this.initContext();
    if (!this.audioContext || !this.masterGain) return;
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.currentStringIndex = 0;
    this.notify();
    this.scheduleNextPluck();
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  public setRoot(root: TanpuraRoot): void {
    this.root = root;
    this.notify();
  }

  public setTuning(tuning: TanpuraTuning): void {
    this.tuning = tuning;
    this.notify();
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.audioContext) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
    }
    this.notify();
  }

  private scheduleNextPluck(): void {
    if (!this.isPlaying || !this.audioContext) return;

    this.pluckString(this.currentStringIndex);
    this.notify();

    // Advance string: 0 -> 1 -> 2 -> 3 -> 0
    // Pa string takes 1.5 beats, Jod Sa 1.0 beats, Kharaj 2.0 beats
    const beatIntervalMs = (60 / this.tempo) * 1000;
    let delay = beatIntervalMs;
    if (this.currentStringIndex === 0) delay = beatIntervalMs * 1.25;
    else if (this.currentStringIndex === 1) delay = beatIntervalMs * 0.9;
    else if (this.currentStringIndex === 2) delay = beatIntervalMs * 0.9;
    else delay = beatIntervalMs * 1.45;

    this.currentStringIndex = (this.currentStringIndex + 1) % 4;

    this.timerId = setTimeout(() => {
      this.scheduleNextPluck();
    }, delay);
  }

  /**
   * Synthesizes rich acoustic string pluck with Javari harmonic overtone bloom
   */
  private pluckString(stringIdx: number): void {
    if (!this.audioContext || !this.masterGain) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;
    const baseFreq = ROOT_FREQUENCIES[this.root];

    let freq = baseFreq;
    if (stringIdx === 0) {
      // First string: Pa (1.5x), Ma (1.33x), or Shuddha Ni (1.875x)
      if (this.tuning === 'Pa') freq = baseFreq * 1.5;
      else if (this.tuning === 'Ma') freq = baseFreq * 1.3333;
      else freq = baseFreq * 1.875;
    } else if (stringIdx === 1 || stringIdx === 2) {
      // Middle strings: Jod Sa (octave higher)
      freq = baseFreq * 2.0;
    } else {
      // 4th string: Kharaj Sa (low fundamental tonic)
      freq = baseFreq;
    }

    // String gain envelope
    const stringGain = ctx.createGain();
    stringGain.gain.setValueAtTime(0.0001, now);
    stringGain.gain.linearRampToValueAtTime(0.45, now + 0.04);
    // Natural resonant decay: 4.5 seconds of lingering resonance
    stringGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

    // Warm resonant bandpass filter (simulates hollow wooden gourd - Tumba)
    const bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'lowpass';
    bodyFilter.frequency.setValueAtTime(1400, now);
    bodyFilter.Q.setValueAtTime(2.5, now);

    // Harmonics generation for authentic Javari shimmer
    const harmonics = [
      { ratio: 1.0, weight: 1.0 },
      { ratio: 2.0, weight: 0.65 },
      { ratio: 3.0, weight: 0.45 },
      { ratio: 4.0, weight: 0.3 },
      { ratio: 5.0, weight: 0.2 },
      { ratio: 6.0, weight: 0.12 },
    ];

    harmonics.forEach((h, i) => {
      const osc = ctx.createOscillator();
      const hGain = ctx.createGain();
      // Subtle Javari detuning
      const detuneCents = (i % 2 === 0 ? 1 : -1) * (i * 1.8);

      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq * h.ratio, now);
      osc.detune.setValueAtTime(detuneCents, now);

      hGain.gain.setValueAtTime(h.weight * 0.18, now);
      // Higher harmonics decay slightly faster
      hGain.gain.exponentialRampToValueAtTime(0.0001, now + (4.5 - i * 0.4));

      osc.connect(hGain);
      hGain.connect(stringGain);

      osc.start(now);
      osc.stop(now + 4.6);
    });

    stringGain.connect(bodyFilter);
    bodyFilter.connect(this.masterGain);

    setTimeout(() => {
      stringGain.disconnect();
      bodyFilter.disconnect();
    }, 4700);
  }
}

export const tanpuraEngine = TanpuraEngine.getInstance();
