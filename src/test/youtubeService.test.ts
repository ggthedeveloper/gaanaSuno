import { describe, it, expect } from 'vitest';
import {
  parseISO8601Duration,
  parseYouTubeMusicTitle,
  YOUTUBE_API_KEY,
} from '../services/youtubeService';

describe('YouTube Service & Duration Parser', () => {
  it('has valid YouTube Data v3 API key configured', () => {
    expect(YOUTUBE_API_KEY).toBe('AIzaSyDETX0Dwk6VsWOFcLt3Umckc9J5pZp6Hm0');
  });

  it('parses various ISO 8601 durations correctly', () => {
    // 3 minutes 45 seconds = 225s
    expect(parseISO8601Duration('PT3M45S')).toBe(225);

    // 4 minutes 8 seconds = 248s
    expect(parseISO8601Duration('PT4M8S')).toBe(248);

    // 1 hour 2 minutes 10 seconds = 3730s
    expect(parseISO8601Duration('PT1H2M10S')).toBe(3730);

    // 52 seconds = 52s
    expect(parseISO8601Duration('PT52S')).toBe(52);

    // 5 minutes flat = 300s
    expect(parseISO8601Duration('PT5M')).toBe(300);

    // Empty or invalid fallback
    expect(parseISO8601Duration('')).toBe(210);
    expect(parseISO8601Duration('invalid')).toBe(210);
  });

  it('cleans noisy YouTube titles and extracts clean Song Title and Artist', () => {
    const raw1 = 'Kesariya - Brahmāstra | Ranbir Kapoor, Alia Bhatt | Pritam | Arijit Singh | 4K';
    const parsed1 = parseYouTubeMusicTitle(raw1, 'Sony Music India');
    expect(parsed1.title).toBe('Kesariya');

    const raw2 = 'Diljit Dosanjh: LOVER (Official Music Video) Intense | Raj Ranjodh | MoonChild Era';
    const parsed2 = parseYouTubeMusicTitle(raw2, 'Diljit Dosanjh');
    expect(parsed2.title.toLowerCase()).toContain('lover');
    expect(parsed2.artist).toBe('Diljit Dosanjh');

    const raw3 = 'Deewani Mastani - Official Video Song | Deepika Padukone | Shreya Ghoshal | SLB';
    const parsed3 = parseYouTubeMusicTitle(raw3, 'Sony Music India');
    expect(parsed3.title).toBe('Deewani Mastani');

    const raw4 = 'Coke Studio Season 9| Afreen Afreen| Rahat Fateh Ali Khan & Momina Mustehsan';
    const parsed4 = parseYouTubeMusicTitle(raw4, 'Coke Studio');
    expect(parsed4.title).toContain('Afreen Afreen');
  });
});
