import React, { useRef, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';
import { useTheme } from '../../context/ThemeContext';

interface AudioVisualizerProps {
  mode?: 'bars' | 'wave';
  className?: string;
  height?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  mode = 'bars',
  className = '',
  height = 64,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { getFrequencyData, isPlaying } = useAudio();
  const { preferences } = useTheme();

  useEffect(() => {
    if (!preferences.enableVisualizer) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const h = canvas.height;
      const freqData = getFrequencyData();

      ctx.clearRect(0, 0, width, h);

      if (mode === 'bars') {
        const barCount = 36;
        const barWidth = (width / barCount) * 0.68;
        const gap = (width / barCount) * 0.32;

        ctx.shadowBlur = 12;
        ctx.shadowColor = 'var(--accent)';

        for (let i = 0; i < barCount; i++) {
          const value = freqData[i] || 0;
          const percent = value / 255;
          const barHeight = Math.max(4, percent * h * 0.94);
          const x = i * (barWidth + gap);
          const y = h - barHeight;

          // Multi-stop gradient fill
          const grad = ctx.createLinearGradient(0, y, 0, h);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.2, 'var(--accent)');
          grad.addColorStop(1, 'rgba(249, 115, 22, 0.2)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 1, 1]);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      } else {
        // Wave mode
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'var(--accent)';

        const sliceWidth = width / freqData.length;
        let x = 0;

        for (let i = 0; i < freqData.length; i++) {
          const v = freqData[i] / 128.0;
          const y = (v * h) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, h / 2);
        ctx.stroke();
      }

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        // Draw resting state then stop
        cancelAnimationFrame(animationFrameId);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, getFrequencyData, mode, preferences.enableVisualizer]);

  if (!preferences.enableVisualizer) {
    return null;
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <canvas
        ref={canvasRef}
        width={360}
        height={height}
        className="w-full h-full block"
        aria-hidden="true"
      />
    </div>
  );
};
