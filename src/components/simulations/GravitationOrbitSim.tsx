import React, { useRef, useEffect, useState } from 'react';
import { Formula } from '../common/Formula';
import { Compass, Sliders, RotateCcw, Play, Pause, Sparkles } from 'lucide-react';

interface GravitationOrbitSimProps {
  centralMass?: number; // in solar masses
  orbitalRadius?: number; // in AU
  eccentricity?: number; // 0 (circle) to 0.75 (ellipse)
}

const ORBIT_PRESETS = [
  { name: 'Earth (Near Circular)', m: 1.0, r: 1.0, e: 0.017 },
  { name: 'Mercury (High Eccentricity)', m: 1.0, r: 0.39, e: 0.206 },
  { name: 'Halley-like Comet', m: 1.0, r: 1.2, e: 0.72 },
  { name: 'Supermassive Star System', m: 2.5, r: 1.1, e: 0.35 },
];

export const GravitationOrbitSim: React.FC<GravitationOrbitSimProps> = ({
  centralMass: propM = 1.0,
  orbitalRadius: propR = 1.0,
  eccentricity: propE = 0.1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [centralMass, setCentralMass] = useState<number>(propM);
  const [orbitalRadius, setOrbitalRadius] = useState<number>(propR);
  const [eccentricity, setEccentricity] = useState<number>(propE);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Physics calculations:
  // Orbital speed v = sqrt(G * M / r)
  const G = 1;
  const nominalSpeed = Math.sqrt((G * centralMass) / Math.max(0.1, orbitalRadius));
  const periodYears = Math.sqrt(Math.pow(orbitalRadius, 3) / centralMass);
  const semiMajorAxis = orbitalRadius;
  const semiMinorAxis = orbitalRadius * Math.sqrt(Math.max(0.01, 1 - eccentricity * eccentricity));
  const focalDistance = orbitalRadius * eccentricity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
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

      // Deep space background with subtle stars
      ctx.fillStyle = '#060B18';
      ctx.fillRect(0, 0, w, h);

      // Static background star points
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      const seedPoints = [
        [w * 0.1, h * 0.2],
        [w * 0.85, h * 0.15],
        [w * 0.9, h * 0.75],
        [w * 0.15, h * 0.8],
        [w * 0.5, h * 0.1],
        [w * 0.3, h * 0.9],
      ];
      seedPoints.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      const centerX = w * 0.5;
      const centerY = h * 0.5;
      const scale = Math.min(w, h) * 0.35;

      // Focal center offset for ellipse
      const sunX = centerX - focalDistance * scale;
      const sunY = centerY;

      // Draw Orbit Ellipse
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, semiMajorAxis * scale, semiMinorAxis * scale, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Sun (Central Mass)
      const sunRadius = Math.max(12, Math.min(26, 14 + centralMass * 5));
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, sunRadius * 2.2);
      sunGlow.addColorStop(0, '#fef08a');
      sunGlow.addColorStop(0.4, '#eab308');
      sunGlow.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Star (M = ${centralMass.toFixed(1)} M☉)`, sunX, sunY + sunRadius + 14);

      // Planet position on ellipse:
      // Kepler's 2nd law approx: moves faster near perihelion
      const currentR = Math.hypot(
        centerX + semiMajorAxis * scale * Math.cos(angle) - sunX,
        centerY + semiMinorAxis * scale * Math.sin(angle) - sunY
      );
      if (isPlaying) {
        const angularSpeed = (0.015 * Math.sqrt(centralMass)) / Math.max(0.4, currentR / scale);
        angle += angularSpeed;
      }

      const planetX = centerX + semiMajorAxis * scale * Math.cos(angle);
      const planetY = centerY + semiMinorAxis * scale * Math.sin(angle);

      // Gravitational force vector line from planet to star
      ctx.beginPath();
      ctx.moveTo(planetX, planetY);
      ctx.lineTo(sunX, sunY);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Velocity vector (tangent to ellipse)
      const vx = -semiMajorAxis * scale * Math.sin(angle);
      const vy = semiMinorAxis * scale * Math.cos(angle);
      const vMag = Math.hypot(vx, vy);
      const vNormX = vx / (vMag || 1);
      const vNormY = vy / (vMag || 1);
      const vectorLen = 35 * (nominalSpeed / 1.5);

      ctx.beginPath();
      ctx.moveTo(planetX, planetY);
      ctx.lineTo(planetX + vNormX * vectorLen, planetY + vNormY * vectorLen);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Planet body
      ctx.beginPath();
      ctx.arc(planetX, planetY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('Planet', planetX, planetY - 12);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [centralMass, orbitalRadius, eccentricity, semiMajorAxis, semiMinorAxis, focalDistance, nominalSpeed, isPlaying]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#060B18] shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-80 block" />

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Direct Manipulation Sliders & Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Keplerian Orbital Mechanics Manipulator
            </h4>
          </div>
          <span className="text-xs text-cyan-400 font-mono font-bold bg-cyan-950/80 border border-cyan-800 px-2.5 py-0.5 rounded-full">
            Period (T): {periodYears.toFixed(2)} yr • Speed: ~{(nominalSpeed * 29.8).toFixed(1)} km/s
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Central Star Mass (M):</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{centralMass.toFixed(2)} M☉</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="3.0"
              step="0.1"
              value={centralMass}
              onChange={(e) => setCentralMass(parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.4 M☉ (Red Dwarf)</span>
              <span>1.0 M☉ (Sun)</span>
              <span>3.0 M☉</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">Semi-Major Axis (a):</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{orbitalRadius.toFixed(2)} AU</span>
            </div>
            <input
              type="range"
              min="0.3"
              max="2.0"
              step="0.05"
              value={orbitalRadius}
              onChange={(e) => setOrbitalRadius(parseFloat(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.3 AU</span>
              <span>1.0 AU (Earth)</span>
              <span>2.0 AU</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-300 font-medium">Orbital Eccentricity (e):</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{eccentricity.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.75"
              step="0.02"
              value={eccentricity}
              onChange={(e) => setEccentricity(parseFloat(e.target.value))}
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.00 (Circle)</span>
              <span>0.20 (Mercury)</span>
              <span>0.75 (Cometary)</span>
            </div>
          </div>
        </div>

        {/* Orbit Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Celestial Orbits:</span>
            {ORBIT_PRESETS.map((op) => (
              <button
                key={op.name}
                onClick={() => {
                  setCentralMass(op.m);
                  setOrbitalRadius(op.r);
                  setEccentricity(op.e);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-xs font-mono"
              >
                {op.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setCentralMass(1.0);
              setOrbitalRadius(1.0);
              setEccentricity(0.1);
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
          <span className="text-slate-400 block mb-0.5">Orbital Period (T)</span>
          <div className="text-lg font-mono font-bold text-sky-400">{periodYears.toFixed(2)} yr</div>
          <span className="text-[10px] text-slate-500">{(periodYears * 365.25).toFixed(0)} Earth days</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Mean Orbital Velocity</span>
          <div className="text-lg font-mono font-bold text-emerald-400">{(nominalSpeed * 29.78).toFixed(1)} km/s</div>
          <span className="text-[10px] text-slate-500">v = √(GM/r)</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Perihelion / Aphelion</span>
          <div className="text-sm font-mono font-bold text-amber-300 mt-1">
            r_p: {(semiMajorAxis * (1 - eccentricity)).toFixed(2)} AU <br />
            r_a: {(semiMajorAxis * (1 + eccentricity)).toFixed(2)} AU
          </div>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Kepler&apos;s Third Law</span>
          <div className="mt-1">
            <Formula tex="T^2 = \frac{4\pi^2}{G M} a^3" />
          </div>
        </div>
      </div>
    </div>
  );
};
