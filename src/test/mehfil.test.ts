import { describe, it, expect, beforeEach } from 'vitest';
import { getCurrentPrahar, PRAHAR_DATA, NAVARASA_DATA } from '../services/praharService';
import { tanpuraEngine } from '../services/tanpuraEngine';
import { extractYouTubeId } from '../views/SearchView';

describe('Prahar & Indian Classical Raag Service', () => {
  it('returns a valid Prahar for current time', () => {
    const prahar = getCurrentPrahar();
    expect(prahar).toBeDefined();
    expect(prahar.name).toBeDefined();
    expect(prahar.nameDevanagari).toBeDefined();
    expect(prahar.ragas.length).toBeGreaterThan(0);
    expect(prahar.recommendedTrackIds.length).toBeGreaterThan(0);
    expect(prahar.couplet.hindi).toBeDefined();
  });

  it('contains complete metadata for all 5 classical Prahars', () => {
    const praharKeys = Object.keys(PRAHAR_DATA);
    expect(praharKeys).toEqual(['prabhat', 'madhyan', 'godhuli', 'ratri', 'madhyaratri']);

    praharKeys.forEach((key) => {
      const data = PRAHAR_DATA[key as keyof typeof PRAHAR_DATA];
      expect(data.id).toBe(key);
      expect(data.ragas.length).toBeGreaterThanOrEqual(2);
      expect(data.couplet.poet).toBeDefined();
    });
  });

  it('maps all 7 Navarasa aesthetics to catalog tracks', () => {
    const rasas = Object.keys(NAVARASA_DATA);
    expect(rasas.length).toBe(7);

    rasas.forEach((rasaKey) => {
      const rasa = NAVARASA_DATA[rasaKey as keyof typeof NAVARASA_DATA];
      expect(rasa.name).toBeDefined();
      expect(rasa.nameDevanagari).toBeDefined();
      expect(rasa.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(rasa.trackIds.length).toBeGreaterThan(0);
    });
  });
});

describe('Acoustic Tanpura Synthesizer Engine', () => {
  beforeEach(() => {
    tanpuraEngine.stop();
  });

  it('initializes with default state', () => {
    const state = tanpuraEngine.getState();
    expect(state.isPlaying).toBe(false);
    expect(state.root).toBeDefined();
    expect(state.tuning).toBe('Pa');
    expect(state.volume).toBeGreaterThan(0);
  });

  it('updates root key correctly', () => {
    tanpuraEngine.setRoot('D#');
    expect(tanpuraEngine.getState().root).toBe('D#');

    tanpuraEngine.setRoot('C#');
    expect(tanpuraEngine.getState().root).toBe('C#');
  });

  it('updates tuning mode (Pa, Ma, Ni)', () => {
    tanpuraEngine.setTuning('Ma');
    expect(tanpuraEngine.getState().tuning).toBe('Ma');

    tanpuraEngine.setTuning('Ni');
    expect(tanpuraEngine.getState().tuning).toBe('Ni');
  });

  it('clamps volume between 0 and 1', () => {
    tanpuraEngine.setVolume(1.5);
    expect(tanpuraEngine.getState().volume).toBe(1);

    tanpuraEngine.setVolume(-0.2);
    expect(tanpuraEngine.getState().volume).toBe(0);

    tanpuraEngine.setVolume(0.4);
    expect(tanpuraEngine.getState().volume).toBe(0.4);
  });
});

describe('YouTube Magic Portal Extractor', () => {
  it('extracts video ID from standard YouTube watch URLs', () => {
    expect(extractYouTubeId('https://www.youtube.com/watch?v=BddP6PY427U')).toBe('BddP6PY427U');
    expect(extractYouTubeId('https://www.youtube.com/watch?v=IJq0ywW283o&t=10s')).toBe('IJq0ywW283o');
  });

  it('extracts video ID from youtu.be short URLs', () => {
    expect(extractYouTubeId('https://youtu.be/5Eqb_-j3FDA')).toBe('5Eqb_-j3FDA');
  });

  it('accepts raw 11-character video IDs directly', () => {
    expect(extractYouTubeId('T94PHkuydcw')).toBe('T94PHkuydcw');
    expect(extractYouTubeId('  Grr0Exhy-lQ  ')).toBe('Grr0Exhy-lQ');
  });

  it('returns null for non-YouTube queries', () => {
    expect(extractYouTubeId('Arijit Singh Kesariya')).toBeNull();
    expect(extractYouTubeId('Raga Bhairavi')).toBeNull();
  });
});
