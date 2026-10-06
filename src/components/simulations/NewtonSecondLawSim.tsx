import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Formula } from '../common/Formula';
import { Play, Pause, RotateCcw, Activity, Sliders, Zap, TrendingUp, BarChart2, Layers } from 'lucide-react';

interface NewtonSecondLawSimProps {
  appliedForce?: number;
  mass?: number;
  frictionCoeff?: number;
}

type ForceProfile = 'constant' | 'step' | 'ramp' | 'impulse' | 'oscillating';

const PROFILE_OPTIONS: Array<{ id: ForceProfile; label: string; desc: string }> = [
  { id: 'constant', label: 'Constant Force', desc: 'F = const ➔ a = const (Horizontal line on a-t)' },
  { id: 'step', label: 'Stepped Force', desc: 'F doubles at t = 3s ➔ Step jump in acceleration' },
  { id: 'ramp', label: 'Ramping Force', desc: 'F increases linearly ➔ Linear slope on a-t graph' },
  { id: 'impulse', label: 'Impulse Strike', desc: 'Short intense strike ➔ High spike on a-t graph' },
  { id: 'oscillating', label: 'Harmonic Force', desc: 'F(t) = F·sin(ωt) ➔ Sinusoidal wave on a-t graph' },
];

export const NewtonSecondLawSim: React.FC<NewtonSecondLawSimProps> = ({
  appliedForce: propF = 40,
  mass: propM = 8,
  frictionCoeff: propMu = 0.1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct Interactive State
  const [baseForce, setBaseForce] = useState<number>(propF);
  const [mass, setMass] = useState<number>(propM);
  const [frictionCoeff, setFrictionCoeff] = useState<number>(propMu);
  const [forceProfile, setForceProfile] = useState<ForceProfile>('constant');
  const [activeGraphTab, setActiveGraphTab] = useState<'a-t' | 'v-t' | 'F-t'>('a-t');

  // Comparison Run State
  const [savedRun, setSavedRun] = useState<{
    mass: number;
    force: number;
    profile: ForceProfile;
    data: Array<{ t: number; a: number }>;
  } | null>(null);

  // Simulation playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);

  // Live series history: [t, F, a, v, x]
  const [history, setHistory] = useState<Array<{ t: number; F: number; a: number; v: number; x: number }>>([]);

  const g = 9.8;
  const normalForce = mass * g;
  const frictionForce = frictionCoeff * normalForce;

  // Function to compute applied force at any elapsed time t
  const getForceAtTime = (t: number, baseF: number, profile: ForceProfile) => {
    switch (profile) {
      case 'constant':
        return baseF;
      case 'step':
        return t >= 3.0 ? baseF * 2 : baseF;
      case 'ramp':
        return baseF * (1 + t * 0.25);
      case 'impulse':
        return t >= 1.5 && t <= 2.2 ? baseF * 2.8 : Math.max(0, baseF * 0.2);
      case 'oscillating':
        return Math.max(0, baseF * (1 + Math.sin(t * 2.5)));
      default:
        return baseF;
    }
  };

  // Instantaneous physics at current simTime
  const currentAppliedForce = getForceAtTime(simTime, baseForce, forceProfile);
  const netForce = Math.max(0, currentAppliedForce - frictionForce);
  const currentAcceleration = netForce / mass;

  // Kinetic state from integrated history or formula
  const currentVelocity = history.length > 0 ? history[history.length - 1].v : 0;
  const currentDisplacement = history.length > 0 ? history[history.length - 1].x : 0;

  // Reset function
  const resetSim = () => {
    setIsPlaying(false);
    setSimTime(0);
    setHistory([]);
  };

  // Save current run for comparison
  const saveCurrentRun = () => {
    if (history.length > 0) {
      setSavedRun({
        mass,
        force: baseForce,
        profile: forceProfile,
        data: history.map((pt) => ({ t: pt.t, a: pt.a })),
      });
    }
  };

  // Animation frame loop with real-time numeric integration
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      let lastStamp = performance.now();
      const tick = (now: number) => {
        const dtReal = (now - lastStamp) / 1000;
        lastStamp = now;
        const dt = Math.min(0.04, dtReal);

        setSimTime((prevTime) => {
          if (prevTime >= 8.0) {
            setIsPlaying(false);
            return 8.0;
          }
          const nextTime = prevTime + dt;
          const F = getForceAtTime(nextTime, baseForce, forceProfile);
          const f_fric = frictionCoeff * mass * g;
          const F_net = Math.max(0, F - f_fric);
          const a = F_net / mass;

          setHistory((prevHist) => {
            const lastV = prevHist.length > 0 ? prevHist[prevHist.length - 1].v : 0;
            const lastX = prevHist.length > 0 ? prevHist[prevHist.length - 1].x : 0;
            const nextV = Math.max(0, lastV + a * dt);
            const nextX = lastX + nextV * dt;

            // Cap at 250 points
            if (prevHist.length > 250) return prevHist;
            return [
              ...prevHist,
              {
                t: Math.round(nextTime * 100) / 100,
                F: Math.round(F * 10) / 10,
                a: Math.round(a * 100) / 100,
                v: Math.round(nextV * 100) / 100,
                x: Math.round(nextX * 100) / 100,
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
  }, [isPlaying, baseForce, mass, frictionCoeff, forceProfile]);

  // Canvas visual rendering of the block on the test track
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

    const floorY = h * 0.72;
    ctx.fillStyle = '#090e1a';
    ctx.fillRect(0, 0, w, h);

    // Track surface
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, floorY, w, h - floorY);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(w, floorY);
    ctx.stroke();

    // Distance tick markers along floor
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    const meterScale = 22;
    const trackOffset = (currentDisplacement * meterScale) % 40;
    for (let x = -trackOffset; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, floorY);
      ctx.lineTo(x, floorY + 6);
      ctx.stroke();
    }

    // Box position on screen
    const boxW = Math.max(50, Math.min(95, 42 + mass * 1.8));
    const boxH = Math.max(40, Math.min(75, 34 + mass * 1.4));
    const boxX = w * 0.32;
    const boxY = floorY - boxH;

    // Box body
    const boxGrad = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxH);
    boxGrad.addColorStop(0, '#1e293b');
    boxGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = boxGrad;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${mass.toFixed(1)} kg`, boxX + boxW / 2, boxY + boxH / 2 + 4);

    // Free Body Diagram Vectors
    const centerX = boxX + boxW / 2;
    const centerY = boxY + boxH / 2;

    const drawVector = (fromX: number, fromY: number, toX: number, toY: number, color: string, label: string) => {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      const angle = Math.atan2(toY - fromY, toX - fromX);
      const headLen = 8;
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
      ctx.fill();

      ctx.font = 'bold 10px monospace';
      ctx.fillText(label, toX + Math.cos(angle) * 16, toY + Math.sin(angle) * 16);
    };

    // 1. Applied Force Vector (Right)
    if (currentAppliedForce > 0) {
      const fLen = Math.min(85, Math.max(15, currentAppliedForce * 1.3));
      drawVector(boxX + boxW, centerY, boxX + boxW + fLen, centerY, '#10b981', `F_app=${Math.round(currentAppliedForce)}N`);
    }

    // 2. Friction Force Vector (Left)
    if (frictionForce > 0 && currentAppliedForce > 0) {
      const fricLen = Math.min(65, Math.max(12, frictionForce * 1.3));
      drawVector(boxX, centerY, boxX - fricLen, centerY, '#ef4444', `f_k=${frictionForce.toFixed(1)}N`);
    }

    // 3. Normal Force (Up)
    drawVector(centerX, boxY, centerX, boxY - 32, '#38bdf8', `N=${Math.round(normalForce)}N`);

    // 4. Weight (Down)
    drawVector(centerX, boxY + boxH, centerX, boxY + boxH + 32, '#f59e0b', `W=mg`);

    // 5. Resulting Acceleration Arrow (Top banner above block)
    if (currentAcceleration > 0) {
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`➜ a(t) = ${currentAcceleration.toFixed(2)} m/s²`, centerX, boxY - 42);
    }

    ctx.restore();
  }, [currentAppliedForce, mass, frictionForce, normalForce, currentDisplacement, currentAcceleration]);

  // Compute SVG Plot data for the graph
  const maxPlotT = 8.0;
  const maxPlotA = useMemo(() => {
    let max = 15;
    history.forEach((pt) => {
      if (pt.a > max) max = pt.a;
    });
    if (savedRun) {
      savedRun.data.forEach((pt) => {
        if (pt.a > max) max = pt.a;
      });
    }
    return Math.ceil(max * 1.2);
  }, [history, savedRun]);

  return (
    <div className="bg-[#070e1c] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Newton&apos;s Second Law: Real-Time Acceleration-Time [a-t] Lab
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Live acceleration response curves varying with applied force F(t), inertial mass m, and friction
            </p>
          </div>
        </div>

        {/* Force Profile Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
          <span className="text-slate-400 px-2 text-[11px] font-bold">Force Profile:</span>
          {PROFILE_OPTIONS.map((po) => (
            <button
              key={po.id}
              onClick={() => {
                setForceProfile(po.id);
                resetSim();
              }}
              className={`px-2.5 py-1 rounded-xl transition text-[11px] font-bold ${
                forceProfile === po.id
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={po.desc}
            >
              {po.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Grid: Simulation Screen on Left, Dedicated a-t Graph on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Interactive Motion Test Track */}
        <div className="lg:col-span-6 bg-[#030712] rounded-2xl border border-slate-800 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2 px-1">
            <span className="text-cyan-400 font-bold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Block Dynamics on Linear Track
            </span>
            <span>
              t = <strong className="text-white">{simTime.toFixed(2)}s</strong> / 8.00s
            </span>
          </div>

          <canvas ref={canvasRef} className="w-full h-56 block rounded-xl border border-slate-800/80" />

          {/* Real-time Kinematic Monitor */}
          <div className="grid grid-cols-3 gap-2 mt-3 px-3 py-2 bg-slate-950/90 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block">Net Force F_net:</span>
              <span className="text-emerald-400 font-bold text-sm">{netForce.toFixed(1)} N</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Live Acceleration a:</span>
              <span className="text-amber-400 font-bold text-sm">{currentAcceleration.toFixed(2)} m/s²</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Velocity v:</span>
              <span className="text-cyan-400 font-bold text-sm">{currentVelocity.toFixed(1)} m/s</span>
            </div>
          </div>
        </div>

        {/* Right: DEDICATED LIVE ACCELERATION-TIME GRAPH (User Explicit Request!) */}
        <div className="lg:col-span-6 bg-[#030712] rounded-2xl border border-slate-800 p-4 flex flex-col justify-between">
          {/* Graph Header & Tab Switcher */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                {activeGraphTab === 'a-t'
                  ? 'Acceleration vs Time Graph [a(t) = F_net(t)/m]'
                  : activeGraphTab === 'v-t'
                  ? 'Velocity vs Time Graph [v(t) = ∫a dt]'
                  : 'Applied Force vs Time Graph [F(t)]'}
              </span>
            </div>

            <div className="flex gap-1 text-[11px] font-mono">
              <button
                onClick={() => setActiveGraphTab('a-t')}
                className={`px-2 py-0.5 rounded-lg font-bold transition ${
                  activeGraphTab === 'a-t'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                a-t
              </button>
              <button
                onClick={() => setActiveGraphTab('v-t')}
                className={`px-2 py-0.5 rounded-lg font-bold transition ${
                  activeGraphTab === 'v-t'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                v-t
              </button>
              <button
                onClick={() => setActiveGraphTab('F-t')}
                className={`px-2 py-0.5 rounded-lg font-bold transition ${
                  activeGraphTab === 'F-t'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                F-t
              </button>
            </div>
          </div>

          {/* SVG Vector Plot Viewer */}
          <div className="relative w-full h-56 bg-slate-950 rounded-xl border border-slate-800/80 p-2">
            <svg viewBox="0 0 320 180" className="w-full h-full select-none overflow-visible">
              {/* Grid Lines */}
              {Array.from({ length: 5 }).map((_, i) => (
                <line
                  key={`hgl-${i}`}
                  x1="35"
                  y1={20 + i * 35}
                  x2="310"
                  y2={20 + i * 35}
                  stroke="#1e293b"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                />
              ))}
              {Array.from({ length: 9 }).map((_, i) => (
                <line
                  key={`vgl-${i}`}
                  x1={35 + i * 34.3}
                  y1="20"
                  x2={35 + i * 34.3}
                  y2="160"
                  stroke="#1e293b"
                  strokeWidth="0.8"
                  strokeDasharray="2 2"
                />
              ))}

              {/* Axes */}
              <line x1="35" y1="20" x2="35" y2="160" stroke="#64748b" strokeWidth="1.5" />
              <line x1="35" y1="160" x2="310" y2="160" stroke="#64748b" strokeWidth="1.5" />

              {/* Axis Labels */}
              <text x="305" y="172" fill="#94a3b8" fontSize="8" fontFamily="monospace">t (s)</text>
              <text x="10" y="24" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                {activeGraphTab === 'a-t' ? 'a (m/s²)' : activeGraphTab === 'v-t' ? 'v (m/s)' : 'F (N)'}
              </text>

              {/* X Axis Time Marks (0, 2, 4, 6, 8s) */}
              {[0, 2, 4, 6, 8].map((tVal) => {
                const xCoord = 35 + (tVal / maxPlotT) * 275;
                return (
                  <text key={`tx-${tVal}`} x={xCoord} y="171" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="middle">
                    {tVal}s
                  </text>
                );
              })}

              {/* Saved Run Comparison Curve (if stored) */}
              {savedRun && activeGraphTab === 'a-t' && (
                <path
                  d={savedRun.data
                    .map((pt, idx) => {
                      const cx = 35 + (pt.t / maxPlotT) * 275;
                      const cy = 160 - (pt.a / maxPlotA) * 140;
                      return `${idx === 0 ? 'M' : 'L'} ${cx},${cy}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="1.8"
                  strokeDasharray="3 2"
                  opacity="0.8"
                />
              )}

              {/* Active History Plot Line */}
              {history.length > 1 && (
                <path
                  d={history
                    .map((pt, idx) => {
                      const cx = 35 + (pt.t / maxPlotT) * 275;
                      const val = activeGraphTab === 'a-t' ? pt.a : activeGraphTab === 'v-t' ? pt.v : pt.F;
                      const maxVal =
                        activeGraphTab === 'a-t'
                          ? maxPlotA
                          : activeGraphTab === 'v-t'
                          ? Math.max(30, currentVelocity * 1.2)
                          : Math.max(100, baseF_netMax);
                      const cy = 160 - (val / (maxVal || 1)) * 140;
                      return `${idx === 0 ? 'M' : 'L'} ${cx},${cy}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke={activeGraphTab === 'a-t' ? '#f59e0b' : activeGraphTab === 'v-t' ? '#38bdf8' : '#10b981'}
                  strokeWidth="2.5"
                />
              )}

              {/* Current Cursor Marker */}
              {history.length > 0 && (
                <circle
                  cx={35 + (simTime / maxPlotT) * 275}
                  cy={
                    160 -
                    ((activeGraphTab === 'a-t'
                      ? currentAcceleration
                      : activeGraphTab === 'v-t'
                      ? currentVelocity
                      : currentAppliedForce) /
                      (activeGraphTab === 'a-t'
                        ? maxPlotA
                        : activeGraphTab === 'v-t'
                        ? Math.max(30, currentVelocity * 1.2)
                        : Math.max(100, baseF_netMax))) *
                      140
                  }
                  r="4"
                  fill="#ffffff"
                  stroke={activeGraphTab === 'a-t' ? '#f59e0b' : activeGraphTab === 'v-t' ? '#38bdf8' : '#10b981'}
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>

          {/* Graph Legend & Comparison Button */}
          <div className="flex items-center justify-between text-xs font-mono mt-2 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-0.5 bg-amber-400 inline-block"></span> Current Run (m={mass}kg)
              </span>
              {savedRun && (
                <span className="flex items-center gap-1 text-pink-400">
                  <span className="w-2.5 h-0.5 bg-pink-400 border-dashed inline-block"></span> Compare Run (m={savedRun.mass}kg)
                </span>
              )}
            </div>

            <button
              onClick={saveCurrentRun}
              disabled={history.length === 0}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-[11px] transition"
            >
              Pin Run for Comparison
            </button>
          </div>
        </div>
      </div>

      {/* Direct Parameter Manipulation Sliders */}
      <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Dynamic Factors Varying Acceleration (F_net = m·a)
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (simTime >= 8.0) resetSim();
                setIsPlaying(!isPlaying);
              }}
              className="px-4 py-1.5 rounded-xl font-bold font-mono text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5 shadow-md shadow-amber-400/20 transition cursor-pointer"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              {isPlaying ? 'Pause' : simTime >= 8 ? 'Replay' : 'Run Simulation'}
            </button>
            <button
              onClick={resetSim}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Interactive Factor Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Factor 1: Applied Force */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300 font-medium">Applied Base Force (F):</span>
              <span className="text-emerald-400 font-bold text-sm">{baseForce} N</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="2"
              value={baseForce}
              onChange={(e) => {
                setBaseForce(Number(e.target.value));
                resetSim();
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>10 N</span>
              <span>50 N</span>
              <span>100 N</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Doubling force F with constant mass m <strong>doubles acceleration</strong> a = F/m.
            </p>
          </div>

          {/* Factor 2: Inertial Mass */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300 font-medium">Inertial Mass (m):</span>
              <span className="text-cyan-400 font-bold text-sm">{mass} kg</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={mass}
              onChange={(e) => {
                setMass(Number(e.target.value));
                resetSim();
              }}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>2 kg (Light)</span>
              <span>15 kg</span>
              <span>30 kg (Heavy)</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Doubling mass m with constant force F <strong>halves acceleration</strong> a = F/(2m).
            </p>
          </div>

          {/* Factor 3: Surface Friction */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-slate-300 font-medium">Kinetic Friction Coeff (μ):</span>
              <span className="text-rose-400 font-bold text-sm">{frictionCoeff.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.5"
              step="0.05"
              value={frictionCoeff}
              onChange={(e) => {
                setFrictionCoeff(Number(e.target.value));
                resetSim();
              }}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.00 (Frictionless)</span>
              <span>0.25</span>
              <span>0.50 (Rough)</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Friction opposes motion with force f = μ·N, subtracting from applied drive force.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const baseF_netMax = 120;
