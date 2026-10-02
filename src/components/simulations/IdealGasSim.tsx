import React, { useRef, useEffect } from 'react';
import { Formula } from '../common/Formula';
import { GraphViewer } from '../common/GraphViewer';
import { Gauge } from 'lucide-react';

interface IdealGasSimProps {
  temperatureK: number; // K (100 - 600)
  volumeLiters: number; // L (5 - 30)
  molesN: number; // mol (0.5 - 3.0)
}

interface GasParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const IdealGasSim: React.FC<IdealGasSimProps> = ({
  temperatureK,
  volumeLiters,
  molesN,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<GasParticle[]>([]);

  // Ideal Gas Law: P = n R T / V
  // R = 0.0821 L·atm/(mol·K)
  const R_atm = 0.08206;
  const pressureAtm = (molesN * R_atm * temperatureK) / volumeLiters;

  // Initialize or maintain particle count
  useEffect(() => {
    const targetCount = Math.round(molesN * 25);
    const pts: GasParticle[] = [];
    const speed = Math.sqrt(temperatureK / 300) * 3;
    for (let i = 0; i < targetCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      pts.push({
        x: 30 + Math.random() * 150,
        y: 30 + Math.random() * 150,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
      });
    }
    particlesRef.current = pts;
  }, [molesN]);

  // Simulation physics frame loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      // Piston cylinder chamber geometry
      const chamberLeft = 40;
      const chamberTop = 30;
      const chamberH = h - 60;
      // Chamber width scales with volume (5L to 30L -> 100px to w - 160px)
      const maxChamberW = w - 180;
      const chamberW = 80 + ((volumeLiters - 5) / 25) * (maxChamberW - 80);

      // Cylinder Walls
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(chamberLeft, chamberTop);
      ctx.lineTo(chamberLeft, chamberTop + chamberH);
      ctx.lineTo(chamberLeft + chamberW, chamberTop + chamberH);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(chamberLeft, chamberTop);
      ctx.lineTo(chamberLeft + chamberW, chamberTop);
      ctx.stroke();

      // Piston head (movable right barrier)
      const pistonX = chamberLeft + chamberW;
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(pistonX - 6, chamberTop, 12, chamberH);
      // Piston shaft
      ctx.fillStyle = '#64748b';
      ctx.fillRect(pistonX + 6, chamberTop + chamberH / 2 - 8, 45, 16);

      // Update and draw gas particles
      const speedScale = Math.sqrt(temperatureK / 300);
      const pts = particlesRef.current;

      ctx.fillStyle = '#38bdf8';
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx * speedScale * 0.7;
        p.y += p.vy * speedScale * 0.7;

        // Bounce left wall
        if (p.x < chamberLeft + 8) {
          p.x = chamberLeft + 8;
          p.vx = Math.abs(p.vx);
        }
        // Bounce right piston
        if (p.x > pistonX - 10) {
          p.x = pistonX - 10;
          p.vx = -Math.abs(p.vx);
        }
        // Bounce top / bottom
        if (p.y < chamberTop + 8) {
          p.y = chamberTop + 8;
          p.vy = Math.abs(p.vy);
        }
        if (p.y > chamberTop + chamberH - 8) {
          p.y = chamberTop + chamberH - 8;
          p.vy = -Math.abs(p.vy);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- Pressure Dial Gauge on Right Side ---
      const dialX = w - 75;
      const dialY = h / 2;
      const dialRadius = 45;

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(dialX, dialY, dialRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pressure needle angle: 0 atm = -135°, 10 atm = +135°
      const maxPress = 10;
      const pressFraction = Math.min(1, pressureAtm / maxPress);
      const needleAngle = -Math.PI * 0.75 + pressFraction * Math.PI * 1.5;

      ctx.strokeStyle = pressureAtm > 6 ? '#ef4444' : '#10b981';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(dialX, dialY);
      ctx.lineTo(dialX + Math.cos(needleAngle) * (dialRadius - 10), dialY + Math.sin(needleAngle) * (dialRadius - 10));
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${pressureAtm.toFixed(2)} atm`, dialX, dialY + dialRadius + 18);
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Manometer', dialX, dialY - dialRadius - 6);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [temperatureK, volumeLiters, molesN, pressureAtm]);

  return (
    <div className="space-y-4">
      {/* Simulation Screen */}
      <div className="relative bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <Gauge className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-300 font-medium">Kinetic Molecular Theory & Ideal Gas Piston</span>
        </div>

        <canvas ref={canvasRef} className="w-full h-64 sm:h-72 block" />

        {/* Telemetry Bar */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 text-slate-300">
            <div>
              <span className="text-slate-500">Pressure (P): </span>
              <span className="text-emerald-400 font-bold">{pressureAtm.toFixed(2)}</span> atm
            </div>
            <div>
              <span className="text-slate-500">Volume (V): </span>
              <span className="text-cyan-400 font-bold">{volumeLiters.toFixed(1)}</span> L
            </div>
            <div>
              <span className="text-slate-500">Temperature (T): </span>
              <span className="text-amber-400 font-bold">{temperatureK}</span> K
            </div>
            <div>
              <span className="text-slate-500">Amount (n): </span>
              <span className="text-purple-400 font-bold">{molesN.toFixed(2)}</span> mol
            </div>
          </div>
        </div>
      </div>

      {/* Thermodynamic Isotherms & Isochores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <GraphViewer
          title="Boyle's Isotherm: P vs V (Constant T)"
          xLabel="V"
          yLabel="P(V)"
          xUnit="L"
          yUnit="atm"
          xDomain={[5, 30]}
          yDomain={[0, Math.ceil(((molesN * R_atm * temperatureK) / 5) * 1.15)]}
          curveFunction={(v) => (molesN * R_atm * temperatureK) / v}
          currentMarker={{ x: volumeLiters, y: pressureAtm }}
          curveColor="#38bdf8"
          height={160}
        />
        <GraphViewer
          title="Gay-Lussac's Isochore: P vs T (Constant V)"
          xLabel="T"
          yLabel="P(T)"
          xUnit="K"
          yUnit="atm"
          xDomain={[100, 600]}
          yDomain={[0, Math.ceil(((molesN * R_atm * 600) / volumeLiters) * 1.15)]}
          curveFunction={(t) => (molesN * R_atm * t) / volumeLiters}
          currentMarker={{ x: temperatureK, y: pressureAtm }}
          curveColor="#f59e0b"
          height={160}
        />
      </div>

      {/* KaTeX Thermodynamic Formalism */}
      <div className="bg-[#131E36] rounded-xl border border-slate-800 p-4">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Equation of State</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Ideal Gas Law</div>
            <Formula tex={`PV = nRT \\implies P = \\frac{${molesN.toFixed(1)} \\cdot 0.0821 \\cdot ${temperatureK}}{${volumeLiters.toFixed(1)}} = ${pressureAtm.toFixed(2)}\\text{ atm}`} />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Root-Mean-Square Speed</div>
            <Formula tex="v_{\\text{rms}} = \\sqrt{\\frac{3RT}{M}}" />
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1">Average Kinetic Energy per Molecule</div>
            <Formula tex="\\overline{K} = \\frac{3}{2} k_B T" />
          </div>
        </div>
      </div>
    </div>
  );
};
