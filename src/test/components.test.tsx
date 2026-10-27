import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { TrackCard } from '../components/music/TrackCard';
import { TrackRow } from '../components/music/TrackRow';
import { HorizontalCarousel } from '../components/music/HorizontalCarousel';
import { TRACKS } from '../data/catalog';
import { AudioProvider } from '../context/AudioContext';
import { LibraryProvider } from '../context/LibraryContext';
import { ThemeProvider } from '../context/ThemeContext';

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <LibraryProvider>
      <AudioProvider>{children}</AudioProvider>
    </LibraryProvider>
  </ThemeProvider>
);

describe('UI Components Rendering', () => {
  it('renders TrackCard with title, artist, and genre', () => {
    const track = TRACKS[0];
    render(
      <Providers>
        <TrackCard track={track} />
      </Providers>
    );

    expect(screen.getByText(track.title)).toBeInTheDocument();
    expect(screen.getByText(track.artist)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(track.genre))).toBeInTheDocument();
  });

  it('renders TrackRow with play button and duration', () => {
    const track = TRACKS[1];
    render(
      <Providers>
        <TrackRow track={track} index={0} />
      </Providers>
    );

    expect(screen.getByText(track.title)).toBeInTheDocument();
    expect(screen.getByText(track.artist)).toBeInTheDocument();
    expect(screen.getByLabelText(`Play ${track.title}`)).toBeInTheDocument();
  });

  it('renders HorizontalCarousel with title and controls', () => {
    render(
      <HorizontalCarousel title="Test Carousel" subtitle="Curated hits">
        <div>Item 1</div>
        <div>Item 2</div>
      </HorizontalCarousel>
    );

    expect(screen.getByText('Test Carousel')).toBeInTheDocument();
    expect(screen.getByText('Curated hits')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('renders full GaanaSuno application in English without crashing', () => {
    render(<App />);
    expect(screen.getAllByText(/GaanaSuno/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Beyond Taste/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Moment Mix/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Mood Discovery/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Search & Explore/i).length).toBeGreaterThan(0);
  });

  it('renders audio player footer with theme-adaptive surface styling', () => {
    render(<App />);
    const playerFooters = screen.getAllByRole('region', { name: /player/i });
    expect(playerFooters.length).toBeGreaterThan(0);
    const desktopFooter = playerFooters.find((f) => f.getAttribute('aria-label') === 'Audio Player');
    expect(desktopFooter).toBeDefined();
    expect(desktopFooter?.className).toContain('bg-surface/90');
    expect(desktopFooter?.className).not.toContain('bg-[#0a0c14]');
  });
});
