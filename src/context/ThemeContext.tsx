import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { UserPreferences, AccentColor, DensityMode, AnimationIntensity } from '../types/music';
import { storage } from '../services/storage';

interface ThemeContextType {
  preferences: UserPreferences;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setAccent: (accent: AccentColor) => void;
  setDensity: (density: DensityMode) => void;
  setAnimationIntensity: (intensity: AnimationIntensity) => void;
  setEnableAmbientGlow: (enabled: boolean) => void;
  setEnableVisualizer: (enabled: boolean) => void;
  setPreferredLanguage: (lang: 'all' | 'Hindi' | 'Urdu' | 'Punjabi') => void;
  resetPreferences: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => storage.getPreferences());

  // Apply DOM attributes on preferences change
  useEffect(() => {
    const root = document.documentElement;

    // Theme (Dark / Light)
    if (preferences.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
      root.classList.toggle('light', !prefersDark);
    } else {
      root.classList.toggle('dark', preferences.theme === 'dark');
      root.classList.toggle('light', preferences.theme === 'light');
    }

    // Accent Color
    root.setAttribute('data-accent', preferences.accent);

    // Density
    root.setAttribute('data-density', preferences.density);

    // Save to storage
    storage.savePreferences(preferences);
  }, [preferences]);

  const setTheme = (theme: 'dark' | 'light' | 'system') => {
    setPreferences((prev) => ({ ...prev, theme }));
  };

  const setAccent = (accent: AccentColor) => {
    setPreferences((prev) => ({ ...prev, accent }));
  };

  const setDensity = (density: DensityMode) => {
    setPreferences((prev) => ({ ...prev, density }));
  };

  const setAnimationIntensity = (animationIntensity: AnimationIntensity) => {
    setPreferences((prev) => ({ ...prev, animationIntensity }));
  };

  const setEnableAmbientGlow = (enableAmbientGlow: boolean) => {
    setPreferences((prev) => ({ ...prev, enableAmbientGlow }));
  };

  const setEnableVisualizer = (enableVisualizer: boolean) => {
    setPreferences((prev) => ({ ...prev, enableVisualizer }));
  };

  const setPreferredLanguage = (preferredLanguage: 'all' | 'Hindi' | 'Urdu' | 'Punjabi') => {
    setPreferences((prev) => ({ ...prev, preferredLanguage }));
  };

  const resetPreferences = () => {
    const defaults = storage.getPreferences();
    setPreferences(defaults);
  };

  const value = useMemo(
    () => ({
      preferences,
      setTheme,
      setAccent,
      setDensity,
      setAnimationIntensity,
      setEnableAmbientGlow,
      setEnableVisualizer,
      setPreferredLanguage,
      resetPreferences,
    }),
    [preferences]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
