import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Play, Pause, RotateCcw, Sliders, Zap, Shield, Sparkles, Rocket, Crosshair, Scale } from 'lucide-react';

interface ActionReactionSimProps {
  initialMassA?: number;
  initialMassB?: number;
  initialForce?: number;
}

type ScenarioMode = 'skaters' | 'rifle-recoil' | 'rocket' | 'spring-balances';

export const ActionReactionSim: React.FC<ActionReactionSimProps> = ({
  initialMassA = 60,
  initialMassB = 30,
  initialForce = 120,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scenario Mode
  const [mode, setMode] = useState<ScenarioMode>('skaters');

  // Interactive Variables
  // Skaters Mode: Person A (m_A) & Person B (m_B) on frictionless ice
  const [massA, setMassA] = useState<number>(initialMassA); // kg
  const [massB, setMassB] = useState<number>(initialMassB); // kg
  const [pushForce, setPushForce] = useState<number>(initialForce); // N
  const [pushDuration, setPushDuration] = useState<number>(0.4); // s

  // Rifle Mode: Rifle Mass M_g (kg) & Bullet Mass m_b (grams)
  const [gunMassKg, setGunMassKg] = useState<number>(3.0); // kg
  const [bulletMassG, setBulletMassG] = useState<number>(20); // grams
  const [bulletMuzzleVel, setBulletMuzzleVel] = useState<number>(300); // m/s

  // Spring Balances Mode: Applied pull force (N)
  const [pullForceN, setPullForceN] = useState<number>(45); // N

  // Rocket Mode: Fuel expulsion rate (kg/s) and exhaust speed (m/s)
  const [rocketDryMass, setRocketDryMass] = useState<number>(500); // kg
  const [burnRateKgS, setBurnRateKgS] = useState<number>(25); // kg/s
  const [exhaustSpeedMs, setExhaustSpeedMs] = useState<number>(800); // m/s

  // Simulation Playback & State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simTime, setSimTime] = useState<number>(0);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [isFired, setIsFired] = useState<boolean>(false);

  // Dynamic kinematic values for Skaters
  // Person A starts at x = 4m, Person B starts at x = 4.4m (touching hands)
  const [posA, setPosA] = useState<number>(4.0);
  const [velA, setVelA] = useState<number>(0);
  const [posB, setPosB] = useState<number>(4.4);
  const [velB, setVelB] = useState<number>(0);

  // Gun recoil position & bullet position
  const [gunX, setGunX] = useState<number>(3.5);
  const [bulletX, setBulletX] = useState<number>(4.0);
  const [gunV, setGunV] = useState<number>(0);
  const [bulletV, setBulletV] = useState<number>(0);

  // Rocket altitude & velocity
  const [rocketY, setRocketY] = useState<number>(0);
  const [rocketV, setRocketV] = useState<number>(0);

  // Theoretical Computations
  // Skaters:
  // F_AB = pushForce, F_BA = -pushForce
  // a_A = -pushForce / massA, a_B = +pushForce / massB
  // v_A = a_A * pushDuration, v_B = a_B * pushDuration
  const accelA = -pushForce / massA;
  const accelB = pushForce / massB;
  const finalVelA = accelA * pushDuration;
  const finalVelB = accelB * pushDuration;

  // Rifle Recoil:
  // m_bullet * v_bullet + M_gun * V_recoil = 0
  // V_recoil = -(m_bullet_kg * v_bullet) / M_gun
  const bulletMassKg = bulletMassG / 1000;
  const theoreticalRecoilV = -((bulletMassKg * bulletMuzzleVel) / gunMassKg);
  const bulletMomentum = bulletMassKg * bulletMuzzleVel;
  const gunMomentum = gunMassKg * theoreticalRecoilV;

  // Rocket Thrust:
  // F_thrust = burnRate * exhaustSpeed (Reaction thrust)
  const rocketThrustN = burnRateKgS * exhaustSpeedMs;
  const rocketNetAccel = rocketThrustN / rocketDryMass - 9.8;

  // Reset function
  const resetSim = () => {
    setIsPlaying(false);
    setIsFired(false);
    setSimTime(0);

    setPosA(4.0);
    setVelA(0);
    setPosB(4.4);
    setVelB(0);

    setGunX(3.5);
    setBulletX(4.0);
    setGunV(0);
    setBulletV(0);

    setRocketY(0);
    setRocketV(0);
  };

  // Trigger fire / push
  const triggerAction = () => {
    setIsPlaying(true);
    setIsFired(true);

    if (mode === 'rifle-recoil') {
      setBulletV(bulletMuzzleVel);
      setGunV(theoreticalRecoilV);
    }
  };

  // Physics animation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dtRaw = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const dt = Math.min(dtRaw, 0.05) * simSpeed;

      if (isPlaying) {
        setSimTime((prev) => prev + dt);

        if (mode === 'skaters') {
          // Accelerate during push duration, then drift at constant velocity
          if (simTime < pushDuration) {
            setVelA((prev) => prev + accelA * dt);
            setVelB((prev) => prev + accelB * dt);
          }
          setPosA((prev) => Math.max(0.2, prev + velA * dt));
          setPosB((prev) => Math.min(8.6, prev + velB * dt));
        } else if (mode === 'rifle-recoil') {
          setBulletX((prev) => prev + bulletV * dt * 0.05); // scaled visual speed
          setGunX((prev) => Math.max(0.5, prev + gunV * dt));
        } else if (mode === 'rocket') {
          setRocketV((prev) => prev + Math.max(0, rocketNetAccel) * dt);
          setRocketY((prev) => prev + rocketV * dt);
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, simSpeed, mode, simTime, pushDuration, accelA, accelB, velA, velB, bulletV, gunV, rocketV, rocketNetAccel]);

  // Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#080d1a';
    ctx.fillRect(0, 0, width, height);

    if (mode === 'skaters') {
      // -----------------------------------------------------------------
      // DRAW TWO SKATERS ON ICE PUSHING OFF EACH OTHER
      // -----------------------------------------------------------------
      const iceY = height - 60;

      // Ice surface
      const iceGrad = ctx.createLinearGradient(0, iceY, 0, iceY + 30);
      iceGrad.addColorStop(0, '#38bdf8');
      iceGrad.addColorStop(0.2, '#0284c7');
      iceGrad.addColorStop(1, '#082f49');
      ctx.fillStyle = iceGrad;
      ctx.fillRect(20, iceY, width - 40, 25);

      // Ice reflections
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(25, iceY + 2, width - 50, 3);

      // Coordinate mapping (0 to 9 meters)
      const toPixel = (m: number) => 30 + (m / 9) * (width - 60);

      const skaterAPixelX = toPixel(posA);
      const skaterBPixelX = toPixel(posB);

      // Distance markings
      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      for (let m = 0; m <= 9; m++) {
        const px = toPixel(m);
        ctx.beginPath();
        ctx.moveTo(px, iceY);
        ctx.lineTo(px, iceY + 6);
        ctx.strokeStyle = '#334155';
        ctx.stroke();
        ctx.fillText(`${m}m`, px, iceY + 18);
      }

      // Draw Skater A (Cyan, heavier or lighter)
      const drawSkater = (x: number, mass: number, label: string, color: string, isLeft: boolean) => {
        const scale = 0.8 + 0.3 * Math.cbrt(mass / 40);
        const headRadius = 10 * scale;
        const bodyHeight = 35 * scale;
        const bodyY = iceY - bodyHeight - 12;

        // Shadow on ice
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(x, iceY - 2, 16 * scale, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Skates blade
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 14 * scale, iceY - 2);
        ctx.lineTo(x + 14 * scale, iceY - 2);
        ctx.stroke();

        // Legs
        ctx.strokeStyle = color;
        ctx.lineWidth = 4 * scale;
        ctx.beginPath();
        ctx.moveTo(x - 5, iceY - 2);
        ctx.lineTo(x, bodyY + bodyHeight * 0.6);
        ctx.lineTo(x + 5, iceY - 2);
        ctx.stroke();

        // Torso
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x - 9 * scale, bodyY, 18 * scale, bodyHeight * 0.65, 4);
        ctx.fill();

        // Arms (pushing out towards opponent)
        ctx.strokeStyle = color;
        ctx.lineWidth = 3.5 * scale;
        ctx.beginPath();
        ctx.moveTo(x, bodyY + 8);
        ctx.lineTo(x + (isLeft ? 20 : -20) * scale, bodyY + 12);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(x, bodyY - headRadius, headRadius, 0, Math.PI * 2);
        ctx.fill();

        // Label & Mass
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, bodyY - headRadius - 10);
        ctx.fillStyle = color;
        ctx.font = '10px monospace';
        ctx.fillText(`${mass} kg`, x, bodyY + bodyHeight * 0.35);
      };

      drawSkater(skaterAPixelX, massA, 'Skater A', '#38bdf8', true);
      drawSkater(skaterBPixelX, massB, 'Skater B', '#f59e0b', false);

      // DRAW EQUAL AND OPPOSITE FORCE VECTORS (During push)
      if (simTime < pushDuration && isPlaying) {
        // Force on A: pointing LEFT (reaction)
        const forceArrowLen = Math.min(120, pushForce * 0.6);

        // Vector F_BA on Skater A (pointing left)
        ctx.strokeStyle = '#ef4444';
        ctx.fillStyle = '#ef4444';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(skaterAPixelX, iceY - 65);
        ctx.lineTo(skaterAPixelX - forceArrowLen, iceY - 65);
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(skaterAPixelX - forceArrowLen, iceY - 65);
        ctx.lineTo(skaterAPixelX - forceArrowLen + 8, iceY - 70);
        ctx.lineTo(skaterAPixelX - forceArrowLen + 8, iceY - 60);
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`F_BA = -${pushForce} N (Reaction)`, skaterAPixelX - forceArrowLen / 2, iceY - 74);

        // Vector F_AB on Skater B (pointing right)
        ctx.strokeStyle = '#10b981';
        ctx.fillStyle = '#10b981';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(skaterBPixelX, iceY - 65);
        ctx.lineTo(skaterBPixelX + forceArrowLen, iceY - 65);
        ctx.stroke();
        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(skaterBPixelX + forceArrowLen, iceY - 65);
        ctx.lineTo(skaterBPixelX + forceArrowLen - 8, iceY - 70);
        ctx.lineTo(skaterBPixelX + forceArrowLen - 8, iceY - 60);
        ctx.closePath();
        ctx.fill();

        ctx.fillText(`F_AB = +${pushForce} N (Action)`, skaterBPixelX + forceArrowLen / 2, iceY - 74);
      } else {
        // Post-push: Draw velocity vectors
        const drawVelocityVector = (x: number, v: number, color: string, label: string) => {
          if (Math.abs(v) < 0.05) return;
          const arrowLen = v * 20;
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(x, iceY - 65);
          ctx.lineTo(x + arrowLen, iceY - 65);
          ctx.stroke();

          const dir = Math.sign(v);
          ctx.beginPath();
          ctx.moveTo(x + arrowLen, iceY - 65);
          ctx.lineTo(x + arrowLen - dir * 8, iceY - 69);
          ctx.lineTo(x + arrowLen - dir * 8, iceY - 61);
          ctx.closePath();
          ctx.fill();

          ctx.font = 'bold 11px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${label} = ${v.toFixed(2)} m/s`, x + arrowLen / 2, iceY - 73);
        };

        drawVelocityVector(skaterAPixelX, velA, '#38bdf8', 'v_A');
        drawVelocityVector(skaterBPixelX, velB, '#f59e0b', 'v_B');
      }
    } else if (mode === 'rifle-recoil') {
      // -----------------------------------------------------------------
      // DRAW RIFLE & BULLET RECOIL
      // -----------------------------------------------------------------
      const midY = height / 2 + 10;
      const gPx = 100 + (gunX - 3.5) * 80;
      const bPx = 100 + (bulletX - 3.5) * 80;

      // Gun Bench / Table
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(40, midY + 40, width - 80, 20);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(40, midY + 40, width - 80, 20);

      // Rifle Body (M_gun)
      ctx.fillStyle = '#475569';
      // Stock
      ctx.fillRect(gPx - 90, midY - 10, 50, 30);
      // Receiver & Handle
      ctx.fillStyle = '#334155';
      ctx.fillRect(gPx - 40, midY - 15, 60, 25);
      ctx.fillRect(gPx - 20, midY + 10, 15, 25); // Grip
      // Barrel
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(gPx + 20, midY - 10, 80, 12);

      // Gun label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Rifle (${gunMassKg} kg)`, gPx, midY - 30);

      // Bullet (m_bullet)
      if (bulletX > 4.0 || isFired) {
        // Bullet in flight
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.ellipse(bPx + 105, midY - 4, 10, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Muzzle flash / propellant gas
        if (simTime < 0.3 && isPlaying) {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.7)';
          ctx.beginPath();
          ctx.arc(gPx + 105, midY - 4, 25, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`Bullet (${bulletMassG} g)`, bPx + 105, midY - 20);
        ctx.fillText(`v_bullet = +${bulletMuzzleVel} m/s`, bPx + 105, midY + 25);
      }

      // Recoil vector on gun
      if (isFired) {
        ctx.strokeStyle = '#ef4444';
        ctx.fillStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(gPx - 90, midY + 5);
        ctx.lineTo(gPx - 150, midY + 5);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(gPx - 150, midY + 5);
        ctx.lineTo(gPx - 142, midY);
        ctx.lineTo(gPx - 142, midY + 10);
        ctx.closePath();
        ctx.fill();

        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          `V_recoil = ${theoreticalRecoilV.toFixed(2)} m/s`,
          gPx - 130,
          midY - 8
        );
      }
    } else if (mode === 'spring-balances') {
      // -----------------------------------------------------------------
      // DRAW TWO HOOKED SPRING BALANCES (NCERT CLASSIC EXPERIMENT)
      // -----------------------------------------------------------------
      const midY = height / 2;
      const b1StartX = 90;
      const b1EndX = 330;
      const hookX = 350;
      const b2StartX = 370;
      const b2EndX = 610;

      // Wall anchor on left
      ctx.fillStyle = '#64748b';
      ctx.fillRect(50, midY - 50, 20, 100);
      // Wall hatches
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      for (let h = -45; h <= 45; h += 15) {
        ctx.beginPath();
        ctx.moveTo(50, midY + h);
        ctx.lineTo(40, midY + h + 10);
        ctx.stroke();
      }

      // Ring fixed to wall
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 4;
      ctx.strokeRect(70, midY - 10, 20, 20);

      // Spring Balance A (Body A)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(b1StartX, midY - 25, 240, 50);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(b1StartX, midY - 25, 240, 50);

      // Scale markings on Balance A
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px monospace';
      for (let f = 0; f <= 100; f += 20) {
        const sx = b1StartX + 30 + (f / 100) * 160;
        ctx.beginPath();
        ctx.moveTo(sx, midY - 20);
        ctx.lineTo(sx, midY - 10);
        ctx.stroke();
        ctx.fillText(`${f}`, sx, midY - 4);
      }

      // Balance A Pointer (Reads pullForceN)
      const ptrAx = b1StartX + 30 + (pullForceN / 100) * 160;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(ptrAx, midY - 22);
      ctx.lineTo(ptrAx - 5, midY - 10);
      ctx.lineTo(ptrAx + 5, midY - 10);
      ctx.closePath();
      ctx.fill();

      // Hook between A and B
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(hookX, midY, 12, 0, Math.PI * 2);
      ctx.stroke();

      // Spring Balance B (Body B)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(b2StartX, midY - 25, 240, 50);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(b2StartX, midY - 25, 240, 50);

      // Scale markings on Balance B
      for (let f = 0; f <= 100; f += 20) {
        const sx = b2StartX + 30 + (f / 100) * 160;
        ctx.beginPath();
        ctx.moveTo(sx, midY - 20);
        ctx.lineTo(sx, midY - 10);
        ctx.stroke();
        ctx.fillText(`${f}`, sx, midY - 4);
      }

      // Balance B Pointer (Reads EXACT same pullForceN!)
      const ptrBx = b2StartX + 30 + (pullForceN / 100) * 160;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(ptrBx, midY - 22);
      ctx.lineTo(ptrBx - 5, midY - 10);
      ctx.lineTo(ptrBx + 5, midY - 10);
      ctx.closePath();
      ctx.fill();

      // Labels and force readouts
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Balance A: Reading = ${pullForceN} N`, b1StartX + 120, midY + 45);

      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`Balance B: Reading = ${pullForceN} N`, b2StartX + 120, midY + 45);

      ctx.fillStyle = '#10b981';
      ctx.font = '12px sans-serif';
      ctx.fillText(
        `Proof: Pulling Balance B produces an EQUAL AND OPPOSITE reaction tension in Balance A (|F_A| = |F_B| = ${pullForceN} N)`,
        width / 2,
        height - 20
      );
    } else if (mode === 'rocket') {
      // -----------------------------------------------------------------
      // DRAW ROCKET PROPULSION IN VACUUM
      // -----------------------------------------------------------------
      const rocketCenterX = width / 2;
      const baseRocketY = height - 90 - Math.min(100, rocketY * 0.4);

      // Stars in space
      ctx.fillStyle = '#ffffff';
      for (let s = 0; s < 25; s++) {
        const sx = (s * 47) % width;
        const sy = (s * 31) % (height - 50);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Exhaust Gas Fireball (Downward Action Force)
      if (isPlaying) {
        const flameGrad = ctx.createLinearGradient(
          rocketCenterX,
          baseRocketY + 50,
          rocketCenterX,
          baseRocketY + 140
        );
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.3, '#f59e0b');
        flameGrad.addColorStop(0.8, '#ef4444');
        flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(rocketCenterX - 18, baseRocketY + 50);
        ctx.lineTo(rocketCenterX, baseRocketY + 130 + Math.random() * 20);
        ctx.lineTo(rocketCenterX + 18, baseRocketY + 50);
        ctx.closePath();
        ctx.fill();

        // Downward Action Vector
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(rocketCenterX, baseRocketY + 60);
        ctx.lineTo(rocketCenterX, baseRocketY + 120);
        ctx.stroke();
        ctx.fillStyle = '#ef4444';
        ctx.font = '10px monospace';
        ctx.fillText(`Exhaust Action Force: -${rocketThrustN.toFixed(0)} N`, rocketCenterX + 10, baseRocketY + 95);
      }

      // Rocket Body (Upward Reaction Force)
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(rocketCenterX, baseRocketY - 40); // Nose cone
      ctx.lineTo(rocketCenterX + 22, baseRocketY);
      ctx.lineTo(rocketCenterX + 22, baseRocketY + 50);
      ctx.lineTo(rocketCenterX - 22, baseRocketY + 50);
      ctx.lineTo(rocketCenterX - 22, baseRocketY);
      ctx.closePath();
      ctx.fill();

      // Rocket Fins
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(rocketCenterX - 22, baseRocketY + 30);
      ctx.lineTo(rocketCenterX - 40, baseRocketY + 55);
      ctx.lineTo(rocketCenterX - 22, baseRocketY + 50);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(rocketCenterX + 22, baseRocketY + 30);
      ctx.lineTo(rocketCenterX + 40, baseRocketY + 55);
      ctx.lineTo(rocketCenterX + 22, baseRocketY + 50);
      ctx.fill();

      // Upward Reaction Thrust Vector
      if (isPlaying) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(rocketCenterX, baseRocketY - 45);
        ctx.lineTo(rocketCenterX, baseRocketY - 95);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(rocketCenterX, baseRocketY - 95);
        ctx.lineTo(rocketCenterX - 6, baseRocketY - 87);
        ctx.lineTo(rocketCenterX + 6, baseRocketY - 87);
        ctx.closePath();
        ctx.fillStyle = '#10b981';
        ctx.fill();

        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Thrust Reaction Force: +${rocketThrustN.toFixed(0)} N`, rocketCenterX, baseRocketY - 105);
      }

      // Rocket Labels
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Rocket Mass: ${rocketDryMass} kg`, rocketCenterX, baseRocketY + 15);
      ctx.fillText(`Velocity: ${rocketV.toFixed(1)} m/s`, rocketCenterX, baseRocketY + 30);
    }
  }, [mode, posA, posB, velA, velB, massA, massB, pushForce, simTime, isPlaying, gunX, bulletX, isFired, pullForceN, rocketY, rocketV, rocketThrustN]);

  return (
    <div className="bg-[#070e1c] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Newton's Third Law: Action-Reaction Pairs
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">
                F_AB = -F_BA
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Action & Reaction Always Act on Two Different Bodies Simultaneously with Equal Magnitude and Opposite Direction
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          <button
            onClick={() => {
              setMode('skaters');
              resetSim();
            }}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              mode === 'skaters' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⛸️ Ice Skaters Push
          </button>
          <button
            onClick={() => {
              setMode('rifle-recoil');
              resetSim();
            }}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              mode === 'rifle-recoil' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Rifle Recoil
          </button>
          <button
            onClick={() => {
              setMode('spring-balances');
              resetSim();
            }}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              mode === 'spring-balances' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚖️ Spring Balances
          </button>
          <button
            onClick={() => {
              setMode('rocket');
              resetSim();
            }}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              mode === 'rocket' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            🚀 Rocket Thrust
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-[#080d1a]">
        {/* Playback Controls Overlay Top Left */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              if (isPlaying) {
                setIsPlaying(false);
              } else {
                triggerAction();
              }
            }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>
              {mode === 'rifle-recoil'
                ? isFired
                  ? 'Playing'
                  : 'Fire Rifle'
                : isPlaying
                ? 'Pause'
                : 'Trigger Push / Action'}
            </span>
          </button>
          <button
            onClick={resetSim}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Status Badge Top Right */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="font-mono text-amber-300 font-bold">
            {mode === 'skaters' && `|F_Action| = |F_Reaction| = ${pushForce} N`}
            {mode === 'rifle-recoil' && `Impulse: J_bullet = -J_gun = ${bulletMomentum.toFixed(1)} N·s`}
            {mode === 'spring-balances' && `Both Balances Read = ${pullForceN} N`}
            {mode === 'rocket' && `Thrust = ${rocketThrustN.toFixed(0)} N`}
          </span>
        </div>

        {/* Canvas Display */}
        <canvas ref={canvasRef} width={760} height={280} className="w-full h-72 block select-none" />
      </div>

      {/* Physics Quantitative Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Action Force on Body 1 */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Force on Body A (F_BA)</span>
            <span className="font-mono text-cyan-400 font-bold">Body A</span>
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {mode === 'skaters' && `-${pushForce} N`}
            {mode === 'rifle-recoil' && `-${(bulletMomentum / 0.005).toFixed(0)} N (Peak)`}
            {mode === 'spring-balances' && `${pullForceN} N`}
            {mode === 'rocket' && `+${rocketThrustN.toFixed(0)} N`}
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800 space-y-0.5">
            {mode === 'skaters' && (
              <>
                <div className="flex justify-between">
                  <span>Mass m_A:</span>
                  <span className="text-slate-300">{massA} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Acceleration a_A:</span>
                  <span className="text-cyan-300 font-bold">{accelA.toFixed(2)} m/s²</span>
                </div>
                <div className="flex justify-between">
                  <span>Final Velocity v_A:</span>
                  <span className="text-cyan-300 font-bold">{finalVelA.toFixed(2)} m/s</span>
                </div>
              </>
            )}
            {mode === 'rifle-recoil' && (
              <>
                <div className="flex justify-between">
                  <span>Rifle Mass M_g:</span>
                  <span className="text-slate-300">{gunMassKg} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Recoil Velocity:</span>
                  <span className="text-cyan-300 font-bold">{theoreticalRecoilV.toFixed(2)} m/s</span>
                </div>
              </>
            )}
            {mode === 'spring-balances' && (
              <div className="text-slate-300">
                Pulls to the left against wall anchor with exactly {pullForceN} N tension.
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Reaction Force on Body 2 */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Force on Body B (F_AB)</span>
            <span className="font-mono text-amber-400 font-bold">Body B</span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {mode === 'skaters' && `+${pushForce} N`}
            {mode === 'rifle-recoil' && `+${(bulletMomentum / 0.005).toFixed(0)} N (Forward)`}
            {mode === 'spring-balances' && `${pullForceN} N`}
            {mode === 'rocket' && `-${rocketThrustN.toFixed(0)} N (Gas)`}
          </div>
          <div className="text-[11px] text-slate-400 font-mono pt-1 border-t border-slate-800 space-y-0.5">
            {mode === 'skaters' && (
              <>
                <div className="flex justify-between">
                  <span>Mass m_B:</span>
                  <span className="text-slate-300">{massB} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Acceleration a_B:</span>
                  <span className="text-amber-300 font-bold">+{accelB.toFixed(2)} m/s²</span>
                </div>
                <div className="flex justify-between">
                  <span>Final Velocity v_B:</span>
                  <span className="text-amber-300 font-bold">+{finalVelB.toFixed(2)} m/s</span>
                </div>
              </>
            )}
            {mode === 'rifle-recoil' && (
              <>
                <div className="flex justify-between">
                  <span>Bullet Mass m_b:</span>
                  <span className="text-slate-300">{bulletMassG} g (0.02 kg)</span>
                </div>
                <div className="flex justify-between">
                  <span>Muzzle Velocity:</span>
                  <span className="text-amber-300 font-bold">+{bulletMuzzleVel} m/s</span>
                </div>
              </>
            )}
            {mode === 'spring-balances' && (
              <div className="text-slate-300">
                Pulls to the right with hand force of exactly {pullForceN} N.
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Crucial Law Breakdown & Misconception Buster */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-amber-300 font-medium">
            <span>Fundamental Law Principle</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-[10px] font-mono">
              F_AB = -F_BA
            </span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            <strong className="text-amber-300">Why don't action and reaction cancel out?</strong> Because they{' '}
            <span className="text-white font-bold underline decoration-amber-400">
              act on TWO DIFFERENT bodies
            </span>
            ! Skater A feels the force exerted by B; Skater B feels the force exerted by A.
          </p>
          <div className="text-[11px] text-slate-400 pt-1 border-t border-amber-500/20">
            {massA !== massB && mode === 'skaters' && (
              <span className="text-amber-200">
                Notice: Skater B ({massB} kg) is lighter than Skater A ({massA} kg), so Skater B experiences a{' '}
                <strong className="text-white">{(massA / massB).toFixed(1)}× higher acceleration</strong> despite
                identical forces!
              </span>
            )}
            {mode === 'rifle-recoil' && (
              <span className="text-amber-200">
                The rifle is 150× heavier than the bullet, so recoil velocity (-2 m/s) is 150× smaller than bullet speed (300 m/s), yet total system momentum remains zero!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Manipulation Sliders */}
      <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          Interactive Parameters
        </h3>

        {mode === 'skaters' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-cyan-300 font-medium">Skater A Mass</span>
                <span className="font-mono text-cyan-400 font-bold">{massA} kg</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={massA}
                onChange={(e) => {
                  setMassA(parseFloat(e.target.value));
                  resetSim();
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-amber-300 font-medium">Skater B Mass</span>
                <span className="font-mono text-amber-400 font-bold">{massB} kg</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={massB}
                onChange={(e) => {
                  setMassB(parseFloat(e.target.value));
                  resetSim();
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-300 font-medium">Mutual Push Force</span>
                <span className="font-mono text-emerald-400 font-bold">{pushForce} N</span>
              </div>
              <input
                type="range"
                min="40"
                max="300"
                step="10"
                value={pushForce}
                onChange={(e) => {
                  setPushForce(parseFloat(e.target.value));
                  resetSim();
                }}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        )}

        {mode === 'rifle-recoil' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-cyan-300 font-medium">Rifle Mass (M_g)</span>
                <span className="font-mono text-cyan-400 font-bold">{gunMassKg} kg</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                step="0.5"
                value={gunMassKg}
                onChange={(e) => {
                  setGunMassKg(parseFloat(e.target.value));
                  resetSim();
                }}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-amber-300 font-medium">Bullet Mass (m_b)</span>
                <span className="font-mono text-amber-400 font-bold">{bulletMassG} grams</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={bulletMassG}
                onChange={(e) => {
                  setBulletMassG(parseFloat(e.target.value));
                  resetSim();
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-300 font-medium">Muzzle Velocity (v_b)</span>
                <span className="font-mono text-emerald-400 font-bold">{bulletMuzzleVel} m/s</span>
              </div>
              <input
                type="range"
                min="100"
                max="500"
                step="25"
                value={bulletMuzzleVel}
                onChange={(e) => {
                  setBulletMuzzleVel(parseFloat(e.target.value));
                  resetSim();
                }}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        )}

        {mode === 'spring-balances' && (
          <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800 max-w-md">
            <div className="flex justify-between text-xs">
              <span className="text-amber-300 font-medium">Hand Pull Force on Balance B</span>
              <span className="font-mono text-amber-400 font-bold">{pullForceN} N</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="5"
              value={pullForceN}
              onChange={(e) => setPullForceN(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        )}

        {mode === 'rocket' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-amber-300 font-medium">Fuel Burn Rate (dm/dt)</span>
                <span className="font-mono text-amber-400 font-bold">{burnRateKgS} kg/s</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={burnRateKgS}
                onChange={(e) => setBurnRateKgS(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div className="space-y-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-300 font-medium">Exhaust Velocity (v_e)</span>
                <span className="font-mono text-emerald-400 font-bold">{exhaustSpeedMs} m/s</span>
              </div>
              <input
                type="range"
                min="400"
                max="1200"
                step="50"
                value={exhaustSpeedMs}
                onChange={(e) => setExhaustSpeedMs(parseFloat(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
