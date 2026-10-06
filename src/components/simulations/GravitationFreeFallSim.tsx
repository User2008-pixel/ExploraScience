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

  // Time-series history for graphs
  const [history, setHistory] = useState<Array<{ t: number; h1: number; v1: number; h2: number; v2: number }>>([]);

  // Drag parameters
  // Object 1: Sphere (radius ~ 0.1m, Cd = 0.47, Area = pi*r^2 = 0.031 m^2)
  const cd1 = 0.47;
  const area1 = 0.031;
  // Object 2: Feather (flat orientation, Cd = 1.2, Area = 0.015 m^2)
  const cd2 = 1.2;
  const area2 = 0.015;

  const rho = isVacuum ? 0 : 1.225;

  // Theoretical vacuum time: t = sqrt(2h / g)
  const theoreticalVacuumTime = Math.sqrt((2 * heightM) / gValue);
  const theoreticalImpactVel = Math.sqrt(2 * gValue * heightM);

  // Reset physics
  const resetSimulation = () => {
    setIsPlaying(false);
    setSimTime(0);
    setPos1(heightM);
    setVel1(0);
    setLandedTime1(null);
    setPos2(heightM);
    setVel2(0);
    setLandedTime2(null);
    setHistory([]);
  };

  // Physics animation tick
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      let lastStamp = performance.now();
      const tick = (now: number) => {
        const dtReal = (now - lastStamp) / 1000;
        lastStamp = now;
        const dt = Math.min(0.04, dtReal) * simSpeed;

        setSimTime((currTime) => {
          const nextTime = currTime + dt;

          // Object 1 update
          setPos1((currPos1) => {
            if (currPos1 <= 0) return 0;
            setVel1((currV1) => {
              // Net force: F_net = m*g - 0.5 * rho * Cd * A * v^2
              const drag1 = 0.5 * rho * cd1 * area1 * currV1 * currV1;
              const a1 = gValue - drag1 / mass1;
              const nextV1 = currV1 + a1 * dt;
              const nextY1 = Math.max(0, currPos1 - nextV1 * dt);
              if (nextY1 <= 0 && landedTime1 === null) {
                setLandedTime1(nextTime);
              }
              return nextY1 <= 0 ? 0 : nextV1;
            });
            return currPos1;
          });

          // Object 2 update
          setPos2((currPos2) => {
            if (currPos2 <= 0) return 0;
            setVel2((currV2) => {
              const drag2 = 0.5 * rho * cd2 * area2 * currV2 * currV2;
              const a2 = gValue - drag2 / mass2;
              const nextV2 = Math.max(0, currV2 + a2 * dt);
              const nextY2 = Math.max(0, currPos2 - nextV2 * dt);
              if (nextY2 <= 0 && landedTime2 === null) {
                setLandedTime2(nextTime);
              }
              return nextY2 <= 0 ? 0 : nextV2;
            });
            return currPos2;
          });

          setHistory((prev) => {
            if (prev.length > 300) return prev;
            return [
              ...prev,
              {
                t: Math.round(nextTime * 100) / 100,
                h1: Math.max(0, pos1),
                v1: vel1,
                h2: Math.max(0, pos2),
                v2: vel2,
              },
            ];
          });

          return nextTime;
        });

        animId = requestAnimationFrame(tick);
      };
      animId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, simSpeed, gValue, rho, mass1, mass2, pos1, pos2, vel1, vel2, landedTime1, landedTime2]);

  // Stop when both have landed
  useEffect(() => {
    if (pos1 <= 0 && pos2 <= 0 && isPlaying) {
      setIsPlaying(false);
    }
  }, [pos1, pos2, isPlaying]);

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

    // Background gradient (Sky or Vacuum Chamber)
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

    // Rung marks every 10 meters
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

    // Vacuum Chamber Glass outline indicator
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

    // Lane X positions
    const lane1X = w * 0.38; // Heavy Lead Sphere
    const lane2X = w * 0.72; // Light Feather / Ping-pong

    // Vertical travel path guides
    ctx.strokeStyle = '#1e293b';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(lane1X, topDropY);
    ctx.lineTo(lane1X, groundY);
    ctx.moveTo(lane2X, topDropY);
    ctx.lineTo(lane2X, groundY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Pixel Y for both objects
    const yPixel1 = groundY - (pos1 / heightM) * dropRangePixels;
    const yPixel2 = groundY - (pos2 / heightM) * dropRangePixels;

    // -------------------------------------------------------------
    // RENDER OBJECT 1: Heavy Lead Cannonball / Sphere
    // -------------------------------------------------------------
    const r1 = 16;
    ctx.save();
    ctx.translate(lane1X, yPixel1 - r1);

    // Ball gradient
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

    // Mass Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass1}kg`, 0, 3);

    // Force Vectors on Ball
    // Gravitational Weight W = m1*g (pointing down)
    const weight1Arrow = Math.min(50, Math.max(15, mass1 * 2));
    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, r1);
    ctx.lineTo(0, r1 + weight1Arrow);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, r1 + weight1Arrow);
    ctx.lineTo(-4, r1 + weight1Arrow - 6);
    ctx.lineTo(4, r1 + weight1Arrow - 6);
    ctx.fill();
    ctx.fillText(`W₁=${Math.round(mass1 * gValue)}N`, 0, r1 + weight1Arrow + 12);

    // Upward drag if in air
    if (!isVacuum && vel1 > 0.5) {
      const dragVal1 = Math.min(30, 0.5 * rho * cd1 * area1 * vel1 * vel1);
      ctx.strokeStyle = '#ef4444';
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, -r1);
      ctx.lineTo(0, -r1 - dragVal1);
      ctx.stroke();
      ctx.fillText(`F_drag`, 0, -r1 - dragVal1 - 4);
    }
    ctx.restore();

    // -------------------------------------------------------------
    // RENDER OBJECT 2: Light Feather / Ping-Pong Ball
    // -------------------------------------------------------------
    ctx.save();
    ctx.translate(lane2X, yPixel2 - 12);

    // Flutter rotation in air
    const flutterAngle = isVacuum ? 0 : Math.sin(simTime * 8) * 0.35;
    ctx.rotate(flutterAngle);

    // Feather icon / shape
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, 7, 18, Math.PI / 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Spine
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -18);
    ctx.lineTo(0, 18);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass2}kg`, 0, 4);

    // Force Vectors on Feather
    // Weight W2 = m2*g
    const weight2Arrow = Math.max(10, mass2 * 15);
    ctx.strokeStyle = '#f59e0b';
    ctx.fillStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 18);
    ctx.lineTo(0, 18 + weight2Arrow);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, 18 + weight2Arrow);
    ctx.lineTo(-3, 18 + weight2Arrow - 5);
    ctx.lineTo(3, 18 + weight2Arrow - 5);
    ctx.fill();
    ctx.fillText(`W₂=${Math.round(mass2 * gValue * 10) / 10}N`, 0, 18 + weight2Arrow + 10);

    if (!isVacuum && vel2 > 0.3) {
      const dragVal2 = Math.min(30, 0.5 * rho * cd2 * area2 * vel2 * vel2 * 8);
      ctx.strokeStyle = '#ef4444';
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(0, -18 - dragVal2);
      ctx.stroke();
      ctx.fillText(`F_drag`, 0, -18 - dragVal2 - 4);
    }
    ctx.restore();

    // Impact Ground Flash
    if (pos1 <= 0) {
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(lane1X, groundY, 14, 0, Math.PI * 2);
      ctx.fill();
    }
    if (pos2 <= 0) {
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(lane2X, groundY, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }, [heightM, mass1, mass2, pos1, pos2, vel1, vel2, isVacuum, simTime, gValue, rho]);

  return (
    <div className="bg-[#070e1c] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Gravitation & Free Fall: Gravity vs Inertial Mass Lab
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Galileo&apos;s Pisa & Apollo 15 Lunar Vacuum Experiment: Objects dropped from above
            </p>
          </div>
        </div>

        {/* Vacuum vs Air Toggle */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => {
              setIsVacuum(true);
              resetSimulation();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              isVacuum
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Vacuum (Zero Air Drag)
          </button>
          <button
            onClick={() => {
              setIsVacuum(false);
              resetSimulation();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              !isVacuum
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            Atmosphere (Air Drag)
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport: Canvas & Stopwatches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Drop Chamber Canvas */}
        <div className="lg:col-span-8 bg-[#030712] rounded-2xl border border-slate-800 p-3 relative overflow-hidden flex flex-col items-center">
          <canvas ref={canvasRef} className="w-full h-80 block select-none" />

          {/* Fall Timing & Status Readout Bar */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 px-3 py-2 bg-slate-950/90 rounded-xl border border-slate-800 text-xs font-mono">
            {/* Stopwatch 1 */}
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] uppercase">Heavy Cannonball ({mass1} kg):</span>
              <div className="text-cyan-400 font-bold text-sm">
                {landedTime1 !== null ? `${landedTime1.toFixed(3)} s (Landed!)` : `${simTime.toFixed(2)} s`}
              </div>
              <span className="text-[10px] text-slate-500">
                v = {vel1.toFixed(1)} m/s | y = {pos1.toFixed(1)} m
              </span>
            </div>

            {/* Stopwatch 2 */}
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] uppercase">Light Feather ({mass2} kg):</span>
              <div className="text-emerald-400 font-bold text-sm">
                {landedTime2 !== null ? `${landedTime2.toFixed(3)} s (Landed!)` : `${simTime.toFixed(2)} s`}
              </div>
              <span className="text-[10px] text-slate-500">
                v = {vel2.toFixed(1)} m/s | y = {pos2.toFixed(1)} m
              </span>
            </div>

            {/* Theoretical Comparison */}
            <div className="flex flex-col border-l border-slate-800 pl-2">
              <span className="text-amber-400 text-[10px] uppercase font-bold">Galileo Theoretical:</span>
              <div className="text-white font-bold text-sm">t = {theoreticalVacuumTime.toFixed(3)} s</div>
              <span className="text-[10px] text-slate-500">v_impact = {theoreticalImpactVel.toFixed(1)} m/s</span>
            </div>
          </div>
        </div>

        {/* Playback & Real-Time Analytics Sidebar */}
        <div className="lg:col-span-4 bg-slate-900/80 rounded-2xl border border-slate-800 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              Experiment Controls
            </span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              g = {gValue} m/s²
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (pos1 <= 0 && pos2 <= 0) {
                  resetSimulation();
                  setIsPlaying(true);
                } else {
                  setIsPlaying(!isPlaying);
                }
              }}
              className="flex-1 py-2.5 px-4 rounded-xl font-bold font-mono text-xs bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" /> Pause Drop
                </>
              ) : pos1 <= 0 && pos2 <= 0 ? (
                <>
                  <Play className="w-4 h-4 fill-current" /> Drop Again
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Release Objects
                </>
              )}
            </button>

            <button
              onClick={resetSimulation}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset simulation to top platform"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Controls */}
          <div className="flex items-center justify-between text-xs font-mono bg-slate-950/70 p-1.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 pl-2">Playback Rate:</span>
            <div className="flex gap-1">
              {[0.25, 0.5, 1.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setSimSpeed(s)}
                  className={`px-2 py-1 rounded-lg transition ${
                    simSpeed === s ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Planetary Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-slate-400 font-bold flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> Celestial Gravitational Fields:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {PLANET_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setGValue(p.g);
                    setIsVacuum(p.airDensity === 0);
                    resetSimulation();
                  }}
                  className={`p-2 rounded-xl border text-left transition ${
                    gValue === p.g
                      ? 'bg-slate-800 border-cyan-400 text-cyan-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-mono">{p.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">g = {p.g} m/s²</div>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Drop Height Slider */}
          <div className="space-y-1">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-slate-300">Drop Height (h):</span>
              <span className="text-cyan-400 font-bold">{heightM} m</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={heightM}
              onChange={(e) => {
                setHeightM(Number(e.target.value));
                resetSimulation();
              }}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10 m</span>
              <span>50 m</span>
              <span>100 m</span>
            </div>
          </div>

          {/* Object Mass Controls */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <div>
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300">Cannonball Mass (m₁):</span>
                <span className="text-amber-400 font-bold">{mass1} kg</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={mass1}
                onChange={(e) => {
                  setMass1(Number(e.target.value));
                  resetSimulation();
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-300">Feather Mass (m₂):</span>
                <span className="text-emerald-400 font-bold">{mass2} kg</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="2.0"
                step="0.01"
                value={mass2}
                onChange={(e) => {
                  setMass2(Number(e.target.value));
                  resetSimulation();
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Physics Insights & Why Mass Cancels In Vacuum */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider font-mono text-white">
              Why Gravity Affects All Masses Equally (Galileo&apos;s Principle)
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            According to Newton&apos;s Universal Law of Gravitation, the downward gravitational force acting on a body
            is directly proportional to its mass: <span className="font-mono text-amber-300">F_g = m · g</span>.
            Therefore, a 10 kg cannonball is pulled with <strong>200 times more gravitational force</strong> than a
            0.05 kg feather!
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            However, Newton&apos;s Second Law states that a body&apos;s resistance to acceleration (inertia) is also
            proportional to its mass: <span className="font-mono text-cyan-300">a = F / m</span>. When we substitute
            gravitational force into the acceleration equation, <strong>the mass m cancels out completely:</strong>
          </p>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-xs text-emerald-400 text-center">
            <Formula tex="a = \frac{F_g}{m} = \frac{m \cdot g}{m} = g = \frac{G M_{\text{Earth}}}{R^2}" />
          </div>
        </div>

        <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-800/80 md:pl-5 pt-3 md:pt-0">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-cyan-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider font-mono text-white">
              Vacuum vs Atmospheric Air Resistance
            </h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            In everyday life on Earth, Aristotle appeared correct because air drag{' '}
            <span className="font-mono text-rose-400">F_drag = ½ · ρ · C_d · A · v²</span> opposes downward motion.
            For lightweight objects with large surface area like feathers or paper, air drag rapidly equals their tiny
            weight, causing them to reach terminal velocity in a fraction of a second.
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="flex justify-between font-mono">
              <span className="text-cyan-400">In Vacuum:</span>
              <span className="text-white font-bold">Both hit ground simultaneously!</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-amber-400">In Air:</span>
              <span className="text-white font-bold">Cannonball outpaces the feather!</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            In 1971, Commander David Scott verified this on the Moon by dropping a 1.32 kg geological hammer and a
            0.03 kg falcon feather simultaneously into lunar vacuum — both struck the lunar dust together!
          </p>
        </div>
      </div>
    </div>
  );
};
