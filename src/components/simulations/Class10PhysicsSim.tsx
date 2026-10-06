import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  Sliders,
  Eye,
  Sun,
  Activity,
  Compass,
  Wind,
} from 'lucide-react';

interface Class10PhysicsSimProps {
  simulationType?: string;
  conceptId?: string;
  variables?: Record<string, number>;
}

type Physics10Mode =
  | 'spherical-mirrors'
  | 'refraction-lenses'
  | 'human-eye-optics'
  | 'electricity-circuits'
  | 'magnetic-effects'
  | 'energy-sources';

export const Class10PhysicsSim: React.FC<Class10PhysicsSimProps> = ({
  simulationType = 'class10-physics',
  conceptId = '',
  variables = {},
}) => {
  const getInitialMode = (): Physics10Mode => {
    if (
      conceptId.includes('mirror') ||
      conceptId.includes('reflection') ||
      simulationType.includes('mirror')
    ) return 'spherical-mirrors';

    if (
      conceptId.includes('lens') ||
      conceptId.includes('refraction') ||
      conceptId.includes('glass-slab') ||
      conceptId.includes('snell') ||
      simulationType.includes('lens')
    ) return 'refraction-lenses';

    if (
      conceptId.includes('eye') ||
      conceptId.includes('myopia') ||
      conceptId.includes('hypermetropia') ||
      conceptId.includes('prism') ||
      conceptId.includes('dispersion') ||
      conceptId.includes('scattering') ||
      conceptId.includes('atmospheric')
    ) return 'human-eye-optics';

    if (
      conceptId.includes('current') ||
      conceptId.includes('potential') ||
      conceptId.includes('ohms-law') ||
      conceptId.includes('resistance') ||
      conceptId.includes('series-parallel') ||
      conceptId.includes('heating') ||
      conceptId.includes('power')
    ) return 'electricity-circuits';

    if (
      conceptId.includes('magnetic') ||
      conceptId.includes('solenoid') ||
      conceptId.includes('fleming') ||
      conceptId.includes('motor') ||
      conceptId.includes('induction') ||
      conceptId.includes('domestic')
    ) return 'magnetic-effects';

    if (conceptId.includes('energy') || conceptId.includes('wind') || conceptId.includes('hydro')) {
      return 'energy-sources';
    }

    return 'spherical-mirrors';
  };

  const [activeMode, setActiveMode] = useState<Physics10Mode>(getInitialMode());
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
  // MODE 1: SPHERICAL MIRRORS OPTICAL BENCH
  // ----------------------------------------------------------------------
  const [mirrorType, setMirrorType] = useState<'concave' | 'convex'>(() => {
    if (conceptId.toLowerCase().includes('convex')) return 'convex';
    return 'concave';
  });
  const [mirrorFocalLength, setMirrorFocalLength] = useState<number>(() => {
    if (conceptId.toLowerCase().includes('convex')) return Math.abs(variables.focalLengthMm ?? 20);
    return -Math.abs(variables.focalLengthMm ?? 20);
  });
  const [mirrorObjectU, setMirrorObjectU] = useState<number>(variables.objectDistanceU ?? -40);
  const [mirrorObjectHeight, setMirrorObjectHeight] = useState<number>(variables.objectHeightHo ?? 4);

  // Mirror formula: 1/v = 1/f - 1/u => v = (u*f)/(u - f)
  const effectiveF = mirrorType === 'concave' ? -Math.abs(mirrorFocalLength) : Math.abs(mirrorFocalLength);
  const calculatedImageV = (mirrorObjectU * effectiveF) / (mirrorObjectU - effectiveF);
  const mirrorMagnification = -calculatedImageV / mirrorObjectU;
  const calculatedImageHeight = mirrorObjectHeight * mirrorMagnification;

  // Geometry for SVG
  const poleX = 170;
  const axisY = 100;
  const mirrorScale = 1.6;
  const objX = Math.max(20, Math.min(poleX - 10, poleX + mirrorObjectU * mirrorScale));
  const objH = mirrorObjectHeight * 8;
  const imgX = Math.max(15, Math.min(320, poleX + calculatedImageV * mirrorScale));
  const imgH = calculatedImageHeight * 8;
  const focusX = poleX + effectiveF * mirrorScale;
  const centerOfCurvX = poleX + 2 * effectiveF * mirrorScale;

  // ----------------------------------------------------------------------
  // MODE 2: LENSES & REFRACTION BENCH
  // ----------------------------------------------------------------------
  const [lensType, setLensType] = useState<'convex' | 'concave' | 'slab'>(() => {
    if (conceptId.includes('glass-slab')) return 'slab';
    if (conceptId.includes('concave-lens')) return 'concave';
    return 'convex';
  });
  const [lensF, setLensF] = useState<number>(25);
  const [lensU, setLensU] = useState<number>(-40);
  const [incidentAngleI, setIncidentAngleI] = useState<number>(45);

  const effectiveLensF = lensType === 'convex' ? Math.abs(lensF) : -Math.abs(lensF);
  const calculatedLensV = (lensU * effectiveLensF) / (lensU + effectiveLensF);
  const lensMagnification = calculatedLensV / lensU;

  const lensOpticalCenterX = 170;
  const lensObjX = Math.max(20, Math.min(lensOpticalCenterX - 10, lensOpticalCenterX + lensU * 1.6));
  const lensImgX = Math.max(10, Math.min(330, lensOpticalCenterX + calculatedLensV * 1.6));
  const lensF1X = lensOpticalCenterX - effectiveLensF * 1.6;
  const lensF2X = lensOpticalCenterX + effectiveLensF * 1.6;

  // Glass slab Snell's law: n1 sin i = n2 sin r
  const slabRefractiveIndex = 1.5;
  const radI = (incidentAngleI * Math.PI) / 180;
  const sinR = Math.sin(radI) / slabRefractiveIndex;
  const radR = Math.asin(sinR);
  const degR = Math.round((radR * 180) / Math.PI * 10) / 10;
  const slabThickness = 60;
  const lateralDisplacement = (slabThickness * Math.sin(radI - radR)) / Math.cos(radR);

  // ----------------------------------------------------------------------
  // MODE 3: THE HUMAN EYE, MYOPIA & PRISM DISPERSION
  // ----------------------------------------------------------------------
  const [eyeMode, setEyeMode] = useState<'myopia' | 'hypermetropia' | 'prism' | 'scattering'>(() => {
    if (conceptId.includes('hypermetropia')) return 'hypermetropia';
    if (conceptId.includes('prism') || conceptId.includes('dispersion')) return 'prism';
    if (conceptId.includes('scattering') || conceptId.includes('atmospheric')) return 'scattering';
    return 'myopia';
  });
  const [spectacleCorrected, setSpectacleCorrected] = useState<boolean>(true);

  // ----------------------------------------------------------------------
  // MODE 4: ELECTRICITY & OHM'S LAW CIRCUITS
  // ----------------------------------------------------------------------
  const [circuitVoltage, setCircuitVoltage] = useState<number>(variables.appliedVoltageV ?? 12);
  const [circuitR1, setCircuitR1] = useState<number>(variables.resistorR1 ?? 10);
  const [circuitR2, setCircuitR2] = useState<number>(variables.resistorR2 ?? 20);
  const [circuitTopology, setCircuitTopology] = useState<'series' | 'parallel'>(() => {
    if (conceptId.includes('parallel')) return 'parallel';
    return 'series';
  });
  const [isSwitchClosed, setIsSwitchClosed] = useState<boolean>(true);

  const eqResistance =
    circuitTopology === 'series'
      ? circuitR1 + circuitR2
      : (circuitR1 * circuitR2) / (circuitR1 + circuitR2);
  const totalCircuitCurrent = isSwitchClosed ? circuitVoltage / eqResistance : 0;
  const joulePowerHeat = Math.round(totalCircuitCurrent * totalCircuitCurrent * eqResistance * 10) / 10;

  // ----------------------------------------------------------------------
  // MODE 5: MAGNETIC EFFECTS & MOTOR / EMI
  // ----------------------------------------------------------------------
  const [magneticSubMode, setMagneticSubMode] = useState<'motor' | 'solenoid' | 'induction'>(() => {
    if (conceptId.includes('solenoid')) return 'solenoid';
    if (conceptId.includes('induction') || conceptId.includes('right-hand')) return 'induction';
    return 'motor';
  });
  const [motorSpeedRpm, setMotorSpeedRpm] = useState<number>(60);
  const [solenoidCurrent, setSolenoidCurrent] = useState<number>(4);
  const [magnetDistance, setMagnetDistance] = useState<number>(0);

  // ----------------------------------------------------------------------
  // MODE 6: ENERGY SOURCES
  // ----------------------------------------------------------------------
  const [windSpeed, setWindSpeed] = useState<number>(variables.windSpeedMPerS ?? 12);

  // Helper for animated traveling photons/pulses on line segments
  const getPulsePos = (x1: number, y1: number, x2: number, y2: number, offsetFraction: number) => {
    const t = (animTime * 0.8 + offsetFraction) % 1;
    return {
      x: x1 + (x2 - x1) * t,
      y: y1 + (y2 - y1) * t,
    };
  };

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                NCERT Class 10 Physics • Live Laboratory
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Live physics engine with real-time ray tracing, drift currents & dynamic wave mechanics
            </p>
          </div>
        </div>

        {/* Live Simulation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
            title={isPlaying ? 'Pause live animation' : 'Resume live animation'}
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

        {/* Mode Navigation Tabs (Visible when browsing full lab) */}
        {!isExploringTopic && (
          <div className="w-full flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs mt-2">
            {[
              { id: 'spherical-mirrors', label: 'Mirrors & Reflection' },
              { id: 'refraction-lenses', label: 'Lenses & Refraction' },
              { id: 'human-eye-optics', label: 'Human Eye & Prism' },
              { id: 'electricity-circuits', label: 'Electricity Circuits' },
              { id: 'magnetic-effects', label: 'Magnetism & Motor' },
              { id: 'energy-sources', label: 'Energy Sources' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id as Physics10Mode)}
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
      {/* MODE 1: SPHERICAL MIRRORS OPTICAL BENCH (LIVE RAY TRACING) */}
      {/* ============================================================== */}
      {activeMode === 'spherical-mirrors' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-300 font-mono font-bold uppercase flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-cyan-400" />
              Mirror Geometry:
            </span>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => {
                  setMirrorType('concave');
                  setMirrorFocalLength(-20);
                }}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  mirrorType === 'concave'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Concave Mirror (Converging, f &lt; 0)
              </button>
              <button
                onClick={() => {
                  setMirrorType('convex');
                  setMirrorFocalLength(20);
                }}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  mirrorType === 'convex'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Convex Mirror (Diverging, f &gt; 0)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Live Interactive Optical Bench Canvas */}
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE RAY TRACING</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                <defs>
                  {/* Glowing light pulse gradient */}
                  <radialGradient id="rayGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                  </radialGradient>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                  </marker>
                  <marker id="arrowImg" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                  </marker>
                </defs>

                {/* Principal Axis */}
                <line x1="10" y1={axisY} x2="340" y2={axisY} stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Mirror Curved Surface at poleX */}
                {mirrorType === 'concave' ? (
                  /* Concave: Caves inwards away from light (opening towards left, pole/hollow to right) */
                  <path d={`M ${poleX - 10},20 Q ${poleX + 16},${axisY} ${poleX - 10},180`} fill="none" stroke="#38bdf8" strokeWidth="4" />
                ) : (
                  /* Convex: Bulges outwards towards the object on left (crest to left) */
                  <path d={`M ${poleX + 10},20 Q ${poleX - 16},${axisY} ${poleX + 10},180`} fill="none" stroke="#38bdf8" strokeWidth="4" />
                )}

                {/* Silvered backing notches (always on the non-reflecting right side) */}
                {mirrorType === 'concave' ? (
                  <path d={`M ${poleX - 8},25 L ${poleX - 3},20 M ${poleX + 1},60 L ${poleX + 6},55 M ${poleX + 5},100 L ${poleX + 10},95 M ${poleX + 1},140 L ${poleX + 6},135 M ${poleX - 8},175 L ${poleX - 3},170`} stroke="#64748b" strokeWidth="1.5" />
                ) : (
                  <path d={`M ${poleX + 12},25 L ${poleX + 17},20 M ${poleX + 3},60 L ${poleX + 8},55 M ${poleX - 1},100 L ${poleX + 4},95 M ${poleX + 3},140 L ${poleX + 8},135 M ${poleX + 12},175 L ${poleX + 17},170`} stroke="#64748b" strokeWidth="1.5" />
                )}

                {/* Pole P */}
                <circle cx={poleX} cy={axisY} r="3.5" fill="#38bdf8" />
                <text x={poleX - 8} y={axisY + 15} fill="#38bdf8" fontSize="8" fontFamily="monospace">P</text>

                {/* Principal Focus F */}
                <circle cx={focusX} cy={axisY} r="3" fill="#f59e0b" />
                <text x={focusX - 3} y={axisY + 14} fill="#f59e0b" fontSize="8" fontFamily="monospace">F</text>

                {/* Center of Curvature C */}
                {centerOfCurvX > 10 && centerOfCurvX < 340 && (
                  <>
                    <circle cx={centerOfCurvX} cy={axisY} r="3" fill="#ec4899" />
                    <text x={centerOfCurvX - 3} y={axisY + 14} fill="#ec4899" fontSize="8" fontFamily="monospace">C</text>
                  </>
                )}

                {/* LIVE DYNAMIC OBJECT ARROW */}
                <line
                  x1={objX}
                  y1={axisY}
                  x2={objX}
                  y2={axisY - objH}
                  stroke="#10b981"
                  strokeWidth="3.5"
                />
                <polygon
                  points={`${objX},${axisY - objH - 5} ${objX - 4},${axisY - objH + 4} ${objX + 4},${axisY - objH + 4}`}
                  fill="#10b981"
                />
                <text x={objX - 10} y={axisY - objH - 8} fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  Object (h)
                </text>

                {/* LIVE DYNAMIC IMAGE ARROW */}
                {isFinite(imgX) && isFinite(imgH) && Math.abs(calculatedImageV) < 140 && (
                  <g>
                    <line
                      x1={imgX}
                      y1={axisY}
                      x2={imgX}
                      y2={axisY - imgH}
                      stroke="#f59e0b"
                      strokeWidth="3"
                      strokeDasharray={calculatedImageV > 0 ? '3 2' : 'none'}
                    />
                    <polygon
                      points={
                        imgH > 0
                          ? `${imgX},${axisY - imgH - 5} ${imgX - 4},${axisY - imgH + 3} ${imgX + 4},${axisY - imgH + 3}`
                          : `${imgX},${axisY - imgH + 5} ${imgX - 4},${axisY - imgH - 3} ${imgX + 4},${axisY - imgH - 3}`
                      }
                      fill="#f59e0b"
                    />
                    <text
                      x={imgX - 10}
                      y={imgH > 0 ? axisY - imgH - 8 : axisY - imgH + 16}
                      fill="#f59e0b"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      Image (h&apos;)
                    </text>
                  </g>
                )}

                {/* LIVE RAY 1: Parallel to principal axis -> Reflects */}
                <line x1={objX} y1={axisY - objH} x2={poleX} y2={axisY - objH} stroke="#e2e8f0" strokeWidth="1.5" opacity="0.8" />
                {mirrorType === 'concave' ? (
                  calculatedImageV < 0 ? (
                    // Concave Real Image: reflected ray passes through real Focus F on left and image tip
                    <>
                      <line x1={poleX} y1={axisY - objH} x2={Math.min(340, Math.max(10, imgX - 30))} y2={axisY - imgH - ((imgH - objH) / (imgX - poleX)) * 30} stroke="#38bdf8" strokeWidth="1.5" />
                      {/* Animated photon pulse moving on reflected ray */}
                      {(() => {
                        const p1 = getPulsePos(objX, axisY - objH, poleX, axisY - objH, 0);
                        const p2 = getPulsePos(poleX, axisY - objH, imgX, axisY - imgH, 0.5);
                        return (
                          <>
                            <circle cx={p1.x} cy={p1.y} r="3" fill="#38bdf8" />
                            <circle cx={p2.x} cy={p2.y} r="3" fill="#f59e0b" />
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    // Concave Virtual Image (object between P and F): reflected ray diverges forward, dashed extension meets behind mirror
                    <>
                      {/* Divergent reflected ray into real space */}
                      <line x1={poleX} y1={axisY - objH} x2={20} y2={axisY - objH + ((axisY - (axisY - objH)) / (poleX - focusX)) * (poleX - 20)} stroke="#38bdf8" strokeWidth="1.5" />
                      {/* Virtual extension behind mirror straight to virtual image tip */}
                      <line x1={poleX} y1={axisY - objH} x2={imgX} y2={axisY - imgH} stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" />
                    </>
                  )
                ) : (
                  // Convex Mirror: reflects diverging away into space; virtual extension reaches virtual focus F and image tip
                  <>
                    {/* Reflected ray diverging upwards and left */}
                    {(() => {
                      const divSlope = objH / (focusX - poleX);
                      const divY = Math.max(10, axisY - objH - divSlope * (poleX - 20));
                      return <line x1={poleX} y1={axisY - objH} x2={20} y2={divY} stroke="#38bdf8" strokeWidth="1.5" />;
                    })()}
                    {/* Virtual extension backwards through virtual focus F and virtual image */}
                    <line x1={poleX} y1={axisY - objH} x2={focusX} y2={axisY} stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" />
                  </>
                )}

                {/* LIVE RAY 2: Ray incident on Pole P -> Reflects at equal angle */}
                <line x1={objX} y1={axisY - objH} x2={poleX} y2={axisY} stroke="#cbd5e1" strokeWidth="1.2" opacity="0.7" />
                {mirrorType === 'concave' ? (
                  calculatedImageV < 0 ? (
                    // Real image reflected ray passes through image
                    <line
                      x1={poleX}
                      y1={axisY}
                      x2={Math.min(340, Math.max(10, imgX - 30))}
                      y2={axisY - imgH - (imgH / (poleX - imgX)) * 30}
                      stroke="#38bdf8"
                      strokeWidth="1.2"
                    />
                  ) : (
                    // Virtual image: reflected ray into real space, virtual extension behind mirror
                    <>
                      <line x1={poleX} y1={axisY} x2={20} y2={axisY + (objH * (poleX - 20)) / (poleX - objX)} stroke="#38bdf8" strokeWidth="1.2" />
                      <line x1={poleX} y1={axisY} x2={imgX} y2={axisY - imgH} stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" />
                    </>
                  )
                ) : (
                  // Convex mirror: reflected ray into real space, virtual extension to virtual image
                  <>
                    <line x1={poleX} y1={axisY} x2={20} y2={axisY + (objH * (poleX - 20)) / (poleX - objX)} stroke="#38bdf8" strokeWidth="1.2" />
                    <line x1={poleX} y1={axisY} x2={imgX} y2={axisY - imgH} stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" />
                  </>
                )}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Object Distance u: {mirrorObjectU} cm</span>
                <span className="text-amber-400 font-bold">
                  Image Distance v: {isFinite(calculatedImageV) ? `${Math.round(calculatedImageV * 10) / 10} cm` : 'Infinity'}
                </span>
                <span className="text-cyan-400 font-bold">
                  Magnification m: {isFinite(mirrorMagnification) ? Math.round(mirrorMagnification * 100) / 100 : 'N/A'}
                </span>
              </div>
            </div>

            {/* Controls & Sign Convention */}
            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">
                  Mirror Formula: 1/v + 1/u = 1/f
                </h4>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1.5 font-mono">
                    <span className="text-slate-300">Object Distance (u):</span>
                    <span className="text-cyan-400 font-bold">{mirrorObjectU} cm</span>
                  </div>
                  <input
                    type="range"
                    min="-75"
                    max="-12"
                    step="1"
                    value={mirrorObjectU}
                    onChange={(e) => setMirrorObjectU(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>Far (-75 cm)</span>
                    <span>Near (-12 cm)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5 font-mono">
                    <span className="text-slate-300">Focal Length (|f|):</span>
                    <span className="text-amber-400 font-bold">{Math.abs(mirrorFocalLength)} cm</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="35"
                    step="1"
                    value={Math.abs(mirrorFocalLength)}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setMirrorFocalLength(mirrorType === 'concave' ? -v : v);
                    }}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
                <span className="text-amber-400 font-bold block font-mono text-[11px] uppercase tracking-wider">
                  Live Image Characteristics:
                </span>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span><strong>Nature:</strong> {calculatedImageV < 0 ? 'Real & Inverted (Front of mirror)' : 'Virtual & Erect (Behind mirror)'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span><strong>Size:</strong> {Math.abs(mirrorMagnification) > 1 ? 'Magnified' : Math.abs(mirrorMagnification) < 1 ? 'Diminished' : 'Same Size'}</span>
                </p>
                <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/80">
                  Cartesian rule: u is strictly negative; concave f &lt; 0; convex f &gt; 0.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 2: LENSES & REFRACTION BENCH */}
      {/* ============================================================== */}
      {activeMode === 'refraction-lenses' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-300 font-mono font-bold uppercase">
              Refraction Media:
            </span>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setLensType('convex')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  lensType === 'convex'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Convex Lens (Converging)
              </button>
              <button
                onClick={() => setLensType('concave')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  lensType === 'concave'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Concave Lens (Diverging)
              </button>
              <button
                onClick={() => setLensType('slab')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  lensType === 'slab'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Glass Slab (Lateral Shift)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Live Canvas for Lenses / Slab */}
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{lensType === 'slab' ? 'SNELL’S LAW LATERAL DISPLACEMENT' : 'LIVE LENS REFRACTION BENCH'}</span>
              </div>

              {lensType !== 'slab' ? (
                <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                  {/* Axis */}
                  <line x1="10" y1="100" x2="340" y2="100" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />

                  {/* Thin Lens Profile at x = 170 */}
                  {lensType === 'convex' ? (
                    <ellipse cx={lensOpticalCenterX} cy="100" rx="9" ry="75" fill="#38bdf825" stroke="#38bdf8" strokeWidth="2.5" />
                  ) : (
                    <path
                      d={`M ${lensOpticalCenterX - 8},25 Q ${lensOpticalCenterX},100 ${lensOpticalCenterX - 8},175 L ${lensOpticalCenterX + 8},175 Q ${lensOpticalCenterX},100 ${lensOpticalCenterX + 8},25 Z`}
                      fill="#38bdf825"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Optical Center O */}
                  <circle cx={lensOpticalCenterX} cy="100" r="3.5" fill="#38bdf8" />
                  <text x={lensOpticalCenterX + 4} y="115" fill="#38bdf8" fontSize="8" fontFamily="monospace">O</text>

                  {/* Focus F1 and F2 */}
                  <circle cx={lensF1X} cy="100" r="3" fill="#f59e0b" />
                  <text x={lensF1X - 6} y="115" fill="#f59e0b" fontSize="8" fontFamily="monospace">F₁</text>
                  <circle cx={lensF2X} cy="100" r="3" fill="#f59e0b" />
                  <text x={lensF2X - 6} y="115" fill="#f59e0b" fontSize="8" fontFamily="monospace">F₂</text>

                  {/* Live Object Arrow */}
                  <line x1={lensObjX} y1="100" x2={lensObjX} y2="55" stroke="#10b981" strokeWidth="3.5" />
                  <polygon points={`${lensObjX},49 ${lensObjX - 4},58 ${lensObjX + 4},58`} fill="#10b981" />
                  <text x={lensObjX - 10} y="44" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">Object</text>

                  {/* Live Image Arrow */}
                  {isFinite(lensImgX) && (
                    <g>
                      <line
                        x1={lensImgX}
                        y1="100"
                        x2={lensImgX}
                        y2={100 - 45 * lensMagnification}
                        stroke="#f59e0b"
                        strokeWidth="3"
                        strokeDasharray={calculatedLensV < 0 ? '3 2' : 'none'}
                      />
                      <polygon
                        points={
                          lensMagnification > 0
                            ? `${lensImgX},${100 - 45 * lensMagnification - 5} ${lensImgX - 4},${100 - 45 * lensMagnification + 3} ${lensImgX + 4},${100 - 45 * lensMagnification + 3}`
                            : `${lensImgX},${100 - 45 * lensMagnification + 5} ${lensImgX - 4},${100 - 45 * lensMagnification - 3} ${lensImgX + 4},${100 - 45 * lensMagnification - 3}`
                        }
                        fill="#f59e0b"
                      />
                      <text x={lensImgX - 10} y={lensMagnification > 0 ? 90 - 45 * lensMagnification : 115 - 45 * lensMagnification} fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">
                        Image
                      </text>
                    </g>
                  )}

                  {/* Live Refracting Rays */}
                  {/* Ray 1: Parallel -> Passes through Focus F2 */}
                  <line x1={lensObjX} y1="55" x2={lensOpticalCenterX} y2="55" stroke="#e2e8f0" strokeWidth="1.5" />
                  {lensType === 'convex' ? (
                    <line x1={lensOpticalCenterX} y1="55" x2={lensImgX} y2={100 - 45 * lensMagnification} stroke="#38bdf8" strokeWidth="1.5" />
                  ) : (
                    <line x1={lensOpticalCenterX} y1="55" x2="330" y2="20" stroke="#38bdf8" strokeWidth="1.5" />
                  )}

                  {/* Ray 2: Through Optical Center O (undeviated) */}
                  <line x1={lensObjX} y1="55" x2={lensOpticalCenterX} y2="100" stroke="#94a3b8" strokeWidth="1.2" opacity="0.8" />
                  <line x1={lensOpticalCenterX} y1="100" x2={lensImgX} y2={100 - 45 * lensMagnification} stroke="#38bdf8" strokeWidth="1.2" />

                  {/* Animated gliding photon pulses */}
                  {(() => {
                    const p1 = getPulsePos(lensObjX, 55, lensOpticalCenterX, 55, 0);
                    const p2 = getPulsePos(lensOpticalCenterX, 55, lensImgX, 100 - 45 * lensMagnification, 0.5);
                    return (
                      <>
                        <circle cx={p1.x} cy={p1.y} r="3" fill="#38bdf8" />
                        <circle cx={p2.x} cy={p2.y} r="3" fill="#f59e0b" />
                      </>
                    );
                  })()}
                </svg>
              ) : (
                /* Glass Slab Lateral Displacement Live Visual */
                <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                  {/* Glass Slab Body */}
                  <rect x="75" y="70" width="200" height="60" fill="#0284c718" stroke="#38bdf8" strokeWidth="2" rx="4" />
                  <text x="175" y="105" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                    Refractive Glass Slab (n = 1.5)
                  </text>

                  {/* Normal 1 at top surface */}
                  <line x1="130" y1="40" x2="130" y2="100" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="133" y="48" fill="#64748b" fontSize="8" fontFamily="monospace">Normal</text>

                  {/* Incident Ray in air */}
                  <line x1="70" y1="20" x2="130" y2="70" stroke="#f8fafc" strokeWidth="2.5" />
                  <text x="80" y="38" fill="#f8fafc" fontSize="8" fontFamily="monospace">Incident ray (i = {incidentAngleI}°)</text>

                  {/* Refracted Ray inside glass */}
                  {/* dx inside slab: thickness * tan(r) */}
                  {(() => {
                    const dxSlab = 60 * Math.tan(radR);
                    const exitX = 130 + dxSlab;
                    const p1 = getPulsePos(70, 20, 130, 70, 0);
                    const p2 = getPulsePos(130, 70, exitX, 130, 0.35);
                    const p3 = getPulsePos(exitX, 130, exitX + 60, 180, 0.7);

                    return (
                      <>
                        {/* Normal 2 at bottom surface */}
                        <line x1={exitX} y1="100" x2={exitX} y2="160" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />

                        {/* Refracted beam inside */}
                        <line x1="130" y1="70" x2={exitX} y2="130" stroke="#38bdf8" strokeWidth="2.5" />
                        <text x="135" y="95" fill="#38bdf8" fontSize="8" fontFamily="monospace">r = {degR}°</text>

                        {/* Emergent Ray parallel to incident ray */}
                        <line x1={exitX} y1="130" x2={exitX + 60} y2="180" stroke="#10b981" strokeWidth="2.5" />
                        <text x={exitX + 15} y="165" fill="#10b981" fontSize="8" fontFamily="monospace">Emergent ray (e = {incidentAngleI}°)</text>

                        {/* Undeviated dashed reference path */}
                        <line x1="130" y1="70" x2="210" y2="137" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                        <line x1="210" y1="137" x2="260" y2="178" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />

                        {/* Lateral shift indicator d */}
                        <line x1="202" y1="130" x2={exitX} y2="130" stroke="#f43f5e" strokeWidth="1.5" />
                        <text x="160" y="142" fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold">
                          Lateral Shift d = {Math.round(lateralDisplacement * 10) / 10} mm
                        </text>

                        {/* Live animated streaming photon pulses */}
                        <circle cx={p1.x} cy={p1.y} r="3" fill="#ffffff" />
                        <circle cx={p2.x} cy={p2.y} r="3" fill="#38bdf8" />
                        <circle cx={p3.x} cy={p3.y} r="3" fill="#10b981" />
                      </>
                    );
                  })()}
                </svg>
              )}

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                {lensType !== 'slab' ? (
                  <>
                    <span className="text-cyan-400 font-bold">Lens Power P = {Math.round((100 / lensF) * 10) / 10} D</span>
                    <span className="text-amber-400 font-bold">Image v: {Math.round(calculatedLensV * 10) / 10} cm</span>
                    <span className="text-emerald-400 font-bold">Magnification m: {Math.round(lensMagnification * 100) / 100}</span>
                  </>
                ) : (
                  <>
                    <span className="text-cyan-400 font-bold">Snell's Law: n₁ sin i = n₂ sin r</span>
                    <span className="text-emerald-400 font-bold">Angle r = {degR}°</span>
                    <span className="text-rose-400 font-bold">Lateral Shift d = {Math.round(lateralDisplacement * 10) / 10} mm</span>
                  </>
                )}
              </div>
            </div>

            {/* Lens/Slab Controls */}
            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">
                {lensType === 'slab' ? "Snell's Law & Refraction Index" : 'Lens Formula: 1/v - 1/u = 1/f'}
              </h4>

              {lensType !== 'slab' ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between mb-1.5 font-mono">
                      <span className="text-slate-300">Object Distance (u):</span>
                      <span className="text-cyan-400 font-bold">{lensU} cm</span>
                    </div>
                    <input
                      type="range"
                      min="-70"
                      max="-15"
                      value={lensU}
                      onChange={(e) => setLensU(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5 font-mono">
                      <span className="text-slate-300">Focal Length (f):</span>
                      <span className="text-amber-400 font-bold">{lensF} cm</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="40"
                      value={lensF}
                      onChange={(e) => setLensF(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div>
                    <div className="flex justify-between mb-1.5 font-mono">
                      <span className="text-slate-300">Angle of Incidence (i):</span>
                      <span className="text-cyan-400 font-bold">{incidentAngleI}°</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="75"
                      value={incidentAngleI}
                      onChange={(e) => setIncidentAngleI(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <span className="text-amber-400 font-bold block font-mono text-[11px] uppercase">
                  Optical Principle:
                </span>
                <p className="leading-relaxed">
                  {lensType === 'slab'
                    ? 'The emergent ray from a parallel glass slab is strictly parallel to the incident ray because the lateral surfaces are parallel, but it is laterally displaced by distance d.'
                    : 'Convex lenses converge parallel incident light rays to a real focus (f > 0, P > 0). Concave lenses diverge incident rays (f < 0, P < 0). Power P is measured in Dioptres (D = 1/f in meters).'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 3: THE HUMAN EYE, MYOPIA & PRISM DISPERSION */}
      {/* ============================================================== */}
      {activeMode === 'human-eye-optics' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-300 font-mono font-bold uppercase">
              Optical System:
            </span>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setEyeMode('myopia')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  eyeMode === 'myopia'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Human Eye: Myopia Correction
              </button>
              <button
                onClick={() => setEyeMode('prism')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  eyeMode === 'prism'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Prism Dispersion (VIBGYOR)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {eyeMode === 'myopia' ? (
              <>
                <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
                  <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>LIVE RETINAL FOCUS SIMULATION</span>
                  </div>

                  <svg viewBox="0 0 340 190" className="w-full h-56 select-none">
                    {/* Eyeball circular profile */}
                    <ellipse cx="210" cy="95" rx="80" ry="70" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
                    {/* Retina back wall */}
                    <path d="M 265,50 A 80 70 0 0 1 265,140" fill="none" stroke="#f43f5e" strokeWidth="4" />
                    <text x="275" y="98" fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold">Retina</text>

                    {/* Eye Crystalline Lens */}
                    <ellipse cx="150" cy="95" rx="9" ry="32" fill="#38bdf835" stroke="#38bdf8" strokeWidth="2" />
                    <text x="142" y="138" fill="#38bdf8" fontSize="8" fontFamily="monospace">Eye Lens</text>

                    {/* Spectacle concave lens if corrected */}
                    {spectacleCorrected && (
                      <g>
                        <path d="M 65,65 Q 70,95 65,125 L 75,125 Q 70,95 75,65 Z" fill="#818cf840" stroke="#818cf8" strokeWidth="2" />
                        <text x="50" y="55" fill="#818cf8" fontSize="8" fontFamily="monospace">Concave Eyeglass</text>
                      </g>
                    )}

                    {/* Live Light Rays entering eye */}
                    {spectacleCorrected ? (
                      /* Sharp focus on retina at x=280 */
                      <g stroke="#38bdf8" strokeWidth="1.6">
                        <line x1="15" y1="80" x2="68" y2="80" />
                        <line x1="68" y1="80" x2="150" y2="76" />
                        <line x1="150" y1="76" x2="280" y2="95" />
                        <line x1="15" y1="110" x2="68" y2="110" />
                        <line x1="68" y1="110" x2="150" y2="114" />
                        <line x1="150" y1="114" x2="280" y2="95" />
                        <circle cx="280" cy="95" r="4" fill="#38bdf8" className="animate-pulse" />
                        <text x="245" y="112" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">
                          ✓ Sharp Focus on Retina
                        </text>
                      </g>
                    ) : (
                      /* Defective focus inside eye at x=225 */
                      <g stroke="#f59e0b" strokeWidth="1.6">
                        <line x1="15" y1="80" x2="150" y2="80" />
                        <line x1="150" y1="80" x2="225" y2="95" />
                        <line x1="225" y1="95" x2="275" y2="110" strokeDasharray="3 3" opacity="0.6" />

                        <line x1="15" y1="110" x2="150" y2="110" />
                        <line x1="150" y1="110" x2="225" y2="95" />
                        <line x1="225" y1="95" x2="275" y2="80" strokeDasharray="3 3" opacity="0.6" />

                        <circle cx="225" cy="95" r="4.5" fill="#f59e0b" />
                        <text x="180" y="115" fill="#f59e0b" fontSize="8" fontFamily="monospace">
                          Focuses IN FRONT of retina!
                        </text>
                      </g>
                    )}
                  </svg>

                  <div className="flex items-center justify-between w-full mt-3">
                    <button
                      onClick={() => setSpectacleCorrected(!spectacleCorrected)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs shadow-md transition ${
                        spectacleCorrected
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                          : 'bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400'
                      }`}
                    >
                      {spectacleCorrected
                        ? 'Remove Concave Lens (See Defective Blurred Focus)'
                        : 'Wear Concave Eyeglass (Apply Sharp Retinal Correction)'}
                    </button>
                    <span className="text-xs font-mono text-slate-400">
                      Condition: {spectacleCorrected ? 'Corrected with f < 0 lens' : 'Myopic Eye (Elongated eyeball)'}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
                  <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Myopia & Power of Accommodation</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A myopic eye cannot see distant objects distinctly (far point is closer than infinity). Rays from distant objects converge in front of the retina due to excessive curvature of the eye lens or elongation of the eyeball.
                  </p>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-emerald-400 font-mono">
                    Correction: A concave lens of suitable focal length diverges parallel incident rays so that they focus sharply on the retina wall.
                  </div>
                </div>
              </>
            ) : (
              /* Prism Dispersion Live Wave Simulation */
              <>
                <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
                  <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>LIVE VIBGYOR SPECTRAL DISPERSION</span>
                  </div>

                  <svg viewBox="0 0 350 200" className="w-full h-56 select-none">
                    {/* Glass Prism */}
                    <polygon points="160,25 90,165 230,165" fill="#0284c718" stroke="#38bdf8" strokeWidth="2.5" />
                    <text x="160" y="115" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="monospace">
                      Glass Prism (A = 60°)
                    </text>

                    {/* White incident light beam */}
                    <line x1="20" y1="125" x2="125" y2="95" stroke="#ffffff" strokeWidth="3.5" />
                    <text x="25" y="115" fill="#ffffff" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      Incident White Light
                    </text>

                    {/* Rainbow Spectral Dispersion Rays */}
                    {[
                      { color: '#f43f5e', name: 'Red (λ ≈ 700 nm)', yExit: 105, yScreen: 100, label: 'Red: Least bent' },
                      { color: '#fb923c', name: 'Orange', yExit: 110, yScreen: 112, label: '' },
                      { color: '#facc15', name: 'Yellow', yExit: 115, yScreen: 124, label: 'Mean Yellow' },
                      { color: '#22c55e', name: 'Green', yExit: 120, yScreen: 136, label: '' },
                      { color: '#06b6d4', name: 'Blue', yExit: 125, yScreen: 148, label: '' },
                      { color: '#6366f1', name: 'Indigo', yExit: 130, yScreen: 160, label: '' },
                      { color: '#a855f7', name: 'Violet (λ ≈ 400 nm)', yExit: 135, yScreen: 172, label: 'Violet: Most bent' },
                    ].map((ray, idx) => {
                      const pulseT = ((animTime * 1.2 + idx * 0.15) % 1);
                      const px = 195 + (320 - 195) * pulseT;
                      const py = ray.yExit + (ray.yScreen - ray.yExit) * pulseT;

                      return (
                        <g key={ray.color}>
                          {/* Inside prism ray */}
                          <line x1="125" y1="95" x2="195" y2={ray.yExit} stroke={ray.color} strokeWidth="1.8" />
                          {/* Emergent ray */}
                          <line x1="195" y1={ray.yExit} x2="320" y2={ray.yScreen} stroke={ray.color} strokeWidth="2" />
                          {/* Moving wave pulses */}
                          <circle cx={px} cy={py} r="2.5" fill={ray.color} />
                          {ray.label && (
                            <text x="250" y={ray.yScreen - 3} fill={ray.color} fontSize="8" fontFamily="monospace">
                              {ray.label}
                            </text>
                          )}
                        </g>
                      );
                    })}

                    {/* White Screen */}
                    <line x1="320" y1="85" x2="320" y2="185" stroke="#94a3b8" strokeWidth="4" />
                    <text x="310" y="80" fill="#94a3b8" fontSize="8" fontFamily="monospace">Screen</text>
                  </svg>

                  <div className="flex items-center justify-between w-full text-xs font-mono text-slate-300 mt-2">
                    <span className="text-rose-400">Red: Longest λ, Fastest in glass, Minimum deviation δ</span>
                    <span className="text-purple-400">Violet: Shortest λ, Slowest in glass, Maximum deviation δ</span>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
                  <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Cauchy Dispersion Formula</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    The refractive index of glass varies inversely with wavelength: μ(λ) = A + B/λ². Red light (λ ≈ 700 nm) encounters the smallest refractive index and bends the least; violet light (λ ≈ 400 nm) encounters the largest index and bends the most, fanning out into the VIBGYOR band.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 4: ELECTRICITY & OHM'S LAW CIRCUITS (LIVE DRIFT CURRENT) */}
      {/* ============================================================== */}
      {activeMode === 'electricity-circuits' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-300 font-mono font-bold uppercase">
              Circuit Topology:
            </span>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setCircuitTopology('series')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  circuitTopology === 'series'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Series (R_eq = R₁ + R₂)
              </button>
              <button
                onClick={() => setCircuitTopology('parallel')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  circuitTopology === 'parallel'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Parallel (1/R_eq = 1/R₁ + 1/R₂)
              </button>
              <button
                onClick={() => setIsSwitchClosed(!isSwitchClosed)}
                className={`px-3 py-1.5 rounded-xl font-bold transition ml-2 ${
                  isSwitchClosed
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {isSwitchClosed ? 'Switch: CLOSED (Current ON)' : 'Switch: OPEN (0 A)'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Live Interactive Circuit Board */}
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-amber-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE ELECTRON DRIFT FLOW (-e)</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Circuit Copper Wire Loop */}
                <rect x="40" y="30" width="270" height="140" fill="none" stroke="#475569" strokeWidth="4" rx="10" />

                {/* Battery at bottom wire */}
                <rect x="145" y="160" width="50" height="20" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" rx="3" />
                <line x1="160" y1="165" x2="160" y2="175" stroke="#f59e0b" strokeWidth="3" />
                <line x1="175" y1="162" x2="175" y2="178" stroke="#38bdf8" strokeWidth="3" />
                <text x="148" y="155" fill="#f59e0b" fontSize="8" fontFamily="monospace">DC {circuitVoltage} V</text>

                {/* Key / Switch at right wire */}
                <circle cx="310" cy="100" r="4" fill={isSwitchClosed ? '#10b981' : '#f43f5e'} />
                <line
                  x1="310"
                  y1="100"
                  x2="310"
                  y2={isSwitchClosed ? "115" : "125"}
                  stroke={isSwitchClosed ? '#10b981' : '#f43f5e'}
                  strokeWidth="2.5"
                />

                {/* Resistor(s) or Glowing Bulb at top wire */}
                {circuitTopology === 'series' ? (
                  <g>
                    {/* Resistor 1 */}
                    <rect x="70" y="20" width="60" height="20" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
                    <text x="100" y="33" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">R₁ = {circuitR1} Ω</text>

                    {/* Resistor 2 */}
                    <rect x="170" y="20" width="60" height="20" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" rx="3" />
                    <text x="200" y="33" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace">R₂ = {circuitR2} Ω</text>
                  </g>
                ) : (
                  <g>
                    {/* Parallel Branch Top */}
                    <line x1="110" y1="30" x2="110" y2="15" stroke="#475569" strokeWidth="2" />
                    <line x1="110" y1="15" x2="230" y2="15" stroke="#475569" strokeWidth="2" />
                    <line x1="230" y1="15" x2="230" y2="30" stroke="#475569" strokeWidth="2" />
                    <rect x="140" y="6" width="60" height="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" rx="3" />
                    <text x="170" y="19" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace">R₁ = {circuitR1} Ω</text>

                    {/* Parallel Branch Bottom */}
                    <line x1="110" y1="30" x2="110" y2="45" stroke="#475569" strokeWidth="2" />
                    <line x1="110" y1="45" x2="230" y2="45" stroke="#475569" strokeWidth="2" />
                    <line x1="230" y1="45" x2="230" y2="30" stroke="#475569" strokeWidth="2" />
                    <rect x="140" y="36" width="60" height="18" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" rx="3" />
                    <text x="170" y="49" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace">R₂ = {circuitR2} Ω</text>
                  </g>
                )}

                {/* Animated Glowing Light Bulb on left wire */}
                <g>
                  <circle
                    cx="40"
                    cy="100"
                    r={isSwitchClosed ? 14 + Math.sin(animTime * 6) * 1.5 : 12}
                    fill={isSwitchClosed ? '#facc1550' : '#334155'}
                    stroke={isSwitchClosed ? '#facc15' : '#64748b'}
                    strokeWidth="2"
                  />
                  {isSwitchClosed && (
                    <circle cx="40" cy="100" r={22 + (joulePowerHeat / 10)} fill="#facc1515" className="animate-ping" />
                  )}
                  {/* Filament */}
                  <path d="M 36,104 L 38,96 L 42,96 L 44,104" fill="none" stroke={isSwitchClosed ? '#ffffff' : '#94a3b8'} strokeWidth="1.5" />
                  <text x="40" y="125" textAnchor="middle" fill="#facc15" fontSize="8" fontFamily="monospace">
                    {isSwitchClosed ? `${joulePowerHeat} W` : 'OFF'}
                  </text>
                </g>

                {/* LIVE DRIFTING ELECTRONS (-e) ALONG WIRE PERIMETER */}
                {isSwitchClosed &&
                  [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((phase, i) => {
                    // Total perimeter ~ 2*(270 + 140) = 820 units
                    const speed = totalCircuitCurrent * 45;
                    const dist = (animTime * speed + phase * 820) % 820;
                    let ex = 40;
                    let ey = 30;

                    if (dist < 270) {
                      ex = 40 + dist;
                      ey = 30;
                    } else if (dist < 270 + 140) {
                      ex = 310;
                      ey = 30 + (dist - 270);
                    } else if (dist < 270 + 140 + 270) {
                      ex = 310 - (dist - 410);
                      ey = 170;
                    } else {
                      ex = 40;
                      ey = 170 - (dist - 680);
                    }

                    return (
                      <g key={i}>
                        <circle cx={ex} cy={ey} r="3" fill="#38bdf8" />
                        <text x={ex - 2} y={ey + 2} fill="#050b14" fontSize="5" fontWeight="bold">e⁻</text>
                      </g>
                    );
                  })}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">DC Supply V = {circuitVoltage} V</span>
                <span className="text-amber-400 font-bold">Ammeter Current I = {Math.round(totalCircuitCurrent * 100) / 100} A</span>
                <span className="text-rose-400 font-bold">Joule Heat H = {joulePowerHeat} J/s (W)</span>
              </div>
            </div>

            {/* Circuit Sliders */}
            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">Ohm’s Law: V = I · R</h4>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1.5 font-mono">
                    <span className="text-slate-300">Voltage (V):</span>
                    <span className="text-cyan-400 font-bold">{circuitVoltage} V</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="24"
                    value={circuitVoltage}
                    onChange={(e) => setCircuitVoltage(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5 font-mono">
                    <span className="text-slate-300">Resistor R₁:</span>
                    <span className="text-amber-400 font-bold">{circuitR1} Ω</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={circuitR1}
                    onChange={(e) => setCircuitR1(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5 font-mono">
                    <span className="text-slate-300">Resistor R₂:</span>
                    <span className="text-amber-400 font-bold">{circuitR2} Ω</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={circuitR2}
                    onChange={(e) => setCircuitR2(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-emerald-400 font-bold block font-mono text-[11px] uppercase">
                  Equivalent Resistance:
                </span>
                <p className="font-mono text-sm text-white">
                  R_eq = {Math.round(eqResistance * 100) / 100} Ω
                </p>
                <p className="text-[11px] text-slate-400 pt-1">
                  {circuitTopology === 'series'
                    ? 'Series: Current I is identical through all components; voltages add up (V = V₁ + V₂).'
                    : 'Parallel: Voltage V is identical across all branches; currents add up (I = I₁ + I₂).'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 5: MAGNETIC EFFECTS & MOTOR / EMI (LIVE ROTATING MOTOR) */}
      {/* ============================================================== */}
      {activeMode === 'magnetic-effects' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-300 font-mono font-bold uppercase">
              Electromagnetic System:
            </span>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setMagneticSubMode('motor')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  magneticSubMode === 'motor'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                DC Motor (Fleming’s Left Hand Rule)
              </button>
              <button
                onClick={() => setMagneticSubMode('solenoid')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  magneticSubMode === 'solenoid'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Solenoid Field & Electromagnet
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Live Visual Motor Canvas */}
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{magneticSubMode === 'motor' ? 'LIVE ROTATING ARMATURE MOTOR' : 'LIVE SOLENOID MAGNETIC FLUX'}</span>
              </div>

              {magneticSubMode === 'motor' ? (
                /* LIVE ROTATING MOTOR */
                <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                  {/* Permanent Magnet North Pole (Red) */}
                  <rect x="25" y="45" width="55" height="90" rx="8" fill="#b91c1c" stroke="#f87171" strokeWidth="2" />
                  <text x="52" y="95" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="bold">N</text>

                  {/* Permanent Magnet South Pole (Blue) */}
                  <rect x="270" y="45" width="55" height="90" rx="8" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="2" />
                  <text x="297" y="95" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="bold">S</text>

                  {/* Magnetic Field Lines B (N -> S) with moving flux arrows */}
                  {[65, 80, 95, 110, 125].map((yLine, idx) => {
                    const arrowX = 80 + ((animTime * 60 + idx * 30) % 190);
                    return (
                      <g key={yLine}>
                        <line x1="80" y1={yLine} x2="270" y2={yLine} stroke="#0284c7" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                        <polygon points={`${arrowX},${yLine} ${arrowX - 4},${yLine - 2.5} ${arrowX - 4},${yLine + 2.5}`} fill="#38bdf8" />
                      </g>
                    );
                  })}

                  {/* CONTINUOUS ROTATING ARMATURE COIL ABCD */}
                  {(() => {
                    const angleRad = animTime * 3; // rotation angle
                    const cosA = Math.cos(angleRad);
                    const sinA = Math.sin(angleRad);

                    // Perspective height of coil arms
                    const arm1Y = 90 - sinA * 35;
                    const arm2Y = 90 + sinA * 35;

                    return (
                      <g>
                        {/* Commutator Split Ring at bottom center */}
                        <circle cx="175" cy="160" r="12" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="16 5" />
                        <text x="175" y="185" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="monospace">Split Ring Commutator</text>

                        {/* Armature rectangular frame ABCD */}
                        <polygon
                          points={`125,${arm1Y} 225,${arm1Y} 225,${arm2Y} 125,${arm2Y}`}
                          fill="#facc1520"
                          stroke="#facc15"
                          strokeWidth="3.5"
                        />

                        {/* Force Vectors on arms (Fleming's Left Hand Rule) */}
                        {/* Arm AB experiences upward force when current flows inward */}
                        <line x1="125" y1={arm1Y} x2="125" y2={arm1Y - 22} stroke="#10b981" strokeWidth="3" />
                        <polygon points={`125,${arm1Y - 26} 121,${arm1Y - 20} 129,${arm1Y - 20}`} fill="#10b981" />
                        <text x="100" y={arm1Y - 24} fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">F_up</text>

                        {/* Arm CD experiences downward force */}
                        <line x1="225" y1={arm2Y} x2="225" y2={arm2Y + 22} stroke="#f43f5e" strokeWidth="3" />
                        <polygon points={`225,${arm2Y + 26} 221,${arm2Y + 20} 229,${arm2Y + 20}`} fill="#f43f5e" />
                        <text x="232" y={arm2Y + 24} fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold">F_down</text>

                        {/* Central Rotation Axis */}
                        <line x1="175" y1="40" x2="175" y2="150" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                      </g>
                    );
                  })()}
                </svg>
              ) : (
                /* LIVE SOLENOID MAGNETIC FLUX */
                <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                  {/* Solenoid Helical Coils */}
                  <g>
                    {[80, 105, 130, 155, 180, 205, 230, 255].map((xCoil, idx) => (
                      <ellipse
                        key={idx}
                        cx={xCoil}
                        cy="95"
                        rx="10"
                        ry="35"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3.5"
                      />
                    ))}
                  </g>

                  {/* Concentric Magnetic Field Lines looping inside and outside */}
                  {[-45, -25, 0, 25, 45].map((yOffset, idx) => {
                    const arrowX = 60 + ((animTime * 50 + idx * 40) % 230);
                    return (
                      <g key={idx}>
                        <path
                          d={`M 60,${95 + yOffset} C 60,${30 + yOffset} 290,${30 + yOffset} 290,${95 + yOffset}`}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          opacity="0.7"
                        />
                        <circle cx={arrowX} cy={95 + yOffset} r="2.5" fill="#38bdf8" />
                      </g>
                    );
                  })}

                  {/* Soft Iron Core inside */}
                  <rect x="75" y="88" width="195" height="14" rx="3" fill="#475569" stroke="#94a3b8" strokeWidth="1" opacity="0.6" />
                  <text x="175" y="99" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="monospace">
                    Soft Iron Core (Electromagnet)
                  </text>
                </svg>
              )}

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Fleming’s Left-Hand Rule: Forefinger (B), Middle (I), Thumb (Force F)</span>
                <span className="text-amber-400 font-bold">Commutator reverses current every 180°</span>
              </div>
            </div>

            {/* Controls */}
            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">Electric Motor Principle</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                An electric motor converts electrical energy into mechanical rotational energy. A current-carrying coil placed in a magnetic field experiences a magnetic couple torque (F = B·I·L). The split-ring commutator reverses current direction every half rotation to sustain unidirectional torque.
              </p>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <span className="text-cyan-400 font-bold block font-mono text-[11px] uppercase">
                  Speed Control:
                </span>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={simSpeed}
                  onChange={(e) => setSimSpeed(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Slow</span>
                  <span>Fast ({simSpeed}x)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 6: SOURCES OF ENERGY (LIVE WIND TURBINE) */}
      {/* ============================================================== */}
      {activeMode === 'energy-sources' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Live Wind Aerodynamics Canvas */}
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE TURBINE AERODYNAMICS & POWER (P ∝ v³)</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Tower Mast */}
                <polygon points="170,80 180,80 185,180 165,180" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                {/* Nacelle housing */}
                <rect x="160" y="70" width="30" height="15" rx="4" fill="#64748b" stroke="#94a3b8" strokeWidth="1.5" />

                {/* Live Streaming Wind Streamlines */}
                {[30, 60, 90, 120, 150].map((yStream, idx) => {
                  const arrowX = 20 + ((animTime * (windSpeed * 10) + idx * 60) % 310);
                  return (
                    <g key={idx}>
                      <line x1="20" y1={yStream} x2="330" y2={yStream} stroke="#38bdf8" strokeWidth="1" strokeDasharray="8 6" opacity="0.4" />
                      <circle cx={arrowX} cy={yStream} r="2" fill="#38bdf8" />
                    </g>
                  );
                })}

                {/* ROTATING 3-BLADE ROTOR */}
                {(() => {
                  const rotorAngle = animTime * windSpeed * 0.4;
                  return (
                    <g transform={`translate(170, 77) rotate(${(rotorAngle * 180) / Math.PI})`}>
                      {/* Central Hub */}
                      <circle cx="0" cy="0" r="7" fill="#f8fafc" stroke="#64748b" strokeWidth="1.5" />
                      {/* Blade 1 */}
                      <path d="M 0,0 L -5,-55 Q 0,-60 5,-55 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                      {/* Blade 2 (120 deg) */}
                      <g transform="rotate(120)">
                        <path d="M 0,0 L -5,-55 Q 0,-60 5,-55 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                      </g>
                      {/* Blade 3 (240 deg) */}
                      <g transform="rotate(240)">
                        <path d="M 0,0 L -5,-55 Q 0,-60 5,-55 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="1" />
                      </g>
                    </g>
                  );
                })()}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Wind Speed v = {windSpeed} m/s</span>
                <span className="text-amber-400 font-bold">
                  Generated Electrical Power P = {Math.round(0.5 * 1.225 * 30 * Math.pow(windSpeed, 3) / 1000)} kW
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Cubic Power Relation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Wind power scales with the cube of wind velocity: P = ½ ρ A v³. Doubling wind speed increases kinetic energy flux and electric power yield by 8 times (2³ = 8).
              </p>

              <div>
                <div className="flex justify-between mb-1.5 font-mono text-xs">
                  <span className="text-slate-300">Wind Velocity (v):</span>
                  <span className="text-cyan-400 font-bold">{windSpeed} m/s</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="25"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
