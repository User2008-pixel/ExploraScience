import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Play, Pause, RotateCcw, Crosshair, Sliders, Globe } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface ProjectileMotionSimProps {
  velocity?: number;
  angle?: number;
  gravity?: number;
  initialHeight?: number;
}

const CELESTIAL_BODIES = [
  { name: 'Earth (9.8 m/s²)', g: 9.8 },
  { name: 'Moon (1.62 m/s²)', g: 1.62 },
  { name: 'Mars (3.72 m/s²)', g: 3.72 },
  { name: 'Jupiter (24.79 m/s²)', g: 24.79 },
];

export const ProjectileMotionSim: React.FC<ProjectileMotionSimProps> = ({
  velocity: propV = 25,
  angle: propA = 45,
  gravity: propG = 9.8,
  initialHeight: propH = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct interactive state
  const [velocity, setVelocity] = useState<number>(propV);
  const [angle, setAngle] = useState<number>(propA);
  const [gravity, setGravity] = useState<number>(propG);
  const [initialHeight, setInitialHeight] = useState<number>(propH);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const angleRad = (angle * Math.PI) / 180;
  const vx0 = velocity * Math.cos(angleRad);
  const vy0 = velocity * Math.sin(angleRad);

  // Exact kinematic solutions
  const flightTime = (vy0 + Math.sqrt(vy0 * vy0 + 2 * gravity * initialHeight)) / gravity;
  const maxHeight = initialHeight + (vy0 > 0 ? (vy0 * vy0) / (2 * gravity) : 0);
  const range = vx0 * flightTime;

  // Animation frame loop
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const startTime = performance.now() - currentTime * 1000;
      const step = (now: number) => {
        const elapsed = (now - startTime) / 1000;
        if (elapsed >= flightTime) {
          setCurrentTime(flightTime);
          setIsPlaying(false);
        } else {
          setCurrentTime(elapsed);
          animId = requestAnimationFrame(step);
        }
      };
      animId = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, flightTime, currentTime]);

  // Current position
  const currentX = vx0 * currentTime;
  const currentY = Math.max(0, initialHeight + vy0 * currentTime - 0.5 * gravity * currentTime * currentTime);
  const currentVy = vy0 - gravity * currentTime;
  const currentSpeed = Math.sqrt(vx0 * vx0 + currentVy * currentVy);

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
    ctx.save();
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // View boundaries in physical meters
    const maxWorldX = Math.max(50, range * 1.15);
    const maxWorldY = Math.max(25, maxHeight * 1.25);

    const padLeft = 45;
    const padBottom = 35;
    const padTop = 20;
    const padRight = 20;

    const simW = w - padLeft - padRight;
    const simH = h - padTop - padBottom;

    const toScreenX = (x: number) => padLeft + (x / maxWorldX) * simW;
    const toScreenY = (y: number) => padTop + simH - (y / maxWorldY) * simH;

    ctx.clearRect(0, 0, w, h);

    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#090e1a');
    skyGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    const numXGrid = 6;
    for (let i = 0; i <= numXGrid; i++) {
      const wx = (i / numXGrid) * maxWorldX;
      const sx = toScreenX(wx);
      ctx.beginPath();
      ctx.moveTo(sx, padTop);
      ctx.lineTo(sx, padTop + simH);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${wx.toFixed(0)}m`, sx, padTop + simH + 14);
    }

    const numYGrid = 4;
    for (let i = 0; i <= numYGrid; i++) {
      const wy = (i / numYGrid) * maxWorldY;
      const sy = toScreenY(wy);
      ctx.beginPath();
      ctx.moveTo(padLeft, sy);
      ctx.lineTo(padLeft + simW, sy);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${wy.toFixed(0)}m`, padLeft - 6, sy + 3);
    }

    // Ground plane
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, padTop + simH, w, padBottom);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, padTop + simH);
    ctx.lineTo(w, padTop + simH);
    ctx.stroke();

    // Launch cliff / platform if initialHeight > 0
    if (initialHeight > 0) {
      const cliffRight = toScreenX(0);
      const cliffTop = toScreenY(initialHeight);
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, cliffTop, cliffRight, padTop + simH - cliffTop);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(0, cliffTop, cliffRight, padTop + simH - cliffTop);
    }

    // Theoretical parabolic trajectory curve
    ctx.beginPath();
    const steps = 80;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * flightTime;
      const px = vx0 * t;
      const py = Math.max(0, initialHeight + vy0 * t - 0.5 * gravity * t * t);
      const sx = toScreenX(px);
      const sy = toScreenY(py);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Path traveled so far
    ctx.beginPath();
    const curSteps = Math.max(2, Math.round((currentTime / flightTime) * steps));
    for (let i = 0; i <= curSteps; i++) {
      const t = (i / curSteps) * currentTime;
      const px = vx0 * t;
      const py = Math.max(0, initialHeight + vy0 * t - 0.5 * gravity * t * t);
      const sx = toScreenX(px);
      const sy = toScreenY(py);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Projectile position
    const ballSx = toScreenX(currentX);
    const ballSy = toScreenY(currentY);

    // Ball glow
    const ballGrad = ctx.createRadialGradient(ballSx, ballSy, 1, ballSx, ballSy, 10);
    ballGrad.addColorStop(0, '#fef08a');
    ballGrad.addColorStop(0.6, '#eab308');
    ballGrad.addColorStop(1, '#ca8a04');
    ctx.fillStyle = ballGrad;
    ctx.beginPath();
    ctx.arc(ballSx, ballSy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Velocity vector arrows
    const vecScale = 1.2;
    ctx.beginPath();
    ctx.moveTo(ballSx, ballSy);
    ctx.lineTo(ballSx + vx0 * vecScale, ballSy - currentVy * vecScale);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  }, [
    velocity,
    angle,
    gravity,
    initialHeight,
    currentTime,
    currentX,
    currentY,
    currentVy,
    flightTime,
    maxHeight,
    range,
    vx0,
    vy0,
  ]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <canvas ref={canvasRef} className="w-full h-72 sm:h-80 block" />

        {/* Playback Controls & Live Readouts */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-medium text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-sm"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause' : currentTime >= flightTime ? 'Replay' : 'Launch'}
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentTime(0);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Reset simulation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono text-slate-400 pl-2">
              t = <span className="text-cyan-300 font-bold">{currentTime.toFixed(2)}</span> / {flightTime.toFixed(2)} s
            </span>
          </div>

          {/* Real-time telemetry */}
          <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
            <div>
              <span className="text-slate-500">x: </span>
              <span className="text-cyan-300 font-bold">{currentX.toFixed(1)}</span> m
            </div>
            <div>
              <span className="text-slate-500">y: </span>
              <span className="text-cyan-300 font-bold">{currentY.toFixed(1)}</span> m
            </div>
            <div>
              <span className="text-slate-500">|v|: </span>
              <span className="text-amber-300 font-bold">{currentSpeed.toFixed(1)}</span> m/s
            </div>
          </div>
        </div>
      </div>

      {/* Direct Manipulation Sliders & Presets */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Kinematics & Ballistic Trajectory Manipulator
            </h4>
          </div>
          <span className="text-xs text-cyan-400 font-mono font-bold bg-cyan-950/80 border border-cyan-800 px-2.5 py-0.5 rounded-full">
            Range: {range.toFixed(1)} m • Apex: {maxHeight.toFixed(1)} m
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">Launch Speed (v₀):</span>
              <span className="font-mono font-bold text-sky-400">{velocity} m/s</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={velocity}
              onChange={(e) => {
                setVelocity(parseInt(e.target.value));
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-yellow-300 font-medium">Launch Angle (θ):</span>
              <span className="font-mono font-bold text-yellow-400">{angle}°</span>
            </div>
            <input
              type="range"
              min="5"
              max="85"
              step="1"
              value={angle}
              onChange={(e) => {
                setAngle(parseInt(e.target.value));
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              className="w-full accent-yellow-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-medium">Gravity (g):</span>
              <span className="font-mono font-bold text-emerald-400">{gravity} m/s²</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="25.0"
              step="0.1"
              value={gravity}
              onChange={(e) => {
                setGravity(parseFloat(e.target.value));
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-purple-300 font-medium">Cliff Height (y₀):</span>
              <span className="font-mono font-bold text-purple-400">{initialHeight} m</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={initialHeight}
              onChange={(e) => {
                setInitialHeight(parseInt(e.target.value));
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              className="w-full accent-purple-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Celestial Gravity Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Planetary Gravity:
            </span>
            {CELESTIAL_BODIES.map((b) => (
              <button
                key={b.name}
                onClick={() => {
                  setGravity(b.g);
                  setCurrentTime(0);
                  setIsPlaying(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-xs transition ${
                  gravity === b.g
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setVelocity(25);
              setAngle(45);
              setGravity(9.8);
              setInitialHeight(0);
              setCurrentTime(0);
              setIsPlaying(false);
            }}
            className="text-xs px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Earth 45°
          </button>
        </div>
      </div>

      {/* Real-time Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GraphViewer
          title="Trajectory: Height vs Distance"
          xLabel="x"
          yLabel="y"
          xUnit="m"
          yUnit="m"
          xDomain={[0, Math.ceil(range * 1.1)]}
          yDomain={[0, Math.ceil(maxHeight * 1.2)]}
          curveFunction={(x) => {
            const tanA = Math.tan(angleRad);
            const cosA = Math.cos(angleRad);
            return initialHeight + x * tanA - (gravity * x * x) / (2 * velocity * velocity * cosA * cosA);
          }}
          currentMarker={{ x: currentX, y: currentY }}
          height={170}
        />
        <GraphViewer
          title="Kinematic Phase: Vertical Velocity vs Time"
          xLabel="t"
          yLabel="v_y(t)"
          xUnit="s"
          yUnit="m/s"
          xDomain={[0, Math.ceil(flightTime * 1.1)]}
          yDomain={[-Math.ceil(Math.abs(vy0 - gravity * flightTime) * 1.1), Math.ceil(vy0 * 1.1)]}
          curveFunction={(t) => vy0 - gravity * t}
          currentMarker={{ x: currentTime, y: currentVy }}
          curveColor="#06b6d4"
          height={170}
        />
      </div>

      {/* Kinematics Formula Breakdown in LaTeX */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Live Mathematical Derivation
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Max Horizontal Range (R)</div>
            <Formula tex={`R = \\frac{v_0^2 \\sin(2\\theta)}{g} = ${range.toFixed(2)}\\text{ m}`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Apex Altitude (H_max)</div>
            <Formula tex={`H = \\frac{v_0^2 \\sin^2\\theta}{2g} = ${maxHeight.toFixed(2)}\\text{ m}`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Total Flight Duration (t)</div>
            <Formula tex={`t_{\\text{flight}} = \\frac{2v_0 \\sin\\theta}{g} = ${flightTime.toFixed(2)}\\text{ s}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
