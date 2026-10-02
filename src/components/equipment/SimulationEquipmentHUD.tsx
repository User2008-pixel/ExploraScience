import React, { useState } from 'react';
import { LAB_EQUIPMENT_DATA } from '../../data/equipmentData';
import { LabEquipmentItem } from '../../types/equipment';
import {
  Sparkles,
  Lock,
  Unlock,
  Check,
  Zap,
  Flame,
  Camera,
  Activity,
  LineChart,
  Thermometer,
  Atom,
  Gauge,
  Coins,
  ChevronDown,
  ChevronUp,
  Sliders,
  Radio,
  Eye,
  Crosshair,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SimulationEquipmentHUDProps {
  simulationType: string;
  variableValues: Record<string, number>;
  scienceCredits: number;
  unlockedEquipmentIds: string[];
  equippedEquipmentIds: string[];
  onUnlockEquipment: (equipmentId: string, cost: number) => void;
  onToggleEquip: (equipmentId: string) => void;
  onOpenArmory: () => void;
}

const ICON_MAP: Record<string, any> = {
  Flame,
  Camera,
  Activity,
  LineChart,
  Thermometer,
  Atom,
  Gauge,
  Zap,
};

export const SimulationEquipmentHUD: React.FC<SimulationEquipmentHUDProps> = ({
  simulationType,
  variableValues,
  scienceCredits,
  unlockedEquipmentIds,
  equippedEquipmentIds,
  onUnlockEquipment,
  onToggleEquip,
  onOpenArmory,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [justUnlockedId, setJustUnlockedId] = useState<string | null>(null);

  // Filter tools relevant to current simulation or 'all'
  const relevantEquipment = LAB_EQUIPMENT_DATA.filter((eq) =>
    eq.compatibleSims.includes('all') || eq.compatibleSims.includes(simulationType)
  );

  const equippedTools = relevantEquipment.filter((eq) =>
    equippedEquipmentIds.includes(eq.id)
  );

  const handleQuickUnlock = (item: LabEquipmentItem) => {
    if (scienceCredits < item.cost) {
      onOpenArmory();
      return;
    }

    onUnlockEquipment(item.id, item.cost);
    setJustUnlockedId(item.id);
    setTimeout(() => setJustUnlockedId(null), 2500);

    try {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  // Compute live diagnostic metrics for HUD overlays
  const renderActiveToolHUD = (toolId: string) => {
    switch (toolId) {
      case 'strobe-motion-tracker': {
        const v0 = variableValues.velocity ?? variableValues.initialVelocity ?? 25;
        const angle = variableValues.angle ?? 45;
        const g = variableValues.gravity ?? 9.8;
        const rad = (angle * Math.PI) / 180;
        const vx = v0 * Math.cos(rad);
        const vy = v0 * Math.sin(rad);
        const apexH = (vy * vy) / (2 * g);
        const totalR = (v0 * v0 * Math.sin(2 * rad)) / g;

        return (
          <div
            key={toolId}
            className="p-3 rounded-xl bg-slate-950/85 border border-cyan-500/50 text-cyan-200 text-xs shadow-lg backdrop-blur-md space-y-1.5 animate-in fade-in-50"
          >
            <div className="flex items-center justify-between gap-2 border-b border-cyan-900/60 pb-1">
              <span className="font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Stroboscopic Multi-Flash HUD (120 Hz)</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[9px]">
                ACTIVE
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-0.5">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Tangent Speed</span>
                <span className="text-white font-bold">{v0.toFixed(1)} m/s</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Velocity Vectors</span>
                <span className="text-cyan-300">
                  [{vx.toFixed(1)}, {vy.toFixed(1)}] m/s
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Predicted Apex</span>
                <span className="text-emerald-300">{apexH.toFixed(2)} m</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Calculated Range</span>
                <span className="text-amber-300">{totalR.toFixed(2)} m</span>
              </div>
            </div>
          </div>
        );
      }

      case 'infrared-thermal-cam': {
        const tHot = variableValues.temperatureK ?? variableValues.hotReservoirTempK ?? 350;
        const tAmbient = variableValues.tempC ?? variableValues.ambientTemp ?? 20;
        const tempKelvin = tHot > 200 ? tHot : tAmbient + 273.15;
        const tempCelsius = tempKelvin - 273.15;
        const heatFlux = Math.abs(tempCelsius - 20) * 14.2;

        return (
          <div
            key={toolId}
            className="p-3 rounded-xl bg-slate-950/85 border border-rose-500/50 text-rose-200 text-xs shadow-lg backdrop-blur-md space-y-1.5 animate-in fade-in-50"
          >
            <div className="flex items-center justify-between gap-2 border-b border-rose-900/60 pb-1">
              <span className="font-mono font-bold text-rose-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>FLIR Infrared Thermography Diagnostics</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[9px]">
                FALSE-COLOR
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-0.5">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Surface Temp</span>
                <span className="text-white font-bold">{tempCelsius.toFixed(1)} °C</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Absolute State</span>
                <span className="text-rose-300">{tempKelvin.toFixed(1)} K</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Heat Flux (dQ/dt)</span>
                <span className="text-amber-300">-{heatFlux.toFixed(1)} W/m²</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Thermal Spectrum</span>
                <span className="text-emerald-300">7.5–14.0 μm LWIR</span>
              </div>
            </div>
          </div>
        );
      }

      case 'digital-multimeter': {
        const v = variableValues.voltage ?? variableValues.supplyVoltage ?? 12;
        const r = variableValues.resistance ?? variableValues.bulbResistance ?? 6;
        const current = r > 0 ? v / r : 0;
        const power = v * current;

        return (
          <div
            key={toolId}
            className="p-3 rounded-xl bg-slate-950/85 border border-emerald-500/50 text-emerald-200 text-xs shadow-lg backdrop-blur-md space-y-1.5 animate-in fade-in-50"
          >
            <div className="flex items-center justify-between gap-2 border-b border-emerald-900/60 pb-1">
              <span className="font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Precision Digital Multimeter (True RMS 4.5 Digit)</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px]">
                CALIBRATED
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-0.5">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Potential Diff (V)</span>
                <span className="text-white font-bold">{v.toFixed(3)} V</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Loop Current (I)</span>
                <span className="text-emerald-300">{(current * 1000).toFixed(1)} mA</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Circuit Power (P)</span>
                <span className="text-yellow-300">{power.toFixed(2)} W</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Resistance (R)</span>
                <span className="text-cyan-300">{r.toFixed(2)} Ω</span>
              </div>
            </div>
          </div>
        );
      }

      case 'fourier-fft-analyzer': {
        const k = variableValues.springConstant ?? 40;
        const m = variableValues.mass ?? 2;
        const freqHz = m > 0 ? (1 / (2 * Math.PI)) * Math.sqrt(k / m) : 1;

        return (
          <div
            key={toolId}
            className="p-3 rounded-xl bg-slate-950/85 border border-purple-500/50 text-purple-200 text-xs shadow-lg backdrop-blur-md space-y-1.5 animate-in fade-in-50"
          >
            <div className="flex items-center justify-between gap-2 border-b border-purple-900/60 pb-1">
              <span className="font-mono font-bold text-purple-300 flex items-center gap-1.5">
                <LineChart className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>Fast Fourier Transform (FFT) Harmonic Spectrum</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[9px]">
                SPECTROGRAM
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-0.5">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Fundamental (f₀)</span>
                <span className="text-white font-bold">{freqHz.toFixed(2)} Hz</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">2nd Harmonic (2f₀)</span>
                <span className="text-purple-300">{(freqHz * 2).toFixed(2)} Hz</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Spectral Peak</span>
                <span className="text-emerald-300">-12.4 dBV</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Q-Factor Resonance</span>
                <span className="text-cyan-300">Q = 28.5</span>
              </div>
            </div>
          </div>
        );
      }

      case 'laser-interferometer': {
        const lambda = variableValues.wavelengthNm ?? 550;
        const d = variableValues.slitDistanceMm ?? 0.3;
        const fringeSpacing = (lambda * 1e-9 * 1.5) / (d * 1e-3);

        return (
          <div
            key={toolId}
            className="p-3 rounded-xl bg-slate-950/85 border border-indigo-500/50 text-indigo-200 text-xs shadow-lg backdrop-blur-md space-y-1.5 animate-in fade-in-50"
          >
            <div className="flex items-center justify-between gap-2 border-b border-indigo-900/60 pb-1">
              <span className="font-mono font-bold text-indigo-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span>Michelson Laser Interferometer Fringe Monitor</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px]">
                λ/20 PRECISION
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-0.5">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Laser Wavelength</span>
                <span className="text-white font-bold">{lambda.toFixed(0)} nm</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Fringe Width (β)</span>
                <span className="text-cyan-300">{(fringeSpacing * 1e3).toFixed(2)} mm</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Interference Phase</span>
                <span className="text-emerald-300">δ = 0.42 π rad</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Visibility (V)</span>
                <span className="text-yellow-300">V = 0.98</span>
              </div>
            </div>
          </div>
        );
      }

      case 'piezo-manometer': {
        const vol = variableValues.volumeLiters ?? 15;
        const temp = variableValues.temperatureK ?? 300;
        const moles = variableValues.molesN ?? 1.0;
        const R = 0.0821;
        const pAtm = vol > 0 ? (moles * R * temp) / vol : 1.0;
        const pKPa = pAtm * 101.325;
        const pPsi = pAtm * 14.696;

        return (
          <div
            key={toolId}
            className="p-3 rounded-xl bg-slate-950/85 border border-sky-500/50 text-sky-200 text-xs shadow-lg backdrop-blur-md space-y-1.5 animate-in fade-in-50"
          >
            <div className="flex items-center justify-between gap-2 border-b border-sky-900/60 pb-1">
              <span className="font-mono font-bold text-sky-300 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span>Piezoelectric Barometer & Fluid Pressure Sensor</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[9px]">
                μPa TRANSDUCER
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-0.5">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Absolute Pressure</span>
                <span className="text-white font-bold">{pKPa.toFixed(2)} kPa</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Standard Atmosphere</span>
                <span className="text-sky-300">{pAtm.toFixed(3)} atm</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Imperial Unit</span>
                <span className="text-emerald-300">{pPsi.toFixed(2)} psi</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase">Cavitation Threshold</span>
                <span className="text-amber-300">SAFE (0.12 μPa)</span>
              </div>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {/* Simulation Equipment Bar Header */}
      <div className="bg-[#0e172a] border border-slate-800 rounded-2xl p-3 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-white tracking-tight uppercase">
                  Lab Equipment & Simulation Armory
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Virtual Tools
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Unlock advanced sensors using Science Credits to enhance simulation diagnostics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Credit Balance Badge */}
            <button
              onClick={onOpenArmory}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold transition shadow-inner"
              title="Open Virtual Equipment Armory Store"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{scienceCredits.toLocaleString()} ⚛️ Credits</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={isExpanded ? 'Collapse Tool Armory' : 'Expand Tool Armory'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tools Strip */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {relevantEquipment.map((item) => {
                const Icon = ICON_MAP[item.iconName] || Zap;
                const isUnlocked =
                  unlockedEquipmentIds.includes(item.id) || item.unlockedByDefault;
                const isEquipped = equippedEquipmentIds.includes(item.id);
                const canAfford = scienceCredits >= item.cost;
                const isJustUnlocked = justUnlockedId === item.id;

                return (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between space-y-2 transition ${
                      isJustUnlocked
                        ? 'border-emerald-400 bg-emerald-950/40 ring-2 ring-emerald-400'
                        : isEquipped
                        ? 'border-cyan-500/80 bg-cyan-950/30 shadow-md shadow-cyan-500/10'
                        : isUnlocked
                        ? 'border-slate-800 bg-slate-900/60'
                        : 'border-slate-800/80 bg-slate-950/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isUnlocked
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : 'bg-slate-900 text-slate-500 border border-slate-800'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-white text-xs truncate max-w-[170px]" title={item.name}>
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {item.tagline}
                          </span>
                        </div>
                      </div>

                      {isEquipped && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0 mt-1" />
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                      {isUnlocked ? (
                        <button
                          onClick={() => onToggleEquip(item.id)}
                          className={`w-full py-1 rounded-lg font-bold text-[11px] transition flex items-center justify-center gap-1 ${
                            isEquipped
                              ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-500/20'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {isEquipped ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Equipped in Lab</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3 h-3 text-cyan-400" />
                              <span>Equip Tool</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleQuickUnlock(item)}
                          className={`w-full py-1 rounded-lg font-bold text-[11px] transition flex items-center justify-center gap-1.5 ${
                            canAfford
                              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
                              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                          }`}
                        >
                          <Lock className="w-3 h-3" />
                          <span>Unlock ({item.cost} ⚛️)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Render Active HUD Overlays for Equipped Tools */}
      {equippedTools.length > 0 && (
        <div className="space-y-2">
          {equippedTools.map((tool) => renderActiveToolHUD(tool.id))}
        </div>
      )}
    </div>
  );
};
