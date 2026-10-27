import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateMomentMix,
  sessionTimer,
} from '../services/sessionMixService';

describe('Moment Mixes & Session Timer Service', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionTimer.cancelTimer();
  });

  afterEach(() => {
    sessionTimer.cancelTimer();
    vi.useRealTimers();
  });

  it('generates a curated session mix for focus with matching tempo and mood', () => {
    const mix = generateMomentMix('focus', 30);
    expect(mix.config.id).toBe('focus');
    expect(mix.tracks.length).toBeGreaterThan(0);
    expect(mix.actualDurationSeconds).toBeGreaterThan(0);
    expect(mix.explanation).toContain('Deep Focus');
  });

  it('generates a drive mix with energetic or rhythmic tracks', () => {
    const mix = generateMomentMix('drive', 45);
    expect(mix.config.id).toBe('drive');
    expect(mix.tracks.length).toBeGreaterThan(0);
    // At least one track should align with drive intentions
    expect(mix.tracks.some((t) => t.moods.includes('energetic') || t.tempo === 'medium')).toBe(true);
  });

  it('enforces artist diversity so no single artist exceeds 2 tracks', () => {
    const mix = generateMomentMix('unwind', 60);
    const artistCounts: Record<string, number> = {};
    mix.tracks.forEach((t) => {
      artistCounts[t.artist] = (artistCounts[t.artist] || 0) + 1;
    });
    Object.values(artistCounts).forEach((c) => {
      expect(c).toBeLessThanOrEqual(2);
    });
  });

  it('sets session timer and triggers callback when duration expires', () => {
    const callback = vi.fn();
    sessionTimer.setTimer(15, callback);

    expect(sessionTimer.isTimerActive()).toBe(true);
    expect(sessionTimer.getRemainingSeconds()).toBe(15 * 60);

    // Fast-forward 10 minutes
    vi.advanceTimersByTime(10 * 60 * 1000);
    expect(sessionTimer.getRemainingSeconds()).toBe(5 * 60);
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward remaining 5 minutes
    vi.advanceTimersByTime(5 * 60 * 1000);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(sessionTimer.isTimerActive()).toBe(false);
  });

  it('cancels active session timer cleanly', () => {
    const callback = vi.fn();
    sessionTimer.setTimer(30, callback);
    expect(sessionTimer.isTimerActive()).toBe(true);

    sessionTimer.cancelTimer();
    expect(sessionTimer.isTimerActive()).toBe(false);
    expect(sessionTimer.getRemainingSeconds()).toBeNull();

    vi.advanceTimersByTime(35 * 60 * 1000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('supports end-of-track mode and expires when track ends', () => {
    const callback = vi.fn();
    sessionTimer.setTimer('end_of_track', callback);

    expect(sessionTimer.isEndOfTrackActive()).toBe(true);
    expect(sessionTimer.isTimerActive()).toBe(true);

    // Simulate track end event
    sessionTimer.handleTrackEnded();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(sessionTimer.isTimerActive()).toBe(false);
  });
});
