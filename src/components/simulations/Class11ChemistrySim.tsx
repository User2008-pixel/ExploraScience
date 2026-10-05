import React, { useState, useEffect, useRef } from 'react';
import {
  Atom,
  Layers,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  CheckCircle2,
  TrendingUp,
  Compass,
  Zap,
} from 'lucide-react';

interface Class11ChemistrySimProps {
  simulationType?: string;
  conceptId?: string;
  variables?: Record<string, number>;
}

type Chem11Mode =
  | 'atomic-orbitals'
  | 'periodic-trends'
  | 'vsepr-geometry'
  | 'equilibrium-le-chatelier';

export const Class11ChemistrySim: React.FC<Class11ChemistrySimProps> = ({
  simulationType = 'class11-chemistry',
  conceptId = '',
  variables = {},
}) => {
  const getInitialMode = (): Chem11Mode => {
    if (conceptId.includes('orbital') || conceptId.includes('quantum') || conceptId.includes('configuration')) return 'atomic-orbitals';
    if (conceptId.includes('periodic') || conceptId.includes('trend') || conceptId.includes('radius') || conceptId.includes('ionization')) return 'periodic-trends';
    if (conceptId.includes('vsepr') || conceptId.includes('geometry') || conceptId.includes('hybridization')) return 'vsepr-geometry';
    if (conceptId.includes('equilibrium') || conceptId.includes('chatelier') || conceptId.includes('haber')) return 'equilibrium-le-chatelier';
    return 'atomic-orbitals';
  };

  const [activeMode, setActiveMode] = useState<Chem11Mode>(getInitialMode());

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
  // MODE 1: ATOMIC ORBITALS & QUANTUM NUMBERS (Manipulative)
  // ----------------------------------------------------------------------
  const [quantumN, setQuantumN] = useState<number>(2); // 1 to 4
  const [quantumL, setQuantumL] = useState<number>(1); // 0 to n-1
  const [quantumMl, setQuantumMl] = useState<number>(0); // -l to +l
  const [orbitalRotAngle, setOrbitalRotAngle] = useState<number>(45); // 0 - 360

  // Constrain l when n changes
  useEffect(() => {
    if (quantumL >= quantumN) {
      setQuantumL(quantumN - 1);
    }
  }, [quantumN]);

  // Constrain ml when l changes
  useEffect(() => {
    if (Math.abs(quantumMl) > quantumL) {
      setQuantumMl(0);
    }
  }, [quantumL]);

  const subshellLetter = ['s', 'p', 'd', 'f'][quantumL] || 's';
  const orbitalName = `${quantumN}${subshellLetter} (m_l = ${quantumMl})`;
  const maxElectronsInSubshell = 2 * (2 * quantumL + 1);

  // ----------------------------------------------------------------------
  // MODE 2: PERIODIC TRENDS (Manipulative)
  // ----------------------------------------------------------------------
  const [trendProp, setTrendProp] = useState<'radius' | 'ie' | 'en'>('radius');
  const [selectedSet, setSelectedSet] = useState<'period2' | 'period3' | 'group1'>('period2');
  const [shieldingFactor, setShieldingFactor] = useState<number>(80); // 0 - 100%

  const PERIOD_2 = [
    { sym: 'Li', z: 3, r: 152, ie: 520, en: 1.0 },
    { sym: 'Be', z: 4, r: 112, ie: 899, en: 1.5 },
    { sym: 'B', z: 5, r: 88, ie: 801, en: 2.0 },
    { sym: 'C', z: 6, r: 77, ie: 1086, en: 2.5 },
    { sym: 'N', z: 7, r: 70, ie: 1402, en: 3.0 },
    { sym: 'O', z: 8, r: 66, ie: 1314, en: 3.5 },
    { sym: 'F', z: 9, r: 64, ie: 1681, en: 4.0 },
    { sym: 'Ne', z: 10, r: 160, ie: 2080, en: 0.0 },
  ];

  const PERIOD_3 = [
    { sym: 'Na', z: 11, r: 186, ie: 496, en: 0.9 },
    { sym: 'Mg', z: 12, r: 160, ie: 738, en: 1.2 },
    { sym: 'Al', z: 13, r: 143, ie: 578, en: 1.5 },
    { sym: 'Si', z: 14, r: 118, ie: 786, en: 1.8 },
    { sym: 'P', z: 15, r: 110, ie: 1012, en: 2.1 },
    { sym: 'S', z: 16, r: 104, ie: 1000, en: 2.5 },
    { sym: 'Cl', z: 17, r: 99, ie: 1251, en: 3.0 },
    { sym: 'Ar', z: 18, r: 190, ie: 1521, en: 0.0 },
  ];

  const GROUP_1 = [
    { sym: 'Li', z: 3, r: 152, ie: 520, en: 1.0 },
    { sym: 'Na', z: 11, r: 186, ie: 496, en: 0.9 },
    { sym: 'K', z: 19, r: 227, ie: 419, en: 0.8 },
    { sym: 'Rb', z: 37, r: 248, ie: 403, en: 0.8 },
    { sym: 'Cs', z: 55, r: 265, ie: 376, en: 0.7 },
  ];

  const activeTrendData = selectedSet === 'period2' ? PERIOD_2 : selectedSet === 'period3' ? PERIOD_3 : GROUP_1;

  // ----------------------------------------------------------------------
  // MODE 3: VSEPR GEOMETRY & HYBRIDISATION (Manipulative)
  // ----------------------------------------------------------------------
  const [bondPairs, setBondPairs] = useState<number>(4); // 2 to 6
  const [lonePairs, setLonePairs] = useState<number>(0); // 0 to 3
  const [vseprRotation, setVseprRotation] = useState<number>(30); // 0 - 360

  const totalSteric = Math.min(6, Math.max(2, bondPairs + lonePairs));
  const getVseprGeometryName = () => {
    if (totalSteric === 2) return { name: 'Linear', angle: '180°', hybrid: 'sp' };
    if (totalSteric === 3) {
      if (lonePairs === 0) return { name: 'Trigonal Planar (BF₃)', angle: '120°', hybrid: 'sp²' };
      return { name: 'Bent / V-shaped (SO₂)', angle: '< 120° (~118°)', hybrid: 'sp²' };
    }
    if (totalSteric === 4) {
      if (lonePairs === 0) return { name: 'Tetrahedral (CH₄)', angle: '109.5°', hybrid: 'sp³' };
      if (lonePairs === 1) return { name: 'Trigonal Pyramidal (NH₃)', angle: '107°', hybrid: 'sp³' };
      return { name: 'Bent / Angular (H₂O)', angle: '104.5°', hybrid: 'sp³' };
    }
    if (totalSteric === 5) {
      if (lonePairs === 0) return { name: 'Trigonal Bipyramidal (PCl₅)', angle: '90° & 120°', hybrid: 'sp³d' };
      if (lonePairs === 1) return { name: 'Seesaw (SF₄)', angle: '< 90° & < 120°', hybrid: 'sp³d' };
      if (lonePairs === 2) return { name: 'T-shaped (ClF₃)', angle: '87.5°', hybrid: 'sp³d' };
      return { name: 'Linear (XeF₂)', angle: '180°', hybrid: 'sp³d' };
    }
    // Steric 6
    if (lonePairs === 0) return { name: 'Octahedral (SF₆)', angle: '90°', hybrid: 'sp³d²' };
    if (lonePairs === 1) return { name: 'Square Pyramidal (BrF₅)', angle: '< 90°', hybrid: 'sp³d²' };
    return { name: 'Square Planar (XeF₄)', angle: '90°', hybrid: 'sp³d²' };
  };

  const currentVsepr = getVseprGeometryName();

  // ----------------------------------------------------------------------
  // MODE 4: CHEMICAL EQUILIBRIUM & LE CHATELIER (Manipulative)
  // ----------------------------------------------------------------------
  const [tempK, setTempK] = useState<number>(variables.temperature ?? 500);
  const [pressureAtm, setPressureAtm] = useState<number>(variables.pressure ?? 150);
  const [hasCatalyst, setHasCatalyst] = useState<boolean>(true);
  const [h2ExcessRatio, setH2ExcessRatio] = useState<number>(3.0); // 1.0 to 5.0

  // Haber-Bosch exothermic reaction: N2 + 3H2 <=> 2NH3 + 92.4 kJ/mol
  const tempRatio = Math.exp(-(tempK - 450) / 120);
  const pressureRatio = Math.pow(pressureAtm / 50, 0.45);
  const ratioFactor = h2ExcessRatio >= 2.5 && h2ExcessRatio <= 3.5 ? 1.15 : 0.85;
  const nh3YieldPercent = Math.min(
    95,
    Math.max(3, Math.round(48 * tempRatio * pressureRatio * ratioFactor))
  );

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
            <Atom className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              <h3 className="font-bold text-white text-base tracking-wide">
                Class 11 NCERT Chemistry Interactive Live Laboratory
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Live atomic orbitals, quantum numbers, periodic trends, VSEPR steric geometries &amp; Le Chatelier chemical equilibrium
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-violet-500/20 text-violet-300 hover:bg-violet-500/30 transition border border-violet-500/30"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Resume'}</span>
          </button>
          <button
            onClick={() => setAnimTime(0)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Reset Time"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 ml-2">
            <span>Speed:</span>
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  simSpeed === s ? 'bg-violet-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'atomic-orbitals', label: '1. Orbitals & Quantum Numbers' },
          { id: 'periodic-trends', label: '2. Periodic Table Trends' },
          { id: 'vsepr-geometry', label: '3. VSEPR Molecular Geometry' },
          { id: 'equilibrium-le-chatelier', label: '4. Le Chatelier Equilibrium' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveMode(tab.id as Chem11Mode)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition text-xs ${
              activeMode === tab.id
                ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold shadow-md shadow-violet-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============================================================== */}
      {/* 1. ATOMIC ORBITALS & QUANTUM NUMBERS */}
      {/* ============================================================== */}
      {activeMode === 'atomic-orbitals' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-violet-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping"></span>
                <span>QUANTUM WAVEFUNCTION ψ: {orbitalName.toUpperCase()}</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                <defs>
                  <radialGradient id="sOrbitalGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="40%" stopColor="#818cf8" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#312e81" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="lobePositive" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0369a1" />
                  </linearGradient>
                  <linearGradient id="lobeNegative" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#9f1239" />
                  </linearGradient>
                </defs>

                {/* Coordinate Axes */}
                <line x1="70" y1="115" x2="350" y2="115" stroke="#334155" strokeWidth="1.5" />
                <text x="350" y="112" fill="#64748b" fontSize="8" fontFamily="monospace">x</text>
                <line x1="210" y1="35" x2="210" y2="195" stroke="#334155" strokeWidth="1.5" />
                <text x="215" y="42" fill="#64748b" fontSize="8" fontFamily="monospace">z</text>

                {/* Render Shape based on l */}
                {quantumL === 0 && (
                  // s-orbital (Spherical)
                  <g>
                    <circle cx="210" cy="115" r={25 + quantumN * 14} fill="url(#sOrbitalGrad)" />
                    {/* Radial node ring if n >= 2 */}
                    {quantumN >= 2 && (
                      <circle cx="210" cy="115" r={22} fill="none" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
                    )}
                  </g>
                )}

                {quantumL === 1 && (
                  // p-orbital (Dumbbell with 1 nodal plane)
                  <g transform={`translate(210, 115) rotate(${orbitalRotAngle + (quantumMl === 0 ? 90 : 0)})`}>
                    {/* Positive lobe */}
                    <ellipse cx="42" cy="0" rx="36" ry="22" fill="url(#lobePositive)" />
                    <text x="42" y="4" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">+</text>

                    {/* Negative lobe */}
                    <ellipse cx="-42" cy="0" rx="36" ry="22" fill="url(#lobeNegative)" />
                    <text x="-42" y="4" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">-</text>

                    {/* Nodal Plane */}
                    <line x1="0" y1="-60" x2="0" y2="60" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
                  </g>
                )}

                {quantumL >= 2 && (
                  // d-orbital (Cloverleaf 4 lobes or doughnut dz2)
                  <g transform={`translate(210, 115) rotate(${orbitalRotAngle})`}>
                    {quantumMl === 0 ? (
                      // dz2 shape (two lobes + torus ring)
                      <g>
                        <ellipse cx="0" cy="-45" rx="20" ry="32" fill="url(#lobePositive)" />
                        <ellipse cx="0" cy="45" rx="20" ry="32" fill="url(#lobePositive)" />
                        <ellipse cx="0" cy="0" rx="40" ry="14" fill="none" stroke="#f43f5e" strokeWidth="5" />
                      </g>
                    ) : (
                      // dxy / dx2-y2 4 lobes
                      <g>
                        <ellipse cx="38" cy="38" rx="26" ry="18" fill="url(#lobePositive)" />
                        <ellipse cx="-38" cy="-38" rx="26" ry="18" fill="url(#lobePositive)" />
                        <ellipse cx="-38" cy="38" rx="26" ry="18" fill="url(#lobeNegative)" />
                        <ellipse cx="38" cy="-38" rx="26" ry="18" fill="url(#lobeNegative)" />
                      </g>
                    )}
                  </g>
                )}

                {/* Nucleus dot */}
                <circle cx="210" cy="115" r="3.5" fill="#ffffff" />

                <text x="210" y="215" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {orbitalName} | Radial Nodes = {quantumN - quantumL - 1}, Angular Nodes = {quantumL}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-violet-400 font-bold">n={quantumN}, l={quantumL}, m_l={quantumMl}</span>
                <span className="text-cyan-400 font-bold">Total Nodes: {quantumN - 1}</span>
                <span className="text-emerald-400 font-bold">Max Subshell Capacity: {maxElectronsInSubshell}e⁻</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-violet-400 font-mono text-sm uppercase">Quantum Numbers</h4>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Principal Quantum No. (n):</span>
                  <span className="text-violet-400 font-bold">n = {quantumN}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={quantumN}
                  onChange={(e) => setQuantumN(Number(e.target.value))}
                  className="w-full accent-violet-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Azimuthal Quantum No. (l):</span>
                  <span className="text-cyan-400 font-bold">l = {quantumL} ({subshellLetter})</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={quantumN - 1}
                  value={quantumL}
                  onChange={(e) => setQuantumL(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Magnetic Quantum No. (m_l):</span>
                  <span className="text-emerald-400 font-bold">m_l = {quantumMl}</span>
                </div>
                <input
                  type="range"
                  min={-quantumL}
                  max={quantumL}
                  value={quantumMl}
                  onChange={(e) => setQuantumMl(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">3D Rotate Orbital Lobes:</span>
                  <span className="text-amber-400 font-bold">{orbitalRotAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={orbitalRotAngle}
                  onChange={(e) => setOrbitalRotAngle(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. PERIODIC TABLE TRENDS */}
      {/* ============================================================== */}
      {activeMode === 'periodic-trends' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>{selectedSet.toUpperCase()}: {trendProp.toUpperCase()} (SHIELDING {shieldingFactor}%)</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                <line x1="30" y1="185" x2="390" y2="185" stroke="#334155" strokeWidth="1.5" />

                {/* Bars for elements */}
                {activeTrendData.map((elem, idx) => {
                  const stepW = 340 / activeTrendData.length;
                  const x = 50 + idx * stepW;
                  let val = 0;
                  let maxVal = 1;
                  let color = '#38bdf8';

                  if (trendProp === 'radius') {
                    val = elem.r;
                    maxVal = 270;
                    color = '#38bdf8';
                  } else if (trendProp === 'ie') {
                    val = elem.ie;
                    maxVal = 2200;
                    color = '#f59e0b';
                  } else {
                    val = elem.en;
                    maxVal = 4.0;
                    color = '#ec4899';
                  }

                  const barH = (val / maxVal) * 125;
                  const y = 185 - barH;

                  return (
                    <g key={elem.sym}>
                      <rect x={x - 12} y={y} width="24" height={barH} rx="4" fill={color} fillOpacity="0.85" />
                      <text x={x} y={y - 5} fill={color} fontSize="8" fontWeight="bold" textAnchor="middle">
                        {val}
                      </text>
                      <text x={x} y="200" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">
                        {elem.sym}
                      </text>
                      <text x={x} y="210" fill="#64748b" fontSize="7" textAnchor="middle">
                        Z={elem.z}
                      </text>
                    </g>
                  );
                })}

                <text x="210" y="25" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                  {trendProp === 'radius' && 'Atomic Radius: Decreases across period (Z_eff increases), increases down group'}
                  {trendProp === 'ie' && 'First Ionization Enthalpy: Increases across period, drops down group'}
                  {trendProp === 'en' && 'Electronegativity: Increases toward top-right Fluorine (4.0)'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Trend: {trendProp.toUpperCase()}</span>
                <span className="text-amber-400 font-bold">Set: {selectedSet}</span>
                <span className="text-emerald-400 font-bold">Slater Screening: {shieldingFactor}%</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Trend Manipulations</h4>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Element Group / Period:</span>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-bold">
                  {(['period2', 'period3', 'group1'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSet(s)}
                      className={`p-2 rounded-xl transition border text-center ${
                        selectedSet === s
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {s === 'period2' ? 'Period 2' : s === 'period3' ? 'Period 3' : 'Group 1'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 mb-1.5 block">Property to Inspect:</span>
                <div className="space-y-1.5">
                  {[
                    { id: 'radius', name: 'Atomic Radius (pm)' },
                    { id: 'ie', name: '1st Ionization Enthalpy (kJ/mol)' },
                    { id: 'en', name: 'Electronegativity (Pauling)' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTrendProp(t.id as any)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                        trendProp === t.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Inner Core Shielding (σ):</span>
                  <span className="text-emerald-400 font-bold">{shieldingFactor}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={shieldingFactor}
                  onChange={(e) => setShieldingFactor(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. VSEPR THEORY & MOLECULAR GEOMETRY */}
      {/* ============================================================== */}
      {activeMode === 'vsepr-geometry' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-indigo-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                <span>VSEPR: {currentVsepr.name} ({currentVsepr.hybrid}, {currentVsepr.angle})</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                <g transform={`translate(210, 115) rotate(${vseprRotation})`}>
                  {/* Central Atom */}
                  <circle cx="0" cy="0" r="18" fill="#6366f1" stroke="#ffffff" strokeWidth="2" />
                  <text x="0" y="5" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">A</text>

                  {/* Bond Pairs (BP) arms radiating */}
                  {Array.from({ length: bondPairs }).map((_, i) => {
                    const totalArms = bondPairs + lonePairs;
                    const rad = (i * 2 * Math.PI) / totalArms;
                    const bx = Math.cos(rad) * 65;
                    const by = Math.sin(rad) * 65;
                    return (
                      <g key={`bp-${i}`}>
                        <line x1="0" y1="0" x2={bx} y2={by} stroke="#94a3b8" strokeWidth="3" />
                        <circle cx={bx} cy={by} r="11" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                        <text x={bx} y={by + 3.5} fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">X</text>
                      </g>
                    );
                  })}

                  {/* Lone Pairs (LP) electron clouds */}
                  {Array.from({ length: lonePairs }).map((_, i) => {
                    const totalArms = bondPairs + lonePairs;
                    const rad = ((bondPairs + i) * 2 * Math.PI) / totalArms;
                    const lx = Math.cos(rad) * 45;
                    const ly = Math.sin(rad) * 45;
                    return (
                      <g key={`lp-${i}`}>
                        <ellipse cx={lx} cy={ly} rx="16" ry="10" fill="#facc15" fillOpacity="0.4" stroke="#facc15" strokeDasharray="2 2" transform={`rotate(${(rad * 180) / Math.PI}, ${lx}, ${ly})`} />
                        <circle cx={lx - 4} cy={ly} r="2.5" fill="#facc15" />
                        <circle cx={lx + 4} cy={ly} r="2.5" fill="#facc15" />
                      </g>
                    );
                  })}
                </g>

                <text x="210" y="215" textAnchor="middle" fill="#c7d2fe" fontSize="11" fontWeight="bold" fontFamily="monospace">
                  Steric = {totalSteric} ({bondPairs} BP + {lonePairs} LP) ➔ {currentVsepr.name} [{currentVsepr.angle}]
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-indigo-400 font-bold">Geometry: {currentVsepr.name}</span>
                <span className="text-cyan-400 font-bold">Hybrid: {currentVsepr.hybrid}</span>
                <span className="text-emerald-400 font-bold">Ideal Angle: {currentVsepr.angle}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-indigo-400 font-mono text-sm uppercase">VSEPR Manipulations</h4>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Bond Pairs (BP):</span>
                  <span className="text-indigo-400 font-bold">{bondPairs}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="6"
                  value={bondPairs}
                  onChange={(e) => setBondPairs(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Lone Pairs (LP):</span>
                  <span className="text-amber-400 font-bold">{lonePairs}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  value={lonePairs}
                  onChange={(e) => setLonePairs(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">3D Rotation Angle:</span>
                  <span className="text-cyan-400 font-bold">{vseprRotation}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={vseprRotation}
                  onChange={(e) => setVseprRotation(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. CHEMICAL EQUILIBRIUM & LE CHATELIER'S PRINCIPLE */}
      {/* ============================================================== */}
      {activeMode === 'equilibrium-le-chatelier' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>NH₃ YIELD: {nh3YieldPercent}% | P = {pressureAtm} atm | T = {tempK} K</span>
              </div>

              <svg viewBox="0 0 420 230" className="w-full h-64 select-none">
                {/* Reactor Vessel */}
                <rect x="60" y="40" width="280" height="130" rx="16" fill="#1e293b" stroke="#475569" strokeWidth="2.5" />

                {/* Catalyst Bed Grid if active */}
                {hasCatalyst && (
                  <rect x="180" y="40" width="40" height="130" fill="#f59e0b15" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
                )}

                {/* Bouncing Gas Molecules inside chamber */}
                {Array.from({ length: 20 }).map((_, i) => {
                  const isNH3 = i < Math.round((nh3YieldPercent / 100) * 20);
                  const isN2 = !isNH3 && i % 2 === 0;
                  const speedMultiplier = (tempK / 500) * 35;
                  const bx = 75 + ((i * 35 + animTime * speedMultiplier) % 250);
                  const by = 55 + ((i * 22 + Math.sin(animTime * 3 + i) * 30) % 100);

                  return (
                    <g key={i}>
                      <circle
                        cx={bx}
                        cy={by}
                        r={isNH3 ? 7 : isN2 ? 6 : 4}
                        fill={isNH3 ? '#10b981' : isN2 ? '#38bdf8' : '#e2e8f0'}
                      />
                      <text x={bx} y={by + 2.5} fill="#0f172a" fontSize="5" fontWeight="bold" textAnchor="middle">
                        {isNH3 ? 'NH₃' : isN2 ? 'N₂' : 'H₂'}
                      </text>
                    </g>
                  );
                })}

                {/* Reaction Equation */}
                <text x="200" y="30" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + 92.4 kJ (ΔH &lt; 0)
                </text>

                {/* Live Ammonia Yield Bar */}
                <g transform="translate(60, 185)">
                  <rect x="0" y="0" width="280" height="14" rx="7" fill="#0f172a" stroke="#334155" />
                  <rect x="0" y="0" width={(nh3YieldPercent / 100) * 280} height="14" rx="7" fill="#10b981" />
                  <text x="140" y="10.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                    Equilibrium NH₃ Yield: {nh3YieldPercent}%
                  </text>
                </g>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Yield: {nh3YieldPercent}%</span>
                <span className="text-cyan-400 font-bold">Pressure: {pressureAtm} atm</span>
                <span className="text-amber-400 font-bold">Catalyst: {hasCatalyst ? 'Fe + Mo (Active)' : 'None'}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Le Chatelier Manipulations</h4>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Temperature (T):</span>
                  <span className="text-emerald-400 font-bold">{tempK} K</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="800"
                  value={tempK}
                  onChange={(e) => setTempK(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">Pressure (P):</span>
                  <span className="text-cyan-400 font-bold">{pressureAtm} atm</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="400"
                  value={pressureAtm}
                  onChange={(e) => setPressureAtm(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 font-mono">
                  <span className="text-slate-300">H₂:N₂ Feed Ratio:</span>
                  <span className="text-amber-400 font-bold">{h2ExcessRatio.toFixed(1)} : 1</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.5"
                  value={h2ExcessRatio}
                  onChange={(e) => setH2ExcessRatio(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <button
                onClick={() => setHasCatalyst(!hasCatalyst)}
                className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition border ${
                  hasCatalyst
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {hasCatalyst ? '✓ Finely Divided Iron Catalyst Active' : '+ Add Iron / Molybdenum Catalyst'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
