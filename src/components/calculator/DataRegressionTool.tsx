import React, { useState, useRef, useEffect, useMemo } from 'react';
import { calculateLinearRegression, RegressionResult } from '../../utils/mathParser';
import { Formula } from '../common/Formula';
import {
  Plus,
  Trash2,
  TrendingUp,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Table as TableIcon,
  HelpCircle,
} from 'lucide-react';

interface DataPoint {
  id: string;
  x: number;
  y: number;
}

export const DataRegressionTool: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Experimental dataset (default to Ohm's Law demo: Voltage vs Current)
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([
    { id: '1', x: 2, y: 0.35 },
    { id: '2', x: 4, y: 0.68 },
    { id: '3', x: 6, y: 1.02 },
    { id: '4', x: 8, y: 1.34 },
    { id: '5', x: 10, y: 1.69 },
    { id: '6', x: 12, y: 2.05 },
  ]);

  const [xLabel, setXLabel] = useState('Voltage V (Volts)');
  const [yLabel, setYLabel] = useState('Current I (Amperes)');

  // New point input
  const [newX, setNewX] = useState('');
  const [newY, setNewY] = useState('');

  // Calculate Regression
  const regression: RegressionResult | null = useMemo(() => {
    return calculateLinearRegression(dataPoints);
  }, [dataPoints]);

  // Presets from scientific experiments
  const loadExperimentPreset = (preset: 'ohms' | 'newton' | 'hooke' | 'temp') => {
    switch (preset) {
      case 'ohms':
        setXLabel('Voltage V (Volts)');
        setYLabel('Current I (Amps)');
        setDataPoints([
          { id: '1', x: 2, y: 0.34 },
          { id: '2', x: 4, y: 0.67 },
          { id: '3', x: 6, y: 1.01 },
          { id: '4', x: 8, y: 1.35 },
          { id: '5', x: 10, y: 1.68 },
          { id: '6', x: 12, y: 2.02 },
        ]);
        break;
      case 'newton':
        setXLabel('Mass m (kg)');
        setYLabel('Force F (N)');
        setDataPoints([
          { id: '1', x: 1.0, y: 4.9 },
          { id: '2', x: 2.0, y: 9.8 },
          { id: '3', x: 3.0, y: 14.6 },
          { id: '4', x: 4.0, y: 19.5 },
          { id: '5', x: 5.0, y: 24.5 },
        ]);
        break;
      case 'hooke':
        setXLabel('Extension x (m)');
        setYLabel('Restoring Force F (N)');
        setDataPoints([
          { id: '1', x: 0.02, y: 1.0 },
          { id: '2', x: 0.05, y: 2.45 },
          { id: '3', x: 0.08, y: 3.9 },
          { id: '4', x: 0.12, y: 5.9 },
          { id: '5', x: 0.16, y: 7.85 },
        ]);
        break;
      case 'temp':
        setXLabel('Time t (minutes)');
        setYLabel('Cooling Spoon Temp (°C)');
        setDataPoints([
          { id: '1', x: 0, y: 78.0 },
          { id: '2', x: 2, y: 64.5 },
          { id: '3', x: 4, y: 53.8 },
          { id: '4', x: 6, y: 45.2 },
          { id: '5', x: 8, y: 38.5 },
          { id: '6', x: 10, y: 33.2 },
        ]);
        break;
    }
  };

  const handleAddPoint = () => {
    const xVal = parseFloat(newX);
    const yVal = parseFloat(newY);
    if (!isNaN(xVal) && !isNaN(yVal)) {
      setDataPoints((prev) => [
        ...prev,
        { id: Math.random().toString(36).substring(2, 7), x: xVal, y: yVal },
      ]);
      setNewX('');
      setNewY('');
    }
  };

  const handleRemovePoint = (id: string) => {
    setDataPoints((prev) => prev.filter((p) => p.id !== id));
  };

  // Render Scatter Plot & Trendline on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = '#060B18';
    ctx.fillRect(0, 0, w, h);

    if (dataPoints.length === 0) {
      ctx.restore();
      return;
    }

    // Determine data range bounds
    const xs = dataPoints.map((p) => p.x);
    const ys = dataPoints.map((p) => p.y);
    const rawMinX = Math.min(...xs);
    const rawMaxX = Math.max(...xs);
    const rawMinY = Math.min(...ys);
    const rawMaxY = Math.max(...ys);

    const xPadding = Math.max(0.5, (rawMaxX - rawMinX) * 0.15);
    const yPadding = Math.max(0.5, (rawMaxY - rawMinY) * 0.15);

    const plotMinX = Math.min(0, rawMinX - xPadding);
    const plotMaxX = rawMaxX + xPadding;
    const plotMinY = Math.min(0, rawMinY - yPadding);
    const plotMaxY = rawMaxY + yPadding;

    const margin = { top: 35, right: 30, bottom: 45, left: 55 };
    const innerW = w - margin.left - margin.right;
    const innerH = h - margin.top - margin.bottom;

    const mapX = (x: number) => margin.left + ((x - plotMinX) / (plotMaxX - plotMinX)) * innerW;
    const mapY = (y: number) => margin.top + innerH * (1 - (y - plotMinY) / (plotMaxY - plotMinY));

    // Draw Grid Lines & Axes
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    const numTicks = 6;

    for (let i = 0; i <= numTicks; i++) {
      const gx = plotMinX + (i / numTicks) * (plotMaxX - plotMinX);
      const px = mapX(gx);
      ctx.beginPath();
      ctx.moveTo(px, margin.top);
      ctx.lineTo(px, margin.top + innerH);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(gx.toFixed(1), px, margin.top + innerH + 16);

      const gy = plotMinY + (i / numTicks) * (plotMaxY - plotMinY);
      const py = mapY(gy);
      ctx.beginPath();
      ctx.moveTo(margin.left, py);
      ctx.lineTo(margin.left + innerW, py);
      ctx.stroke();

      ctx.textAlign = 'right';
      ctx.fillText(gy.toFixed(1), margin.left - 8, py + 3);
    }

    // Main Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, margin.top + innerH);
    ctx.lineTo(margin.left + innerW, margin.top + innerH);
    ctx.stroke();

    // Axis Titles
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(xLabel, margin.left + innerW / 2, h - 8);

    ctx.save();
    ctx.translate(14, margin.top + innerH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    // Draw Linear Regression Line if exists
    if (regression) {
      const lineStartX = plotMinX;
      const lineStartY = regression.slope * lineStartX + regression.intercept;
      const lineEndX = plotMaxX;
      const lineEndY = regression.slope * lineEndX + regression.intercept;

      ctx.beginPath();
      ctx.moveTo(mapX(lineStartX), mapY(lineStartY));
      ctx.lineTo(mapX(lineEndX), mapY(lineEndY));
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Draw Scatter Data Points with Error Rings
    dataPoints.forEach((pt) => {
      const px = mapX(pt.x);
      const py = mapY(pt.y);

      // Glow halo
      ctx.beginPath();
      ctx.arc(px, py, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
      ctx.fill();

      // Point core
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    ctx.restore();
  }, [dataPoints, regression, xLabel, yLabel]);

  return (
    <div className="space-y-6">
      {/* Experiment Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#131E36] p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Lab Experiments:
          </span>
          <button
            onClick={() => loadExperimentPreset('ohms')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 transition"
          >
            Ohm's Law (V vs I)
          </button>
          <button
            onClick={() => loadExperimentPreset('newton')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-emerald-300 transition"
          >
            Newton's 2nd Law (F vs m)
          </button>
          <button
            onClick={() => loadExperimentPreset('hooke')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-300 transition"
          >
            Hooke's Law (F vs x)
          </button>
          <button
            onClick={() => loadExperimentPreset('temp')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-rose-300 transition"
          >
            Newton's Cooling (T vs t)
          </button>
        </div>

        <button
          onClick={() => setDataPoints([])}
          className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Points
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Scatter Plot Canvas */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#060B18] shadow-2xl">
            {regression && (
              <div className="absolute top-3 left-3 z-10 bg-slate-950/85 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-xs font-mono space-y-1 shadow-lg">
                <div className="text-cyan-400 font-bold">{regression.equationStr}</div>
                <div className="text-emerald-400">R² = {regression.rSquared.toFixed(4)}</div>
              </div>
            )}
            <canvas ref={canvasRef} className="w-full h-[420px] block" />
          </div>

          {/* Regression Metrics Strip */}
          {regression ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#131E36] p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Slope (m)</span>
                <span className="text-base font-bold font-mono text-cyan-300">
                  {regression.slope.toFixed(4)}
                </span>
                <span className="text-[10px] text-slate-500 block">Rate of change / sensitivity</span>
              </div>
              <div className="bg-[#131E36] p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Y-Intercept (c)</span>
                <span className="text-base font-bold font-mono text-sky-300">
                  {regression.intercept.toFixed(4)}
                </span>
                <span className="text-[10px] text-slate-500 block">Systematic zero-offset</span>
              </div>
              <div className="bg-[#131E36] p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">R² (Goodness of Fit)</span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  {(regression.rSquared * 100).toFixed(2)}%
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {regression.rSquared > 0.98 ? 'Extremely High Linear Fit' : 'Moderate Linear Fit'}
                </span>
              </div>
              <div className="bg-[#131E36] p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-0.5">Trials Count (n)</span>
                <span className="text-base font-bold font-mono text-purple-400">
                  {regression.n} measurements
                </span>
                <span className="text-[10px] text-slate-500 block">Empirical sample size</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 text-center">
              Add at least 2 coordinate points to calculate linear regression and best-fit parameters.
            </div>
          )}
        </div>

        {/* Right Col: Data Input Table */}
        <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <TableIcon className="w-3.5 h-3.5 text-cyan-400" />
              Experimental Measurements
            </h3>
            <span className="text-[11px] font-mono text-slate-400">{dataPoints.length} points</span>
          </div>

          {/* Add Data Point Row */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">X Value</label>
                <input
                  type="number"
                  placeholder="e.g. 5.0"
                  value={newX}
                  onChange={(e) => setNewX(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Y Value</label>
                <input
                  type="number"
                  placeholder="e.g. 1.25"
                  value={newY}
                  onChange={(e) => setNewY(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg p-2 text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              onClick={handleAddPoint}
              disabled={!newX || !newY}
              className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Data Point</span>
            </button>
          </div>

          {/* Scrollable Points Table */}
          <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-800">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                <tr>
                  <th className="p-2">#</th>
                  <th className="p-2">X</th>
                  <th className="p-2">Y</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {dataPoints.map((pt, idx) => (
                  <tr key={pt.id} className="hover:bg-slate-900/40">
                    <td className="p-2 text-slate-500">{idx + 1}</td>
                    <td className="p-2 text-cyan-300">{pt.x}</td>
                    <td className="p-2 text-amber-300">{pt.y}</td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => handleRemovePoint(pt.id)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                        title="Delete point"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
