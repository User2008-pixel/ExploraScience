import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Play, Pause, RotateCcw, Sliders, Droplet, Anchor, Sparkles, Scale, Layers } from 'lucide-react';

interface ArchimedesBuoyancySimProps {
  initialDensity?: number;
  initialVolume?: number;
}

type MaterialPreset = 'wood' | 'ice' | 'cork' | 'paper' | 'sponge' | 'iron' | 'custom';

export const ArchimedesBuoyancySim: React.FC<ArchimedesBuoyancySimProps> = ({
  initialDensity = 0.6,
  initialVolume = 500,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Material & Object State
  const [preset, setPreset] = useState<MaterialPreset>('wood');
  const [density, setDensity] = useState<number>(initialDensity); // g/cm³
  const [volume, setVolume] = useState<number>(initialVolume); // cm³
  const [fluidDensity, setFluidDensity] = useState<number>(1.0); // g/cm³ (water = 1.0)
  const [spongeWet, setSpongeWet] = useState<boolean>(false);

  // Physics Calculations
  // 1 cm³ = 1e-6 m³; 1 g/cm³ = 1000 kg/m³
  const massKg = (density * volume) / 1000; // mass in kg
  const trueWeightN = massKg * 9.8; // Weight W = mg
  
  // Displaced volume when fully submerged (cm³)
  const fullSubmergedDispVol = volume; 
  const maxBuoyantForceN = (fullSubmergedDispVol / 1000000) * (fluidDensity * 1000) * 9.8;

  // Equilibrium submerged fraction
  // If density <= fluidDensity, fraction submerged = density / fluidDensity
  // If density > fluidDensity, fraction submerged = 1.0 (sinks)
  const fractionSubmerged = Math.min(1.0, Math.max(0.0, density / fluidDensity));
  const apparentWeightN = Math.max(0, trueWeightN - (fractionSubmerged * maxBuoyantForceN));
  const buoyantForceN = fractionSubmerged * maxBuoyantForceN;
  const isFloating = density <= fluidDensity;

  // Preset handler
  const applyPreset = (p: MaterialPreset) => {
    setPreset(p);
    setSpongeWet(false);
    if (p === 'wood') {
      setDensity(0.6);
      setVolume(600);
      setFluidDensity(1.0);
    } else if (p === 'ice') {
      setDensity(0.92);
      setVolume(800);
      setFluidDensity(1.0);
    } else if (p === 'cork') {
      setDensity(0.24);
      setVolume(500);
      setFluidDensity(1.0);
    } else if (p === 'paper') {
      setDensity(0.75);
      setVolume(400);
      setFluidDensity(1.0);
    } else if (p === 'sponge') {
      setDensity(0.3); // dry sponge
      setVolume(700);
      setFluidDensity(1.0);
    } else if (p === 'iron') {
      setDensity(7.8);
      setVolume(300);
      setFluidDensity(1.0);
    }
  };

  // Canvas Animation & Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#070e1c';
    ctx.fillRect(0, 0, width, height);

    // Tank dimensions
    const tankX = 140;
    const tankY = 50;
    const tankW = width - 280;
    const tankH = height - 100;
    const waterLevelY = tankY + 80; // Water line

    // Draw Water Tank
    ctx.fillStyle = 'rgba(14, 165, 233, 0.15)';
    ctx.fillRect(tankX, waterLevelY, tankW, tankY + tankH - waterLevelY);

    // Water surface waves/line
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(tankX, waterLevelY);
    for (let x = tankX; x <= tankX + tankW; x += 15) {
      ctx.lineTo(x, waterLevelY + Math.sin(x * 0.08) * 3);
    }
    ctx.stroke();

    // Tank glass border
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 4;
    ctx.strokeRect(tankX, tankY, tankW, tankH);

    // Object Dimensions based on volume
    const objSize = Math.max(35, Math.min(85, Math.cbrt(volume) * 7));
    const objCenterX = tankX + tankW / 2;

    // Calculate vertical position of object in tank
    // Water region starts at waterLevelY and ends at tankY + tankH
    const waterDepth = tankY + tankH - waterLevelY;
    
    // Submerged height
    const submergedHeight = objSize * fractionSubmerged;
    
    // If floating, top of object is at waterLevelY - objSize * (1 - fractionSubmerged)
    // If sinking, bottom rests at tankY + tankH - objSize
    let objTopY = waterLevelY - submergedHeight;
    if (!isFloating) {
      objTopY = tankY + tankH - objSize; // rests on bottom
    }

    // Draw Spring Balance if sinking or held above
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(objCenterX, tankY - 10);
    ctx.lineTo(objCenterX, objTopY);
    ctx.stroke();

    // Spring coil
    ctx.fillStyle = '#64748b';
    for (let sy = tankY + 10; sy < tankY + 30; sy += 5) {
      ctx.fillRect(objCenterX - 6, sy, 12, 3);
    }

    // Spring balance dial/hook
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(objCenterX - 20, tankY - 15, 40, 25);
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(objCenterX - 20, tankY - 15, 40, 25);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${apparentWeightN.toFixed(1)} N`, objCenterX, tankY + 2);

    // Draw Object (Wood, Ice, Cork, Sponge, Iron)
    let fillColor = '#d97706'; // wood brown
    let strokeColor = '#b45309';
    let labelText = 'Wood';

    if (preset === 'ice') {
      fillColor = 'rgba(224, 242, 254, 0.85)';
      strokeColor = '#7dd3fc';
      labelText = 'Ice';
    } else if (preset === 'cork') {
      fillColor = '#fde68a';
      strokeColor = '#d97706';
      labelText = 'Cork';
    } else if (preset === 'paper') {
      fillColor = '#fef3c7';
      strokeColor = '#d97706';
      labelText = 'Paper Block';
    } else if (preset === 'sponge') {
      fillColor = spongeWet ? '#0284c7' : '#facc15';
      strokeColor = spongeWet ? '#0369a1' : '#ca8a04';
      labelText = spongeWet ? 'Wet Sponge' : 'Dry Sponge';
    } else if (preset === 'iron') {
      fillColor = '#64748b';
      strokeColor = '#334155';
      labelText = 'Iron Block';
    } else {
      labelText = `Custom (ρ=${density}g/cm³)`;
      fillColor = density <= fluidDensity ? '#38bdf8' : '#f43f5e';
      strokeColor = density <= fluidDensity ? '#0284c7' : '#be123c';
    }

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(objCenterX - objSize / 2, objTopY, objSize, objSize, 8);
    ctx.fill();
    ctx.stroke();

    // Label on object
    ctx.fillStyle = preset === 'iron' || (preset === 'custom' && density > fluidDensity) ? '#ffffff' : '#0f172a';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labelText, objCenterX, objTopY + objSize / 2 + 4);

    // Buoyant Force Upward Arrow (F_B)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    const fbArrowLen = Math.min(70, Math.max(25, buoyantForceN * 8));
    ctx.beginPath();
    ctx.moveTo(objCenterX - 15, objTopY + objSize / 2);
    ctx.lineTo(objCenterX - 15, objTopY + objSize / 2 - fbArrowLen);
    ctx.lineTo(objCenterX - 19, objTopY + objSize / 2 - fbArrowLen + 8);
    ctx.moveTo(objCenterX - 15, objTopY + objSize / 2 - fbArrowLen);
    ctx.lineTo(objCenterX - 11, objTopY + objSize / 2 - fbArrowLen + 8);
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`F_B = ${buoyantForceN.toFixed(1)} N`, objCenterX - 22, objTopY + objSize / 2 - fbArrowLen / 2);

    // True Weight Downward Arrow (W)
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    const wArrowLen = Math.min(70, Math.max(25, trueWeightN * 8));
    ctx.beginPath();
    ctx.moveTo(objCenterX + 15, objTopY + objSize / 2);
    ctx.lineTo(objCenterX + 15, objTopY + objSize / 2 + wArrowLen);
    ctx.lineTo(objCenterX + 11, objTopY + objSize / 2 + wArrowLen - 8);
    ctx.moveTo(objCenterX + 15, objTopY + objSize / 2 + wArrowLen);
    ctx.lineTo(objCenterX + 19, objTopY + objSize / 2 + wArrowLen - 8);
    ctx.stroke();

    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`W = ${trueWeightN.toFixed(1)} N`, objCenterX + 22, objTopY + objSize / 2 + wArrowLen / 2);

  }, [density, volume, fluidDensity, preset, spongeWet, fractionSubmerged, buoyantForceN, trueWeightN, apparentWeightN, isFloating]);

  return (
    <div className="bg-[#070e1c] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Archimedes' Principle & Buoyancy Laboratory
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                F_B = V_disp · ρ_fluid · g
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Test buoyancy across wood, paper, sponge, ice, iron, and custom modifiable densities.
            </p>
          </div>
        </div>

        {/* Material Presets */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          {[
            { id: 'wood', label: '🪵 Wood (0.6)' },
            { id: 'paper', label: '📄 Paper (0.75)' },
            { id: 'sponge', label: '🧽 Sponge (0.3)' },
            { id: 'ice', label: '🧊 Ice (0.92)' },
            { id: 'iron', label: '⚓ Iron (7.8)' },
            { id: 'custom', label: '⚙️ Custom' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => applyPreset(item.id as MaterialPreset)}
              className={`px-2.5 py-1.5 rounded-lg transition font-medium ${
                preset === item.id ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Tank */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-[#090d16]">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className={isFloating ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {isFloating ? '🟢 FLOATING (ρ_body ≤ ρ_fluid)' : '🔴 SINKING (ρ_body > ρ_fluid)'}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-10 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="text-cyan-400">Buoyant Force: {buoyantForceN.toFixed(1)} N</span>
          <span className="text-amber-400">Apparent W: {apparentWeightN.toFixed(1)} N</span>
        </div>

        <canvas ref={canvasRef} width={760} height={260} className="w-full h-64 block select-none" />
      </div>

      {/* Sponge special wet toggle */}
      {preset === 'sponge' && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs">
          <div className="flex items-center gap-2 text-cyan-200">
            <Droplet className="w-4 h-4 text-cyan-400" />
            <span>Sponge Saturation (Absorbs water and increases density!)</span>
          </div>
          <button
            onClick={() => {
              const nextWet = !spongeWet;
              setSpongeWet(nextWet);
              setDensity(nextWet ? 0.95 : 0.3);
            }}
            className={`px-3 py-1 rounded-lg font-bold transition ${
              spongeWet ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {spongeWet ? '💧 Wet Sponge (ρ = 0.95)' : 'dry Dry Sponge (ρ = 0.3)'}
          </button>
        </div>
      )}

      {/* Quantitative Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Object Density (ρ)</div>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {density.toFixed(2)} <span className="text-xs text-slate-400 font-normal">g/cm³</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">True Weight (W)</div>
          <div className="text-xl font-bold font-mono text-rose-400">
            {trueWeightN.toFixed(1)} <span className="text-xs text-slate-400 font-normal">Newtons</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Upward Buoyant Force (F_B)</div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {buoyantForceN.toFixed(1)} <span className="text-xs text-slate-400 font-normal">Newtons</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Submerged Fraction</div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {(fractionSubmerged * 100).toFixed(0)}% <span className="text-xs text-slate-400 font-normal">submerged</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Sliders */}
      <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          Modifiable Material Density & Volume
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-300 font-medium">Material Density (ρ_body)</span>
              <span className="font-mono text-cyan-400 font-bold">{density} g/cm³</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="9.0"
              step="0.05"
              value={density}
              onChange={(e) => {
                setDensity(parseFloat(e.target.value));
                setPreset('custom');
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-emerald-300 font-medium">Object Volume (V)</span>
              <span className="font-mono text-emerald-400 font-bold">{volume} cm³</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
