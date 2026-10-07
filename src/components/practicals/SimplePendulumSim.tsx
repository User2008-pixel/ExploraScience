import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, Sparkles, LineChart, Download } from 'lucide-react';

interface SimplePendulumSimProps {
  initialLengthCm?: number;
  unlockedGravityPerk?: boolean;
}

export const SimplePendulumSim: React.FC<SimplePendulumSimProps> = ({
  initialLengthCm = 80,
  unlockedGravityPerk = true,
}) => {
  // Pendulum Parameters
  const [lengthCm, setLengthCm] = useState<number>(initialLengthCm);
  const [gravity, setGravity] = useState<number>(9.80); // m/s^2 (Earth by default)
  const [gravityPlanet, setGravityPlanet] = useState<string>('Earth');
  const [initialAngleDeg, setInitialAngleDeg] = useState<number>(8); // kept under 10 deg for SHM
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentAngleRad, setCurrentAngleRad] = useState<number>(0);

  // Stopwatch state
  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState<boolean>(false);
  const [oscillationCount, setOscillationCount] = useState<number>(0);
  const [recordedTrials, setRecordedTrials] = useState<
    { id: string; lengthCm: number; t20: number; periodT: number; tSquared: number; calculatedG: number }[]
  >([]);

  // Physics calculation:
  // L in meters:
  const lengthM = lengthCm / 100;
  // Natural angular frequency omega = sqrt(g / L)
  const omega = Math.sqrt(gravity / lengthM);
  // Theoretical Time Period T = 2 * pi * sqrt(L / g)
  const theoreticalPeriodT = 2 * Math.PI * Math.sqrt(lengthM / gravity);

  // Animation loop using requestAnimationFrame
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const prevSignRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      setCurrentAngleRad((initialAngleDeg * Math.PI) / 180);
      startTimeRef.current = null;
      return;
    }

    const maxRad = (initialAngleDeg * Math.PI) / 180;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsedSec = (timestamp - startTimeRef.current) / 1000;

      // Small-angle SHM: theta(t) = theta_0 * cos(omega * t)
      const currentTheta = maxRad * Math.cos(omega * elapsedSec);
      setCurrentAngleRad(currentTheta);

      // Oscillation counter detection (zero crossings from positive to negative)
      const currentSign = Math.sign(currentTheta);
      if (prevSignRef.current > 0 && currentSign < 0) {
        setOscillationCount((prev) => prev + 1);
      }
      prevSignRef.current = currentSign;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, omega, initialAngleDeg]);

  // Stopwatch interval timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isStopwatchRunning) {
      timer = setInterval(() => {
        setStopwatchSeconds((prev) => Number((prev + 0.1).toFixed(1)));
      }, 100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isStopwatchRunning]);

  const handleStartStopwatch = () => {
    setIsStopwatchRunning(!isStopwatchRunning);
    if (!isPlaying) setIsPlaying(true);
  };

  const handleResetStopwatch = () => {
    setIsStopwatchRunning(false);
    setStopwatchSeconds(0);
    setOscillationCount(0);
  };

  const handleRecordTrial = () => {
    if (stopwatchSeconds <= 0 || oscillationCount <= 0) return;
    const periodT = stopwatchSeconds / oscillationCount;
    const tSquared = periodT * periodT;
    const calculatedG = (4 * Math.PI * Math.PI * lengthM) / tSquared;

    setRecordedTrials((prev) => [
      ...prev,
      {
        id: `trial-${Date.now()}`,
        lengthCm,
        t20: stopwatchSeconds,
        periodT: Number(periodT.toFixed(3)),
        tSquared: Number(tSquared.toFixed(3)),
        calculatedG: Number(calculatedG.toFixed(2)),
      },
    ]);
  };

  // Graphical Bob Coordinates
  const originX = 250;
  const originY = 25;
  const scale = 2.0; // pixels per cm
  const visualLengthPx = lengthCm * scale;
  const bobX = originX + visualLengthPx * Math.sin(currentAngleRad);
  const bobY = originY + visualLengthPx * Math.cos(currentAngleRad);

  return (
    <div className="bg-[#0c1427] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
              Class 11 Physics Practical
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Simple Pendulum Apparatus & L vs T² Graph Bench
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Measure period of 20 oscillations for various lengths L. Plot L vs T² to determine local g.
          </p>
        </div>

        {/* Interplanetary Gravity Selector (Credit Reward Perk integration) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
            <span className="text-slate-400">Environment:</span>
            <select
              value={gravityPlanet}
              onChange={(e) => {
                const val = e.target.value;
                setGravityPlanet(val);
                if (val === 'Earth') setGravity(9.80);
                if (val === 'Moon') setGravity(1.62);
                if (val === 'Mars') setGravity(3.72);
                if (val === 'Jupiter') setGravity(24.79);
              }}
              className="bg-transparent text-cyan-300 font-mono font-bold focus:outline-none cursor-pointer"
            >
              <option value="Earth" className="bg-slate-900 text-white">Earth (g = 9.80 m/s²)</option>
              <option value="Moon" className="bg-slate-900 text-white">Moon (g = 1.62 m/s²)</option>
              <option value="Mars" className="bg-slate-900 text-white">Mars (g = 3.72 m/s²)</option>
              <option value="Jupiter" className="bg-slate-900 text-white">Jupiter (g = 24.79 m/s²)</option>
            </select>
          </div>

          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              isPlaying
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Swing' : 'Release Bob'}</span>
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Graphic Pendulum Canvas */}
        <div className="lg:col-span-7 bg-gradient-to-b from-[#0e172a] to-[#070b14] border border-slate-800 rounded-xl p-3 relative flex flex-col items-center justify-between min-h-[300px]">
          <svg viewBox="0 0 500 320" className="w-full h-auto max-h-[310px]">
            {/* Rigid Stand & Clamp */}
            <rect x="220" y="10" width="60" height="15" fill="#334155" rx="3" />
            <circle cx={originX} cy={originY} r="4" fill="#0ea5e9" />
            <line x1="20" y1="18" x2="220" y2="18" stroke="#475569" strokeWidth="4" />
            <line x1="20" y1="18" x2="20" y2="310" stroke="#334155" strokeWidth="6" />

            {/* Vertical Reference Dashed Line */}
            <line
              x1={originX}
              y1={originY}
              x2={originX}
              y2={originY + visualLengthPx + 20}
              stroke="#475569"
              strokeDasharray="4,4"
              strokeWidth="1"
            />

            {/* Inextensible Pendulum String */}
            <line
              x1={originX}
              y1={originY}
              x2={bobX}
              y2={bobY}
              stroke="#e2e8f0"
              strokeWidth="2"
            />

            {/* Brass Spherical Bob with Metallic Gradient */}
            <circle
              cx={bobX}
              cy={bobY}
              r="14"
              fill="url(#brassGradient)"
              stroke="#b45309"
              strokeWidth="1.5"
            />
            {/* Hook */}
            <circle cx={bobX} cy={bobY - 14} r="3" fill="none" stroke="#d97706" strokeWidth="2" />

            <defs>
              <radialGradient id="brassGradient" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#854d0e" />
              </radialGradient>
            </defs>

            {/* Arc of Oscillation */}
            <path
              d={`M ${originX - visualLengthPx * 0.15} ${originY + visualLengthPx * 0.98} Q ${originX} ${originY + visualLengthPx} ${originX + visualLengthPx * 0.15} ${originY + visualLengthPx * 0.98}`}
              fill="none"
              stroke="#38bdf8"
              strokeOpacity="0.25"
              strokeDasharray="3,3"
            />

            {/* Real-time Angle Tag */}
            <text x={originX + 10} y={originY + 40} fill="#38bdf8" fontSize="10" fontFamily="monospace">
              θ = {((currentAngleRad * 180) / Math.PI).toFixed(1)}°
            </text>
          </svg>

          {/* Quick HUD overlay */}
          <div className="absolute top-3 right-3 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl font-mono text-xs space-y-0.5">
            <div className="text-slate-400 text-[10px]">Theoretical Period:</div>
            <div className="text-cyan-300 font-bold text-sm">T = {theoreticalPeriodT.toFixed(3)} s</div>
          </div>
        </div>

        {/* Right: Lab Controls, Stopwatch & Observation Logger */}
        <div className="lg:col-span-5 space-y-3">
          {/* Sliders */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Effective Length (L):</span>
                <span className="font-mono font-bold text-cyan-300">{lengthCm} cm ({lengthM.toFixed(2)} m)</span>
              </div>
              <input
                type="range"
                min="40"
                max="120"
                step="5"
                value={lengthCm}
                onChange={(e) => setLengthCm(parseInt(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>40 cm</span>
                <span>80 cm</span>
                <span>120 cm</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">Release Angle (θ &lt; 10°):</span>
                <span className="font-mono font-bold text-amber-300">{initialAngleDeg}°</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                step="1"
                value={initialAngleDeg}
                onChange={(e) => setInitialAngleDeg(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Precision Stopwatch Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs font-bold flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Lab Stopwatch (0.1s):</span>
              </span>
              <span className="text-emerald-400 text-xs font-bold">
                {oscillationCount} Oscillations
              </span>
            </div>

            <div className="text-center py-1">
              <span className="text-3xl font-extrabold text-white tracking-widest">
                {stopwatchSeconds.toFixed(1)} <span className="text-sm text-slate-400 font-normal">sec</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 font-sans">
              <button
                onClick={handleStartStopwatch}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition ${
                  isStopwatchRunning
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {isStopwatchRunning ? 'Stop' : 'Start Timer'}
              </button>
              <button
                onClick={handleResetStopwatch}
                className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
              >
                Reset
              </button>
              <button
                onClick={handleRecordTrial}
                disabled={stopwatchSeconds <= 0}
                className="py-1.5 px-2 rounded-lg text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-40 transition shadow-sm"
              >
                Log Trial
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Observation Table & L vs T² Graph Data */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px] flex items-center gap-2">
            <LineChart className="w-4 h-4 text-cyan-400" />
            <span>Observation Table: Length vs Time Period T²</span>
          </span>
          <div className="flex items-center gap-3">
            {recordedTrials.length > 0 && (
              <button
                onClick={() => {
                  const headers = ['Trial', 'Length (cm)', 'Time for Osc. (s)', 'Period T (s)', 'T^2 (s^2)', 'Calculated g (m/s^2)'];
                  const rows = recordedTrials.map((t, idx) => [idx + 1, t.lengthCm, t.t20, t.periodT, t.tSquared, t.calculatedG]);
                  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.setAttribute('href', url);
                  link.setAttribute('download', 'simple-pendulum-experiment-data.csv');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 font-bold transition text-[11px]"
                title="Download experiment data as CSV file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download CSV</span>
              </button>
            )}
            <span className="text-cyan-300 font-bold">
              Target g = 4π² (L / T²) = {gravity} m/s² ({gravityPlanet})
            </span>
          </div>
        </div>

        {recordedTrials.length === 0 ? (
          <div className="text-center py-4 text-slate-500 text-xs font-sans">
            Start the stopwatch and let the pendulum complete 10 or 20 oscillations, then click <strong>"Log Trial"</strong> to populate your experimental table.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px]">
                  <th className="py-1 px-2">Trial</th>
                  <th className="py-1 px-2">Length L (cm)</th>
                  <th className="py-1 px-2">Total Time (s)</th>
                  <th className="py-1 px-2">Period T (s)</th>
                  <th className="py-1 px-2">T² (s²)</th>
                  <th className="py-1 px-2 text-emerald-400">Calculated g (m/s²)</th>
                </tr>
              </thead>
              <tbody>
                {recordedTrials.map((t, idx) => (
                  <tr key={t.id} className="border-b border-slate-800/50 hover:bg-slate-900/40">
                    <td className="py-1.5 px-2 text-slate-500">#{idx + 1}</td>
                    <td className="py-1.5 px-2 text-white font-bold">{t.lengthCm}</td>
                    <td className="py-1.5 px-2 text-slate-300">{t.t20}</td>
                    <td className="py-1.5 px-2 text-cyan-300">{t.periodT}</td>
                    <td className="py-1.5 px-2 text-amber-300">{t.tSquared}</td>
                    <td className="py-1.5 px-2 text-emerald-400 font-bold">{t.calculatedG}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
