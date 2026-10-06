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
    } else if (simulationType === 'reaction-slowdown') {
      // The Disappearing Cross Reaction (Sodium Thiosulfate + HCl -> Colloidal Sulfur)
      const tempC = variableValues.reactionTemp ?? 25;
      const thiosulfateConc = variableValues.thiosulfateConc ?? 0.1;
      // Arrhenius rate: k ~ A * exp(-Ea / RT)
      const rateConstant = 0.05 * Math.exp(0.045 * (tempC - 20)) * (thiosulfateConc / 0.1);
      const turbidity = Math.min(1.0, rateConstant * 1.5);
      const timeToDisappear = Math.max(5, Math.round(100 / (rateConstant * 10)));

      // Table & paper with black "X" cross mark
      const flaskX = w * 0.45;
      const flaskY = h * 0.58;

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(40, flaskY + 30, w - 80, 25);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(40, flaskY + 30, w - 80, 25);

      // White paper square with "X" mark
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(flaskX - 35, flaskY + 18, 70, 16);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(flaskX - 16, flaskY + 22);
      ctx.lineTo(flaskX + 16, flaskY + 30);
      ctx.moveTo(flaskX + 16, flaskY + 22);
      ctx.lineTo(flaskX - 16, flaskY + 30);
      ctx.stroke();

      // Conical Flask body
      ctx.beginPath();
      ctx.moveTo(flaskX - 14, flaskY - 60); // Neck left
      ctx.lineTo(flaskX + 14, flaskY - 60); // Neck right
      ctx.lineTo(flaskX + 14, flaskY - 35);
      ctx.lineTo(flaskX + 50, flaskY + 20); // Base right
      ctx.lineTo(flaskX - 50, flaskY + 20); // Base left
      ctx.lineTo(flaskX - 14, flaskY - 35);
      ctx.closePath();

      // Liquid fill with yellow colloidal sulfur turbidity
      const liquidGrad = ctx.createLinearGradient(flaskX, flaskY - 20, flaskX, flaskY + 20);
      liquidGrad.addColorStop(0, `rgba(253, 224, 71, ${Math.min(0.95, turbidity * 0.9)})`);
      liquidGrad.addColorStop(1, `rgba(234, 179, 8, ${Math.min(0.98, turbidity)})`);
      ctx.fillStyle = liquidGrad;
      ctx.fill();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Obscuration overlay on the "X" viewed through liquid
      ctx.fillStyle = `rgba(254, 240, 138, ${turbidity * 0.9})`;
      ctx.fillRect(flaskX - 22, flaskY + 16, 44, 18);

      // Metrics & Spectrophotometer HUD
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Na₂S₂O₃ + 2HCl ➔ S(s) + SO₂ + 2NaCl + H₂O', 35, 30);

      ctx.fillStyle = turbidity > 0.85 ? '#ef4444' : turbidity > 0.5 ? '#f59e0b' : '#10b981';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`Cross Visibility: ${turbidity > 0.85 ? 'OBSCURED (Reaction Done)' : turbidity > 0.5 ? 'Fading' : 'Clear'}`, 35, 48);
      ctx.fillText(`Temp = ${tempC}°C | [Na₂S₂O₃] = ${thiosulfateConc} M | t_disappear ≈ ${timeToDisappear}s`, 35, 66);
    } else if (simulationType === 'plant-growth') {
      // Phototropism & Nutrient Stunting
      const lightSide = variableValues.lightDirection ?? 1; // -1 left, 0 overhead, 1 right
      const nitrogenLevel = variableValues.soilNitrogenPpm ?? 50; // 0 to 100
      const bendDeg = lightSide * 32;

      // Planter Pot
      const potX = w * 0.5;
      const potY = h * 0.72;

      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.moveTo(potX - 45, potY);
      ctx.lineTo(potX + 45, potY);
      ctx.lineTo(potX + 35, potY + 45);
      ctx.lineTo(potX - 35, potY + 45);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Soil
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(potX - 40, potY - 4, 80, 8);

      // Seedling stem with phototropic curve towards light
      ctx.save();
      ctx.translate(potX, potY);
      ctx.rotate((bendDeg * Math.PI) / 180);

      // Chlorophyll color based on Nitrogen
      const leafColor = nitrogenLevel > 40 ? '#22c55e' : nitrogenLevel > 15 ? '#84cc16' : '#eab308';
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(0, -45, 0, -85);
      ctx.stroke();

      // Leaves
      ctx.fillStyle = leafColor;
      ctx.beginPath();
      ctx.ellipse(-15, -60, 16, 7, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(15, -60, 16, 7, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -90, 14, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Light Lamp icon on corresponding side
      const lampX = lightSide < 0 ? 55 : lightSide > 0 ? w - 55 : w / 2;
      const lampY = 45;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(lampX, lampY, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.stroke();
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SUNLIGHT', lampX, lampY + 28);

      // Status text
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Auxin Asymmetric Redistribution (Phototropism)', 35, 26);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#a3e635';
      ctx.fillText(`Nitrogen: ${nitrogenLevel} ppm (${nitrogenLevel < 30 ? 'Nitrate Deficient Chlorosis' : 'Vibrant Chlorophyll'})`, 35, 42);
      ctx.fillText(`Auxin concentration highest on shaded flank ➔ Curvature: ${bendDeg}°`, 35, 58);
    } else if (simulationType === 'enzyme-denaturation') {
      // Catalase breakdown of H2O2 into H2O + O2 (Foam Column Height)
      const tempC = variableValues.reactionTemp ?? 37;
      const ph = variableValues.phLevel ?? 7.0;

      // Enzyme activity bell curves for Temp and pH
      const tempFactor = tempC > 55 ? 0 : Math.max(0, 1 - Math.pow((tempC - 37) / 20, 2));
      const phFactor = Math.max(0, 1 - Math.pow((ph - 7.0) / 2.5, 2));
      const activityRate = tempFactor * phFactor;
      const foamHeight = Math.min(100, activityRate * 95);
      const isDenatured = tempC > 55;

      const cylX = w * 0.5;
      const cylY = h * 0.78;
      const cylW = 48;
      const cylH = 130;

      // Graduated Cylinder
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cylX - cylW / 2, cylY - cylH, cylW, cylH);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(cylX - cylW / 2, cylY - cylH, cylW, cylH);

      // Base liquid (H2O2 + Enzyme solution)
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(cylX - cylW / 2 + 2, cylY - 25, cylW - 4, 23);

      // Foam column rising (O2 bubbles)
      if (foamHeight > 2) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(cylX - cylW / 2 + 2, cylY - 25 - foamHeight, cylW - 4, foamHeight);
        ctx.strokeStyle = '#cbd5e1';
        ctx.strokeRect(cylX - cylW / 2 + 2, cylY - 25 - foamHeight, cylW - 4, foamHeight);
      }

      // Cylinder volume tick markings
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      for (let mark = 0; mark <= 100; mark += 20) {
        const markY = cylY - 25 - (mark / 100) * 95;
        ctx.beginPath();
        ctx.moveTo(cylX + cylW / 2 - 8, markY);
        ctx.lineTo(cylX + cylW / 2, markY);
        ctx.stroke();
      }

      // Header Readout
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('2 H₂O₂  —(Catalase Enzyme)➔  2 H₂O + O₂(g) Bubble Foam', 35, 26);

      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = isDenatured ? '#ef4444' : activityRate > 0.6 ? '#10b981' : '#f59e0b';
      ctx.fillText(
        isDenatured
          ? 'STATUS: IRREVERSIBLY DENATURED (Tertiary Folding Disrupted, Zero Activity)'
          : `STATUS: ACTIVE (Catalytic Activity: ${(activityRate * 100).toFixed(0)}%)`,
        35,
        45
      );
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`Temp = ${tempC}°C (Optimal ~37°C) | pH = ${ph.toFixed(1)} | Foam Vol = ${foamHeight.toFixed(0)} mL`, 35, 62);
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
