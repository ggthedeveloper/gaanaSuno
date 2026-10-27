import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PlayingCardDeck } from '../components/music/PlayingCardDeck';
import { TRACKS } from '../data/catalog';

describe('PlayingCardDeck Component', () => {
  it('renders front card with currently playing track and Now Playing badge', () => {
    const handlePlay = vi.fn();
    const handleToggle = vi.fn();
    const handleSelect = vi.fn();

    const playingTrack = TRACKS[3]; // Tum Hi Ho

    render(
      <PlayingCardDeck
        currentTrack={playingTrack}
        isPlaying={true}
        onPlayTrack={handlePlay}
        onTogglePlay={handleToggle}
        onSelectTrack={handleSelect}
        catalog={TRACKS}
      />
    );

    // Front card should display Tum Hi Ho
    expect(screen.getByText('Tum Hi Ho')).toBeInTheDocument();
    expect(screen.getByText('Now Playing')).toBeInTheDocument();
  });

  it('renders spotlight track on front card when no track is currently playing', () => {
    const handlePlay = vi.fn();
    const handleToggle = vi.fn();
    const handleSelect = vi.fn();

    render(
      <PlayingCardDeck
        currentTrack={null}
        isPlaying={false}
        onPlayTrack={handlePlay}
        onTogglePlay={handleToggle}
        onSelectTrack={handleSelect}
        catalog={TRACKS}
      />
    );

    // Default top catalog track
    expect(screen.getByText(TRACKS[0].title)).toBeInTheDocument();
    expect(screen.getByText('Spotlight of the Day')).toBeInTheDocument();
  });

  it('renders background playing cards in the deck', () => {
    const handlePlay = vi.fn();
    const handleToggle = vi.fn();
    const handleSelect = vi.fn();

    render(
      <PlayingCardDeck
        currentTrack={TRACKS[0]}
        isPlaying={false}
        onPlayTrack={handlePlay}
        onTogglePlay={handleToggle}
        onSelectTrack={handleSelect}
        catalog={TRACKS}
      />
    );

    expect(screen.getByTitle(`Play "${TRACKS[1].title}"`)).toBeInTheDocument();
    expect(screen.getByTitle(`Play "${TRACKS[2].title}"`)).toBeInTheDocument();
    expect(screen.getByTitle(`Play "${TRACKS[3].title}"`)).toBeInTheDocument();
  });

  it('plays a background card track when clicked', () => {
    const handlePlay = vi.fn();
    const handleToggle = vi.fn();
    const handleSelect = vi.fn();

    render(
      <PlayingCardDeck
        currentTrack={TRACKS[0]}
        isPlaying={false}
        onPlayTrack={handlePlay}
        onTogglePlay={handleToggle}
        onSelectTrack={handleSelect}
        catalog={TRACKS}
      />
    );

    // Find the next card in queue
    const upNextCard = screen.getByRole('button', {
      name: new RegExp(`Play next in deck: ${TRACKS[1].title}`, 'i'),
    });
    expect(upNextCard).toBeInTheDocument();

    fireEvent.click(upNextCard);
    expect(handlePlay).toHaveBeenCalledWith(TRACKS[1]);
  });

  it('fans out cards on mouse enter and contracts on mouse leave', () => {
    const handlePlay = vi.fn();
    const handleToggle = vi.fn();
    const handleSelect = vi.fn();

    const { container } = render(
      <PlayingCardDeck
        currentTrack={TRACKS[0]}
        isPlaying={false}
        onPlayTrack={handlePlay}
        onTogglePlay={handleToggle}
        onSelectTrack={handleSelect}
        catalog={TRACKS}
      />
    );

    const deckWrapper = container.firstChild as HTMLElement;
    fireEvent.mouseEnter(deckWrapper);

    const upNextCard = screen.getByRole('button', {
      name: new RegExp(`Play next in deck: ${TRACKS[1].title}`, 'i'),
    });

    // The transform should reflect the fanned out position
    expect(upNextCard.style.transform).toContain('rotate(7deg)');

    fireEvent.mouseLeave(deckWrapper);
    expect(upNextCard.style.transform).toContain('rotate(4deg)');
  });
});
