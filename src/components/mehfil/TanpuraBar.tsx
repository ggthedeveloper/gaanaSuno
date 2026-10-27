import React, { useState, useEffect } from 'react';
import {
  tanpuraEngine,
  TanpuraRoot,
  TanpuraTuning,
  TanpuraState,
} from '../../services/tanpuraEngine';
import { Volume2, VolumeX, Sparkles, Music2 } from 'lucide-react';

const ROOT_OPTIONS: TanpuraRoot[] = ['A#', 'C', 'C#', 'D', 'D#'];
const TUNING_OPTIONS: { id: TanpuraTuning; label: string; desc: string }[] = [
  { id: 'Pa', label: 'Pa (Pancham / 5th)', desc: 'Standard 5th note (Most ragas: Yaman, Bhairav, Bilawal)' },
  { id: 'Ma', label: 'Ma (Madhyam / 4th)', desc: 'Shuddha Ma 4th note (Malkauns, Bageshri, Lalit)' },
  { id: 'Ni', label: 'Ni (Nishad / 7th)', desc: 'Shuddha Ni 7th note (Marwa, Puriya, Sohini)' },
];

const STRING_NAMES = [
  { num: 1, name: 'Tuning Note', desc: '5th / 4th' },
  { num: 2, name: 'Tonic Sa', desc: 'Upper Tonic' },
  { num: 3, name: 'Tonic Sa', desc: 'Upper Tonic' },
  { num: 4, name: 'Bass Sa', desc: 'Root Fundamental' },
];

export const TanpuraBar: React.FC = () => {
  const [state, setState] = useState<TanpuraState>(tanpuraEngine.getState());

  useEffect(() => {
    const unsubscribe = tanpuraEngine.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface border border-border p-4 sm:p-5 shadow-lg transition-all">
      {/* Background ambient gold aura when tanpura is active */}
      {state.isPlaying && (
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 pointer-events-none animate-pulse" />
      )}

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Info & Master Drone Switch */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => tanpuraEngine.toggle()}
            className={`relative group shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center font-bold transition-all shadow-lg cursor-pointer ${
              state.isPlaying
                ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 text-white shadow-amber-500/30 ring-2 ring-amber-400 scale-105'
                : 'bg-surface-subtle text-foreground-muted hover:text-foreground hover:bg-surface-hover border border-border'
            }`}
            title={state.isPlaying ? 'Mute Tanpura Drone' : 'Start Acoustic Tanpura Drone'}
          >
            {state.isPlaying ? (
              <Sparkles className="w-6 h-6 animate-spin text-amber-100" style={{ animationDuration: '6s' }} />
            ) : (
              <Music2 className="w-6 h-6 text-foreground-muted group-hover:text-foreground" />
            )}
            {state.isPlaying && (
              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-surface animate-ping" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-extrabold text-foreground flex items-center gap-1.5">
                Acoustic Tanpura Drone
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  state.isPlaying
                    ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                    : 'bg-surface-subtle text-foreground-muted border border-border'
                }`}
              >
                {state.isPlaying ? 'Active Drone' : 'Muted'}
              </span>
            </div>
            <p className="text-xs text-foreground-muted mt-0.5">
              Procedural Web Audio acoustic resonance playing harmoniously alongside your music
            </p>
          </div>
        </div>

        {/* Center: 4 Strings Pluck Visualizer */}
        <div className="flex items-center gap-2.5 sm:gap-4 py-2 px-3 rounded-xl bg-surface-subtle border border-border">
          {STRING_NAMES.map((str, idx) => {
            const isCurrentlyPlucked = state.isPlaying && state.currentString === idx;
            return (
              <div
                key={str.num}
                className="flex flex-col items-center gap-1.5 min-w-[58px] sm:min-w-[68px]"
              >
                {/* String wire simulation */}
                <div className="relative w-full h-8 flex items-center justify-center">
                  <div
                    className={`w-full h-0.5 transition-all duration-300 ${
                      isCurrentlyPlucked
                        ? 'bg-amber-500 shadow-[0_0_12px_#f59e0b] scale-y-150 animate-pulse'
                        : state.isPlaying
                        ? 'bg-amber-500/40'
                        : 'bg-border'
                    }`}
                  />
                  {isCurrentlyPlucked && (
                    <span className="absolute w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping" />
                  )}
                </div>
                <div className="text-center">
                  <span
                    className={`text-[10px] font-bold block transition-colors ${
                      isCurrentlyPlucked ? 'text-amber-500' : 'text-foreground-muted'
                    }`}
                  >
                    String {str.num}
                  </span>
                  <span className="text-[9px] text-foreground-muted block">
                    {idx === 0 ? state.tuning : str.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Pitch Key, Tuning & Volume Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Root Pitch Key Picker */}
          <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-xl border border-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted px-2">
              Key:
            </span>
            {ROOT_OPTIONS.map((root) => (
              <button
                key={root}
                type="button"
                onClick={() => tanpuraEngine.setRoot(root)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  state.root === root
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-foreground-muted hover:text-foreground hover:bg-surface'
                }`}
              >
                {root}
              </button>
            ))}
          </div>

          {/* Tuning Picker (Pa / Ma / Ni) */}
          <div className="flex items-center gap-1 bg-surface-subtle p-1 rounded-xl border border-border">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted px-2">
              Tuning:
            </span>
            {TUNING_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => tanpuraEngine.setTuning(opt.id)}
                title={opt.desc}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  state.tuning === opt.id
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-foreground-muted hover:text-foreground hover:bg-surface'
                }`}
              >
                {opt.id}
              </button>
            ))}
          </div>

          {/* Tanpura Drone Volume Slider */}
          <div className="flex items-center gap-2 bg-surface-subtle px-3 py-1.5 rounded-xl border border-border">
            {state.volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-foreground-muted" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-500" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.volume}
              onChange={(e) => tanpuraEngine.setVolume(parseFloat(e.target.value))}
              className="w-16 sm:w-20 accent-amber-500 h-1.5 rounded-lg bg-border cursor-pointer"
              title={`Tanpura Drone Volume: ${Math.round(state.volume * 100)}%`}
            />
            <span className="text-[10px] font-mono text-foreground-muted w-6 text-right">
              {Math.round(state.volume * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
