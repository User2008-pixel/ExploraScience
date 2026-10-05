import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { RotateCw, Compass, Sliders, Play, Pause, Sparkles, Layers } from 'lucide-react';

interface MolecularGeometrySimProps {
  bondedPairs?: number;
  lonePairs?: number;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface MoleculePreset {
  name: string;
  formula: string;
  bonded: number;
  lone: number;
  centralAtom: string;
  bondedAtom: string;
}

const PRESETS: MoleculePreset[] = [
  { name: 'Beryllium Chloride', formula: 'BeCl₂', bonded: 2, lone: 0, centralAtom: 'Be', bondedAtom: 'Cl' },
  { name: 'Boron Trifluoride', formula: 'BF₃', bonded: 3, lone: 0, centralAtom: 'B', bondedAtom: 'F' },
  { name: 'Sulfur Dioxide', formula: 'SO₂', bonded: 2, lone: 1, centralAtom: 'S', bondedAtom: 'O' },
  { name: 'Methane', formula: 'CH₄', bonded: 4, lone: 0, centralAtom: 'C', bondedAtom: 'H' },
  { name: 'Ammonia', formula: 'NH₃', bonded: 3, lone: 1, centralAtom: 'N', bondedAtom: 'H' },
  { name: 'Water', formula: 'H₂O', bonded: 2, lone: 2, centralAtom: 'O', bondedAtom: 'H' },
  { name: 'Phosphorus Pentachloride', formula: 'PCl₅', bonded: 5, lone: 0, centralAtom: 'P', bondedAtom: 'Cl' },
  { name: 'Sulfur Tetrafluoride', formula: 'SF₄', bonded: 4, lone: 1, centralAtom: 'S', bondedAtom: 'F' },
  { name: 'Chlorine Trifluoride', formula: 'ClF₃', bonded: 3, lone: 2, centralAtom: 'Cl', bondedAtom: 'F' },
  { name: 'Xenon Difluoride', formula: 'XeF₂', bonded: 2, lone: 3, centralAtom: 'Xe', bondedAtom: 'F' },
  { name: 'Sulfur Hexafluoride', formula: 'SF₆', bonded: 6, lone: 0, centralAtom: 'S', bondedAtom: 'F' },
  { name: 'Bromine Pentafluoride', formula: 'BrF₅', bonded: 5, lone: 1, centralAtom: 'Br', bondedAtom: 'F' },
  { name: 'Xenon Tetrafluoride', formula: 'XeF₄', bonded: 4, lone: 2, centralAtom: 'Xe', bondedAtom: 'F' },
];

export const MolecularGeometrySim: React.FC<MolecularGeometrySimProps> = ({
  bondedPairs: initialBonds = 4,
  lonePairs: initialLones = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bonds, setBonds] = useState<number>(initialBonds);
  const [lones, setLones] = useState<number>(initialLones);
  const [rotX, setRotX] = useState<number>(0.35);
  const [rotY, setRotY] = useState<number>(0.45);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showLonePairs, setShowLonePairs] = useState<boolean>(true);
  const [showAngles, setShowAngles] = useState<boolean>(true);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Steric number: max 6, min 2
  const totalSteric = Math.min(6, Math.max(2, bonds + lones));

  // Auto-rotation loop
  useEffect(() => {
    if (!autoRotate) return;
    let animId: number;
    const spin = () => {
      if (!isDraggingRef.current) {
        setRotY((prev) => prev + 0.008);
      }
      animId = requestAnimationFrame(spin);
    };
    animId = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(animId);
  }, [autoRotate]);

  // Determine geometry name and ideal angle
  const getGeometryInfo = () => {
    if (totalSteric === 2) {
      return {
        electronGeo: 'Linear',
        molecularGeo: 'Linear',
        angle: '180°',
        hybridization: 'sp',
      };
    }
    if (totalSteric === 3) {
      if (lones === 0) return { electronGeo: 'Trigonal Planar', molecularGeo: 'Trigonal Planar', angle: '120°', hybridization: 'sp²' };
      return { electronGeo: 'Trigonal Planar', molecularGeo: 'Bent', angle: '< 120° (~118°)', hybridization: 'sp²' };
    }
    if (totalSteric === 4) {
      if (lones === 0) return { electronGeo: 'Tetrahedral', molecularGeo: 'Tetrahedral', angle: '109.5°', hybridization: 'sp³' };
      if (lones === 1) return { electronGeo: 'Tetrahedral', molecularGeo: 'Trigonal Pyramidal (NH₃)', angle: '~107°', hybridization: 'sp³' };
      return { electronGeo: 'Tetrahedral', molecularGeo: 'Bent (H₂O)', angle: '104.5°', hybridization: 'sp³' };
    }
    if (totalSteric === 5) {
      if (lones === 0) return { electronGeo: 'Trigonal Bipyramidal', molecularGeo: 'Trigonal Bipyramidal', angle: '90° & 120°', hybridization: 'sp³d' };
      if (lones === 1) return { electronGeo: 'Trigonal Bipyramidal', molecularGeo: 'Seesaw (SF₄)', angle: '< 90° & < 120°', hybridization: 'sp³d' };
      if (lones === 2) return { electronGeo: 'Trigonal Bipyramidal', molecularGeo: 'T-shaped (ClF₃)', angle: '~87.5°', hybridization: 'sp³d' };
      return { electronGeo: 'Trigonal Bipyramidal', molecularGeo: 'Linear (XeF₂)', angle: '180°', hybridization: 'sp³d' };
    }
    // Steric 6
    if (lones === 0) return { electronGeo: 'Octahedral', molecularGeo: 'Octahedral (SF₆)', angle: '90°', hybridization: 'sp³d²' };
    if (lones === 1) return { electronGeo: 'Octahedral', molecularGeo: 'Square Pyramidal (BrF₅)', angle: '< 90°', hybridization: 'sp³d²' };
    return { electronGeo: 'Octahedral', molecularGeo: 'Square Planar (XeF₄)', angle: '90°', hybridization: 'sp³d²' };
  };

  const geoInfo = getGeometryInfo();

  // Compute unit 3D vectors for steric shapes
  const getDomainVectors = (): Vec3[] => {
    const d: Vec3[] = [];
    if (totalSteric === 2) {
      d.push({ x: 0, y: 1, z: 0 });
      d.push({ x: 0, y: -1, z: 0 });
    } else if (totalSteric === 3) {
      d.push({ x: 0, y: 1, z: 0 });
      d.push({ x: Math.cos((Math.PI * 7) / 6), y: Math.sin((Math.PI * 7) / 6), z: 0 });
      d.push({ x: Math.cos((Math.PI * 11) / 6), y: Math.sin((Math.PI * 11) / 6), z: 0 });
    } else if (totalSteric === 4) {
      d.push({ x: 0, y: 1, z: 0 });
      d.push({ x: Math.sqrt(8 / 9), y: -1 / 3, z: 0 });
      d.push({ x: -Math.sqrt(2 / 9), y: -1 / 3, z: Math.sqrt(2 / 3) });
      d.push({ x: -Math.sqrt(2 / 9), y: -1 / 3, z: -Math.sqrt(2 / 3) });
    } else if (totalSteric === 5) {
      // 2 axial (y) + 3 equatorial (xz) - in steric 5, lone pairs occupy equatorial positions first!
      d.push({ x: 1, y: 0, z: 0 });
      d.push({ x: -0.5, y: 0, z: Math.sqrt(3) / 2 });
      d.push({ x: -0.5, y: 0, z: -Math.sqrt(3) / 2 });
      d.push({ x: 0, y: 1, z: 0 });
      d.push({ x: 0, y: -1, z: 0 });
    } else {
      // Steric 6: 6 octahedral vertices
      d.push({ x: 0, y: 1, z: 0 });
      d.push({ x: 0, y: -1, z: 0 });
      d.push({ x: 1, y: 0, z: 0 });
      d.push({ x: -1, y: 0, z: 0 });
      d.push({ x: 0, y: 0, z: 1 });
      d.push({ x: 0, y: 0, z: -1 });
    }
    return d;
  };

  // Render 3D Canvas
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
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Deep space background
    ctx.fillStyle = '#0a1024';
    ctx.fillRect(0, 0, w, h);

    // 3D rotation transform matrices
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    const project = (v: Vec3): { px: number; py: number; depth: number } => {
      // Rotate around Y
      const x1 = v.x * cosY + v.z * sinY;
      const y1 = v.y;
      const z1 = -v.x * sinY + v.z * cosY;

      // Rotate around X
      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      const fov = 320;
      const scale = fov / (fov + z2 * 80 + 100);
      const px = cx + x2 * 115 * scale;
      const py = cy - y2 * 115 * scale;
      return { px, py, depth: z2 };
    };

    const domains = getDomainVectors();

    // Map domains into bonded vs lone pair
    const items = domains.map((vec, idx) => {
      const isLonePair = idx < lones;
      return { vec, isLonePair, proj: project(vec) };
    });

    // Sort by depth (painter's algorithm)
    items.sort((a, b) => a.proj.depth - b.proj.depth);

    // Draw Central Atom A
    const centerProj = project({ x: 0, y: 0, z: 0 });

    // Draw Bonds and Lobes behind central atom
    items.forEach((item) => {
      if (item.proj.depth <= 0) {
        drawDomain(ctx, centerProj, item);
      }
    });

    // Draw Central Atom
    const centerGrad = ctx.createRadialGradient(
      centerProj.px - 4,
      centerProj.py - 4,
      3,
      centerProj.px,
      centerProj.py,
      22
    );
    centerGrad.addColorStop(0, '#fda4af');
    centerGrad.addColorStop(0.6, '#f43f5e');
    centerGrad.addColorStop(1, '#be123c');
    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(centerProj.px, centerProj.py, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffe4e6';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', centerProj.px, centerProj.py);

    // Draw Bonds and Lobes in front of central atom
    items.forEach((item) => {
      if (item.proj.depth > 0) {
        drawDomain(ctx, centerProj, item);
      }
    });

    function drawDomain(
      ctx2: CanvasRenderingContext2D,
      cProj: { px: number; py: number; depth: number },
      it: { vec: Vec3; isLonePair: boolean; proj: { px: number; py: number; depth: number } }
    ) {
      if (it.isLonePair) {
        if (!showLonePairs) return;
        // Draw teardrop lone pair electron cloud
        ctx2.save();
        ctx2.beginPath();
        ctx2.moveTo(cProj.px, cProj.py);
        const lobeMidX = (cProj.px + it.proj.px) / 2;
        const lobeMidY = (cProj.py + it.proj.py) / 2;
        ctx2.quadraticCurveTo(lobeMidX + 16, lobeMidY, it.proj.px, it.proj.py);
        ctx2.quadraticCurveTo(lobeMidX - 16, lobeMidY, cProj.px, cProj.py);

        const lpGrad = ctx2.createRadialGradient(it.proj.px, it.proj.py, 2, it.proj.px, it.proj.py, 28);
        lpGrad.addColorStop(0, 'rgba(251, 191, 36, 0.7)');
        lpGrad.addColorStop(1, 'rgba(217, 119, 6, 0.15)');
        ctx2.fillStyle = lpGrad;
        ctx2.fill();
        ctx2.strokeStyle = '#f59e0b';
        ctx2.lineWidth = 1.5;
        ctx2.setLineDash([3, 3]);
        ctx2.stroke();
        ctx2.setLineDash([]);

        // Two dots for lone pair electrons
        ctx2.fillStyle = '#fbbf24';
        ctx2.beginPath();
        ctx2.arc(it.proj.px - 4, it.proj.py, 2.5, 0, Math.PI * 2);
        ctx2.arc(it.proj.px + 4, it.proj.py, 2.5, 0, Math.PI * 2);
        ctx2.fill();

        ctx2.restore();
      } else {
        // Draw rigid chemical bond cylinder
        ctx2.beginPath();
        ctx2.moveTo(cProj.px, cProj.py);
        ctx2.lineTo(it.proj.px, it.proj.py);
        ctx2.strokeStyle = '#94a3b8';
        ctx2.lineWidth = 6;
        ctx2.stroke();

        // Bonded Atom X sphere
        const bondGrad = ctx2.createRadialGradient(
          it.proj.px - 3,
          it.proj.py - 3,
          2,
          it.proj.px,
          it.proj.py,
          16
        );
        bondGrad.addColorStop(0, '#7dd3fc');
        bondGrad.addColorStop(0.6, '#0284c7');
        bondGrad.addColorStop(1, '#0369a1');
        ctx2.fillStyle = bondGrad;
        ctx2.beginPath();
        ctx2.arc(it.proj.px, it.proj.py, 15, 0, Math.PI * 2);
        ctx2.fill();
        ctx2.strokeStyle = '#e0f2fe';
        ctx2.lineWidth = 1.5;
        ctx2.stroke();

        ctx2.fillStyle = '#ffffff';
        ctx2.font = 'bold 10px sans-serif';
        ctx2.textAlign = 'center';
        ctx2.textBaseline = 'middle';
        ctx2.fillText('X', it.proj.px, it.proj.py);
      }
    }

    ctx.restore();
  }, [bonds, lones, rotX, rotY, totalSteric, showLonePairs]);

  return (
    <div className="space-y-4">
      {/* 3D Interactive Canvas Display */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0a1024] shadow-2xl">
        <canvas
          ref={canvasRef}
          className="w-full h-80 block cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => {
            isDraggingRef.current = true;
            lastMousePos.current = { x: e.clientX, y: e.clientY };
          }}
          onMouseMove={(e) => {
            if (!isDraggingRef.current) return;
            const dx = e.clientX - lastMousePos.current.x;
            const dy = e.clientY - lastMousePos.current.y;
            lastMousePos.current = { x: e.clientX, y: e.clientY };
            setRotY((prev) => prev + dx * 0.015);
            setRotX((prev) => prev + dy * 0.015);
          }}
          onMouseUp={() => {
            isDraggingRef.current = false;
          }}
          onMouseLeave={() => {
            isDraggingRef.current = false;
          }}
          onTouchStart={(e) => {
            if (e.touches.length === 1) {
              isDraggingRef.current = true;
              lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
          }}
          onTouchMove={(e) => {
            if (!isDraggingRef.current || e.touches.length !== 1) return;
            const dx = e.touches[0].clientX - lastMousePos.current.x;
            const dy = e.touches[0].clientY - lastMousePos.current.y;
            lastMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            setRotY((prev) => prev + dx * 0.015);
            setRotX((prev) => prev + dy * 0.015);
          }}
          onTouchEnd={() => {
            isDraggingRef.current = false;
          }}
        />

        {/* Top Controls Overlay */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300 font-medium">3D Drag to Orbit / Rotate</span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition ${
                autoRotate
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-900/90 text-slate-400 border-slate-700'
              }`}
              title="Toggle Auto Spin"
            >
              {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>Auto-Spin</span>
            </button>
            <button
              onClick={() => {
                setRotX(0.35);
                setRotY(0.45);
              }}
              className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition"
              title="Reset 3D Orientation"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas Legend Bottom */}
        <div className="p-3 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
              Central Atom A
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span>
              Bonded Atom X ({bonds})
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block"></span>
              Lone Pair Lobe ({lones})
            </span>
          </div>
          <button
            onClick={() => setShowLonePairs(!showLonePairs)}
            className="text-xs text-amber-300 hover:underline"
          >
            {showLonePairs ? 'Hide Lone Pairs' : 'Show Lone Pairs'}
          </button>
        </div>
      </div>

      {/* Direct Manipulation Sliders & Presets */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              VSEPR Electron Domain & Geometry Manipulator
            </h4>
          </div>
          <span className="text-xs text-amber-400 font-mono font-bold bg-amber-950/80 border border-amber-800 px-2.5 py-0.5 rounded-full">
            Steric Number: {totalSteric} ({geoInfo.hybridization})
          </span>
        </div>

        {/* Interactive Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">Bonded Electron Pairs (Bonds):</span>
              <span className="font-mono font-bold text-sky-400 text-sm">{bonds}</span>
            </div>
            <input
              type="range"
              min="2"
              max="6"
              step="1"
              value={bonds}
              onChange={(e) => {
                const newBonds = parseInt(e.target.value);
                setBonds(newBonds);
                if (newBonds + lones > 6) {
                  setLones(6 - newBonds);
                }
              }}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between gap-1 pt-1">
              {[2, 3, 4, 5, 6].map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setBonds(b);
                    if (b + lones > 6) setLones(6 - b);
                  }}
                  className={`flex-1 py-1 rounded text-xs font-mono font-bold transition ${
                    bonds === b ? 'bg-sky-500 text-slate-950' : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {b} Bonds
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-300 font-medium">Non-Bonding Lone Pairs (LP):</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{lones}</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              value={lones}
              onChange={(e) => {
                const newLones = parseInt(e.target.value);
                setLones(newLones);
                if (bonds + newLones > 6) {
                  setBonds(6 - newLones);
                }
              }}
              className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between gap-1 pt-1">
              {[0, 1, 2, 3].map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLones(l);
                    if (bonds + l > 6) setBonds(6 - l);
                  }}
                  className={`flex-1 py-1 rounded text-xs font-mono font-bold transition ${
                    lones === l ? 'bg-amber-500 text-slate-950' : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {l} LP
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real Molecule Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 space-y-2">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
            NCERT Real Molecule Presets:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => {
              const isActive = bonds === p.bonded && lones === p.lone;
              return (
                <button
                  key={p.formula}
                  onClick={() => {
                    setBonds(p.bonded);
                    setLones(p.lone);
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  {p.formula} ({p.name})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* VSEPR Classification Summary */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          VSEPR Geometric Classification
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Steric Number (SN)</div>
            <div className="text-base font-bold text-cyan-300 font-mono">{totalSteric}</div>
            <div className="text-[10px] text-slate-500">
              {bonds} Bonds + {lones} LP
            </div>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Electron Domain Geometry</div>
            <div className="text-sm font-bold text-amber-300">{geoInfo.electronGeo}</div>
            <div className="text-[10px] text-slate-500">Hybridization: {geoInfo.hybridization}</div>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Molecular Geometry (Shape)</div>
            <div className="text-sm font-bold text-emerald-400">{geoInfo.molecularGeo}</div>
            <div className="text-[10px] text-slate-500">Observable nuclei arrangement</div>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Characteristic Bond Angle</div>
            <div className="text-sm font-bold text-white font-mono">{geoInfo.angle}</div>
            <div className="text-[10px] text-slate-500">Repulsion: LP-LP &gt; LP-BP &gt; BP-BP</div>
          </div>
        </div>
      </div>
    </div>
  );
};
