import React, { useRef, useEffect, useState } from 'react';
import { Formula } from './Formula';

export interface DataPoint {
  x: number;
  y: number;
  label?: string;
}

interface GraphViewerProps {
  title: string;
  xLabel: string;
  yLabel: string;
  xUnit: string;
  yUnit: string;
  dataPoints?: DataPoint[];
  curveFunction?: (x: number) => number;
  xDomain: [number, number];
  yDomain: [number, number];
  height?: number;
  curveColor?: string;
  pointsColor?: string;
  currentMarker?: { x: number; y: number; label?: string };
}

export const GraphViewer: React.FC<GraphViewerProps> = ({
  title,
  xLabel,
  yLabel,
  xUnit,
  yUnit,
  dataPoints = [],
  curveFunction,
  xDomain,
  yDomain,
  height = 200,
  curveColor = '#38bdf8', // sky-400
  pointsColor = '#f59e0b', // amber-500
  currentMarker,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const h = rect.height;

    // Margins
    const ml = 48;
    const mr = 20;
    const mt = 20;
    const mb = 36;

    const plotWidth = width - ml - mr;
    const plotHeight = h - mt - mb;

    // Clear
    ctx.clearRect(0, 0, width, h);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(ml, mt, plotWidth, plotHeight);

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    const [xMin, xMax] = xDomain;
    const [yMin, yMax] = yDomain;
    const xSpan = Math.max(0.0001, xMax - xMin);
    const ySpan = Math.max(0.0001, yMax - yMin);

    const mapX = (val: number) => ml + ((val - xMin) / xSpan) * plotWidth;
    const mapY = (val: number) => mt + plotHeight - ((val - yMin) / ySpan) * plotHeight;

    // X grid and ticks
    const xTicks = 5;
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    for (let i = 0; i <= xTicks; i++) {
      const val = xMin + (i / xTicks) * xSpan;
      const px = mapX(val);
      ctx.beginPath();
      ctx.moveTo(px, mt);
      ctx.lineTo(px, mt + plotHeight);
      ctx.stroke();

      // Tick label
      ctx.fillText(val.toFixed(val >= 10 ? 0 : 1), px, mt + plotHeight + 14);
    }

    // Y grid and ticks
    const yTicks = 4;
    ctx.textAlign = 'right';
    for (let i = 0; i <= yTicks; i++) {
      const val = yMin + (i / yTicks) * ySpan;
      const py = mapY(val);
      ctx.beginPath();
      ctx.moveTo(ml, py);
      ctx.lineTo(ml + plotWidth, py);
      ctx.stroke();

      // Tick label
      ctx.fillText(val.toFixed(val >= 10 ? 0 : 1), ml - 6, py + 3);
    }

    // Plot theoretical curve if provided
    if (curveFunction) {
      ctx.strokeStyle = curveColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let started = false;
      const steps = 120;
      for (let i = 0; i <= steps; i++) {
        const xVal = xMin + (i / steps) * xSpan;
        const yVal = curveFunction(xVal);
        if (Number.isFinite(yVal)) {
          const px = mapX(xVal);
          const py = Math.min(mt + plotHeight, Math.max(mt, mapY(yVal)));
          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }
      }
      ctx.stroke();
    }

    // Plot experimental data points
    if (dataPoints.length > 0) {
      dataPoints.forEach((pt) => {
        const px = mapX(pt.x);
        const py = mapY(pt.y);

        if (px >= ml && px <= ml + plotWidth && py >= mt && py <= mt + plotHeight) {
          ctx.beginPath();
          ctx.arc(px, py, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = pointsColor;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });
    }

    // Plot current live marker if any
    if (currentMarker) {
      const cx = mapX(currentMarker.x);
      const cy = mapY(currentMarker.y);

      if (cx >= ml && cx <= ml + plotWidth && cy >= mt && cy <= mt + plotHeight) {
        // Pulse ring
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.4)';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#f43f5e';
        ctx.fill();
      }
    }

    // Border
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.strokeRect(ml, mt, plotWidth, plotHeight);
  }, [xDomain, yDomain, dataPoints, curveFunction, currentMarker, curveColor, pointsColor, height]);

  return (
    <div className="bg-[#131E36] border border-slate-800 rounded-xl p-3 shadow-md">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <h4 className="text-xs font-semibold text-slate-300 tracking-wide uppercase">{title}</h4>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-0.5 inline-block" style={{ backgroundColor: curveColor }}></span>
            <span>Theoretical</span>
          </span>
          {dataPoints.length > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: pointsColor }}></span>
              <span>Observed ({dataPoints.length})</span>
            </span>
          )}
        </div>
      </div>

      <div className="relative w-full" style={{ height: `${height}px` }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full block rounded-lg cursor-crosshair"
          onMouseMove={(e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const px = e.clientX - rect.left;
            const ml = 48;
            const mr = 20;
            const plotWidth = rect.width - ml - mr;
            if (px >= ml && px <= ml + plotWidth) {
              const fraction = (px - ml) / plotWidth;
              const xVal = xDomain[0] + fraction * (xDomain[1] - xDomain[0]);
              const yVal = curveFunction ? curveFunction(xVal) : 0;
              setHoveredPoint({ x: xVal, y: yVal });
            } else {
              setHoveredPoint(null);
            }
          }}
          onMouseLeave={() => setHoveredPoint(null)}
        />
        {hoveredPoint && (
          <div className="absolute top-2 right-2 bg-slate-900/90 border border-slate-700 text-xs px-2 py-1 rounded font-mono text-cyan-300 shadow pointer-events-none">
            {hoveredPoint.x.toFixed(1)} {xUnit} → {hoveredPoint.y.toFixed(2)} {yUnit}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center px-2 mt-1 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="text-slate-500">Y:</span> <Formula tex={yLabel} inline /> ({yUnit})
        </span>
        <span className="flex items-center gap-1">
          <span className="text-slate-500">X:</span> <Formula tex={xLabel} inline /> ({xUnit})
        </span>
      </div>
    </div>
  );
};
