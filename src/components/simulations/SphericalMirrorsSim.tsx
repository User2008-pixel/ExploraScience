import React, { useState, useRef, useEffect } from 'react';
import { Formula } from '../common/Formula';
import { Sparkles, RotateCcw, Sliders, Eye, Sun, Compass } from 'lucide-react';

interface SphericalMirrorsSimProps {
  initialType?: 'concave' | 'convex';
  focalLengthCm?: number;
  objectDistanceCm?: number;
  objectHeightCm?: number;
}

interface Preset {
  name: string;
  type: 'concave' | 'convex';
  u: number;
  f: number;
  h: number;
  description: string;
}

const PRESETS: Preset[] = [
  {
    name: 'Concave: Beyond C (Diminished Real)',
    type: 'concave',
    u: -50,
    f: 20,
    h: 5,
    description: 'Object beyond Center of Curvature (C = -40 cm). Image formed between F and C: Real, Inverted & Diminished.',
  },
  {
    name: 'Concave: At C (Same Size Inverted)',
    type: 'concave',
    u: -40,
    f: 20,
    h: 5,
    description: 'Object at Center of Curvature. Image formed at C: Real, Inverted & Same Size (m = -1).',
  },
  {
    name: 'Concave: Between C & F (Magnified Real)',
    type: 'concave',
    u: -30,
    f: 20,
    h: 4,
    description: 'Object between C (-40 cm) and F (-20 cm). Image formed beyond C: Real, Inverted & Magnified (projector).',
  },
  {
    name: 'Concave: Shaving/Vanity (Virtual Erect Magnified)',
    type: 'concave',
    u: -10,
    f: 20,
    h: 4,
    description: 'Object between Focus (-20 cm) and Pole (0 cm). Image formed behind mirror: Virtual, Erect & Enlarged (m = +2).',
  },
  {
    name: 'Convex: Automobile Rear-View (Wide Field)',
    type: 'convex',
    u: -45,
    f: 20,
    h: 5,
    description: 'Convex rear-view mirror: Image is always formed behind mirror between P and F: Virtual, Erect & Diminished.',
  },
  {
    name: 'Convex: Close Vehicle Follower',
    type: 'convex',
    u: -18,
    f: 20,
    h: 5,
    description: 'Traffic following close behind: Still virtual, erect, and safely diminished within wide field of view.',
  },
];

export const SphericalMirrorsSim: React.FC<SphericalMirrorsSimProps> = ({
  initialType = 'concave',
  focalLengthCm: propF = 20,
  objectDistanceCm: propU = -35,
  objectHeightCm: propH = 4.5,
}) => {
  const [mirrorType, setMirrorType] = useState<'concave' | 'convex'>(initialType);
  const [absFocalLength, setAbsFocalLength] = useState<number>(Math.abs(propF));
  const [objectU, setObjectU] = useState<number>(propU <= 0 ? propU : -propU);
  const [objectH, setObjectH] = useState<number>(propH);
  const [showRay1, setShowRay1] = useState<boolean>(true);
  const [showRay2, setShowRay2] = useState<boolean>(true);
  const [showRay3, setShowRay3] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDraggingObject, setIsDraggingObject] = useState<boolean>(false);

  // Optical formulas
  // Concave f < 0, Convex f > 0
  const effectiveF = mirrorType === 'concave' ? -absFocalLength : absFocalLength;
  const isAtFocus = Math.abs(objectU - effectiveF) < 0.1;
  const calculatedV = isAtFocus ? (effectiveF < 0 ? -Infinity : Infinity) : (objectU * effectiveF) / (objectU - effectiveF);
  const magnification = isAtFocus ? Infinity : -calculatedV / objectU;
  const imageHeight = isAtFocus ? 0 : objectH * magnification;

  // SVG Coordinate mapping:
  // Center of mirror Pole P is at (poleX, axisY)
  const poleX = 220;
  const axisY = 120;
  const scale = 2.4; // 1 cm = 2.4 px

  const objX = Math.max(20, Math.min(poleX - 8, poleX + objectU * scale));
  const objPixelH = objectH * 7.5;
  const focusX = poleX + effectiveF * scale;
  const centerOfCurvX = poleX + 2 * effectiveF * scale;

  const imgX = isFinite(calculatedV) ? Math.max(15, Math.min(425, poleX + calculatedV * scale)) : 0;
  const imgPixelH = isFinite(imageHeight) ? imageHeight * 7.5 : 0;

  // Dragging handler
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDraggingObject(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingObject || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgWidth = rect.width;
    const mappedX = (clientX / svgWidth) * 440;
    const newU = Math.min(-6, Math.max(-80, (mappedX - poleX) / scale));
    setObjectU(Math.round(newU * 10) / 10);
  };

  const handlePointerUp = () => {
    setIsDraggingObject(false);
  };

  return (
    <div className="bg-[#070e1c] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Spherical Mirrors Optical Bench & Live Ray Tracing
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Cartesian sign convention with exact concave (cave inward) & convex (bulge outward) geometries
            </p>
          </div>
        </div>

        {/* Mirror Geometry Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setMirrorType('concave')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              mirrorType === 'concave'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-300"></span>
            Concave Mirror (Converging, f &lt; 0)
          </button>
          <button
            onClick={() => setMirrorType('convex')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              mirrorType === 'convex'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Convex Mirror (Diverging, f &gt; 0)
          </button>
        </div>
      </div>

      {/* Main Optical Bench Interactive Canvas */}
      <div className="bg-[#030712] rounded-2xl border border-slate-800 p-4 relative overflow-hidden flex flex-col items-center">
        {/* Top Badges */}
        <div className="w-full flex items-center justify-between mb-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400 bg-slate-950/90 px-3 py-1 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold">Geometry:</span>
            <span>{mirrorType === 'concave' ? 'Concave (Hollow Inward)' : 'Convex (Bulges Outward)'}</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-bold">f = {effectiveF} cm</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] transition ${
                showGrid
                  ? 'bg-slate-800 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              Sign Grid
            </button>
            <button
              onClick={() => setShowRay1(!showRay1)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] transition ${
                showRay1
                  ? 'bg-slate-800 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              Ray 1 (Parallel)
            </button>
            <button
              onClick={() => setShowRay2(!showRay2)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] transition ${
                showRay2
                  ? 'bg-slate-800 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              Ray 2 (Pole)
            </button>
            <button
              onClick={() => setShowRay3(!showRay3)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] transition ${
                showRay3
                  ? 'bg-slate-800 text-pink-300 border-pink-500/40'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
            >
              Ray 3 (C)
            </button>
          </div>
        </div>

        {/* SVG Optical System */}
        <svg
          ref={svgRef}
          viewBox="0 0 440 240"
          className="w-full h-72 select-none cursor-crosshair"
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Subtle Background Grid & Coordinate System */}
          {showGrid && (
            <g opacity="0.15">
              {Array.from({ length: 22 }).map((_, i) => (
                <line key={`vg-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="240" stroke="#94a3b8" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={`hg-${i}`} x1="0" y1={i * 20} x2="440" y2={i * 20} stroke="#94a3b8" strokeWidth="0.5" />
              ))}
            </g>
          )}

          {/* Principal Axis */}
          <line x1="10" y1={axisY} x2="430" y2={axisY} stroke="#334155" strokeWidth="1.5" strokeDasharray="5 4" />
          <text x="12" y={axisY - 6} fill="#64748b" fontSize="8" fontFamily="monospace">-x (Incident Light)</text>
          <text x="375" y={axisY - 6} fill="#64748b" fontSize="8" fontFamily="monospace">+x (Behind Mirror)</text>

          {/* ============================================================== */}
          {/* MIRROR CURVED REFLECTING SURFACE */}
          {/* ============================================================== */}
          {mirrorType === 'concave' ? (
            /* CONCAVE: Hollow cave facing LEFT towards incoming light. Endpoints curve LEFT towards object, middle extends RIGHT into cave */
            <g>
              <path
                d={`M ${poleX - 14},20 Q ${poleX + 20},${axisY} ${poleX - 14},220`}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4.5"
              />
              {/* Silvered Backing Notches on the right/convex outside */}
              <path
                d={`
                  M ${poleX - 12},25 L ${poleX - 6},20
                  M ${poleX - 4},50 L ${poleX + 2},45
                  M ${poleX + 4},80 L ${poleX + 10},75
                  M ${poleX + 7},120 L ${poleX + 13},115
                  M ${poleX + 4},160 L ${poleX + 10},155
                  M ${poleX - 4},190 L ${poleX + 2},185
                  M ${poleX - 12},215 L ${poleX - 6},210
                `}
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <text x={poleX - 4} y="15" fill="#38bdf8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                Concave
              </text>
            </g>
          ) : (
            /* CONVEX: Bulges OUTWARDS towards LEFT towards incoming light. Endpoints are to the RIGHT, middle crests to the LEFT */
            <g>
              <path
                d={`M ${poleX + 14},20 Q ${poleX - 20},${axisY} ${poleX + 14},220`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="4.5"
              />
              {/* Silvered Backing Notches on the inner hollow back (right side) */}
              <path
                d={`
                  M ${poleX + 16},25 L ${poleX + 22},20
                  M ${poleX + 8},50 L ${poleX + 14},45
                  M ${poleX},80 L ${poleX + 6},75
                  M ${poleX - 3},120 L ${poleX + 3},115
                  M ${poleX},160 L ${poleX + 6},155
                  M ${poleX + 8},190 L ${poleX + 14},185
                  M ${poleX + 16},215 L ${poleX + 22},210
                `}
                stroke="#64748b"
                strokeWidth="1.5"
              />
              <text x={poleX - 4} y="15" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                Convex
              </text>
            </g>
          )}

          {/* Pole P Marker */}
          <circle cx={poleX} cy={axisY} r="3.5" fill="#38bdf8" />
          <text x={poleX - 10} y={axisY + 16} fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
            P (0,0)
          </text>

          {/* Principal Focus F */}
          {focusX > 5 && focusX < 435 && (
            <g>
              <circle cx={focusX} cy={axisY} r="3.5" fill="#f59e0b" />
              <text x={focusX - 4} y={axisY + 16} fill="#f59e0b" fontSize="9" fontFamily="monospace" fontWeight="bold">
                F
              </text>
              <text x={focusX - 15} y={axisY + 28} fill="#94a3b8" fontSize="7" fontFamily="monospace">
                ({effectiveF} cm)
              </text>
            </g>
          )}

          {/* Center of Curvature C (R = 2f) */}
          {centerOfCurvX > 5 && centerOfCurvX < 435 && (
            <g>
              <circle cx={centerOfCurvX} cy={axisY} r="3.5" fill="#ec4899" />
              <text x={centerOfCurvX - 4} y={axisY + 16} fill="#ec4899" fontSize="9" fontFamily="monospace" fontWeight="bold">
                C
              </text>
              <text x={centerOfCurvX - 18} y={axisY + 28} fill="#94a3b8" fontSize="7" fontFamily="monospace">
                ({2 * effectiveF} cm)
              </text>
            </g>
          )}

          {/* ============================================================== */}
          {/* OBJECT ARROW (DRAGGABLE) */}
          {/* ============================================================== */}
          <g
            className="cursor-ew-resize group"
            onPointerDown={handlePointerDown}
          >
            {/* Hit area */}
            <rect x={objX - 12} y={axisY - objPixelH - 12} width="24" height={objPixelH + 18} fill="transparent" />

            <line
              x1={objX}
              y1={axisY}
              x2={objX}
              y2={axisY - objPixelH}
              stroke="#10b981"
              strokeWidth="4"
            />
            {/* Arrowhead */}
            <polygon
              points={`${objX},${axisY - objPixelH - 6} ${objX - 5},${axisY - objPixelH + 4} ${objX + 5},${axisY - objPixelH + 4}`}
              fill="#10b981"
            />
            {/* Pulse grab ring */}
            <circle cx={objX} cy={axisY - objPixelH} r="6" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="1.5" />
            <text x={objX - 15} y={axisY - objPixelH - 10} fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">
              Object (u = {objectU} cm)
            </text>
          </g>

          {/* ============================================================== */}
          {/* IMAGE ARROW */}
          {/* ============================================================== */}
          {!isAtFocus && isFinite(imgX) && isFinite(imgPixelH) && Math.abs(calculatedV) < 95 && (
            <g>
              <line
                x1={imgX}
                y1={axisY}
                x2={imgX}
                y2={axisY - imgPixelH}
                stroke="#f59e0b"
                strokeWidth="3.5"
                strokeDasharray={calculatedV > 0 ? '4 3' : 'none'}
              />
              <polygon
                points={
                  imgPixelH > 0
                    ? `${imgX},${axisY - imgPixelH - 6} ${imgX - 5},${axisY - imgPixelH + 3} ${imgX + 5},${axisY - imgPixelH + 3}`
                    : `${imgX},${axisY - imgPixelH + 6} ${imgX - 5},${axisY - imgPixelH - 3} ${imgX + 5},${axisY - imgPixelH - 3}`
                }
                fill="#f59e0b"
              />
              <text
                x={imgX - 15}
                y={imgPixelH > 0 ? axisY - imgPixelH - 10 : axisY - imgPixelH + 18}
                fill="#f59e0b"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Image ({calculatedV > 0 ? 'Virtual' : 'Real'}, v = {Math.round(calculatedV * 10) / 10} cm)
              </text>
            </g>
          )}

          {/* ============================================================== */}
          {/* LIVE RAY TRACING PATHS */}
          {/* ============================================================== */}
          {/* RAY 1: Parallel to axis -> Passes through or appears to diverge from Focus */}
          {showRay1 && (
            <g>
              {/* Incident ray parallel to axis */}
              <line x1={objX} y1={axisY - objPixelH} x2={poleX} y2={axisY - objPixelH} stroke="#34d399" strokeWidth="1.5" />
              {mirrorType === 'concave' ? (
                calculatedV < 0 ? (
                  /* Concave Real Image: Reflects passing through real focus F on left */
                  <line
                    x1={poleX}
                    y1={axisY - objPixelH}
                    x2={Math.min(430, Math.max(10, imgX - 35))}
                    y2={axisY - imgPixelH - ((imgPixelH - objPixelH) / (imgX - poleX)) * 35}
                    stroke="#34d399"
                    strokeWidth="1.5"
                  />
                ) : (
                  /* Concave Virtual Image (between P & F): Reflects forward, dashed extension behind mirror */
                  <>
                    <line
                      x1={poleX}
                      y1={axisY - objPixelH}
                      x2={10}
                      y2={axisY - objPixelH + ((objPixelH) / (poleX - focusX)) * (poleX - 10)}
                      stroke="#34d399"
                      strokeWidth="1.5"
                    />
                    <line
                      x1={poleX}
                      y1={axisY - objPixelH}
                      x2={imgX}
                      y2={axisY - imgPixelH}
                      stroke="#34d399"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                  </>
                )
              ) : (
                /* Convex Mirror: Reflects diverging upwards into space; dashed extension through virtual focus F */
                <>
                  {(() => {
                    const divSlope = objPixelH / (focusX - poleX);
                    const divY = Math.max(10, axisY - objPixelH - divSlope * (poleX - 10));
                    return <line x1={poleX} y1={axisY - objPixelH} x2={10} y2={divY} stroke="#34d399" strokeWidth="1.5" />;
                  })()}
                  <line
                    x1={poleX}
                    y1={axisY - objPixelH}
                    x2={focusX}
                    y2={axisY}
                    stroke="#34d399"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                </>
              )}
            </g>
          )}

          {/* RAY 2: Oblique Ray to Pole P -> Reflects at equal angle */}
          {showRay2 && (
            <g>
              <line x1={objX} y1={axisY - objPixelH} x2={poleX} y2={axisY} stroke="#38bdf8" strokeWidth="1.5" />
              {mirrorType === 'concave' ? (
                calculatedV < 0 ? (
                  /* Concave Real: passes through image tip */
                  <line
                    x1={poleX}
                    y1={axisY}
                    x2={Math.min(430, Math.max(10, imgX - 35))}
                    y2={axisY - imgPixelH - (imgPixelH / (poleX - imgX)) * 35}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />
                ) : (
                  /* Concave Virtual: reflects downward in real space, dashed extension behind mirror to image tip */
                  <>
                    <line
                      x1={poleX}
                      y1={axisY}
                      x2={10}
                      y2={axisY + (objPixelH * (poleX - 10)) / (poleX - objX)}
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                    />
                    <line
                      x1={poleX}
                      y1={axisY}
                      x2={imgX}
                      y2={axisY - imgPixelH}
                      stroke="#38bdf8"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                  </>
                )
              ) : (
                /* Convex: reflects downward in real space, dashed extension behind mirror to image tip */
                <>
                  <line
                    x1={poleX}
                    y1={axisY}
                    x2={10}
                    y2={axisY + (objPixelH * (poleX - 10)) / (poleX - objX)}
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={poleX}
                    y1={axisY}
                    x2={imgX}
                    y2={axisY - imgPixelH}
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                </>
              )}
            </g>
          )}

          {/* RAY 3: Center of Curvature C Ray */}
          {showRay3 && (
            <g>
              {mirrorType === 'concave' ? (
                calculatedV < 0 ? (
                  /* Concave Real: passes through C and reflects straight back */
                  <line
                    x1={Math.min(objX, centerOfCurvX) - 20}
                    y1={axisY - objPixelH + ((objPixelH) / (centerOfCurvX - objX)) * 20}
                    x2={poleX - 10}
                    y2={axisY - objPixelH - ((objPixelH) / (centerOfCurvX - objX)) * (poleX - 10 - objX)}
                    stroke="#f472b6"
                    strokeWidth="1.2"
                    strokeDasharray="4 2"
                  />
                ) : (
                  /* Concave Virtual: ray through C passes through object tip and hits mirror */
                  <>
                    <line x1={centerOfCurvX} y1={axisY} x2={poleX - 10} y2={axisY - objPixelH - ((objPixelH) / (objX - centerOfCurvX)) * (poleX - 10 - objX)} stroke="#f472b6" strokeWidth="1.2" />
                    <line x1={poleX - 10} y1={axisY - objPixelH - ((objPixelH) / (objX - centerOfCurvX)) * (poleX - 10 - objX)} x2={imgX} y2={axisY - imgPixelH} stroke="#f472b6" strokeWidth="1.2" strokeDasharray="3 3" />
                  </>
                )
              ) : (
                /* Convex: Ray aimed at virtual C behind mirror reflects straight back */
                <>
                  <line x1={objX} y1={axisY - objPixelH} x2={poleX} y2={axisY - objPixelH + ((objPixelH) / (centerOfCurvX - objX)) * (poleX - objX)} stroke="#f472b6" strokeWidth="1.2" />
                  <line x1={poleX} y1={axisY - objPixelH + ((objPixelH) / (centerOfCurvX - objX)) * (poleX - objX)} x2={centerOfCurvX} y2={axisY} stroke="#f472b6" strokeWidth="1.2" strokeDasharray="3 3" />
                </>
              )}
            </g>
          )}
        </svg>

        {/* Live Status Readout Strip */}
        <div className="w-full flex flex-wrap items-center justify-between gap-2 mt-3 px-3 py-2 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-emerald-400 font-bold">u = {objectU} cm</span>
            <span className="text-amber-400 font-bold">
              v = {isAtFocus ? '±Infinity' : `${Math.round(calculatedV * 10) / 10} cm`}
            </span>
            <span className="text-cyan-400 font-bold">
              m = {isAtFocus ? 'Infinity' : Math.round(magnification * 100) / 100}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                calculatedV < 0
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {calculatedV < 0 ? 'REAL & INVERTED' : 'VIRTUAL & ERECT'}
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                Math.abs(magnification) > 1.05
                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                  : Math.abs(magnification) < 0.95
                  ? 'bg-blue-950 text-blue-300 border border-blue-800'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {Math.abs(magnification) > 1.05 ? 'MAGNIFIED' : Math.abs(magnification) < 0.95 ? 'DIMINISHED' : 'SAME SIZE'}
            </span>
          </div>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Standard NCERT Ray Positions & Real-World Use Cases:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                setMirrorType(p.type);
                setAbsFocalLength(p.f);
                setObjectU(p.u);
                setObjectH(p.h);
              }}
              className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-left transition space-y-1"
            >
              <div className="font-bold text-xs text-white">{p.name}</div>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls & Mathematical Formulation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Sliders */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              Direct Parameter Manipulation
            </span>
            <button
              onClick={() => {
                setMirrorType('concave');
                setAbsFocalLength(20);
                setObjectU(-35);
                setObjectH(4.5);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {/* Object distance slider */}
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-300">Object Distance (u):</span>
                <span className="text-emerald-400 font-bold">{objectU} cm</span>
              </div>
              <input
                type="range"
                min="-75"
                max="-6"
                step="0.5"
                value={objectU}
                onChange={(e) => setObjectU(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>Far (-75 cm)</span>
                <span>Near (-6 cm)</span>
              </div>
            </div>

            {/* Focal length slider */}
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-300">Focal Length Magnitude (|f|):</span>
                <span className="text-amber-400 font-bold">{absFocalLength} cm</span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                step="1"
                value={absFocalLength}
                onChange={(e) => setAbsFocalLength(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Object height slider */}
            <div>
              <div className="flex justify-between font-mono mb-1">
                <span className="text-slate-300">Object Height (h):</span>
                <span className="text-cyan-400 font-bold">{objectH} cm</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={objectH}
                onChange={(e) => setObjectH(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Live Formula Computation */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3 font-sans">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            Cartesian Sign Convention & Derivation
          </span>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
            <Formula
              tex="\frac{1}{v} + \frac{1}{u} = \frac{1}{f} \implies \frac{1}{v} = \frac{1}{f} - \frac{1}{u}"
              className="text-cyan-300"
            />
            <div className="text-[11px] text-slate-300 pt-1 border-t border-slate-800/80 space-y-1">
              <div>
                <strong>Substitution: </strong>
                <span className="text-amber-300">1/v</span> = 1/({effectiveF}) - 1/({objectU}) ={' '}
                <span className="text-emerald-400">
                  {isAtFocus ? '0 (v = ∞)' : `${Math.round((1 / effectiveF - 1 / objectU) * 1000) / 1000} cm⁻¹`}
                </span>
              </div>
              <div>
                <strong>Image Distance: </strong>
                <span className="text-amber-400 font-bold">
                  v = {isAtFocus ? '±Infinity' : `${Math.round(calculatedV * 10) / 10} cm`}
                </span>
              </div>
              <div>
                <strong>Magnification: </strong>
                <span className="text-cyan-400 font-bold">
                  m = -v/u = -({Math.round(calculatedV * 10) / 10})/({objectU}) ={' '}
                  {isAtFocus ? '∞' : Math.round(magnification * 100) / 100}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            {mirrorType === 'concave' ? (
              <>
                <strong>Concave mirror:</strong> Hollow reflective surface converges light. Center of curvature &
                focus lie in front of the mirror (f &lt; 0). When |u| &gt; |f|, a real inverted image forms in front;
                when |u| &lt; |f|, an enlarged virtual erect image forms behind.
              </>
            ) : (
              <>
                <strong>Convex mirror:</strong> Outward bulging reflective surface diverges light. Virtual focus & center
                lie behind the mirror (f &gt; 0). For any real object in front, it ALWAYS produces a virtual, erect, and
                diminished image (0 &lt; m &lt; 1), providing a broad panoramic rear view.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
