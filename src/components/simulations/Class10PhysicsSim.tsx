import React, { useState, useEffect } from 'react';
import {
  Sun,
  Eye,
  Zap,
  Magnet,
  Compass,
  Wind,
  Flame,
  Activity,
  Play,
  RotateCcw,
  Sparkles,
  Info,
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

  useEffect(() => {
    setActiveMode(getInitialMode());
  }, [simulationType, conceptId]);

  // ----------------------------------------------------------------------
  // MODE 1: SPHERICAL MIRRORS OPTICAL BENCH
  // ----------------------------------------------------------------------
  const [mirrorType, setMirrorType] = useState<'concave' | 'convex'>(() => {
    if (conceptId.includes('convex-mirror')) return 'convex';
    return 'concave';
  });
  const [mirrorFocalLength, setMirrorFocalLength] = useState<number>(variables.focalLengthMm ?? -20);
  const [mirrorObjectU, setMirrorObjectU] = useState<number>(variables.objectDistanceU ?? -40);
  const [mirrorObjectHeight, setMirrorObjectHeight] = useState<number>(variables.objectHeightHo ?? 4);

  // Mirror formula: 1/v = 1/f - 1/u => v = (u*f)/(u - f)
  const effectiveF = mirrorType === 'concave' ? -Math.abs(mirrorFocalLength) : Math.abs(mirrorFocalLength);
  const calculatedImageV = (mirrorObjectU * effectiveF) / (mirrorObjectU - effectiveF);
  const mirrorMagnification = -calculatedImageV / mirrorObjectU;
  const calculatedImageHeight = mirrorObjectHeight * mirrorMagnification;

  // ----------------------------------------------------------------------
  // MODE 2: LENSES & REFRACTION BENCH
  // ----------------------------------------------------------------------
  const [lensType, setLensType] = useState<'convex' | 'concave' | 'slab'>(() => {
    if (conceptId.includes('glass-slab')) return 'slab';
    if (conceptId.includes('concave-lens')) return 'concave';
    return 'convex';
  });
  const [lensF, setLensF] = useState<number>(20);
  const [lensU, setLensU] = useState<number>(-35);

  // Lens formula: 1/v - 1/u = 1/f => 1/v = 1/f + 1/u => v = (u*f)/(u + f)
  const effectiveLensF = lensType === 'convex' ? Math.abs(lensF) : -Math.abs(lensF);
  const calculatedLensV = (lensU * effectiveLensF) / (lensU + effectiveLensF);
  const lensMagnification = calculatedLensV / lensU;

  // ----------------------------------------------------------------------
  // MODE 3: THE HUMAN EYE, MYOPIA & PRISM DISPERSION
  // ----------------------------------------------------------------------
  const [eyeMode, setEyeMode] = useState<'myopia' | 'hypermetropia' | 'prism' | 'scattering'>(() => {
    if (conceptId.includes('hypermetropia')) return 'hypermetropia';
    if (conceptId.includes('prism') || conceptId.includes('dispersion')) return 'prism';
    if (conceptId.includes('scattering') || conceptId.includes('atmospheric')) return 'scattering';
    return 'myopia';
  });
  const [spectacleCorrected, setSpectacleCorrected] = useState(true);

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

  const eqResistance =
    circuitTopology === 'series'
      ? circuitR1 + circuitR2
      : (circuitR1 * circuitR2) / (circuitR1 + circuitR2);
  const totalCircuitCurrent = circuitVoltage / eqResistance;
  const joulePowerHeat = Math.round(totalCircuitCurrent * totalCircuitCurrent * eqResistance * 10) / 10;

  // ----------------------------------------------------------------------
  // MODE 5: MAGNETIC EFFECTS & MOTOR / EMI
  // ----------------------------------------------------------------------
  const [magneticSubMode, setMagneticSubMode] = useState<'thumb_rule' | 'solenoid' | 'motor' | 'induction'>(() => {
    if (conceptId.includes('solenoid')) return 'solenoid';
    if (conceptId.includes('motor') || conceptId.includes('left-hand')) return 'motor';
    if (conceptId.includes('induction') || conceptId.includes('right-hand')) return 'induction';
    return 'thumb_rule';
  });
  const [magneticCurrentAmps, setMagneticCurrentAmps] = useState<number>(5);
  const [isMotorRunning, setIsMotorRunning] = useState(true);

  // ----------------------------------------------------------------------
  // MODE 6: ENERGY SOURCES
  // ----------------------------------------------------------------------
  const [windSpeed, setWindSpeed] = useState<number>(variables.windSpeedMPerS ?? 10);

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner - Only show mode switcher tabs if NOT exploring a specific topic */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            NCERT Class 10 Physics Interactive Lab
          </h3>
        </div>

        {!isExploringTopic && (
          <div className="flex flex-wrap items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveMode('spherical-mirrors')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeMode === 'spherical-mirrors'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mirrors
            </button>
            <button
              onClick={() => setActiveMode('refraction-lenses')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeMode === 'refraction-lenses'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Lenses
            </button>
            <button
              onClick={() => setActiveMode('human-eye-optics')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeMode === 'human-eye-optics'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Human Eye & Prism
            </button>
            <button
              onClick={() => setActiveMode('electricity-circuits')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeMode === 'electricity-circuits'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Electricity
            </button>
            <button
              onClick={() => setActiveMode('magnetic-effects')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeMode === 'magnetic-effects'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Magnetism & Motor
            </button>
            <button
              onClick={() => setActiveMode('energy-sources')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeMode === 'energy-sources'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Energy
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODE 1: SPHERICAL MIRRORS OPTICAL BENCH */}
      {/* ============================================================== */}
      {activeMode === 'spherical-mirrors' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-300 font-mono font-bold uppercase">
              Mirror Geometry:
            </span>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setMirrorType('concave')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  mirrorType === 'concave'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Concave Mirror (Converging)
              </button>
              <button
                onClick={() => setMirrorType('convex')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  mirrorType === 'convex'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Convex Mirror (Diverging Rear-View)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Interactive Optical Bench Canvas */}
            <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[300px]">
              <svg viewBox="0 0 320 200" className="w-full h-52">
                {/* Principal Axis */}
                <line x1="20" y1="100" x2="300" y2="100" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Mirror Curved Surface at x = 160 */}
                {mirrorType === 'concave' ? (
                  <path d="M 160,30 Q 150,100 160,170" fill="none" stroke="#38bdf8" strokeWidth="5" />
                ) : (
                  <path d="M 160,30 Q 170,100 160,170" fill="none" stroke="#38bdf8" strokeWidth="5" />
                )}
                {/* Pole P */}
                <circle cx="160" cy="100" r="3" fill="#38bdf8" />
                <text x="163" y="115" fill="#38bdf8" fontSize="8" fontFamily="monospace">P</text>

                {/* Focus F and Center C */}
                {mirrorType === 'concave' ? (
                  <>
                    <circle cx="120" cy="100" r="3" fill="#f59e0b" />
                    <text x="117" y="115" fill="#f59e0b" fontSize="8" fontFamily="monospace">F</text>
                    <circle cx="80" cy="100" r="3" fill="#f59e0b" />
                    <text x="77" y="115" fill="#f59e0b" fontSize="8" fontFamily="monospace">C</text>
                  </>
                ) : (
                  <>
                    <circle cx="200" cy="100" r="3" fill="#f59e0b" />
                    <text x="197" y="115" fill="#f59e0b" fontSize="8" fontFamily="monospace">F</text>
                  </>
                )}

                {/* Object Arrow (always to the left) */}
                <line x1="60" y1="100" x2="60" y2="50" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" />
                <text x="50" y="45" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">Object (h)</text>

                {/* Light Rays */}
                <line x1="60" y1="50" x2="160" y2="50" stroke="#e2e8f0" strokeWidth="1.5" />
                {mirrorType === 'concave' ? (
                  <line x1="160" y1="50" x2="70" y2="170" stroke="#e2e8f0" strokeWidth="1.5" />
                ) : (
                  <>
                    <line x1="160" y1="50" x2="110" y2="20" stroke="#e2e8f0" strokeWidth="1.5" />
                    <line x1="160" y1="50" x2="200" y2="100" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                  </>
                )}
              </svg>

              <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400 mt-2">
                <span className="text-cyan-400">Object Distance u: {mirrorObjectU} cm</span>
                <span className="text-amber-400">Image Distance v: {Math.round(calculatedImageV * 10) / 10} cm</span>
                <span className="text-emerald-400">Magnification m: {Math.round(mirrorMagnification * 100) / 100}</span>
              </div>
            </div>

            {/* Controls & Sign Convention */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">
                Mirror Formula: 1/v + 1/u = 1/f
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Object Distance (u):</span>
                    <span className="text-cyan-400 font-mono font-bold">{mirrorObjectU} cm</span>
                  </div>
                  <input
                    type="range"
                    min="-70"
                    max="-10"
                    value={mirrorObjectU}
                    onChange={(e) => setMirrorObjectU(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <span className="text-amber-400 font-bold block font-mono">Image Properties:</span>
                <p>• Nature: {calculatedImageV < 0 ? 'Real & Inverted (in front of mirror)' : 'Virtual & Erect (behind mirror)'}</p>
                <p>• Size: {Math.abs(mirrorMagnification) > 1 ? 'Magnified' : Math.abs(mirrorMagnification) < 1 ? 'Diminished' : 'Same Size'}</p>
                <p className="text-[11px] text-slate-400 italic">Cartesian: u is always negative; Concave f &lt; 0; Convex f &gt; 0.</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[300px]">
              <svg viewBox="0 0 320 200" className="w-full h-52">
                <line x1="20" y1="100" x2="300" y2="100" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
                {/* Thin Lens Profile at x = 160 */}
                <ellipse cx="160" cy="100" rx="8" ry="70" fill="#38bdf822" stroke="#38bdf8" strokeWidth="2.5" />
                {/* Optical Center O */}
                <circle cx="160" cy="100" r="3" fill="#38bdf8" />
                <text x="163" y="115" fill="#38bdf8" fontSize="8" fontFamily="monospace">O</text>
                {/* Focus F1 and F2 */}
                <circle cx="100" cy="100" r="3" fill="#f59e0b" />
                <text x="96" y="115" fill="#f59e0b" fontSize="8" fontFamily="monospace">F₁</text>
                <circle cx="220" cy="100" r="3" fill="#f59e0b" />
                <text x="216" y="115" fill="#f59e0b" fontSize="8" fontFamily="monospace">F₂</text>

                {/* Object arrow */}
                <line x1="70" y1="100" x2="70" y2="50" stroke="#10b981" strokeWidth="3" />
                {/* Parallel ray refracts through F2 */}
                <line x1="70" y1="50" x2="160" y2="50" stroke="#e2e8f0" strokeWidth="1.5" />
                <line x1="160" y1="50" x2="260" y2="140" stroke="#e2e8f0" strokeWidth="1.5" />
                {/* Central ray passes undeviated through optical center */}
                <line x1="70" y1="50" x2="260" y2="140" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
              </svg>

              <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400 mt-2">
                <span>Lens Formula: 1/v - 1/u = 1/f</span>
                <span className="text-cyan-400">Power P = {Math.round((100 / lensF) * 10) / 10} D</span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Spherical Lenses & Power</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Convex lenses converge parallel incident light rays to a real focus (f &gt; 0, P &gt; 0). Concave lenses diverge light rays (f &lt; 0, P &lt; 0). Power P is the reciprocal of focal length in meters: P = 1/f (Dioptres D).
              </p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Calculated Image v:</span>
                  <span className="text-amber-400 font-mono">{Math.round(calculatedLensV * 10) / 10} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Magnification m:</span>
                  <span className="text-emerald-400 font-mono">{Math.round(lensMagnification * 100) / 100}</span>
                </div>
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
            <span className="text-xs text-slate-400 font-mono font-bold uppercase">
              Optical Phenomenon:
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
                Myopia & Concave Correction
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
            {eyeMode === 'myopia' && (
              <>
                <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[280px]">
                  <svg viewBox="0 0 300 180" className="w-full h-48">
                    {/* Eyeball profile */}
                    <ellipse cx="180" cy="90" rx="75" ry="65" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
                    {/* Retina back wall */}
                    <path d="M 230,45 A 75 65 0 0 1 230,135" fill="none" stroke="#f43f5e" strokeWidth="4" />
                    <text x="240" y="93" fill="#f43f5e" fontSize="8" fontFamily="monospace">Retina</text>
                    {/* Eye lens */}
                    <ellipse cx="130" cy="90" rx="8" ry="28" fill="#38bdf844" stroke="#38bdf8" strokeWidth="2" />

                    {/* Spectacle concave lens if corrected */}
                    {spectacleCorrected && (
                      <path d="M 50,65 Q 55,90 50,115 L 60,115 Q 55,90 60,65 Z" fill="#818cf844" stroke="#818cf8" strokeWidth="1.5" />
                    )}

                    {/* Rays */}
                    {spectacleCorrected ? (
                      /* Focuses cleanly on retina */
                      <g stroke="#38bdf8" strokeWidth="1.5">
                        <line x1="10" y1="75" x2="52" y2="75" />
                        <line x1="52" y1="75" x2="130" y2="70" />
                        <line x1="130" y1="70" x2="255" y2="90" />
                        <line x1="10" y1="105" x2="52" y2="105" />
                        <line x1="52" y1="105" x2="130" y2="110" />
                        <line x1="130" y1="110" x2="255" y2="90" />
                      </g>
                    ) : (
                      /* Focuses in front of retina */
                      <g stroke="#f59e0b" strokeWidth="1.5">
                        <line x1="10" y1="75" x2="130" y2="75" />
                        <line x1="130" y1="75" x2="200" y2="90" />
                        <line x1="10" y1="105" x2="130" y2="105" />
                        <line x1="130" y1="105" x2="200" y2="90" />
                        <circle cx="200" cy="90" r="3" fill="#f59e0b" />
                      </g>
                    )}
                  </svg>

                  <button
                    onClick={() => setSpectacleCorrected(!spectacleCorrected)}
                    className="mt-2 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow transition"
                  >
                    {spectacleCorrected ? 'Remove Concave Glasses (Defective Focus)' : 'Wear Concave Eyeglasses (Sharp Retina Focus)'}
                  </button>
                </div>

                <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
                  <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Myopia (Near-Sightedness)</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A myopic eye cannot focus distant parallel rays; due to excessive lens curvature or elongation of the eyeball, rays converge in front of the retina. A concave lens (f &lt; 0) diverges the rays so they focus sharply on the retina.
                  </p>
                </div>
              </>
            )}

            {eyeMode === 'prism' && (
              <>
                <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[280px]">
                  <svg viewBox="0 0 300 180" className="w-full h-48">
                    {/* Triangular Prism */}
                    <polygon points="150,30 80,150 220,150" fill="#0284c715" stroke="#38bdf8" strokeWidth="2.5" />
                    {/* White incident beam */}
                    <line x1="20" y1="110" x2="115" y2="90" stroke="#ffffff" strokeWidth="3" />
                    <text x="30" y="100" fill="#ffffff" fontSize="9" fontFamily="monospace">White Light</text>
                    {/* Dispersed VIBGYOR rays */}
                    <line x1="115" y1="90" x2="175" y2="100" stroke="#f43f5e" strokeWidth="2" />
                    <line x1="175" y1="100" x2="280" y2="110" stroke="#f43f5e" strokeWidth="2" />
                    <text x="285" y="113" fill="#f43f5e" fontSize="9" fontFamily="monospace">Red (Least bent)</text>

                    <line x1="115" y1="90" x2="175" y2="115" stroke="#a855f7" strokeWidth="2" />
                    <line x1="175" y1="115" x2="280" y2="145" stroke="#a855f7" strokeWidth="2" />
                    <text x="285" y="148" fill="#a855f7" fontSize="9" fontFamily="monospace">Violet (Most bent)</text>
                  </svg>
                </div>

                <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
                  <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Prism Dispersion Spectrum</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Refractive index of glass is higher for shorter wavelengths. Violet light (λ ≈ 400 nm) bends the most, while red light (λ ≈ 700 nm) bends the least, separating white sunlight into the VIBGYOR band.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 4: ELECTRICITY & OHM'S LAW CIRCUITS */}
      {/* ============================================================== */}
      {activeMode === 'electricity-circuits' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase">
              Circuit Topology:
            </span>
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setCircuitTopology('series')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  circuitTopology === 'series'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Series (Rs = R1 + R2)
              </button>
              <button
                onClick={() => setCircuitTopology('parallel')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  circuitTopology === 'parallel'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Parallel (1/Rp = 1/R1 + 1/R2)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Circuit Board */}
            <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[280px]">
              <div className="w-full max-w-sm h-48 bg-slate-950 rounded-2xl border border-slate-800 p-4 relative flex flex-col justify-between">
                {/* Battery Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold">DC Power Supply: {circuitVoltage} V</span>
                  <span className="text-xs font-mono text-amber-400 font-bold">Ammeter: {Math.round(totalCircuitCurrent * 100) / 100} A</span>
                </div>

                {/* Circuit Diagram */}
                <div className="flex items-center justify-around py-4">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center font-mono">
                    <span className="text-xs text-slate-400 block">R₁</span>
                    <span className="text-sm font-bold text-white">{circuitR1} Ω</span>
                  </div>
                  <span className="text-slate-500 font-mono font-bold text-sm">
                    {circuitTopology === 'series' ? '— [Series] —' : '|| [Parallel] ||'}
                  </span>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-center font-mono">
                    <span className="text-xs text-slate-400 block">R₂</span>
                    <span className="text-sm font-bold text-white">{circuitR2} Ω</span>
                  </div>
                </div>

                {/* Footer Joule Dissipation */}
                <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Equivalent R: {Math.round(eqResistance * 100) / 100} Ω</span>
                  <span className="text-rose-400 font-bold">Joule Heat H = {joulePowerHeat} W (J/s)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">Ohm’s Law: V = IR</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Voltage (V):</span>
                    <span className="text-cyan-400 font-mono font-bold">{circuitVoltage} V</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="24"
                    value={circuitVoltage}
                    onChange={(e) => setCircuitVoltage(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Resistor R₁:</span>
                    <span className="text-amber-400 font-mono font-bold">{circuitR1} Ω</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={circuitR1}
                    onChange={(e) => setCircuitR1(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 5: MAGNETIC EFFECTS & MOTOR / EMI */}
      {/* ============================================================== */}
      {activeMode === 'magnetic-effects' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Motor / Magnetic Canvas */}
            <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[280px]">
              <svg viewBox="0 0 300 180" className="w-full h-48">
                {/* Permanent Magnet North Pole (Red) */}
                <rect x="20" y="50" width="50" height="80" rx="6" fill="#b91c1c" stroke="#f87171" strokeWidth="2" />
                <text x="45" y="95" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">N</text>

                {/* Permanent Magnet South Pole (Blue) */}
                <rect x="230" y="50" width="50" height="80" rx="6" fill="#1d4ed8" stroke="#60a5fa" strokeWidth="2" />
                <text x="255" y="95" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">S</text>

                {/* Magnetic Field Lines (N to S) */}
                <line x1="70" y1="70" x2="230" y2="70" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="70" y1="90" x2="230" y2="90" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="70" y1="110" x2="230" y2="110" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 4" />

                {/* Rotating Armature Coil ABCD */}
                <rect x="110" y="65" width="80" height="50" rx="4" fill="none" stroke="#facc15" strokeWidth="3" />
                {/* Commutator Split Rings at center bottom */}
                <circle cx="150" cy="140" r="10" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="14 5" />
              </svg>

              <span className="text-xs font-mono text-emerald-400 mt-2">
                Fleming’s Left-Hand Rule: Forefinger (Field N→S), Middle (Current), Thumb (Upward/Downward Force)
              </span>
            </div>

            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
              <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">Electric Motor Principle</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                An electric motor converts electrical energy into rotational mechanical energy. A current-carrying coil in a magnetic field experiences a couple torque (F = BIL). The split-ring commutator reverses current every half-turn to maintain unidirectional rotation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 6: ENERGY SOURCES */}
      {/* ============================================================== */}
      {activeMode === 'energy-sources' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[280px]">
              <div className="text-center font-mono space-y-2">
                <Wind className="w-12 h-12 text-cyan-400 mx-auto animate-spin" style={{ animationDuration: `${Math.max(0.5, 30 / windSpeed)}s` }} />
                <span className="text-white font-bold block text-sm">Wind Turbine Generator</span>
                <span className="text-cyan-400 text-xs block">Wind Speed: {windSpeed} m/s</span>
                <span className="text-amber-400 text-xs block font-bold">
                  Power P ∝ v³ = {Math.round(0.5 * 1.2 * 50 * Math.pow(windSpeed, 3) / 1000)} kW
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">Cubic Power Relation</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Wind power depends on the cube of wind velocity: P = ½ρAv³. Doubling wind velocity increases electrical output by 8 times (2³ = 8).
              </p>
              <div>
                <input
                  type="range"
                  min="3"
                  max="25"
                  value={windSpeed}
                  onChange={(e) => setWindSpeed(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
