import React, { useState } from 'react';
import { Zap, Play, RotateCcw, Activity } from 'lucide-react';

export const PNJunctionSim: React.FC = () => {
  const [biasMode, setBiasMode] = useState<'forward' | 'reverse'>('forward');
  const [voltageSupplyV, setVoltageSupplyV] = useState<number>(0.75); // 0 to 2V forward, 0 to 25V reverse

  // Silicon diode knee voltage ~ 0.7 V
  // Forward current: I = Is * (e^(V / Vt) - 1)
  let currentMa = 0;
  if (biasMode === 'forward') {
    if (voltageSupplyV < 0.5) currentMa = 0.05;
    else if (voltageSupplyV < 0.65) currentMa = 0.8;
    else if (voltageSupplyV < 0.7) currentMa = 2.5;
    else {
      currentMa = Number((2.5 + (voltageSupplyV - 0.7) * 45).toFixed(1));
    }
  } else {
    // Reverse bias: negligible reverse saturation current (~ microamperes) until breakdown
    currentMa = Number((0.002 * (voltageSupplyV / 10)).toFixed(4));
  }

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Semiconductor Diode V-I Characteristics</h3>
            <p className="text-xs text-slate-400">
              Forward and Reverse Bias V-I Curve &amp; Knee Voltage (Silicon = 0.7 V)
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-3 py-1 rounded-xl border border-purple-800/60 font-bold">
          Solid State Electronics
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Virtual Circuit & V-I Graph */}
        <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-5 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
          <svg viewBox="0 0 340 260" className="w-full max-w-[320px] h-64 select-none">
            {/* Graph Axes */}
            <line x1="170" y1="20" x2="170" y2="240" stroke="#475569" strokeWidth="1.5" />
            <line x1="20" y1="130" x2="320" y2="130" stroke="#475569" strokeWidth="1.5" />

            <text x="315" y="125" fill="#94a3b8" fontSize="8" textAnchor="end">+V (Forward V)</text>
            <text x="25" y="140" fill="#94a3b8" fontSize="8">-V (Reverse V)</text>
            <text x="175" y="25" fill="#94a3b8" fontSize="8">+I (mA)</text>
            <text x="175" y="235" fill="#94a3b8" fontSize="8">-I (μA)</text>

            {/* Knee Voltage threshold dotted line at 0.7V */}
            <line x1="240" y1="20" x2="240" y2="130" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" />
            <text x="240" y="142" fill="#f59e0b" fontSize="7" textAnchor="middle">0.7 V</text>

            {/* Forward Bias Exponential Curve */}
            <path
              d="M 170,130 Q 230,130 240,110 Q 248,60 252,30"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2.5"
            />

            {/* Reverse Bias Curve */}
            <path
              d="M 170,130 L 70,133 L 50,220"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
            />

            {/* Operating Point Cursor */}
            {biasMode === 'forward' ? (
              <circle
                cx={170 + Math.min(85, (voltageSupplyV / 1.0) * 85)}
                cy={130 - Math.min(105, (currentMa / 45) * 105)}
                r="5"
                fill="#facc15"
                className="animate-pulse"
              />
            ) : (
              <circle
                cx={170 - (voltageSupplyV / 25) * 100}
                cy="133"
                r="5"
                fill="#facc15"
                className="animate-pulse"
              />
            )}
          </svg>

          <div className="flex items-center justify-between w-full text-xs font-mono text-slate-300 mt-2 px-4 py-2 bg-slate-950/90 rounded-xl border border-slate-800">
            <span className="text-purple-400 font-bold">Bias: {biasMode.toUpperCase()}</span>
            <span className="text-cyan-400 font-bold">V_diode = {voltageSupplyV} V</span>
            <span className="text-emerald-400 font-bold">
              Current = {currentMa} {biasMode === 'forward' ? 'mA' : 'μA'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <h4 className="font-bold text-purple-400 font-mono text-sm uppercase">Biasing Controls</h4>

          <div>
            <span className="text-xs text-slate-400 mb-1.5 block font-mono">Biasing Direction:</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setBiasMode('forward');
                  setVoltageSupplyV(0.7);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                  biasMode === 'forward'
                    ? 'bg-purple-500 text-slate-950 border-purple-400 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Forward Bias (p➔+, n➔-)
              </button>
              <button
                onClick={() => {
                  setBiasMode('reverse');
                  setVoltageSupplyV(5.0);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                  biasMode === 'reverse'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Reverse Bias (p➔-, n➔+)
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-slate-300">Regulated Power Supply (V):</span>
              <span className="text-purple-400 font-bold">{voltageSupplyV} V</span>
            </div>
            <input
              type="range"
              min={biasMode === 'forward' ? 0 : 0}
              max={biasMode === 'forward' ? 1.5 : 25}
              step={biasMode === 'forward' ? 0.05 : 0.5}
              value={voltageSupplyV}
              onChange={(e) => setVoltageSupplyV(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="font-bold text-purple-400 font-mono">Dynamic Resistance (rd):</div>
            <p className="text-slate-300 font-mono">rd = ΔV / ΔI ≈ {biasMode === 'forward' && voltageSupplyV >= 0.7 ? '15.4 Ω' : '> 1 MΩ'}</p>
            <p className="text-slate-400 text-[10px]">
              In forward bias, current remains negligible until the potential barrier (0.7 V for Si) is overcome.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
