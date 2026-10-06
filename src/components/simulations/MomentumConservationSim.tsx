import React, { useState, useEffect, useRef } from 'react';
import { Formula } from '../common/Formula';
import { Play, Pause, RotateCcw, Sliders, Zap, Sparkles, RefreshCw, BarChart3, Layers, Compass, FastForward } from 'lucide-react';

interface MomentumConservationSimProps {
  initialMass1?: number;
  initialVel1?: number;
  initialMass2?: number;
  initialVel2?: number;
  elasticity?: number;
}

type SimulationMode = 'two-balls' | 'newtons-cradle' | 'inelastic-stick' | 'spring-explosion';

export const MomentumConservationSim: React.FC<MomentumConservationSimProps> = ({
  initialMass1 = 2,
  initialVel1 = 6,
  initialMass2 = 2,
  initialVel2 = 0,
  elasticity: propElasticity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active sub-mode
  const [activeMode, setActiveMode] = useState<SimulationMode>('two-balls');

  // Interactive Variables
  const [m1, setM1] = useState<number>(initialMass1);
  const [u1, setU1] = useState<number>(initialVel1);
  const [m2, setM2] = useState<number>(initialMass2);
  const [u2, setU2] = useState<number>(initialVel2);
  const [coeffRestitution, setCoeffRestitution] = useState<number>(propElasticity); // e = 1 for elastic, e = 0 for inelastic

  // Animation & Physics State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1.0); // 1x, 0.5x, 0.25x
  const [simTime, setSimTime] = useState<number>(0);
  const [hasCollided, setHasCollided] = useState<boolean>(false);
  const [collisionFlash, setCollisionFlash] = useState<boolean>(false);

  // Position and Velocity of Ball 1 & Ball 2 (in meters on track)
  // Track runs from x = 0 to x = 10 meters
  const [x1, setX1] = useState<number>(2.0);
  const [v1, setV1] = useState<number>(initialVel1);
  const [x2, setX2] = useState<number>(5.5);
  const [v2, setV2] = useState<number>(initialVel2);

  // Newton's Cradle State (5 balls, angle in radians)
  const [cradleBallsLifted, setCradleBallsLifted] = useState<number>(1);
  const [cradleAngles, setCradleAngles] = useState<number[]>([0, 0, 0, 0, 0]);
  const [cradleVelocities, setCradleVelocities] = useState<number[]>([0, 0, 0, 0, 0]);

  // Derived Theoretical Values
  // 1D Collision formulas:
  // v1 = [ (m1 - e*m2)u1 + (1+e)m2*u2 ] / (m1 + m2)
  // v2 = [ (1+e)m1*u1 + (m2 - e*m1)u2 ] / (m1 + m2)
  const totalMass = m1 + m2;
  const theoreticalV1 =
    ((m1 - coeffRestitution * m2) * u1 + (1 + coeffRestitution) * m2 * u2) / totalMass;
  const theoreticalV2 =
    ((1 + coeffRestitution) * m1 * u1 + (m2 - coeffRestitution * m1) * u2) / totalMass;

  // Momentum Before & After
  const p1Initial = m1 * u1;
  const p2Initial = m2 * u2;
  const pTotalInitial = p1Initial + p2Initial;

  const p1Current = m1 * v1;
  const p2Current = m2 * v2;
  const pTotalCurrent = p1Current + p2Current;

  // Kinetic Energy Before & Current
  const keInitial = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;
  const keCurrent = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
  const energyLossPercent =
    keInitial > 0 ? Math.max(0, ((keInitial - keCurrent) / keInitial) * 100) : 0;

  // Presets
  const applyPreset = (preset: 'velocity-transfer' | 'equal-head-on' | 'heavy-hits-light' | 'light-hits-heavy' | 'inelastic-stick' | 'explosion') => {
    setIsPlaying(false);
    setSimTime(0);
    setHasCollided(false);
    setCollisionFlash(false);

    if (preset === 'velocity-transfer') {
      setActiveMode('two-balls');
      setM1(2);
      setU1(6);
      setM2(2);
      setU2(0);
      setCoeffRestitution(1.0);
      setX1(2.0);
      setV1(6);
      setX2(5.5);
      setV2(0);
    } else if (preset === 'equal-head-on') {
      setActiveMode('two-balls');
      setM1(2.5);
      setU1(5);
      setM2(2.5);
      setU2(-5);
      setCoeffRestitution(1.0);
      setX1(1.5);
      setV1(5);
      setX2(7.5);
      setV2(-5);
    } else if (preset === 'heavy-hits-light') {
      setActiveMode('two-balls');
      setM1(6);
      setU1(5);
      setM2(1.5);
      setU2(0);
      setCoeffRestitution(1.0);
      setX1(1.8);
      setV1(5);
      setX2(5.5);
      setV2(0);
    } else if (preset === 'light-hits-heavy') {
      setActiveMode('two-balls');
      setM1(1.5);
      setU1(6);
      setM2(8);
      setU2(0);
      setCoeffRestitution(1.0);
      setX1(1.8);
      setV1(6);
      setX2(5.5);
      setV2(0);
    } else if (preset === 'inelastic-stick') {
      setActiveMode('inelastic-stick');
      setM1(3);
      setU1(6);
      setM2(3);
      setU2(0);
      setCoeffRestitution(0.0); // Completely inelastic
      setX1(1.8);
      setV1(6);
      setX2(5.5);
      setV2(0);
    } else if (preset === 'explosion') {
      setActiveMode('spring-explosion');
      setM1(2);
      setU1(0);
      setM2(4);
      setU2(0);
      setCoeffRestitution(1.0);
      setX1(4.8);
      setV1(-6);
      setX2(5.2);
      setV2(3); // m1*v1 + m2*v2 = 2*(-6) + 4*(3) = 0!
      setHasCollided(true);
    }
  };

  // Reset to initial state
  const resetSimulation = () => {
    setIsPlaying(false);
    setSimTime(0);
    setHasCollided(false);
    setCollisionFlash(false);
    if (activeMode === 'spring-explosion') {
      setX1(4.8);
      setV1(0);
      setX2(5.2);
      setV2(0);
    } else {
      setX1(2.0);
      setV1(u1);
      setX2(5.5);
      setV2(u2);
    }
    setCradleAngles([0, 0, 0, 0, 0]);
    setCradleVelocities([0, 0, 0, 0, 0]);
  };

  // Trigger Spring Explosion
  const triggerExplosion = () => {
    setIsPlaying(true);
    setHasCollided(true);
    setCollisionFlash(true);
    setTimeout(() => setCollisionFlash(false), 300);
    // V1 and V2 such that m1*v1 + m2*v2 = 0
    // e.g., total energy E = 36 J
    const vMag1 = Math.sqrt((72 * m2) / (m1 * totalMass));
    const vMag2 = (m1 / m2) * vMag1;
    setV1(-vMag1);
    setV2(vMag2);
  };

  // Animation Loop for Two Balls & Cradle
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dtRaw = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const dt = Math.min(dtRaw, 0.05) * simSpeed;

      if (isPlaying) {
        setSimTime((prev) => prev + dt);

        if (activeMode === 'newtons-cradle') {
          // Newton's Cradle Simple Harmonic Motion with collision phase
          setCradleAngles((prevAngles) => {
            const nextAngles = [...prevAngles];
            const omega = 4.2; // pendulum frequency sqrt(g/L)
            // Left ball oscillates if lifted
            const t = simTime + dt;
            const amp = (cradleBallsLifted * Math.PI) / 6;

            if (cradleBallsLifted === 1) {
              const theta = amp * Math.cos(omega * t);
              if (theta < 0) {
                // Ball 0 swinging out left
                nextAngles[0] = theta;
                nextAngles[4] = 0;
              } else {
                // Impulse transferred through balls 1,2,3 -> Ball 4 swings out right!
                nextAngles[0] = 0;
                nextAngles[4] = theta;
              }
            } else if (cradleBallsLifted === 2) {
              const theta = amp * Math.cos(omega * t);
              if (theta < 0) {
                nextAngles[0] = theta;
                nextAngles[1] = theta;
                nextAngles[3] = 0;
                nextAngles[4] = 0;
              } else {
                nextAngles[0] = 0;
                nextAngles[1] = 0;
                nextAngles[3] = theta;
                nextAngles[4] = theta;
              }
            }
            return nextAngles;
          });
        } else {
          // Track 1D kinematics
          setX1((prevX1) => {
            setX2((prevX2) => {
              setV1((currV1) => {
                setV2((currV2) => {
                  let nextX1 = prevX1 + currV1 * dt;
                  let nextX2 = prevX2 + currV2 * dt;
                  let nextV1 = currV1;
                  let nextV2 = currV2;

                  // Radius of balls based on cube root of mass
                  const r1 = 0.22 + 0.08 * Math.cbrt(m1);
                  const r2 = 0.22 + 0.08 * Math.cbrt(m2);
                  const minDist = r1 + r2;

                  // Collision detection between Ball 1 & Ball 2
                  if (nextX2 - nextX1 <= minDist && currV1 > currV2) {
                    setHasCollided(true);
                    setCollisionFlash(true);
                    setTimeout(() => setCollisionFlash(false), 200);

                    if (coeffRestitution === 0) {
                      // Inelastic: Stick together
                      const vFinalCommon = (m1 * currV1 + m2 * currV2) / (m1 + m2);
                      nextV1 = vFinalCommon;
                      nextV2 = vFinalCommon;
                      // Keep them contiguous
                      nextX1 = (nextX1 + nextX2 - minDist) / 2;
                      nextX2 = nextX1 + minDist;
                    } else {
                      // Elastic or partially elastic
                      const newV1 =
                        ((m1 - coeffRestitution * m2) * currV1 +
                          (1 + coeffRestitution) * m2 * currV2) /
                        (m1 + m2);
                      const newV2 =
                        ((1 + coeffRestitution) * m1 * currV1 +
                          (m2 - coeffRestitution * m1) * currV2) /
                        (m1 + m2);
                      nextV1 = newV1;
                      nextV2 = newV2;
                      // Separate slightly to prevent interpenetration
                      const overlap = minDist - (nextX2 - nextX1);
                      nextX1 -= overlap / 2;
                      nextX2 += overlap / 2;
                    }
                  }

                  // Track boundaries (0m to 9.5m)
                  if (nextX1 <= 0.3) {
                    nextX1 = 0.3;
                    nextV1 = -nextV1 * 0.95; // bounce off left cushion
                  }
                  if (nextX2 >= 9.2) {
                    nextX2 = 9.2;
                    nextV2 = -nextV2 * 0.95; // bounce off right cushion
                  }

                  return nextV2;
                });
                return currV1;
              });
              return prevX2;
            });
            return prevX1;
          });
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, simSpeed, activeMode, m1, m2, coeffRestitution, cradleBallsLifted, simTime]);

  // Canvas Drawing for 2-Ball Linear Track & Newton's Cradle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    if (activeMode === 'newtons-cradle') {
      // -------------------------------------------------------------
      // DRAW NEWTON'S CRADLE (5-BALL DEMONSTRATION)
      // -------------------------------------------------------------
      const topBarY = 40;
      const pivotCenterX = width / 2;
      const ballRadius = 18;
      const stringLength = 130;
      const spacing = ballRadius * 2;

      // Top suspension bar
      ctx.fillStyle = '#334155';
      ctx.fillRect(pivotCenterX - 110, topBarY - 10, 220, 10);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(pivotCenterX - 105, topBarY - 14, 210, 4);

      // Draw each of the 5 pendulum balls
      for (let i = 0; i < 5; i++) {
        const pivotX = pivotCenterX + (i - 2) * spacing;
        const angle = cradleAngles[i] || 0;
        const ballX = pivotX + stringLength * Math.sin(angle);
        const ballY = topBarY + stringLength * Math.cos(angle);

        // Suspension strings (V-suspension)
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(pivotX - 6, topBarY);
        ctx.lineTo(ballX, ballY);
        ctx.moveTo(pivotX + 6, topBarY);
        ctx.lineTo(ballX, ballY);
        ctx.stroke();

        // Steel Ball with shiny radial gradient
        const grad = ctx.createRadialGradient(
          ballX - 5,
          ballY - 5,
          2,
          ballX,
          ballY,
          ballRadius
        );
        grad.addColorStop(0, '#f8fafc');
        grad.addColorStop(0.3, i === 0 || i === 4 ? '#38bdf8' : '#94a3b8');
        grad.addColorStop(0.8, '#334155');
        grad.addColorStop(1, '#0f172a');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ball label
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${i + 1}`, ballX, ballY + 4);
      }

      // Explanatory banner
      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Newton's Cradle: Momentum & Energy Conservation Transferred Sequentially Through Intermediate Balls`,
        width / 2,
        height - 20
      );

      return;
    }

    // -------------------------------------------------------------
    // DRAW 1D LINEAR AIR TRACK / COLLISION BENCH
    // -------------------------------------------------------------
    const trackY = height - 75;
    const trackStartX = 30;
    const trackEndX = width - 30;
    const trackWidth = trackEndX - trackStartX;

    // Track bed (Metallic air track with subtle glow)
    const trackGrad = ctx.createLinearGradient(0, trackY, 0, trackY + 25);
    trackGrad.addColorStop(0, '#1e293b');
    trackGrad.addColorStop(0.5, '#334155');
    trackGrad.addColorStop(1, '#0f172a');

    ctx.fillStyle = trackGrad;
    ctx.fillRect(trackStartX, trackY, trackWidth, 24);

    // Track side borders and end-stop cushions
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(trackStartX, trackY, trackWidth, 24);

    // Left cushion
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(trackStartX - 6, trackY - 15, 8, 40);
    // Right cushion
    ctx.fillRect(trackEndX - 2, trackY - 15, 8, 40);

    // Track distance markings (0 m to 10 m)
    ctx.fillStyle = '#64748b';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    for (let meter = 0; meter <= 10; meter++) {
      const markX = trackStartX + (meter / 10) * trackWidth;
      ctx.beginPath();
      ctx.moveTo(markX, trackY);
      ctx.lineTo(markX, trackY + 6);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillText(`${meter}m`, markX, trackY + 16);
    }

    // Coordinate mapping: 0m -> trackStartX, 10m -> trackEndX
    const meterToPixelX = (meter: number) => trackStartX + (meter / 10) * trackWidth;

    const ball1PixelX = meterToPixelX(x1);
    const ball2PixelX = meterToPixelX(x2);

    // Radius scaling based on cube root of mass
    const r1Pixel = 18 + 5 * Math.cbrt(m1);
    const r2Pixel = 18 + 5 * Math.cbrt(m2);

    // Ball centers Y
    const ball1CenterY = trackY - r1Pixel;
    const ball2CenterY = trackY - r2Pixel;

    // Collision Impact Flash
    if (collisionFlash) {
      const midContactX = (ball1PixelX + r1Pixel + (ball2PixelX - r2Pixel)) / 2;
      const gradFlash = ctx.createRadialGradient(midContactX, trackY - 20, 2, midContactX, trackY - 20, 50);
      gradFlash.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      gradFlash.addColorStop(0.4, 'rgba(245, 158, 11, 0.6)');
      gradFlash.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = gradFlash;
      ctx.beginPath();
      ctx.arc(midContactX, trackY - 20, 50, 0, Math.PI * 2);
      ctx.fill();

      // Impact sparks
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      for (let a = 0; a < 6; a++) {
        const ang = (a * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(midContactX, trackY - 20);
        ctx.lineTo(midContactX + Math.cos(ang) * 22, trackY - 20 + Math.sin(ang) * 22);
        ctx.stroke();
      }
    }

    // DRAW BALL 1 (Cyan sphere)
    const gradBall1 = ctx.createRadialGradient(
      ball1PixelX - r1Pixel * 0.3,
      ball1CenterY - r1Pixel * 0.3,
      r1Pixel * 0.1,
      ball1PixelX,
      ball1CenterY,
      r1Pixel
    );
    gradBall1.addColorStop(0, '#e0f2fe');
    gradBall1.addColorStop(0.3, '#38bdf8');
    gradBall1.addColorStop(0.8, '#0284c7');
    gradBall1.addColorStop(1, '#0c4a6e');

    ctx.fillStyle = gradBall1;
    ctx.beginPath();
    ctx.arc(ball1PixelX, ball1CenterY, r1Pixel, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Shadow on track
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(ball1PixelX, trackY - 1, r1Pixel * 0.9, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // DRAW BALL 2 (Amber / Emerald sphere)
    const ball2Color = activeMode === 'inelastic-stick' ? '#10b981' : '#f59e0b';
    const gradBall2 = ctx.createRadialGradient(
      ball2PixelX - r2Pixel * 0.3,
      ball2CenterY - r2Pixel * 0.3,
      r2Pixel * 0.1,
      ball2PixelX,
      ball2CenterY,
      r2Pixel
    );
    gradBall2.addColorStop(0, '#fef3c7');
    gradBall2.addColorStop(0.3, ball2Color);
    gradBall2.addColorStop(0.8, activeMode === 'inelastic-stick' ? '#047857' : '#b45309');
    gradBall2.addColorStop(1, '#451a03');

    ctx.fillStyle = gradBall2;
    ctx.beginPath();
    ctx.arc(ball2PixelX, ball2CenterY, r2Pixel, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = activeMode === 'inelastic-stick' ? '#6ee7b7' : '#fcd34d';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Shadow on track
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(ball2PixelX, trackY - 1, r2Pixel * 0.9, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Inelastic velcro / sticky latch indicator
    if (activeMode === 'inelastic-stick' && hasCollided) {
      ctx.fillStyle = '#a855f7';
      ctx.fillRect((ball1PixelX + ball2PixelX) / 2 - 4, trackY - 24, 8, 12);
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('COUPLED', (ball1PixelX + ball2PixelX) / 2, trackY - 28);
    }

    // DRAW VELOCITY VECTORS (Arrow with direction and magnitude)
    const drawVector = (startX: number, startY: number, vel: number, color: string, label: string) => {
      if (Math.abs(vel) < 0.05) {
        // At rest circle indicator
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.arc(startX, startY - 30, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${label} = 0 m/s (REST)`, startX, startY - 38);
        return;
      }

      const arrowLength = vel * 12; // 1 m/s = 12 pixels
      const endX = startX + arrowLength;
      const arrowY = startY - 32;

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 3;

      // Shaft
      ctx.beginPath();
      ctx.moveTo(startX, arrowY);
      ctx.lineTo(endX, arrowY);
      ctx.stroke();

      // Arrowhead
      const headSize = 7;
      const headDir = Math.sign(vel);
      ctx.beginPath();
      ctx.moveTo(endX, arrowY);
      ctx.lineTo(endX - headDir * headSize, arrowY - 4);
      ctx.lineTo(endX - headDir * headSize, arrowY + 4);
      ctx.closePath();
      ctx.fill();

      // Label
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${label} = ${vel > 0 ? '+' : ''}${vel.toFixed(1)} m/s`,
        startX + arrowLength / 2,
        arrowY - 8
      );
    };

    drawVector(ball1PixelX, ball1CenterY, v1, '#38bdf8', 'v₁');
    drawVector(ball2PixelX, ball2CenterY, v2, '#f59e0b', 'v₂');

    // Mass labels inside balls
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${m1} kg`, ball1PixelX, ball1CenterY + 4);
    ctx.fillText(`${m2} kg`, ball2PixelX, ball2CenterY + 4);

    // Momentum Vectors underneath track
    ctx.fillStyle = '#38bdf8';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`p₁ = ${(m1 * v1).toFixed(1)} kg·m/s`, ball1PixelX, trackY + 38);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`p₂ = ${(m2 * v2).toFixed(1)} kg·m/s`, ball2PixelX, trackY + 38);

  }, [x1, x2, v1, v2, m1, m2, activeMode, cradleAngles, collisionFlash, hasCollided]);

  return (
    <div className="bg-[#070e1c] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Law of Conservation of Linear Momentum
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 2-Ball Collision Bench & Newton's Cradle (Demonstrating Velocity Transfer & Zero Net Impulse)
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          <button
            onClick={() => {
              setActiveMode('two-balls');
              resetSimulation();
            }}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              activeMode === 'two-balls'
                ? 'bg-cyan-500 text-slate-950 shadow font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            2-Ball Collision
          </button>
          <button
            onClick={() => {
              setActiveMode('newtons-cradle');
              setIsPlaying(true);
            }}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              activeMode === 'newtons-cradle'
                ? 'bg-cyan-500 text-slate-950 shadow font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Newton's Cradle (5-Ball)
          </button>
          <button
            onClick={() => applyPreset('inelastic-stick')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              activeMode === 'inelastic-stick'
                ? 'bg-cyan-500 text-slate-950 shadow font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Inelastic (Stick Together)
          </button>
          <button
            onClick={() => applyPreset('explosion')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              activeMode === 'spring-explosion'
                ? 'bg-cyan-500 text-slate-950 shadow font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Recoil / Explosion
          </button>
        </div>
      </div>

      {/* Preset Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Key Scenarios:
        </span>
        <button
          onClick={() => applyPreset('velocity-transfer')}
          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition shadow-sm"
          title="Ball 1 strikes resting identical Ball 2: Ball 1 stops completely, Ball 2 inherits 100% velocity"
        >
          🎯 100% Velocity Transfer (Equal Mass, Ball 2 at Rest)
        </button>
        <button
          onClick={() => applyPreset('equal-head-on')}
          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 transition"
        >
          ↔️ Head-On Symmetrical (+5 m/s vs -5 m/s)
        </button>
        <button
          onClick={() => applyPreset('heavy-hits-light')}
          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 transition"
        >
          🎳 Heavy Strikes Light (6 kg vs 1.5 kg)
        </button>
        <button
          onClick={() => applyPreset('light-hits-heavy')}
          className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 transition"
        >
          🎾 Light Strikes Massive Wall (Rebound)
        </button>
      </div>

      {/* Main Canvas Stage */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-[#090d16]">
        {/* Playback Controls Overlay Top Left */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow ${
              isPlaying ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Launch / Play'}</span>
          </button>
          <button
            onClick={resetSimulation}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition"
            title="Reset Positions & Velocities"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {activeMode === 'spring-explosion' && (
            <button
              onClick={triggerExplosion}
              className="px-2.5 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs transition"
            >
              💥 Release Spring
            </button>
          )}

          {/* Speed Toggles */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-800 text-[11px] text-slate-400">
            <span className="font-mono">Speed:</span>
            {[0.25, 0.5, 1.0].map((s) => (
              <button
                key={s}
                onClick={() => setSimSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                  simSpeed === s ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Newton's Cradle Ball Count Switcher */}
        {activeMode === 'newtons-cradle' && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Lift Balls:</span>
            {[1, 2].map((num) => (
              <button
                key={num}
                onClick={() => setCradleBallsLifted(num)}
                className={`px-2 py-1 rounded text-xs font-bold transition ${
                  cradleBallsLifted === num
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {num} Ball{num > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        )}

        {/* Status Chip Top Right */}
        {activeMode !== 'newtons-cradle' && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-emerald-300">
              {hasCollided ? 'Post-Collision (Conservation In Effect)' : 'Pre-Collision (Approaching)'}
            </span>
          </div>
        )}

        {/* HTML Canvas Render */}
        <canvas ref={canvasRef} width={760} height={280} className="w-full h-72 block select-none" />
      </div>

      {/* Real-Time Momentum Conservation Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Initial Momentum */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Total Initial Momentum (P_initial)</span>
            <span className="font-mono text-slate-500">t = 0 s</span>
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {pTotalInitial >= 0 ? '+' : ''}{pTotalInitial.toFixed(2)}{' '}
            <span className="text-xs text-slate-400 font-normal">kg·m/s</span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-0.5 font-mono pt-1 border-t border-slate-800">
            <div className="flex justify-between">
              <span className="text-cyan-300">p₁ = m₁u₁ = {m1} × {u1}</span>
              <span className="text-slate-300">{p1Initial.toFixed(1)} kg·m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-300">p₂ = m₂u₂ = {m2} × {u2}</span>
              <span className="text-slate-300">{p2Initial.toFixed(1)} kg·m/s</span>
            </div>
          </div>
        </div>

        {/* Card 2: Current / Final Momentum */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Total Current Momentum (P_total)</span>
            <span className="font-mono text-slate-500">t = {simTime.toFixed(1)} s</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {pTotalCurrent >= 0 ? '+' : ''}{pTotalCurrent.toFixed(2)}{' '}
            <span className="text-xs text-slate-400 font-normal">kg·m/s</span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-0.5 font-mono pt-1 border-t border-slate-800">
            <div className="flex justify-between">
              <span className="text-cyan-300">p₁ = m₁v₁ = {m1} × {v1.toFixed(1)}</span>
              <span className="text-slate-300">{p1Current.toFixed(1)} kg·m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-300">p₂ = m₂v₂ = {m2} × {v2.toFixed(1)}</span>
              <span className="text-slate-300">{p2Current.toFixed(1)} kg·m/s</span>
            </div>
          </div>
        </div>

        {/* Card 3: Law Verification Meter */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-medium">
            <span>Conservation Status</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-mono">
              ΔP = 0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold font-mono text-emerald-300">
              ΔP = {(Math.abs(pTotalCurrent - pTotalInitial)).toFixed(3)}
            </div>
            <span className="text-xs text-slate-400">kg·m/s</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-tight">
            ✅ In the absence of external friction, the net momentum vector is perfectly conserved!
          </p>
          <div className="text-[10px] font-mono text-slate-400 flex justify-between pt-1 border-t border-emerald-500/20">
            <span>KE Initial: {keInitial.toFixed(1)} J</span>
            <span>KE Final: {keCurrent.toFixed(1)} J</span>
            <span className={energyLossPercent > 0.1 ? 'text-amber-400' : 'text-emerald-400'}>
              {energyLossPercent > 0.1 ? `-${energyLossPercent.toFixed(0)}% (Inelastic)` : '100% Elastic'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Manipulation Sliders */}
      <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Direct Interactive Controls (Adjust Masses & Initial Velocities)
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Theoretical Output: v₁' = {theoreticalV1.toFixed(2)} m/s, v₂' = {theoreticalV2.toFixed(2)} m/s
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Ball 1 Mass */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-300 font-medium">Ball 1 Mass (m₁)</span>
              <span className="font-mono text-cyan-400 font-bold">{m1} kg</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={m1}
              onChange={(e) => {
                setM1(parseFloat(e.target.value));
                resetSimulation();
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 kg</span>
              <span>10 kg</span>
            </div>
          </div>

          {/* Ball 1 Velocity */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-cyan-300 font-medium">Ball 1 Initial Velocity (u₁)</span>
              <span className="font-mono text-cyan-400 font-bold">{u1} m/s</span>
            </div>
            <input
              type="range"
              min="-8"
              max="12"
              step="1"
              value={u1}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setU1(val);
                setV1(val);
                resetSimulation();
              }}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-8 m/s</span>
              <span>+12 m/s</span>
            </div>
          </div>

          {/* Ball 2 Mass */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-amber-300 font-medium">Ball 2 Mass (m₂)</span>
              <span className="font-mono text-amber-400 font-bold">{m2} kg</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={m2}
              onChange={(e) => {
                setM2(parseFloat(e.target.value));
                resetSimulation();
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 kg</span>
              <span>10 kg</span>
            </div>
          </div>

          {/* Ball 2 Velocity */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-amber-300 font-medium">Ball 2 Initial Velocity (u₂)</span>
              <span className="font-mono text-amber-400 font-bold">{u2} m/s</span>
            </div>
            <input
              type="range"
              min="-8"
              max="10"
              step="1"
              value={u2}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setU2(val);
                setV2(val);
                resetSimulation();
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-8 m/s</span>
              <span>+10 m/s</span>
            </div>
          </div>
        </div>

        {/* Elasticity / Restitution Slider */}
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-1/2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-purple-300 font-medium">Collision Elasticity (e)</span>
              <span className="font-mono text-purple-400 font-bold">
                {coeffRestitution === 1 ? '1.0 (Perfect Elastic)' : coeffRestitution === 0 ? '0.0 (Stick Together)' : coeffRestitution.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={coeffRestitution}
              onChange={(e) => {
                setCoeffRestitution(parseFloat(e.target.value));
                resetSimulation();
              }}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          <div className="text-xs text-slate-400 leading-relaxed md:w-1/2 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4">
            <strong className="text-slate-200">The 100% Velocity Transfer Mystery:</strong> When{' '}
            <code className="text-cyan-300 font-mono">m₁ = m₂</code> and{' '}
            <code className="text-amber-300 font-mono">u₂ = 0</code> in an elastic collision (e = 1), substituting into{' '}
            <span className="italic">v₁ = ((m₁ - m₂)u₁)/(m₁ + m₂)</span> yields{' '}
            <strong className="text-emerald-300">v₁ = 0</strong>! Ball 1 halts immediately and transfers all its velocity to Ball 2 (
            <strong className="text-emerald-300">v₂ = u₁</strong>).
          </div>
        </div>
      </div>
    </div>
  );
};
