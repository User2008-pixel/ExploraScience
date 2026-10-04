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
  // MODE 1: ATOMIC ORBITALS & QUANTUM NUMBERS
  // ----------------------------------------------------------------------
  const [selectedOrbital, setSelectedOrbital] = useState<'1s' | '2s' | '2px' | '2pz' | '3dz2' | '3dxy'>('2px');
  const [selectedZ, setSelectedZ] = useState<number>(6); // Carbon by default

  // ----------------------------------------------------------------------
  // MODE 2: PERIODIC TRENDS
  // ----------------------------------------------------------------------
  const [trendProp, setTrendProp] = useState<'radius' | 'ie' | 'en'>('radius');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(2);

  // Period 2 data: Li, Be, B, C, N, O, F, Ne
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

  // ----------------------------------------------------------------------
  // MODE 3: VSEPR GEOMETRY & HYBRIDISATION
  // ----------------------------------------------------------------------
  const [selectedMol, setSelectedMol] = useState<'CH4' | 'NH3' | 'H2O' | 'BF3' | 'PCl5' | 'SF6'>('CH4');

  // ----------------------------------------------------------------------
  // MODE 4: CHEMICAL EQUILIBRIUM & LE CHATELIER
  // ----------------------------------------------------------------------
  const [tempK, setTempK] = useState<number>(variables.temperature ?? 500);
  const [pressureAtm, setPressureAtm] = useState<number>(variables.pressure ?? 200);
  const [n2Conc, setN2Conc] = useState<number>(1.0);

  // Exothermic: N2 + 3H2 <=> 2NH3 + 92 kJ
  // High pressure favors fewer moles (ammonia yield up)
  // Low temp favors exothermic (equilibrium shifts right, but rate drops)
  const nh3YieldPercent = Math.min(
    95,
    Math.max(5, Math.round((pressureAtm / 250) * 45 + ((700 - tempK) / 300) * 40 * n2Conc))
  );

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
            <Atom className="w-5 h-5 animate-spin" style={{ animationDuration: '15s' }} />
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
              Live 3D orbital probability density, periodic atomic shielding, VSEPR geometries & dynamic Le Chatelier equilibrium
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
          { id: 'atomic-orbitals', label: '1. Orbitals & Aufbau' },
          { id: 'periodic-trends', label: '2. Periodic Trends' },
          { id: 'vsepr-geometry', label: '3. VSEPR & Hybridisation' },
          { id: 'equilibrium-le-chatelier', label: '4. Dynamic Equilibrium' },
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
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-violet-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping"></span>
                <span>LIVE ELECTRON PROBABILITY CLOUD (|Ψ|²)</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                <defs>
                  <radialGradient id="orbitalGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#4f46e5" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#312e81" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="lobePositive" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
                  </radialGradient>
                  <radialGradient id="lobeNegative" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#be123c" stopOpacity="0.2" />
                  </radialGradient>
                </defs>

                {/* Axes */}
                <line x1="200" y1="20" x2="200" y2="200" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="90" y1="110" x2="310" y2="110" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
                <text x="315" y="113" fill="#64748b" fontSize="9">x</text>
                <text x="200" y="15" fill="#64748b" fontSize="9" textAnchor="middle">z</text>

                {/* Orbital Geometry */}
                {selectedOrbital === '1s' && (
                  <circle cx="200" cy="110" r={40 + Math.sin(animTime * 2) * 2} fill="url(#orbitalGlow)" />
                )}

                {selectedOrbital === '2s' && (
                  <g>
                    {/* Inner core node */}
                    <circle cx="200" cy="110" r="22" fill="url(#orbitalGlow)" fillOpacity="0.5" />
                    {/* Radial Node */}
                    <circle cx="200" cy="110" r="32" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3 3" />
                    {/* Outer lobe */}
                    <circle cx="200" cy="110" r={62 + Math.sin(animTime * 2) * 2} fill="url(#orbitalGlow)" fillOpacity="0.4" />
                  </g>
                )}

                {selectedOrbital === '2px' && (
                  <g>
                    {/* Left lobe (-) */}
                    <ellipse cx={155 - Math.sin(animTime * 2)} cy="110" rx="42" ry="24" fill="url(#lobeNegative)" />
                    <text x="155" y="114" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">-</text>

                    {/* Right lobe (+) */}
                    <ellipse cx={245 + Math.sin(animTime * 2)} cy="110" rx="42" ry="24" fill="url(#lobePositive)" />
                    <text x="245" y="114" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">+</text>

                    {/* Nodal Plane at y-z (x=0) */}
                    <line x1="200" y1="60" x2="200" y2="160" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
                    <text x="200" y="175" fill="#facc15" fontSize="8" textAnchor="middle">Nodal Plane (x=0)</text>
                  </g>
                )}

                {selectedOrbital === '2pz' && (
                  <g>
                    {/* Top lobe (+) */}
                    <ellipse cx="200" cy={65 - Math.sin(animTime * 2)} rx="24" ry="42" fill="url(#lobePositive)" />
                    <text x="200" y="69" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">+</text>

                    {/* Bottom lobe (-) */}
                    <ellipse cx="200" cy={155 + Math.sin(animTime * 2)} rx="24" ry="42" fill="url(#lobeNegative)" />
                    <text x="200" y="159" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">-</text>

                    {/* Nodal Plane at x-y (z=0) */}
                    <line x1="150" y1="110" x2="250" y2="110" stroke="#facc15" strokeWidth="1.5" strokeDasharray="3 3" />
                  </g>
                )}

                {/* Nucleus dot */}
                <circle cx="200" cy="110" r="3" fill="#ffffff" />

                {/* Title overlay */}
                <text x="200" y="205" textAnchor="middle" fill="#c7d2fe" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  {selectedOrbital === '1s' && '1s Orbital: n=1, l=0, ml=0 (Spherical)'}
                  {selectedOrbital === '2s' && '2s Orbital: n=2, l=0, ml=0 (1 Radial Node)'}
                  {selectedOrbital === '2px' && '2px Orbital: n=2, l=1, ml=±1 (Dumbbell along x-axis)'}
                  {selectedOrbital === '2pz' && '2pz Orbital: n=2, l=1, ml=0 (Dumbbell along z-axis)'}
                  {selectedOrbital === '3dz2' && '3dz² Orbital: n=3, l=2, ml=0 (Doughnut ring + lobes)'}
                  {selectedOrbital === '3dxy' && '3dxy Orbital: n=3, l=2, ml=±2 (Cloverleaf between axes)'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-violet-400 font-bold">Orbital: {selectedOrbital}</span>
                <span className="text-cyan-400 font-bold">Total Nodes: {selectedOrbital.startsWith('1') ? 0 : selectedOrbital.startsWith('2') ? 1 : 2}</span>
                <span className="text-emerald-400 font-bold">Max Capacity: {selectedOrbital.includes('d') ? '10e⁻' : selectedOrbital.includes('p') ? '6e⁻' : '2e⁻'}</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-violet-400 font-mono text-sm uppercase">Select Orbital</h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['1s', '2s', '2px', '2pz', '3dz2', '3dxy'] as const).map((orb) => (
                  <button
                    key={orb}
                    onClick={() => setSelectedOrbital(orb)}
                    className={`p-2 rounded-xl font-bold uppercase transition border ${
                      selectedOrbital === orb
                        ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {orb}
                  </button>
                ))}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-violet-400">Quantum Numbers:</div>
                <div className="space-y-1 text-slate-400">
                  <p><strong>n (Principal):</strong> Main shell energy level (1, 2, 3...)</p>
                  <p><strong>l (Azimuthal):</strong> Angular momentum / shape (0=s, 1=p, 2=d, 3=f)</p>
                  <p><strong>mₗ (Magnetic):</strong> Spatial orientation (-l to +l)</p>
                  <p><strong>mₛ (Spin):</strong> +1/2 (↑) or -1/2 (↓)</p>
                </div>
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
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>PERIOD 2 ATOMIC TREND GRAPH & ELECTRON SHIELDING</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Horizontal baseline */}
                <line x1="40" y1="180" x2="360" y2="180" stroke="#334155" strokeWidth="1.5" />

                {/* Bars for Period 2 elements */}
                {PERIOD_2.map((elem, idx) => {
                  const x = 55 + idx * 38;
                  let val = 0;
                  let maxVal = 1;
                  let color = '#38bdf8';

                  if (trendProp === 'radius') {
                    val = elem.r;
                    maxVal = 170;
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

                  const barH = (val / maxVal) * 120;
                  const y = 180 - barH;

                  return (
                    <g key={elem.sym}>
                      {/* Bar */}
                      <rect
                        x={x - 12}
                        y={y}
                        width="24"
                        height={barH}
                        rx="4"
                        fill={color}
                        fillOpacity="0.8"
                      />
                      {/* Value label */}
                      <text x={x} y={y - 5} fill={color} fontSize="8" fontWeight="bold" textAnchor="middle">
                        {val}
                      </text>
                      {/* Element Symbol */}
                      <text x={x} y="196" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">
                        {elem.sym}
                      </text>
                      <text x={x} y="206" fill="#64748b" fontSize="7" textAnchor="middle">
                        Z={elem.z}
                      </text>
                    </g>
                  );
                })}

                {/* Trend curve overlay */}
                <text x="200" y="25" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
                  {trendProp === 'radius' && 'Atomic Radius (pm): Decreases across period (Effective nuclear charge Z_eff increases)'}
                  {trendProp === 'ie' && 'First Ionization Enthalpy (kJ/mol): Increases across period with subshell anomalies (N > O)'}
                  {trendProp === 'en' && 'Electronegativity (Pauling scale): Increases across period to Fluorine (4.0)'}
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Trend: {trendProp.toUpperCase()}</span>
                <span className="text-amber-400 font-bold">Peak element: {trendProp === 'radius' ? 'Li (152 pm)' : trendProp === 'ie' ? 'Ne (2080 kJ/mol)' : 'F (4.0)'}</span>
                <span className="text-emerald-400 font-bold">Z_eff effect: Active</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Trend Property</h4>

              <div className="space-y-2">
                {[
                  { id: 'radius', name: 'Atomic Radius (pm)' },
                  { id: 'ie', name: 'First Ionization Enthalpy (kJ/mol)' },
                  { id: 'en', name: 'Electronegativity (Pauling scale)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTrendProp(t.id as any)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      trendProp === t.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 bg-slate-950/50 hover:bg-slate-800'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-cyan-400">NCERT Reasoning:</div>
                <p>
                  As we move left-to-right across a period, electrons enter the <em>same valence shell</em> while nuclear charge ($Z$) increases, pulling electron clouds closer.
                </p>
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
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-indigo-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping"></span>
                <span>3D VSEPR MOLECULAR ROTATION & ELECTRON PAIR REPULSION</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* 3D Rotatable molecule center */}
                <g transform="translate(200, 110)">
                  {/* Central Atom */}
                  <circle cx="0" cy="0" r="16" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="0" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                    {selectedMol === 'CH4' ? 'C' : selectedMol === 'NH3' ? 'N' : selectedMol === 'H2O' ? 'O' : selectedMol === 'BF3' ? 'B' : selectedMol === 'PCl5' ? 'P' : 'S'}
                  </text>

                  {/* Dynamic Bond Arms rotated by animTime */}
                  {selectedMol === 'CH4' && (
                    <g>
                      {/* 4 tetrahedral bonds */}
                      {[0, 109.5, 219, 328.5].map((deg, i) => {
                        const rad = ((deg + animTime * 30) * Math.PI) / 180;
                        const bx = Math.cos(rad) * 65;
                        const by = Math.sin(rad) * 55;
                        return (
                          <g key={i}>
                            <line x1="0" y1="0" x2={bx} y2={by} stroke="#94a3b8" strokeWidth="3" />
                            <circle cx={bx} cy={by} r="10" fill="#e2e8f0" stroke="#334155" strokeWidth="1" />
                            <text x={bx} y={by + 3} fill="#0f172a" fontSize="7" fontWeight="bold" textAnchor="middle">H</text>
                          </g>
                        );
                      })}
                      <text x="0" y="85" fill="#a5b4fc" fontSize="10" fontWeight="bold" textAnchor="middle">
                        Tetrahedral (sp³, 109.5°)
                      </text>
                    </g>
                  )}

                  {selectedMol === 'NH3' && (
                    <g>
                      {/* Lone Pair on Top */}
                      <ellipse cx="0" cy="-35" rx="14" ry="20" fill="#facc15" fillOpacity="0.4" stroke="#facc15" strokeDasharray="2 2" />
                      <circle cx="-4" cy="-35" r="2" fill="#facc15" />
                      <circle cx="4" cy="-35" r="2" fill="#facc15" />

                      {/* 3 Hydrogen bonds pushed down due to lp-bp repulsion */}
                      {[-140, -90, -40].map((deg, i) => {
                        const rad = ((deg) * Math.PI) / 180;
                        const bx = Math.cos(rad) * 60;
                        const by = -Math.sin(rad) * 55;
                        return (
                          <g key={i}>
                            <line x1="0" y1="0" x2={bx} y2={by} stroke="#94a3b8" strokeWidth="3" />
                            <circle cx={bx} cy={by} r="10" fill="#e2e8f0" />
                            <text x={bx} y={by + 3} fill="#0f172a" fontSize="7" fontWeight="bold" textAnchor="middle">H</text>
                          </g>
                        );
                      })}
                      <text x="0" y="85" fill="#a5b4fc" fontSize="10" fontWeight="bold" textAnchor="middle">
                        Trigonal Pyramidal (sp³, 107° due to 1 Lone Pair)
                      </text>
                    </g>
                  )}

                  {selectedMol === 'H2O' && (
                    <g>
                      {/* 2 Lone Pairs on Top */}
                      <ellipse cx="-20" cy="-30" rx="12" ry="16" fill="#facc15" fillOpacity="0.4" stroke="#facc15" strokeDasharray="2 2" />
                      <ellipse cx="20" cy="-30" rx="12" ry="16" fill="#facc15" fillOpacity="0.4" stroke="#facc15" strokeDasharray="2 2" />

                      {/* 2 H bonds bent to 104.5 */}
                      <line x1="0" y1="0" x2="-45" y2="45" stroke="#94a3b8" strokeWidth="3" />
                      <circle cx="-45" cy="45" r="10" fill="#e2e8f0" />
                      <text x="-45" y="48" fill="#0f172a" fontSize="7" fontWeight="bold" textAnchor="middle">H</text>

                      <line x1="0" y1="0" x2="45" y2="45" stroke="#94a3b8" strokeWidth="3" />
                      <circle cx="45" cy="45" r="10" fill="#e2e8f0" />
                      <text x="45" y="48" fill="#0f172a" fontSize="7" fontWeight="bold" textAnchor="middle">H</text>

                      <text x="0" y="85" fill="#a5b4fc" fontSize="10" fontWeight="bold" textAnchor="middle">
                        Bent / V-Shaped (sp³, 104.5° due to 2 Lone Pairs)
                      </text>
                    </g>
                  )}

                  {selectedMol === 'SF6' && (
                    <g>
                      {/* 6 octahedral ligands */}
                      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                        const rad = ((deg + animTime * 20) * Math.PI) / 180;
                        const bx = Math.cos(rad) * 65;
                        const by = Math.sin(rad) * 65;
                        return (
                          <g key={i}>
                            <line x1="0" y1="0" x2={bx} y2={by} stroke="#94a3b8" strokeWidth="2.5" />
                            <circle cx={bx} cy={by} r="9" fill="#a7f3d0" />
                            <text x={bx} y={by + 3} fill="#065f46" fontSize="7" fontWeight="bold" textAnchor="middle">F</text>
                          </g>
                        );
                      })}
                      <text x="0" y="85" fill="#a5b4fc" fontSize="10" fontWeight="bold" textAnchor="middle">
                        Octahedral (sp³d², 90°)
                      </text>
                    </g>
                  )}
                </g>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-indigo-400 font-bold">Molecule: {selectedMol}</span>
                <span className="text-cyan-400 font-bold">Repulsion Order: LP-LP &gt; LP-BP &gt; BP-BP</span>
                <span className="text-emerald-400 font-bold">VSEPR: Minimized Repulsion</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-indigo-400 font-mono text-sm uppercase">Molecule Geometry</h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {(['CH4', 'NH3', 'H2O', 'SF6'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMol(m as any)}
                    className={`p-2 rounded-xl font-bold transition border ${
                      selectedMol === m
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-indigo-400">VSEPR Postulates:</div>
                <p>
                  Shape of molecule depends on the number of valence shell electron pairs (bonded and non-bonded) around the central atom, which orient in space to maximize distance and minimize electrostatic repulsion.
                </p>
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
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>DYNAMIC HABER EQUILIBRIUM CHAMBER (N₂ + 3H₂ ⇌ 2NH₃)</span>
              </div>

              <svg viewBox="0 0 400 220" className="w-full h-64 select-none">
                {/* Reactor Vessel */}
                <rect x="70" y="40" width="260" height="130" rx="16" fill="#1e293b" stroke="#475569" strokeWidth="2.5" />

                {/* Bouncing Gas Molecules inside chamber */}
                {Array.from({ length: 18 }).map((_, i) => {
                  const isNH3 = i < Math.round((nh3YieldPercent / 100) * 18);
                  const isN2 = !isNH3 && i % 2 === 0;
                  const speedMultiplier = (tempK / 500) * 30;
                  const bx = 85 + ((i * 37 + animTime * speedMultiplier) % 230);
                  const by = 55 + ((i * 23 + Math.sin(animTime * 2 + i) * 30) % 100);

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
                <g transform="translate(70, 185)">
                  <rect x="0" y="0" width="260" height="12" rx="6" fill="#0f172a" stroke="#334155" />
                  <rect x="0" y="0" width={(nh3YieldPercent / 100) * 260} height="12" rx="6" fill="#10b981" />
                  <text x="130" y="9" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
                    Equilibrium NH₃ Yield: {nh3YieldPercent}%
                  </text>
                </g>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-emerald-400 font-bold">Yield: {nh3YieldPercent}%</span>
                <span className="text-cyan-400 font-bold">Temp: {tempK} K</span>
                <span className="text-amber-400 font-bold">Pressure: {pressureAtm} atm</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Le Chatelier Controls</h4>

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

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-2">
                <div className="font-bold text-emerald-400">Le Chatelier's Principle:</div>
                <p>
                  Increasing pressure favors fewer moles of gas (4 moles LHS ➔ 2 moles RHS). Lowering temperature favors exothermic forward direction.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
