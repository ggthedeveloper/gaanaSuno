import React from 'react';
import { Track } from '../types/music';
import { BeyondTasteDiscovery } from '../components/music/BeyondTasteDiscovery';
import { Sparkles, Sliders, ShieldCheck, Compass } from 'lucide-react';

interface BeyondTasteViewProps {
  onSelectTrack: (track: Track) => void;
}

export const BeyondTasteView: React.FC<BeyondTasteViewProps> = ({ onSelectTrack }) => {
  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      {/* Editorial Hero Header */}
      <section className="relative overflow-hidden rounded-[2rem] p-6 sm:p-10 bg-gradient-to-br from-amber-500/10 via-surface to-surface border border-accent/25 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/15 blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Signature Differentiator</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            Beyond Your Taste <span className="text-gradient-accent">Discovery Engine</span>
          </h1>

          <p className="text-sm sm:text-base text-foreground-muted leading-relaxed font-medium">
            Explore music on your own terms with interactive discovery sliders and private on-device curation.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-foreground-muted">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-subtle border border-border">
              <Sliders className="w-3.5 h-3.5 text-accent" />
              <span>3 Discovery Levels</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-subtle border border-border">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Transparent Explanations</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-subtle border border-border">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>100% Local Privacy</span>
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Beyond Taste Console Component */}
      <BeyondTasteDiscovery onSelectTrack={onSelectTrack} />
    </div>
  );
};
