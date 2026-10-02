import React, { useState } from 'react';
import { Eye, HelpCircle, RotateCcw, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

interface ConvexLensSimProps {
  trueFocalLengthCm?: number; // e.g. 15.0 cm
}

export const ConvexLensSim: React.FC<ConvexLensSimProps> = ({
  trueFocalLengthCm = 15.0,
}) => {
  // Optical Bench Positions (0 to 150 cm)
  // Lens is fixed at 50.0 cm upright
  const lensPositionCm = 50.0;
  // Object needle pin position (0 to 50 cm), so u = -(lens - object)
  const [objectPinPosCm, setObjectPinPosCm] = useState<number>(25.0); // u = -25 cm
  // Image needle pin position (50 to 150 cm)
  const [imagePinPosCm, setImagePinPosCm] = useState<number>(87.5);
  // Observer eye position offset for testing parallax
  const [eyeShiftOffsetPx, setEyeShiftOffsetPx] = useState<number>(0);
  const [showRayDiagram, setShowRayDiagram] = useState<boolean>(true);

  // Physics calculation:
  // 1/f = 1/v - 1/u
  // Cartesian distances:
  const u = -(lensPositionCm - objectPinPosCm); // negative, e.g. -25 cm
  // Real focal length:
  const f = trueFocalLengthCm; // +15 cm

  // Lens formula: 1/v = 1/f + 1/u => v = (f * u) / (u + f)
  // If |u| > f, real inverted image is formed at v:
  const isRealImage = Math.abs(u) > f;
  const theoreticalV = isRealImage ? (f * u) / (u + f) : Infinity; // e.g. (15 * -25) / (-25 + 15) = -375 / -10 = +37.5 cm
  const idealImagePinPosCm = lensPositionCm + theoreticalV; // 50 + 37.5 = 87.5 cm

  // Parallax difference between actual image needle position and ideal image focal plane
  const parallaxDiffCm = imagePinPosCm - idealImagePinPosCm;
  // Apparent shift between inverted image tip and image needle tip when eye shifts sideways:
  const apparentParallaxShiftPx = eyeShiftOffsetPx * (parallaxDiffCm / 10);
  const isParallaxRemoved = Math.abs(parallaxDiffCm) < 0.4;

  // Calculated experimental focal length from current uprights:
  const observedV = imagePinPosCm - lensPositionCm;
  const calculatedF = (observedV * Math.abs(u)) / (observedV + Math.abs(u));

  // Magnification m = v / u
  const magnification = isRealImage ? -(theoreticalV / Math.abs(u)) : 1;

  return (
    <div className="bg-[#0c1427] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
              Class 12 Physics Practical
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Optical Bench: Convex Lens Focal Length (u-v Method)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Remove optical parallax between inverted image and image needle. Plot 1/v vs 1/u to determine focal length f.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Preset Selector */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
            <span className="text-slate-400">Object Position:</span>
            <select
              value={objectPinPosCm}
              onChange={(e) => {
                const newObj = parseFloat(e.target.value);
                setObjectPinPosCm(newObj);
                const newU = -(lensPositionCm - newObj);
                const newV = (f * newU) / (newU + f);
                setImagePinPosCm(Number((lensPositionCm + newV).toFixed(1)));
              }}
              className="bg-transparent text-purple-300 font-mono font-bold focus:outline-none cursor-pointer"
            >
              <option value="20" className="bg-slate-900 text-white">u = -30 cm (2F condition: v = +30 cm)</option>
              <option value="25" className="bg-slate-900 text-white">u = -25 cm (v = +37.5 cm)</option>
              <option value="30" className="bg-slate-900 text-white">u = -20 cm (v = +60.0 cm)</option>
              <option value="15" className="bg-slate-900 text-white">u = -35 cm (v = +26.2 cm)</option>
            </select>
          </div>

          <button
            onClick={() => {
              setObjectPinPosCm(25.0);
              setImagePinPosCm(87.5);
              setEyeShiftOffsetPx(0);
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
            title="Reset Uprights"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Optical Bench Apparatus Schematic (SVG) */}
      <div className="relative bg-gradient-to-b from-[#0e172a] to-[#070b14] border border-slate-800 rounded-xl p-4 overflow-hidden">
        <svg viewBox="0 0 760 210" className="w-full h-auto select-none font-mono">
          {/* Heavy Steel Optical Bench Bed */}
          <rect x="30" y="150" width="700" height="24" fill="#1e293b" stroke="#334155" rx="3" />
          <line x1="30" y1="162" x2="730" y2="162" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />

          {/* Scale Markings on Bench (0 to 150 cm) */}
          {Array.from({ length: 16 }).map((_, i) => {
            const cmVal = i * 10;
            const x = 50 + (cmVal / 150) * 660;
            return (
              <g key={i}>
                <line x1={x} y1="150" x2={x} y2="158" stroke="#cbd5e1" strokeWidth="1.5" />
                <text x={x} y="170" fill="#94a3b8" fontSize="8" textAnchor="middle">
                  {cmVal}
                </text>
              </g>
            );
          })}

          {/* Principal Optical Axis Line */}
          <line x1="40" y1="80" x2="720" y2="80" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="3,3" strokeOpacity="0.4" />

          {/* Object Pin Upright (P₁) */}
          {(() => {
            const objX = 50 + (objectPinPosCm / 150) * 660;
            return (
              <g>
                <rect x={objX - 6} y="80" width="12" height="70" fill="#334155" rx="2" />
                {/* Upright base clamp */}
                <rect x={objX - 14} y="142" width="28" height="12" fill="#475569" rx="2" />
                {/* Object Pin Needle (pointing up) */}
                <line x1={objX} y1="80" x2={objX} y2="35" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                <polygon points={`${objX},30 ${objX - 4},38 ${objX + 4},38`} fill="#f59e0b" />
                <text x={objX} y="22" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Object Pin (P₁)
                </text>
                <text x={objX} y="138" fill="#fcd34d" fontSize="9" textAnchor="middle">
                  {objectPinPosCm} cm
                </text>
              </g>
            );
          })()}

          {/* Convex Lens Upright (Fixed at 50 cm) */}
          {(() => {
            const lensX = 50 + (lensPositionCm / 150) * 660;
            return (
              <g>
                {/* Lens stand upright */}
                <rect x={lensX - 5} y="80" width="10" height="70" fill="#334155" rx="2" />
                <rect x={lensX - 16} y="142" width="32" height="12" fill="#64748b" rx="2" />
                {/* Glass Convex Lens Element */}
                <ellipse cx={lensX} cy="80" rx="9" ry="50" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" />
                <circle cx={lensX} cy="80" r="3" fill="#e0f2fe" />
                <text x={lensX} y="20" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Convex Lens (f = {trueFocalLengthCm} cm)
                </text>
                <text x={lensX} y="138" fill="#7dd3fc" fontSize="9" textAnchor="middle">
                  50.0 cm
                </text>
              </g>
            );
          })()}

          {/* Inverted Real Image in Air (at theoreticalV) */}
          {isRealImage && (() => {
            const imgPlaneX = 50 + (idealImagePinPosCm / 150) * 660;
            const imgHeight = 45 * Math.abs(magnification);
            return (
              <g>
                {/* Real inverted image arrow pointing downwards */}
                <line x1={imgPlaneX} y1="80" x2={imgPlaneX} y2={80 + Math.min(55, imgHeight)} stroke="#ec4899" strokeWidth="2.5" strokeDasharray="3,2" />
                <polygon
                  points={`${imgPlaneX},${80 + Math.min(55, imgHeight) + 6} ${imgPlaneX - 4},${80 + Math.min(55, imgHeight)} ${imgPlaneX + 4},${80 + Math.min(55, imgHeight)}`}
                  fill="#ec4899"
                />
                <text x={imgPlaneX} y="138" fill="#ec4899" fontSize="9" textAnchor="middle">
                  Image: {idealImagePinPosCm.toFixed(1)} cm
                </text>
              </g>
            );
          })()}

          {/* Image Needle Upright (P₂) (Adjustable by student to remove parallax) */}
          {(() => {
            const pinX = 50 + (imagePinPosCm / 150) * 660;
            return (
              <g>
                <rect x={pinX - 6} y="80" width="12" height="70" fill="#334155" rx="2" />
                <rect x={pinX - 14} y="142" width="28" height="12" fill="#475569" rx="2" />
                {/* Inverted needle pointing downwards to meet image tip */}
                <line x1={pinX} y1="140" x2={pinX} y2="120" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                <polygon points={`${pinX},114 ${pinX - 4},122 ${pinX + 4},122`} fill="#10b981" />
                <text x={pinX} y="196" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Image Needle (P₂): {imagePinPosCm} cm
                </text>
              </g>
            );
          })()}

          {/* Light Rays traced from Object Pin through Lens to Image */}
          {showRayDiagram && isRealImage && (() => {
            const objX = 50 + (objectPinPosCm / 150) * 660;
            const lensX = 50 + (lensPositionCm / 150) * 660;
            const imgX = 50 + (idealImagePinPosCm / 150) * 660;
            const objTipY = 35;
            const imgTipY = 80 + Math.min(55, 45 * Math.abs(magnification));
            return (
              <g strokeOpacity="0.6">
                {/* Ray 1: Parallel to axis, passes through principal focus F */}
                <line x1={objX} y1={objTipY} x2={lensX} y2={objTipY} stroke="#f59e0b" strokeWidth="1.5" />
                <line x1={lensX} y1={objTipY} x2={imgX} y2={imgTipY} stroke="#f59e0b" strokeWidth="1.5" />
                {/* Ray 2: Passes straight through optical center O undeflected */}
                <line x1={objX} y1={objTipY} x2={imgX} y2={imgTipY} stroke="#38bdf8" strokeWidth="1.5" />
              </g>
            );
          })()}
        </svg>

        {/* Parallax Status Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 ${
              isParallaxRemoved
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
            }`}
          >
            {isParallaxRemoved ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Parallax Removed! (Pins Locked)</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-rose-400" />
                <span>Parallax Present (Δ = {parallaxDiffCm > 0 ? `+${parallaxDiffCm.toFixed(1)}` : parallaxDiffCm.toFixed(1)} cm)</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Controls: Upright Adjustments & Parallax Eye Tester */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
        {/* Object Pin Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold">Object Pin Position (P₁):</span>
            <span className="font-mono font-bold text-amber-300">{objectPinPosCm.toFixed(1)} cm (u = {u.toFixed(1)} cm)</span>
          </div>
          <input
            type="range"
            min="10"
            max="34"
            step="0.5"
            value={objectPinPosCm}
            onChange={(e) => setObjectPinPosCm(parseFloat(e.target.value))}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>10.0 cm</span>
            <span>25.0 cm</span>
            <span>34.0 cm (near F)</span>
          </div>
        </div>

        {/* Image Pin Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold">Image Needle Position (P₂):</span>
            <span className="font-mono font-bold text-emerald-400">{imagePinPosCm.toFixed(1)} cm (v = +{observedV.toFixed(1)} cm)</span>
          </div>
          <input
            type="range"
            min="65"
            max="135"
            step="0.5"
            value={imagePinPosCm}
            onChange={(e) => setImagePinPosCm(parseFloat(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>65.0 cm</span>
            <span>Ideal: {idealImagePinPosCm.toFixed(1)} cm</span>
            <span>135.0 cm</span>
          </div>
        </div>

        {/* Eye Sideways Parallax Tester */}
        <div className="md:col-span-2 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Observer Head / Eye Sideways Motion (Test for Parallax):</span>
            </span>
            <span className="font-mono text-cyan-300 font-bold">{eyeShiftOffsetPx > 0 ? `+${eyeShiftOffsetPx}px Right` : eyeShiftOffsetPx < 0 ? `${eyeShiftOffsetPx}px Left` : 'Center Line'}</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="2"
            value={eyeShiftOffsetPx}
            onChange={(e) => setEyeShiftOffsetPx(parseInt(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">
            {isParallaxRemoved
              ? '✅ Perfect: Both pin tips stay locked together as your eye shifts sideways. Parallax is zero!'
              : '⚠️ Shift detected: The inverted image and the image needle move relative to each other. Adjust the Image Needle slider until they remain glued together!'}
          </p>
        </div>
      </div>

      {/* Optical Bench Calculation Breakdown */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
            Lens Formula Calculation (Gaussian Form):
          </span>
          <span className="text-purple-300 font-bold">
            Experimental Focal Length f = {calculatedF.toFixed(2)} cm (Theoretical = {trueFocalLengthCm} cm)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Object Distance (u):</span>
            <span className="text-amber-300 font-bold text-sm">{u.toFixed(1)} cm</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">1/u = {(1 / u).toFixed(4)} cm⁻¹</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">Image Distance (v):</span>
            <span className="text-emerald-400 font-bold text-sm">+{observedV.toFixed(1)} cm</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">1/v = {(1 / observedV).toFixed(4)} cm⁻¹</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-slate-500 block text-[10px]">1/v - 1/u = 1/f:</span>
            <span className="text-cyan-300 font-bold text-sm">
              {(1 / observedV - 1 / u).toFixed(4)} cm⁻¹
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              f = 1 / ({ (1 / observedV - 1 / u).toFixed(4)} ) = {calculatedF.toFixed(2)} cm
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
