import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface NewtonSecondLawSimProps {
  appliedForce: number;
  mass: number;
  frictionCoeff: number;
}

export const NewtonSecondLawSim: React.FC<NewtonSecondLawSimProps> = ({
  appliedForce,
  mass,
  frictionCoeff,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simTime, setSimTime] = useState(0);

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

  useEffect(() => {
    setSimTime(0);
    setIsPlaying(false);
  }, [appliedForce, mass, frictionCoeff]);

  // Render canvas
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

    // Floor track
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
    const meterScale = 25; // 25 px = 1 meter
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
    const boxX = w * 0.35; // centered observation frame
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

    // Mass label inside box
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

      // Arrow head
      const headlen = 8;
      const angle = Math.atan2(toY - fromY, toX - fromX);
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
      ctx.fill();

      // Label
      ctx.font = '11px monospace';
      ctx.fillText(label, toX + Math.cos(angle) * 16, toY + Math.sin(angle) * 16);
    };

    // Vector scaling: 1 N = 1.2 px
    const scale = 1.1;

    // 1. Normal Force N (upwards)
    drawVector(centerX, boxY, centerX, boxY - Math.min(70, normalForce * scale * 0.35), '#38bdf8', `N = ${(normalForce).toFixed(0)}N`);

    // 2. Weight W = mg (downwards)
    drawVector(centerX, boxY + boxH, centerX, boxY + boxH + Math.min(70, normalForce * scale * 0.35), '#94a3b8', `W = ${(normalForce).toFixed(0)}N`);

    // 3. Applied Force F_app (rightwards)
    if (appliedForce > 0) {
      drawVector(boxX + boxW, centerY, boxX + boxW + Math.min(130, appliedForce * scale), centerY, '#10b981', `F_app = ${appliedForce}N`);
    }

    // 4. Friction Force f_k (leftwards)
    if (frictionForce > 0) {
      drawVector(boxX, floorY, boxX - Math.min(100, frictionForce * scale), floorY, '#f43f5e', `f_k = ${frictionForce.toFixed(1)}N`);
    }

    // 5. Net Acceleration Vector a (amber, above box)
    if (acceleration > 0) {
      drawVector(centerX, boxY - 30, centerX + Math.min(100, acceleration * 12), boxY - 30, '#f59e0b', `a = ${acceleration.toFixed(2)} m/s²`);
    } else {
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('Static (F_app ≤ f_s)', centerX, boxY - 24);
    }

  }, [mass, appliedForce, frictionCoeff, normalForce, frictionForce, acceleration, currentDisplacement]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">Free Body Dynamics & Newton's Second Law</span>
        </div>

        <canvas ref={canvasRef} className="w-full h-64 sm:h-72 block" />

        {/* Telemetry Bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={acceleration <= 0}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-medium text-xs bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 transition shadow-sm"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : 'Accelerate'}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setSimTime(0);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset"
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
              <span className="text-emerald-400 font-bold">{currentVelocity.toFixed(1)}</span> m/s
            </div>
            <div>
              <span className="text-slate-500">d: </span>
              <span className="text-cyan-300 font-bold">{currentDisplacement.toFixed(1)}</span> m
            </div>
            <div>
              <span className="text-slate-500">a: </span>
              <span className="text-amber-400 font-bold">{acceleration.toFixed(2)}</span> m/s²
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Graph */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GraphViewer
          title="Kinetic Speed Profile: v vs t"
          xLabel="t"
          yLabel="v(t)"
          xUnit="s"
          yUnit="m/s"
          xDomain={[0, 10]}
          yDomain={[0, Math.max(10, Math.ceil(acceleration * 10))]}
          curveFunction={(t) => acceleration * t}
          currentMarker={{ x: simTime, y: currentVelocity }}
          curveColor="#10b981"
          height={160}
        />
        <GraphViewer
          title="Work-Energy: Displacement vs Time"
          xLabel="t"
          yLabel="x(t)"
          xUnit="s"
          yUnit="m"
          xDomain={[0, 10]}
          yDomain={[0, Math.max(20, Math.ceil(0.5 * acceleration * 100))]}
          curveFunction={(t) => 0.5 * acceleration * t * t}
          currentMarker={{ x: simTime, y: currentDisplacement }}
          curveColor="#38bdf8"
          height={160}
        />
      </div>

      {/* Live Force Equation in LaTeX */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Dynamical Equations</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Kinetic Friction Force</div>
            <Formula tex={`f_k = \\mu_k m g = ${frictionForce.toFixed(2)}\\text{ N}`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Net Unbalanced Force</div>
            <Formula tex={`F_{\\text{net}} = F - f_k = ${netForce.toFixed(2)}\\text{ N}`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Resulting Acceleration</div>
            <Formula tex={`a = \\frac{F_{\\text{net}}}{m} = ${acceleration.toFixed(2)}\\text{ m/s}^2`} />
          </div>
        </div>
      </div>
    </div>
  );
};
