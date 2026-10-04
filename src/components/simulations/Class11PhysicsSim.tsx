import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Compass,
  Wind,
  Activity,
  Flame,
  Layers,
} from 'lucide-react';

interface Class11PhysicsSimProps {
  simulationType?: string;
  conceptId?: string;
  variables?: Record<string, number>;
}

type Physics11Mode =
  | 'projectile-motion'
  | 'newton-friction'
  | 'work-energy'
  | 'gravitation-kepler'
  | 'bernoulli-fluid'
  | 'thermodynamics-carnot'
  | 'shm-pendulum'
  | 'wave-doppler';

export const Class11PhysicsSim: React.FC<Class11PhysicsSimProps> = ({
  simulationType = 'class11-physics',
  conceptId = '',
  variables = {},
}) => {
  const getInitialMode = (): Physics11Mode => {
    if (conceptId.includes('projectile') || simulationType.includes('projectile')) return 'projectile-motion';
    if (conceptId.includes('newton') || conceptId.includes('friction') || conceptId.includes('incline')) return 'newton-friction';
    if (conceptId.includes('work-energy') || conceptId.includes('spring') || conceptId.includes('power')) return 'work-energy';
    if (conceptId.includes('gravitation') || conceptId.includes('kepler') || conceptId.includes('orbit')) return 'gravitation-kepler';
    if (conceptId.includes('bernoulli') || conceptId.includes('fluid') || conceptId.includes('continuity')) return 'bernoulli-fluid';
    if (conceptId.includes('thermodynamics') || conceptId.includes('carnot') || conceptId.includes('heat-engine')) return 'thermodynamics-carnot';
    if (conceptId.includes('pendulum') || conceptId.includes('shm') || conceptId.includes('oscillation')) return 'shm-pendulum';
    if (conceptId.includes('doppler') || conceptId.includes('wave') || conceptId.includes('sound')) return 'wave-doppler';
    return 'projectile-motion';
  };

  const [activeMode, setActiveMode] = useState<Physics11Mode>(getInitialMode());
  const isExploringTopic = Boolean(conceptId);

  // Global live animation clock
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [animTime, setAnimTime] = useState<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    setActiveMode(getInitialMode());
  }, [simulationType, conceptId]);

  useEffect(() => {
    if (!isPlaying) return;
    let lastStamp = performance.now();
    const tick = (now: number) => {
      const dt = (now - lastStamp) / 1000;
      lastStamp = now;
      setAnimTime((prev) => prev + dt * simSpeed);
      animFrameRef.current = requestAnimationFrame(tick);
    };
    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, simSpeed]);

  // ----------------------------------------------------------------------
  // MODE 1: PROJECTILE MOTION
  // ----------------------------------------------------------------------
  const [projSpeed, setProjSpeed] = useState<number>(variables.initialVelocityV0 ?? 25);
  const [projAngleDeg, setProjAngleDeg] = useState<number>(variables.launchAngleDeg ?? 45);
  const gAcc = 9.8;
  const projRad = (projAngleDeg * Math.PI) / 180;
  const timeOfFlight = (2 * projSpeed * Math.sin(projRad)) / gAcc;
  const maxHeight = (Math.pow(projSpeed * Math.sin(projRad), 2)) / (2 * gAcc);
  const maxRange = (Math.pow(projSpeed, 2) * Math.sin(2 * projRad)) / gAcc;

  // ----------------------------------------------------------------------
  // MODE 2: NEWTON'S LAWS & INCLINED PLANE FRICTION
  // ----------------------------------------------------------------------
  const [inclineAngle, setInclineAngle] = useState<number>(variables.inclineAngleDeg ?? 30);
  const [frictionMu, setFrictionMu] = useState<number>(variables.frictionCoefficientMu ?? 0.25);
  const inclineRad = (inclineAngle * Math.PI) / 180;
  const slidingAcc = Math.max(0, gAcc * (Math.sin(inclineRad) - frictionMu * Math.cos(inclineRad)));

  // ----------------------------------------------------------------------
  // MODE 3: WORK-ENERGY THEOREM & SPRING
  // ----------------------------------------------------------------------
  const [springK, setSpringK] = useState<number>(variables.springConstantK ?? 150);
  const [springX, setSpringX] = useState<number>(variables.springDisplacementX ?? 10);
  const springEnergyU = 0.5 * springK * Math.pow(springX * 0.01, 2);

  // ----------------------------------------------------------------------
  // MODE 4: GRAVITATION & KEPLER'S LAWS
  // ----------------------------------------------------------------------
  const [satelliteAltKm, setSatelliteAltKm] = useState<number>(variables.orbitalAltitudeKm ?? 400);
  const earthRadiusKm = 6371;
  const orbitalRadiusKm = earthRadiusKm + satelliteAltKm;
  const orbitalSpeedKmS = Math.round(Math.sqrt((398600) / orbitalRadiusKm) * 100) / 100;

  // ----------------------------------------------------------------------
  // MODE 5: BERNOULLI'S PRINCIPLE & FLUID DYNAMICS
  // ----------------------------------------------------------------------
  const [inletSpeedV1, setInletSpeedV1] = useState<number>(variables.inletVelocityMPerS ?? 2);
  const [venturiAreaRatio, setVenturiAreaRatio] = useState<number>(variables.areaRatioA1OverA2 ?? 3);
  const throatSpeedV2 = inletSpeedV1 * venturiAreaRatio;
  const pressureDropPa = Math.round(0.5 * 1000 * (Math.pow(throatSpeedV2, 2) - Math.pow(inletSpeedV1, 2)));

  // ----------------------------------------------------------------------
  // MODE 6: THERMODYNAMICS & CARNOT ENGINE
  // ----------------------------------------------------------------------
  const [carnotTh, setCarnotTh] = useState<number>(variables.sourceTempKelvin ?? 800);
  const [carnotTc, setCarnotTc] = useState<number>(variables.sinkTempKelvin ?? 300);
  const carnotEfficiency = Math.round((1 - carnotTc / carnotTh) * 100);

  // ----------------------------------------------------------------------
  // MODE 7: SIMPLE HARMONIC MOTION PENDULUM
  // ----------------------------------------------------------------------
  const [pendulumLen, setPendulumLen] = useState<number>(variables.pendulumLengthM ?? 1.0);
  const pendulumPeriod = Math.round(2 * Math.PI * Math.sqrt(pendulumLen / gAcc) * 100) / 100;

  // ----------------------------------------------------------------------
  // MODE 8: WAVE MOTION & DOPPLER EFFECT
  // ----------------------------------------------------------------------
  const [dopplerSourceSpeed, setDopplerSourceSpeed] = useState<number>(variables.sourceVelocityMPerS ?? 30);
  const soundSpeed = 340;
  const baseFreqHz = 500;
  const observedFreqApproaching = Math.round(baseFreqHz * (soundSpeed / (soundSpeed - dopplerSourceSpeed)));
  const observedFreqReceding = Math.round(baseFreqHz * (soundSpeed / (soundSpeed + dopplerSourceSpeed)));

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                NCERT Class 11 Physics • Live Laboratory
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Live Newtonian mechanics, fluid dynamics, orbital mechanics, thermodynamics & harmonic waves
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause Live' : 'Run Live'}</span>
          </button>

          <button
            onClick={() => {
              setAnimTime(0);
              setIsPlaying(true);
            }}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Reset simulation time"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Navigation Tabs */}
        {!isExploringTopic && (
          <div className="w-full flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs mt-2">
            {[
              { id: 'projectile-motion', label: 'Projectile Motion' },
              { id: 'newton-friction', label: 'Newton & Incline' },
              { id: 'work-energy', label: 'Work & Spring Energy' },
              { id: 'gravitation-kepler', label: 'Gravitation & Orbits' },
              { id: 'bernoulli-fluid', label: 'Bernoulli Fluid' },
              { id: 'thermodynamics-carnot', label: 'Carnot Heat Engine' },
              { id: 'shm-pendulum', label: 'SHM Pendulum' },
              { id: 'wave-doppler', label: 'Wave & Doppler' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id as Physics11Mode)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  activeMode === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 1. PROJECTILE MOTION (LIVE TRAJECTORY FLIGHT) */}
      {/* ============================================================== */}
      {activeMode === 'projectile-motion' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE PROJECTILE KINEMATICS</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Ground */}
                <line x1="20" y1="170" x2="330" y2="170" stroke="#475569" strokeWidth="2" />

                {/* Parabolic Trajectory Path */}
                {(() => {
                  const scaleX = 280 / Math.max(10, maxRange);
                  const scaleY = 120 / Math.max(5, maxHeight);
                  const flightProgress = (animTime % timeOfFlight) / timeOfFlight;
                  const curT = flightProgress * timeOfFlight;
                  const curX = 30 + (projSpeed * Math.cos(projRad) * curT) * scaleX;
                  const curY = 170 - ((projSpeed * Math.sin(projRad) * curT) - 0.5 * gAcc * curT * curT) * scaleY;
                  const apexX = 30 + (maxRange / 2) * scaleX;
                  const apexY = 170 - maxHeight * scaleY;

                  return (
                    <g>
                      {/* Parabola path */}
                      <path
                        d={`M 30,170 Q ${apexX},${apexY - (maxHeight * scaleY)} ${30 + maxRange * scaleX},170`}
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />

                      {/* Moving Projectile Ball */}
                      <circle cx={curX} cy={curY} r="6" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" className="animate-pulse" />

                      {/* Velocity vector arrows */}
                      <line x1={curX} y1={curY} x2={curX + 20} y2={curY} stroke="#38bdf8" strokeWidth="2" />
                      <line x1={curX} y1={curY} x2={curX} y2={curY - (projSpeed * Math.sin(projRad) - gAcc * curT) * 0.8} stroke="#ef4444" strokeWidth="2" />

                      {/* Range & Max Height annotations */}
                      <text x={apexX} y={apexY - 10} textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">
                        H_max = {Math.round(maxHeight * 10) / 10} m
                      </text>
                      <text x={apexX} y="185" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace">
                        Range R = {Math.round(maxRange * 10) / 10} m
                      </text>
                    </g>
                  );
                })()}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Speed v₀ = {projSpeed} m/s</span>
                <span className="text-amber-400 font-bold">Angle θ = {projAngleDeg}°</span>
                <span className="text-emerald-400 font-bold">Flight Time T = {Math.round(timeOfFlight * 10) / 10} s</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Projectile Equations</h4>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Launch Velocity (v₀):</span>
                    <span className="text-cyan-400 font-bold">{projSpeed} m/s</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={projSpeed}
                    onChange={(e) => setProjSpeed(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Launch Angle (θ):</span>
                    <span className="text-amber-400 font-bold">{projAngleDeg}°</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="75"
                    value={projAngleDeg}
                    onChange={(e) => setProjAngleDeg(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-amber-400 font-bold block font-mono text-[11px] uppercase">
                  Kinematic Symmetry:
                </span>
                <p>
                  Horizontal velocity v_x = v₀ cos θ is unaccelerated. Vertical velocity v_y drops to zero at apex and reverses symmetrically on descent.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. NEWTON'S LAWS & INCLINED PLANE FRICTION */}
      {/* ============================================================== */}
      {activeMode === 'newton-friction' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE INCLINED PLANE DYNAMICS & FRICTION</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Inclined Plane Wedge */}
                {(() => {
                  const wedgeLen = 220;
                  const xBase = 50;
                  const yBase = 160;
                  const xTop = xBase + Math.cos(inclineRad) * wedgeLen;
                  const yTop = yBase - Math.sin(inclineRad) * wedgeLen;

                  // Block sliding position down the plane
                  const slideDist = slidingAcc > 0 ? (animTime * 25) % (wedgeLen * 0.7) : 0;
                  const blockCenterDist = wedgeLen * 0.8 - slideDist;
                  const bx = xBase + Math.cos(inclineRad) * blockCenterDist;
                  const by = yBase - Math.sin(inclineRad) * blockCenterDist;

                  return (
                    <g>
                      <polygon points={`${xBase},${yBase} ${xTop},${yTop} ${xTop},${yBase}`} fill="#1e293b" stroke="#475569" strokeWidth="2" />
                      <text x={xBase + 40} y={yBase - 8} fill="#94a3b8" fontSize="9" fontFamily="monospace">θ = {inclineAngle}°</text>

                      {/* Sliding Block */}
                      <g transform={`translate(${bx}, ${by}) rotate(${-inclineAngle})`}>
                        <rect x="-18" y="-24" width="36" height="24" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                        <text x="0" y="-8" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">m</text>

                        {/* Force Vectors */}
                        {/* Normal force N */}
                        <line x1="0" y1="-24" x2="0" y2="-55" stroke="#10b981" strokeWidth="2" />
                        <text x="5" y="-45" fill="#10b981" fontSize="8" fontFamily="monospace">N</text>

                        {/* Friction f_k pointing up the incline */}
                        <line x1="0" y1="0" x2="30" y2="0" stroke="#f43f5e" strokeWidth="2" />
                        <text x="35" y="4" fill="#f43f5e" fontSize="8" fontFamily="monospace">f_k</text>

                        {/* Gravity component down the incline */}
                        <line x1="0" y1="0" x2="-40" y2="0" stroke="#facc15" strokeWidth="2" />
                        <text x="-55" y="4" fill="#facc15" fontSize="8" fontFamily="monospace">mg sin θ</text>
                      </g>
                    </g>
                  );
                })()}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Angle of Incline: {inclineAngle}°</span>
                <span className="text-amber-400 font-bold">Friction μ = {frictionMu}</span>
                <span className="text-emerald-400 font-bold">Acceleration a = {Math.round(slidingAcc * 100) / 100} m/s²</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">a = g(sin θ - μ cos θ)</h4>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Incline Angle (θ):</span>
                    <span className="text-cyan-400 font-bold">{inclineAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    value={inclineAngle}
                    onChange={(e) => setInclineAngle(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Friction Coeff (μ):</span>
                    <span className="text-rose-400 font-bold">{frictionMu}</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.80"
                    step="0.05"
                    value={frictionMu}
                    onChange={(e) => setFrictionMu(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-emerald-400 font-bold block font-mono text-[11px] uppercase">
                  Angle of Repose:
                </span>
                <p>
                  If tan θ ≤ μ_s, the block remains stationary without sliding. Once θ exceeds the angle of repose, net acceleration acts down the ramp.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. WORK-ENERGY THEOREM & SPRING OSCILLATIONS */}
      {/* ============================================================== */}
      {activeMode === 'work-energy' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE SPRING HOOKE HARMONIC ENERGY EXCHANGE</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Rigid Wall on Left */}
                <line x1="40" y1="40" x2="40" y2="160" stroke="#64748b" strokeWidth="4" />

                {/* Oscillating Spring Coil */}
                {(() => {
                  const omegaSpring = Math.sqrt(springK / 1.0);
                  const instX = (springX * Math.cos(animTime * 4)) * 3;
                  const massX = 160 + instX;

                  return (
                    <g>
                      {/* Spring Coils */}
                      <path
                        d={`M 40,100 L 50,100 L 60,85 L 80,115 L 100,85 L 120,115 L 140,85 L ${massX},100`}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                      />

                      {/* Mass Block */}
                      <rect x={massX} y="75" width="40" height="50" rx="4" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                      <text x={massX + 20} y="105" textAnchor="middle" fill="#ffffff" fontWeight="bold">m</text>

                      {/* Energy Bar Meters (Kinetic K vs Potential U) */}
                      <g transform="translate(240, 50)">
                        <text x="0" y="0" fill="#94a3b8" fontSize="8" fontFamily="monospace">Energy Exchange</text>
                        {/* Potential U bar */}
                        <rect x="0" y="15" width={Math.max(5, (springEnergyU * Math.pow(Math.cos(animTime * 4), 2) / (springEnergyU || 1)) * 75)} height="12" fill="#ef4444" rx="2" />
                        <text x="80" y="24" fill="#ef4444" fontSize="8" fontFamily="monospace">U (Elastic)</text>

                        {/* Kinetic K bar */}
                        <rect x="0" y="35" width={Math.max(5, (springEnergyU * Math.pow(Math.sin(animTime * 4), 2) / (springEnergyU || 1)) * 75)} height="12" fill="#10b981" rx="2" />
                        <text x="80" y="44" fill="#10b981" fontSize="8" fontFamily="monospace">K (Kinetic)</text>
                      </g>
                    </g>
                  );
                })()}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Spring Constant k = {springK} N/m</span>
                <span className="text-amber-400 font-bold">Displacement x = {springX} cm</span>
                <span className="text-emerald-400 font-bold">Total Energy E = ½kx² = {Math.round(springEnergyU * 100) / 100} J</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Mechanical Energy Conservation</h4>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Spring Constant (k):</span>
                    <span className="text-cyan-400 font-bold">{springK} N/m</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    step="25"
                    value={springK}
                    onChange={(e) => setSpringK(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Max Amplitude (A):</span>
                    <span className="text-amber-400 font-bold">{springX} cm</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="20"
                    value={springX}
                    onChange={(e) => setSpringX(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-amber-400 font-bold block font-mono text-[11px] uppercase">
                  Conservative Exchange:
                </span>
                <p>
                  At maximum extension x = A, velocity is zero and energy is purely elastic potential U = ½kA². At the equilibrium position x = 0, energy is purely kinetic K = ½mv_max².
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. GRAVITATION & ORBITAL KEPLER MECHANICS */}
      {/* ============================================================== */}
      {activeMode === 'gravitation-kepler' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE SATELLITE ORBIT (v_o = √(GM/r))</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Central Earth */}
                <circle cx="175" cy="100" r="35" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <text x="175" y="104" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">Earth</text>

                {/* Orbital Path Circle */}
                {(() => {
                  const orbitVisualRadius = 45 + (satelliteAltKm / 36000) * 35;
                  const orbAngle = animTime * (orbitalSpeedKmS * 0.3);
                  const satX = 175 + Math.cos(orbAngle) * orbitVisualRadius;
                  const satY = 100 + Math.sin(orbAngle) * orbitVisualRadius;

                  return (
                    <g>
                      <circle cx="175" cy="100" r={orbitVisualRadius} fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
                      {/* Satellite */}
                      <circle cx={satX} cy={satY} r="5" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" />
                      <line x1={satX - 6} y1={satY} x2={satX + 6} y2={satY} stroke="#facc15" strokeWidth="1.5" />
                      <line x1={satX} y1={satY - 6} x2={satX} y2={satY + 6} stroke="#facc15" strokeWidth="1.5" />
                    </g>
                  );
                })()}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Altitude h = {satelliteAltKm} km</span>
                <span className="text-amber-400 font-bold">Orbital Speed v_o = {orbitalSpeedKmS} km/s</span>
                <span className="text-emerald-400 font-bold">Escape Velocity v_e = 11.2 km/s</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Kepler’s Third Law: T² ∝ r³</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Gravitational centripetal force holds the satellite in orbit: mv²/r = GMm/r². Higher orbits experience weaker gravitational pull and travel at lower orbital velocities.
              </p>

              <div>
                <div className="flex justify-between mb-1 font-mono text-xs">
                  <span className="text-slate-300">Altitude (h):</span>
                  <span className="text-cyan-400 font-bold">{satelliteAltKm} km</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="36000"
                  step="1000"
                  value={satelliteAltKm}
                  onChange={(e) => setSatelliteAltKm(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. BERNOULLI'S PRINCIPLE & FLUID DYNAMICS */}
      {/* ============================================================== */}
      {activeMode === 'bernoulli-fluid' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE VENTURI FLUID ACCELERATION & PRESSURE DROP</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Venturi Tube Profile */}
                <path
                  d="M 30,50 L 120,50 L 160,75 L 200,75 L 240,50 L 320,50 L 320,150 L 240,150 L 200,125 L 160,125 L 120,150 L 30,150 Z"
                  fill="#0284c715"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* Manometer tubes measuring hydrostatic pressure */}
                {/* Manometer 1 (Wide inlet) */}
                <rect x="75" y="15" width="14" height="35" fill="none" stroke="#64748b" strokeWidth="1.5" />
                <rect x="76" y="25" width="12" height="25" fill="#38bdf8" />
                <text x="82" y="10" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">P₁ High</text>

                {/* Manometer 2 (Narrow throat) */}
                <rect x="173" y="15" width="14" height="60" fill="none" stroke="#64748b" strokeWidth="1.5" />
                <rect x="174" y="55" width="12" height="20" fill="#38bdf8" />
                <text x="180" y="10" textAnchor="middle" fill="#f43f5e" fontSize="8" fontFamily="monospace">P₂ Low</text>

                {/* Streaming fluid particles */}
                {[0, 0.2, 0.4, 0.6, 0.8].map((phase, i) => {
                  const t = (animTime * 1.5 + phase) % 1;
                  let px = 30 + t * 290;
                  let py = 100;
                  if (px > 120 && px < 240) {
                    py = 100 + Math.sin(t * Math.PI) * 5;
                  }
                  return (
                    <circle key={i} cx={px} cy={py} r="3" fill="#38bdf8" />
                  );
                })}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Inlet Speed v₁ = {inletSpeedV1} m/s</span>
                <span className="text-amber-400 font-bold">Throat Speed v₂ = {throatSpeedV2} m/s</span>
                <span className="text-rose-400 font-bold">Pressure Drop ΔP = {pressureDropPa} Pa</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Bernoulli: P + ½ρv² = const</h4>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Inlet Velocity (v₁):</span>
                    <span className="text-cyan-400 font-bold">{inletSpeedV1} m/s</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={inletSpeedV1}
                    onChange={(e) => setInletSpeedV1(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Constriction Ratio (A₁/A₂):</span>
                    <span className="text-amber-400 font-bold">{venturiAreaRatio}x</span>
                  </div>
                  <input
                    type="range"
                    min="1.5"
                    max="5.0"
                    step="0.5"
                    value={venturiAreaRatio}
                    onChange={(e) => setVenturiAreaRatio(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-cyan-400 font-bold block font-mono text-[11px] uppercase">
                  Venturi Effect:
                </span>
                <p>
                  As fluid flows through the constriction, conservation of mass forces it to accelerate. The increase in kinetic energy causes an immediate drop in static pressure.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. THERMODYNAMICS & CARNOT ENGINE */}
      {/* ============================================================== */}
      {activeMode === 'thermodynamics-carnot' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE CARNOT CYCLE P-V INDICATOR DIAGRAM</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Axes */}
                <line x1="50" y1="20" x2="50" y2="170" stroke="#475569" strokeWidth="1.5" />
                <text x="35" y="30" fill="#94a3b8" fontSize="9" fontFamily="monospace">P</text>
                <line x1="50" y1="170" x2="320" y2="170" stroke="#475569" strokeWidth="1.5" />
                <text x="315" y="185" fill="#94a3b8" fontSize="9" fontFamily="monospace">V</text>

                {/* Carnot 4-Stage Cycle Loop */}
                {/* A (90, 45) -> B (190, 70) [Isothermal Exp at T_H] */}
                {/* B (190, 70) -> C (270, 130) [Adiabatic Exp] */}
                {/* C (270, 130) -> D (150, 115) [Isothermal Comp at T_C] */}
                {/* D (150, 115) -> A (90, 45) [Adiabatic Comp] */}
                <polygon points="90,45 190,70 270,130 150,115" fill="#f59e0b18" stroke="#f59e0b" strokeWidth="2.5" />
                <text x="80" y="40" fill="#ef4444" fontSize="9" fontWeight="bold">A (T_H)</text>
                <text x="200" y="65" fill="#f59e0b" fontSize="9" fontWeight="bold">B</text>
                <text x="280" y="135" fill="#3b82f6" fontSize="9" fontWeight="bold">C (T_C)</text>
                <text x="135" y="125" fill="#38bdf8" fontSize="9" fontWeight="bold">D</text>

                {/* Moving dot tracing the cycle */}
                {(() => {
                  const cycleT = (animTime * 0.4) % 1;
                  let dotX = 90;
                  let dotY = 45;
                  if (cycleT < 0.25) {
                    const subT = cycleT / 0.25;
                    dotX = 90 + (190 - 90) * subT;
                    dotY = 45 + (70 - 45) * subT;
                  } else if (cycleT < 0.5) {
                    const subT = (cycleT - 0.25) / 0.25;
                    dotX = 190 + (270 - 190) * subT;
                    dotY = 70 + (130 - 70) * subT;
                  } else if (cycleT < 0.75) {
                    const subT = (cycleT - 0.5) / 0.25;
                    dotX = 270 + (150 - 270) * subT;
                    dotY = 130 + (115 - 130) * subT;
                  } else {
                    const subT = (cycleT - 0.75) / 0.25;
                    dotX = 150 + (90 - 150) * subT;
                    dotY = 115 + (45 - 115) * subT;
                  }

                  return (
                    <circle cx={dotX} cy={dotY} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" className="animate-ping" />
                  );
                })()}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-rose-400 font-bold">Source T_H = {carnotTh} K</span>
                <span className="text-blue-400 font-bold">Sink T_C = {carnotTc} K</span>
                <span className="text-emerald-400 font-bold">Carnot Efficiency η = {carnotEfficiency}%</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">η = 1 - (T_C / T_H)</h4>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Hot Reservoir (T_H):</span>
                    <span className="text-rose-400 font-bold">{carnotTh} K</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="1200"
                    step="50"
                    value={carnotTh}
                    onChange={(e) => setCarnotTh(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Cold Sink (T_C):</span>
                    <span className="text-blue-400 font-bold">{carnotTc} K</span>
                  </div>
                  <input
                    type="range"
                    min="250"
                    max="450"
                    step="10"
                    value={carnotTc}
                    onChange={(e) => setCarnotTc(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-amber-400 font-bold block font-mono text-[11px] uppercase">
                  Second Law Limit:
                </span>
                <p>
                  No real engine operating between two given temperatures can be more efficient than a reversible Carnot engine.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. SIMPLE HARMONIC MOTION PENDULUM */}
      {/* ============================================================== */}
      {activeMode === 'shm-pendulum' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE SIMPLE HARMONIC PENDULUM SWING</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Suspension Pivot */}
                <circle cx="175" cy="20" r="5" fill="#94a3b8" />
                <line x1="140" y1="20" x2="210" y2="20" stroke="#64748b" strokeWidth="2" />

                {/* Oscillating Pendulum String and Bob */}
                {(() => {
                  const maxTheta = 0.45; // ~25 degrees
                  const omegaPend = 2 * Math.PI / (pendulumPeriod || 1);
                  const theta = maxTheta * Math.sin(animTime * omegaPend);
                  const strLenPixels = 120 * pendulumLen;
                  const bobX = 175 + Math.sin(theta) * strLenPixels;
                  const bobY = 20 + Math.cos(theta) * strLenPixels;

                  return (
                    <g>
                      <line x1="175" y1="20" x2={bobX} y2={bobY} stroke="#cbd5e1" strokeWidth="2" />
                      <circle cx={bobX} cy={bobY} r="12" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                      <text x={bobX} y={bobY + 4} textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">m</text>
                    </g>
                  );
                })()}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Length L = {pendulumLen} m</span>
                <span className="text-amber-400 font-bold">Period T = 2π√(L/g) = {pendulumPeriod} s</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">T = 2π · √(L / g)</h4>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Length (L):</span>
                    <span className="text-cyan-400 font-bold">{pendulumLen} m</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2.0"
                    step="0.1"
                    value={pendulumLen}
                    onChange={(e) => setPendulumLen(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-cyan-400 font-bold block font-mono text-[11px] uppercase">
                  Independence of Mass:
                </span>
                <p>
                  A simple pendulum’s period depends only on the length of the string L and gravitational acceleration g, completely independent of the mass of the bob.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. WAVE MOTION & DOPPLER EFFECT */}
      {/* ============================================================== */}
      {activeMode === 'wave-doppler' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE DOPPLER SOUND WAVEFRONT COMPRESSION</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Moving Sound Source moving Right (→) */}
                {(() => {
                  const sourceX = 140 + ((animTime * dopplerSourceSpeed * 0.8) % 120);

                  return (
                    <g>
                      {/* Compressed circular wavefronts in front (right) and expanded behind (left) */}
                      {[15, 35, 55, 75, 95].map((r, i) => {
                        const shiftX = sourceX - i * (dopplerSourceSpeed * 0.4);
                        return (
                          <circle
                            key={i}
                            cx={shiftX}
                            cy="100"
                            r={r + (animTime * 15) % 30}
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="1.2"
                            strokeDasharray="3 3"
                            opacity={Math.max(0.2, 1 - i * 0.18)}
                          />
                        );
                      })}

                      {/* Moving Siren Vehicle */}
                      <circle cx={sourceX} cy="100" r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" className="animate-pulse" />
                      <text x={sourceX} y="125" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="bold">Source v_s</text>

                      {/* Stationary Observers */}
                      <text x="310" y="95" textAnchor="middle" fill="#10b981" fontSize="16">👂</text>
                      <text x="310" y="115" textAnchor="middle" fill="#10b981" fontSize="8" fontFamily="monospace">Ahead (Higher Pitch)</text>

                      <text x="30" y="95" textAnchor="middle" fill="#f59e0b" fontSize="16">👂</text>
                      <text x="30" y="115" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace">Behind (Lower Pitch)</text>
                    </g>
                  );
                })()}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Source Speed v_s = {dopplerSourceSpeed} m/s</span>
                <span className="text-emerald-400 font-bold">Ahead (Approaching): {observedFreqApproaching} Hz</span>
                <span className="text-amber-400 font-bold">Behind (Receding): {observedFreqReceding} Hz</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Doppler Frequency Shift</h4>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Vehicle Speed (v_s):</span>
                    <span className="text-cyan-400 font-bold">{dopplerSourceSpeed} m/s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="70"
                    step="5"
                    value={dopplerSourceSpeed}
                    onChange={(e) => setDopplerSourceSpeed(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-cyan-400 font-bold block font-mono text-[11px] uppercase">
                  Wavefront Bunching:
                </span>
                <p>
                  As the source moves, each successive wave crest is emitted closer to the previous one in the direction of motion, shortening apparent wavelength and elevating the perceived sound pitch.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
