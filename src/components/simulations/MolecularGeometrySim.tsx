import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { RotateCw, Compass } from 'lucide-react';

interface MolecularGeometrySimProps {
  bondedPairs: number;
  lonePairs: number;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export const MolecularGeometrySim: React.FC<MolecularGeometrySimProps> = ({
  bondedPairs,
  lonePairs,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rotX, setRotX] = useState(0.35);
  const [rotY, setRotY] = useState(0.45);
  const isDraggingRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const totalSteric = Math.min(6, Math.max(2, bondedPairs + lonePairs));

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
      if (lonePairs === 0) return { electronGeo: 'Trigonal Planar', molecularGeo: 'Trigonal Planar', angle: '120°', hybridization: 'sp²' };
      return { electronGeo: 'Trigonal Planar', molecularGeo: 'Bent', angle: '< 120° (~117°)', hybridization: 'sp²' };
    }
    if (totalSteric === 4) {
      if (lonePairs === 0) return { electronGeo: 'Tetrahedral', molecularGeo: 'Tetrahedral', angle: '109.5°', hybridization: 'sp³' };
      if (lonePairs === 1) return { electronGeo: 'Tetrahedral', molecularGeo: 'Trigonal Pyramidal (NH₃)', angle: '~107°', hybridization: 'sp³' };
      return { electronGeo: 'Tetrahedral', molecularGeo: 'Bent (H₂O)', angle: '104.5°', hybridization: 'sp³' };
    }
    if (totalSteric === 5) {
      if (lonePairs === 0) return { electronGeo: 'Trigonal Bipyramidal', molecularGeo: 'Trigonal Bipyramidal (PCl₅)', angle: '90° & 120°', hybridization: 'sp³d' };
      if (lonePairs === 1) return { electronGeo: 'Trigonal Bipyramidal', molecularGeo: 'Seesaw (SF₄)', angle: '< 90° & < 120°', hybridization: 'sp³d' };
      if (lonePairs === 2) return { electronGeo: 'Trigonal Bipyramidal', molecularGeo: 'T-shaped (ClF₃)', angle: '~87.5°', hybridization: 'sp³d' };
      return { electronGeo: 'Trigonal Bipyramidal', molecularGeo: 'Linear (XeF₂)', angle: '180°', hybridization: 'sp³d' };
    }
    // Steric 6
    if (lonePairs === 0) return { electronGeo: 'Octahedral', molecularGeo: 'Octahedral (SF₆)', angle: '90°', hybridization: 'sp³d²' };
    if (lonePairs === 1) return { electronGeo: 'Octahedral', molecularGeo: 'Square Pyramidal (BrF₅)', angle: '< 90°', hybridization: 'sp³d²' };
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
      // 2 axial (y) + 3 equatorial (xz)
      d.push({ x: 0, y: 1, z: 0 });
      d.push({ x: 0, y: -1, z: 0 });
      d.push({ x: 1, y: 0, z: 0 });
      d.push({ x: -0.5, y: 0, z: Math.sqrt(3) / 2 });
      d.push({ x: -0.5, y: 0, z: -Math.sqrt(3) / 2 });
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
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Deep space background
    ctx.fillStyle = '#0f172a';
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

      const fov = 300;
      const scale = fov / (fov + z2 * 80 + 100);
      const px = cx + x2 * 110 * scale;
      const py = cy - y2 * 110 * scale;
      return { px, py, depth: z2 };
    };

    const domainVectors = getDomainVectors();

    // Assign domains: lone pairs occupy specific domains (equatorial in trigonal bipyramidal, trans in octahedral)
    // To sort by depth for correct painter's algorithm
    interface RenderItem {
      type: 'bond' | 'bondedAtom' | 'lonePair' | 'centralAtom';
      depth: number;
      draw: () => void;
    }
    const renderList: RenderItem[] = [];

    // Central Atom
    const centralProj = project({ x: 0, y: 0, z: 0 });
    renderList.push({
      type: 'centralAtom',
      depth: centralProj.depth,
      draw: () => {
        const grad = ctx.createRadialGradient(centralProj.px - 6, centralProj.py - 6, 2, centralProj.px, centralProj.py, 22);
        grad.addColorStop(0, '#f43f5e');
        grad.addColorStop(0.7, '#be123c');
        grad.addColorStop(1, '#881337');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centralProj.px, centralProj.py, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('A', centralProj.px, centralProj.py + 4);
      },
    });

    // Render Bonds and Peripheral Atoms / Lone Pairs
    domainVectors.forEach((vec, idx) => {
      const isLonePair = idx >= domainVectors.length - lonePairs;
      const p = project(vec);

      if (!isLonePair) {
        // Bond line
        renderList.push({
          type: 'bond',
          depth: (centralProj.depth + p.depth) / 2,
          draw: () => {
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 6;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(centralProj.px, centralProj.py);
            ctx.lineTo(p.px, p.py);
            ctx.stroke();
          },
        });

        // Bonded Peripheral Atom (cyan/emerald sphere)
        renderList.push({
          type: 'bondedAtom',
          depth: p.depth,
          draw: () => {
            const rad = 17;
            const grad = ctx.createRadialGradient(p.px - 4, p.py - 4, 2, p.px, p.py, rad);
            grad.addColorStop(0, '#38bdf8');
            grad.addColorStop(0.7, '#0284c7');
            grad.addColorStop(1, '#0369a1');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.px, p.py, rad, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('X', p.px, p.py + 4);
          },
        });
      } else {
        // Lone Pair electron cloud lobe (translucent amber/yellow lobe)
        renderList.push({
          type: 'lonePair',
          depth: p.depth,
          draw: () => {
            const lobeX = centralProj.px + (p.px - centralProj.px) * 0.85;
            const lobeY = centralProj.py + (p.py - centralProj.py) * 0.85;

            // Translucent electron density lobe
            const grad = ctx.createRadialGradient(lobeX, lobeY, 2, lobeX, lobeY, 26);
            grad.addColorStop(0, 'rgba(251, 191, 36, 0.85)');
            grad.addColorStop(0.6, 'rgba(245, 158, 11, 0.4)');
            grad.addColorStop(1, 'rgba(245, 158, 11, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(lobeX, lobeY, 26, 0, Math.PI * 2);
            ctx.fill();

            // Two paired electron dots
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(lobeX - 5, lobeY, 3, 0, Math.PI * 2);
            ctx.arc(lobeX + 5, lobeY, 3, 0, Math.PI * 2);
            ctx.fill();
          },
        });
      }
    });

    // Sort by depth (ascending: furthest back first)
    renderList.sort((a, b) => a.depth - b.depth);
    renderList.forEach((item) => item.draw());

  }, [rotX, rotY, totalSteric, bondedPairs, lonePairs]);

  return (
    <div className="space-y-4">
      {/* 3D Visualizer Canvas */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl select-none">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">3D Rotatable VSEPR Orbital Model</span>
        </div>

        {/* Rotation Hint */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-700/60 text-[11px] text-slate-400">
          <RotateCw className="w-3 h-3 text-cyan-400" />
          <span>Click & Drag to Rotate in 3D</span>
        </div>

        <canvas
          ref={canvasRef}
          className="w-full h-72 sm:h-80 block cursor-grab active:cursor-grabbing"
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

        {/* Legend */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
              Central Atom A
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-3 h-3 rounded-full bg-sky-500 inline-block"></span>
              Bonded Atom X ({bondedPairs})
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block"></span>
              Lone Pair Lobe ({lonePairs})
            </span>
          </div>
          <button
            onClick={() => {
              setRotX(0.35);
              setRotY(0.45);
            }}
            className="text-xs text-slate-400 hover:text-cyan-300 underline"
          >
            Reset 3D Angle
          </button>
        </div>
      </div>

      {/* VSEPR Classification Summary */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">VSEPR Geometric Classification</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Steric Number (SN)</div>
            <div className="text-base font-bold text-cyan-300 font-mono">{totalSteric}</div>
            <div className="text-[10px] text-slate-500">{bondedPairs} Bonds + {lonePairs} LP</div>
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
