import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLibrary } from '../context/LibraryContext';
import { AccentColor, DensityMode, AnimationIntensity } from '../types/music';
import { getDiscoveryFeedback, resetDiscoverySignals } from '../services/discoveryEngine';
import {
  Sun,
  Moon,
  Laptop,
  Palette,
  Sliders,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Check,
  Lock,
  Trash2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    preferences,
    setTheme,
    setAccent,
    setDensity,
    setAnimationIntensity,
    setEnableAmbientGlow,
    setEnableVisualizer,
    resetPreferences,
  } = useTheme();

  const { likedTrackIds, recentlyPlayedTracks } = useLibrary();
  const [feedbackSignals, setFeedbackSignals] = useState(getDiscoveryFeedback);
  const [privacyToast, setPrivacyToast] = useState<string | null>(null);

  const handleResetTasteSignals = () => {
    resetDiscoverySignals();
    setFeedbackSignals({ moreLikeThisIds: [], notForMeIds: [] });
    setPrivacyToast('Beyond-Taste discovery signals have been reset to neutral.');
    setTimeout(() => setPrivacyToast(null), 3000);
  };

  const handleClearHistory = () => {
    try {
      localStorage.removeItem('gaanasuno_recent_history_v1');
      setPrivacyToast('Playback history cleared.');
      setTimeout(() => setPrivacyToast(null), 3000);
    } catch {
      // ignore
    }
  };

  const accentOptions: Array<{
    id: AccentColor;
    label: string;
    sublabel: string;
    hex: string;
  }> = [
    { id: 'saffron', label: 'Saffron Gold', sublabel: 'Signature Warm Amber', hex: '#f59e0b' },
    { id: 'rose', label: 'Rose Romance', sublabel: 'Bollywood Pink', hex: '#f43f5e' },
    { id: 'indigo', label: 'Royal Indigo', sublabel: 'Midnight Deep Blue', hex: '#6366f1' },
    { id: 'emerald', label: 'Emerald Sufi', sublabel: 'Spiritual Jade Green', hex: '#10b981' },
    { id: 'violet', label: 'Electric Violet', sublabel: 'Modern Desi Pop', hex: '#8b5cf6' },
  ];

  return (
    <div className="space-y-8 max-w-4xl pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Settings & Customization
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted mt-0.5">
            Personalize your GaanaSuno visual aesthetics and audio playback experience
          </p>
        </div>

        <button
          type="button"
          onClick={resetPreferences}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Theme Mode Selector (Dark / Light / System) */}
      <section className="bg-surface/60 p-5 rounded-2xl border border-border/60">
        <h3 className="font-bold text-base text-foreground flex items-center gap-2 mb-3">
          <Sun className="w-4 h-4 text-accent" />
          <span>Theme Mode</span>
        </h3>
        <p className="text-xs text-foreground-muted mb-4">
          Choose dark charcoal surfaces for midnight listening or clean high-contrast light mode.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'dark', label: 'Dark Mode', icon: Moon },
            { id: 'light', label: 'Light Mode', icon: Sun },
            { id: 'system', label: 'System Default', icon: Laptop },
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = preferences.theme === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={(e) => setTheme(mode.id as any, e)}
                className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border transition-all duration-300 cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-accent/15 border-accent text-accent font-bold shadow-md ring-1 ring-accent/30 scale-102'
                    : 'bg-surface hover:bg-surface-hover border-border/60 text-foreground-muted hover:text-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`} />
                <span className="text-xs">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Accent Color Palette */}
      <section className="bg-surface/60 p-5 rounded-2xl border border-border/60">
        <h3 className="font-bold text-base text-foreground flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-accent" />
          <span>Signature Accent Palette</span>
        </h3>
        <p className="text-xs text-foreground-muted mb-4">
          Select the signature accent color that highlights players, buttons, and musical badges.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {accentOptions.map((opt) => {
            const isSelected = preferences.accent === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAccent(opt.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-accent bg-accent/10 shadow-md scale-105'
                    : 'border-border/60 bg-surface hover:bg-surface-hover'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center text-white"
                  style={{ backgroundColor: opt.hex }}
                >
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground">{opt.label}</h4>
                  <p className="text-[10px] text-foreground-muted">{opt.sublabel}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Visual Density & Animations */}
      <section className="bg-surface/60 p-5 rounded-2xl border border-border/60 space-y-5">
        <div>
          <h3 className="font-bold text-base text-foreground flex items-center gap-2 mb-1">
            <Sliders className="w-4 h-4 text-accent" />
            <span>Layout Density & Spacing</span>
          </h3>
          <p className="text-xs text-foreground-muted mb-3">
            Adjust row padding and spacing between elements.
          </p>

          <div className="flex items-center gap-3">
            {[
              { id: 'comfortable' as DensityMode, label: 'Comfortable (Standard)' },
              { id: 'compact' as DensityMode, label: 'Compact (High Density)' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDensity(d.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  preferences.density === d.id
                    ? 'bg-accent text-accent-foreground border-accent font-bold'
                    : 'bg-surface hover:bg-surface-hover border-border text-foreground-muted'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border/50 pt-4">
          <h3 className="font-bold text-base text-foreground flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Animation Intensity</span>
          </h3>
          <p className="text-xs text-foreground-muted mb-3">
            Controls vinyl disc rotation speed, spring transitions, and interactive motion. Automatically respects OS reduced motion.
          </p>

          <div className="flex items-center gap-3">
            {(['reduced', 'balanced', 'expressive'] as AnimationIntensity[]).map((intensity) => (
              <button
                key={intensity}
                type="button"
                onClick={() => setAnimationIntensity(intensity)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                  preferences.animationIntensity === intensity
                    ? 'bg-accent text-accent-foreground border-accent font-bold'
                    : 'bg-surface hover:bg-surface-hover border-border text-foreground-muted'
                }`}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="border-t border-border/50 pt-4 space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-foreground block">
                Audio-Reactive Visualizer
              </span>
              <span className="text-[11px] text-foreground-muted">
                Render hardware-accelerated spectrum bars synchronized with playback.
              </span>
            </div>
            <input
              type="checkbox"
              checked={preferences.enableVisualizer}
              onChange={(e) => setEnableVisualizer(e.target.checked)}
              className="w-5 h-5 accent-accent rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-foreground block">
                Ambient Album Glow
              </span>
              <span className="text-[11px] text-foreground-muted">
                Display dynamic blurred ambient backlight matching the current track.
              </span>
            </div>
            <input
              type="checkbox"
              checked={preferences.enableAmbientGlow}
              onChange={(e) => setEnableAmbientGlow(e.target.checked)}
              className="w-5 h-5 accent-accent rounded cursor-pointer"
            />
          </label>
        </div>
      </section>

      {/* Privacy-First Personalization & Taste Signals Transparency */}
      <section className="bg-surface/60 p-5 sm:p-6 rounded-2xl border border-border/60 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" />
            <h3 className="font-extrabold text-base text-foreground">
              Privacy-First Personalization & Signals
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            100% Local Storage
          </span>
        </div>

        <p className="text-xs text-foreground-muted leading-relaxed">
          GaanaSuno operates entirely client-side. Your listening signals, liked tracks, custom playlists, and discovery feedback are stored securely in your device's browser/app storage. Zero telemetry is broadcast, no user profiles are sold, and zero emotional or mental health diagnoses are inferred.
        </p>

        {privacyToast && (
          <div className="p-3 rounded-xl bg-accent/15 border border-accent/30 text-accent text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{privacyToast}</span>
          </div>
        )}

        {/* Signal Inventory Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-surface-subtle border border-border text-center">
            <span className="text-lg font-black text-foreground block">{likedTrackIds.length}</span>
            <span className="text-[10px] text-foreground-muted font-medium">Liked Songs</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-subtle border border-border text-center">
            <span className="text-lg font-black text-foreground block">{recentlyPlayedTracks.length}</span>
            <span className="text-[10px] text-foreground-muted font-medium">History Entries</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-subtle border border-border text-center">
            <span className="text-lg font-black text-accent block">
              {feedbackSignals.moreLikeThisIds.length}
            </span>
            <span className="text-[10px] text-foreground-muted font-medium">"More" Signals</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-subtle border border-border text-center">
            <span className="text-lg font-black text-rose-500 block">
              {feedbackSignals.notForMeIds.length}
            </span>
            <span className="text-[10px] text-foreground-muted font-medium">"Not For Me" Excluded</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleResetTasteSignals}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-border text-xs font-bold text-foreground transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-accent" />
            <span>Reset Discovery Signals</span>
          </button>

          <button
            type="button"
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-border text-xs font-bold text-foreground transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Clear Playback History</span>
          </button>
        </div>
      </section>

      {/* Legal & Audio Attribution Section */}
      <section className="bg-surface-subtle p-5 rounded-2xl border border-border/50 text-xs text-foreground-muted space-y-2">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Legal Integrity & Audio Attribution</span>
        </div>
        <p className="leading-relaxed">
          GaanaSuno is committed to full music copyright compliance. All playable streams in this build are legally licensed Creative Commons acoustic samples and public domain traditional Indian classical ragas (SoundHelix CC BY 4.0 Audio & Wikimedia Open Commons).
        </p>
        <p className="leading-relaxed">
          Song titles and artist references are curated homages to celebrate Indian musical heritage and showcase responsive UI/UX architecture. No copyrighted audio streams are scraped or redistributed.
        </p>
      </section>
    </div>
  );
};
