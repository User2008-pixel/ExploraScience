import React, { useRef, useEffect, useState } from 'react';
import { Formula } from '../common/Formula';
import { Sliders, RotateCcw, Compass, Sun, Zap, ArrowRightLeft } from 'lucide-react';

interface RayOpticsSimProps {
  angle1?: number; // Incident angle in degrees (0 to 85)
  n1?: number; // Refractive index of medium 1 (e.g. 1.0 Air)
  n2?: number; // Refractive index of medium 2 (e.g. 1.33 Water, 1.5 Glass, 2.42 Diamond)
}

const MEDIA_PRESETS = [
  { name: 'Air / Vacuum', n: 1.0 },
  { name: 'Water', n: 1.333 },
  { name: 'Crown Glass', n: 1.52 },
  { name: 'Flint Glass', n: 1.66 },
  { name: 'Diamond', n: 2.42 },
];

export const RayOpticsSim: React.FC<RayOpticsSimProps> = ({
  angle1: propAngle = 45,
  n1: propN1 = 1.0,
  n2: propN2 = 1.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct interactive manipulation state
  const [angle1, setAngle1] = useState<number>(propAngle);
  const [n1, setN1] = useState<number>(propN1);
  const [n2, setN2] = useState<number>(propN2);
  const [showProtractor, setShowProtractor] = useState<boolean>(true);
  const isDraggingRay = useRef<boolean>(false);

  // Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
  const rad1 = (angle1 * Math.PI) / 180;
  const sin2 = (n1 / n2) * Math.sin(rad1);
  const isTotalInternalReflection = sin2 > 1.0;
  const rad2 = isTotalInternalReflection ? 0 : Math.asin(sin2);
  const angle2 = (rad2 * 180) / Math.PI;

  // Critical angle if n1 > n2: theta_c = asin(n2 / n1)
  const hasCriticalAngle = n1 > n2;
  const criticalAngleDeg = hasCriticalAngle ? (Math.asin(n2 / n1) * 180) / Math.PI : null;

  // Canvas mouse handle for direct dragging of the incident ray
  const handleCanvasInteraction = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width * 0.5;
    const cy = rect.height * 0.5;
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    // Angle relative to normal (normal points up in medium 1)
    const dx = cx - mouseX; // ray comes from left
    const dy = cy - mouseY; // positive if above boundary

    if (dy > 0 && dx > 0) {
      let deg = (Math.atan2(dx, dy) * 180) / Math.PI;
      deg = Math.max(1, Math.min(88, deg));
      setAngle1(Math.round(deg));
    }
  };

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
    ctx.save();
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Medium 1 (Top)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h * 0.5);

    // Medium 2 (Bottom)
    const med2Grad = ctx.createLinearGradient(0, h * 0.5, 0, h);
    med2Grad.addColorStop(0, '#0c2340');
    med2Grad.addColorStop(1, '#071626');
    ctx.fillStyle = med2Grad;
    ctx.fillRect(0, h * 0.5, w, h * 0.5);

    // Interface boundary
    ctx.beginPath();
    ctx.moveTo(0, h * 0.5);
    ctx.lineTo(w, h * 0.5);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Normal line (dashed vertical)
    const centerX = w * 0.5;
    const centerY = h * 0.5;

    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(centerX, 20);
    ctx.lineTo(centerX, h - 20);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Optional Protractor arc
    if (showProtractor) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, 70, Math.PI, 0);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 70, 0, Math.PI);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Medium labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Medium 1: n₁ = ${n1.toFixed(3)}`, 20, 30);
    ctx.fillText(`Medium 2: n₂ = ${n2.toFixed(3)}`, 20, h * 0.5 + 30);

    // Incident Ray (comes from top-left towards center)
    const rayLength = Math.min(w, h) * 0.44;
    const incStartX = centerX - rayLength * Math.sin(rad1);
    const incStartY = centerY - rayLength * Math.cos(rad1);

    ctx.beginPath();
    ctx.moveTo(incStartX, incStartY);
    ctx.lineTo(centerX, centerY);
    ctx.strokeStyle = '#facc15'; // bright yellow incident ray
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Drag handle circle on the incident ray start
    ctx.beginPath();
    ctx.arc(incStartX, incStartY, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Drag Ray ➔', incStartX - 10, incStartY + 4);

    // Angle 1 arc & label
    ctx.beginPath();
    ctx.arc(centerX, centerY, 42, -Math.PI / 2 - rad1, -Math.PI / 2);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    const labelAngle1Rad = -Math.PI / 2 - rad1 * 0.5;
    ctx.fillText(`θ₁=${angle1}°`, centerX + 56 * Math.cos(labelAngle1Rad), centerY + 56 * Math.sin(labelAngle1Rad));

    // Reflected Ray (always present by Fresnel reflection; 100% in TIR)
    const refEndX = centerX + rayLength * Math.sin(rad1);
    const refEndY = centerY - rayLength * Math.cos(rad1);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(refEndX, refEndY);
    ctx.strokeStyle = isTotalInternalReflection ? '#facc15' : 'rgba(250, 204, 21, 0.45)';
    ctx.lineWidth = isTotalInternalReflection ? 3.5 : 1.5;
    ctx.stroke();

    // Refracted / Transmitted Ray into Medium 2
    if (!isTotalInternalReflection) {
      const refrEndX = centerX + rayLength * Math.sin(rad2);
      const refrEndY = centerY + rayLength * Math.cos(rad2);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(refrEndX, refrEndY);
      ctx.strokeStyle = '#38bdf8'; // blue refracted ray
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Angle 2 arc & label
      ctx.beginPath();
      ctx.arc(centerX, centerY, 42, Math.PI / 2 - rad2, Math.PI / 2);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      const labelAngle2Rad = Math.PI / 2 - rad2 * 0.5;
      ctx.fillText(`θ₂=${angle2.toFixed(1)}°`, centerX + 56 * Math.cos(labelAngle2Rad), centerY + 56 * Math.sin(labelAngle2Rad));
    } else {
      // TIR Banner
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ TOTAL INTERNAL REFLECTION (θ₁ > θ_crit) ⚡', centerX, centerY + 55);
      ctx.fillStyle = '#fca5a5';
      ctx.font = '11px sans-serif';
      ctx.fillText(`All radiant energy reflects back into Medium 1 (θ_crit = ${criticalAngleDeg?.toFixed(1)}°)`, centerX, centerY + 75);
    }

    ctx.restore();
  }, [angle1, n1, n2, rad1, rad2, isTotalInternalReflection, angle2, criticalAngleDeg, showProtractor]);

  return (
    <div className="space-y-4">
      {/* Visual Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-2xl">
        <canvas
          ref={canvasRef}
          className="w-full h-80 block cursor-crosshair"
          onMouseDown={(e) => {
            isDraggingRay.current = true;
            handleCanvasInteraction(e.clientX, e.clientY);
          }}
          onMouseMove={(e) => {
            if (!isDraggingRay.current) return;
            handleCanvasInteraction(e.clientX, e.clientY);
          }}
          onMouseUp={() => {
            isDraggingRay.current = false;
          }}
          onMouseLeave={() => {
            isDraggingRay.current = false;
          }}
          onTouchMove={(e) => {
            if (e.touches.length === 1) {
              handleCanvasInteraction(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
        />

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setShowProtractor(!showProtractor)}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
          >
            {showProtractor ? 'Hide Protractor' : 'Show Protractor'}
          </button>
          <button
            onClick={() => {
              setAngle1(45);
              setN1(1.0);
              setN2(1.5);
            }}
            className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Direct Manipulation Sliders & Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Ray Optics & Snell&apos;s Law Direct Manipulator
            </h4>
          </div>
          <span className="text-xs text-yellow-400 font-mono font-bold bg-yellow-950/80 border border-yellow-800 px-2.5 py-0.5 rounded-full">
            {isTotalInternalReflection ? 'Total Internal Reflection' : `Refraction: θ₂ = ${angle2.toFixed(1)}°`}
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Incident Angle Slider */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-yellow-300 font-medium">Incident Angle (θ₁):</span>
              <span className="font-mono font-bold text-yellow-400 text-sm">{angle1}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="88"
              step="1"
              value={angle1}
              onChange={(e) => setAngle1(parseInt(e.target.value))}
              className="w-full accent-yellow-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0° (Normal)</span>
              <span>45°</span>
              <span>88° (Grazing)</span>
            </div>
          </div>

          {/* Medium 1 Refractive Index */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Medium 1 Index (n₁):</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{n1.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.01"
              value={n1}
              onChange={(e) => setN1(parseFloat(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1.00 (Air)</span>
              <span>1.50 (Glass)</span>
              <span>2.42 (Diamond)</span>
            </div>
          </div>

          {/* Medium 2 Refractive Index */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Medium 2 Index (n₂):</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{n2.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.5"
              step="0.01"
              value={n2}
              onChange={(e) => setN2(parseFloat(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1.00 (Air)</span>
              <span>1.50 (Glass)</span>
              <span>2.42 (Diamond)</span>
            </div>
          </div>
        </div>

        {/* Quick Optical Media Presets & TIR Flip */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Presets:</span>
            <button
              onClick={() => {
                setN1(1.0);
                setN2(1.52);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 transition"
            >
              Air → Glass (n=1.52)
            </button>
            <button
              onClick={() => {
                setN1(1.0);
                setN2(1.333);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition"
            >
              Air → Water (n=1.33)
            </button>
            <button
              onClick={() => {
                setN1(1.52);
                setN2(1.0);
                setAngle1(50);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold transition flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              Glass → Air TIR (θ_crit = 41.1°)
            </button>
          </div>

          <button
            onClick={() => {
              const temp = n1;
              setN1(n2);
              setN2(temp);
            }}
            className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-3 h-3 text-cyan-400" />
            Swap Media (n₁ ⇄ n₂)
          </button>
        </div>
      </div>

      {/* Numerical Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Incident Angle (θ₁)</span>
          <div className="text-lg font-mono font-bold text-yellow-400">{angle1}°</div>
          <span className="text-[10px] text-slate-500">Normal: 0° | Boundary: 90°</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Refracted Angle (θ₂)</span>
          <div className="text-lg font-mono font-bold text-sky-400">
            {isTotalInternalReflection ? 'TIR (No Ray)' : `${angle2.toFixed(1)}°`}
          </div>
          <span className="text-[10px] text-slate-500">
            {isTotalInternalReflection ? 'Critical angle exceeded' : `Δθ = ${Math.abs(angle1 - angle2).toFixed(1)}° deviation`}
          </span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Critical Angle (θ_crit)</span>
          <div className="text-lg font-mono font-bold text-purple-400">
            {criticalAngleDeg ? `${criticalAngleDeg.toFixed(1)}°` : 'None (n₁ ≤ n₂)'}
          </div>
          <span className="text-[10px] text-slate-500">Dense to rarer medium only</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Snell&apos;s Law Formula</span>
          <div className="mt-1">
            <Formula tex="n_1 \sin \theta_1 = n_2 \sin \theta_2" />
          </div>
        </div>
      </div>
    </div>
  );
};
