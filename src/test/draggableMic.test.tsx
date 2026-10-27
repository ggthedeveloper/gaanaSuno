import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DraggableMicButton } from '../components/voice/DraggableMicButton';

describe('DraggableMicButton Component', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock window inner dimensions
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 768 });
  });

  it('renders the draggable mic button with accessibility attributes', () => {
    const handleClick = vi.fn();
    render(<DraggableMicButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /activate ai voice assistant/i });
    expect(button).toBeInTheDocument();
  });

  it('triggers onClick when tapped without dragging (distance < 5px)', () => {
    const handleClick = vi.fn();
    render(<DraggableMicButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /activate ai voice assistant/i });

    // Mock pointer capture methods
    button.setPointerCapture = vi.fn();
    button.releasePointerCapture = vi.fn();

    // Simulate simple tap/click
    fireEvent.pointerDown(button, { pointerId: 1, clientX: 200, clientY: 200 });
    fireEvent.pointerMove(button, { pointerId: 1, clientX: 202, clientY: 201 }); // 2px movement
    fireEvent.pointerUp(button, { pointerId: 1, clientX: 202, clientY: 201 });

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does NOT trigger onClick when dragged (distance > 5px)', () => {
    const handleClick = vi.fn();
    render(<DraggableMicButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /activate ai voice assistant/i });

    button.setPointerCapture = vi.fn();
    button.releasePointerCapture = vi.fn();

    // Simulate dragging 50px across
    fireEvent.pointerDown(button, { pointerId: 1, clientX: 200, clientY: 200 });
    fireEvent.pointerMove(button, { pointerId: 1, clientX: 250, clientY: 250 }); // 70px drag
    fireEvent.pointerUp(button, { pointerId: 1, clientX: 250, clientY: 250 });

    // Should NOT have triggered click
    expect(handleClick).not.toHaveBeenCalled();

    // Should have saved new position in localStorage
    const saved = localStorage.getItem('gaanasuno_mic_position');
    expect(saved).not.toBeNull();
  });

  it('restores position from localStorage on mount', () => {
    localStorage.setItem(
      'gaanasuno_mic_position',
      JSON.stringify({ x: 340, y: 420 })
    );

    const handleClick = vi.fn();
    render(<DraggableMicButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /activate ai voice assistant/i });
    expect(button.style.transform).toContain('translate3d(340px, 420px, 0)');
  });
});
