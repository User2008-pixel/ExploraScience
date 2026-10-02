import React, { useRef, useEffect } from 'react';
import { Formula } from '../common/Formula';

interface DetectiveSimCanvasProps {
  simulationType: string;
  variableValues: Record<string, number>;
  activeEquipment: string[];
}

export const DetectiveSimCanvas: React.FC<DetectiveSimCanvasProps> = ({
  simulationType,
  variableValues,
  activeEquipment,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0a101f';
    ctx.fillRect(0, 0, w, h);

    if (simulationType === 'thermal-conduction') {
      // The Two Spoons case:
      // Left spoon: Stainless Steel (k ~ 16 to 45), Right spoon: Birch Wood (k ~ 0.15)
      const k = variableValues.materialThermalConductivity ?? 16;
      const t_room = variableValues.ambientTemp ?? 20;
      const t_skin = variableValues.skinTemp ?? 34;

      // Draw table surface
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(20, h - 50, w - 40, 30);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, h - 50, w - 40, 30);

      // Steel Spoon (Left)
      const spoonW = 60;
      const spoonH = 140;
      const leftX = w * 0.3 - spoonW / 2;
      const spoonY = h - 50 - spoonH;

      // Steel spoon drawing
      const steelGrad = ctx.createLinearGradient(leftX, spoonY, leftX + spoonW, spoonY + spoonH);
      steelGrad.addColorStop(0, '#e2e8f0');
      steelGrad.addColorStop(0.5, '#94a3b8');
      steelGrad.addColorStop(1, '#64748b');
      ctx.fillStyle = steelGrad;
      // Handle
      ctx.fillRect(leftX + 24, spoonY, 12, 90);
      // Bowl
      ctx.beginPath();
      ctx.ellipse(leftX + 30, spoonY + 105, 26, 32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Stainless Steel Spoon', leftX + 30, spoonY - 12);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`k = ${k.toFixed(1)} W/m·K`, leftX + 30, spoonY + spoonH + 16);

      // Wood Spoon (Right)
      const rightX = w * 0.7 - spoonW / 2;
      const woodGrad = ctx.createLinearGradient(rightX, spoonY, rightX + spoonW, spoonY + spoonH);
      woodGrad.addColorStop(0, '#d97706');
      woodGrad.addColorStop(0.5, '#b45309');
      woodGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = woodGrad;
      ctx.fillRect(rightX + 24, spoonY, 12, 90);
      ctx.beginPath();
      ctx.ellipse(rightX + 30, spoonY + 105, 26, 32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('Birch Wood Spoon', rightX + 30, spoonY - 12);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`k = 0.15 W/m·K`, rightX + 30, spoonY + spoonH + 16);

      // If contact thermistor / IR camera is active, show probe and real temperatures
      if (activeEquipment.some(e => e.includes('Thermistor') || e.includes('Thermal') || e.includes('Camera'))) {
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`Thermometer: ${t_room.toFixed(1)} °C`, leftX + 30, spoonY + 40);
        ctx.fillText(`Thermometer: ${t_room.toFixed(1)} °C`, rightX + 30, spoonY + 40);

        // Heat flux vectors
        const steelFlux = k * (t_skin - t_room) * 0.15;
        const woodFlux = 0.15 * (t_skin - t_room) * 0.15;

        ctx.fillStyle = '#ef4444';
        ctx.font = '10px monospace';
        ctx.fillText(`Heat Flux: -${steelFlux.toFixed(1)} W/m²`, leftX + 30, spoonY + 60);
        ctx.fillText(`Heat Flux: -${woodFlux.toFixed(1)} W/m²`, rightX + 30, spoonY + 60);
      }
    } else if (simulationType === 'car-stopping') {
      // Car braking distance case
      const v0 = variableValues.initialVelocity ?? 20;
      const mu = variableValues.surfaceFriction ?? 0.8;
      const m = variableValues.vehicleMass ?? 1200;
      const g = 9.8;
      const stopDist = (v0 * v0) / (2 * mu * g);

      // Track road
      const roadY = h * 0.65;
      ctx.fillStyle = mu > 0.5 ? '#1e293b' : '#38bdf822';
      ctx.fillRect(20, roadY, w - 40, h - roadY - 10);
      ctx.strokeStyle = mu > 0.5 ? '#64748b' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(20, roadY, w - 40, h - roadY - 10);

      // Road type text
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(mu > 0.5 ? 'Surface: Dry High-Friction Asphalt (μ = 0.80)' : 'Surface: Wet Low-Friction Ice Track (μ = 0.10)', 30, roadY + 22);

      // Car representation
      const carX = 60;
      const carY = roadY - 35;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(carX, carY + 12, 70, 20);
      ctx.fillRect(carX + 15, carY, 40, 15);
      // Wheels
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(carX + 18, roadY - 2, 7, 0, Math.PI * 2);
      ctx.arc(carX + 54, roadY - 2, 7, 0, Math.PI * 2);
      ctx.fill();

      // Skid marks
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(carX + 70, roadY - 2);
      const visualSkid = Math.min(w - 120, carX + 70 + stopDist * 2.5);
      ctx.lineTo(visualSkid, roadY - 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Stop flag
      ctx.fillStyle = '#10b981';
      ctx.fillRect(visualSkid, roadY - 45, 3, 45);
      ctx.beginPath();
      ctx.moveTo(visualSkid, roadY - 45);
      ctx.lineTo(visualSkid + 22, roadY - 35);
      ctx.lineTo(visualSkid, roadY - 25);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Stopping Distance = ${stopDist.toFixed(1)} m`, (carX + visualSkid) / 2, roadY - 15);

      // Stroboscopic motion tracker overlay
      if (activeEquipment.some(e => e.includes('Strobe') || e.includes('Camera') || e.includes('Tracker') || e.includes('Velocity'))) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.25)';
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1;
        // Ghost frames
        const steps = 4;
        for (let i = 1; i <= steps; i++) {
          const ghostX = carX + ((visualSkid - carX) * (i / (steps + 1)));
          ctx.strokeRect(ghostX, carY + 12, 50, 15);
          ctx.beginPath();
          ctx.arc(ghostX + 12, roadY - 2, 5, 0, Math.PI * 2);
          ctx.arc(ghostX + 38, roadY - 2, 5, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = '#06b6d4';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`⚡ Strobe Tracker: v_instant = ${v0} m/s, a = -${(mu * g).toFixed(2)} m/s²`, 30, roadY + 40);
      }
    } else if (simulationType === 'circuit-mystery') {
      // Circuit mystery: Dim bulb
      const emf = variableValues.supplyVoltage ?? 12;
      const r_int = variableValues.internalResistance ?? 9;
      const r_bulb = variableValues.bulbResistance ?? 6;
      const current = emf / (r_bulb + r_int);
      const v_terminal = current * r_bulb;
      const p_bulb = current * current * r_bulb;

      // Draw schematic
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.strokeRect(50, 40, w - 100, h - 80);

      // Internal resistance resistor box
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(w * 0.35 - 20, 25, 40, 30);
      ctx.strokeStyle = '#ef4444';
      ctx.strokeRect(w * 0.35 - 20, 25, 40, 30);
      ctx.fillStyle = '#ef4444';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`r_int=${r_int.toFixed(1)}Ω`, w * 0.35, 43);

      // Bulb at right
      const bulbX = w - 50;
      const bulbY = h / 2;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(bulbX - 25, bulbY - 25, 50, 50);

      // Glow
      const glowR = Math.min(45, 10 + p_bulb * 1.5);
      const bulbGrad = ctx.createRadialGradient(bulbX, bulbY, 2, bulbX, bulbY, glowR);
      bulbGrad.addColorStop(0, `rgba(251, 191, 36, ${Math.min(0.9, p_bulb / 24)})`);
      bulbGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = bulbGrad;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, glowR, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 18, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`${p_bulb.toFixed(1)} W`, bulbX, bulbY + 34);

      // Digital Multimeter HUD if probe equipped
      if (activeEquipment.some(e => e.includes('Multimeter') || e.includes('Probe') || e.includes('Gauge'))) {
        ctx.fillStyle = '#022c22';
        ctx.fillRect(w / 2 - 110, h - 38, 220, 26);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(w / 2 - 110, h - 38, 220, 26);
        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`MULTIMETER: ${v_terminal.toFixed(2)} V  |  ${(current * 1000).toFixed(0)} mA`, w / 2, h - 21);
      } else {
        // Standard reading
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`V_bulb = ${v_terminal.toFixed(2)} V  |  I = ${current.toFixed(2)} A`, w / 2, h - 22);
      }
    } else {
      // General scientific measurement chamber representation
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(30, 30, w - 60, h - 60);
      ctx.strokeStyle = '#38bdf8';
      ctx.strokeRect(30, 30, w - 60, h - 60);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Controlled Experimental Apparatus', w / 2, h / 2 - 15);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText(`Active Instruments: ${activeEquipment.join(', ') || 'Standard Sensors'}`, w / 2, h / 2 + 15);
    }
  }, [simulationType, variableValues, activeEquipment]);

  return (
    <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
