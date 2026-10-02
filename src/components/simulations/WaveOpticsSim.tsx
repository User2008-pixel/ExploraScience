import React, { useRef, useEffect } from 'react';
import { Formula } from '../common/Formula';
import { GraphViewer } from '../common/GraphViewer';
import { Waves } from 'lucide-react';

interface WaveOpticsSimProps {
  wavelengthNm: number; // nm (400 - 700)
  slitDistanceMm: number; // mm (0.1 - 1.0)
  screenDistanceM: number; // m (0.5 - 3.0)
}

export const WaveOpticsSim: React.FC<WaveOpticsSimProps> = ({
  wavelengthNm,
  slitDistanceMm,
  screenDistanceM,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const lambda = wavelengthNm * 1e-9;
  const d = slitDistanceMm * 1e-3;
  const D = screenDistanceM;

  // Fringe width beta = (lambda * D) / d in mm
  const fringeWidthMm = ((lambda * D) / d) * 1e3;

  // Convert wavelength to RGB color
  const wavelengthToColor = (wl: number): string => {
    if (wl >= 380 && wl < 440) return '#7e22ce'; // Violet
    if (wl >= 440 && wl < 490) return '#3b82f6'; // Blue
    if (wl >= 490 && wl < 560) return '#10b981'; // Green
    if (wl >= 560 && wl < 590) return '#eab308'; // Yellow
    if (wl >= 590 && wl < 635) return '#f97316'; // Orange
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
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#070b14';
    ctx.fillRect(0, 0, w, h);

    // Layout: Slit barrier on left, optical field in middle, screen on right
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
    ctx.fillText(`${wavelengthNm}nm`, 25, midY + 22);

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
    const viewSpanMm = 15; // ±15 mm from center

    for (let py = 0; py < screenH; py++) {
      const yMm = ((py - screenH / 2) / (screenH / 2)) * viewSpanMm;
      // Phase difference delta = 2*pi/lambda * (d * y / D)
      const phaseDiff = (2 * Math.PI * (d * (yMm * 1e-3))) / (lambda * D);
      // Intensity I = I0 * cos^2(delta / 2)
      const intensity = Math.pow(Math.cos(phaseDiff / 2), 2);

      // Render vertical line of the fringe
      ctx.fillStyle = `${laserColor}${Math.floor(intensity * 255)
        .toString(16)
        .padStart(2, '0')}`;
      ctx.fillRect(screenX + 2, 15 + py, 71, 1);
    }

    // Center fringe marker
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(screenX, midY);
    ctx.lineTo(screenX + 75, midY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'right';
    ctx.fillText('Central Fringe (m=0)', screenX - 6, midY + 3);
  }, [wavelengthNm, slitDistanceMm, screenDistanceM, laserColor, d, lambda, D]);

  return (
    <div className="space-y-4">
      {/* Visual Canvas */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Waves className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">Young's Double Slit Wavefront Interference</span>
        </div>

        <canvas ref={canvasRef} className="w-full h-64 sm:h-72 block" />

        {/* Telemetry Bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-500">Wavelength (λ): </span>
              <span className="font-bold" style={{ color: laserColor }}>{wavelengthNm}</span> nm
            </div>
            <div>
              <span className="text-slate-500">Slit Separation (d): </span>
              <span className="text-cyan-400 font-bold">{slitDistanceMm.toFixed(2)}</span> mm
            </div>
            <div>
              <span className="text-slate-500">Screen Distance (D): </span>
              <span className="text-amber-400 font-bold">{screenDistanceM.toFixed(1)}</span> m
            </div>
            <div>
              <span className="text-slate-500">Fringe Width (β): </span>
              <span className="text-emerald-400 font-bold">{fringeWidthMm.toFixed(2)}</span> mm
            </div>
          </div>
        </div>
      </div>

      {/* Optical Intensity Distribution Graph */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GraphViewer
          title="Fringe Intensity Profile: I(y) vs Position y"
          xLabel="y"
          yLabel="I / I_0"
          xUnit="mm"
          yUnit=""
          xDomain={[-8, 8]}
          yDomain={[0, 1.1]}
          curveFunction={(yMm) => {
            const phase = (2 * Math.PI * (d * (yMm * 1e-3))) / (lambda * D);
            return Math.pow(Math.cos(phase / 2), 2);
          }}
          curveColor={laserColor}
          height={160}
        />
        <GraphViewer
          title="Fringe Width vs Slit Separation: β vs d"
          xLabel="d"
          yLabel="\beta(d)"
          xUnit="mm"
          yUnit="mm"
          xDomain={[0.1, 1.0]}
          yDomain={[0, Math.ceil(((lambda * D) / (0.1 * 1e-3)) * 1e3 * 1.1)]}
          curveFunction={(dMm) => ((lambda * D) / (dMm * 1e-3)) * 1e3}
          currentMarker={{ x: slitDistanceMm, y: fringeWidthMm }}
          curveColor="#38bdf8"
          height={160}
        />
      </div>

      {/* KaTeX Mathematical Breakdown */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Wave Optics Equations</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Fringe Width Equation</div>
            <Formula tex={`\\beta = \\frac{\\lambda D}{d} = ${fringeWidthMm.toFixed(2)}\\text{ mm}`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Bright Fringe Maxima</div>
            <Formula tex="y_m = m \\frac{\\lambda D}{d} \\quad (m = 0, \\pm 1, \\pm 2)" />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Dark Fringe Minima</div>
            <Formula tex="y_n = \\left(n + \\frac{1}{2}\\right) \\frac{\\lambda D}{d}" />
          </div>
        </div>
      </div>
    </div>
  );
};
