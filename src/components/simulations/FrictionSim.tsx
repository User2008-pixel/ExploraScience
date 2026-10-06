import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Sliders, RotateCcw, Play, Pause, Sparkles, Layers, Compass, Zap, Flame, ShieldAlert } from 'lucide-react';

interface FrictionSimProps {
  initialPullForce?: number;
  initialMass?: number;
  initialMuS?: number;
  initialMuK?: number;
}

interface MaterialPreset {
  name: string;
  muS: number;
  muK: number;
  description: string;
}

const MATERIAL_PRESETS: MaterialPreset[] = [
  { name: 'Teflon on Teflon (Ultra-Slick)', muS: 0.05, muK: 0.04, description: 'Near-frictionless non-stick polymer coating' },
  { name: 'Ice on Ice (Skating Rink)', muS: 0.10, muK: 0.03, description: 'Thin liquid melt-film lubrication during sliding' },
  { name: 'Wood on Wood (Rough Timber)', muS: 0.50, muK: 0.35, description: 'Fibrous cellulose asperities locking together' },
  { name: 'Steel on Steel (Dry Rail)', muS: 0.74, muK: 0.57, description: 'Metallic cold welding at microscopic contact junctions' },
  { name: 'Rubber on Concrete (Dry Tire)', muS: 0.95, muK: 0.75, description: 'High polymer hysteresis and adhesive molecular bonding' },
];

export const FrictionSim: React.FC<FrictionSimProps> = ({
  initialPullForce = 25,
  initialMass = 5,
  initialMuS = 0.50,
  initialMuK = 0.35,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mode: Horizontal Pull Bench vs Inclined Plane & Repose Angle
  const [labMode, setLabMode] = useState<'horizontal' | 'incline'>('horizontal');

  // Direct Interactive State
  const [pullForce, setPullForce] = useState<number>(initialPullForce);
  const [mass, setMass] = useState<number>(initialMass);
  const [muS, setMuS] = useState<number>(initialMuS);
  const [muK, setMuK] = useState<number>(initialMuK);
  const [inclineAngleDeg, setInclineAngleDeg] = useState<number>(25);
  const [stackedWeights, setStackedWeights] = useState<number>(0); // 0, 1, 2, 5 kg extra
  const [contactOrientation, setContactOrientation] = useState<'wide' | 'narrow'>('wide');

  // Motion state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);
  const [blockPos, setBlockPos] = useState<number>(0);
  const [blockVel, setBlockVel] = useState<number>(0);

  const g = 9.8;
  const totalMass = mass + stackedWeights;

  // -------------------------------------------------------------
  // HORIZONTAL BENCH CALCULATIONS
  // -------------------------------------------------------------
  const normalForceH = totalMass * g;
  const maxStaticFrictionH = muS * normalForceH;
  const kineticFrictionH = muK * normalForceH;

  const isSlidingH = pullForce > maxStaticFrictionH;
  const effectiveFrictionH = isSlidingH ? kineticFrictionH : pullForce;
  const netForceH = isSlidingH ? pullForce - kineticFrictionH : 0;
  const accelerationH = netForceH / totalMass;

  // -------------------------------------------------------------
  // INCLINED PLANE CALCULATIONS
  // -------------------------------------------------------------
  const inclineRad = (inclineAngleDeg * Math.PI) / 180;
  const normalForceI = totalMass * g * Math.cos(inclineRad);
  const drivingForceDownI = totalMass * g * Math.sin(inclineRad);
  const maxStaticFrictionI = muS * normalForceI;
  const kineticFrictionI = muK * normalForceI;

  const angleOfReposeDeg = Math.round((Math.atan(muS) * 180) / Math.PI * 10) / 10;
  const isSlidingI = drivingForceDownI > maxStaticFrictionI;
  const effectiveFrictionI = isSlidingI ? kineticFrictionI : drivingForceDownI;
  const netForceI = isSlidingI ? drivingForceDownI - kineticFrictionI : 0;
  const accelerationI = isSlidingI ? g * (Math.sin(inclineRad) - muK * Math.cos(inclineRad)) : 0;

  // Current active kinematics
  const currentAcc = labMode === 'horizontal' ? accelerationH : accelerationI;
  const currentNormal = labMode === 'horizontal' ? normalForceH : normalForceI;
  const currentFriction = labMode === 'horizontal' ? effectiveFrictionH : effectiveFrictionI;
  const isCurrentlySliding = labMode === 'horizontal' ? isSlidingH : isSlidingI;

  // Animation frame loop
  useEffect(() => {
    let animId: number;
    if (isPlaying && isCurrentlySliding) {
      let lastTime = performance.now();
      const tick = (now: number) => {
        const dtReal = (now - lastTime) / 1000;
        lastTime = now;
        const dt = Math.min(0.04, dtReal);

        setSimTime((prev) => prev + dt);
        setBlockVel((prevV) => prevV + currentAcc * dt);
        setBlockPos((prevX) => prevX + (blockVel + 0.5 * currentAcc * dt) * dt);

        animId = requestAnimationFrame(tick);
      };
      animId = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isCurrentlySliding, currentAcc, blockVel]);

  const resetSimulation = () => {
    setIsPlaying(false);
    setSimTime(0);
    setBlockPos(0);
    setBlockVel(0);
  };

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

    ctx.fillStyle = '#050a14';
    ctx.fillRect(0, 0, w, h);

    if (labMode === 'horizontal') {
      // -----------------------------------------------------------
      // HORIZONTAL PULL BENCH RENDERING
      // -----------------------------------------------------------
      const floorY = h * 0.68;

      // Table Surface with texture
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, floorY, w, h - floorY);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(w, floorY);
      ctx.stroke();

      // Distance tick marks along surface
      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      const offset = (blockPos * 40) % 40;
      for (let x = -offset; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, floorY);
        ctx.lineTo(x, floorY + 6);
        ctx.stroke();
      }

      // Block dimensions based on orientation
      const bW = contactOrientation === 'wide' ? 90 : 50;
      const bH = contactOrientation === 'wide' ? 45 : 75;
      const bX = w * 0.32;
      const bY = floorY - bH;

      // Block body (Wood texture gradient)
      const bGrad = ctx.createLinearGradient(bX, bY, bX, bY + bH);
      bGrad.addColorStop(0, '#b45309');
      bGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = bGrad;
      ctx.fillRect(bX, bY, bW, bH);
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bX, bY, bW, bH);

      // Stacked extra weights on top
      if (stackedWeights > 0) {
        const swH = 14;
        ctx.fillStyle = '#475569';
        ctx.fillRect(bX + 15, bY - swH, bW - 30, swH);
        ctx.strokeStyle = '#94a3b8';
        ctx.strokeRect(bX + 15, bY - swH, bW - 30, swH);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`+${stackedWeights}kg`, bX + bW / 2, bY - 3);
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${totalMass.toFixed(1)} kg`, bX + bW / 2, bY + bH / 2 + 4);

      // Spring dynamometer / pulling gauge on the right
      const dynX = bX + bW;
      const dynY = bY + bH / 2;
      const pullCordLen = Math.min(90, Math.max(30, pullForce * 1.1));

      // Spring coil
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(dynX, dynY);
      for (let i = 0; i < 6; i++) {
        const segX = dynX + (i + 1) * (pullCordLen / 8);
        const zigY = dynY + (i % 2 === 0 ? -6 : 6);
        ctx.lineTo(segX, zigY);
      }
      ctx.lineTo(dynX + pullCordLen, dynY);
      ctx.stroke();

      // Pull handle & Arrow
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(dynX + pullCordLen + 5, dynY, 7, 0, Math.PI * 2);
      ctx.fill();

      // Vectors:
      // F_pull (Right)
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`F_pull = ${pullForce} N`, dynX + pullCordLen + 15, dynY - 12);

      // Friction force (Left)
      const fricArrowLen = Math.min(70, Math.max(15, effectiveFrictionH * 1.1));
      ctx.strokeStyle = '#ef4444';
      ctx.fillStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bX, floorY);
      ctx.lineTo(bX - fricArrowLen, floorY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bX - fricArrowLen, floorY);
      ctx.lineTo(bX - fricArrowLen + 6, floorY - 4);
      ctx.lineTo(bX - fricArrowLen + 6, floorY + 4);
      ctx.fill();
      ctx.fillText(`f = ${effectiveFrictionH.toFixed(1)} N`, bX - fricArrowLen - 25, floorY - 6);

      // Normal N (Up)
      ctx.strokeStyle = '#38bdf8';
      ctx.fillStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bX + bW / 2, bY);
      ctx.lineTo(bX + bW / 2, bY - 32);
      ctx.stroke();
      ctx.fillText(`N = ${Math.round(normalForceH)} N`, bX + bW / 2, bY - 36);

      // Weight W (Down)
      ctx.strokeStyle = '#f59e0b';
      ctx.fillStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bX + bW / 2, floorY);
      ctx.lineTo(bX + bW / 2, floorY + 32);
      ctx.stroke();
      ctx.fillText(`W = mg = ${Math.round(normalForceH)} N`, bX + bW / 2, floorY + 44);

      // Microscopic asperities viewfinder circle (Bottom Left Callout)
      ctx.save();
      const zoomX = 60;
      const zoomY = 70;
      const zoomR = 36;
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.arc(zoomX, zoomY, zoomR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Asperities jagged interface inside zoom circle
      ctx.clip();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let zx = zoomX - zoomR; zx <= zoomX + zoomR; zx += 8) {
        ctx.lineTo(zx, zoomY + (Math.sin(zx * 0.8) > 0 ? 5 : -5));
      }
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#06b6d4';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Microscopic Asperities', zoomX, zoomY + zoomR + 12);
    } else {
      // -----------------------------------------------------------
      // INCLINED PLANE & ANGLE OF REPOSE RENDERING
      // -----------------------------------------------------------
      const wedgeLen = 240;
      const xBase = 50;
      const yBase = h * 0.76;
      const xTop = xBase + Math.cos(inclineRad) * wedgeLen;
      const yTop = yBase - Math.sin(inclineRad) * wedgeLen;

      // Incline wedge
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xBase, yBase);
      ctx.lineTo(xTop, yTop);
      ctx.lineTo(xTop, yBase);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Angle arc at bottom
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(xBase, yBase, 35, -inclineRad, 0);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`θ = ${inclineAngleDeg}°`, xBase + 42, yBase - 8);

      // Block on incline
      const blockDist = wedgeLen * 0.55 - (blockPos * 12) % (wedgeLen * 0.4);
      const bx = xBase + Math.cos(inclineRad) * blockDist;
      const by = yBase - Math.sin(inclineRad) * blockDist;

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(-inclineRad);

      const bW = 44;
      const bH = 26;
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-bW / 2, -bH, bW, bH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(-bW / 2, -bH, bW, bH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${totalMass.toFixed(1)}kg`, 0, -bH / 2 + 3);

      // Force Vectors on Incline:
      // Normal N (perpendicular up)
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -bH);
      ctx.lineTo(0, -bH - 35);
      ctx.stroke();
      ctx.fillStyle = '#10b981';
      ctx.font = '8px monospace';
      ctx.fillText(`N = ${Math.round(normalForceI)}N`, 18, -bH - 25);

      // Downhill gravity component mg sin θ
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-38, 0);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`mg sin θ`, -50, -4);

      // Uphill friction force
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(34, 0);
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.fillText(`f = ${effectiveFrictionI.toFixed(1)}N`, 45, -4);

      ctx.restore();
    }

    ctx.restore();
  }, [labMode, pullForce, mass, stackedWeights, contactOrientation, inclineAngleDeg, blockPos, effectiveFrictionH, normalForceH, normalForceI, effectiveFrictionI]);

  return (
    <div className="bg-[#070e1c] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Static vs Kinetic Friction & Amontons&apos; Laws Lab
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Rigorous friction mechanics: Limiting peak (f_s,max = μ_s·N), kinetic drop (f_k = μ_k·N) & angle of repose
            </p>
          </div>
        </div>

        {/* Dual Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => {
              setLabMode('horizontal');
              resetSimulation();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              labMode === 'horizontal'
                ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Horizontal Pull & Dynamometer
          </button>
          <button
            onClick={() => {
              setLabMode('incline');
              resetSimulation();
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              labMode === 'incline'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> Inclined Plane & Repose Angle
          </button>
        </div>
      </div>

      {/* Main Dual Grid: Canvas & Friction vs Applied Force Plot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Test Rig Canvas */}
        <div className="lg:col-span-7 bg-[#030712] rounded-2xl border border-slate-800 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1 px-1">
            <span className="text-rose-400 font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              {labMode === 'horizontal' ? 'Horizontal Pull Rig' : 'Inclined Ramp Dynamics'}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isCurrentlySliding
                  ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              {isCurrentlySliding ? 'KINETIC SLIDING (Accelerating)' : 'STATIC EQUILIBRIUM (At Rest)'}
            </span>
          </div>

          <canvas ref={canvasRef} className="w-full h-64 block rounded-xl border border-slate-800/80" />

          {/* Kinematic status strip */}
          <div className="grid grid-cols-3 gap-2 mt-2 px-3 py-2 bg-slate-950/90 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block">Normal Force N:</span>
              <span className="text-cyan-400 font-bold">{Math.round(currentNormal)} N</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Friction Force f:</span>
              <span className="text-rose-400 font-bold">{currentFriction.toFixed(1)} N</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Acceleration a:</span>
              <span className="text-amber-400 font-bold">{currentAcc.toFixed(2)} m/s²</span>
            </div>
          </div>
        </div>

        {/* Right: THE FAMOUS TEXTBOOK FRICTION FORCE VS APPLIED FORCE GRAPH */}
        <div className="lg:col-span-5 bg-[#030712] rounded-2xl border border-slate-800 p-4 flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-2 mb-2 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase">
              Friction Force vs Applied Load (f vs F_app)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Live Operating Point</span>
          </div>

          {/* SVG Graph of the characteristic Static Peak & Kinetic Plateau */}
          <div className="w-full h-56 bg-slate-950 rounded-xl border border-slate-800/80 p-2 relative">
            <svg viewBox="0 0 260 170" className="w-full h-full select-none">
              {/* Axes */}
              <line x1="30" y1="20" x2="30" y2="145" stroke="#64748b" strokeWidth="1.5" />
              <line x1="30" y1="145" x2="250" y2="145" stroke="#64748b" strokeWidth="1.5" />

              <text x="220" y="157" fill="#94a3b8" fontSize="8" fontFamily="monospace">F_app (N)</text>
              <text x="8" y="24" fill="#94a3b8" fontSize="8" fontFamily="monospace">f (N)</text>

              {/* Shaded Regions */}
              <rect x="30" y="20" width="75" height="125" fill="#10b981" fillOpacity="0.06" />
              <rect x="105" y="20" width="145" height="125" fill="#f43f5e" fillOpacity="0.06" />

              <text x="42" y="32" fill="#10b981" fontSize="7" fontFamily="monospace" fontWeight="bold">STATIC REGION</text>
              <text x="135" y="32" fill="#f43f5e" fontSize="7" fontFamily="monospace" fontWeight="bold">KINETIC REGION</text>

              {/* The Characteristic Friction Curve */}
              {/* 1. Static slope line from (30, 145) to Peak (105, 55) */}
              <line x1="30" y1="145" x2="105" y2="55" stroke="#10b981" strokeWidth="2.5" />

              {/* 2. Sudden drop from (105, 55) to (110, 80) */}
              <line x1="105" y1="55" x2="110" y2="80" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="2 2" />

              {/* 3. Kinetic horizontal plateau from (110, 80) to (250, 80) */}
              <line x1="110" y1="80" x2="250" y2="80" stroke="#f43f5e" strokeWidth="2.5" />

              {/* Critical Peak Point (f_s,max) */}
              <circle cx="105" cy="55" r="3.5" fill="#f59e0b" />
              <text x="85" y="50" fill="#f59e0b" fontSize="7" fontFamily="monospace" fontWeight="bold">
                f_s,max = {maxStaticFrictionH.toFixed(0)}N
              </text>

              {/* Kinetic Plateau Point (f_k) */}
              <text x="180" y="74" fill="#f43f5e" fontSize="7" fontFamily="monospace" fontWeight="bold">
                f_k = {kineticFrictionH.toFixed(0)}N
              </text>

              {/* Live Operating Cursor Dot */}
              {(() => {
                const maxF_plot = Math.max(80, maxStaticFrictionH * 1.8);
                const curX = Math.min(245, 30 + (pullForce / maxF_plot) * 160);
                const curY = isSlidingH ? 80 : 145 - ((pullForce / maxStaticFrictionH) * (145 - 55));
                return (
                  <g>
                    <circle cx={curX} cy={curY} r="5" fill="#ffffff" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x={curX - 10} y={curY - 9} fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">
                      ({pullForce}N, {effectiveFrictionH.toFixed(0)}N)
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Formulas and Repose Summary */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px] font-mono space-y-1 mt-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Peak Static Friction:</span>
              <span className="text-amber-400 font-bold">f_s,max = μ_s · N = {maxStaticFrictionH.toFixed(1)} N</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kinetic Sliding Friction:</span>
              <span className="text-rose-400 font-bold">f_k = μ_k · N = {kineticFrictionH.toFixed(1)} N</span>
            </div>
            {labMode === 'incline' && (
              <div className="flex justify-between pt-1 border-t border-slate-800 text-cyan-400 font-bold">
                <span>Angle of Repose (tan θ = μ_s):</span>
                <span>θ_repose = {angleOfReposeDeg}°</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Surface Material Presets */}
      <div className="space-y-1.5">
        <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Surface Material Tribology Pairs:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {MATERIAL_PRESETS.map((m) => (
            <button
              key={m.name}
              onClick={() => {
                setMuS(m.muS);
                setMuK(m.muK);
                resetSimulation();
              }}
              className={`p-2.5 rounded-xl border text-left transition ${
                muS === m.muS && muK === m.muK
                  ? 'bg-slate-800 border-rose-400 text-white font-bold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="text-xs font-mono text-rose-300 font-bold">{m.name.split(' (')[0]}</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                μ_s = {m.muS} | μ_k = {m.muK}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Direct Parameter Manipulation Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        {/* Applied Pull Force or Incline Angle */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
          {labMode === 'horizontal' ? (
            <>
              <div className="flex justify-between font-mono">
                <span className="text-slate-300 font-medium">Applied Pull Force (F):</span>
                <span className="text-emerald-400 font-bold text-sm">{pullForce} N</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="1"
                value={pullForce}
                onChange={(e) => {
                  setPullForce(Number(e.target.value));
                  resetSimulation();
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 N</span>
                <span>40 N</span>
                <span>80 N</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between font-mono">
                <span className="text-slate-300 font-medium">Incline Angle (θ):</span>
                <span className="text-cyan-400 font-bold text-sm">{inclineAngleDeg}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="65"
                step="1"
                value={inclineAngleDeg}
                onChange={(e) => {
                  setInclineAngleDeg(Number(e.target.value));
                  resetSimulation();
                }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0° (Flat)</span>
                <span>30°</span>
                <span>65° (Steep)</span>
              </div>
            </>
          )}
        </div>

        {/* Normal Force Experiment: Add Stacked Weights */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between font-mono">
            <span className="text-slate-300 font-medium">Block Mass & Normal Force N:</span>
            <span className="text-cyan-400 font-bold text-sm">{totalMass} kg</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-slate-400 text-[11px]">Add Mass:</span>
            {[0, 2, 5, 10].map((wExtra) => (
              <button
                key={wExtra}
                onClick={() => {
                  setStackedWeights(wExtra);
                  resetSimulation();
                }}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition ${
                  stackedWeights === wExtra
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                +{wExtra}kg
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Amontons&apos; 2nd Law: Friction scales linearly with Normal force (N = mg).
          </p>
        </div>

        {/* Amontons' 1st Law: Surface Area Independence Test */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
          <span className="text-slate-300 font-medium block">Amontons&apos; 1st Law (Area Independence):</span>
          <div className="flex gap-2">
            <button
              onClick={() => setContactOrientation('wide')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-mono transition ${
                contactOrientation === 'wide'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Wide Face (100 cm²)
            </button>
            <button
              onClick={() => setContactOrientation('narrow')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-mono transition ${
                contactOrientation === 'narrow'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Narrow Edge (25 cm²)
            </button>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Friction force remains <strong>strictly identical</strong> regardless of contact area!
          </p>
        </div>
      </div>
    </div>
  );
};
