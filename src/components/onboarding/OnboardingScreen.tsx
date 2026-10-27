import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sparkles, Music, Check, ArrowRight } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const LANGUAGES = [
  { id: 'all', label: 'All Languages', desc: 'Pan-India & Global', emoji: '🌐' },
  { id: 'Hindi', label: 'Hindi', desc: 'Bollywood & Indie', emoji: '🇮🇳' },
  { id: 'Punjabi', label: 'Punjabi', desc: 'Bhangra & Pop Hits', emoji: '⚡' },
  { id: 'English', label: 'English', desc: 'Global Pop & Billboard', emoji: '🌍' },
  { id: 'Tamil', label: 'Tamil', desc: 'Kollywood & Melodies', emoji: '🌴' },
  { id: 'Telugu', label: 'Telugu', desc: 'Tollywood & Beats', emoji: '🌊' },
  { id: 'Malayalam', label: 'Malayalam', desc: 'Mollywood & Acoustic', emoji: '🥥' },
  { id: 'Urdu', label: 'Urdu', desc: 'Ghazals & Classical', emoji: '🌙' },
  { id: 'Bengali', label: 'Bengali', desc: 'Classics & Indie', emoji: '🌸' },
];

const GENRES = [
  { id: 'all', label: 'All Vibes', desc: 'Everything in catalog', emoji: '🌟' },
  { id: 'romantic', label: 'Romance & Love', desc: 'Heartfelt soulful hits', emoji: '💖' },
  { id: 'chill', label: 'Lo-Fi & Chill', desc: 'Midnight study & relaxation', emoji: '🎧' },
  { id: 'classical', label: 'Indian Classical', desc: 'Raagas & Instrumental', emoji: '🪔' },
  { id: 'devotional', label: 'Sufi & Devotional', desc: 'Inner peace & trance', emoji: '🕌' },
  { id: 'energetic', label: 'Party & Dance', desc: 'High-octane energetic beats', emoji: '⚡' },
  { id: 'nostalgic', label: '90s Nostalgia', desc: 'Evergreen golden memories', emoji: '📻' },
  { id: 'hiphop', label: 'Hip-Hop & Rap', desc: 'Desi flow & trap beats', emoji: '🔥' },
  { id: 'heartbreak', label: 'Heartbreak', desc: 'Deep emotional acoustics', emoji: '💔' },
  { id: 'monsoon', label: 'Rainy Day Acoustic', desc: 'Gentle morning acoustic', emoji: '☕' },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { setMusicPreferences } = useTheme();
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['all']);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['all']);

  const toggleLanguage = (id: string) => {
    if (id === 'all') {
      setSelectedLangs(['all']);
      return;
    }

    let next = selectedLangs.filter((l) => l !== 'all');
    if (next.includes(id)) {
      next = next.filter((l) => l !== id);
      if (next.length === 0) next = ['all'];
    } else {
      next.push(id);
    }
    setSelectedLangs(next);
  };

  const toggleAllLanguages = () => {
    if (selectedLangs.includes('all')) {
      setSelectedLangs(LANGUAGES.map((l) => l.id).filter((id) => id !== 'all'));
    } else {
      setSelectedLangs(['all']);
    }
  };

  const toggleGenre = (id: string) => {
    if (id === 'all') {
      setSelectedGenres(['all']);
      return;
    }

    let next = selectedGenres.filter((g) => g !== 'all');
    if (next.includes(id)) {
      next = next.filter((g) => g !== id);
      if (next.length === 0) next = ['all'];
    } else {
      next.push(id);
    }
    setSelectedGenres(next);
  };

  const toggleAllGenres = () => {
    if (selectedGenres.includes('all')) {
      setSelectedGenres(GENRES.map((g) => g.id).filter((id) => id !== 'all'));
    } else {
      setSelectedGenres(['all']);
    }
  };

  const handleFinish = (isExploreAll = false) => {
    if (isExploreAll) {
      setMusicPreferences(['all'], ['all']);
    } else {
      setMusicPreferences(selectedLangs, selectedGenres);
    }
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/95 backdrop-blur-2xl overflow-y-auto animate-fade-in select-none">
      <div className="relative w-full max-w-2xl my-auto rounded-[2.5rem] bg-surface/90 border border-border shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] p-6 sm:p-10 space-y-8">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 -mt-20 w-72 h-72 rounded-full bg-accent/20 blur-[100px] pointer-events-none" />

        {/* Brand Welcome Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Music className="w-7 h-7 text-white" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold uppercase tracking-wider mt-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalize Your Sanctuary</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            Welcome to GaanaSuno
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted max-w-md mx-auto">
            Choose your preferred languages and music tastes to customize your daily discovery
          </p>
        </div>

        {/* 1. Languages & Regions Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-foreground flex items-center gap-1.5">
                <span>Languages & Regions</span>
              </h2>
              <p className="text-[11px] text-foreground-muted">
                Select one or more languages you love
              </p>
            </div>

            <button
              type="button"
              onClick={toggleAllLanguages}
              className="text-xs font-bold text-accent hover:underline cursor-pointer"
            >
              {selectedLangs.includes('all') ? 'Customize' : 'Select All'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLangs.includes(lang.id) || selectedLangs.includes('all');
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => toggleLanguage(lang.id)}
                  className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-accent/10 border-accent text-foreground shadow-sm ring-1 ring-accent/30'
                      : 'bg-surface-subtle hover:bg-surface-hover border-border text-foreground-muted hover:text-foreground'
                  }`}
                >
                  <span className="text-xl shrink-0">{lang.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{lang.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
                    </div>
                    <span className="text-[10px] text-foreground-muted truncate block">
                      {lang.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Genres & Vibes Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-foreground flex items-center gap-1.5">
                <span>Music Vibes & Genres</span>
              </h2>
              <p className="text-[11px] text-foreground-muted">
                What music best fits your mood?
              </p>
            </div>

            <button
              type="button"
              onClick={toggleAllGenres}
              className="text-xs font-bold text-accent hover:underline cursor-pointer"
            >
              {selectedGenres.includes('all') ? 'Customize' : 'Select All'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {GENRES.map((genre) => {
              const isSelected = selectedGenres.includes(genre.id) || selectedGenres.includes('all');
              return (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => toggleGenre(genre.id)}
                  className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-accent/10 border-accent text-foreground shadow-sm ring-1 ring-accent/30'
                      : 'bg-surface-subtle hover:bg-surface-hover border-border text-foreground-muted hover:text-foreground'
                  }`}
                >
                  <span className="text-xl shrink-0">{genre.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{genre.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
                    </div>
                    <span className="text-[10px] text-foreground-muted truncate block">
                      {genre.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border">
          <button
            type="button"
            onClick={() => handleFinish(true)}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-surface-subtle hover:bg-surface-hover text-foreground-muted hover:text-foreground text-xs font-bold transition-all cursor-pointer"
          >
            Explore Everything (Skip)
          </button>

          <button
            type="button"
            onClick={() => handleFinish(false)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-accent hover:bg-accent-hover text-accent-foreground font-black text-xs uppercase tracking-wider shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            <span>Start Listening</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
