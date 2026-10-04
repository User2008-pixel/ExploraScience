import React, { useState } from 'react';
import { Eye, Sliders, CheckCircle2, RotateCcw, Sparkles, Layers } from 'lucide-react';

interface StageCount {
  interphase: number;
  prophase: number;
  metaphase: number;
  anaphase: number;
  telophase: number;
}

export const MitosisRootTipSim: React.FC = () => {
  const [magnification, setMagnification] = useState<'10x' | '40x' | '100x'>('40x');
  const [focusLevel, setFocusLevel] = useState<number>(95); // 0 to 100%
  const [highlightStage, setHighlightStage] = useState<string>('all');
  const [counts, setCounts] = useState<StageCount>({
    interphase: 38,
    prophase: 6,
    metaphase: 4,
    anaphase: 2,
    telophase: 3,
  });

  const totalDividing = counts.prophase + counts.metaphase + counts.anaphase + counts.telophase;
  const totalCells = counts.interphase + totalDividing;
  const mitoticIndex = Number(((totalDividing / totalCells) * 100).toFixed(1));

  // Blur based on focus: optimum at 90-100%
  const blurPx = Math.abs(focusLevel - 95) * 0.08;

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">
              Mitosis in Onion (*Allium cepa*) Root Tip
            </h3>
            <p className="text-xs text-slate-400">
              Compound microscope squash preparation stained with acetocarmine / aceto-orcein
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-pink-300 bg-pink-950/60 px-3 py-1 rounded-xl border border-pink-800/60 font-bold">
            Microscopic Cytological Examination
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Virtual Microscope Eyepiece Viewport */}
        <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-5 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
          <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-mono text-pink-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-ping"></span>
            <span>CIRCULAR MICROSCOPE FIELD OF VIEW ({magnification})</span>
          </div>

          {/* Microscope circular field */}
          <div
            className="w-64 h-64 rounded-full border-4 border-slate-700 bg-[#380b22] relative overflow-hidden shadow-2xl flex items-center justify-center select-none"
            style={{ filter: `blur(${blurPx}px)` }}
          >
            <svg viewBox="0 0 240 240" className="w-full h-full">
              {/* Grid of rectangular onion root meristematic cells */}
              {Array.from({ length: 5 }).map((_, row) =>
                Array.from({ length: 5 }).map((_, col) => {
                  const cx = 35 + col * 42;
                  const cy = 35 + row * 42;
                  const cellId = row * 5 + col;

                  // Designate specific cells as mitotic stages
                  const isMetaphase = cellId === 12 || cellId === 7;
                  const isAnaphase = cellId === 17;
                  const isProphase = cellId === 8 || cellId === 18;
                  const isTelophase = cellId === 13;
                  const isInterphase = !isMetaphase && !isAnaphase && !isProphase && !isTelophase;

                  return (
                    <g key={cellId}>
                      {/* Cell wall border */}
                      <rect
                        x={cx - 19}
                        y={cy - 19}
                        width="38"
                        height="38"
                        fill="#500724"
                        stroke="#be185d"
                        strokeWidth="1.2"
                      />

                      {/* Cytoplasm */}
                      <rect x={cx - 18} y={cy - 18} width="36" height="36" fill="#831843" fillOpacity="0.4" />

                      {/* Mitotic Chromosomes */}
                      {isInterphase && (
                        <circle cx={cx} cy={cy} r="10" fill="#f43f5e" fillOpacity="0.6" stroke="#fda4af" strokeWidth="0.8" />
                      )}

                      {isProphase && (
                        <g>
                          <circle cx={cx} cy={cy} r="12" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" />
                          <path d={`M ${cx - 6},${cy - 6} Q ${cx},${cy} ${cx + 6},${cy + 6}`} stroke="#ffe4e6" strokeWidth="2" fill="none" />
                          <path d={`M ${cx + 6},${cy - 6} Q ${cx},${cy} ${cx - 6},${cy + 6}`} stroke="#ffe4e6" strokeWidth="2" fill="none" />
                        </g>
                      )}

                      {isMetaphase && (
                        <g>
                          {/* Chromosomes tightly aligned along equator */}
                          <line x1={cx} y1={cy - 12} x2={cx} y2={cy + 12} stroke="#fb7185" strokeWidth="4" />
                          <circle cx={cx} cy={cy} r="2.5" fill="#facc15" />
                        </g>
                      )}

                      {isAnaphase && (
                        <g>
                          {/* Two sets of V-shaped sister chromatids pulling apart */}
                          <path d={`M ${cx - 8},${cy - 8} L ${cx - 12},${cy} L ${cx - 8},${cy + 8}`} stroke="#fb7185" strokeWidth="2.5" fill="none" />
                          <path d={`M ${cx + 8},${cy - 8} L ${cx + 12},${cy} L ${cx + 8},${cy + 8}`} stroke="#fb7185" strokeWidth="2.5" fill="none" />
                        </g>
                      )}

                      {isTelophase && (
                        <g>
                          {/* Two reforming daughter nuclei with cell plate */}
                          <circle cx={cx - 7} cy={cy} r="5" fill="#f43f5e" fillOpacity="0.8" />
                          <circle cx={cx + 7} cy={cy} r="5" fill="#f43f5e" fillOpacity="0.8" />
                          <line x1={cx} y1={cy - 14} x2={cx} y2={cy + 14} stroke="#ffffff" strokeWidth="1" strokeDasharray="2 2" />
                        </g>
                      )}
                    </g>
                  );
                })
              )}
            </svg>
          </div>

          <div className="w-full text-xs font-mono text-slate-300 mt-3 px-4 py-2 bg-slate-950/90 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-pink-400 font-bold">Total Counted: {totalCells} Cells</span>
            <span className="text-amber-400 font-bold">Dividing: {totalDividing}</span>
            <span className="text-emerald-400 font-bold">Mitotic Index = {mitoticIndex}%</span>
          </div>
        </div>

        {/* Controls & Stages Counter */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <h4 className="font-bold text-pink-400 font-mono text-sm uppercase">Microscope Controls</h4>

          <div>
            <span className="text-xs text-slate-400 mb-1.5 block font-mono">Objective Lens:</span>
            <div className="flex gap-2">
              {(['10x', '40x', '100x'] as const).map((mag) => (
                <button
                  key={mag}
                  onClick={() => setMagnification(mag)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition ${
                    magnification === mag
                      ? 'bg-pink-500 text-slate-950 border-pink-400 font-bold shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {mag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-mono">
              <span className="text-slate-300">Fine Focus Knob:</span>
              <span className="text-pink-400 font-bold">{focusLevel}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="100"
              value={focusLevel}
              onChange={(e) => setFocusLevel(Number(e.target.value))}
              className="w-full accent-pink-500 cursor-pointer"
            />
          </div>

          {/* Mitotic Stages Counts Table */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-300 font-mono">Cell Counts &amp; Mitotic Index:</span>
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-2 text-xs font-mono space-y-1">
              <div className="flex justify-between p-1 rounded bg-slate-900/50">
                <span className="text-slate-400">Interphase (Resting):</span>
                <span className="text-slate-200 font-bold">{counts.interphase}</span>
              </div>
              <div className="flex justify-between p-1 rounded bg-slate-900/50">
                <span className="text-cyan-400">Prophase:</span>
                <span className="text-cyan-300 font-bold">{counts.prophase}</span>
              </div>
              <div className="flex justify-between p-1 rounded bg-slate-900/50">
                <span className="text-amber-400">Metaphase (Equator):</span>
                <span className="text-amber-300 font-bold">{counts.metaphase}</span>
              </div>
              <div className="flex justify-between p-1 rounded bg-slate-900/50">
                <span className="text-emerald-400">Anaphase (Pole Migration):</span>
                <span className="text-emerald-300 font-bold">{counts.anaphase}</span>
              </div>
              <div className="flex justify-between p-1 rounded bg-slate-900/50">
                <span className="text-purple-400">Telophase (Cell Plate):</span>
                <span className="text-purple-300 font-bold">{counts.telophase}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
            <div className="font-bold text-pink-400 font-mono">Formula:</div>
            <p className="text-pink-200 font-mono">
              Mitotic Index (%) = (Dividing Cells / Total Cells) × 100 = ({totalDividing} / {totalCells}) × 100 = {mitoticIndex}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
