import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Play, Pause, RotateCcw, Sliders, Activity, TrendingUp, Compass, Zap, BarChart2, BookOpen, Navigation, Hand } from 'lucide-react';

interface KinematicEquationsSimProps {
  initialSpeedU?: number;
  accelerationA?: number;
  timeT?: number;
}

type SimViewMode = 'linear-path' | 'v-t-derivation' | 's-t-graph';

export const KinematicEquationsSim: React.FC<KinematicEquationsSimProps> = ({
  initialSpeedU = 0,
  accelerationA = 2.0,
  timeT = 6,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive State
  const [u, setU] = useState<number>(initialSpeedU);
  const [a, setA] = useState<number>(accelerationA);
  const [tMax, setTMax] = useState<number>(timeT);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [viewMode, setViewMode] = useState<SimViewMode>('v-t-derivation'); // default to v-t graph for easy interactive dragging

  // Dragging state for interactive graph
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);

  // Kinematic calculations at currentTime
  const currentV = u + a * currentTime;
  const currentS = u * currentTime + 0.5 * a * currentTime * currentTime;

  // Final values at tMax
  const finalV = u + a * tMax;
  const finalS = u * tMax + 0.5 * a * tMax * tMax;
  const vSqMinusUsd = u * u + 2 * a * finalS;

  const resetSim = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (timestamp: number) => {
      const dtRaw = (timestamp - lastTime) / 1000;
      lastTime = timestamp;
      const dt = Math.min(dtRaw, 0.05) * simSpeed;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + dt;
          if (next >= tMax) {
            setIsPlaying(false);
            return tMax;
          }
          return next;
        });
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, simSpeed, tMax]);

  // Canvas Drawing & Interactive Dragging Handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#070e1c';
    ctx.fillRect(0, 0, width, height);

    if (viewMode === 'linear-path') {
      // 1D Straight Line Motion Path
      const roadY = height / 2 - 10;
      const roadLength = width - 80;
      const maxDistance = Math.max(50, finalS * 1.15);

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(40, roadY);
      ctx.lineTo(width - 40, roadY);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      for (let i = 0; i <= 5; i++) {
        const dVal = (i / 5) * maxDistance;
        const xPos = 40 + (dVal / maxDistance) * roadLength;
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xPos, roadY - 8);
        ctx.lineTo(xPos, roadY + 8);
        ctx.stroke();
        ctx.fillText(`${dVal.toFixed(0)}m`, xPos, roadY + 24);
      }

      const currentPosPx = 40 + Math.min(roadLength, (currentS / maxDistance) * roadLength);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.beginPath();
      ctx.ellipse(currentPosPx, roadY + 16, 22, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(currentPosPx - 24, roadY - 18, 48, 24, 6);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(currentPosPx - 14, roadY + 8, 5, 0, Math.PI * 2);
      ctx.arc(currentPosPx + 14, roadY + 8, 5, 0, Math.PI * 2);
      ctx.fill();

      const arrowLength = Math.min(60, Math.max(15, currentV * 3));
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(currentPosPx, roadY - 26);
      ctx.lineTo(currentPosPx + arrowLength, roadY - 26);
      ctx.lineTo(currentPosPx + arrowLength - 6, roadY - 30);
      ctx.moveTo(currentPosPx + arrowLength, roadY - 26);
      ctx.lineTo(currentPosPx + arrowLength - 6, roadY - 22);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`v = ${currentV.toFixed(1)} m/s`, currentPosPx, roadY - 38);

    } else {
      const graphX = 65;
      const graphY = 35;
      const graphW = width - 95;
      const graphH = height - 75;

      ctx.fillStyle = '#0e1726';
      ctx.fillRect(graphX, graphY, graphW, graphH);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;

      for (let i = 0; i <= 5; i++) {
        const gx = graphX + (i / 5) * graphW;
        ctx.beginPath();
        ctx.moveTo(gx, graphY);
        ctx.lineTo(gx, graphY + graphH);
        ctx.stroke();

        const gy = graphY + (i / 5) * graphH;
        ctx.beginPath();
        ctx.moveTo(graphX, gy);
        ctx.lineTo(graphX + graphW, gy);
        ctx.stroke();
      }

      if (viewMode === 'v-t-derivation') {
        const maxV = Math.max(35, finalV * 1.15);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${maxV.toFixed(0)} v`, graphX - 8, graphY + 12);
        ctx.fillText(`${u.toFixed(0)} (v₀)`, graphX - 8, graphY + graphH - (u / maxV) * graphH + 4);
        ctx.fillText('0', graphX - 8, graphY + graphH + 4);

        ctx.textAlign = 'center';
        ctx.fillText('0', graphX, graphY + graphH + 18);
        ctx.fillText(`t = ${tMax}s`, graphX + graphW, graphY + graphH + 18);
        ctx.fillText('Time (t)', graphX + graphW / 2, graphY + graphH + 32);

        // Shaded Area (Distance s)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.beginPath();
        ctx.moveTo(graphX, graphY + graphH);
        for (let step = 0; step <= 50; step++) {
          const simT = (step / 50) * tMax;
          const simV = u + a * simT;
          const px = graphX + (simT / tMax) * graphW;
          const py = graphY + graphH - (simV / maxV) * graphH;
          if (step === 0) ctx.lineTo(graphX, graphY + graphH - (u / maxV) * graphH);
          ctx.lineTo(px, py);
        }
        ctx.lineTo(graphX + graphW, graphY + graphH);
        ctx.closePath();
        ctx.fill();

        // Plot Line v = u + at
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let step = 0; step <= 50; step++) {
          const simT = (step / 50) * tMax;
          const simV = u + a * simT;
          const px = graphX + (simT / tMax) * graphW;
          const py = graphY + graphH - (simV / maxV) * graphH;
          if (step === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Interactive Drag Handles at Start (t=0) and End (t=tMax)
        const startX = graphX;
        const startY = graphY + graphH - (u / maxV) * graphH;
        const endX = graphX + graphW;
        const endY = graphY + graphH - (finalV / maxV) * graphH;

        // Draw Draggable Handle 1 (Initial Velocity v₀)
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(startX, startY, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Draggable Handle 2 (Final Velocity v)
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(endX, endY, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('💡 Drag points on graph to modify v₀ & a interactively!', graphX + 10, graphY + 18);

      } else if (viewMode === 's-t-graph') {
        const maxS = Math.max(50, finalS * 1.15);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`${maxS.toFixed(0)} m`, graphX - 8, graphY + 12);
        ctx.fillText('0', graphX - 8, graphY + graphH + 4);

        ctx.textAlign = 'center';
        ctx.fillText('0', graphX, graphY + graphH + 18);
        ctx.fillText(`t = ${tMax}s`, graphX + graphW, graphY + graphH + 18);
        ctx.fillText('Time (t)', graphX + graphW / 2, graphY + graphH + 32);

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let step = 0; step <= 50; step++) {
          const simT = (step / 50) * tMax;
          const simS = u * simT + 0.5 * a * simT * simT;
          const px = graphX + (simT / tMax) * graphW;
          const py = graphY + graphH - (simS / maxS) * graphH;
          if (step === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Distance-Time Parabolic Graph: s = v₀t + ½at²', graphX + graphW / 2, graphY + 18);
      }
    }
  }, [u, a, tMax, currentTime, viewMode, finalV, finalS]);

  // Mouse Interaction Handlers for Dragging Graph Points
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (viewMode !== 'v-t-derivation') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);
    const graphX = 65;
    const graphY = 35;
    const graphW = width - 95;
    const graphH = height - 75;
    const maxV = Math.max(35, finalV * 1.15);

    const startX = graphX;
    const startY = graphY + graphH - (u / maxV) * graphH;
    const endX = graphX + graphW;
    const endY = graphY + graphH - (finalV / maxV) * graphH;

    const distStart = Math.hypot(x - startX, y - startY);
    const distEnd = Math.hypot(x - endX, y - endY);

    if (distStart < 20) {
      setIsDragging('start');
    } else if (distEnd < 20) {
      setIsDragging('end');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const height = canvas.height / (window.devicePixelRatio || 1);
    const graphY = 35;
    const graphH = height - 75;
    const maxV = Math.max(35, finalV * 1.15);

    // Compute velocity from mouse Y position
    const rawV = maxV * (1 - (y - graphY) / graphH);
    const clampedV = Math.max(0, Math.min(30, rawV));

    if (isDragging === 'start') {
      setU(clampedV);
    } else if (isDragging === 'end') {
      // finalV = u + a * tMax => a = (clampedV - u) / tMax
      const newA = Math.max(0.1, Math.min(8.0, (clampedV - u) / tMax));
      setA(newA);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  return (
    <div className="bg-[#070e1c] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Hand className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Interactive Kinematics Graph & Dragging Studio
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                Drag v-t Graph Points
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Directly drag the initial ($v_0$) or final ($v$) velocity handles on the v-t graph to modify acceleration and equations of motion in real time.
            </p>
          </div>
        </div>

        {/* View Mode Toggles */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setViewMode('v-t-derivation')}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              viewMode === 'v-t-derivation' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Interactive v-t Graph
          </button>
          <button
            onClick={() => setViewMode('linear-path')}
            className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1.5 ${
              viewMode === 'linear-path' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            1D Linear Path
          </button>
          <button
            onClick={() => setViewMode('s-t-graph')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              viewMode === 's-t-graph' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            s-t Graph
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport with Mouse Drag Support */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-[#090d16]">
        {viewMode === 'linear-path' && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow ${
                isPlaying ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play Motion'}</span>
            </button>
            <button
              onClick={resetSim}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
              title="Reset Motion"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Live Status Top Right */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="text-cyan-400">v₀ = {u.toFixed(1)} m/s</span>
          <span className="text-amber-400">a = {a.toFixed(2)} m/s²</span>
          <span className="text-emerald-400">s = {finalS.toFixed(1)} m</span>
        </div>

        <canvas
          ref={canvasRef}
          width={760}
          height={260}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`w-full h-64 block select-none ${viewMode === 'v-t-derivation' ? 'cursor-pointer' : ''}`}
        />
      </div>

      {/* Equations & Derivation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">1. Velocity-Time Relation</span>
            <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded">v = v₀ + at</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Final Velocity: <strong className="text-cyan-400 font-mono">{finalV.toFixed(1)} m/s</strong> (at $t = {tMax}$s)
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950/80 font-mono text-[11px] text-cyan-200 border border-slate-800">
            {u.toFixed(1)} + ({a.toFixed(2)} × {tMax}) = {finalV.toFixed(1)} m/s
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">2. Position-Time Relation</span>
            <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">s = v₀t + ½at²</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Total Displacement: <strong className="text-emerald-400 font-mono">{finalS.toFixed(1)} meters</strong>
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950/80 font-mono text-[11px] text-emerald-200 border border-slate-800">
            ({u.toFixed(1)} × {tMax}) + (0.5 × {a.toFixed(2)} × {tMax}²) = {finalS.toFixed(1)}m
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">3. Position-Velocity</span>
            <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">v² = v₀² + 2as</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Velocity Squared Term: <strong className="text-amber-400 font-mono">{vSqMinusUsd.toFixed(1)} m²/s²</strong>
          </p>
          <div className="p-2.5 rounded-xl bg-slate-950/80 font-mono text-[11px] text-amber-200 border border-slate-800">
            ({u.toFixed(1)})² + 2({a.toFixed(2)})({finalS.toFixed(1)}) = {vSqMinusUsd.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Interactive Sliders */}
      <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          Precise Parameter Sliders ($v_0, a, t$)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-300 font-medium">Initial Velocity ($v_0$)</span>
              <span className="font-mono text-cyan-400 font-bold">{u.toFixed(1)} m/s</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={u}
              onChange={(e) => setU(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-amber-300 font-medium">Acceleration ($a$)</span>
              <span className="font-mono text-amber-400 font-bold">{a.toFixed(2)} m/s²</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="8.0"
              step="0.1"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-emerald-300 font-medium">Time ($t$)</span>
              <span className="font-mono text-emerald-400 font-bold">{tMax} s</span>
            </div>
            <input
              type="range"
              min="2"
              max="15"
              step="1"
              value={tMax}
              onChange={(e) => setTMax(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
