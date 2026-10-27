import React, { useState, useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { Mic } from 'lucide-react';

interface DraggableMicButtonProps {
  onClick: () => void;
  className?: string;
}

const STORAGE_KEY = 'gaanasuno_mic_position';
const BUTTON_SIZE = 52; // 52px button size
const MARGIN = 12; // 12px margin from screen edges

export const DraggableMicButton: React.FC<DraggableMicButtonProps> = ({ onClick, className = '' }) => {
  // Check if running on Android / iOS mobile platform or mobile viewport
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isCapacitorNative = Capacitor.isNativePlatform();
    const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isSmallScreen = window.innerWidth < 768;
    return isCapacitorNative || isMobileDevice || isSmallScreen;
  });

  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const wasDraggingRef = useRef(false);
  const lastPointerTapTimeRef = useRef(0);
  const dragStartRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    hasMoved: boolean;
  } | null>(null);

  // Re-check mobile platform status on resize / orientation change
  useEffect(() => {
    const checkIsMobile = () => {
      const isCapacitorNative = Capacitor.isNativePlatform();
      const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isCapacitorNative || isMobileDevice || isSmallScreen);
    };

    window.addEventListener('resize', checkIsMobile);
    window.addEventListener('orientationchange', checkIsMobile);
    return () => {
      window.removeEventListener('resize', checkIsMobile);
      window.removeEventListener('orientationchange', checkIsMobile);
    };
  }, []);

  // Compute safe boundaries based on current window size
  const getClampedPosition = (x: number, y: number) => {
    if (typeof window === 'undefined') return { x, y };
    const maxX = Math.max(MARGIN, window.innerWidth - BUTTON_SIZE - MARGIN);
    const maxY = Math.max(MARGIN, window.innerHeight - BUTTON_SIZE - MARGIN);
    return {
      x: Math.max(MARGIN, Math.min(maxX, x)),
      y: Math.max(MARGIN, Math.min(maxY, y)),
    };
  };

  // Always initialize to original default position on page load / refresh
  useEffect(() => {
    const calculateDefaultPosition = () => {
      const defaultX = window.innerWidth - BUTTON_SIZE - 20;
      const defaultY = window.innerHeight - BUTTON_SIZE - 120;
      return getClampedPosition(defaultX, defaultY);
    };

    // Clear any legacy persisted position so refresh always resets to original default position
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    setPosition(calculateDefaultPosition());
  }, []);

  // Handle window resize or orientation change so the mic stays in bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => (prev ? getClampedPosition(prev.x, prev.y) : null));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!position) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const clientX = e.clientX ?? 0;
    const clientY = e.clientY ?? 0;

    dragStartRef.current = {
      pointerId: e.pointerId ?? 0,
      startX: clientX,
      startY: clientY,
      initialX: position.x,
      initialY: position.y,
      hasMoved: false,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragStartRef.current;
    if (!drag) return;
    if (e.pointerId !== undefined && drag.pointerId !== e.pointerId) return;

    const clientX = e.clientX ?? 0;
    const clientY = e.clientY ?? 0;

    const deltaX = clientX - drag.startX;
    const deltaY = clientY - drag.startY;

    // Only mark as moved if dragged more than 10px (prevents jitter on simple clicks or finger placement)
    if (!drag.hasMoved && Math.hypot(deltaX, deltaY) > 10) {
      drag.hasMoved = true;
      wasDraggingRef.current = true;
    }

    if (drag.hasMoved) {
      const targetX = drag.initialX + deltaX;
      const targetY = drag.initialY + deltaY;
      setPosition(getClampedPosition(targetX, targetY));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragStartRef.current;
    if (!drag) return;
    if (e.pointerId !== undefined && drag.pointerId !== e.pointerId) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    setIsDragging(false);

    const clientX = e.clientX ?? drag.startX;
    const clientY = e.clientY ?? drag.startY;

    if (drag.hasMoved) {
      // User dragged it — update position in state without saving to localStorage so refresh resets to default
      const finalPos = getClampedPosition(
        drag.initialX + (clientX - drag.startX),
        drag.initialY + (clientY - drag.startY)
      );
      setPosition(finalPos);

      setTimeout(() => {
        wasDraggingRef.current = false;
      }, 150);
    } else {
      // It was a tap/click!
      lastPointerTapTimeRef.current = Date.now();
      onClick();
    }

    dragStartRef.current = null;
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (wasDraggingRef.current || Date.now() - lastPointerTapTimeRef.current < 400) {
      e.preventDefault();
      return;
    }
    onClick();
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const defaultX = window.innerWidth - BUTTON_SIZE - 20;
    const defaultY = window.innerHeight - BUTTON_SIZE - 120;
    setPosition(getClampedPosition(defaultX, defaultY));
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    setIsDragging(false);
    wasDraggingRef.current = false;
    dragStartRef.current = null;
  };

  // Completely remove / do not render floating mic on Android & iOS mobile devices or mobile viewports
  if (isMobile || !position) return null;

  return (
    <div
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none',
        width: `${BUTTON_SIZE}px`,
        height: `${BUTTON_SIZE}px`,
      }}
      className={`fixed top-0 left-0 z-50 select-none ${className}`}
    >
      <button
        type="button"
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        aria-label="Activate AI Voice Assistant (Draggable anywhere on screen)"
        title="Voice Assistant (Drag anywhere or double-click to reset position)"
        className={`relative w-full h-full rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 text-white shadow-[0_8px_25px_rgba(245,158,11,0.4)] hover:shadow-[0_12px_32px_rgba(245,158,11,0.6)] flex items-center justify-center border-2 border-amber-300/80 transition-all select-none ${
          isDragging
            ? 'cursor-grabbing shadow-[0_16px_40px_rgba(245,158,11,0.7)]'
            : 'cursor-grab hover:scale-105 active:scale-95 duration-150'
        }`}
      >
        {/* Soft Static Ambient Aura Glow (Zero vibration/ping) */}
        <span className="absolute -inset-1 rounded-full bg-amber-500/25 blur-md pointer-events-none -z-10" />

        {/* Center Microphone Icon */}
        <Mic className="relative z-10 w-5 h-5 pointer-events-none" />
      </button>
    </div>
  );
};
