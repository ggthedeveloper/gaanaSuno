import React, { useState, useEffect, useRef } from 'react';
import { Track } from '../../types/music';
import { useAudio } from '../../context/AudioContext';
import { audioEngine } from '../../services/audioEngine';
import { formatTime } from '../../utils/formatters';
import {
  Play,
  Pause,
  FastForward,
  Rewind,
  Square,
  Radio,
} from 'lucide-react';

interface CassetteDeckProps {
  track: Track | null;
}

export const CassetteDeck: React.FC<CassetteDeckProps> = ({ track }) => {
  const { isPlaying, currentTime, duration, togglePlay, nextTrack, previousTrack, seek } =
    useAudio();

  const [leftVu, setLeftVu] = useState(15);
  const [rightVu, setRightVu] = useState(15);
  const animFrameRef = useRef<number | null>(null);

  // Animate VU meter needles based on audio frequencies
  useEffect(() => {
    let active = true;

    const updateVu = () => {
      if (!active) return;

      if (isPlaying) {
        const freq = audioEngine.getFrequencyData();
        // Calculate bass energy (low bins) and mids energy
        let lowSum = 0;
        let midSum = 0;
        for (let i = 0; i < 8; i++) lowSum += freq[i];
        for (let i = 8; i < 24; i++) midSum += freq[i];

        const leftLevel = Math.min(85, Math.max(12, (lowSum / (8 * 255)) * 90 + Math.random() * 8));
        const rightLevel = Math.min(85, Math.max(12, (midSum / (16 * 255)) * 90 + Math.random() * 8));

        setLeftVu(leftLevel);
        setRightVu(rightLevel);
      } else {
        setLeftVu((prev) => Math.max(5, prev * 0.85));
        setRightVu((prev) => Math.max(5, prev * 0.85));
      }

      animFrameRef.current = requestAnimationFrame(updateVu);
    };

    animFrameRef.current = requestAnimationFrame(updateVu);

    return () => {
      active = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const progressRatio = duration > 0 ? currentTime / duration : 0;

  // Left tape spool radius shrinks from 28px to 14px; right spool grows from 14px to 28px
  const leftSpoolRadius = Math.max(14, 28 - progressRatio * 14);
  const rightSpoolRadius = Math.min(28, 14 + progressRatio * 14);

  return (
    <div className="relative w-full rounded-[2.5rem] bg-gradient-to-b from-[#1c1917] via-[#141210] to-[#0c0a09] border-2 border-stone-800 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden select-none">
      {/* Subtle brushed metal chassis overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-black/40 pointer-events-none" />

      {/* Header Deck Branding */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-800/80 mb-6">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-amber-500" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-stone-300">
            GAANASUNO STEREO CASSETTE DECK • K-90 GOLD SERIES
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-stone-400">
          <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-700">
            TYPE II CrO2
          </span>
          <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-amber-400">
            DOLBY B NR
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: The 90s Magnetic Cassette Tape */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Cassette Shell */}
          <div className="relative w-full max-w-md h-56 sm:h-64 rounded-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-stone-700/80 shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.1)] p-4 flex flex-col justify-between overflow-hidden">
            {/* Cassette Screws in Corners */}
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-stone-500 border border-stone-700" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-stone-500 border border-stone-700" />
            <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-stone-500 border border-stone-700" />
            <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-stone-500 border border-stone-700" />

            {/* Printed Paper Label on Cassette */}
            <div className="relative z-10 w-full rounded-xl bg-gradient-to-r from-amber-100 via-stone-200 to-amber-100 text-stone-900 p-3 shadow-md border border-stone-400 flex flex-col justify-between h-36">
              <div className="flex items-center justify-between border-b border-stone-400/60 pb-1">
                <span className="font-extrabold text-xs tracking-wider text-rose-700">
                  SIDE A • 45 MIN
                </span>
                <span className="font-black text-xs font-mono uppercase text-stone-800">
                  HINDI CLASSICS VOL. 1
                </span>
                <span className="font-bold text-[10px] bg-stone-800 text-white px-1.5 rounded">
                  HQ
                </span>
              </div>

              {/* Hand-written style song title line */}
              <div className="py-0.5">
                <p className="text-sm sm:text-base font-black truncate text-stone-900 tracking-tight">
                  {track ? track.title : 'Hindi Mehfil Gold'}
                </p>
                <p className="text-xs font-semibold text-stone-700 truncate">
                  {track ? `${track.artist} (${track.year})` : 'Arijit • Rahman • Nusrat'}
                </p>
              </div>

              {/* Transparent Viewing Window in Center */}
              <div className="relative w-full h-14 rounded-lg bg-black/85 border border-stone-600 shadow-inner flex items-center justify-around px-4 overflow-hidden">
                {/* Left Spool */}
                <div className="relative flex items-center justify-center">
                  {/* Brown magnetic tape thickness around left spool */}
                  <div
                    className="absolute rounded-full bg-[#5c3a21] border border-[#3d2412] transition-all duration-300"
                    style={{
                      width: `${leftSpoolRadius * 2}px`,
                      height: `${leftSpoolRadius * 2}px`,
                    }}
                  />
                  {/* Toothed white plastic gear */}
                  <div
                    className="relative z-10 w-8 h-8 rounded-full bg-stone-200 border-2 border-stone-400 flex items-center justify-center shadow"
                    style={{
                      animation: isPlaying ? 'spin 1.8s linear infinite' : 'none',
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-black/80" />
                    {/* Gear teeth spokes */}
                    <div className="absolute w-7 h-1 bg-stone-500 rounded" />
                    <div className="absolute w-1 h-7 bg-stone-500 rounded" />
                  </div>
                </div>

                {/* Tape Guide Window Meter in Center */}
                <div className="flex flex-col items-center justify-center gap-0.5 font-mono text-[9px] text-amber-400/80">
                  <div className="w-16 h-1 bg-stone-800 rounded relative overflow-hidden">
                    <div
                      className="h-full bg-amber-400"
                      style={{ width: `${progressRatio * 100}%` }}
                    />
                  </div>
                  <span>100 • 50 • 0</span>
                </div>

                {/* Right Spool */}
                <div className="relative flex items-center justify-center">
                  {/* Brown magnetic tape thickness around right spool */}
                  <div
                    className="absolute rounded-full bg-[#5c3a21] border border-[#3d2412] transition-all duration-300"
                    style={{
                      width: `${rightSpoolRadius * 2}px`,
                      height: `${rightSpoolRadius * 2}px`,
                    }}
                  />
                  {/* Toothed white plastic gear */}
                  <div
                    className="relative z-10 w-8 h-8 rounded-full bg-stone-200 border-2 border-stone-400 flex items-center justify-center shadow"
                    style={{
                      animation: isPlaying ? 'spin 1.8s linear infinite' : 'none',
                    }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-black/80" />
                    <div className="absolute w-7 h-1 bg-stone-500 rounded" />
                    <div className="absolute w-1 h-7 bg-stone-500 rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Cassette Lower Cutout & Magnetic Head */}
            <div className="relative z-10 flex items-center justify-center pt-2">
              <div className="w-28 h-4 bg-stone-800 rounded-t-lg border-t border-stone-600 flex items-center justify-center gap-3">
                <div className="w-3 h-2 bg-stone-400 rounded-sm" />
                <div className="w-5 h-2.5 bg-amber-400 rounded-sm shadow-sm" />
                <div className="w-3 h-2 bg-stone-400 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Time Counter */}
          <div className="mt-3 flex items-center gap-3 font-mono text-xs text-stone-400">
            <span className="px-2.5 py-1 rounded-lg bg-black border border-stone-800 text-amber-400 font-bold">
              TAPE COUNTER: {Math.floor(currentTime).toString().padStart(4, '0')}
            </span>
            <span>•</span>
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Dual Analog VU Meters & Mechanical Controls */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          {/* Dual Analog VU Meters with Warm Incandescent Amber Backlight */}
          <div className="p-4 rounded-2xl bg-black/70 border border-stone-800 shadow-inner space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase text-amber-400/80 font-bold">
              <span>ANALOG VU METERS</span>
              <span>PEAK LEVEL (dB)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Left Channel VU Meter */}
              <div className="relative h-24 rounded-xl bg-gradient-to-b from-[#2a1d0f] via-[#1a1107] to-black border border-amber-900/60 p-2 flex flex-col justify-between overflow-hidden shadow-[inset_0_2px_8px_rgba(255,180,50,0.15)]">
                {/* Backlight Amber Glow */}
                <div className="absolute inset-0 bg-amber-500/10 pointer-events-none" />

                {/* Printed dB Scale */}
                <div className="relative z-10 flex justify-between text-[8px] font-mono text-amber-300/80 px-1 border-b border-amber-600/30 pb-0.5">
                  <span>-20</span>
                  <span>-10</span>
                  <span>-5</span>
                  <span>0</span>
                  <span className="text-red-500 font-bold">+3</span>
                </div>

                {/* Bouncing Analog Needle Pivot */}
                <div className="relative w-full h-14 flex items-end justify-center">
                  <div
                    className="absolute bottom-0 w-0.5 h-12 bg-amber-200 shadow-[0_0_4px_#fef08a] origin-bottom transition-transform duration-75 ease-out"
                    style={{
                      transform: `rotate(${-45 + (leftVu / 100) * 90}deg)`,
                    }}
                  />
                  <div className="absolute -bottom-1 w-4 h-4 rounded-full bg-stone-700 border border-amber-400" />
                </div>

                <div className="relative z-10 text-center font-mono text-[9px] text-amber-400 font-bold">
                  LEFT (CH-1)
                </div>
              </div>

              {/* Right Channel VU Meter */}
              <div className="relative h-24 rounded-xl bg-gradient-to-b from-[#2a1d0f] via-[#1a1107] to-black border border-amber-900/60 p-2 flex flex-col justify-between overflow-hidden shadow-[inset_0_2px_8px_rgba(255,180,50,0.15)]">
                <div className="absolute inset-0 bg-amber-500/10 pointer-events-none" />

                <div className="relative z-10 flex justify-between text-[8px] font-mono text-amber-300/80 px-1 border-b border-amber-600/30 pb-0.5">
                  <span>-20</span>
                  <span>-10</span>
                  <span>-5</span>
                  <span>0</span>
                  <span className="text-red-500 font-bold">+3</span>
                </div>

                <div className="relative w-full h-14 flex items-end justify-center">
                  <div
                    className="absolute bottom-0 w-0.5 h-12 bg-amber-200 shadow-[0_0_4px_#fef08a] origin-bottom transition-transform duration-75 ease-out"
                    style={{
                      transform: `rotate(${-45 + (rightVu / 100) * 90}deg)`,
                    }}
                  />
                  <div className="absolute -bottom-1 w-4 h-4 rounded-full bg-stone-700 border border-amber-400" />
                </div>

                <div className="relative z-10 text-center font-mono text-[9px] text-amber-400 font-bold">
                  RIGHT (CH-2)
                </div>
              </div>
            </div>
          </div>

          {/* Mechanical Walkman Push Buttons */}
          <div className="pt-2">
            <span className="block text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-2 font-bold">
              MECHANICAL CONTROLS
            </span>

            <div className="grid grid-cols-5 gap-2">
              {/* Rewind */}
              <button
                type="button"
                onClick={previousTrack}
                className="flex flex-col items-center justify-center py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border-b-4 border-stone-950 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
                title="Rewind (Previous Track)"
              >
                <Rewind className="w-5 h-5" />
                <span className="text-[9px] font-mono mt-1 font-bold">REW</span>
              </button>

              {/* Play */}
              <button
                type="button"
                onClick={togglePlay}
                className={`flex flex-col items-center justify-center py-3 rounded-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer ${
                  isPlaying
                    ? 'bg-amber-600 text-stone-950 border-amber-900 font-black'
                    : 'bg-stone-800 hover:bg-stone-700 text-amber-400 border-stone-950 font-bold'
                }`}
                title="Play Tape"
              >
                <Play className="w-5 h-5 fill-current" />
                <span className="text-[9px] font-mono mt-1">PLAY</span>
              </button>

              {/* Pause */}
              <button
                type="button"
                onClick={togglePlay}
                className={`flex flex-col items-center justify-center py-3 rounded-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all cursor-pointer ${
                  !isPlaying
                    ? 'bg-amber-700/80 text-white border-amber-950'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-950'
                }`}
                title="Pause Tape"
              >
                <Pause className="w-5 h-5" />
                <span className="text-[9px] font-mono mt-1 font-bold">PAUSE</span>
              </button>

              {/* Fast Forward */}
              <button
                type="button"
                onClick={nextTrack}
                className="flex flex-col items-center justify-center py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border-b-4 border-stone-950 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
                title="Fast Forward (Next Track)"
              >
                <FastForward className="w-5 h-5" />
                <span className="text-[9px] font-mono mt-1 font-bold">FF</span>
              </button>

              {/* Stop / Eject */}
              <button
                type="button"
                onClick={() => {
                  if (isPlaying) togglePlay();
                  seek(0);
                }}
                className="flex flex-col items-center justify-center py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border-b-4 border-stone-950 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
                title="Stop Tape & Rewind to Start"
              >
                <Square className="w-5 h-5" />
                <span className="text-[9px] font-mono mt-1 font-bold">STOP</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
