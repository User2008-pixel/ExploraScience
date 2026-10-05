import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Play, Pause, RotateCcw, Activity, Sliders, Zap } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface NewtonSecondLawSimProps {
  appliedForce?: number;
  mass?: number;
  frictionCoeff?: number;
}

const SURFACE_PRESETS = [
  { name: 'Frictionless Air Track (μ = 0)', mu: 0.0 },
  { name: 'Smooth Ice (μ = 0.05)', mu: 0.05 },
  { name: 'Polished Wood (μ = 0.25)', mu: 0.25 },
  { name: 'Rubber on Asphalt (μ = 0.65)', mu: 0.65 },
];

export const NewtonSecondLawSim: React.FC<NewtonSecondLawSimProps> = ({
  appliedForce: propF = 35,
  mass: propM = 10,
  frictionCoeff: propMu = 0.2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [appliedForce, setAppliedForce] = useState<number>(propF);
  const [mass, setMass] = useState<number>(propM);
  const [frictionCoeff, setFrictionCoeff] = useState<number>(propMu);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);

  const g = 9.8;
  const normalForce = mass * g;
  const frictionForce = frictionCoeff * normalForce;
  const isMovingForward = appliedForce > frictionForce;
  const netForce = isMovingForward ? appliedForce - frictionForce : 0;
  const acceleration = netForce / mass;

  // Kinetic variables
  const currentVelocity = acceleration * simTime;
  const currentDisplacement = 0.5 * acceleration * simTime * simTime;

  // Animation frame loop
  useEffect(() => {
    let animId: number;
    if (isPlaying && acceleration > 0) {
      let lastTime = performance.now();
      const step = (now: number) => {
        const dt = (now - lastTime) / 1000;
        lastTime = now;
        setSimTime((prev) => {
          if (prev >= 10) {
            setIsPlaying(false);
            return 10;
          }
          return prev + dt;
        });
        animId = requestAnimationFrame(step);
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, acceleration]);

  // Render canvas
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

    const floorY = h * 0.72;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Surface texture
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
    const meterScale = 25;
    const trackOffset = (currentDisplacement * meterScale) % 50;
    for (let x = -trackOffset; x < w; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, floorY);
      ctx.lineTo(x, floorY + 8);
      ctx.stroke();
    }

    // Box position on screen
    const boxW = Math.max(50, Math.min(100, 40 + mass * 2.5));
    const boxH = Math.max(40, Math.min(80, 35 + mass * 2));
    const boxX = w * 0.35;
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

    ctx.fillStyle = '#f8fafc';
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
      ctx.fillText(label, toX + Math.cos(angle) * 14, toY + Math.sin(angle) * 14);
    };

    // 1. Applied Force Right
    if (appliedForce > 0) {
      const fLen = Math.min(80, Math.max(15, appliedForce * 1.5));
      drawVector(boxX + boxW, centerY, boxX + boxW + fLen, centerY, '#10b981', `F_app=${appliedForce}N`);
    }

    // 2. Friction Force Left
    if (frictionForce > 0 && appliedForce > 0) {
      const fricLen = Math.min(70, Math.max(12, frictionForce * 1.5));
      drawVector(boxX, centerY, boxX - fricLen, centerY, '#ef4444', `f_k=${frictionForce.toFixed(1)}N`);
    }

    // 3. Normal Force Up
    drawVector(centerX, boxY, centerX, boxY - 35, '#38bdf8', `N=${normalForce.toFixed(0)}N`);

    // 4. Gravity Down
    drawVector(centerX, boxY + boxH, centerX, boxY + boxH + 35, '#f59e0b', `W=mg`);

    ctx.restore();
  }, [appliedForce, mass, frictionCoeff, currentDisplacement, normalForce, frictionForce]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-72 block" />

        {/* Playback Controls & Live Readouts */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={!isMovingForward}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-medium text-xs bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 transition shadow-sm"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : simTime >= 10 ? 'Replay' : 'Accelerate'}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setSimTime(0);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-400 pl-2">
              t = <span className="text-cyan-300 font-bold">{simTime.toFixed(2)}</span> s
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-500">v: </span>
              <span className="text-cyan-300 font-bold">{currentVelocity.toFixed(1)}</span> m/s
            </div>
            <div>
              <span className="text-slate-500">x: </span>
              <span className="text-emerald-400 font-bold">{currentDisplacement.toFixed(1)}</span> m
            </div>
            <div>
              <span className="text-slate-500">a: </span>
              <span className="text-amber-300 font-bold">{acceleration.toFixed(2)}</span> m/s²
            </div>
          </div>
        </div>
      </div>

      {/* Direct Manipulation Sliders & Controls */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Newton&apos;s Second Law (F_net = m·a) Manipulator
            </h4>
          </div>
          <span className="text-xs text-yellow-400 font-mono font-bold bg-yellow-950/80 border border-yellow-800 px-2.5 py-0.5 rounded-full">
            {isMovingForward ? `F_net = ${netForce.toFixed(1)} N (Accelerating)` : 'Static (F_app ≤ f_friction)'}
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-medium">Applied Force (F_app):</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">{appliedForce} N</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={appliedForce}
              onChange={(e) => {
                setAppliedForce(parseInt(e.target.value));
                setSimTime(0);
                setIsPlaying(false);
              }}
              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 N</span>
              <span>50 N</span>
              <span>100 N</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">Inertial Mass (m):</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{mass.toFixed(1)} kg</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={mass}
              onChange={(e) => {
                setMass(parseFloat(e.target.value));
                setSimTime(0);
                setIsPlaying(false);
              }}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 kg</span>
              <span>15 kg</span>
              <span>30 kg</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-rose-300 font-medium">Friction Coefficient (μ):</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{frictionCoeff.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.05"
              value={frictionCoeff}
              onChange={(e) => {
                setFrictionCoeff(parseFloat(e.target.value));
                setSimTime(0);
                setIsPlaying(false);
              }}
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.00 (Frictionless)</span>
              <span>0.40</span>
              <span>0.80 (Rough)</span>
            </div>
          </div>
        </div>

        {/* Surface Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Surface Presets:</span>
            {SURFACE_PRESETS.map((sp) => (
              <button
                key={sp.name}
                onClick={() => {
                  setFrictionCoeff(sp.mu);
                  setSimTime(0);
                  setIsPlaying(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs transition ${
                  frictionCoeff === sp.mu
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {sp.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setAppliedForce(35);
              setMass(10);
              setFrictionCoeff(0.2);
              setSimTime(0);
              setIsPlaying(false);
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
          <span className="text-slate-400 block mb-0.5">Linear Acceleration (a)</span>
          <div className="text-lg font-mono font-bold text-amber-300">{acceleration.toFixed(2)} m/s²</div>
          <span className="text-[10px] text-slate-500">a = F_net / m</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Net Drive Force (F_net)</span>
          <div className="text-lg font-mono font-bold text-emerald-400">{netForce.toFixed(1)} N</div>
          <span className="text-[10px] text-slate-500">F_net = F_app - μmg</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Kinetic Friction Force</span>
          <div className="text-lg font-mono font-bold text-rose-400">{frictionForce.toFixed(1)} N</div>
          <span className="text-[10px] text-slate-500">f_k = μ · N</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Newton&apos;s Second Law</span>
          <div className="mt-1">
            <Formula tex="\sum \vec{F} = m \vec{a}" />
          </div>
        </div>
      </div>
    </div>
  );
};
