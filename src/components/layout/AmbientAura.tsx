import React from 'react';
import { useAudio } from '../../context/AudioContext';

const AURA_MAP: Record<string, { primary: string; secondary: string; tertiary: string }> = {
  romantic: {
    primary: 'rgba(244, 63, 94, 0.16)', // Rose
    secondary: 'rgba(245, 158, 11, 0.14)', // Saffron
    tertiary: 'rgba(236, 72, 153, 0.12)', // Magenta
  },
  devotional: {
    primary: 'rgba(245, 158, 11, 0.18)', // Saffron Gold
    secondary: 'rgba(234, 88, 12, 0.14)', // Deep Ochre
    tertiary: 'rgba(217, 119, 6, 0.12)', // Amber
  },
  chill: {
    primary: 'rgba(6, 182, 212, 0.15)', // Cyan
    secondary: 'rgba(99, 102, 241, 0.14)', // Indigo
    tertiary: 'rgba(59, 130, 246, 0.12)', // Blue
  },
  monsoon: {
    primary: 'rgba(14, 165, 233, 0.16)', // Sky Blue
    secondary: 'rgba(79, 70, 229, 0.13)', // Deep Indigo
    tertiary: 'rgba(20, 184, 166, 0.12)', // Teal
  },
  energetic: {
    primary: 'rgba(16, 185, 129, 0.16)', // Emerald
    secondary: 'rgba(249, 115, 22, 0.15)', // Orange
    tertiary: 'rgba(236, 72, 153, 0.13)', // Hot Pink
  },
  party: {
    primary: 'rgba(236, 72, 153, 0.16)', // Magenta
    secondary: 'rgba(245, 158, 11, 0.15)', // Saffron
    tertiary: 'rgba(139, 92, 246, 0.13)', // Violet
  },
  heartbreak: {
    primary: 'rgba(99, 102, 241, 0.16)', // Indigo
    secondary: 'rgba(59, 130, 246, 0.13)', // Blue
    tertiary: 'rgba(147, 51, 234, 0.12)', // Purple
  },
  nostalgic: {
    primary: 'rgba(217, 119, 6, 0.16)', // Amber
    secondary: 'rgba(244, 63, 94, 0.13)', // Warm Rose
    tertiary: 'rgba(234, 88, 12, 0.12)', // Tangerine
  },
  focus: {
    primary: 'rgba(139, 92, 246, 0.16)', // Violet
    secondary: 'rgba(99, 102, 241, 0.13)', // Indigo
    tertiary: 'rgba(16, 185, 129, 0.12)', // Sage
  },
};

export const AmbientAura: React.FC = () => {
  const { currentTrack, isPlaying } = useAudio();

  const mood = currentTrack?.moods?.[0] || 'romantic';
  const activeAura = AURA_MAP[mood] || AURA_MAP.romantic;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-1000"
    >
      {/* Orb 1: Upper Right Organic Blob */}
      <div
        className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full blur-[140px] animate-aura-1 transition-colors duration-1000"
        style={{
          background: activeAura.primary,
          opacity: isPlaying ? 1 : 0.65,
        }}
      />

      {/* Orb 2: Center Left Organic Blob */}
      <div
        className="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full blur-[130px] animate-aura-2 transition-colors duration-1000"
        style={{
          background: activeAura.secondary,
          opacity: isPlaying ? 0.9 : 0.55,
        }}
      />

      {/* Orb 3: Bottom Center Deep Ambient Glow */}
      <div
        className="absolute -bottom-40 left-1/3 w-[700px] h-[550px] rounded-full blur-[150px] transition-colors duration-1000"
        style={{
          background: activeAura.tertiary,
          opacity: isPlaying ? 0.85 : 0.5,
        }}
      />

      {/* Subtle Noise / Film Grain Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
