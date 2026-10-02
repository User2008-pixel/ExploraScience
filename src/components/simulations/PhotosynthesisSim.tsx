import React, { useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Sun, Leaf } from 'lucide-react';
import { GraphViewer } from '../common/GraphViewer';

interface PhotosynthesisSimProps {
  lightIntensity: number; // 0 - 1000
  co2Concentration: number; // 100 - 1200 ppm
  tempC: number; // 5 - 50 °C
}

export const PhotosynthesisSim: React.FC<PhotosynthesisSimProps> = ({
  lightIntensity,
  co2Concentration,
  tempC,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Blackman's Law calculation
  // 1. Light reaction capacity (photons driving PSII/PSI)
  const lightRate = 100 * (lightIntensity / (lightIntensity + 250));
  // 2. Dark reaction / RuBisCO carbon capacity
  const co2Rate = 95 * (co2Concentration / (co2Concentration + 300));
  // 3. Thermal bell curve (peak at 28-35°C, denaturation at >42°C)
  const tempFactor = tempC > 45 ? 0 : tempC < 5 ? 0.05 : Math.exp(-Math.pow((tempC - 30) / 12, 2));

  // The overall rate is limited by the minimum factor
  const limitingRate = Math.min(lightRate, co2Rate) * tempFactor;
  const activeLimiter =
    tempC > 42
      ? 'Thermal Denaturation'
      : tempC < 12
      ? 'Low Temperature (Enzyme Sluggishness)'
      : lightRate < co2Rate
      ? 'Light Intensity'
      : 'CO₂ Concentration';

  // Oxygen bubble generation rate (bubbles per second)
  const bubbleRate = Math.max(0, limitingRate * 0.12);

  // Animate oxygen bubbles & sunlight rays
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    interface Bubble {
      x: number;
      y: number;
      radius: number;
      speed: number;
    }
    const bubbles: Bubble[] = [];

    let photonOffset = 0;
    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Background: Aqueous beaker / chloroplast chamber
      ctx.fillStyle = '#09151e';
      ctx.fillRect(0, 0, w, h);

      // Water fluid container
      ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.fillRect(20, 40, w - 40, h - 50);

      // Light beam overlay from top
      if (lightIntensity > 50) {
        const lightAlpha = Math.min(0.4, (lightIntensity / 1000) * 0.4);
        const lightGrad = ctx.createLinearGradient(0, 0, 0, h);
        lightGrad.addColorStop(0, `rgba(253, 224, 71, ${lightAlpha})`);
        lightGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(20, 40, w - 40, h - 50);
      }

      // Chloroplast Organelle (Center Oval)
      const clX = w / 2;
      const clY = h * 0.65;
      const clRx = Math.min(160, w * 0.38);
      const clRy = 45;

      // Chloroplast double membrane
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.fillStyle = '#064e3b';
      ctx.beginPath();
      ctx.ellipse(clX, clY, clRx, clRy, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Thylakoid Grana Stacks (stacked green discs)
      const numStacks = 5;
      for (let s = 0; s < numStacks; s++) {
        const sx = clX - clRx * 0.65 + (s / (numStacks - 1)) * (clRx * 1.3);
        const discCount = 4;
        for (let d = 0; d < discCount; d++) {
          const sy = clY - 14 + d * 7;
          ctx.fillStyle = '#059669';
          ctx.beginPath();
          ctx.ellipse(sx, sy, 18, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      ctx.fillStyle = '#a7f3d0';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Chloroplast Stroma & Thylakoid Grana', clX, clY + clRy - 8);

      // Spawn Oxygen Bubbles based on rate
      if (Math.random() < bubbleRate * 0.08 && bubbles.length < 35) {
        bubbles.push({
          x: clX - clRx * 0.7 + Math.random() * clRx * 1.4,
          y: clY - 20,
          radius: 2.5 + Math.random() * 3.5,
          speed: 1.2 + Math.random() * 1.8,
        });
      }

      // Update and draw bubbles (O2 evolution)
      ctx.strokeStyle = '#38bdf8';
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.2;

      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y -= b.speed;
        b.x += Math.sin(b.y * 0.1) * 0.5; // slight wobble

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Remove bubbles reaching water surface
        if (b.y < 50) {
          bubbles.splice(i, 1);
        }
      }

      // Photons animation falling from above
      photonOffset = (photonOffset + 2) % 30;
      if (lightIntensity > 100) {
        ctx.fillStyle = '#fef08a';
        for (let x = 40; x < w - 40; x += 40) {
          const py = 45 + ((x + photonOffset) % (clY - 70));
          ctx.beginPath();
          ctx.arc(x, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [lightIntensity, co2Concentration, tempC, bubbleRate]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-300 font-medium">In Vitro Photosynthetic Chamber</span>
        </div>

        {/* Limiting Factor Badge */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <span className="text-slate-400">Bottleneck Factor:</span>
          <span className="font-bold text-amber-400">{activeLimiter}</span>
        </div>

        <canvas ref={canvasRef} className="w-full h-64 sm:h-72 block" />

        {/* Telemetry bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-500">Light Yield: </span>
              <span className="text-yellow-400 font-bold">{lightRate.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-slate-500">CO₂ Yield: </span>
              <span className="text-sky-400 font-bold">{co2Rate.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-slate-500">O₂ Evolution: </span>
              <span className="text-emerald-400 font-bold">{(limitingRate).toFixed(1)} μmol/m²·s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blackman Plateau Curves */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GraphViewer
          title="Blackman Plateau: Rate vs Light Intensity"
          xLabel="I_{\text{light}}"
          yLabel="\text{Rate}"
          xUnit="μmol"
          yUnit="arb"
          xDomain={[0, 1000]}
          yDomain={[0, 100]}
          curveFunction={(I) => {
            const lR = 100 * (I / (I + 250));
            return Math.min(lR, co2Rate) * tempFactor;
          }}
          currentMarker={{ x: lightIntensity, y: limitingRate }}
          curveColor="#facc15"
          height={160}
        />
        <GraphViewer
          title="Enzyme Kinetics: Rate vs Temperature (°C)"
          xLabel="T"
          yLabel="\text{Rate}"
          xUnit="°C"
          yUnit="arb"
          xDomain={[5, 50]}
          yDomain={[0, 100]}
          curveFunction={(T) => {
            const tFac = T > 45 ? 0 : T < 5 ? 0.05 : Math.exp(-Math.pow((T - 30) / 12, 2));
            return Math.min(lightRate, co2Rate) * tFac;
          }}
          currentMarker={{ x: tempC, y: limitingRate }}
          curveColor="#10b981"
          height={160}
        />
      </div>

      {/* Biochemical Equation */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Photosynthesis Biochemical Equation</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Global Stoichiometric Equation</div>
            <Formula tex="6\text{CO}_2 + 6\text{H}_2\text{O} + h\nu \xrightarrow{\text{chlorophyll}} \text{C}_6\text{H}_{12}\text{O}_6 + 6\text{O}_2" />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Blackman's Law of Limiting Factors</div>
            <Formula tex="\text{Rate} = \min\left( f(I_{\text{light}}), g([\text{CO}_2]), h(T) \right)" />
          </div>
        </div>
      </div>
    </div>
  );
};
