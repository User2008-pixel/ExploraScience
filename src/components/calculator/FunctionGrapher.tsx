import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  compileExpression,
  computeDerivative,
  computeIntegral,
  MATH_SYMBOLS,
  MathContext,
} from '../../utils/mathParser';
import { Formula } from '../common/Formula';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Sliders,
  Table as TableIcon,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Sparkles,
  HelpCircle,
  Activity,
  Layers,
  Check,
  Copy,
  TrendingUp,
  Spline,
  Download,
} from 'lucide-react';

interface FunctionItem {
  id: string;
  name: string;
  expr: string;
  color: string;
  visible: boolean;
  showDerivative?: boolean;
}

export const FunctionGrapher: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Viewport bounds
  const [viewState, setViewState] = useState({
    xMin: -10,
    xMax: 10,
    yMin: -7,
    yMax: 7,
  });

  // Parameter sliders: a, b, c, k
  const [params, setParams] = useState({
    a: 2,
    b: 1,
    c: 0,
    k: 1,
  });

  // Functions list
  const [functions, setFunctions] = useState<FunctionItem[]>([
    { id: 'f1', name: 'f₁(x)', expr: 'sin(x)', color: '#38bdf8', visible: true, showDerivative: false },
    { id: 'f2', name: 'f₂(x)', expr: '0.15*x^2 - 3', color: '#34d399', visible: true, showDerivative: false },
  ]);

  const [activeFnId, setActiveFnId] = useState<string>('f1');

  // Definite Integration Tool State
  const [showIntegralTool, setShowIntegralTool] = useState(false);
  const [integralA, setIntegralA] = useState<number>(0);
  const [integralB, setIntegralB] = useState<number>(3.1416);
  const [integralFnId, setIntegralFnId] = useState<string>('f1');

  // Tracing cursor & options
  const [traceX, setTraceX] = useState<number | null>(null);
  const [showTangent, setShowTangent] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableStep, setTableStep] = useState(0.5);
  const [copiedTable, setCopiedTable] = useState(false);

  // Dragging state for canvas panning
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const viewStart = useRef({ xMin: -10, xMax: 10, yMin: -7, yMax: 7 });

  // Precompile functions
  const compiledFns = useMemo(() => {
    return functions.map((f) => ({
      ...f,
      evalFn: compileExpression(f.expr),
    }));
  }, [functions]);

  // Context for evaluation
  const evalContext: MathContext = useMemo(() => {
    return {
      a: params.a,
      b: params.b,
      c: params.c,
      k: params.k,
      isRadians: true,
    };
  }, [params]);

  // Preset curves
  const loadPreset = (presetKey: string) => {
    switch (presetKey) {
      case 'modulus':
        setFunctions([
          { id: 'f1', name: 'f₁(x)', expr: '|x|', color: '#38bdf8', visible: true },
          { id: 'f2', name: 'f₂(x)', expr: '|x^2 - 4|', color: '#34d399', visible: true },
          { id: 'f3', name: 'f₃(x)', expr: 'mod(x, 2)', color: '#f59e0b', visible: true },
        ]);
        setViewState({ xMin: -6, xMax: 6, yMin: -1, yMax: 8 });
        break;
      case 'calculus':
        setFunctions([
          { id: 'f1', name: 'f₁(x)', expr: 'sin(x)', color: '#38bdf8', visible: true, showDerivative: true },
          { id: 'f2', name: 'f₂(x)', expr: '0.2*x^3 - x', color: '#34d399', visible: true, showDerivative: false },
        ]);
        setShowIntegralTool(true);
        setIntegralA(0);
        setIntegralB(3.1416);
        setIntegralFnId('f1');
        setViewState({ xMin: -5, xMax: 5, yMin: -4, yMax: 4 });
        break;
      case 'projectile':
        setFunctions([
          { id: 'f1', name: 'Trajectory', expr: 'x*tan(0.785) - (9.8*x^2)/(2*20^2*cos(0.785)^2)', color: '#38bdf8', visible: true },
        ]);
        setViewState({ xMin: -2, xMax: 45, yMin: -5, yMax: 15 });
        break;
      case 'shm':
        setFunctions([
          { id: 'f1', name: 'Position x(t)', expr: 'a * cos(b * x)', color: '#38bdf8', visible: true },
          { id: 'f2', name: 'Velocity v(t)', expr: '-a * b * sin(b * x)', color: '#f59e0b', visible: true },
        ]);
        setParams({ a: 3, b: 1.5, c: 0, k: 1 });
        setViewState({ xMin: -10, xMax: 10, yMin: -6, yMax: 6 });
        break;
      case 'decay':
        setFunctions([
          { id: 'f1', name: 'N(t)', expr: 'a * e^(-0.2 * x)', color: '#38bdf8', visible: true },
        ]);
        setParams({ a: 10, b: 1, c: 0, k: 1 });
        setViewState({ xMin: -1, xMax: 20, yMin: -1, yMax: 12 });
        break;
      case 'enzyme':
        setFunctions([
          { id: 'f1', name: 'Michaelis-Menten v([S])', expr: '(a * x) / (b + x)', color: '#10b981', visible: true },
        ]);
        setParams({ a: 50, b: 10, c: 0, k: 1 });
        setViewState({ xMin: -5, xMax: 60, yMin: -5, yMax: 60 });
        break;
      case 'gaussian':
        setFunctions([
          { id: 'f1', name: 'Normal Bell Curve', expr: '(1 / sqrt(2 * pi)) * e^(-0.5 * x^2)', color: '#c084fc', visible: true },
        ]);
        setViewState({ xMin: -5, xMax: 5, yMin: -0.2, yMax: 0.6 });
        break;
      case 'coulomb':
        setFunctions([
          { id: 'f1', name: 'Inverse Square F(r)', expr: 'a / x^2', color: '#f43f5e', visible: true },
        ]);
        setParams({ a: 10, b: 1, c: 0, k: 1 });
        setViewState({ xMin: -1, xMax: 15, yMin: -1, yMax: 15 });
        break;
      default:
        break;
    }
  };

  // Convert canvas pixel to math coordinates
  const pixelToMath = useCallback(
    (px: number, py: number, width: number, height: number) => {
      const { xMin, xMax, yMin, yMax } = viewState;
      const mx = xMin + (px / width) * (xMax - xMin);
      const my = yMax - (py / height) * (yMax - yMin);
      return { x: mx, y: my };
    },
    [viewState]
  );

  // Convert math coordinate to canvas pixel
  const mathToPixel = useCallback(
    (mx: number, my: number, width: number, height: number) => {
      const { xMin, xMax, yMin, yMax } = viewState;
      const px = ((mx - xMin) / (xMax - xMin)) * width;
      const py = ((yMax - my) / (yMax - yMin)) * height;
      return { x: px, y: py };
    },
    [viewState]
  );

  // Canvas drawing loop
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

    // Deep technical dark background
    ctx.fillStyle = '#060B18';
    ctx.fillRect(0, 0, w, h);

    const { xMin, xMax, yMin, yMax } = viewState;
    const xSpan = xMax - xMin;
    const ySpan = yMax - yMin;

    // Calculate nice grid steps
    const getGridStep = (span: number) => {
      const raw = span / 10;
      const power = Math.pow(10, Math.floor(Math.log10(raw)));
      const frac = raw / power;
      if (frac < 1.5) return power;
      if (frac < 3.5) return 2 * power;
      if (frac < 7.5) return 5 * power;
      return 10 * power;
    };

    const xStep = getGridStep(xSpan);
    const yStep = getGridStep(ySpan);

    // 1. Draw Grid Lines
    if (showGrid) {
      ctx.lineWidth = 1;

      // Vertical grid lines
      const startX = Math.floor(xMin / xStep) * xStep;
      for (let gx = startX; gx <= xMax; gx += xStep) {
        const px = ((gx - xMin) / xSpan) * w;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
        ctx.strokeStyle = Math.abs(gx) < 1e-9 ? 'rgba(148, 163, 184, 0.4)' : 'rgba(51, 65, 85, 0.35)';
        ctx.stroke();

        // Label tick
        if (Math.abs(gx) > 1e-9) {
          ctx.fillStyle = '#64748b';
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          const yZeroPixel = ((yMax - 0) / ySpan) * h;
          const labelY = Math.max(14, Math.min(h - 8, yZeroPixel + 14));
          ctx.fillText(Number(gx.toPrecision(4)).toString(), px, labelY);
        }
      }

      // Horizontal grid lines
      const startY = Math.floor(yMin / yStep) * yStep;
      for (let gy = startY; gy <= yMax; gy += yStep) {
        const py = ((yMax - gy) / ySpan) * h;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
        ctx.strokeStyle = Math.abs(gy) < 1e-9 ? 'rgba(148, 163, 184, 0.4)' : 'rgba(51, 65, 85, 0.35)';
        ctx.stroke();

        // Label tick
        if (Math.abs(gy) > 1e-9) {
          ctx.fillStyle = '#64748b';
          ctx.font = '10px monospace';
          ctx.textAlign = 'right';
          const xZeroPixel = ((0 - xMin) / xSpan) * w;
          const labelX = Math.max(28, Math.min(w - 6, xZeroPixel - 6));
          ctx.fillText(Number(gy.toPrecision(4)).toString(), labelX, py + 3);
        }
      }
    }

    // 2. Draw Main Axes (X=0 and Y=0)
    const xZeroPix = ((0 - xMin) / xSpan) * w;
    const yZeroPix = ((yMax - 0) / ySpan) * h;

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#94a3b8';

    // X Axis
    if (yZeroPix >= 0 && yZeroPix <= h) {
      ctx.beginPath();
      ctx.moveTo(0, yZeroPix);
      ctx.lineTo(w, yZeroPix);
      ctx.stroke();

      // Axis label
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('x', w - 10, yZeroPix - 6);
    }

    // Y Axis
    if (xZeroPix >= 0 && xZeroPix <= w) {
      ctx.beginPath();
      ctx.moveTo(xZeroPix, 0);
      ctx.lineTo(xZeroPix, h);
      ctx.stroke();

      // Axis label
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('y', xZeroPix + 8, 16);
    }

    // Origin 0 indicator
    if (xZeroPix >= 0 && xZeroPix <= w && yZeroPix >= 0 && yZeroPix <= h) {
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('0', xZeroPix - 5, yZeroPix + 12);
    }

    // 2.5 Definite Integral Shading & Bounds
    if (showIntegralTool) {
      const activeIntFn = compiledFns.find((f) => f.id === integralFnId) || compiledFns[0];
      if (activeIntFn && activeIntFn.visible) {
        const lowerBound = Math.min(integralA, integralB);
        const upperBound = Math.max(integralA, integralB);
        const intSamples = 200;
        const intStep = (upperBound - lowerBound) / intSamples;

        ctx.save();
        ctx.beginPath();
        // Start on X-axis at (lowerBound, 0)
        const pStart = mathToPixel(lowerBound, 0, w, h);
        ctx.moveTo(pStart.x, pStart.y);

        for (let i = 0; i <= intSamples; i++) {
          const ix = lowerBound + i * intStep;
          const iy = activeIntFn.evalFn({ ...evalContext, x: ix });
          if (!isNaN(iy) && isFinite(iy)) {
            const ip = mathToPixel(ix, iy, w, h);
            ctx.lineTo(ip.x, ip.y);
          }
        }
        // Down to (upperBound, 0) on X-axis
        const pEnd = mathToPixel(upperBound, 0, w, h);
        ctx.lineTo(pEnd.x, pEnd.y);
        ctx.closePath();

        // Semi-transparent gradient fill
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.fill();

        // Draw boundary dashed lines at x=a and x=b
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);

        const bAY = activeIntFn.evalFn({ ...evalContext, x: integralA });
        const bAYPix = mathToPixel(integralA, isNaN(bAY) ? 0 : bAY, w, h);
        ctx.beginPath();
        ctx.moveTo(pStart.x, pStart.y);
        ctx.lineTo(bAYPix.x, bAYPix.y);
        ctx.stroke();

        const bBY = activeIntFn.evalFn({ ...evalContext, x: integralB });
        const bBYPix = mathToPixel(integralB, isNaN(bBY) ? 0 : bBY, w, h);
        ctx.beginPath();
        ctx.moveTo(pEnd.x, pEnd.y);
        ctx.lineTo(bBYPix.x, bBYPix.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Integral Badge on Top-Left of Canvas
        const intVal = computeIntegral(activeIntFn.evalFn, integralA, integralB, evalContext);
        const intText = `∫ [${integralA.toFixed(2)}, ${integralB.toFixed(2)}] ${activeIntFn.name} dx = ${isNaN(intVal) ? 'NaN' : intVal.toFixed(4)}`;
        ctx.font = 'bold 12px monospace';
        const badgeWidth = ctx.measureText(intText).width + 20;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.fillRect(16, 16, badgeWidth, 28);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.strokeRect(16, 16, badgeWidth, 28);

        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.fillText(intText, 26, 34);

        ctx.restore();
      }
    }

    // 3. Plot Each Function Curve
    const numSamples = Math.min(1000, Math.max(400, Math.round(w * 1.2)));
    const sampleStep = xSpan / numSamples;

    compiledFns.forEach((fnItem) => {
      if (!fnItem.visible) return;

      ctx.beginPath();
      ctx.strokeStyle = fnItem.color;
      ctx.lineWidth = 2.5;

      let isDrawing = false;
      let prevYPixel = 0;

      for (let i = 0; i <= numSamples; i++) {
        const mx = xMin + i * sampleStep;
        const my = fnItem.evalFn({ ...evalContext, x: mx });

        if (isNaN(my) || !isFinite(my)) {
          isDrawing = false;
          continue;
        }

        const px = (i / numSamples) * w;
        const py = ((yMax - my) / ySpan) * h;

        // Discontinuity check (e.g. asymptotes on tan(x) or 1/x)
        if (isDrawing && Math.abs(py - prevYPixel) > h * 0.8) {
          isDrawing = false;
        }

        if (!isDrawing) {
          ctx.moveTo(px, py);
          isDrawing = true;
        } else {
          ctx.lineTo(px, py);
        }
        prevYPixel = py;
      }

      ctx.stroke();

      // 3.5 Plot Derivative Curve f'(x) if toggled
      if (fnItem.showDerivative) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([5, 4]);

        let isDerivDrawing = false;
        let prevDerivY = 0;

        for (let i = 0; i <= numSamples; i++) {
          const mx = xMin + i * sampleStep;
          const dy = computeDerivative(fnItem.evalFn, mx, evalContext);

          if (isNaN(dy) || !isFinite(dy)) {
            isDerivDrawing = false;
            continue;
          }

          const px = (i / numSamples) * w;
          const py = ((yMax - dy) / ySpan) * h;

          if (isDerivDrawing && Math.abs(py - prevDerivY) > h * 0.8) {
            isDerivDrawing = false;
          }

          if (!isDerivDrawing) {
            ctx.moveTo(px, py);
            isDerivDrawing = true;
          } else {
            ctx.lineTo(px, py);
          }
          prevDerivY = py;
        }

        ctx.stroke();
        ctx.restore();
      }
    });

    // 4. Value Tracer & Tangent Derivative
    if (traceX !== null && traceX >= xMin && traceX <= xMax) {
      const activeFn = compiledFns.find((f) => f.visible);

      if (activeFn) {
        const traceY = activeFn.evalFn({ ...evalContext, x: traceX });

        if (!isNaN(traceY) && isFinite(traceY)) {
          const tPix = mathToPixel(traceX, traceY, w, h);

          // Draw vertical trace dashed guide
          ctx.beginPath();
          ctx.setLineDash([3, 3]);
          ctx.moveTo(tPix.x, 0);
          ctx.lineTo(tPix.x, h);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);

          // Numerical Derivative Slope df/dx
          const slope = computeDerivative(activeFn.evalFn, traceX, evalContext);

          // Draw Tangent Line if enabled
          if (showTangent && !isNaN(slope) && isFinite(slope)) {
            const tangentLength = Math.min(xSpan * 0.25, 4);
            const x1 = traceX - tangentLength;
            const y1 = traceY - slope * tangentLength;
            const x2 = traceX + tangentLength;
            const y2 = traceY + slope * tangentLength;

            const p1 = mathToPixel(x1, y1, w, h);
            const p2 = mathToPixel(x2, y2, w, h);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.8;
            ctx.stroke();
          }

          // Tracing Dot
          ctx.beginPath();
          ctx.arc(tPix.x, tPix.y, 6, 0, Math.PI * 2);
          ctx.fillStyle = activeFn.color;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Coordinate Tooltip Badge on Canvas
          const badgeText = `(${traceX.toFixed(2)}, ${traceY.toFixed(2)})`;
          const slopeText = !isNaN(slope) && isFinite(slope) ? `dy/dx = ${slope.toFixed(2)}` : '';

          ctx.font = 'bold 11px monospace';
          const textW = Math.max(ctx.measureText(badgeText).width, ctx.measureText(slopeText).width) + 16;
          const badgeX = Math.min(w - textW - 10, Math.max(10, tPix.x + 12));
          const badgeY = Math.max(30, Math.min(h - 45, tPix.y - 15));

          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.fillRect(badgeX, badgeY - 14, textW, slopeText ? 36 : 22);
          ctx.strokeStyle = activeFn.color;
          ctx.lineWidth = 1;
          ctx.strokeRect(badgeX, badgeY - 14, textW, slopeText ? 36 : 22);

          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'left';
          ctx.fillText(badgeText, badgeX + 8, badgeY + 2);
          if (slopeText) {
            ctx.fillStyle = '#f59e0b';
            ctx.font = '10px monospace';
            ctx.fillText(slopeText, badgeX + 8, badgeY + 16);
          }
        }
      }
    }

    ctx.restore();
  }, [viewState, compiledFns, evalContext, showGrid, traceX, showTangent, showIntegralTool, integralA, integralB, integralFnId, mathToPixel]);

  // Export Graph as PNG for lab reports
  const handleDownloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'math-graph-lab-report.png';
    link.href = dataUrl;
    link.click();
  };

  // Canvas Mouse / Touch Event Handlers for Panning & Tracing
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    viewStart.current = { ...viewState };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    if (isDragging.current) {
      const dxPix = e.clientX - dragStart.current.x;
      const dyPix = e.clientY - dragStart.current.y;

      const xSpan = viewStart.current.xMax - viewStart.current.xMin;
      const ySpan = viewStart.current.yMax - viewStart.current.yMin;

      const dxMath = (dxPix / rect.width) * xSpan;
      const dyMath = (dyPix / rect.height) * ySpan;

      setViewState({
        xMin: viewStart.current.xMin - dxMath,
        xMax: viewStart.current.xMax - dxMath,
        yMin: viewStart.current.yMin + dyMath,
        yMax: viewStart.current.yMax + dyMath,
      });
    } else {
      // Update traceX under mouse
      const mCoord = pixelToMath(px, py, rect.width, rect.height);
      setTraceX(mCoord.x);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    setTraceX(null);
  };

  // Zoom controls
  const handleZoom = (factor: number) => {
    setViewState((prev) => {
      const xCenter = (prev.xMin + prev.xMax) / 2;
      const yCenter = (prev.yMin + prev.yMax) / 2;
      const xHalfSpan = ((prev.xMax - prev.xMin) * factor) / 2;
      const yHalfSpan = ((prev.yMax - prev.yMin) * factor) / 2;
      return {
        xMin: xCenter - xHalfSpan,
        xMax: xCenter + xHalfSpan,
        yMin: yCenter - yHalfSpan,
        yMax: yCenter + yHalfSpan,
      };
    });
  };

  const handleResetView = () => {
    setViewState({ xMin: -10, xMax: 10, yMin: -7, yMax: 7 });
  };

  // Function manipulation
  const addFunctionSlot = () => {
    if (functions.length >= 4) return;
    const colors = ['#f59e0b', '#ec4899', '#a855f7'];
    const nextIdx = functions.length + 1;
    const newId = `f${nextIdx}`;
    setFunctions((prev) => [
      ...prev,
      {
        id: newId,
        name: `f${nextIdx}(x)`,
        expr: 'cos(x)',
        color: colors[(nextIdx - 1) % colors.length],
        visible: true,
        showDerivative: false,
      },
    ]);
    setActiveFnId(newId);
  };

  const removeFunctionSlot = (id: string) => {
    if (functions.length <= 1) return;
    setFunctions((prev) => prev.filter((f) => f.id !== id));
    if (activeFnId === id) {
      const remaining = functions.filter((f) => f.id !== id);
      if (remaining.length > 0) setActiveFnId(remaining[0].id);
    }
  };

  const updateFunctionExpr = (id: string, newExpr: string) => {
    setFunctions((prev) =>
      prev.map((f) => (f.id === id ? { ...f, expr: newExpr } : f))
    );
  };

  const toggleFunctionVisibility = (id: string) => {
    setFunctions((prev) =>
      prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f))
    );
  };

  const toggleDerivative = (id: string) => {
    setFunctions((prev) =>
      prev.map((f) => (f.id === id ? { ...f, showDerivative: !f.showDerivative } : f))
    );
  };

  const handleInsertSymbol = (symbol: string) => {
    if (symbol === '∫') {
      setShowIntegralTool(true);
      return;
    }
    if (symbol === 'd/dx') {
      toggleDerivative(activeFnId);
      return;
    }
    setFunctions((prev) =>
      prev.map((f) => (f.id === activeFnId ? { ...f, expr: f.expr + symbol } : f))
    );
  };

  // Generate Table of Values
  const tableValues = useMemo(() => {
    const list: { x: number; vals: Record<string, string> }[] = [];
    const step = Math.max(0.1, tableStep);
    const startX = Math.ceil(viewState.xMin);
    const endX = Math.floor(viewState.xMax);

    for (let x = startX; x <= endX; x += step) {
      const roundedX = Number(x.toFixed(2));
      const rowVals: Record<string, string> = {};
      compiledFns.forEach((f) => {
        if (!f.visible) return;
        const val = f.evalFn({ ...evalContext, x: roundedX });
        rowVals[f.id] = isNaN(val) || !isFinite(val) ? 'Undefined' : val.toFixed(4);
      });
      list.push({ x: roundedX, vals: rowVals });
      if (list.length > 100) break; // guard limit
    }
    return list;
  }, [viewState.xMin, viewState.xMax, tableStep, compiledFns, evalContext]);

  const copyTableToClipboard = () => {
    let tsv = 'x\t' + functions.filter((f) => f.visible).map((f) => f.name).join('\t') + '\n';
    tableValues.forEach((row) => {
      tsv += row.x + '\t' + functions.filter((f) => f.visible).map((f) => row.vals[f.id] || '').join('\t') + '\n';
    });
    navigator.clipboard.writeText(tsv);
    setCopiedTable(true);
    setTimeout(() => setCopiedTable(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Presets & Utilities Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#131E36] p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            STEM Presets:
          </span>
          <button
            onClick={() => loadPreset('modulus')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-300 font-mono font-semibold transition"
          >
            |x| & mod(x)
          </button>
          <button
            onClick={() => loadPreset('calculus')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 font-mono font-semibold transition"
          >
            Calculus (∫ & f')
          </button>
          <button
            onClick={() => loadPreset('projectile')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-sky-300 transition"
          >
            Projectile
          </button>
          <button
            onClick={() => loadPreset('shm')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-300 transition"
          >
            Harmonic Waves
          </button>
          <button
            onClick={() => loadPreset('decay')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-rose-300 transition"
          >
            Exponential Decay
          </button>
          <button
            onClick={() => loadPreset('enzyme')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-emerald-300 transition"
          >
            Michaelis-Menten
          </button>
          <button
            onClick={() => loadPreset('gaussian')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-purple-300 transition"
          >
            Gaussian Bell
          </button>
          <button
            onClick={() => loadPreset('coulomb')}
            className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-rose-400 transition"
          >
            Inverse Square
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowIntegralTool(!showIntegralTool)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition ${
              showIntegralTool
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Toggle Definite Integral Calculator & Area Shading"
          >
            <Spline className="w-3.5 h-3.5" />
            <span>Definite Integral ∫</span>
          </button>

          <button
            onClick={() => setShowTableModal(!showTableModal)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table of Values</span>
          </button>
        </div>
      </div>

      {/* Main Graph Viewport Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: Interactive Canvas */}
        <div className="lg:col-span-3 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#060B18] shadow-2xl">
            {/* Viewport Control Bar (Float on top right) */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-md">
              <button
                onClick={() => handleZoom(0.8)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleZoom(1.25)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetView}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                title="Reset View to Origin"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <div className="w-[1px] h-4 bg-slate-700 mx-1" />
              <button
                onClick={() => setShowTangent(!showTangent)}
                className={`px-2 py-1 rounded-lg text-[11px] font-mono transition ${
                  showTangent ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle Tangent Line & Derivative"
              >
                Tangent (dy/dx)
              </button>
              <button
                onClick={handleDownloadPNG}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition"
                title="Download Graph as PNG for Lab Reports"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PNG</span>
              </button>
            </div>

            {/* Instruction tooltip */}
            <div className="absolute bottom-3 left-3 z-10 text-[10px] font-mono text-slate-500 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800 pointer-events-none">
              Pan: Click & Drag | Trace: Hover Crosshair
            </div>

            {/* HTML5 Canvas */}
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              className="w-full h-[460px] block cursor-crosshair select-none"
            />
          </div>

          {/* Canvas coordinate bounds summary */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2">
            <span>
              x: [{viewState.xMin.toFixed(1)}, {viewState.xMax.toFixed(1)}]
            </span>
            <span className="text-slate-500">Cartesian Coordinate Plane (Double-precision)</span>
            <span>
              y: [{viewState.yMin.toFixed(1)}, {viewState.yMax.toFixed(1)}]
            </span>
          </div>
        </div>

        {/* Right Col: Functions List & Parameters */}
        <div className="space-y-4">
          {/* Function Inputs Card */}
          <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Plotted Functions
              </h3>
              {functions.length < 4 && (
                <button
                  onClick={addFunctionSlot}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Curve
                </button>
              )}
            </div>

            {/* Mathematical Symbols Quick Inserter Palette */}
            <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800/90 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                <span className="text-slate-300 font-bold uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Quick Symbols:
                </span>
                <span className="text-[10px] text-cyan-400 font-bold">
                  Target: {functions.find((f) => f.id === activeFnId)?.name || 'f₁(x)'}
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
                {[
                  { label: 'mod', ins: 'mod(' },
                  { label: '|x|', ins: '|x|' },
                  { label: '∫ dx', ins: '∫' },
                  { label: 'd/dx', ins: 'd/dx' },
                  { label: '√x', ins: 'sqrt(' },
                  { label: 'xʸ', ins: '^' },
                  { label: 'x²', ins: '^2' },
                  { label: 'π', ins: 'pi' },
                  { label: 'e', ins: 'e' },
                  { label: 'sin', ins: 'sin(' },
                  { label: 'cos', ins: 'cos(' },
                  { label: 'tan', ins: 'tan(' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleInsertSymbol(item.ins)}
                    className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 font-mono text-[11px] text-center transition"
                    title={`Insert ${item.label}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {functions.map((fn) => {
                const isActive = fn.id === activeFnId;

                return (
                  <div
                    key={fn.id}
                    onClick={() => setActiveFnId(fn.id)}
                    className={`bg-slate-950/80 p-2.5 rounded-xl border transition space-y-1.5 ${
                      isActive ? 'border-cyan-500/50 shadow-md shadow-cyan-500/10' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold" style={{ color: fn.color }}>
                        {fn.name} =
                      </span>
                      <div className="flex items-center gap-1.5">
                        {/* Derivative f'(x) curve toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDerivative(fn.id);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border transition ${
                            fn.showDerivative
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                          }`}
                          title="Plot numerical derivative curve f'(x)"
                        >
                          f'(x)
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFunctionVisibility(fn.id);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white"
                          title={fn.visible ? 'Hide curve' : 'Show curve'}
                        >
                          {fn.visible ? <Eye className="w-3.5 h-3.5 text-cyan-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                        </button>
                        {functions.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFunctionSlot(fn.id);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-rose-400"
                            title="Remove function"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={fn.expr}
                      onFocus={() => setActiveFnId(fn.id)}
                      onChange={(e) => updateFunctionExpr(fn.id, e.target.value)}
                      placeholder="e.g. sin(x), |x|, mod(x, 2)"
                      className="w-full bg-slate-900 border border-slate-800 text-slate-100 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Definite Integral Tool Panel */}
          {showIntegralTool && (
            <div className="bg-[#131E36] p-4 rounded-2xl border border-cyan-500/40 shadow-xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <Spline className="w-3.5 h-3.5 text-cyan-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Definite Integral (∫) Calculator
                  </h3>
                </div>
                <button
                  onClick={() => setShowIntegralTool(false)}
                  className="p-1 rounded text-slate-400 hover:text-white text-xs"
                  title="Close integral tool"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">
                    Function to Integrate:
                  </label>
                  <select
                    value={integralFnId}
                    onChange={(e) => setIntegralFnId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-cyan-500"
                  >
                    {functions.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} = {f.expr}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">
                      Lower Limit a:
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={integralA}
                      onChange={(e) => setIntegralA(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-slate-400 block mb-1">
                      Upper Limit b:
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={integralB}
                      onChange={(e) => setIntegralB(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-950/90 p-3 rounded-xl border border-cyan-500/30 text-center space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block">
                    Calculated Area under Curve:
                  </span>
                  <span className="text-lg font-mono font-bold text-cyan-300">
                    {(() => {
                      const targetFn = compiledFns.find((f) => f.id === integralFnId) || compiledFns[0];
                      const val = computeIntegral(targetFn.evalFn, integralA, integralB, evalContext);
                      return isNaN(val) ? 'Undefined' : val.toFixed(6);
                    })()}
                  </span>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">
                    Simpson's 1/3 Rule (N = 200)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Parameter Sliders (a, b, c, k) */}
          <div className="bg-[#131E36] p-4 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Dynamic Parameters
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-mono text-slate-300 mb-1">
                  <span>Parameter a:</span>
                  <span className="text-amber-400 font-bold">{params.a.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.1"
                  value={params.a}
                  onChange={(e) => setParams({ ...params, a: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-slate-300 mb-1">
                  <span>Parameter b:</span>
                  <span className="text-emerald-400 font-bold">{params.b.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.1"
                  value={params.b}
                  onChange={(e) => setParams({ ...params, b: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-400 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-slate-300 mb-1">
                  <span>Parameter c:</span>
                  <span className="text-sky-400 font-bold">{params.c.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.1"
                  value={params.c}
                  onChange={(e) => setParams({ ...params, c: parseFloat(e.target.value) })}
                  className="w-full accent-sky-400 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-slate-300 mb-1">
                  <span>Constant k:</span>
                  <span className="text-purple-400 font-bold">{params.k.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="10"
                  step="0.1"
                  value={params.k}
                  onChange={(e) => setParams({ ...params, k: parseFloat(e.target.value) })}
                  className="w-full accent-purple-400 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Values Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#131E36] border border-slate-700 max-w-xl w-full rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-cyan-400" />
                Table of Function Values
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={copyTableToClipboard}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition"
                >
                  {copiedTable ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTable ? 'Copied TSV' : 'Copy Table'}</span>
                </button>
                <button
                  onClick={() => setShowTableModal(false)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span>Step Size (Δx):</span>
              {[0.2, 0.5, 1.0, 2.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setTableStep(s)}
                  className={`px-2 py-0.5 rounded font-mono ${
                    tableStep === s ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto rounded-xl border border-slate-800">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-950 text-slate-400 sticky top-0 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">x</th>
                    {functions
                      .filter((f) => f.visible)
                      .map((f) => (
                        <th key={f.id} className="p-2.5" style={{ color: f.color }}>
                          {f.name}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {tableValues.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-2 text-cyan-300 font-semibold">{row.x}</td>
                      {functions
                        .filter((f) => f.visible)
                        .map((f) => (
                          <td key={f.id} className="p-2">
                            {row.vals[f.id] || '—'}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
