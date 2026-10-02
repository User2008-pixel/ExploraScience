import React, { useState } from 'react';
import { Formula } from '../common/Formula';
import { Dna, Check } from 'lucide-react';

interface GeneticsSimProps {
  seedShapeDominance: number; // 0: fully recessive (rr), 1: heterozygous (Rr), 2: homozygous dominant (RR)
  seedColorDominance: number; // 0: green (yy), 1: heterozygous (Yy), 2: homozygous yellow (YY)
}

const GAMETES = ['RY', 'Ry', 'rY', 'ry'];

export const GeneticsSim: React.FC<GeneticsSimProps> = ({
  seedShapeDominance,
  seedColorDominance,
}) => {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  // Generate 4x4 Punnett grid
  const punnettGrid = GAMETES.map((gRow) =>
    GAMETES.map((gCol) => {
      // Sort alleles
      const rAlleles = [gRow[0], gCol[0]].sort().join(''); // 'RR', 'Rr', or 'rr'
      const yAlleles = [gRow[1], gCol[1]].sort().join(''); // 'YY', 'Yy', or 'yy'
      const genotype = `${rAlleles}${yAlleles}`;

      const isRound = rAlleles.includes('R');
      const isYellow = yAlleles.includes('Y');

      const phenotype = `${isRound ? 'Round' : 'Wrinkled'} & ${isYellow ? 'Yellow' : 'Green'}`;
      const colorHex = isYellow ? (isRound ? '#eab308' : '#ca8a04') : isRound ? '#10b981' : '#047857';

      return {
        rowGamete: gRow,
        colGamete: gCol,
        genotype,
        phenotype,
        colorHex,
        isRound,
        isYellow,
      };
    })
  );

  // Calculate phenotype totals out of 16
  let countRY = 0; // Round Yellow
  let countRy = 0; // Round Green
  let countrY = 0; // Wrinkled Yellow
  let country = 0; // Wrinkled Green

  punnettGrid.forEach((row) => {
    row.forEach((cell) => {
      if (cell.isRound && cell.isYellow) countRY++;
      else if (cell.isRound && !cell.isYellow) countRy++;
      else if (!cell.isRound && cell.isYellow) countrY++;
      else country++;
    });
  });

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 p-6 overflow-hidden shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Dna className="w-4 h-4 text-cyan-400" />
            <h3 className="font-semibold text-slate-200 text-sm">
              Mendelian Dihybrid Cross Punnett Square: RrYy × RrYy
            </h3>
          </div>
          <span className="text-xs bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 px-3 py-1 rounded-full font-mono font-bold">
            Law of Independent Assortment
          </span>
        </div>

        {/* 4x4 Punnett Grid Layout */}
        <div className="overflow-x-auto">
          <div className="min-w-[420px] max-w-lg mx-auto bg-slate-950 p-4 rounded-2xl border border-slate-800">
            {/* Column Headers (Paternal Gametes) */}
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono font-bold mb-2">
              <div className="text-slate-500 flex items-center justify-center">♀ \ ♂</div>
              {GAMETES.map((g) => (
                <div key={g} className="bg-slate-900 py-1.5 rounded-lg border border-slate-800 text-cyan-300">
                  {g}
                </div>
              ))}
            </div>

            {/* Rows */}
            {punnettGrid.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-5 gap-2 text-center text-xs font-mono mb-2">
                {/* Row Header (Maternal Gamete) */}
                <div className="bg-slate-900 flex items-center justify-center font-bold text-amber-300 rounded-lg border border-slate-800">
                  {GAMETES[rIdx]}
                </div>

                {/* Zygote Cells */}
                {row.map((cell, cIdx) => {
                  const cellKey = `${rIdx}-${cIdx}`;
                  const isSel = selectedCell === cellKey;
                  return (
                    <button
                      key={cellKey}
                      onClick={() => setSelectedCell(cellKey)}
                      className={`p-2 rounded-lg border transition flex flex-col items-center justify-center ${
                        isSel
                          ? 'border-cyan-400 bg-cyan-950 text-white shadow-lg'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold text-white tracking-wider">{cell.genotype}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full mt-1 inline-block"
                        style={{ backgroundColor: cell.colorHex }}
                      />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Phenotypic Ratio Summary */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-amber-400 block font-semibold">Round & Yellow</span>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{countRY} / 16</div>
            <span className="text-[10px] text-slate-500">Expected: 9/16 (56.25%)</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-emerald-400 block font-semibold">Round & Green</span>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{countRy} / 16</div>
            <span className="text-[10px] text-slate-500">Expected: 3/16 (18.75%)</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-yellow-300 block font-semibold">Wrinkled & Yellow</span>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{countrY} / 16</div>
            <span className="text-[10px] text-slate-500">Expected: 3/16 (18.75%)</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-emerald-600 block font-semibold">Wrinkled & Green</span>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{country} / 16</div>
            <span className="text-[10px] text-slate-500">Expected: 1/16 (6.25%)</span>
          </div>
        </div>
      </div>

      {/* KaTeX Mendelian Laws */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Mendelian Principles</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Classical Dihybrid Ratio</div>
            <Formula tex="9 : 3 : 3 : 1 \quad (\text{Phenotypic Distribution})" />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Law of Independent Assortment</div>
            <Formula tex="P(RY) = P(R) \\times P(Y) = \\frac{3}{4} \\times \\frac{3}{4} = \\frac{9}{16}" />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Double Recessive Probability</div>
            <Formula tex="P(rryy) = \\frac{1}{4} \\times \\frac{1}{4} = \\frac{1}{16} = 6.25\\%" />
          </div>
        </div>
      </div>
    </div>
  );
};
