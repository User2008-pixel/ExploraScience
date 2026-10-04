import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Droplets, Sparkles, CheckCircle2, Clock, Thermometer, Activity } from 'lucide-react';

interface KineticsTrial {
  id: string;
  volumeThioMl: number;
  volumeWaterMl: number;
  tempC: number;
  timeSeconds: number;
  rateInverseTime: number;
}

export const ThiosulfateKineticsSim: React.FC = () => {
  // Reaction Parameters
  const [concThioM, setConcThioM] = useState<number>(0.1); // 0.02 to 0.1 M
  const [tempC, setTempC] = useState<number>(25); // 20 to 60 °C
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [trials, setTrials] = useState<KineticsTrial[]>([]);

  // Theoretical disappearance time based on Arrhenius and concentration:
  // t is inversely proportional to [Na2S2O3] and decreases by ~2x for every 10 deg rise
  // At 0.1 M and 25°C, t ~ 24s.
  // At 0.02 M and 25°C, t ~ 120s.
  const tempFactor = Math.pow(1.8, (tempC - 25) / 10);
  const targetDisappearanceTime = Math.round((2.4 / (concThioM * tempFactor)) * 10) / 10;

  // Turbidity progress: 0 (clear) to 1 (cross completely invisible)
  const turbidity = Math.min(1, elapsedTime / targetDisappearanceTime);
  const isCrossDisappeared = turbidity >= 1;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && !isCrossDisappeared) {
      timer = setInterval(() => {
        setElapsedTime((prev) => {
          const next = Number((prev + 0.1).toFixed(1));
          if (next >= targetDisappearanceTime) {
            setIsRunning(false);
            return targetDisappearanceTime;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isRunning, isCrossDisappeared, targetDisappearanceTime]);

  const handleStartReaction = () => {
    setElapsedTime(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };

  const handleLogObservation = () => {
    if (elapsedTime <= 0) return;
    const newTrial: KineticsTrial = {
      id: `trial-${Date.now()}`,
      volumeThioMl: Math.round(concThioM * 500),
      volumeWaterMl: Math.round(50 - concThioM * 500),
      tempC,
      timeSeconds: elapsedTime,
      rateInverseTime: Number((1 / elapsedTime).toFixed(4)),
    };
    setTrials((prev) => [...prev.slice(-4), newTrial]);
  };

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">
              Kinetics of Sodium Thiosulfate &amp; Hydrochloric Acid
            </h3>
            <p className="text-xs text-slate-400">
              Na₂S₂O₃(aq) + 2HCl(aq) ➔ 2NaCl(aq) + SO₂(g) + S↓ (colloidal yellow) + H₂O(l)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-amber-300 bg-amber-950/60 px-3 py-1 rounded-xl border border-amber-800/60 font-bold">
            Optical Disappearance Method
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Virtual Apparatus: Conical flask on cross tile */}
        <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-5 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
          <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-amber-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            <span>TOP-DOWN VIEW INTO CONICAL FLASK OVER BLACK 'X' TILE</span>
          </div>

          <svg viewBox="0 0 320 260" className="w-full max-w-[280px] h-64 select-none">
            {/* White Glazed Tile Base */}
            <rect x="40" y="20" width="240" height="220" rx="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />

            {/* Black Cross 'X' on Tile */}
            <line x1="80" y1="50" x2="240" y2="210" stroke="#020617" strokeWidth="8" strokeLinecap="round" />
            <line x1="240" y1="50" x2="80" y2="210" stroke="#020617" strokeWidth="8" strokeLinecap="round" />

            {/* Glass Conical Flask Rim & Liquid Layer */}
            {/* Liquid with turbidity: shifts from clear transparent to opaque milky yellow */}
            <circle
              cx="160"
              cy="130"
              r="85"
              fill={isCrossDisappeared ? '#fef08a' : '#fef9c3'}
              fillOpacity={0.15 + turbidity * 0.85}
              stroke="#64748b"
              strokeWidth="4"
            />

            {/* Tiny precipitated sulfur particles floating in liquid */}
            {turbidity > 0.1 &&
              Array.from({ length: Math.round(turbidity * 30) }).map((_, i) => {
                const angle = (i * 137.5 * Math.PI) / 180;
                const r = ((i * 7) % 75);
                const px = 160 + Math.cos(angle) * r;
                const py = 130 + Math.sin(angle) * r;
                return (
                  <circle key={i} cx={px} cy={py} r="2" fill="#ca8a04" fillOpacity={0.7} />
                );
              })}

            {/* Flask Glass Reflection Highlights */}
            <ellipse cx="130" cy="90" rx="20" ry="10" fill="#ffffff" fillOpacity="0.4" transform="rotate(-30 130 90)" />

            {/* Cross Visibility Indicator Text */}
            <text x="160" y="235" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="bold" fontFamily="monospace">
              {isCrossDisappeared ? '✖ CROSS COMPLETELY OBSCURED' : `Cross Visibility: ${Math.round((1 - turbidity) * 100)}%`}
            </text>
          </svg>

          {/* Stopwatch Display */}
          <div className="flex items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-4 py-2.5 bg-slate-950/90 rounded-xl border border-slate-800">
            <span className="text-amber-400 font-bold">Stopwatch: {elapsedTime.toFixed(1)} s</span>
            <span className="text-cyan-400 font-bold">Target t = {targetDisappearanceTime} s</span>
            <span className="text-emerald-400 font-bold">1/t = {elapsedTime > 0 ? (1 / elapsedTime).toFixed(4) : '0.0000'} s⁻¹</span>
          </div>
        </div>

        {/* Controls & Graph */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <h4 className="font-bold text-amber-400 font-mono text-sm uppercase">Reaction Parameters</h4>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-slate-300">Na₂S₂O₃ Concentration:</span>
              <span className="text-amber-400 font-bold">{concThioM.toFixed(2)} M</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.10"
              step="0.02"
              value={concThioM}
              disabled={isRunning}
              onChange={(e) => setConcThioM(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5 font-mono">
              <span>0.02 M (Dilute)</span>
              <span>0.06 M</span>
              <span>0.10 M (Concentrated)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-slate-300">Temperature (T):</span>
              <span className="text-rose-400 font-bold">{tempC} °C</span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              step="5"
              value={tempC}
              disabled={isRunning}
              onChange={(e) => setTempC(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isRunning ? (
              <button
                onClick={handleStartReaction}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-slate-950 hover:bg-amber-400 transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Mix Reactants &amp; Start</span>
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-rose-500 text-white hover:bg-rose-600 transition flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Reaction</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-xl text-slate-400 bg-slate-950 border border-slate-800 hover:text-white transition"
              title="Reset Flask"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleLogObservation}
              disabled={elapsedTime <= 0}
              className="px-3 py-2.5 rounded-xl font-bold text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition disabled:opacity-40"
            >
              Record Run
            </button>
          </div>

          {/* Observation Table */}
          {trials.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-300 font-mono">Recorded Kinetic Runs:</span>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-x-auto text-[10px] font-mono">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="p-1">Run</th>
                      <th className="p-1">Na₂S₂O₃</th>
                      <th className="p-1">Temp</th>
                      <th className="p-1">Time (t)</th>
                      <th className="p-1 text-right">Rate (1/t)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trials.map((t, idx) => (
                      <tr key={t.id} className="text-slate-300 border-b border-slate-900">
                        <td className="p-1 font-bold text-amber-400">#{idx + 1}</td>
                        <td className="p-1">{t.volumeThioMl} mL</td>
                        <td className="p-1">{t.tempC}°C</td>
                        <td className="p-1">{t.timeSeconds}s</td>
                        <td className="p-1 text-right text-emerald-400 font-bold">{t.rateInverseTime} s⁻¹</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
