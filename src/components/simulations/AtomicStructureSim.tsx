import React, { useRef, useEffect, useState } from 'react';
import { Formula } from '../common/Formula';

interface AtomicStructureSimProps {
  initialEnergyLevelN: number; // 1 to 5
  targetEnergyLevelN: number; // 1 to 5
  atomicNumberZ: number; // 1 (Hydrogen), 2 (He+), 3 (Li2+)
}

export const AtomicStructureSim: React.FC<AtomicStructureSimProps> = ({
  initialEnergyLevelN = 3,
  targetEnergyLevelN = 2,
  atomicNumberZ = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rydberg Formula for Hydrogen-like atoms:
  // E_n = -13.6 * Z^2 / n^2 eV
  const eInitial = (-13.6 * atomicNumberZ * atomicNumberZ) / (initialEnergyLevelN * initialEnergyLevelN);
  const eTarget = (-13.6 * atomicNumberZ * atomicNumberZ) / (targetEnergyLevelN * targetEnergyLevelN);
  const deltaE_eV = Math.abs(eTarget - eInitial);
  const isEmission = initialEnergyLevelN > targetEnergyLevelN;
  const isAbsorption = initialEnergyLevelN < targetEnergyLevelN;

  // Wavelength in nanometers: lambda = hc / deltaE ~ 1240 / deltaE_eV
  const wavelengthNm = deltaE_eV > 0 ? 1239.84 / deltaE_eV : 0;

  // Color mapping from wavelength:
  const getSpectralColor = (nm: number) => {
    if (nm < 380) return { name: 'Ultraviolet (Lyman Series)', color: '#a855f7' };
    if (nm <= 430) return { name: 'Violet (Balmer Series)', color: '#8b5cf6' };
    if (nm <= 480) return { name: 'Blue (Balmer Series)', color: '#3b82f6' };
    if (nm <= 550) return { name: 'Cyan / Green (Balmer)', color: '#06b6d4' };
    if (nm <= 660) return { name: 'Red-Orange (H-alpha, Balmer)', color: '#ef4444' };
    if (nm <= 780) return { name: 'Deep Red', color: '#dc2626' };
    return { name: 'Infrared (Paschen Series)', color: '#e11d48' };
  };

  const spectralInfo = getSpectralColor(wavelengthNm);

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

      const centerX = w * 0.42;
      const centerY = h * 0.5;
      const baseRadius = 28;
      const orbitSpacing = 26;

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
      ctx.fillText(`+${atomicNumberZ}e`, centerX, centerY + 3);

      // Draw Bohr Orbits n = 1 to 5
      for (let n = 1; n <= 5; n++) {
        // Bohr orbit radius scales roughly with n^2 / Z
        const r = baseRadius + (n - 1) * orbitSpacing;
        const isCurrentOrbit = n === initialEnergyLevelN;
        const isTargetOrbit = n === targetEnergyLevelN;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);

        if (isCurrentOrbit) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
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
        ctx.font = '9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`n=${n}`, centerX + r + 3, centerY);
      }

      // Orbiting Electron on active orbital
      electronAngle += 0.035;
      const activeOrbitR = baseRadius + (initialEnergyLevelN - 1) * orbitSpacing;
      const elX = centerX + activeOrbitR * Math.cos(electronAngle);
      const elY = centerY + activeOrbitR * Math.sin(electronAngle);

      // Electron glow
      const elGlow = ctx.createRadialGradient(elX, elY, 1, elX, elY, 10);
      elGlow.addColorStop(0, '#67e8f9');
      elGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = elGlow;
      ctx.beginPath();
      ctx.arc(elX, elY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Electron body
      ctx.beginPath();
      ctx.arc(elX, elY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Animated Photon wave packet (emission or absorption)
      if (deltaE_eV > 0) {
        photonProgress = (photonProgress + 0.015) % 1;
        const photonStartX = centerX + baseRadius + (Math.max(initialEnergyLevelN, targetEnergyLevelN) - 1) * orbitSpacing;
        const photonTargetX = w - 40;
        const waveX = isEmission
          ? photonStartX + photonProgress * (photonTargetX - photonStartX)
          : photonTargetX - photonProgress * (photonTargetX - photonStartX);
        const waveY = centerY - 50;

        // Draw squiggly sine wave packet
        ctx.beginPath();
        for (let i = -20; i <= 20; i++) {
          const px = waveX + i;
          const py = waveY + Math.sin(i * 0.4) * 8 * Math.cos((i / 20) * (Math.PI / 2));
          if (i === -20) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = spectralInfo.color;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = spectralInfo.color;
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`hν (${wavelengthNm.toFixed(0)} nm)`, waveX, waveY - 14);
      }

      // Energy Level Diagram on Right Side
      const diagX = w * 0.76;
      const diagW = w * 0.2;
      const diagTop = 45;
      const diagBottom = h - 45;

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Energy Levels (eV)', diagX + diagW / 2, 28);

      for (let n = 1; n <= 5; n++) {
        const enVal = (-13.6 * atomicNumberZ * atomicNumberZ) / (n * n);
        // Map -13.6 to bottom and 0 to top
        const mappedY = diagTop + (diagBottom - diagTop) * (1 - (enVal + 13.6) / 13.6);

        ctx.beginPath();
        ctx.moveTo(diagX, mappedY);
        ctx.lineTo(diagX + diagW, mappedY);
        ctx.strokeStyle = n === initialEnergyLevelN ? '#38bdf8' : n === targetEnergyLevelN ? '#10b981' : '#475569';
        ctx.lineWidth = n === initialEnergyLevelN || n === targetEnergyLevelN ? 2.5 : 1;
        ctx.stroke();

        ctx.fillStyle = n === initialEnergyLevelN ? '#38bdf8' : n === targetEnergyLevelN ? '#10b981' : '#64748b';
        ctx.font = '9px monospace';
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
  }, [initialEnergyLevelN, targetEnergyLevelN, atomicNumberZ, deltaE_eV, wavelengthNm, spectralInfo, isEmission, isAbsorption]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#060B18]">
        <canvas ref={canvasRef} className="w-full h-80 block" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Photon Transition</span>
          <div className="text-lg font-mono font-bold text-sky-400">
            {isEmission ? `n=${initialEnergyLevelN} → n=${targetEnergyLevelN} (Emission)` : isAbsorption ? `n=${initialEnergyLevelN} → n=${targetEnergyLevelN} (Absorption)` : 'No Transition'}
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
            E_{initialEnergyLevelN} = {eInitial.toFixed(2)} eV <br />
            E_{targetEnergyLevelN} = {eTarget.toFixed(2)} eV
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
