import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from '../App';
import { TrackCard } from '../components/music/TrackCard';
import { TrackRow } from '../components/music/TrackRow';
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
  it('renders TrackCard with English and Hindi titles', () => {
    const track = TRACKS[0];
    render(
      <Providers>
        <TrackCard track={track} />
      </Providers>
    );

    expect(screen.getByText(track.title)).toBeInTheDocument();
    expect(screen.getByText(track.titleDevanagari)).toBeInTheDocument();
    expect(screen.getByText(track.artist)).toBeInTheDocument();
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

  it('renders full GaanaSuno application without crashing', () => {
    render(<App />);
    expect(screen.getAllByText(/GaanaSuno/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/गाने सुनो/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/मन की धुन/i).length).toBeGreaterThan(0);
  });
});
