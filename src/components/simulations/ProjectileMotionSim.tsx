import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Play, Pause, RotateCcw, Crosshair } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface ProjectileMotionSimProps {
  velocity: number;
  angle: number;
  gravity: number;
  initialHeight: number;
}

export const ProjectileMotionSim: React.FC<ProjectileMotionSimProps> = ({
  velocity,
  angle,
  gravity,
  initialHeight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const angleRad = (angle * Math.PI) / 180;
  const vx0 = velocity * Math.cos(angleRad);
  const vy0 = velocity * Math.sin(angleRad);

  // Exact kinematic solutions
  // y(t) = y0 + vy0*t - 0.5*g*t^2 = 0
  // 0.5*g*t^2 - vy0*t - y0 = 0
  const flightTime = (vy0 + Math.sqrt(vy0 * vy0 + 2 * gravity * initialHeight)) / gravity;
  const timeToPeak = vy0 / gravity;
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
  }, [isPlaying, flightTime]);

  // Reset when initial parameters change significantly
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
  }, [velocity, angle, gravity, initialHeight]);

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
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
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

    // Clear
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

    // Ground platform
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(padLeft, padTop + simH, simW, padBottom);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop + simH);
    ctx.lineTo(padLeft + simW, padTop + simH);
    ctx.stroke();

    // Launch cliff/stand
    if (initialHeight > 0) {
      const standRight = toScreenX(0);
      const standTop = toScreenY(initialHeight);
      ctx.fillStyle = '#334155';
      ctx.fillRect(padLeft - 20, standTop, 20, padTop + simH - standTop);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(padLeft - 20, standTop, 20, padTop + simH - standTop);
    }

    // Trajectory theoretical path (dashed)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * flightTime;
      const x = vx0 * t;
      const y = Math.max(0, initialHeight + vy0 * t - 0.5 * gravity * t * t);
      const sx = toScreenX(x);
      const sy = toScreenY(y);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Actual covered trajectory up to currentTime
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const coveredSteps = Math.max(2, Math.floor((currentTime / flightTime) * steps));
    for (let i = 0; i <= coveredSteps; i++) {
      const t = (i / steps) * flightTime;
      const x = vx0 * t;
      const y = Math.max(0, initialHeight + vy0 * t - 0.5 * gravity * t * t);
      const sx = toScreenX(x);
      const sy = toScreenY(y);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Apex marker
    if (maxHeight > initialHeight) {
      const apexX = vx0 * timeToPeak;
      const apexSx = toScreenX(apexX);
      const apexSy = toScreenY(maxHeight);
      ctx.strokeStyle = '#f59e0b';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(apexSx, toScreenY(0));
      ctx.lineTo(apexSx, apexSy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(apexSx, apexSy, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`H_max = ${maxHeight.toFixed(1)}m`, apexSx, apexSy - 8);
    }

    // Range landing marker
    const landingSx = toScreenX(range);
    const landingSy = toScreenY(0);
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(landingSx, landingSy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`R = ${range.toFixed(1)}m`, landingSx, landingSy + 24);

    // Current Projectile Ball
    const projSx = toScreenX(currentX);
    const projSy = toScreenY(currentY);

    // Projectile glow
    const glow = ctx.createRadialGradient(projSx, projSy, 2, projSx, projSy, 14);
    glow.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
    glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(projSx, projSy, 14, 0, Math.PI * 2);
    ctx.fill();

    // Projectile core
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(projSx, projSy, 5, 0, Math.PI * 2);
    ctx.fill();

    // Velocity Vectors Overlay
    const vectorScale = 1.2;
    // Horizontal vector v_x (green)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(projSx, projSy);
    ctx.lineTo(projSx + vx0 * vectorScale, projSy);
    ctx.stroke();

    // Vertical vector v_y (cyan)
    ctx.strokeStyle = '#06b6d4';
    ctx.beginPath();
    ctx.moveTo(projSx, projSy);
    ctx.lineTo(projSx, projSy - currentVy * vectorScale);
    ctx.stroke();

    // Net Velocity vector v (amber)
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(projSx, projSy);
    ctx.lineTo(projSx + vx0 * vectorScale, projSy - currentVy * vectorScale);
    ctx.stroke();

    // Gravity vector g pointing strictly downward (rose)
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(projSx, projSy);
    ctx.lineTo(projSx, projSy + (gravity * 2));
    ctx.stroke();

  }, [currentTime, velocity, angle, gravity, initialHeight, range, maxHeight, flightTime, currentX, currentY, currentVy, vx0, vy0, timeToPeak]);

  return (
    <div className="space-y-4">
      {/* Visual Canvas */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">Kinematic Ballistics Simulator</span>
        </div>

        {/* Live Vector Legend */}
        <div className="absolute top-3 right-3 z-10 hidden sm:flex items-center gap-3 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2.5 h-0.5 bg-amber-400 inline-block"></span>
            <Formula tex="\vec{v}" inline /> Net
          </span>
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span>
            <Formula tex="v_x" inline />
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span>
            <Formula tex="v_y" inline />
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2.5 h-0.5 bg-rose-400 inline-block"></span>
            <Formula tex="\vec{g}" inline />
          </span>
        </div>

        <canvas
          ref={canvasRef}
          className="w-full h-72 sm:h-80 block"
        />

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

      {/* Real-time Graphs (Trajectory y vs x & Vertical velocity vy vs t) */}
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
            // Trajectory equation: y(x) = y0 + x*tan(theta) - (g*x^2)/(2*v0^2*cos^2(theta))
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
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Mathematical Derivation</h4>
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
