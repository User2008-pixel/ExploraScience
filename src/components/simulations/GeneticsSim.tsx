import React, { useState } from 'react';
import { Formula } from '../common/Formula';
import { Dna, Check, Sliders, Sparkles, RotateCcw, Shuffle } from 'lucide-react';

interface GeneticsSimProps {
  seedShapeDominance?: number;
  seedColorDominance?: number;
}

type ShapeAllelePair = 'RR' | 'Rr' | 'rr';
type ColorAllelePair = 'YY' | 'Yy' | 'yy';

export const GeneticsSim: React.FC<GeneticsSimProps> = () => {
  // Parent 1 (Maternal)
  const [p1Shape, setP1Shape] = useState<ShapeAllelePair>('Rr');
  const [p1Color, setP1Color] = useState<ColorAllelePair>('Yy');

  // Parent 2 (Paternal)
  const [p2Shape, setP2Shape] = useState<ShapeAllelePair>('Rr');
  const [p2Color, setP2Color] = useState<ColorAllelePair>('Yy');

  const [selectedCell, setSelectedCell] = useState<{
    genotype: string;
    phenotype: string;
    paternal: string;
    maternal: string;
  } | null>(null);

  // Derive Gametes for a parent genotype
  const getGametes = (shape: ShapeAllelePair, color: ColorAllelePair): string[] => {
    const sAlleles = shape.split('');
    const cAlleles = color.split('');
    const gList: string[] = [];
    sAlleles.forEach((s) => {
      cAlleles.forEach((c) => {
        gList.push(`${s}${c}`);
      });
    });
    return gList; // 4 gametes for standard 4x4 Punnett square
  };

  const maternalGametes = getGametes(p1Shape, p1Color);
  const paternalGametes = getGametes(p2Shape, p2Color);

  // Generate 4x4 Punnett grid
  const punnettGrid = maternalGametes.map((gRow) =>
    paternalGametes.map((gCol) => {
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

  // Phenotypic tally
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
              Live Mendelian Genetic Cross: ♀ ({p1Shape}{p1Color}) × ♂ ({p2Shape}{p2Color})
            </h3>
          </div>
          <span className="text-xs bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 px-3 py-1 rounded-full font-mono font-bold">
            Law of Independent Assortment & Segregation
          </span>
        </div>

        {/* 4x4 Punnett Grid Layout */}
        <div className="overflow-x-auto">
          <div className="min-w-[420px] max-w-lg mx-auto bg-slate-950 p-4 rounded-2xl border border-slate-800">
            {/* Column Headers (Paternal Gametes) */}
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono font-bold mb-2">
              <div className="text-slate-500 flex items-center justify-center">♀ \ ♂</div>
              {paternalGametes.map((g, idx) => (
                <div key={idx} className="bg-slate-900 py-1.5 rounded-lg border border-slate-800 text-cyan-300">
                  {g}
                </div>
              ))}
            </div>

            {/* Rows */}
            {punnettGrid.map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-5 gap-2 text-center text-xs font-mono mb-2">
                {/* Row Header (Maternal Gamete) */}
                <div className="bg-slate-900 flex items-center justify-center font-bold text-amber-300 rounded-lg border border-slate-800">
                  {maternalGametes[rIdx]}
                </div>

                {/* Zygote Cells */}
                {row.map((cell, cIdx) => {
                  const cellKey = `${rIdx}-${cIdx}`;
                  const isSel = selectedCell?.genotype === cell.genotype;
                  return (
                    <button
                      key={cellKey}
                      onClick={() =>
                        setSelectedCell({
                          genotype: cell.genotype,
                          phenotype: cell.phenotype,
                          paternal: cell.colGamete,
                          maternal: cell.rowGamete,
                        })
                      }
                      className={`p-2 rounded-lg border transition flex flex-col items-center justify-center ${
                        isSel
                          ? 'border-cyan-400 bg-cyan-950 text-white shadow-lg scale-105'
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

        {/* Selected Zygote Info Callout */}
        {selectedCell && (
          <div className="mt-3 p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl flex items-center justify-between text-xs">
            <div>
              <span className="text-cyan-300 font-bold font-mono">Offspring Genotype: {selectedCell.genotype}</span>
              <span className="text-slate-300 ml-2">({selectedCell.phenotype})</span>
            </div>
            <div className="text-slate-400 font-mono text-[11px]">
              Maternal: <span className="text-amber-400">{selectedCell.maternal}</span> • Paternal:{' '}
              <span className="text-cyan-400">{selectedCell.paternal}</span>
            </div>
          </div>
        )}

        {/* Phenotypic Ratio Summary */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-amber-400 block font-semibold">Round & Yellow</span>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{countRY} / 16</div>
            <span className="text-[10px] text-slate-500">{((countRY / 16) * 100).toFixed(1)}%</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-emerald-400 block font-semibold">Round & Green</span>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{countRy} / 16</div>
            <span className="text-[10px] text-slate-500">{((countRy / 16) * 100).toFixed(1)}%</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-yellow-300 block font-semibold">Wrinkled & Yellow</span>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{countrY} / 16</div>
            <span className="text-[10px] text-slate-500">{((countrY / 16) * 100).toFixed(1)}%</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[11px] text-emerald-600 block font-semibold">Wrinkled & Green</span>
            <div className="text-lg font-bold text-white font-mono mt-0.5">{country} / 16</div>
            <span className="text-[10px] text-slate-500">{((country / 16) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Parental Genotype Direct Manipulator */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Parental Genotype Manipulator
            </h4>
          </div>
          <span className="text-xs text-amber-400 font-mono font-bold bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded-full">
            Ratio: {countRY}:{countRy}:{countrY}:{country}
          </span>
        </div>

        {/* Parent 1 & Parent 2 Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Maternal Parent 1 */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-bold font-mono">♀ Maternal Parent 1 Genotype:</span>
              <span className="font-mono font-bold text-white bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                {p1Shape} {p1Color}
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400">Seed Shape Alleles:</span>
              <div className="grid grid-cols-3 gap-2">
                {(['RR', 'Rr', 'rr'] as ShapeAllelePair[]).map((pair) => (
                  <button
                    key={pair}
                    onClick={() => setP1Shape(pair)}
                    className={`py-1 rounded text-xs font-mono font-bold transition ${
                      p1Shape === pair
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pair} ({pair === 'rr' ? 'Wrinkled' : 'Round'})
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400">Seed Color Alleles:</span>
              <div className="grid grid-cols-3 gap-2">
                {(['YY', 'Yy', 'yy'] as ColorAllelePair[]).map((pair) => (
                  <button
                    key={pair}
                    onClick={() => setP1Color(pair)}
                    className={`py-1 rounded text-xs font-mono font-bold transition ${
                      p1Color === pair
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pair} ({pair === 'yy' ? 'Green' : 'Yellow'})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Paternal Parent 2 */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-300 font-bold font-mono">♂ Paternal Parent 2 Genotype:</span>
              <span className="font-mono font-bold text-white bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
                {p2Shape} {p2Color}
              </span>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400">Seed Shape Alleles:</span>
              <div className="grid grid-cols-3 gap-2">
                {(['RR', 'Rr', 'rr'] as ShapeAllelePair[]).map((pair) => (
                  <button
                    key={pair}
                    onClick={() => setP2Shape(pair)}
                    className={`py-1 rounded text-xs font-mono font-bold transition ${
                      p2Shape === pair
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pair} ({pair === 'rr' ? 'Wrinkled' : 'Round'})
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400">Seed Color Alleles:</span>
              <div className="grid grid-cols-3 gap-2">
                {(['YY', 'Yy', 'yy'] as ColorAllelePair[]).map((pair) => (
                  <button
                    key={pair}
                    onClick={() => setP2Color(pair)}
                    className={`py-1 rounded text-xs font-mono font-bold transition ${
                      p2Color === pair
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pair} ({pair === 'yy' ? 'Green' : 'Yellow'})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Cross Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 space-y-2">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
            NCERT Mendelian Cross Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setP1Shape('Rr');
                setP1Color('Yy');
                setP2Shape('Rr');
                setP2Color('Yy');
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 font-bold transition"
            >
              Classic F2 Dihybrid: RrYy × RrYy (9:3:3:1)
            </button>
            <button
              onClick={() => {
                setP1Shape('Rr');
                setP1Color('Yy');
                setP2Shape('rr');
                setP2Color('yy');
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800 transition"
            >
              Mendelian Testcross: RrYy × rryy (1:1:1:1)
            </button>
            <button
              onClick={() => {
                setP1Shape('RR');
                setP1Color('YY');
                setP2Shape('rr');
                setP2Color('yy');
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition"
            >
              True Breeding P1: RRYY × rryy (All RrYy)
            </button>
            <button
              onClick={() => {
                setP1Shape('Rr');
                setP1Color('YY');
                setP2Shape('Rr');
                setP2Color('YY');
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 transition"
            >
              Monohybrid F2: Rr × Rr (3:1)
            </button>
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
            <Formula tex="\Pr(R \cap Y) = \Pr(R) \times \Pr(Y) = \frac{3}{4} \times \frac{3}{4} = \frac{9}{16}" />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Test Cross Verification</div>
            <Formula tex="\text{RrYy} \times \text{rryy} \implies 1 : 1 : 1 : 1" />
          </div>
        </div>
      </div>
    </div>
  );
};
