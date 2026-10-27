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

  it('does NOT trigger onClick when dragged (distance > 5px) and updates position in session', () => {
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

    // Does NOT persist in localStorage across page refreshes
    const saved = localStorage.getItem('gaanasuno_mic_position');
    expect(saved).toBeNull();
  });

  it('resets to original default position on refresh / initial mount', () => {
    // Even if legacy storage had a value, it clears it and resets to default position
    localStorage.setItem(
      'gaanasuno_mic_position',
      JSON.stringify({ x: 340, y: 420 })
    );

    const handleClick = vi.fn();
    render(<DraggableMicButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /activate ai voice assistant/i });
    // Default position on 1024x768 screen: x = 1024 - 52 - 20 = 952, y = 768 - 52 - 120 = 596
    expect(button.parentElement?.style.transform).toContain('translate3d(952px, 596px, 0)');
    // Legacy storage should be removed
    expect(localStorage.getItem('gaanasuno_mic_position')).toBeNull();
  });

  it('resets to default position on double click', () => {
    const handleClick = vi.fn();
    render(<DraggableMicButton onClick={handleClick} />);

    const button = screen.getByRole('button', { name: /activate ai voice assistant/i });
    button.setPointerCapture = vi.fn();
    button.releasePointerCapture = vi.fn();

    // Drag to new position
    fireEvent.pointerDown(button, { pointerId: 1, clientX: 200, clientY: 200 });
    fireEvent.pointerMove(button, { pointerId: 1, clientX: 300, clientY: 300 });
    fireEvent.pointerUp(button, { pointerId: 1, clientX: 300, clientY: 300 });

    // Double click resets to original default
    fireEvent.doubleClick(button);
    expect(button.parentElement?.style.transform).toContain('translate3d(952px, 596px, 0)');
  });

  it('does NOT render on mobile screens (< 768px) or mobile devices', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    const handleClick = vi.fn();
    render(<DraggableMicButton onClick={handleClick} />);

    const button = screen.queryByRole('button', { name: /activate ai voice assistant/i });
    expect(button).toBeNull();
  });
});
