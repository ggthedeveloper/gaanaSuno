import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalCarouselProps {
  title: string;
  subtitle?: string;
  devanagariTitle?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({
  title,
  subtitle,
  devanagariTitle,
  icon,
  actionText,
  onAction,
  children,
  className = '',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [children]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const distance = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  };

  return (
    <section className={`relative group/carousel ${className}`}>
      {/* Header with Title & Arrow Controls */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            {icon && <span className="text-accent">{icon}</span>}
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
              {title}
            </h2>
            {devanagariTitle && (
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-subtle text-foreground-muted border border-white/5 font-hindi">
                {devanagariTitle}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-foreground-muted mt-0.5 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {actionText && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="text-xs font-bold text-accent hover:underline mr-1"
            >
              {actionText}
            </button>
          )}

          {/* Navigation Arrows */}
          <div className="hidden sm:flex items-center gap-1 bg-surface/50 p-1 rounded-full border border-white/5 backdrop-blur-md">
            <button
              type="button"
              aria-label={`Scroll ${title} left`}
              disabled={!canScrollLeft}
              onClick={() => scroll('left')}
              className="p-1.5 rounded-full hover:bg-surface-hover text-foreground-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              aria-label={`Scroll ${title} right`}
              disabled={!canScrollRight}
              onClick={() => scroll('right')}
              className="p-1.5 rounded-full hover:bg-surface-hover text-foreground-muted hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        tabIndex={0}
        aria-label={`${title} carousel`}
        className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth pb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-2xl"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {children}
      </div>
    </section>
  );
};
