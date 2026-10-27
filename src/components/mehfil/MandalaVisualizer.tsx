import React, { useEffect, useRef } from 'react';
import { Track } from '../../types/music';
import { useAudio } from '../../context/AudioContext';
import { audioEngine } from '../../services/audioEngine';
import { formatTime } from '../../utils/formatters';
import { Play, Pause, SkipBack, SkipForward, Sparkles, Music } from 'lucide-react';

interface MandalaVisualizerProps {
  track: Track | null;
}

export const MandalaVisualizer: React.FC<MandalaVisualizerProps> = ({ track }) => {
  const { isPlaying, currentTime, duration, togglePlay, nextTrack, previousTrack, seek } =
    useAudio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rotationAngle = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      const freqData = audioEngine.getFrequencyData();
      let energy = 0;
      for (let i = 0; i < 32; i++) energy += freqData[i];
      const avgEnergy = energy / (32 * 255); // 0 to 1

      if (isPlaying) {
        rotationAngle += 0.005 + avgEnergy * 0.01;
      }

      const baseRadius = Math.min(centerX, centerY) * 0.72;
      const pulseRadius = baseRadius + avgEnergy * 35;

      // Draw concentric glowing sacred circles
      ctx.save();
      ctx.translate(centerX, centerY);

      // Outer halo
      const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, pulseRadius + 30);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
      grad.addColorStop(0.5, 'rgba(234, 88, 12, 0.1)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, pulseRadius + 40, 0, Math.PI * 2);
      ctx.fill();

      // Draw 16 Petals of Lotus Mandala
      const petalCount = 16;
      ctx.rotate(rotationAngle);

      for (let i = 0; i < petalCount; i++) {
        const angle = (i * Math.PI * 2) / petalCount;
        const binIndex = i % freqData.length;
        const binValue = isPlaying ? freqData[binIndex] / 255 : 0.2;
        const petalLen = baseRadius * 0.45 + binValue * 45;

        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(petalLen * 0.5, -20, petalLen, 0);
        ctx.quadraticCurveTo(petalLen * 0.5, 20, 0, 0);

        ctx.strokeStyle = `hsla(${35 + i * 8}, 90%, 55%, ${0.35 + binValue * 0.45})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.fillStyle = `hsla(${35 + i * 8}, 85%, 50%, ${0.08 + binValue * 0.15})`;
        ctx.fill();
        ctx.restore();
      }

      // Draw Counter-rotating Sacred Inner Hexagram / Star of David (Anahata Heart Chakra)
      ctx.rotate(-rotationAngle * 1.8);
      const starRadius = baseRadius * 0.32 + avgEnergy * 15;
      for (let t = 0; t < 2; t++) {
        ctx.save();
        ctx.rotate(t * Math.PI);
        ctx.beginPath();
        for (let j = 0; j < 3; j++) {
          const a = (j * Math.PI * 2) / 3 - Math.PI / 2;
          const x = Math.cos(a) * starRadius;
          const y = Math.sin(a) * starRadius;
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying]);

  const progressRatio = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="relative w-full rounded-[2.5rem] bg-gradient-to-b from-[#180f1e] via-[#100914] to-[#08040a] border-2 border-purple-900/50 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden select-none">
      {/* Background Spectral Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-purple-600/5 to-transparent pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Canvas Mandala Visualizer */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[320px] sm:min-h-[380px]">
          <canvas
            ref={canvasRef}
            width={380}
            height={380}
            className="w-72 h-72 sm:w-96 sm:h-96"
          />

          {/* Central Chakra Disc Overlay */}
          <div
            className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer hover:scale-105 transition-transform"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {track?.coverUrl ? (
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-rose-700 flex items-center justify-center text-white font-black text-2xl">
                <Music className="w-8 h-8 text-white/90" />
              </div>
            )}
          </div>
        </div>

        {/* Right: Soundwave Info & Controls */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sacred Mandala Soundwave</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-amber-100 tracking-tight leading-tight">
              {track ? track.title : 'Harmonic Resonance'}
            </h2>
            <p className="text-sm text-purple-200/70 mt-1 font-medium">
              {track ? `${track.artist} • ${track.genre}` : 'Harmonic visual frequency'}
            </p>
          </div>

          {/* Scrubber */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-amber-300/80">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div
              className="relative h-2 w-full bg-black/60 rounded-full overflow-hidden cursor-pointer border border-purple-900/50"
              onClick={(e) => {
                if (duration <= 0) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                seek(pos * duration);
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-full transition-all duration-150"
                style={{ width: `${progressRatio * 100}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={previousTrack}
              className="w-12 h-12 rounded-2xl bg-purple-950/60 hover:bg-purple-900/80 text-amber-200 border border-purple-700/40 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={togglePlay}
              className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white font-black flex items-center justify-center shadow-lg shadow-rose-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95 border-2 border-amber-300/50"
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
              className="w-12 h-12 rounded-2xl bg-purple-950/60 hover:bg-purple-900/80 text-amber-200 border border-purple-700/40 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
