import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Play, Pause, RotateCcw, Sliders, Waves, Thermometer, Radio, Compass, Sparkles } from 'lucide-react';

interface SonarUltrasoundSimProps {
  initialTemperatureC?: number;
  initialDistanceM?: number;
}

type SimulationMode = 'sonar' | 'medical-usg' | 'bat-echo';

export const SonarUltrasoundSim: React.FC<SonarUltrasoundSimProps> = ({
  initialTemperatureC = 20,
  initialDistanceM = 2618,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Mode & Parameters
  const [mode, setMode] = useState<SimulationMode>('sonar');
  const [temperatureC, setTemperatureC] = useState<number>(initialTemperatureC); // °C
  const [distanceM, setDistanceM] = useState<number>(initialDistanceM); // meters
  const [frequencyKhz, setFrequencyKhz] = useState<number>(40); // 40 kHz ultrasound

  // Animation pulse state
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [pulseProgress, setPulseProgress] = useState<number>(0); // 0 to 1 (out and back)
  const [echoDetected, setEchoDetected] = useState<boolean>(false);

  // Physics: Speed of sound in air vs water vs temperature effect
  // In air: v = 331.3 * sqrt(1 + T / 273.15) ≈ 331.3 + 0.6 * T
  // In water or general medium: base speed modulated by temperature
  const baseSpeed = mode === 'sonar' ? 1500 : (mode === 'medical-usg' ? 1540 : 343);
  const tempCoefficient = mode === 'sonar' ? 3.0 : (mode === 'medical-usg' ? 2.5 : 0.6);
  const soundSpeed = baseSpeed + tempCoefficient * (temperatureC - 20);

  // Calculated roundtrip time: t = 2 * d / v
  const transitTime = (2 * distanceM) / soundSpeed;

  // Wavelength: λ = v / f
  const wavelengthMm = (soundSpeed / (frequencyKhz * 1000)) * 1000;

  // Start Ping Animation
  const startPing = () => {
    setIsPinging(true);
    setPulseProgress(0);
    setEchoDetected(false);
  };

  // Animation loop for wave propagation
  useEffect(() => {
    let animId: number;
    let lastStamp = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastStamp) / 1000;
      lastStamp = now;

      if (isPinging) {
        setPulseProgress((prev) => {
          const next = prev + dt * 0.7; // speed of animation
          if (next >= 1.0) {
            setIsPinging(false);
            setEchoDetected(true);
            return 1.0;
          }
          return next;
        });
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPinging]);

  // Canvas visual rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background gradient
    ctx.fillStyle = mode === 'sonar' ? '#061325' : (mode === 'medical-usg' ? '#09151f' : '#050b14');
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const transY = 50;
    const targetY = height - 60;

    // Draw Transducer / Emitter at top
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(centerX - 35, transY - 15, 70, 25, 6);
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(mode === 'sonar' ? 'SONAR Transceiver' : (mode === 'medical-usg' ? 'USG Probe' : 'Bat Emitter'), centerX, transY + 2);

    // Draw Target (Seabed reef or internal tissue boundary)
    ctx.fillStyle = mode === 'sonar' ? '#1e293b' : (mode === 'medical-usg' ? '#334155' : '#1f2937');
    ctx.beginPath();
    ctx.roundRect(40, targetY, width - 80, 20, 8);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(40, targetY, width - 80, 20);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText(mode === 'sonar' ? 'Seabed / Ocean Floor' : (mode === 'medical-usg' ? 'Organ Boundary / Tissue Interface' : 'Obstacle / Insect Prey'), centerX, targetY + 14);

    // Draw Sound Waves (Concentric Wavefronts / Compression & Rarefaction pulses)
    const maxRadius = targetY - transY;
    const currentRadius = pulseProgress <= 0.5 
      ? pulseProgress * 2 * maxRadius 
      : (1 - (pulseProgress - 0.5) * 2) * maxRadius;

    // Draw emitted wavefronts
    if (isPinging || echoDetected) {
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      for (let r = 20; r <= currentRadius; r += 25) {
        const alpha = Math.max(0, 1 - r / maxRadius);
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.beginPath();
        ctx.arc(centerX, transY + 10, r, 0, Math.PI);
        ctx.stroke();
      }
    }

    // Echo reflection indicator
    if (echoDetected) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.beginPath();
      ctx.arc(centerX, targetY, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('⚡ Echo Detected! Roundtrip Complete', centerX, targetY - 15);
    }

  }, [pulseProgress, isPinging, echoDetected, mode, distanceM]);

  return (
    <div className="bg-[#070e1c] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Waves className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Reflection of Sound, SONAR & Temperature Effect
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                2d = v(T) · t
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Observe actual acoustic wavefront reflection and how temperature changes sound speed $v(T)$ and echo transit time.
            </p>
          </div>
        </div>

        {/* Mode Toggles */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          {[
            { id: 'sonar', label: '⚓ Ocean SONAR' },
            { id: 'medical-usg', label: '🩺 Medical USG' },
            { id: 'bat-echo', label: '🦇 Bat Echolocation' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id as SimulationMode);
                setDistanceM(m.id === 'sonar' ? 2618 : (m.id === 'medical-usg' ? 0.15 : 15));
              }}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                mode === m.id ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-[#090d16]">
        {/* Controls Overlay Top Left */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={startPing}
            disabled={isPinging}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow bg-cyan-500 text-slate-950 hover:bg-cyan-400"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{isPinging ? 'Transmitting Pulse...' : 'Send Acoustic Ping'}</span>
          </button>
          <button
            onClick={() => {
              setIsPinging(false);
              setEchoDetected(false);
              setPulseProgress(0);
            }}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Live Status Top Right */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
          <span className="text-cyan-400">v(T) = {soundSpeed.toFixed(1)} m/s</span>
          <span className="text-amber-400">t = {transitTime.toFixed(3)}s</span>
        </div>

        <canvas ref={canvasRef} width={760} height={280} className="w-full h-70 block select-none" />
      </div>

      {/* Quantitative Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Medium Temperature ($T$)</div>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {temperatureC} <span className="text-xs text-slate-400 font-normal">°C</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Sound Speed ($v$)</div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {soundSpeed.toFixed(1)} <span className="text-xs text-slate-400 font-normal">m/s</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Echo Transit Time ($t$)</div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {transitTime.toFixed(3)} <span className="text-xs text-slate-400 font-normal">seconds</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Calculated Distance ($d$)</div>
          <div className="text-xl font-bold font-mono text-purple-400">
            {distanceM.toFixed(1)} <span className="text-xs text-slate-400 font-normal">meters</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Sliders */}
      <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          Temperature & Distance Parameters
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-300 font-medium">Temperature ($T$)</span>
              <span className="font-mono text-cyan-400 font-bold">{temperatureC} °C</span>
            </div>
            <input
              type="range"
              min="-10"
              max="40"
              step="1"
              value={temperatureC}
              onChange={(e) => setTemperatureC(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-amber-300 font-medium">Target Distance ($d$)</span>
              <span className="font-mono text-amber-400 font-bold">{distanceM.toFixed(0)} m</span>
            </div>
            <input
              type="range"
              min={mode === 'sonar' ? 500 : (mode === 'medical-usg' ? 0.05 : 2)}
              max={mode === 'sonar' ? 5000 : (mode === 'medical-usg' ? 0.4 : 30)}
              step={mode === 'sonar' ? 100 : 0.01}
              value={distanceM}
              onChange={(e) => setDistanceM(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
