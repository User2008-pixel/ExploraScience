import React, { useRef, useEffect, useState } from 'react';
import { Formula } from '../common/Formula';
import { Atom, Sparkles, Play, Pause, RotateCcw, Zap, Flame, Compass } from 'lucide-react';

interface AtomicStructureSimProps {
  initialEnergyLevelN?: number; // 1 to 6
  targetEnergyLevelN?: number; // 1 to 6
  atomicNumberZ?: number; // 1 (Hydrogen), 2 (He+), 3 (Li2+)
}

export const AtomicStructureSim: React.FC<AtomicStructureSimProps> = ({
  initialEnergyLevelN: propInitialN = 3,
  targetEnergyLevelN: propTargetN = 2,
  atomicNumberZ: propZ = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Direct manipulation state
  const [initialN, setInitialN] = useState<number>(propInitialN);
  const [targetN, setTargetN] = useState<number>(propTargetN);
  const [atomicZ, setAtomicZ] = useState<number>(propZ);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [electronSpeed, setElectronSpeed] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionProgress, setTransitionProgress] = useState<number>(0);

  // Rydberg Formula for Hydrogen-like atoms:
  // E_n = -13.6 * Z^2 / n^2 eV
  const eInitial = (-13.6 * atomicZ * atomicZ) / (initialN * initialN);
  const eTarget = (-13.6 * atomicZ * atomicZ) / (targetN * targetN);
  const deltaE_eV = Math.abs(eTarget - eInitial);
  const isEmission = initialN > targetN;
  const isAbsorption = initialN < targetN;

  // Wavelength in nanometers: lambda = hc / deltaE ~ 1240 / deltaE_eV
  const wavelengthNm = deltaE_eV > 0 ? 1239.84 / deltaE_eV : 0;

  // Color mapping from wavelength:
  const getSpectralColor = (nm: number) => {
    if (nm === 0) return { name: 'Ground / Identical Level', color: '#94a3b8' };
    if (nm < 10) return { name: 'X-Rays', color: '#ec4899' };
    if (nm < 380) return { name: 'Ultraviolet (Lyman Series)', color: '#a855f7' };
    if (nm <= 430) return { name: 'Violet (Balmer Series)', color: '#8b5cf6' };
    if (nm <= 480) return { name: 'Blue (Balmer Series, H-β)', color: '#3b82f6' };
    if (nm <= 550) return { name: 'Cyan / Green (Balmer, H-γ)', color: '#06b6d4' };
    if (nm <= 660) return { name: 'Red (Balmer H-α: 656.3 nm)', color: '#ef4444' };
    if (nm <= 780) return { name: 'Deep Red', color: '#dc2626' };
    return { name: 'Infrared (Paschen/Brackett Series)', color: '#e11d48' };
  };

  const spectralInfo = getSpectralColor(wavelengthNm);

  // Trigger quantum leap animation
  const triggerTransition = () => {
    setIsTransitioning(true);
    setTransitionProgress(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let electronAngle = 0;
    let photonProgress = 0;

    const render = () => {
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

      // Deep space atomic dark background
      ctx.fillStyle = '#060B18';
      ctx.fillRect(0, 0, w, h);

      const centerX = w * 0.4;
      const centerY = h * 0.5;
      const baseRadius = 26;
      const orbitSpacing = 24;

      // Draw Nucleus
      const nucleusRadius = 14;
      const nucleusGrad = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, nucleusRadius * 1.5);
      nucleusGrad.addColorStop(0, '#fca5a5');
      nucleusGrad.addColorStop(0.5, '#ef4444');
      nucleusGrad.addColorStop(1, '#991b1b');
      ctx.fillStyle = nucleusGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`+${atomicZ}e`, centerX, centerY + 3);

      // Draw Bohr Orbits n = 1 to 6
      for (let n = 1; n <= 6; n++) {
        const r = baseRadius + (n - 1) * orbitSpacing;
        const isCurrentOrbit = n === initialN;
        const isTargetOrbit = n === targetN;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);

        if (isCurrentOrbit) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([]);
        } else if (isTargetOrbit) {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
        } else {
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 3]);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Label orbit n
        ctx.fillStyle = isCurrentOrbit ? '#38bdf8' : isTargetOrbit ? '#10b981' : '#64748b';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`n=${n}`, centerX + r + 3, centerY);
      }

      // Orbiting Electron on active orbital (with transition animation)
      if (isPlaying) {
        electronAngle += 0.035 * electronSpeed * (1 / Math.sqrt(initialN));
      }

      const activeOrbitR = baseRadius + (initialN - 1) * orbitSpacing;
      const elX = centerX + activeOrbitR * Math.cos(electronAngle);
      const elY = centerY + activeOrbitR * Math.sin(electronAngle);

      // Electron glow
      const elGlow = ctx.createRadialGradient(elX, elY, 1, elX, elY, 12);
      elGlow.addColorStop(0, '#67e8f9');
      elGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = elGlow;
      ctx.beginPath();
      ctx.arc(elX, elY, 12, 0, Math.PI * 2);
      ctx.fill();

      // Electron body
      ctx.beginPath();
      ctx.arc(elX, elY, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Animated Photon wave packet (emission or absorption)
      if (deltaE_eV > 0) {
        if (isPlaying) {
          photonProgress = (photonProgress + 0.015 * electronSpeed) % 1;
        }
        const photonStartX = centerX + baseRadius + (Math.max(initialN, targetN) - 1) * orbitSpacing;
        const photonTargetX = w - 30;
        const waveX = isEmission
          ? photonStartX + photonProgress * (photonTargetX - photonStartX)
          : photonTargetX - photonProgress * (photonTargetX - photonStartX);
        const waveY = centerY - 55;

        // Draw squiggly sine wave packet
        ctx.beginPath();
        for (let i = -22; i <= 22; i++) {
          const px = waveX + i;
          const py = waveY + Math.sin(i * 0.4) * 8 * Math.cos((i / 22) * (Math.PI / 2));
          if (i === -22) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = spectralInfo.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = spectralInfo.color;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${isEmission ? 'Emitted' : 'Absorbed'} hν (${wavelengthNm.toFixed(1)} nm)`,
          waveX,
          waveY - 14
        );
      }

      // Energy Level Diagram on Right Side
      const diagX = w * 0.74;
      const diagW = w * 0.22;
      const diagTop = 40;
      const diagBottom = h - 40;

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Energy Levels (eV)', diagX + diagW / 2, 24);

      for (let n = 1; n <= 6; n++) {
        const enVal = (-13.6 * atomicZ * atomicZ) / (n * n);
        const mappedY = diagTop + (diagBottom - diagTop) * (1 - (enVal + 13.6 * atomicZ * atomicZ) / (13.6 * atomicZ * atomicZ));

        ctx.beginPath();
        ctx.moveTo(diagX, mappedY);
        ctx.lineTo(diagX + diagW, mappedY);
        ctx.strokeStyle = n === initialN ? '#38bdf8' : n === targetN ? '#10b981' : '#475569';
        ctx.lineWidth = n === initialN || n === targetN ? 2.5 : 1;
        ctx.stroke();

        ctx.fillStyle = n === initialN ? '#38bdf8' : n === targetN ? '#10b981' : '#64748b';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`n=${n}`, diagX + diagW + 4, mappedY + 3);
        ctx.textAlign = 'right';
        ctx.fillText(`${enVal.toFixed(1)}`, diagX - 4, mappedY + 3);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [initialN, targetN, atomicZ, deltaE_eV, wavelengthNm, spectralInfo, isEmission, isAbsorption, isPlaying, electronSpeed]);

  return (
    <div className="space-y-4">
      {/* Visual Canvas Display */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#060B18] shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-80 block cursor-crosshair" />

        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Species:</span>
            <button
              onClick={() => setAtomicZ(1)}
              className={`px-2 py-0.5 rounded font-bold transition ${
                atomicZ === 1 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              H (Z=1)
            </button>
            <button
              onClick={() => setAtomicZ(2)}
              className={`px-2 py-0.5 rounded font-bold transition ${
                atomicZ === 2 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              He⁺ (Z=2)
            </button>
            <button
              onClick={() => setAtomicZ(3)}
              className={`px-2 py-0.5 rounded font-bold transition ${
                atomicZ === 3 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Li²⁺ (Z=3)
            </button>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => {
                setInitialN(3);
                setTargetN(2);
                setAtomicZ(1);
              }}
              className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-700 transition"
              title="Reset to Balmer H-alpha"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Direct Manipulation Control Console */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Atom className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Bohr Orbit & Quantum Leap Manipulator
            </h4>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
            Photon: {isEmission ? 'Emission' : isAbsorption ? 'Absorption' : 'Stationary'} (ΔE = {deltaE_eV.toFixed(2)} eV)
          </span>
        </div>

        {/* Orbit Sliders & Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-300 font-medium">Initial Energy Level (n_initial):</span>
              <span className="font-mono font-bold text-sky-400 text-sm">n = {initialN}</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={initialN}
              onChange={(e) => setInitialN(parseInt(e.target.value))}
              className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between gap-1 pt-1">
              {[1, 2, 3, 4, 5, 6].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setInitialN(lvl)}
                  className={`flex-1 py-1 rounded text-xs font-mono font-bold transition ${
                    initialN === lvl
                      ? 'bg-sky-500 text-slate-950'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  n={lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-medium">Target Energy Level (n_target):</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">n = {targetN}</span>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              step="1"
              value={targetN}
              onChange={(e) => setTargetN(parseInt(e.target.value))}
              className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between gap-1 pt-1">
              {[1, 2, 3, 4, 5, 6].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setTargetN(lvl)}
                  className={`flex-1 py-1 rounded text-xs font-mono font-bold transition ${
                    targetN === lvl
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  n={lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Spectral Series Presets */}
        <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 space-y-2">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
            NCERT Spectral Series Quick Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setInitialN(2);
                setTargetN(1);
                setAtomicZ(1);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-800 transition"
            >
              Lyman-α (n=2 → 1, 121.6 nm UV)
            </button>
            <button
              onClick={() => {
                setInitialN(3);
                setTargetN(2);
                setAtomicZ(1);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold transition"
            >
              Balmer H-α (n=3 → 2, 656.3 nm Red)
            </button>
            <button
              onClick={() => {
                setInitialN(4);
                setTargetN(2);
                setAtomicZ(1);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 transition"
            >
              Balmer H-β (n=4 → 2, 486.1 nm Cyan)
            </button>
            <button
              onClick={() => {
                setInitialN(5);
                setTargetN(2);
                setAtomicZ(1);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-800 transition"
            >
              Balmer H-γ (n=5 → 2, 434.0 nm Blue)
            </button>
            <button
              onClick={() => {
                setInitialN(4);
                setTargetN(3);
                setAtomicZ(1);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 transition"
            >
              Paschen-α (n=4 → 3, 1875 nm IR)
            </button>
            <button
              onClick={() => {
                // Swap initial and target to flip emission / absorption
                const temp = initialN;
                setInitialN(targetN);
                setTargetN(temp);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-yellow-400" />
              Reverse (Emission ⇄ Absorption)
            </button>
          </div>
        </div>
      </div>

      {/* Numerical Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Photon Transition</span>
          <div className="text-lg font-mono font-bold text-sky-400">
            {isEmission
              ? `n=${initialN} → n=${targetN} (Emission)`
              : isAbsorption
              ? `n=${initialN} → n=${targetN} (Absorption)`
              : 'Stationary'}
          </div>
          <span className="text-[10px] text-slate-500">ΔE = {deltaE_eV.toFixed(2)} eV</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Spectral Wavelength (λ)</span>
          <div className="text-lg font-mono font-bold" style={{ color: spectralInfo.color }}>
            {wavelengthNm > 0 ? `${wavelengthNm.toFixed(1)} nm` : '—'}
          </div>
          <span className="text-[10px] text-slate-400">{spectralInfo.name}</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Orbit Energy Levels</span>
          <div className="text-xs font-mono text-slate-300 mt-1">
            E_{initialN} = {eInitial.toFixed(2)} eV <br />
            E_{targetN} = {eTarget.toFixed(2)} eV
          </div>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Bohr / Rydberg Formula</span>
          <div className="mt-1">
            <Formula tex="\frac{1}{\lambda} = R_H Z^2 \left( \frac{1}{n_1^2} - \frac{1}{n_2^2} \right)" />
          </div>
        </div>
      </div>
    </div>
  );
};
