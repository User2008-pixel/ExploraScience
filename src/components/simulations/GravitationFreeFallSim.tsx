import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Play, Pause, RotateCcw, Sliders, Globe, Wind, Zap, Flame, Sparkles } from 'lucide-react';

interface GravitationFreeFallSimProps {
  initialHeightM?: number;
  object1MassKg?: number;
  object2MassKg?: number;
  gravity?: number;
  inVacuum?: boolean;
}

interface PlanetPreset {
  name: string;
  g: number;
  airDensity: number;
  description: string;
  color: string;
}

const PLANET_PRESETS: PlanetPreset[] = [
  { name: 'Earth', g: 9.80, airDensity: 1.225, description: 'Standard terrestrial gravity & sea-level atmosphere', color: '#0284c7' },
  { name: 'Moon (Apollo 15)', g: 1.62, airDensity: 0.0, description: '1/6th gravity, total vacuum (David Scott Hammer & Feather)', color: '#94a3b8' },
  { name: 'Mars', g: 3.72, airDensity: 0.020, description: '0.38g gravity, thin CO2 atmosphere', color: '#ef4444' },
  { name: 'Jupiter', g: 24.79, airDensity: 0.150, description: '2.5x Earth gravity, dense upper cloud deck', color: '#f59e0b' },
];

export const GravitationFreeFallSim: React.FC<GravitationFreeFallSimProps> = ({
  initialHeightM: propHeight = 45,
  object1MassKg: propM1 = 10,
  object2MassKg: propM2 = 0.05,
  gravity: propG = 9.8,
  inVacuum: propVacuum = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct Interactive State
  const [heightM, setHeightM] = useState<number>(propHeight);
  const [mass1, setMass1] = useState<number>(propM1); // Heavy Ball (Lead Sphere)
  const [mass2, setMass2] = useState<number>(propM2); // Light Object (Feather / Ping-pong)
  const [gValue, setGValue] = useState<number>(propG);
  const [isVacuum, setIsVacuum] = useState<boolean>(propVacuum);
  const [simSpeed, setSimSpeed] = useState<number>(1.0); // 1x, 0.5x, 0.25x

  // Simulation run state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);

  // Trajectory tracking
  const [pos1, setPos1] = useState<number>(propHeight);
  const [vel1, setVel1] = useState<number>(0);
  const [landedTime1, setLandedTime1] = useState<number | null>(null);

  const [pos2, setPos2] = useState<number>(propHeight);
  const [vel2, setVel2] = useState<number>(0);
  const [landedTime2, setLandedTime2] = useState<number | null>(null);

  // Drag parameters
  const cd1 = 0.47;
  const area1 = 0.031;
  const cd2 = 1.2;
  const area2 = 0.015;

  const rho = isVacuum ? 0 : 1.225;

  // Theoretical vacuum time: t = sqrt(2h / g)
  const theoreticalVacuumTime = Math.sqrt((2 * heightM) / gValue);
  const theoreticalImpactVel = Math.sqrt(2 * gValue * heightM);

  // Physics reference for buttery-smooth animation loop
  const physicsRef = useRef({
    y1: heightM,
    v1: 0,
    y2: heightM,
    v2: 0,
    t: 0,
    landed1: false,
    landed2: false,
  });

  // Reset physics
  const resetSimulation = () => {
    setIsPlaying(false);
    physicsRef.current = { y1: heightM, v1: 0, y2: heightM, v2: 0, t: 0, landed1: false, landed2: false };
    setSimTime(0);
    setPos1(heightM);
    setVel1(0);
    setLandedTime1(null);
    setPos2(heightM);
    setVel2(0);
    setLandedTime2(null);
  };

  // When heightM changes and not playing, reset positions
  useEffect(() => {
    if (!isPlaying) {
      physicsRef.current = { y1: heightM, v1: 0, y2: heightM, v2: 0, t: 0, landed1: false, landed2: false };
      setPos1(heightM);
      setVel1(0);
      setPos2(heightM);
      setVel2(0);
      setSimTime(0);
      setLandedTime1(null);
      setLandedTime2(null);
    }
  }, [heightM]);

  // Robust Physics Loop using requestAnimationFrame & useRef
  useEffect(() => {
    let animId: number;
    let lastStamp = performance.now();

    const loop = (now: number) => {
      if (!isPlaying) return;
      const dtReal = (now - lastStamp) / 1000;
      lastStamp = now;
      const dt = Math.min(0.05, dtReal) * simSpeed;

      const p = physicsRef.current;

      // Object 1 update
      if (p.y1 > 0) {
        const drag1 = 0.5 * rho * cd1 * area1 * p.v1 * p.v1;
        const a1 = gValue - drag1 / mass1;
        p.v1 += a1 * dt;
        p.y1 = Math.max(0, p.y1 - p.v1 * dt);
        if (p.y1 <= 0 && !p.landed1) {
          p.landed1 = true;
          setLandedTime1(p.t);
        }
      }

      // Object 2 update
      if (p.y2 > 0) {
        const drag2 = 0.5 * rho * cd2 * area2 * p.v2 * p.v2;
        const a2 = gValue - drag2 / mass2;
        p.v2 += a2 * dt;
        p.y2 = Math.max(0, p.y2 - p.v2 * dt);
        if (p.y2 <= 0 && !p.landed2) {
          p.landed2 = true;
          setLandedTime2(p.t);
        }
      }

      p.t += dt;

      // Update React state for rendering
      setPos1(p.y1);
      setVel1(p.v1);
      setPos2(p.y2);
      setVel2(p.v2);
      setSimTime(p.t);

      if (p.y1 <= 0 && p.y2 <= 0) {
        setIsPlaying(false);
      } else {
        animId = requestAnimationFrame(loop);
      }
    };

    if (isPlaying) {
      lastStamp = performance.now();
      animId = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animId);
  }, [isPlaying, simSpeed, gValue, rho, mass1, mass2]);

  // Canvas visual rendering
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

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    if (isVacuum) {
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(1, '#020408');
    } else {
      bgGrad.addColorStop(0, '#0c1b33');
      bgGrad.addColorStop(1, '#050b14');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Ground platform
    const groundY = h - 45;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, groundY, w, 45);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // Height measurement ruler on the left
    const topDropY = 40;
    const dropRangePixels = groundY - topDropY;

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, topDropY);
    ctx.lineTo(50, groundY);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';

    for (let meter = 0; meter <= heightM; meter += heightM > 50 ? 20 : 10) {
      const yPixel = groundY - (meter / heightM) * dropRangePixels;
      ctx.beginPath();
      ctx.moveTo(45, yPixel);
      ctx.lineTo(55, yPixel);
      ctx.stroke();
      ctx.fillText(`${meter}m`, 40, yPixel + 3);
    }

    // Top Release Platform
    ctx.fillStyle = '#334155';
    ctx.fillRect(70, topDropY - 6, w - 90, 8);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Release Height: h = ${heightM} m`, 80, topDropY - 12);

    // Chamber indicator
    if (isVacuum) {
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(65, 20, w - 85, h - 50);
      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('EVACUATED VACUUM CHAMBER (Air Drag = 0)', 80, 32);
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('ATMOSPHERE (Air Density ρ = 1.22 kg/m³)', 80, 32);
    }

    const lane1X = w * 0.38;
    const lane2X = w * 0.72;

    ctx.strokeStyle = '#1e293b';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(lane1X, topDropY);
    ctx.lineTo(lane1X, groundY);
    ctx.moveTo(lane2X, topDropY);
    ctx.lineTo(lane2X, groundY);
    ctx.stroke();
    ctx.setLineDash([]);

    const yPixel1 = groundY - (pos1 / heightM) * dropRangePixels;
    const yPixel2 = groundY - (pos2 / heightM) * dropRangePixels;

    // Object 1: Heavy Sphere
    const r1 = 16;
    ctx.save();
    ctx.translate(lane1X, yPixel1 - r1);
    const bGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, r1);
    bGrad.addColorStop(0, '#94a3b8');
    bGrad.addColorStop(0.5, '#475569');
    bGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.arc(0, 0, r1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass1}kg`, 0, 3);
    ctx.restore();

    // Object 2: Light Feather / Ping-Pong
    ctx.save();
    ctx.translate(lane2X, yPixel2 - 12);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 8, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass2}kg`, 0, 3);
    ctx.restore();

    ctx.restore();
  }, [pos1, pos2, heightM, isVacuum, mass1, mass2]);

  return (
    <div className="bg-[#070e1c] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Gravitational Free Fall & Vacuum Drop Lab
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                h = ½gt²
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Observe how all bodies fall at the exact same rate in a vacuum regardless of mass.
            </p>
          </div>
        </div>

        {/* Planet Presets */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          {PLANET_PRESETS.map((planet) => (
            <button
              key={planet.name}
              onClick={() => {
                setGValue(planet.g);
                if (planet.airDensity === 0) setIsVacuum(true);
                resetSimulation();
              }}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                gValue === planet.g ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {planet.name} (g={planet.g})
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-[#090d16]">
        {/* Playback Controls Overlay Top Left */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow ${
              isPlaying ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Drop Objects'}</span>
          </button>
          <button
            onClick={resetSimulation}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Reset Drop"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Toggles */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-800 text-[11px] text-slate-400">
            <span className="font-mono">Speed:</span>
            {[0.5, 1.0, 2.0].map((s) => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                  simSpeed === s ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Live Status Top Right */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="text-cyan-400">t = {simTime.toFixed(2)}s</span>
          <span className="text-amber-400">v₁ = {vel1.toFixed(1)} m/s</span>
          <span className="text-emerald-400">v₂ = {vel2.toFixed(1)} m/s</span>
        </div>

        <canvas ref={canvasRef} width={760} height={320} className="w-full h-80 block select-none" />
      </div>

      {/* Vacuum Toggle */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs">
        <div className="flex items-center gap-2 text-cyan-200">
          <Wind className="w-4 h-4 text-cyan-400" />
          <span>Environment Chamber: {isVacuum ? 'Total Vacuum (No Air Resistance)' : 'Earth Atmosphere (Air Drag Active)'}</span>
        </div>
        <button
          onClick={() => {
            setIsVacuum(!isVacuum);
            resetSimulation();
          }}
          className={`px-3 py-1 rounded-lg font-bold transition ${
            isVacuum ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
          }`}
        >
          {isVacuum ? '📭 Vacuum Mode (ON)' : '💨 Atmosphere Mode (ON)'}
        </button>
      </div>

      {/* Quantitative Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Free Fall Time (Vacuum)</div>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {theoreticalVacuumTime.toFixed(2)} <span className="text-xs text-slate-400 font-normal">seconds</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Impact Velocity (v = gt)</div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {theoreticalImpactVel.toFixed(1)} <span className="text-xs text-slate-400 font-normal">m/s</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Heavy Ball Height ($h_1$)</div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {pos1.toFixed(1)} <span className="text-xs text-slate-400 font-normal">meters</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Light Object Height ($h_2$)</div>
          <div className="text-xl font-bold font-mono text-purple-400">
            {pos2.toFixed(1)} <span className="text-xs text-slate-400 font-normal">meters</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Sliders */}
      <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          Drop Parameters ($h, g, m_1, m_2$)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-300 font-medium">Release Height ($h$)</span>
              <span className="font-mono text-cyan-400 font-bold">{heightM} m</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={heightM}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setHeightM(val);
                resetSimulation();
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-amber-300 font-medium">Gravity ($g$)</span>
              <span className="font-mono text-amber-400 font-bold">{gValue} m/s²</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="25.0"
              step="0.5"
              value={gValue}
              onChange={(e) => {
                setGValue(parseFloat(e.target.value));
                resetSimulation();
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-emerald-300 font-medium">Light Object Mass ($m_2$)</span>
              <span className="font-mono text-emerald-400 font-bold">{(mass2 * 1000).toFixed(0)} g</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="2.0"
              step="0.01"
              value={mass2}
              onChange={(e) => setMass2(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
