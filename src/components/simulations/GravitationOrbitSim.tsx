import React, { useRef, useEffect } from 'react';
import { Formula } from '../common/Formula';

interface GravitationOrbitSimProps {
  centralMass: number; // in solar masses or 10^24 kg
  orbitalRadius: number; // in AU or 10^6 km
  eccentricity: number; // 0 (circle) to 0.75 (ellipse)
}

export const GravitationOrbitSim: React.FC<GravitationOrbitSimProps> = ({
  centralMass = 1.0,
  orbitalRadius = 1.0,
  eccentricity = 0.1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Physics calculations:
  // Orbital speed v = sqrt(G * M / r)
  // Let G = 1 for scaled units
  const G = 1;
  const nominalSpeed = Math.sqrt((G * centralMass) / Math.max(0.1, orbitalRadius));
  const period = 2 * Math.PI * Math.sqrt(Math.pow(orbitalRadius, 3) / (G * centralMass));
  const semiMajorAxis = orbitalRadius;
  const semiMinorAxis = orbitalRadius * Math.sqrt(Math.max(0.01, 1 - eccentricity * eccentricity));
  const focalDistance = orbitalRadius * eccentricity;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

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

      // Deep space background with subtle stars
      ctx.fillStyle = '#060B18';
      ctx.fillRect(0, 0, w, h);

      // Static background star points
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      const seedPoints = [
        [w * 0.1, h * 0.2], [w * 0.85, h * 0.15], [w * 0.9, h * 0.75],
        [w * 0.15, h * 0.8], [w * 0.5, h * 0.1], [w * 0.3, h * 0.9]
      ];
      seedPoints.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      });

      const centerX = w * 0.5;
      const centerY = h * 0.5;
      const scale = Math.min(w, h) * 0.35;

      // Focal center offset for ellipse
      const sunX = centerX - focalDistance * scale;
      const sunY = centerY;

      // Draw Orbit Ellipse
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, semiMajorAxis * scale, semiMinorAxis * scale, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Sun (Central Mass)
      const sunRadius = Math.max(12, Math.min(26, 14 + centralMass * 6));
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, sunRadius * 2.2);
      sunGlow.addColorStop(0, '#fef08a');
      sunGlow.addColorStop(0.4, '#eab308');
      sunGlow.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label Sun
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Star (M = ${centralMass.toFixed(1)} M☉)`, sunX, sunY + sunRadius + 14);

      // Planet position on ellipse:
      // Kepler's 2nd law approx: moves faster near perihelion
      const currentR = Math.hypot(
        centerX + semiMajorAxis * scale * Math.cos(angle) - sunX,
        centerY + semiMinorAxis * scale * Math.sin(angle) - sunY
      );
      const angularSpeed = (0.015 * Math.sqrt(centralMass)) / Math.max(0.5, currentR / scale);
      angle += angularSpeed;

      const planetX = centerX + semiMajorAxis * scale * Math.cos(angle);
      const planetY = centerY + semiMinorAxis * scale * Math.sin(angle);

      // Gravitational force vector line from planet to star
      ctx.beginPath();
      ctx.moveTo(planetX, planetY);
      ctx.lineTo(sunX, sunY);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Velocity vector (tangent to ellipse)
      const vx = -semiMajorAxis * scale * Math.sin(angle);
      const vy = semiMinorAxis * scale * Math.cos(angle);
      const vMag = Math.hypot(vx, vy);
      const vNormX = vx / (vMag || 1);
      const vNormY = vy / (vMag || 1);
      const vectorLen = 35 * (nominalSpeed / 1.5);

      ctx.beginPath();
      ctx.moveTo(planetX, planetY);
      ctx.lineTo(planetX + vNormX * vectorLen, planetY + vNormY * vectorLen);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Velocity arrow head
      const arrowX = planetX + vNormX * vectorLen;
      const arrowY = planetY + vNormY * vectorLen;
      ctx.beginPath();
      ctx.arc(arrowX, arrowY, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();

      // Planet Body
      ctx.beginPath();
      ctx.arc(planetX, planetY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Legend labels on canvas
      ctx.textAlign = 'left';
      ctx.font = '10px monospace';
      ctx.fillStyle = '#10b981';
      ctx.fillText('→ v (Orbital Velocity)', 16, h - 36);
      ctx.fillStyle = '#ef4444';
      ctx.fillText('— F_g (Gravitational Attraction)', 16, h - 20);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [centralMass, orbitalRadius, eccentricity, focalDistance, semiMajorAxis, semiMinorAxis, nominalSpeed]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-[#060B18]">
        <canvas ref={canvasRef} className="w-full h-80 block" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Orbital Velocity (v)</span>
          <div className="text-lg font-mono font-bold text-emerald-400">
            {nominalSpeed.toFixed(2)} <span className="text-xs font-normal text-slate-400">km/s (scaled)</span>
          </div>
          <span className="text-[10px] text-slate-500">v ∝ √(GM/r)</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Orbital Period (T)</span>
          <div className="text-lg font-mono font-bold text-sky-400">
            {period.toFixed(2)} <span className="text-xs font-normal text-slate-400">yr</span>
          </div>
          <span className="text-[10px] text-slate-500">Kepler's 3rd Law: T² ∝ a³</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Semi-Major Axis (a)</span>
          <div className="text-lg font-mono font-bold text-purple-400">
            {semiMajorAxis.toFixed(2)} <span className="text-xs font-normal text-slate-400">AU</span>
          </div>
          <span className="text-[10px] text-slate-500">Eccentricity e = {eccentricity.toFixed(2)}</span>
        </div>

        <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-0.5">Gravitational Law</span>
          <div className="mt-1">
            <Formula tex="F_g = G \frac{M m}{r^2}" />
          </div>
        </div>
      </div>
    </div>
  );
};
