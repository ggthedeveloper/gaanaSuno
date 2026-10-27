import React, { useState } from 'react';
import { Track } from '../../types/music';
import { useAudio } from '../../context/AudioContext';
import { audioEngine } from '../../services/audioEngine';
import { formatTime } from '../../utils/formatters';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Disc3,
  Sparkles,
} from 'lucide-react';

interface TurntableDeckProps {
  track: Track | null;
  onSelectTrack?: (track: Track) => void;
}

export const TurntableDeck: React.FC<TurntableDeckProps> = ({ track }) => {
  const {
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
  } = useAudio();

  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isArmHovered, setIsArmHovered] = useState(false);

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    audioEngine.setPlaybackRate(speed);
  };

  // Calculate needle arm angle: resting at 0 deg, on record between 20 deg and 32 deg
  const progressRatio = duration > 0 ? currentTime / duration : 0;
  const armAngle = isPlaying ? 21 + progressRatio * 11 : isArmHovered ? 8 : 0;

  return (
    <div className="relative w-full rounded-[2.5rem] bg-gradient-to-br from-[#241711] via-[#1a100b] to-[#120a06] border-2 border-amber-900/60 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,200,120,0.15)] overflow-hidden select-none">
      {/* Sitar Mahogany Woodgrain Texture & Warm Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/10 via-transparent to-black/60 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-orange-600/10 blur-[100px] pointer-events-none" />

      {/* Brass Ornamental Inlay Border */}
      <div className="absolute inset-2.5 rounded-[2.2rem] border border-amber-600/25 pointer-events-none" />
      <div className="absolute top-4 left-4 text-amber-500/30 text-xs font-serif tracking-widest pointer-events-none">
        ✦ GHARANA SITAR VINYL DECK • घराना टर्नटेबल ✦
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-3">
        {/* Left / Center: Rotating Vinyl Platter with Brass Tonearm */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[320px] sm:min-h-[380px]">
          {/* Turntable Platter Recessed Well */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#0c0704] border-4 border-amber-700/40 shadow-[inset_0_8px_25px_rgba(0,0,0,0.9),0_10px_30px_rgba(0,0,0,0.7)] flex items-center justify-center">
            {/* Spinning Vinyl Record */}
            <div
              className="relative w-60 h-60 sm:w-76 sm:h-76 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-transform duration-500"
              onClick={togglePlay}
              title={isPlaying ? 'Pause Vinyl' : 'Spin Vinyl'}
              style={{
                background:
                  'repeating-radial-gradient(circle, #18181b 0px, #09090b 2px, #1c1917 4px, #09090b 6px)',
                animation: isPlaying ? 'spin 3.2s linear infinite' : 'none',
              }}
            >
              {/* Vinyl Grooves Specular Sheen (simulates light reflection across microgrooves) */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

              {/* Center Album Label */}
              <div className="relative w-24 h-24 sm:w-30 sm:h-30 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-inner flex items-center justify-center bg-gradient-to-tr from-amber-700 to-rose-900">
                {track?.coverUrl ? (
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Disc3 className="w-12 h-12 text-amber-300" />
                )}
                {/* Brass Center Spindle Hole */}
                <div className="absolute w-4 h-4 rounded-full bg-gradient-to-tr from-yellow-300 to-amber-600 border border-black shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-black/80" />
                </div>
              </div>
            </div>

            {/* Articulated Brass Tonearm */}
            <div
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 transition-transform duration-700 ease-out origin-top-right cursor-pointer"
              style={{
                transform: `rotate(${armAngle}deg)`,
              }}
              onMouseEnter={() => setIsArmHovered(true)}
              onMouseLeave={() => setIsArmHovered(false)}
              onClick={togglePlay}
              title={isPlaying ? 'Lift needle (Pause)' : 'Drop needle on record (Play)'}
            >
              {/* Tonearm Pivot Base */}
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-amber-300 via-amber-600 to-amber-900 border-2 border-yellow-200/50 shadow-lg flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-800 to-amber-400 border border-amber-950" />

                {/* Brass Arm Tube */}
                <div className="absolute top-6 right-5 w-2 sm:w-2.5 h-48 sm:h-56 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-700 rounded-full shadow-md origin-top">
                  {/* Cartridge & Needle Head */}
                  <div className="absolute -bottom-4 -left-2.5 w-6 h-10 bg-gradient-to-b from-zinc-800 to-black rounded border border-amber-400/80 shadow-md flex flex-col items-center justify-end pb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
                    <div className="w-0.5 h-2 bg-yellow-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RPM & Status Indicator */}
          <div className="mt-4 flex items-center gap-4 text-xs font-mono text-amber-400/70">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-amber-600/40'
                }`}
              />
              {isPlaying ? '33 ⅓ RPM • ROTATING' : 'STOPPED'}
            </span>
            <span>•</span>
            <span>NEEDLE {isPlaying ? 'ENGAGED' : 'RESTING'}</span>
          </div>
        </div>

        {/* Right: Track Information, Controls & Speed Slider */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          {/* Song Badge & Details */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Gharana Vinyl Master</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-amber-100 tracking-tight leading-tight">
              {track ? track.title : 'Select a Song'}
            </h2>
            <p className="text-base text-amber-300/80 font-medium font-devanagari mt-0.5">
              {track ? track.titleDevanagari : 'गीत चुनें'}
            </p>

            <p className="text-sm text-amber-200/60 mt-2 font-medium">
              {track ? `${track.artist} • ${track.album}` : 'No track loaded'}
            </p>
          </div>

          {/* Progress Bar & Seek */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400/80">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div
              className="relative h-2 w-full bg-black/60 rounded-full overflow-hidden cursor-pointer border border-amber-900/40"
              onClick={(e) => {
                if (duration <= 0) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                seek(pos * duration);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 rounded-full transition-all duration-150"
                style={{ width: `${progressRatio * 100}%` }}
              />
            </div>
          </div>

          {/* Tactile Controls: Back, Play/Pause, Next */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={previousTrack}
                className="w-11 h-11 rounded-2xl bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-700/40 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Previous Track"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 text-black font-black flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95 border-2 border-yellow-200/60"
                title={isPlaying ? 'Pause Record' : 'Play Record'}
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 fill-current" />
                ) : (
                  <Play className="w-7 h-7 fill-current ml-1" />
                )}
              </button>

              <button
                type="button"
                onClick={nextTrack}
                className="w-11 h-11 rounded-2xl bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-700/40 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Next Track"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Turntable Pitch Speed Selector */}
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-2xl border border-amber-700/30">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                Pitch:
              </span>
              {[0.8, 1.0, 1.2].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => handleSpeedChange(spd)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    playbackSpeed === spd
                      ? 'bg-amber-500 text-black shadow-sm'
                      : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-900/30'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
