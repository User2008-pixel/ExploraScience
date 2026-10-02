import React from 'react';
import { Formula } from './Formula';
import { Minus, Plus, Info } from 'lucide-react';

interface VariableSliderProps {
  name: string;
  symbol: string; // KaTeX string, e.g. "v_0", "\\theta"
  unit: string;
  value: number;
  min: number;
  max: number;
  step: number;
  description?: string;
  onChange: (val: number) => void;
  accentColor?: string;
  disabled?: boolean;
}

export const VariableSlider: React.FC<VariableSliderProps> = ({
  name,
  symbol,
  unit,
  value,
  min,
  max,
  step,
  description,
  onChange,
  accentColor = 'text-cyan-400',
  disabled = false,
}) => {
  const handleDecrement = () => {
    const next = Math.max(min, Number((value - step).toFixed(3)));
    onChange(next);
  };

  const handleIncrement = () => {
    const next = Math.min(max, Number((value + step).toFixed(3)));
    onChange(next);
  };

  // Format display value cleanly
  const formattedVal = Number.isInteger(step) ? value.toFixed(0) : value >= 10 ? value.toFixed(1) : value.toFixed(2);

  return (
    <div className="bg-[#131E36]/90 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-all shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-slate-200">{name}</span>
          <span className="text-xs bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/60 font-mono">
            <Formula tex={symbol} inline />
          </span>
        </div>
        <div className="flex items-baseline gap-1 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800 font-mono text-sm">
          <span className={`font-bold ${accentColor}`}>{formattedVal}</span>
          <span className="text-xs text-slate-400">{unit}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label={`Decrease ${name}`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 relative flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400 disabled:opacity-50"
          />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label={`Increase ${name}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 px-1">
        <span>{min} {unit}</span>
        {description && (
          <span className="flex items-center gap-1 text-slate-400 italic text-[11px] truncate max-w-[200px]" title={description}>
            <Info className="w-3 h-3 text-cyan-500 shrink-0" />
            {description}
          </span>
        )}
        <span>{max} {unit}</span>
      </div>
    </div>
  );
};
