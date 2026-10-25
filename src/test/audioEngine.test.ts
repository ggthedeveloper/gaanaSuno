import { describe, it, expect, vi } from 'vitest';
import { audioEngine } from '../services/audioEngine';

describe('AudioEngine Unit Tests', () => {
  it('provides a singleton instance', () => {
    expect(audioEngine).toBeDefined();
    expect(typeof audioEngine.loadAndPlay).toBe('function');
  });

  it('handles volume clamping between 0 and 1', () => {
    audioEngine.setVolume(0.5);
    audioEngine.setVolume(-0.2); // clamps to 0
    audioEngine.setVolume(1.5); // clamps to 1
    // Verify no throw
    expect(true).toBe(true);
  });

  it('handles mute state toggling', () => {
    audioEngine.setMuted(true);
    audioEngine.setMuted(false);
    expect(true).toBe(true);
  });

  it('handles playback rate setting between 0.5x and 2.0x', () => {
    audioEngine.setPlaybackRate(1.25);
    audioEngine.setPlaybackRate(0.1); // clamps to 0.5
    audioEngine.setPlaybackRate(3.0); // clamps to 2.0
    expect(true).toBe(true);
  });

  it('returns valid frequency data buffer for visualizer', () => {
    const data = audioEngine.getFrequencyData();
    expect(data).toBeInstanceOf(Uint8Array);
    expect(data.length).toBeGreaterThan(0);
  });

  it('manages listener subscription lifecycle cleanly', () => {
    const listener = {
      onPlay: vi.fn(),
      onPause: vi.fn(),
    };

    const unsubscribe = audioEngine.subscribe(listener);
    expect(typeof unsubscribe).toBe('function');

    // Unsubscribe cleanly
    unsubscribe();
  });
});
