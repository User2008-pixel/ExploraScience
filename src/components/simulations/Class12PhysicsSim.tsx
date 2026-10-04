import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sliders,
  Atom,
  Radio,
  Layers,
  CircleDot,
  Cpu,
  Waves,
} from 'lucide-react';

interface Class12PhysicsSimProps {
  simulationType?: string;
  conceptId?: string;
  variables?: Record<string, number>;
}

type Physics12Mode =
  | 'coulomb-electrostatics'
  | 'capacitor-dielectric'
  | 'drift-velocity-kirchhoff'
  | 'cyclotron-lorentz'
  | 'electromagnetic-induction'
  | 'lcr-ac-resonance'
  | 'wave-optics-ydse'
  | 'photoelectric-effect'
  | 'semiconductor-pn-junction';

export const Class12PhysicsSim: React.FC<Class12PhysicsSimProps> = ({
  simulationType = 'class12-physics',
  conceptId = '',
  variables = {},
}) => {
  const getInitialMode = (): Physics12Mode => {
    if (conceptId.includes('coulomb') || conceptId.includes('dipole') || conceptId.includes('gauss')) {
      return 'coulomb-electrostatics';
    }
    if (conceptId.includes('capacitor') || conceptId.includes('dielectric') || conceptId.includes('potential')) {
      return 'capacitor-dielectric';
    }
    if (conceptId.includes('drift') || conceptId.includes('kirchhoff') || conceptId.includes('current-electricity')) {
      return 'drift-velocity-kirchhoff';
    }
    if (conceptId.includes('cyclotron') || conceptId.includes('lorentz') || conceptId.includes('biot') || conceptId.includes('moving-charges')) {
      return 'cyclotron-lorentz';
    }
    if (conceptId.includes('induction') || conceptId.includes('lenz') || conceptId.includes('faraday') || conceptId.includes('magnetism-earth')) {
      return 'electromagnetic-induction';
    }
    if (conceptId.includes('lcr') || conceptId.includes('resonance') || conceptId.includes('phasor') || conceptId.includes('ac')) {
      return 'lcr-ac-resonance';
    }
    if (conceptId.includes('young') || conceptId.includes('double-slit') || conceptId.includes('interference') || conceptId.includes('wave-optics')) {
      return 'wave-optics-ydse';
    }
    if (conceptId.includes('photoelectric') || conceptId.includes('einstein') || conceptId.includes('work-function') || conceptId.includes('atoms') || conceptId.includes('bohr')) {
      return 'photoelectric-effect';
    }
    if (conceptId.includes('pn-junction') || conceptId.includes('diode') || conceptId.includes('rectifier') || conceptId.includes('semiconductor') || conceptId.includes('nuclei')) {
      return 'semiconductor-pn-junction';
    }
    return 'coulomb-electrostatics';
  };

  const [activeMode, setActiveMode] = useState<Physics12Mode>(getInitialMode());
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
  // MODE 1: COULOMB'S LAW & ELECTROSTATICS
  // ----------------------------------------------------------------------
  const [chargeQ1, setChargeQ1] = useState<number>(variables.chargeQ1MicroC ?? 6);
  const [chargeQ2, setChargeQ2] = useState<number>(variables.chargeQ2MicroC ?? -6);
  const [chargeSeparationR, setChargeSeparationR] = useState<number>(variables.distanceR ?? 12);

  // F = k * |q1 * q2| / r^2
  const kCoulomb = 8.98755; // in 10^9 N m^2 / C^2
  const q1C = chargeQ1 * 1e-6;
  const q2C = chargeQ2 * 1e-6;
  const rM = chargeSeparationR * 0.01;
  const coulombForceNewtons = Math.round(((kCoulomb * 1e9 * Math.abs(q1C * q2C)) / (rM * rM)) * 100) / 100;
  const isAttractive = (chargeQ1 * chargeQ2) < 0;

  // ----------------------------------------------------------------------
  // MODE 2: CAPACITANCE & DIELECTRIC POLARIZATION
  // ----------------------------------------------------------------------
  const [plateArea, setPlateArea] = useState<number>(variables.plateAreaCm2 ?? 200);
  const [plateDistance, setPlateDistance] = useState<number>(variables.plateSeparationMm ?? 2);
  const [dielectricK, setDielectricK] = useState<number>(variables.dielectricConstantK ?? 5);
  const [isDielectricInserted, setIsDielectricInserted] = useState<boolean>(true);

  const epsilon0 = 8.854e-12;
  const effectiveK = isDielectricInserted ? dielectricK : 1;
  const capacitancePf = Math.round(((effectiveK * epsilon0 * (plateArea * 1e-4)) / (plateDistance * 1e-3)) * 1e12 * 10) / 10;
  const capacitorVoltage = 12;
  const storedEnergyU = Math.round(0.5 * (capacitancePf * 1e-12) * Math.pow(capacitorVoltage, 2) * 1e9 * 10) / 10; // nanojoules

  // ----------------------------------------------------------------------
  // MODE 3: DRIFT VELOCITY & MICROSCOPIC CONDUCTION
  // ----------------------------------------------------------------------
  const [conductorElectricField, setConductorElectricField] = useState<number>(variables.appliedElectricFieldE ?? 35);
  const electronMobilityMu = 0.0045; // m^2 / (V s)
  const driftVelocityMmS = Math.round(electronMobilityMu * conductorElectricField * 100) / 100;

  // ----------------------------------------------------------------------
  // MODE 4: CYCLOTRON & LORENTZ MAGNETIC FORCE
  // ----------------------------------------------------------------------
  const [cyclotronBField, setCyclotronBField] = useState<number>(variables.magneticFieldTesla ?? 1.5);
  const [ionVelocityKmS, setIonVelocityKmS] = useState<number>(variables.particleVelocityKmS ?? 1200);

  // r = m v / (q B) for proton (q = 1.6e-19, m = 1.67e-27)
  const protonQ = 1.6e-19;
  const protonM = 1.67e-27;
  const cyclotronRadiusCm = Math.round(((protonM * (ionVelocityKmS * 1e3)) / (protonQ * cyclotronBField)) * 100 * 10) / 10;
  const cyclotronFreqMhz = Math.round(((protonQ * cyclotronBField) / (2 * Math.PI * protonM)) * 1e-6 * 10) / 10;

  // ----------------------------------------------------------------------
  // MODE 5: ELECTROMAGNETIC INDUCTION (FARADAY & LENZ)
  // ----------------------------------------------------------------------
  const [magnetPos, setMagnetPos] = useState<number>(0);
  const [magnetSpeed, setMagnetSpeed] = useState<number>(4);

  // ----------------------------------------------------------------------
  // MODE 6: SERIES LCR AC CIRCUIT & ROTATING PHASOR
  // ----------------------------------------------------------------------
  const [acFreqHz, setAcFreqHz] = useState<number>(variables.acFrequencyHz ?? 50);
  const [lcrResistanceR, setLcrResistanceR] = useState<number>(50); // Ohms
  const [lcrInductanceMh, setLcrInductanceMh] = useState<number>(variables.circuitInductanceMh ?? 160); // mH
  const [lcrCapacitanceUf, setLcrCapacitanceUf] = useState<number>(variables.circuitCapacitanceMicroF ?? 64); // uF

  const omega = 2 * Math.PI * acFreqHz;
  const inductiveReactanceXl = omega * (lcrInductanceMh * 1e-3);
  const capacitiveReactanceXc = 1 / (omega * (lcrCapacitanceUf * 1e-6));
  const lcrImpedanceZ = Math.round(Math.sqrt(Math.pow(lcrResistanceR, 2) + Math.pow(inductiveReactanceXl - capacitiveReactanceXc, 2)) * 10) / 10;
  const resonanceFreqF0 = Math.round((1 / (2 * Math.PI * Math.sqrt((lcrInductanceMh * 1e-3) * (lcrCapacitanceUf * 1e-6)))) * 10) / 10;
  const phaseAngleRad = Math.atan2(inductiveReactanceXl - capacitiveReactanceXc, lcrResistanceR);
  const phaseAngleDeg = Math.round((phaseAngleRad * 180) / Math.PI);

  // ----------------------------------------------------------------------
  // MODE 7: WAVE OPTICS (YOUNG'S DOUBLE SLIT INTERFERENCE)
  // ----------------------------------------------------------------------
  const [ydseWavelengthNm, setYdseWavelengthNm] = useState<number>(variables.wavelengthNm ?? 600);
  const [ydseSlitDistMm, setYdseSlitDistMm] = useState<number>(variables.slitSeparationMm ?? 0.5);
  const [ydseScreenDistM, setYdseScreenDistM] = useState<number>(variables.screenDistanceM ?? 1.5);

  // Fringe width beta = lambda * D / d
  const fringeWidthMm = Math.round(((ydseWavelengthNm * 1e-9 * ydseScreenDistM) / (ydseSlitDistMm * 1e-3)) * 1000 * 100) / 100;

  // ----------------------------------------------------------------------
  // MODE 8: PHOTOELECTRIC EFFECT & EINSTEIN'S EQUATION
  // ----------------------------------------------------------------------
  const [lightFreqThz, setLightFreqThz] = useState<number>(variables.photonFrequencyThz ?? 800);
  const [workFunctionEv, setWorkFunctionEv] = useState<number>(variables.metalWorkFunctionEv ?? 2.14); // Cesium = 2.14 eV
  const [retardingVoltageV, setRetardingVoltageV] = useState<number>(0);

  // Photon Energy E = h * nu in eV (h = 4.1357e-15 eV s)
  const hPlanckEvS = 4.1357e-15;
  const photonEnergyEv = Math.round(hPlanckEvS * (lightFreqThz * 1e12) * 100) / 100;
  const maxKineticEnergyEv = Math.max(0, Math.round((photonEnergyEv - workFunctionEv) * 100) / 100);
  const stoppingPotentialV = maxKineticEnergyEv;
  const isEmissionAllowed = photonEnergyEv >= workFunctionEv && retardingVoltageV < stoppingPotentialV;

  // ----------------------------------------------------------------------
  // MODE 9: SEMICONDUCTOR P-N JUNCTION & FULL-WAVE RECTIFIER
  // ----------------------------------------------------------------------
  const [diodeBiasMode, setDiodeBiasMode] = useState<'forward' | 'reverse' | 'rectifier'>('rectifier');
  const [rectifierFilterOn, setRectifierFilterOn] = useState<boolean>(true);

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Atom className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                NCERT Class 12 Physics • Live Laboratory
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Live particle physics, electromagnetic wave dynamics, rotating phasors & quantum phenomena
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

        {/* Navigation Tabs (Available if not in focused single-concept exploration) */}
        {!isExploringTopic && (
          <div className="w-full flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs mt-2">
            {[
              { id: 'coulomb-electrostatics', label: 'Coulomb & Electrostatics' },
              { id: 'capacitor-dielectric', label: 'Capacitor & Dielectric' },
              { id: 'drift-velocity-kirchhoff', label: 'Drift Velocity' },
              { id: 'cyclotron-lorentz', label: 'Lorentz Force & Cyclotron' },
              { id: 'electromagnetic-induction', label: 'Induction & Lenz' },
              { id: 'lcr-ac-resonance', label: 'LCR AC & Phasors' },
              { id: 'wave-optics-ydse', label: 'Wave Optics YDSE' },
              { id: 'photoelectric-effect', label: 'Photoelectric Quantum' },
              { id: 'semiconductor-pn-junction', label: 'p-n Diode & Rectifier' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id as Physics12Mode)}
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
      {/* 1. COULOMB'S LAW & ELECTROSTATICS (LIVE ELECTRIC FLUX) */}
      {/* ============================================================== */}
      {activeMode === 'coulomb-electrostatics' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Live Visual Canvas */}
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE ELECTROSTATIC VECTOR FIELD & FORCE</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Center line connecting charges */}
                <line x1="80" y1="100" x2={80 + chargeSeparationR * 8} y2="100" stroke="#334155" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Live radiating electric field lines */}
                {[-35, -20, 0, 20, 35].map((yOff, i) => {
                  const arrowT = ((animTime * 0.8 + i * 0.2) % 1);
                  const x1 = 80;
                  const x2 = 80 + chargeSeparationR * 8;
                  const curX = isAttractive ? x1 + (x2 - x1) * arrowT : x1 - 50 * arrowT;
                  return (
                    <g key={i}>
                      <path
                        d={`M 80,100 Q ${(80 + x2) / 2},${100 + yOff * 2} ${x2},100`}
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                        opacity="0.5"
                      />
                      {isAttractive && (
                        <circle cx={curX} cy={100 + Math.sin(arrowT * Math.PI) * (yOff * 1.5)} r="2" fill="#38bdf8" />
                      )}
                    </g>
                  );
                })}

                {/* Point Charge q1 */}
                <circle cx="80" cy="100" r="16" fill={chargeQ1 > 0 ? '#ef4444' : '#3b82f6'} stroke="#ffffff" strokeWidth="2" />
                <text x="80" y="104" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                  {chargeQ1 > 0 ? `+${chargeQ1}` : chargeQ1} μC
                </text>
                <text x="80" y="130" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">Charge q₁</text>

                {/* Point Charge q2 */}
                <circle cx={80 + chargeSeparationR * 8} cy="100" r="16" fill={chargeQ2 > 0 ? '#ef4444' : '#3b82f6'} stroke="#ffffff" strokeWidth="2" />
                <text x={80 + chargeSeparationR * 8} y="104" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                  {chargeQ2 > 0 ? `+${chargeQ2}` : chargeQ2} μC
                </text>
                <text x={80 + chargeSeparationR * 8} y="130" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="monospace">Charge q₂</text>

                {/* Live Coulomb Force Vectors F12 and F21 */}
                {isAttractive ? (
                  <>
                    {/* Vectors point inward toward each other */}
                    <line x1="80" y1="70" x2={80 + Math.min(50, coulombForceNewtons * 5)} y2="70" stroke="#facc15" strokeWidth="3" />
                    <polygon points={`${80 + Math.min(50, coulombForceNewtons * 5)},70 ${80 + Math.min(50, coulombForceNewtons * 5) - 6},66 ${80 + Math.min(50, coulombForceNewtons * 5) - 6},74`} fill="#facc15" />
                    <text x="80" y="62" fill="#facc15" fontSize="8" fontFamily="monospace">F₁₂ (Attraction)</text>

                    <line x1={80 + chargeSeparationR * 8} y1="70" x2={80 + chargeSeparationR * 8 - Math.min(50, coulombForceNewtons * 5)} y2="70" stroke="#facc15" strokeWidth="3" />
                    <polygon points={`${80 + chargeSeparationR * 8 - Math.min(50, coulombForceNewtons * 5)},70 ${80 + chargeSeparationR * 8 - Math.min(50, coulombForceNewtons * 5) + 6},66 ${80 + chargeSeparationR * 8 - Math.min(50, coulombForceNewtons * 5) + 6},74`} fill="#facc15" />
                    <text x={80 + chargeSeparationR * 8 - 40} y="62" fill="#facc15" fontSize="8" fontFamily="monospace">F₂₁ (Attraction)</text>
                  </>
                ) : (
                  <>
                    {/* Vectors point outward (repulsion) */}
                    <line x1="80" y1="70" x2={80 - Math.min(50, coulombForceNewtons * 5)} y2="70" stroke="#f43f5e" strokeWidth="3" />
                    <polygon points={`${80 - Math.min(50, coulombForceNewtons * 5)},70 ${80 - Math.min(50, coulombForceNewtons * 5) + 6},66 ${80 - Math.min(50, coulombForceNewtons * 5) + 6},74`} fill="#f43f5e" />
                    <text x="40" y="62" fill="#f43f5e" fontSize="8" fontFamily="monospace">F₁₂ (Repulsion)</text>

                    <line x1={80 + chargeSeparationR * 8} y1="70" x2={80 + chargeSeparationR * 8 + Math.min(50, coulombForceNewtons * 5)} y2="70" stroke="#f43f5e" strokeWidth="3" />
                    <polygon points={`${80 + chargeSeparationR * 8 + Math.min(50, coulombForceNewtons * 5)},70 ${80 + chargeSeparationR * 8 + Math.min(50, coulombForceNewtons * 5) - 6},66 ${80 + chargeSeparationR * 8 + Math.min(50, coulombForceNewtons * 5) - 6},74`} fill="#f43f5e" />
                    <text x={80 + chargeSeparationR * 8 + 10} y="62" fill="#f43f5e" fontSize="8" fontFamily="monospace">F₂₁ (Repulsion)</text>
                  </>
                )}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Separation r = {chargeSeparationR} cm</span>
                <span className="text-amber-400 font-bold">
                  Coulomb Force F = {coulombForceNewtons} N ({isAttractive ? 'Attractive' : 'Repulsive'})
                </span>
                <span className="text-emerald-400 font-bold">k = 1/(4πε₀) = 8.99 × 10⁹ N·m²/C²</span>
              </div>
            </div>

            {/* Sliders */}
            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Coulomb’s Inverse-Square Law</h4>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1.5 font-mono">
                    <span className="text-slate-300">Charge q₁:</span>
                    <span className={chargeQ1 > 0 ? 'text-rose-400 font-bold' : 'text-blue-400 font-bold'}>
                      {chargeQ1 > 0 ? `+${chargeQ1}` : chargeQ1} μC
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="15"
                    value={chargeQ1}
                    onChange={(e) => setChargeQ1(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5 font-mono">
                    <span className="text-slate-300">Charge q₂:</span>
                    <span className={chargeQ2 > 0 ? 'text-rose-400 font-bold' : 'text-blue-400 font-bold'}>
                      {chargeQ2 > 0 ? `+${chargeQ2}` : chargeQ2} μC
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-15"
                    max="15"
                    value={chargeQ2}
                    onChange={(e) => setChargeQ2(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5 font-mono">
                    <span className="text-slate-300">Separation Distance (r):</span>
                    <span className="text-emerald-400 font-bold">{chargeSeparationR} cm</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={chargeSeparationR}
                    onChange={(e) => setChargeSeparationR(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <span className="text-amber-400 font-bold block font-mono text-[11px] uppercase">
                  Inverse Square Dependence:
                </span>
                <p>
                  Halving distance quadruples the force (F ∝ 1/r²). Like charges repel; opposite charges attract with equal and opposite force pairs obeying Newton’s third law.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. CAPACITANCE & DIELECTRIC POLARIZATION */}
      {/* ============================================================== */}
      {activeMode === 'capacitor-dielectric' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE DIELECTRIC DIPOLE POLARIZATION</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Left Conducting Plate (+Q) */}
                <rect x="70" y="30" width="16" height="140" fill="#ef4444" rx="2" />
                {/* Positive surface charge symbols */}
                {[45, 75, 100, 125, 155].map((y) => (
                  <text key={y} x="78" y={y} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">+</text>
                ))}
                <text x="78" y="185" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace">+Q Plate</text>

                {/* Right Conducting Plate (-Q) */}
                <rect x="250" y="30" width="16" height="140" fill="#3b82f6" rx="2" />
                {/* Negative surface charge symbols */}
                {[45, 75, 100, 125, 155].map((y) => (
                  <text key={y} x="258" y={y} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">-</text>
                ))}
                <text x="258" y="185" textAnchor="middle" fill="#3b82f6" fontSize="9" fontFamily="monospace">-Q Plate</text>

                {/* Dielectric Slab inserted between plates */}
                {isDielectricInserted && (
                  <g>
                    <rect x="96" y="35" width="144" height="130" fill="#a855f720" stroke="#a855f7" strokeWidth="2" rx="4" />
                    <text x="168" y="50" textAnchor="middle" fill="#a855f7" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      Dielectric Medium (κ = {dielectricK})
                    </text>

                    {/* Polarized Molecular Dipoles (+ -) oriented with field */}
                    {[70, 95, 120, 145].map((yDip, idx) => (
                      <g key={yDip} transform={`translate(168, ${yDip})`}>
                        <rect x="-35" y="-9" width="70" height="18" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
                        <text x="-20" y="4" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="bold">-</text>
                        <text x="20" y="4" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">+</text>
                      </g>
                    ))}
                  </g>
                )}

                {/* Electric Field Vectors E */}
                {[55, 80, 105, 130, 155].map((yE, idx) => {
                  const arrowX = 90 + ((animTime * 60 + idx * 30) % 150);
                  return (
                    <g key={yE}>
                      <line x1="90" y1={yE} x2="245" y2={yE} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                      <circle cx={arrowX} cy={yE} r="2" fill="#38bdf8" />
                    </g>
                  );
                })}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Capacitance C = {capacitancePf} pF</span>
                <span className="text-amber-400 font-bold">Stored Energy U = {storedEnergyU} nJ</span>
                <span className="text-purple-400 font-bold">Dielectric Boost: {effectiveK}x</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-purple-400 font-mono text-sm uppercase">C = κ · ε₀ · A / d</h4>

              <div className="space-y-4 text-xs">
                <button
                  onClick={() => setIsDielectricInserted(!isDielectricInserted)}
                  className={`w-full py-2 rounded-xl font-bold transition text-xs ${
                    isDielectricInserted
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {isDielectricInserted ? 'Remove Dielectric Slab (Vacuum Air)' : 'Insert Dielectric Slab (Boost Capacitance)'}
                </button>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Dielectric Constant (κ):</span>
                    <span className="text-purple-400 font-bold">{dielectricK}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={dielectricK}
                    onChange={(e) => setDielectricK(Number(e.target.value))}
                    disabled={!isDielectricInserted}
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Plate Area (A):</span>
                    <span className="text-cyan-400 font-bold">{plateArea} cm²</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="400"
                    value={plateArea}
                    onChange={(e) => setPlateArea(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-purple-400 font-bold block font-mono text-[11px] uppercase">
                  Polarization Mechanism:
                </span>
                <p>
                  Bound charges ±σ_p on the dielectric surfaces create an opposing internal field E_p, reducing net electric field to E₀/κ and multiplying charge-storage capability.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. DRIFT VELOCITY & MICROSCOPIC CONDUCTION */}
      {/* ============================================================== */}
      {activeMode === 'drift-velocity-kirchhoff' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>MICROSCOPIC COPPER LATTICE & DRIFT VELOCITY</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Cylindrical Copper Conductor */}
                <rect x="40" y="40" width="270" height="120" rx="10" fill="#78350f18" stroke="#d97706" strokeWidth="2.5" />
                <text x="175" y="30" textAnchor="middle" fill="#d97706" fontSize="9" fontFamily="monospace">
                  Copper Wire Lattice (Cu²⁺ ions with free conduction electrons)
                </text>

                {/* Positive Copper Lattice Ions */}
                {[
                  { cx: 70, cy: 65 }, { cx: 120, cy: 65 }, { cx: 170, cy: 65 }, { cx: 220, cy: 65 }, { cx: 270, cy: 65 },
                  { cx: 95, cy: 100 }, { cx: 145, cy: 100 }, { cx: 195, cy: 100 }, { cx: 245, cy: 100 },
                  { cx: 70, cy: 135 }, { cx: 120, cy: 135 }, { cx: 170, cy: 135 }, { cx: 220, cy: 135 }, { cx: 270, cy: 135 },
                ].map((ion, i) => (
                  <g key={i}>
                    <circle cx={ion.cx} cy={ion.cy} r="10" fill="#b45309" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x={ion.cx} y={ion.cy + 3} textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">Cu²⁺</text>
                  </g>
                ))}

                {/* Free conduction electrons drifting left against Electric Field (E pointing right) */}
                {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((phase, idx) => {
                  const driftDist = (animTime * driftVelocityMmS * 20 + phase * 260) % 260;
                  const ex = 300 - driftDist;
                  const jitterY = Math.sin(animTime * 25 + idx) * 8;
                  const ey = 60 + (idx % 3) * 35 + jitterY;

                  return (
                    <g key={idx}>
                      <circle cx={ex} cy={ey} r="4" fill="#38bdf8" />
                      <text x={ex} y={ey + 2} textAnchor="middle" fill="#050b14" fontSize="6" fontWeight="bold">e⁻</text>
                    </g>
                  );
                })}

                {/* Electric field arrow pointing to the right */}
                <line x1="50" y1="180" x2="300" y2="180" stroke="#ef4444" strokeWidth="2" />
                <polygon points="305,180 297,176 297,184" fill="#ef4444" />
                <text x="175" y="195" textAnchor="middle" fill="#ef4444" fontSize="9" fontFamily="monospace">
                  Applied Electric Field E = {conductorElectricField} V/m (→)
                </text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Drift Velocity v_d = {driftVelocityMmS} mm/s</span>
                <span className="text-amber-400 font-bold">Microscopic Relation: I = n · e · A · v_d</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">v_d = e · E · τ / m</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Despite rapid thermal speeds (~10⁶ m/s) with random collisions, applied electric field imposes a tiny net directional drift (v_d ~ mm/s) on free electrons that constitutes macroscopic electric current.
              </p>

              <div>
                <div className="flex justify-between mb-1 font-mono text-xs">
                  <span className="text-slate-300">Electric Field (E):</span>
                  <span className="text-cyan-400 font-bold">{conductorElectricField} V/m</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={conductorElectricField}
                  onChange={(e) => setConductorElectricField(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. CYCLOTRON & LORENTZ MAGNETIC FORCE */}
      {/* ============================================================== */}
      {activeMode === 'cyclotron-lorentz' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE CYCLOTRON EXPANDING SPIRAL (F = q v × B)</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* D-shaped Dees: Dee 1 (Left) */}
                <path d="M 160,25 A 75 75 0 0 0 160,175 Z" fill="#0284c718" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="110" y="105" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">Dee 1</text>

                {/* Dee 2 (Right) */}
                <path d="M 190,25 A 75 75 0 0 1 190,175 Z" fill="#0284c718" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="215" y="105" fill="#38bdf8" fontSize="12" fontFamily="monospace" fontWeight="bold">Dee 2</text>

                {/* Accelerating Gap between Dees */}
                <line x1="175" y1="20" x2="175" y2="180" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

                {/* Uniform B field perpendicular symbols ⊗ */}
                {[50, 100, 150, 200, 250, 300].map((x) =>
                  [50, 100, 150].map((y) => (
                    <text key={`${x}-${y}`} x={x} y={y} fill="#1e293b" fontSize="10" fontFamily="monospace">⊗</text>
                  ))
                )}

                {/* Live Spiral Motion of Proton */}
                {(() => {
                  const spiralRadius = 10 + (animTime * 14) % 65;
                  const angle = animTime * 6;
                  const px = 175 + Math.cos(angle) * spiralRadius;
                  const py = 100 + Math.sin(angle) * spiralRadius;

                  return (
                    <g>
                      <circle cx={px} cy={py} r="5" fill="#facc15" stroke="#ffffff" strokeWidth="1.5" className="animate-pulse" />
                      <line
                        x1={px}
                        y1={py}
                        x2={px - Math.cos(angle) * 12}
                        y2={py - Math.sin(angle) * 12}
                        stroke="#ef4444"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })()}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Cyclotron Frequency f_c = {cyclotronFreqMhz} MHz</span>
                <span className="text-amber-400 font-bold">Orbit Radius r = {cyclotronRadiusCm} cm</span>
                <span className="text-emerald-400 font-bold">Period T = 2πm / (qB) (Constant!)</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Lorentz Magnetic Force: F = q(v × B)</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Magnetic force acts centripetally perpendicular to velocity, changing direction without doing work. In a cyclotron, resonance RF electric field accelerates the ion across the dee gap, spiraling outward with constant orbital period T.
              </p>

              <div>
                <div className="flex justify-between mb-1 font-mono text-xs">
                  <span className="text-slate-300">Magnetic Field (B):</span>
                  <span className="text-cyan-400 font-bold">{cyclotronBField} T</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.1"
                  value={cyclotronBField}
                  onChange={(e) => setCyclotronBField(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. ELECTROMAGNETIC INDUCTION (FARADAY & LENZ) */}
      {/* ============================================================== */}
      {activeMode === 'electromagnetic-induction' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE FARADAY INDUCTION & GALVANOMETER NEEDLE</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Solenoid Coil on Right */}
                <g>
                  {[180, 205, 230, 255, 280].map((xCoil, idx) => (
                    <ellipse key={idx} cx={xCoil} cy="100" rx="9" ry="32" fill="none" stroke="#f59e0b" strokeWidth="3" />
                  ))}
                  <text x="230" y="150" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="monospace">N-turn Solenoid</text>
                </g>

                {/* Moving Bar Magnet on Left */}
                {(() => {
                  const magnetX = 40 + Math.sin(animTime * 2.5) * 45;
                  const velocity = Math.cos(animTime * 2.5); // direction
                  const needleDeflection = Math.round(velocity * 35);

                  return (
                    <g>
                      {/* Bar Magnet */}
                      <g transform={`translate(${magnetX}, 80)`}>
                        <rect x="0" y="0" width="40" height="40" fill="#ef4444" rx="3" />
                        <text x="20" y="25" textAnchor="middle" fill="#ffffff" fontWeight="bold">N</text>
                        <rect x="40" y="0" width="40" height="40" fill="#3b82f6" rx="3" />
                        <text x="60" y="25" textAnchor="middle" fill="#ffffff" fontWeight="bold">S</text>
                      </g>

                      {/* Live Analog Galvanometer at bottom */}
                      <g transform="translate(230, 160)">
                        <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
                        <text x="0" y="16" textAnchor="middle" fill="#38bdf8" fontSize="7" fontFamily="monospace">Galvanometer G</text>
                        {/* Deflecting needle */}
                        <line x1="0" y1="0" x2={needleDeflection * 0.45} y2="-16" stroke="#f43f5e" strokeWidth="2" />
                        <circle cx="0" cy="0" r="3" fill="#f43f5e" />
                      </g>
                    </g>
                  );
                })()}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Faraday’s Law: ε = -N · dΦ_B / dt</span>
                <span className="text-amber-400 font-bold">Lenz’s Law: Opposes magnet motion (Conservation of Energy)</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">Lenz’s Law & Eddy Currents</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                As the North pole approaches the coil, induced current creates a North pole facing it to repel the approach. When withdrawn, induced current reverses, forming a South pole to attract and retard receding motion.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. SERIES LCR AC CIRCUIT & ROTATING PHASOR */}
      {/* ============================================================== */}
      {activeMode === 'lcr-ac-resonance' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Live Phasor & Oscilloscope Canvas */}
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE ROTATING PHASOR & DUAL-TRACE OSCILLOSCOPE</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Left Side: Rotating Phasor Diagram */}
                <g transform="translate(85, 100)">
                  <circle cx="0" cy="0" r="55" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="-60" y1="0" x2="60" y2="0" stroke="#475569" strokeWidth="1" />
                  <line x1="0" y1="-60" x2="0" y2="60" stroke="#475569" strokeWidth="1" />

                  {/* Rotating Voltage Phasor V0 */}
                  {(() => {
                    const rotTheta = animTime * 4;
                    const vx = Math.cos(rotTheta) * 45;
                    const vy = -Math.sin(rotTheta) * 45;
                    const ix = Math.cos(rotTheta - phaseAngleRad) * 35;
                    const iy = -Math.sin(rotTheta - phaseAngleRad) * 35;

                    return (
                      <>
                        <line x1="0" y1="0" x2={vx} y2={vy} stroke="#38bdf8" strokeWidth="2.5" />
                        <circle cx={vx} cy={vy} r="3" fill="#38bdf8" />
                        <text x={vx + 4} y={vy} fill="#38bdf8" fontSize="8" fontFamily="monospace">V₀</text>

                        {/* Current Phasor I0 */}
                        <line x1="0" y1="0" x2={ix} y2={iy} stroke="#f59e0b" strokeWidth="2" />
                        <circle cx={ix} cy={iy} r="2.5" fill="#f59e0b" />
                        <text x={ix + 4} y={iy} fill="#f59e0b" fontSize="8" fontFamily="monospace">I₀</text>
                      </>
                    );
                  })()}
                  <text x="0" y="70" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">Rotating Phasor</text>
                </g>

                {/* Right Side: Live Dual-Trace Oscilloscope (V vs I waveforms) */}
                <g transform="translate(170, 40)">
                  <rect x="0" y="0" width="165" height="120" rx="6" fill="#020617" stroke="#1e293b" strokeWidth="1.5" />
                  <line x1="0" y1="60" x2="165" y2="60" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Voltage Waveform (Cyan) */}
                  <path
                    d={Array.from({ length: 30 }, (_, i) => {
                      const tWave = i * 0.15;
                      const x = (i / 29) * 165;
                      const y = 60 - Math.sin(tWave * 3 - animTime * 5) * 40;
                      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />

                  {/* Current Waveform (Amber with phase shift) */}
                  <path
                    d={Array.from({ length: 30 }, (_, i) => {
                      const tWave = i * 0.15;
                      const x = (i / 29) * 165;
                      const y = 60 - Math.sin(tWave * 3 - animTime * 5 - phaseAngleRad) * 32;
                      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                  />
                  <text x="10" y="20" fill="#38bdf8" fontSize="8" fontFamily="monospace">V(t)</text>
                  <text x="35" y="20" fill="#f59e0b" fontSize="8" fontFamily="monospace">I(t)</text>
                </g>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Impedance Z = {lcrImpedanceZ} Ω</span>
                <span className="text-amber-400 font-bold">Phase Angle ϕ = {phaseAngleDeg}°</span>
                <span className="text-emerald-400 font-bold">Resonance f₀ = {resonanceFreqF0} Hz</span>
              </div>
            </div>

            {/* Sliders */}
            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">LCR Resonance & Tuning</h4>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">AC Frequency (f):</span>
                    <span className="text-cyan-400 font-bold">{acFreqHz} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="150"
                    value={acFreqHz}
                    onChange={(e) => setAcFreqHz(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <button
                  onClick={() => setAcFreqHz(Math.round(resonanceFreqF0))}
                  className="w-full py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold transition"
                >
                  Tune to Resonance (f = {resonanceFreqF0} Hz)
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-emerald-400 font-bold block font-mono text-[11px] uppercase">
                  At Electrical Resonance:
                </span>
                <p>
                  Inductive reactance cancels capacitive reactance (X_L = X_C). Impedance hits absolute minimum Z = R, maximizing antenna current for radio/TV tuning.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. WAVE OPTICS (YOUNG'S DOUBLE SLIT INTERFERENCE) */}
      {/* ============================================================== */}
      {activeMode === 'wave-optics-ydse' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE WAVE INTERFERENCE & INTERFERENCE FRINGES</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Double Slit Barrier at x = 70 */}
                <line x1="70" y1="10" x2="70" y2="80" stroke="#64748b" strokeWidth="4" />
                <line x1="70" y1="90" x2="70" y2="110" stroke="#64748b" strokeWidth="4" />
                <line x1="70" y1="120" x2="70" y2="190" stroke="#64748b" strokeWidth="4" />

                <circle cx="70" cy="85" r="2" fill="#38bdf8" />
                <text x="50" y="88" fill="#38bdf8" fontSize="8" fontFamily="monospace">S₁</text>
                <circle cx="70" cy="115" r="2" fill="#38bdf8" />
                <text x="50" y="118" fill="#38bdf8" fontSize="8" fontFamily="monospace">S₂</text>

                {/* Live Expanding Wave Ripples from Slit 1 and Slit 2 */}
                {[20, 45, 70, 95, 120, 145].map((baseR, i) => {
                  const r = (baseR + animTime * 35) % 160;
                  return (
                    <g key={i}>
                      {/* S1 ripple */}
                      <path
                        d={`M 70,${85 - r} A ${r} ${r} 0 0 1 70,${85 + r}`}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                        opacity={Math.max(0, 1 - r / 160)}
                      />
                      {/* S2 ripple */}
                      <path
                        d={`M 70,${115 - r} A ${r} ${r} 0 0 1 70,${115 + r}`}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                        opacity={Math.max(0, 1 - r / 160)}
                      />
                    </g>
                  );
                })}

                {/* Observation Screen at x = 270 */}
                <rect x="270" y="20" width="12" height="160" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />
                {/* Live Alternating Bright & Dark Fringes on Screen */}
                {[-60, -40, -20, 0, 20, 40, 60].map((yOffset, i) => (
                  <rect
                    key={i}
                    x="272"
                    y={100 + yOffset - 4}
                    width="8"
                    height="8"
                    fill="#38bdf8"
                    opacity={yOffset === 0 ? 1 : 0.75}
                  />
                ))}
                <text x="290" y="103" fill="#38bdf8" fontSize="8" fontFamily="monospace">Central Bright Fringe (n=0)</text>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Fringe Width β = {fringeWidthMm} mm</span>
                <span className="text-amber-400 font-bold">Formula: β = λ · D / d</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Wave Interference & Fringe Width</h4>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Wavelength (λ):</span>
                    <span className="text-cyan-400 font-bold">{ydseWavelengthNm} nm</span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="750"
                    value={ydseWavelengthNm}
                    onChange={(e) => setYdseWavelengthNm(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Slit Separation (d):</span>
                    <span className="text-amber-400 font-bold">{ydseSlitDistMm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="1.5"
                    step="0.1"
                    value={ydseSlitDistMm}
                    onChange={(e) => setYdseSlitDistMm(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-cyan-400 font-bold block font-mono text-[11px] uppercase">
                  Constructive & Destructive:
                </span>
                <p>
                  Path difference Δx = d · sin θ = nλ yields constructive interference (bright fringe). Path difference (2n+1)λ/2 causes complete destructive wave cancellation (dark fringe).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. PHOTOELECTRIC EFFECT & EINSTEIN'S EQUATION */}
      {/* ============================================================== */}
      {activeMode === 'photoelectric-effect' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE QUANTUM PHOTON STRIKE & PHOTOELECTRON EMISSION</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Photosensitive Cathode Plate */}
                <rect x="50" y="40" width="20" height="120" rx="3" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
                <text x="60" y="175" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">Cathode (Metal)</text>

                {/* Anode Collector Plate */}
                <rect x="280" y="40" width="20" height="120" rx="3" fill="#64748b" stroke="#94a3b8" strokeWidth="2" />
                <text x="290" y="175" textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">Anode Collector</text>

                {/* Incoming Photon Wave Packets hitting Cathode */}
                {[0, 0.25, 0.5, 0.75].map((phase, i) => {
                  const tPhoton = (animTime * 1.5 + phase) % 1;
                  const px = 10 + tPhoton * 40;
                  const py = 60 + i * 25 + Math.sin(tPhoton * 15) * 5;
                  return (
                    <circle key={i} cx={px} cy={py} r="3" fill="#facc15" />
                  );
                })}

                {/* Ejected Photoelectrons flying towards Anode if condition met */}
                {isEmissionAllowed &&
                  [0, 0.2, 0.4, 0.6, 0.8].map((phase, i) => {
                    const tElec = (animTime * Math.max(0.5, maxKineticEnergyEv * 0.8) + phase) % 1;
                    const ex = 75 + tElec * 200;
                    const ey = 55 + i * 22;
                    return (
                      <g key={i}>
                        <circle cx={ex} cy={ey} r="3.5" fill="#38bdf8" />
                        <text x={ex} y={ey + 2} textAnchor="middle" fill="#050b14" fontSize="5" fontWeight="bold">e⁻</text>
                      </g>
                    );
                  })}

                {!isEmissionAllowed && (
                  <text x="175" y="105" textAnchor="middle" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    {photonEnergyEv < workFunctionEv
                      ? `hν (${photonEnergyEv} eV) < Φ₀ (${workFunctionEv} eV) • NO EMISSION`
                      : `Retarding Potential (${retardingVoltageV} V) >= V₀ (${stoppingPotentialV} V) • CURRENT STOPPED`}
                  </text>
                )}
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Photon Energy hν = {photonEnergyEv} eV</span>
                <span className="text-amber-400 font-bold">Max K_max = {maxKineticEnergyEv} eV</span>
                <span className="text-emerald-400 font-bold">Stopping Potential V₀ = {stoppingPotentialV} V</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">Einstein’s Equation: K_max = hν - Φ₀</h4>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Light Frequency (ν):</span>
                    <span className="text-amber-400 font-bold">{lightFreqThz} THz</span>
                  </div>
                  <input
                    type="range"
                    min="400"
                    max="1400"
                    step="20"
                    value={lightFreqThz}
                    onChange={(e) => setLightFreqThz(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-mono">
                    <span className="text-slate-300">Retarding Potential (V):</span>
                    <span className="text-rose-400 font-bold">{retardingVoltageV} V</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={retardingVoltageV}
                    onChange={(e) => setRetardingVoltageV(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-amber-400 font-bold block font-mono text-[11px] uppercase">
                  Threshold Condition:
                </span>
                <p>
                  Photoelectric emission is instantaneous and requires photon energy hν to exceed work function Φ₀. Light intensity controls the rate of photon arrivals (photocurrent), while frequency governs electron energy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 9. SEMICONDUCTOR P-N JUNCTION & FULL-WAVE RECTIFIER */}
      {/* ============================================================== */}
      {activeMode === 'semiconductor-pn-junction' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 bg-[#050b14] rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
              <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-cyan-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>LIVE AC TO PULSATING DC RECTIFICATION</span>
              </div>

              <svg viewBox="0 0 350 200" className="w-full h-64 select-none">
                {/* Input AC Waveform (Left) */}
                <g transform="translate(30, 40)">
                  <rect x="0" y="0" width="130" height="90" rx="6" fill="#020617" stroke="#1e293b" strokeWidth="1.5" />
                  <line x1="0" y1="45" x2="130" y2="45" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                  <path
                    d={Array.from({ length: 25 }, (_, i) => {
                      const x = (i / 24) * 130;
                      const y = 45 - Math.sin((i / 24) * 4 * Math.PI - animTime * 4) * 30;
                      return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  <text x="10" y="20" fill="#38bdf8" fontSize="8" fontFamily="monospace">AC Input (50 Hz)</text>
                </g>

                {/* Arrow to Full Wave Rectifier Diode Bridge */}
                <line x1="168" y1="85" x2="192" y2="85" stroke="#64748b" strokeWidth="2" />
                <polygon points="196,85 190,81 190,89" fill="#64748b" />

                {/* Output Rectified DC Waveform (Right) */}
                <g transform="translate(200, 40)">
                  <rect x="0" y="0" width="130" height="90" rx="6" fill="#020617" stroke="#1e293b" strokeWidth="1.5" />
                  <line x1="0" y1="75" x2="130" y2="75" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                  <path
                    d={Array.from({ length: 25 }, (_, i) => {
                      const x = (i / 24) * 130;
                      const rawSin = Math.sin((i / 24) * 4 * Math.PI - animTime * 4);
                      const rectifiedY = Math.abs(rawSin);
                      const finalY = rectifierFilterOn
                        ? 75 - (30 - 4 * (1 - Math.cos(rawSin * 2))) // smoothed DC
                        : 75 - rectifiedY * 30; // pure pulsating DC
                      return `${i === 0 ? 'M' : 'L'} ${x},${finalY}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                  <text x="10" y="20" fill="#10b981" fontSize="8" fontFamily="monospace">
                    {rectifierFilterOn ? 'Filtered Smooth DC (100 Hz)' : 'Pulsating DC (100 Hz)'}
                  </text>
                </g>
              </svg>

              <div className="flex flex-wrap items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-3 py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
                <span className="text-cyan-400 font-bold">Input AC Frequency: 50 Hz</span>
                <span className="text-emerald-400 font-bold">Output Ripple Frequency: 100 Hz (Doubled)</span>
                <span className="text-amber-400 font-bold">Rectifier Efficiency: 81.2%</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Full-Wave Rectification</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In a full-wave rectifier, diodes alternate conduction during both positive and negative AC half-cycles, producing unidirectional pulsating output. A shunt capacitor filter smooths voltage ripples into stable DC.
              </p>

              <button
                onClick={() => setRectifierFilterOn(!rectifierFilterOn)}
                className="w-full py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-bold text-cyan-300 hover:border-cyan-400 transition"
              >
                {rectifierFilterOn ? 'Filter: CAPACITOR ON (Smooth DC)' : 'Filter: OFF (Pulsating DC)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
