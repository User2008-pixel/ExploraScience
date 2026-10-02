import React, { useState } from 'react';
import { Volume2, RotateCcw, Play, Pause, Sparkles, CheckCircle2 } from 'lucide-react';

interface SonometerSimProps {
  tuningForkFreqHz?: number; // e.g. 256 Hz or 512 Hz
}

export const SonometerSim: React.FC<SonometerSimProps> = ({
  tuningForkFreqHz = 256,
}) => {
  // Wire tension mass in kg (0.5 kg to 4.0 kg)
  const [loadMassKg, setLoadMassKg] = useState<number>(2.0); // T = M * 9.8 N
  // Knife-edge bridge B position (distance l from Bridge A in cm: 10 cm to 80 cm)
  const [bridgeLengthCm, setBridgeLengthCm] = useState<number>(35.0);
  const [isForkVibrating, setIsForkVibrating] = useState<boolean>(false);
  const [riderEjected, setRiderEjected] = useState<boolean>(false);

  // Wire properties (Steel wire):
  // Linear mass density m = 0.0018 kg/m
  const linearMassDensityM = 0.0018; // kg/m
  const tensionN = loadMassKg * 9.80; // Newtons
  const lengthM = bridgeLengthCm / 100;

  // Natural fundamental frequency n = (1 / 2l) * sqrt(T / m)
  const naturalFrequencyHz = (1 / (2 * lengthM)) * Math.sqrt(tensionN / linearMassDensityM);

  // Resonance condition: Natural frequency matches tuning fork frequency within 4 Hz
  const freqDifference = Math.abs(naturalFrequencyHz - tuningForkFreqHz);
  const isResonating = freqDifference < 4.5;

  // Ideal resonating length l_ideal = (1 / 2n) * sqrt(T / m)
  const idealResonatingLengthCm = (1 / (2 * tuningForkFreqHz)) * Math.sqrt(tensionN / linearMassDensityM) * 100;

  const handleStrikeFork = () => {
    setIsForkVibrating(true);
    if (isResonating) {
      setTimeout(() => setRiderEjected(true), 700);
    }
    setTimeout(() => setIsForkVibrating(false), 3000);
  };

  const handleResetRider = () => {
    setRiderEjected(false);
  };

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
              Sonometer Apparatus: Laws of Vibrating Stretched Strings
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            n = (1 / 2l) √(T / m). Strike tuning fork and slide bridge B until paper rider flies off at resonance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tuning Fork Frequency Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-900 px-3 py-1 rounded-xl border border-slate-800 font-mono">
            <span className="text-slate-400">Tuning Fork:</span>
            <span className="text-cyan-300 font-bold">{tuningForkFreqHz} Hz</span>
          </div>

          <button
            onClick={handleStrikeFork}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition ${
              isForkVibrating
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isForkVibrating ? 'Vibrating on Soundboard...' : 'Strike Tuning Fork'}</span>
          </button>
        </div>
      </div>

      {/* SVG Sonometer Apparatus View */}
      <div className="relative bg-gradient-to-b from-[#0e172a] to-[#070b14] border border-slate-800 rounded-xl p-4 overflow-hidden">
        <svg viewBox="0 0 760 210" className="w-full h-auto select-none font-mono">
          {/* Wooden Resonator Box */}
          <rect x="40" y="70" width="620" height="95" fill="#1c1917" stroke="#44403c" strokeWidth="2" rx="4" />
          {/* Sound holes in soundboard */}
          <ellipse cx="200" cy="118" rx="8" ry="14" fill="#0c0a09" stroke="#78716c" strokeWidth="1" />
          <ellipse cx="500" cy="118" rx="8" ry="14" fill="#0c0a09" stroke="#78716c" strokeWidth="1" />

          {/* Fixed Peg on Left */}
          <circle cx="55" cy="70" r="5" fill="#64748b" />

          {/* Frictionless Pulley on Right */}
          <circle cx="675" cy="70" r="14" fill="#475569" stroke="#334155" strokeWidth="2" />
          <circle cx="675" cy="70" r="4" fill="#94a3b8" />

          {/* Knife-Edge Bridge A (Fixed at 100 px on scale) */}
          <polygon points="120,70 112,85 128,85" fill="#f59e0b" />
          <text x="120" y="98" fill="#f59e0b" fontSize="8" textAnchor="middle">Bridge A</text>

          {/* Knife-Edge Bridge B (Movable along scale) */}
          {(() => {
            const bridgeX = 120 + (bridgeLengthCm / 80) * 450;
            const midAntinodeX = (120 + bridgeX) / 2;
            return (
              <g>
                {/* Bridge B Wedge */}
                <polygon points={`${bridgeX},70 ${bridgeX - 8},85 ${bridgeX + 8},85`} fill="#0ea5e9" />
                <text x={bridgeX} y="98" fill="#38bdf8" fontSize="8" textAnchor="middle">Bridge B</text>

                {/* Stretched Wire line between bridges */}
                <line x1="55" y1="70" x2="675" y2="70" stroke="#f1f5f9" strokeWidth="2" />

                {/* Hanging weight hanger past pulley */}
                <line x1="689" y1="70" x2="689" y2="160" stroke="#f1f5f9" strokeWidth="1.5" />
                <rect x="674" y="160" width="30" height="30" fill="#334155" stroke="#64748b" rx="2" />
                <text x="689" y="180" fill="#fde047" fontSize="9" fontWeight="bold" textAnchor="middle">
                  {loadMassKg} kg
                </text>

                {/* Paper Rider (inverted V-shape on midpoint antinode) */}
                {!riderEjected ? (
                  <g transform={`translate(${midAntinodeX}, 70)`}>
                    <polyline
                      points="-6,0 0,-12 6,0"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                      className={isForkVibrating && isResonating ? 'animate-bounce' : ''}
                    />
                    <text x="0" y="-16" fill="#f43f5e" fontSize="8" textAnchor="middle">Rider</text>
                  </g>
                ) : (
                  <g transform={`translate(${midAntinodeX + 25}, 145)`}>
                    <polyline points="-5,0 0,-10 5,0" fill="none" stroke="#f43f5e" strokeWidth="2" />
                    <text x="0" y="-12" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Rider Ejected! (Resonance)
                    </text>
                  </g>
                )}

                {/* Standing Wave Visualizer when vibrating */}
                {isForkVibrating && (
                  <path
                    d={`M 120 70 Q ${midAntinodeX} ${isResonating ? 55 : 66} ${bridgeX} 70 Q ${midAntinodeX} ${isResonating ? 85 : 74} 120 70`}
                    fill="#38bdf8"
                    fillOpacity={isResonating ? 0.35 : 0.1}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                  />
                )}
              </g>
            );
          })()}
        </svg>

        {/* Status indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {riderEjected && (
            <button
              onClick={handleResetRider}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replace Paper Rider</span>
            </button>
          )}

          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 ${
              isResonating
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900/90 text-slate-400 border-slate-800'
            }`}
          >
            {isResonating ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ACOUSTIC RESONANCE (Frequency Matched!)</span>
              </>
            ) : (
              <span>Δf = {freqDifference.toFixed(1)} Hz (Slide Bridge B)</span>
            )}
          </div>
        </div>
      </div>

      {/* Controls: Bridge B Slider & Wire Tension Slotted Weights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold">Resonating Length (l):</span>
            <span className="font-mono font-bold text-cyan-300">{bridgeLengthCm.toFixed(1)} cm</span>
          </div>
          <input
            type="range"
            min="15"
            max="70"
            step="0.5"
            value={bridgeLengthCm}
            onChange={(e) => setBridgeLengthCm(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>15 cm</span>
            <span>Ideal: {idealResonatingLengthCm.toFixed(1)} cm</span>
            <span>70 cm</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold">Tension Load (T = Mg):</span>
            <span className="font-mono font-bold text-amber-300">{loadMassKg} kg ({tensionN.toFixed(1)} N)</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[1.0, 1.5, 2.0, 2.5, 3.0].map((mass) => (
              <button
                key={mass}
                onClick={() => setLoadMassKg(mass)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition border ${
                  loadMassKg === mass
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                {mass} kg
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Physics Breakdown */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
            Standing Wave Law of Stretched Strings:
          </span>
          <span className="text-cyan-300 font-bold">
            n = (1 / 2l) √(T / m) = {naturalFrequencyHz.toFixed(1)} Hz (Tuning Fork = {tuningForkFreqHz} Hz)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">1. Wire Tension (T):</span>
            <span className="text-amber-300 font-bold text-sm">{tensionN.toFixed(1)} N</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">T = {loadMassKg} kg × 9.8 m/s²</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">2. Linear Density (m):</span>
            <span className="text-purple-300 font-bold text-sm">0.0018 kg/m</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Steel wire mass per unit length</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">3. Resonating Length (l):</span>
            <span className="text-emerald-400 font-bold text-sm">{bridgeLengthCm.toFixed(1)} cm</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">n × l = constant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
