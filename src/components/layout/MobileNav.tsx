import React from 'react';
import { Home, Compass, Sparkles, Library, Flame } from 'lucide-react';
import { NavRoute } from './Sidebar';

interface MobileNavProps {
  currentRoute: NavRoute;
  onNavigate: (route: NavRoute) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentRoute, onNavigate }) => {
  const tabs = [
    { id: 'home' as NavRoute, label: 'Home', icon: Home },
    { id: 'mehfil' as NavRoute, label: 'Mehfil 🪔', icon: Flame },
    { id: 'search' as NavRoute, label: 'Search', icon: Compass },
    { id: 'moods' as NavRoute, label: 'Moods', icon: Sparkles },
    { id: 'library' as NavRoute, label: 'Library', icon: Library },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Mobile navigation"
      className="md:hidden fixed bottom-[68px] left-0 right-0 z-30 bg-surface/95 backdrop-blur-xl border-t border-border/80 px-2 py-1.5 flex items-center justify-around select-none"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentRoute === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-accent font-bold scale-105'
                : 'text-foreground-muted hover:text-foreground'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : ''}`} />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
