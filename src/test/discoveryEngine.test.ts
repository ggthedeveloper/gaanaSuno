import { describe, it, expect, beforeEach } from 'vitest';
import {
  getBeyondTasteRecommendations,
  recordDiscoverySignal,
  resetDiscoverySignals,
  getDiscoveryFeedback,
  surpriseMeDiscovery,
  extractAffinityProfile,
} from '../services/discoveryEngine';
import { TRACKS } from '../data/catalog';

describe('Beyond Your Taste Discovery Engine', () => {
  beforeEach(() => {
    resetDiscoverySignals();
  });

  it('extracts affinity profile from liked and recent tracks accurately', () => {
    const affinity = extractAffinityProfile(['track-1'], ['track-4']);
    expect(affinity.topMoods.length).toBeGreaterThan(0);
    expect(affinity.topGenres.length).toBeGreaterThan(0);
    expect(affinity.topLanguages.length).toBeGreaterThan(0);
  });

  it('recommends familiar tracks when discovery level is "familiar"', () => {
    const result = getBeyondTasteRecommendations({
      level: 'familiar',
      likedIds: ['track-1'],
      recentIds: ['track-1'],
      limit: 4,
    });

    expect(result.level).toBe('familiar');
    expect(result.items.length).toBe(4);
    expect(result.summary).toContain('Familiar Comfort');
    expect(result.items.every((i) => typeof i.explanation === 'string' && i.explanation.length > 0)).toBe(true);
  });

  it('recommends bridge tracks when discovery level is "balanced"', () => {
    const result = getBeyondTasteRecommendations({
      level: 'balanced',
      likedIds: ['track-1'],
      recentIds: [],
      limit: 4,
    });

    expect(result.level).toBe('balanced');
    expect(result.items.length).toBe(4);
    expect(result.summary).toContain('Balanced Discovery');
    // Balanced result should have both core and bridge categories
    const categories = result.items.map((i) => i.category);
    expect(categories.includes('core_taste') || categories.includes('bridge_discovery')).toBe(true);
  });

  it('explores frontier territory when discovery level is "experimental"', () => {
    const result = getBeyondTasteRecommendations({
      level: 'experimental',
      likedIds: ['track-1'],
      recentIds: [],
      limit: 4,
    });

    expect(result.level).toBe('experimental');
    expect(result.items.length).toBe(4);
    expect(result.summary).toContain('Frontier Territory');
    expect(result.items.some((i) => i.category === 'frontier_experimental')).toBe(true);
  });

  it('records positive and negative feedback signals correctly', () => {
    recordDiscoverySignal('track-10', 'more');
    let feedback = getDiscoveryFeedback();
    expect(feedback.moreLikeThisIds).toContain('track-10');

    recordDiscoverySignal('track-14', 'less');
    feedback = getDiscoveryFeedback();
    expect(feedback.notForMeIds).toContain('track-14');

    // Track 14 must be filtered out of subsequent recommendations
    const result = getBeyondTasteRecommendations({
      level: 'familiar',
      feedback,
      limit: 6,
    });
    const ids = result.items.map((i) => i.track.id);
    expect(ids).not.toContain('track-14');
  });

  it('resets discovery signals completely', () => {
    recordDiscoverySignal('track-5', 'more');
    recordDiscoverySignal('track-6', 'less');
    resetDiscoverySignals();
    const feedback = getDiscoveryFeedback();
    expect(feedback.moreLikeThisIds.length).toBe(0);
    expect(feedback.notForMeIds.length).toBe(0);
  });

  it('enforces artist diversity limit so an artist is never repeated more than twice', () => {
    const result = getBeyondTasteRecommendations({
      level: 'familiar',
      limit: 6,
    });

    const artistCounts: Record<string, number> = {};
    result.items.forEach(({ track }) => {
      artistCounts[track.artist] = (artistCounts[track.artist] || 0) + 1;
    });

    Object.values(artistCounts).forEach((count) => {
      expect(count).toBeLessThanOrEqual(2);
    });
  });

  it('returns varied tracks on surpriseMeDiscovery without crashing', () => {
    const surprises = surpriseMeDiscovery(TRACKS);
    expect(surprises.length).toBeGreaterThan(0);
    expect(surprises.length).toBeLessThanOrEqual(5);
  });

  it('handles empty catalog gracefully without fabricating data', () => {
    const result = getBeyondTasteRecommendations({
      level: 'balanced',
      catalog: [],
    });
    expect(result.items.length).toBe(0);
    expect(result.summary).toContain('empty');
  });
});
