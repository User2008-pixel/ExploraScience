import React, { useRef, useEffect, useState } from 'react';
import { Formula } from '../common/Formula';
import { GraphViewer } from '../common/GraphViewer';
import { Waves, Sliders, RotateCcw, Zap } from 'lucide-react';

interface WaveOpticsSimProps {
  wavelengthNm?: number; // nm (380 - 750)
  slitDistanceMm?: number; // mm (0.1 - 1.0)
  screenDistanceM?: number; // m (0.5 - 3.0)
}

const LASER_PRESETS = [
  { name: 'Red He-Ne Laser', wl: 632.8, color: '#ef4444' },
  { name: 'Yellow Sodium D-line', wl: 589.0, color: '#eab308' },
  { name: 'Green DPSS Laser', wl: 532.0, color: '#10b981' },
  { name: 'Blue Diode Laser', wl: 450.0, color: '#3b82f6' },
  { name: 'Violet Laser', wl: 405.0, color: '#8b5cf6' },
];

export const WaveOpticsSim: React.FC<WaveOpticsSimProps> = ({
  wavelengthNm: propWl = 632.8,
  slitDistanceMm: propD = 0.25,
  screenDistanceM: propDist = 1.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [wavelengthNm, setWavelengthNm] = useState<number>(propWl);
  const [slitDistanceMm, setSlitDistanceMm] = useState<number>(propD);
  const [screenDistanceM, setScreenDistanceM] = useState<number>(propDist);

  const lambda = wavelengthNm * 1e-9;
  const d = slitDistanceMm * 1e-3;
  const D = screenDistanceM;

  // Fringe width beta = (lambda * D) / d in mm
  const fringeWidthMm = ((lambda * D) / d) * 1e3;

  // Convert wavelength to RGB color
  const wavelengthToColor = (wl: number): string => {
    if (wl >= 380 && wl < 440) return '#8b5cf6'; // Violet
    if (wl >= 440 && wl < 490) return '#3b82f6'; // Blue
    if (wl >= 490 && wl < 560) return '#10b981'; // Green
    if (wl >= 560 && wl < 595) return '#eab308'; // Yellow
    if (wl >= 595 && wl < 635) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const laserColor = wavelengthToColor(wavelengthNm);

  // Render optical interference pattern
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, w, h);

    const barrierX = 70;
    const screenX = w - 90;
    const midY = h / 2;

    // Laser Source Indicator
    ctx.fillStyle = laserColor;
    ctx.beginPath();
    ctx.arc(25, midY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${wavelengthNm.toFixed(0)}nm`, 25, midY + 22);

    // Laser beam to slit
    ctx.strokeStyle = laserColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(35, midY);
    ctx.lineTo(barrierX, midY);
    ctx.stroke();

    // Double Slit Barrier
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(barrierX - 4, 15, 8, h - 30);
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(barrierX - 4, 15, 8, h - 30);

    // Two Slits
    const slitPixelGap = Math.min(50, Math.max(12, slitDistanceMm * 40));
    ctx.fillStyle = '#070b14';
    ctx.fillRect(barrierX - 5, midY - slitPixelGap / 2 - 3, 10, 6);
    ctx.fillRect(barrierX - 5, midY + slitPixelGap / 2 - 3, 10, 6);

    ctx.fillStyle = laserColor;
    ctx.fillRect(barrierX - 2, midY - slitPixelGap / 2 - 2, 4, 4);
    ctx.fillRect(barrierX - 2, midY + slitPixelGap / 2 - 2, 4, 4);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '9px monospace';
    ctx.fillText(`d=${slitDistanceMm.toFixed(2)}mm`, barrierX, h - 6);

    // Wavefront semi-circular arcs emanating from slits
    ctx.strokeStyle = `${laserColor}44`;
    ctx.lineWidth = 1;
    for (let r = 20; r < screenX - barrierX; r += 24) {
      ctx.beginPath();
      ctx.arc(barrierX, midY - slitPixelGap / 2, r, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(barrierX, midY + slitPixelGap / 2, r, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
    }

    // Detector Screen on Right
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(screenX, 15, 75, h - 30);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(screenX, 15, 75, h - 30);

    // Draw interference intensity fringes along screen
    const screenH = h - 30;
    const viewSpanMm = 15;

    for (let py = 0; py < screenH; py++) {
      const yMm = ((py - screenH / 2) / (screenH / 2)) * viewSpanMm;
      const phaseDiff = (2 * Math.PI * (d * (yMm * 1e-3))) / (lambda * D);
      const intensity = Math.pow(Math.cos(phaseDiff / 2), 2);

      ctx.fillStyle = `${laserColor}${Math.floor(intensity * 255)
        .toString(16)
        .padStart(2, '0')}`;
      ctx.fillRect(screenX + 2, 15 + py, 71, 1);
    }

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Fringes', screenX + 37, 28);
  }, [wavelengthNm, slitDistanceMm, screenDistanceM, lambda, d, D, laserColor]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#070b14] shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-72 sm:h-80 block" />
      </div>

      {/* Direct Manipulation Sliders & Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Young&apos;s Double Slit Wave Interference Manipulator
            </h4>
          </div>
          <span className="text-xs text-cyan-400 font-mono font-bold bg-cyan-950/80 border border-cyan-800 px-2.5 py-0.5 rounded-full">
            Fringe Width (β): {fringeWidthMm.toFixed(2)} mm
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Laser Wavelength (λ):</span>
              <span className="font-mono font-bold text-sm" style={{ color: laserColor }}>
                {wavelengthNm.toFixed(1)} nm
              </span>
            </div>
            <input
              type="range"
              min="380"
              max="750"
              step="1"
              value={wavelengthNm}
              onChange={(e) => setWavelengthNm(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>380 nm (Violet)</span>
              <span>550 nm (Green)</span>
              <span>750 nm (Red)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Slit Separation (d):</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{slitDistanceMm.toFixed(2)} mm</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="1.00"
              step="0.02"
              value={slitDistanceMm}
              onChange={(e) => setSlitDistanceMm(parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.10 mm (Broad Fringes)</span>
              <span>0.50 mm</span>
              <span>1.00 mm (Dense)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">Screen Distance (D):</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{screenDistanceM.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.05"
              value={screenDistanceM}
              onChange={(e) => setScreenDistanceM(parseFloat(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.5 m</span>
              <span>1.5 m (Standard)</span>
              <span>3.0 m</span>
            </div>
          </div>
        </div>

        {/* Laser Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Laser Presets:</span>
            {LASER_PRESETS.map((lp) => (
              <button
                key={lp.name}
                onClick={() => setWavelengthNm(lp.wl)}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs transition border ${
                  Math.abs(wavelengthNm - lp.wl) < 1
                    ? 'bg-slate-800 font-bold border-cyan-400 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
                style={{ color: lp.color }}
              >
                {lp.name} ({lp.wl}nm)
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setWavelengthNm(632.8);
              setSlitDistanceMm(0.25);
              setScreenDistanceM(1.5);
            }}
            className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Fringe Width (β)</span>
          <div className="text-lg font-mono font-bold text-cyan-400">{fringeWidthMm.toFixed(2)} mm</div>
          <span className="text-[10px] text-slate-500">β = λD / d</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Slit Ratio (D / d)</span>
          <div className="text-lg font-mono font-bold text-amber-300">{(D / d).toFixed(0)}x</div>
          <span className="text-[10px] text-slate-500">Geometric magnification</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Angular Fringe Width (θ)</span>
          <div className="text-lg font-mono font-bold text-purple-400">
            {((lambda / d) * (180 / Math.PI)).toFixed(3)}°
          </div>
          <span className="text-[10px] text-slate-500">θ = λ / d</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Interference Law</span>
          <div className="mt-1">
            <Formula tex="\beta = \frac{\lambda D}{d} \quad I = 4I_0 \cos^2\left(\frac{\delta}{2}\right)" />
          </div>
        </div>
      </div>
    </div>
  );
};
