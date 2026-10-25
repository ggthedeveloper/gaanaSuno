import { describe, it, expect } from 'vitest';
import { formatTime, formatDurationLong } from '../utils/formatters';

describe('formatters utility', () => {
  it('formats seconds into mm:ss accurately', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(59)).toBe('0:59');
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(75)).toBe('1:15');
    expect(formatTime(215)).toBe('3:35');
    expect(formatTime(3600)).toBe('60:00');
  });

  it('handles negative or invalid seconds safely', () => {
    expect(formatTime(-10)).toBe('0:00');
    expect(formatTime(NaN)).toBe('0:00');
    expect(formatTime(Infinity)).toBe('0:00');
  });

  it('formats duration into human-readable minutes and seconds', () => {
    expect(formatDurationLong(0)).toBe('0 min');
    expect(formatDurationLong(45)).toBe('45 sec');
    expect(formatDurationLong(120)).toBe('2 min');
    expect(formatDurationLong(215)).toBe('3 min 35 sec');
  });
});
