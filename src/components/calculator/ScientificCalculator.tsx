import React, { useState } from 'react';
import { compileExpression, PHYSICAL_CONSTANTS, PhysicalConstant } from '../../utils/mathParser';
import { Formula } from '../common/Formula';
import {
  RotateCcw,
  Delete,
  Copy,
  Check,
  History,
  Sparkles,
  Calculator as CalcIcon,
  Atom,
} from 'lucide-react';

export const ScientificCalculator: React.FC = () => {
  const [displayExpr, setDisplayExpr] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [isRadians, setIsRadians] = useState<boolean>(true);
  const [history, setHistory] = useState<{ expr: string; res: string }[]>([
    { expr: '2 * pi * 5', res: '31.4159' },
    { expr: 'sqrt(9.8^2 + 12^2)', res: '15.4932' },
  ]);
  const [copied, setCopied] = useState(false);
  const [activeConstCategory, setActiveConstCategory] = useState<'all' | 'physics' | 'chemistry'>('all');

  const insertText = (str: string) => {
    setDisplayExpr((prev) => prev + str);
  };

  const handleClear = () => {
    setDisplayExpr('');
    setResult('0');
  };

  const handleBackspace = () => {
    setDisplayExpr((prev) => prev.slice(0, -1));
  };

  const handleEvaluate = () => {
    if (!displayExpr.trim()) return;
    try {
      const evalFn = compileExpression(displayExpr);
      const val = evalFn({ isRadians });
      if (isNaN(val) || !isFinite(val)) {
        setResult('Error / Undefined');
      } else {
        const formatted = Number.isInteger(val) ? val.toString() : Number(val.toPrecision(8)).toString();
        setResult(formatted);
        setHistory((prev) => [{ expr: displayExpr, res: formatted }, ...prev.slice(0, 9)]);
      }
    } catch {
      setResult('Syntax Error');
    }
  };

  const insertConstant = (c: PhysicalConstant) => {
    insertText(c.value.toString());
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredConstants = PHYSICAL_CONSTANTS.filter(
    (c) => activeConstCategory === 'all' || c.category === activeConstCategory || c.category === 'universal'
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Cols: Main Calculator Unit */}
      <div className="lg:col-span-2 space-y-4">
        {/* Display Screen */}
        <div className="bg-[#060B18] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRadians(true)}
                className={`px-2 py-0.5 rounded font-bold ${
                  isRadians ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-500'
                }`}
              >
                RAD
              </button>
              <button
                onClick={() => setIsRadians(false)}
                className={`px-2 py-0.5 rounded font-bold ${
                  !isRadians ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-slate-500'
                }`}
              >
                DEG
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={copyResult}
                className="hover:text-white transition flex items-center gap-1 text-[11px]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Active Expression Input */}
          <div className="min-h-[32px] text-right font-mono text-slate-300 text-lg overflow-x-auto whitespace-nowrap">
            {displayExpr || <span className="text-slate-600">0</span>}
          </div>

          {/* Big Result Output */}
          <div className="text-right font-mono text-3xl font-extrabold text-cyan-400 tracking-tight overflow-x-auto whitespace-nowrap pt-1">
            = {result}
          </div>
        </div>

        {/* Scientific Keypad */}
        <div className="bg-[#131E36] p-5 rounded-2xl border border-slate-800 grid grid-cols-5 gap-2 select-none shadow-lg text-sm font-mono">
          {/* Quick Row 0: Modulus & Operations */}
          <button
            onClick={() => insertText('mod(')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-slate-800 font-bold transition"
            title="Modulus / Remainder: mod(a, b) or mod(x)"
          >
            mod
          </button>
          <button
            onClick={() => insertText('|')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-slate-800 font-bold transition"
            title="Modulus / Absolute value |x|"
          >
            |x|
          </button>
          <button
            onClick={() => insertText('^2')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            x²
          </button>
          <button
            onClick={() => insertText('10^(')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            10ˣ
          </button>
          <button
            onClick={() => insertText(' % ')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-slate-800 transition"
            title="Modulo operator"
          >
            %
          </button>

          {/* Row 1: Advanced Functions */}
          <button
            onClick={() => insertText('sin(')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            sin
          </button>
          <button
            onClick={() => insertText('cos(')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            cos
          </button>
          <button
            onClick={() => insertText('tan(')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            tan
          </button>
          <button
            onClick={() => insertText('pi')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-slate-800 transition"
          >
            π
          </button>
          <button
            onClick={handleClear}
            className="p-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold transition"
          >
            AC
          </button>

          {/* Row 2: Inverses & Powers */}
          <button
            onClick={() => insertText('asin(')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            sin⁻¹
          </button>
          <button
            onClick={() => insertText('acos(')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            cos⁻¹
          </button>
          <button
            onClick={() => insertText('atan(')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            tan⁻¹
          </button>
          <button
            onClick={() => insertText('e')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-slate-800 transition"
          >
            e
          </button>
          <button
            onClick={handleBackspace}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center justify-center"
          >
            <Delete className="w-4 h-4" />
          </button>

          {/* Row 3: Log & Roots */}
          <button
            onClick={() => insertText('ln(')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            ln
          </button>
          <button
            onClick={() => insertText('log(')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            log₁₀
          </button>
          <button
            onClick={() => insertText('sqrt(')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            √x
          </button>
          <button
            onClick={() => insertText('(')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            (
          </button>
          <button
            onClick={() => insertText(')')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            )
          </button>

          {/* Row 4: Numbers & Exponent */}
          <button
            onClick={() => insertText('^')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            xʸ
          </button>
          <button
            onClick={() => insertText('7')}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-bold border border-slate-800 transition"
          >
            7
          </button>
          <button
            onClick={() => insertText('8')}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-bold border border-slate-800 transition"
          >
            8
          </button>
          <button
            onClick={() => insertText('9')}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-bold border border-slate-800 transition"
          >
            9
          </button>
          <button
            onClick={() => insertText('/')}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold border border-slate-700 transition"
          >
            ÷
          </button>

          {/* Row 5: Numbers & Mult */}
          <button
            onClick={() => insertText('^2')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            x²
          </button>
          <button
            onClick={() => insertText('4')}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-bold border border-slate-800 transition"
          >
            4
          </button>
          <button
            onClick={() => insertText('5')}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-bold border border-slate-800 transition"
          >
            5
          </button>
          <button
            onClick={() => insertText('6')}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-bold border border-slate-800 transition"
          >
            6
          </button>
          <button
            onClick={() => insertText('*')}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold border border-slate-700 transition"
          >
            ×
          </button>

          {/* Row 6: Numbers & Minus */}
          <button
            onClick={() => insertText('exp(')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            eˣ
          </button>
          <button
            onClick={() => insertText('1')}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-bold border border-slate-800 transition"
          >
            1
          </button>
          <button
            onClick={() => insertText('2')}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-bold border border-slate-800 transition"
          >
            2
          </button>
          <button
            onClick={() => insertText('3')}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-bold border border-slate-800 transition"
          >
            3
          </button>
          <button
            onClick={() => insertText('-')}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold border border-slate-700 transition"
          >
            −
          </button>

          {/* Row 7: Zero & Evaluate */}
          <button
            onClick={() => insertText('abs(')}
            className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
          >
            |x|
          </button>
          <button
            onClick={() => insertText('0')}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-bold border border-slate-800 transition"
          >
            0
          </button>
          <button
            onClick={() => insertText('.')}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-white font-bold border border-slate-800 transition"
          >
            .
          </button>
          <button
            onClick={handleEvaluate}
            className="col-span-2 p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-base transition shadow-md"
          >
            = EVALUATE
          </button>
        </div>
      </div>

      {/* Right Col: STEM Physical Constants & Tape */}
      <div className="space-y-4">
        {/* Physical Constants Card */}
        <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Atom className="w-3.5 h-3.5 text-cyan-400" />
              STEM Constants
            </h3>

            <div className="flex items-center gap-1 text-[10px]">
              <button
                onClick={() => setActiveConstCategory('all')}
                className={`px-1.5 py-0.5 rounded ${activeConstCategory === 'all' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveConstCategory('physics')}
                className={`px-1.5 py-0.5 rounded ${activeConstCategory === 'physics' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              >
                Physics
              </button>
              <button
                onClick={() => setActiveConstCategory('chemistry')}
                className={`px-1.5 py-0.5 rounded ${activeConstCategory === 'chemistry' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
              >
                Chem
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">Click any constant to insert its numeric value into your calculation:</p>

          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {filteredConstants.map((c) => (
              <div
                key={c.symbol}
                onClick={() => insertConstant(c)}
                className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between text-xs transition"
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-cyan-300">{c.symbol}</span>
                    <span className="text-[11px] text-slate-300">{c.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{c.unit}</span>
                </div>
                <span className="font-mono text-emerald-400 text-xs">{c.displayValue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation History Card */}
        <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-amber-400" />
              Calculation Tape
            </h3>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-[11px] text-slate-400 hover:text-rose-400"
              >
                Clear
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-slate-500 italic p-3 text-center">No calculations logged yet.</p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setDisplayExpr(h.res);
                    setResult(h.res);
                  }}
                  className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 cursor-pointer text-xs font-mono transition"
                >
                  <div className="text-slate-400 truncate">{h.expr}</div>
                  <div className="text-emerald-400 font-bold text-right">= {h.res}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
