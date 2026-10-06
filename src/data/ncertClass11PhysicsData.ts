import { ConceptItem } from '../types/science';

export const NCERT_CLASS11_PHYSICS_CONCEPTS: ConceptItem[] = [
  // --- KINEMATICS & MOTION ---
  {
    id: 'ncert11-phy-projectile-motion',
    title: 'Two-Dimensional Projectile Motion & Trajectory Parabola',
    subject: 'physics',
    gradeLevel: 'Class 11',
    tagline: 'Horizontal motion at constant velocity + vertical motion under gravity g = 9.8 m/s²',
    description:
      'Projectile motion is a form of two-dimensional motion where an object is launched into space under the influence of gravity alone (neglecting air resistance). Horizontal velocity component vx = v₀ cos θ remains constant throughout flight. Vertical velocity component vy(t) = v₀ sin θ - gt undergoes constant downward acceleration. Trajectory is parabolic: y = x tan θ - (g x²) / (2 v₀² cos² θ). Maximum Height H = (v₀² sin² θ) / (2g); Time of Flight T = (2 v₀ sin θ) / g; Horizontal Range R = (v₀² sin 2θ) / g, attaining maximum range at launch angle θ = 45°.',
    formulaLaTeX: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g} \\quad | \\quad H = \\frac{v_0^2 \\sin^2\\theta}{2g} \\quad | \\quad T = \\frac{2v_0 \\sin\\theta}{g}',
    formulaExplanation:
      'Range is symmetric for complementary launch angles θ and (90° - θ). Maximum height depends exclusively on vertical initial velocity component.',
    variables: [
      {
        id: 'initialVelocityV0',
        name: 'Launch Speed (v₀)',
        symbol: 'v_0',
        unit: 'm/s',
        min: 10,
        max: 50,
        step: 5,
        defaultValue: 25,
        description: 'Muzzle speed of projectile.',
      },
      {
        id: 'launchAngleDeg',
        name: 'Launch Angle (θ)',
        symbol: '\\theta',
        unit: 'deg',
        min: 15,
        max: 75,
        step: 5,
        defaultValue: 45,
        description: 'Angle of elevation above horizontal.',
      },
    ],
    prediction: {
      prompt: 'At what launch angle does an ideal projectile achieve maximum horizontal range over level ground?',
      scenario: 'A ball is kicked with fixed speed v0 at varying launch angles between 0° and 90°.',
      choices: [
        { id: 'p1', text: '45° (since sin(2θ) reaches maximum 1 at 2θ = 90°).', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: '60° because higher angles allow longer flight time.', isCorrect: false, misconceptionExplanation: 'While flight time is longer, horizontal speed v0*cos(θ) is too low.' },
        { id: 'p3', text: '30° because horizontal velocity is greater.', isCorrect: false, misconceptionExplanation: 'At 30°, the projectile hits the ground too quickly.' },
      ],
      correctExplanation: 'R = (v0² sin 2θ) / g. The sine function attains its maximum value 1 when 2θ = 90°, which occurs at θ = 45°.',
      relevantFormula: 'R_{\\max} = \\frac{v_0^2}{g} \\quad (\\theta = 45^\\circ)',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Artillery Ballistics & Long Jumps', description: 'Long jump athletes optimize takeoff angle near 45° for maximum distance.' },
      { title: 'Basketball Arc Trajectories', description: 'Shooters select high parabolic release angles to increase basket entry area.' },
    ],
    simulationType: 'class11-physics',
  },

  // --- NEWTON'S LAWS & FRICTION ---
  {
    id: 'ncert11-phy-newton-laws-inclined-plane',
    title: 'Newton’s Laws of Motion, Friction & Inclined Plane Dynamics',
    subject: 'physics',
    gradeLevel: 'Class 11',
    tagline: 'F_net = m·a, Normal force N = mg cos θ, and static/kinetic friction f = μN',
    description:
      'Newton’s Second Law states that rate of change of momentum is proportional to net applied force: F_net = dp/dt = m a. On an inclined plane of inclination angle θ: Gravitational force resolves into parallel component (mg sin θ downward along incline) and perpendicular component (mg cos θ into incline). Normal reaction N = mg cos θ. Friction opposes relative impending motion: Static friction f_s ≤ μ_s N prevents slipping until angle of repose tan θ = μ_s. Kinetic friction f_k = μ_k N acts during sliding, resulting in acceleration a = g (sin θ - μ_k cos θ).',
    formulaLaTeX: 'a = g (\\sin\\theta - \\mu_k \\cos\\theta) \\quad | \\quad f_{\\max} = \\mu_s mg \\cos\\theta',
    formulaExplanation:
      'If sin θ ≤ μ_s cos θ, the block remains stationary. Once sliding starts, kinetic friction is constant.',
    variables: [
      { id: 'inclineAngleDeg', name: 'Incline Angle (θ)', symbol: '\\theta', unit: 'deg', min: 10, max: 60, step: 5, defaultValue: 30, description: 'Angle of inclined plane.' },
      { id: 'frictionCoefficientMu', name: 'Friction Coefficient (μ)', symbol: '\\mu', unit: 'unitless', min: 0.1, max: 0.8, step: 0.05, defaultValue: 0.25, description: 'Coefficient of kinetic friction.' },
    ],
    prediction: {
      prompt: 'What happens to the acceleration of a block sliding down an incline if its mass m is doubled?',
      scenario: 'A wooden block of mass m is replaced by 2m on the same rough inclined plane.',
      choices: [
        { id: 'p1', text: 'Acceleration remains unchanged.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Acceleration doubles.', isCorrect: false, misconceptionExplanation: 'Mass cancels in the equation of motion: a = F_net / m = m(g sinθ - μg cosθ) / m.' },
        { id: 'p3', text: 'Acceleration is halved.', isCorrect: false, misconceptionExplanation: 'Both driving gravitational force and friction scale with mass, so mass cancels.' },
      ],
      correctExplanation: 'The net force is F = mg sin θ - μ_k mg cos θ = m [g(sin θ - μ_k cos θ)]. Dividing by mass gives a = g(sin θ - μ_k cos θ), independent of mass m.',
      relevantFormula: 'a = g(\\sin\\theta - \\mu_k \\cos\\theta)',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Automobile Anti-Lock Braking Systems (ABS)', description: 'ABS modulates brake pressure to keep tires in the higher static friction regime.' },
      { title: 'Mountain Highway Switchbacks', description: 'Roads are built with shallow inclination angles below the angle of repose.' },
    ],
    simulationType: 'friction-dynamics',
  },

  // --- WORK, ENERGY & POWER ---
  {
    id: 'ncert11-phy-work-energy-theorem-spring',
    title: 'Work-Energy Theorem & Elastic Potential Energy of Springs',
    subject: 'physics',
    gradeLevel: 'Class 11',
    tagline: 'Work done W = ΔK = K_f - K_i and Hooke’s spring potential energy U = ½kx²',
    description:
      'The Work-Energy Theorem states that the work done by all forces (conservative and non-conservative) on a body equals the change in its kinetic energy: W_net = ΔK = ½ m v_f² - ½ m v_i². Conservative forces have potential energy functions: Work done by spring force F = -kx gives stored elastic potential energy U(x) = ½ k x². For an isolated mechanical system with only conservative forces, total mechanical energy is conserved: E = K + U = constant. In a mass-spring oscillator, kinetic energy and potential energy continuously interchange: at max displacement x = A, K = 0 and U = ½kA²; at equilibrium x = 0, U = 0 and K = ½m v_max².',
    formulaLaTeX: 'W_{\\text{net}} = \\Delta K \\quad | \\quad U_s = \\frac{1}{2} k x^2 \\quad | \\quad E = \\frac{1}{2} m v^2 + \\frac{1}{2} k x^2',
    formulaExplanation:
      'Spring restoring force is linear with displacement F = -kx. Total energy remains constant while exchanging between kinetic and elastic forms.',
    variables: [
      { id: 'springConstantK', name: 'Spring Constant (k)', symbol: 'k', unit: 'N/m', min: 50, max: 400, step: 50, defaultValue: 150, description: 'Stiffness of spring.' },
      { id: 'springDisplacementX', name: 'Displacement (x)', symbol: 'x', unit: 'cm', min: 2, max: 20, step: 2, defaultValue: 10, description: 'Initial spring compression/stretch.' },
    ],
    prediction: {
      prompt: 'If a spring is stretched to twice its initial displacement (2x), how many times does its stored elastic potential energy increase?',
      scenario: 'A spring with spring constant k is stretched from displacement x to 2x.',
      choices: [
        { id: 'p1', text: 'Increases by 4 times (quadruples).', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Doubles (2 times).', isCorrect: false, misconceptionExplanation: 'Potential energy scales with the square of displacement: U = ½ k x².' },
        { id: 'p3', text: 'Increases by 8 times.', isCorrect: false, misconceptionExplanation: 'Dependence is quadratic (x²), not cubic.' },
      ],
      correctExplanation: 'U = ½ k x². When displacement becomes 2x: U\' = ½ k (2x)² = 4 (½ k x²) = 4U.',
      relevantFormula: 'U\' = \\frac{1}{2} k (2x)^2 = 4 U',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Vehicle Suspension Shock Absorbers', description: 'Coil springs store kinetic shock energy, while dampers dissipate it thermally.' },
      { title: 'Archery Bow & Arrow Propulsion', description: 'Draw work stores elastic strain energy in the limbs, releasing it as arrow kinetic energy.' },
    ],
    simulationType: 'class11-physics',
  },

  // --- GRAVITATION & PLANETARY ORBITS ---
  {
    id: 'ncert11-phy-gravitation-kepler-laws-orbits',
    title: 'Universal Gravitation, Kepler’s Laws & Satellite Orbital Motion',
    subject: 'physics',
    gradeLevel: 'Class 11',
    tagline: 'F = G·M·m / r², Kepler’s T² ∝ r³, orbital speed v_o = √(GM/r), and escape speed v_e = √(2GM/R)',
    description:
      'Newton’s Law of Universal Gravitation states: F = G (M m) / r², where G = 6.674 × 10⁻¹¹ N·m²/kg². Kepler’s Three Laws: (1) Law of Orbits: Planets move in elliptical orbits with the Sun at one focus; (2) Law of Areas: The radius vector sweeps equal areas in equal intervals of time (conservation of angular momentum L = m r v_perpendicular = constant); (3) Law of Periods: T² ∝ a³ (square of orbital period is proportional to cube of semi-major axis). For circular satellite orbits around Earth: Centripetal force equals gravity: m v_o² / r = G M m / r² => Orbital speed v_o = √(G M / r). Escape Velocity is minimum speed needed to escape gravitational pull: v_e = √(2 G M / R) = √(2 g R) ≈ 11.2 km/s for Earth.',
    formulaLaTeX: 'v_o = \\sqrt{\\frac{GM}{r}} \\quad | \\quad T^2 = \\frac{4\\pi^2}{GM} r^3 \\quad | \\quad v_e = \\sqrt{2} \\, v_o',
    formulaExplanation:
      'Higher orbital altitudes result in slower orbital speed and longer orbital periods. Escape velocity is strictly √2 ≈ 1.414 times orbital velocity at Earth’s surface.',
    variables: [
      { id: 'orbitalAltitudeKm', name: 'Altitude (h)', symbol: 'h', unit: 'km', min: 400, max: 36000, step: 2000, defaultValue: 400, description: 'Satellite height above Earth surface (LEO: 400 km, GEO: 35,786 km).' },
    ],
    prediction: {
      prompt: 'What happens to the orbital speed of a satellite if it is moved from Low Earth Orbit (400 km) to Geostationary Orbit (36,000 km)?',
      scenario: 'A communications satellite transfers to a higher orbital radius.',
      choices: [
        { id: 'p1', text: 'Orbital speed decreases.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Orbital speed increases to overcome gravity.', isCorrect: false, misconceptionExplanation: 'Because v = √(GM/r), increasing r decreases orbital speed.' },
        { id: 'p3', text: 'Orbital speed remains constant.', isCorrect: false, misconceptionExplanation: 'Orbital velocity depends inversely on the square root of radius.' },
      ],
      correctExplanation: 'Orbital velocity is v_o = √(GM/r). In LEO (r ≈ 6800 km), speed is ~7.8 km/s; in GEO (r ≈ 42,000 km), speed drops to ~3.1 km/s.',
      relevantFormula: 'v_o \\propto \\frac{1}{\\sqrt{r}}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Geostationary Telecommunication Satellites', description: 'Satellites at altitude 35,786 km match Earth’s 24-hour rotation, appearing stationary over the equator.' },
      { title: 'International Space Station (ISS) Microgravity', description: 'Astronauts experience weightlessness due to continuous orbital free fall around Earth.' },
    ],
    simulationType: 'class11-physics',
  },

  // --- MECHANICAL PROPERTIES OF FLUIDS & BERNOULLI ---
  {
    id: 'ncert11-phy-bernoulli-principle-fluid-dynamics',
    title: 'Fluid Dynamics: Continuity Equation & Bernoulli’s Principle',
    subject: 'physics',
    gradeLevel: 'Class 11',
    tagline: 'Continuity A₁v₁ = A₂v₂ and Bernoulli: P + ½ρv² + ρgh = constant',
    description:
      'For an incompressible, non-viscous streamline fluid flow: (1) Equation of Continuity: Mass conservation dictates that mass flow rate is constant across cross-sections: A₁ v₁ = A₂ v₂. When pipe narrows (A decreases), fluid velocity v must increase; (2) Bernoulli’s Principle: Arising from work-energy theorem for fluids, total mechanical energy per unit volume remains constant along a streamline: P + ½ ρ v² + ρ g h = constant. Higher fluid velocity produces lower static pressure P. Applications include Venturi meters measuring fluid flow rates, atomizer perfume sprayers, and aerodynamic lift on airplane aerofoils (Magnus effect on spinning balls).',
    formulaLaTeX: 'P + \\frac{1}{2} \\rho v^2 + \\rho g h = \\text{constant} \\quad | \\quad A_1 v_1 = A_2 v_2',
    formulaExplanation:
      'Where fluid speed increases in a constriction, internal hydrostatic pressure drops correspondingly.',
    variables: [
      { id: 'inletVelocityMPerS', name: 'Inlet Velocity (v₁)', symbol: 'v_1', unit: 'm/s', min: 1, max: 10, step: 1, defaultValue: 2, description: 'Speed of fluid in wide pipe.' },
      { id: 'areaRatioA1OverA2', name: 'Area Ratio (A₁/A₂)', symbol: 'A_1/A_2', unit: 'ratio', min: 1.5, max: 5.0, step: 0.5, defaultValue: 3.0, description: 'Constriction ratio in narrow throat.' },
    ],
    prediction: {
      prompt: 'When water flows from a wide pipe section into a narrow constriction, what happens to the water speed and fluid pressure?',
      scenario: 'Water moves through a horizontal Venturi constriction.',
      choices: [
        { id: 'p1', text: 'Speed increases and pressure decreases.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Speed increases and pressure increases.', isCorrect: false, misconceptionExplanation: 'By Bernoulli’s equation, kinetic energy increases at the expense of pressure energy.' },
        { id: 'p3', text: 'Speed decreases and pressure increases.', isCorrect: false, misconceptionExplanation: 'Continuity requires smaller area to produce higher velocity.' },
      ],
      correctExplanation: 'By continuity, A1 v1 = A2 v2 => v2 = (A1/A2) v1, so speed increases in constriction. By Bernoulli’s equation P1 + ½ρv1² = P2 + ½ρv2², higher v2 requires lower P2.',
      relevantFormula: 'P_1 - P_2 = \\frac{1}{2} \\rho (v_2^2 - v_1^2) > 0',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Aircraft Wing Aerofoil Lift', description: 'Curved upper wing contours accelerate airflow, creating lower pressure above the wing and producing net lift.' },
      { title: 'Venturi Carburetor Fuel Injection', description: 'Air rushing through a constriction creates low pressure that draws liquid fuel into the air stream.' },
    ],
    simulationType: 'class11-physics',
  },

  // --- THERMODYNAMICS & HEAT ENGINES ---
  {
    id: 'ncert11-phy-thermodynamics-carnot-engine',
    title: 'Thermodynamics: First Law, P-V Indicator & Carnot Heat Engine',
    subject: 'physics',
    gradeLevel: 'Class 11',
    tagline: 'First Law ΔQ = ΔU + ΔW, Carnot cycle efficiency η = 1 - T_C / T_H',
    description:
      'Thermodynamics studies heat, work, and internal energy: (1) First Law: Energy conservation ΔQ = ΔU + ΔW = n C_v ΔT + P ΔV. For isothermal processes (T = const), ΔU = 0 => Q = W = nRT ln(V_f/V_i); for adiabatic processes (Q = 0), W = -ΔU = (P₁V₁ - P₂V₂) / (γ - 1); (2) Second Law & Carnot Engine: An ideal reversible heat engine operating between hot reservoir (T_H) and cold reservoir (T_C) undergoes four reversible stages: Isothermal expansion, Adiabatic expansion, Isothermal compression, and Adiabatic compression. Maximum theoretical thermal efficiency: η = W / Q_H = 1 - T_C / T_H. No real engine can exceed Carnot efficiency.',
    formulaLaTeX: '\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H} \\quad | \\quad \\Delta Q = \\Delta U + \\Delta W \\quad | \\quad P V^\\gamma = \\text{constant}',
    formulaExplanation:
      'Carnot efficiency depends exclusively on absolute temperatures of heat source and sink (in Kelvin), independent of the working substance.',
    variables: [
      { id: 'sourceTempKelvin', name: 'Source Temp (T_H)', symbol: 'T_H', unit: 'K', min: 400, max: 1200, step: 50, defaultValue: 800, description: 'Absolute temperature of hot reservoir.' },
      { id: 'sinkTempKelvin', name: 'Sink Temp (T_C)', symbol: 'T_C', unit: 'K', min: 250, max: 400, step: 10, defaultValue: 300, description: 'Absolute temperature of cold heat sink.' },
    ],
    prediction: {
      prompt: 'Can a heat engine operating between heat reservoirs at 600 K and 300 K have a thermal efficiency of 60%?',
      scenario: 'An inventor claims a heat engine operating between 600 K and 300 K produces 60% efficiency.',
      choices: [
        { id: 'p1', text: 'No, Carnot efficiency is exactly 50%, and no engine can exceed this limit.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Yes, with modern low-friction lubricants.', isCorrect: false, misconceptionExplanation: 'Carnot theorem is a fundamental law of physics based on the Second Law of Thermodynamics.' },
        { id: 'p3', text: 'Yes, if the working substance is helium.', isCorrect: false, misconceptionExplanation: 'Carnot efficiency is strictly independent of the working gas.' },
      ],
      correctExplanation: 'Maximum theoretical efficiency is η = 1 - T_C / T_H = 1 - 300/600 = 0.50 (50%). A claim of 60% violates the Second Law of Thermodynamics.',
      relevantFormula: '\\eta_{\\max} = 1 - \\frac{300}{600} = 0.50 \\quad (50\\%)',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Thermal Power Station Steam Turbines', description: 'Superheated steam at 850 K is cooled by condenser cooling towers at 300 K to maximize thermodynamic efficiency.' },
      { title: 'Household Refrigerators & Heat Pumps', description: 'Refrigerators operate a reverse Carnot cycle, extracting heat from the cold interior and discharging it to the room.' },
    ],
    simulationType: 'class11-physics',
  },

  // --- OSCILLATIONS & SIMPLE HARMONIC MOTION ---
  {
    id: 'ncert11-phy-simple-harmonic-motion-pendulum',
    title: 'Oscillations: Simple Harmonic Motion & Simple Pendulum',
    subject: 'physics',
    gradeLevel: 'Class 11',
    tagline: 'Restoring force F = -kx, differential d²x/dt² + ω²x = 0, and pendulum period T = 2π√(L/g)',
    description:
      'Simple Harmonic Motion (SHM) is periodic oscillatory motion where restoring force is directly proportional to displacement from equilibrium and directed toward equilibrium: F = -k x => a = -ω² x. Displacement equation: x(t) = A cos(ωt + φ), velocity v(t) = -A ω sin(ωt + φ), acceleration a(t) = -A ω² cos(ωt + φ). Kinetic and potential energies oscillate at twice the frequency of displacement: K(t) = ½ k A² sin²(ωt), U(t) = ½ k A² cos²(ωt), with total energy E = ½ k A² remaining constant. For a Simple Pendulum of string length L: Restoring torque for small angular displacements (sin θ ≈ θ) gives period T = 2π √(L/g), independent of bob mass or amplitude.',
    formulaLaTeX: 'T = 2\\pi \\sqrt{\\frac{L}{g}} \\quad | \\quad x(t) = A \\cos(\\omega t + \\phi) \\quad | \\quad \\omega = \\sqrt{\\frac{g}{L}}',
    formulaExplanation:
      'Pendulum period is proportional to √L and inversely proportional to √g. Doubling pendulum length increases period by factor √2 ≈ 1.414.',
    variables: [
      { id: 'pendulumLengthM', name: 'Length (L)', symbol: 'L', unit: 'm', min: 0.2, max: 2.5, step: 0.1, defaultValue: 1.0, description: 'Length of suspension string.' },
      { id: 'localGravityG', name: 'Gravity (g)', symbol: 'g', unit: 'm/s²', min: 1.6, max: 24.8, step: 0.5, defaultValue: 9.8, description: 'Local gravitational acceleration (Moon=1.6, Earth=9.8, Jupiter=24.8).' },
    ],
    prediction: {
      prompt: 'If the length of a simple pendulum is quadrupled (4L), what happens to its oscillation period T?',
      scenario: 'A clock pendulum string length is lengthened from 0.25 m to 1.0 m.',
      choices: [
        { id: 'p1', text: 'Period doubles (2 times longer).', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Period quadruples (4 times longer).', isCorrect: false, misconceptionExplanation: 'Period depends on the square root of length: T ∝ √L.' },
        { id: 'p3', text: 'Period is halved.', isCorrect: false, misconceptionExplanation: 'Longer pendulums swing slower, taking longer time per cycle.' },
      ],
      correctExplanation: 'T = 2π √(L/g). When length becomes 4L: T\' = 2π √(4L/g) = 2 · (2π √(L/g)) = 2T.',
      relevantFormula: 'T\' = 2\\pi \\sqrt{\\frac{4L}{g}} = 2 T',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Grandfather Mechanical Clock Escapements', description: 'A 0.994-meter pendulum has a period of exactly 2.0 seconds, ticking once each second.' },
      { title: 'Skyscraper Tuned Mass Dampers', description: 'Taipei 101 uses a 660-tonne suspended pendulum damper to counteract typhoon and earthquake oscillations.' },
    ],
    simulationType: 'class11-physics',
  },

  // --- WAVES & DOPPLER EFFECT ---
  {
    id: 'ncert11-phy-wave-motion-doppler-effect',
    title: 'Wave Motion, Standing Waves & Doppler Effect in Sound',
    subject: 'physics',
    gradeLevel: 'Class 11',
    tagline: 'y(x,t) = A sin(kx - ωt) and Doppler perceived frequency f’ = f · (v ± v_o) / (v ∓ v_s)',
    description:
      'Mechanical waves propagate through elastic media: (1) Progressive Wave: y(x, t) = A sin(k x - ω t + φ), where wave number k = 2π/λ and angular frequency ω = 2πf, with wave propagation speed v = ω/k = f λ; (2) Standing Waves in Strings: Superposition of two identical waves traveling in opposite directions creates nodes (zero displacement) and antinodes (maximum displacement), forming discrete harmonic frequencies f_n = n v / (2L); (3) Doppler Effect: The observed frequency f\' differs from emitted frequency f when source or observer is moving relative to the medium: f\' = f [(v ± v_o) / (v ∓ v_s)], where v is sound velocity. When source approaches observer, wavefronts compress together, increasing perceived pitch; when receding, wavefronts stretch, lowering perceived pitch.',
    formulaLaTeX: 'f\' = f \\left( \\frac{v \\pm v_o}{v \\mp v_s} \\right) \\quad | \\quad y(x,t) = 2A \\sin(kx) \\cos(\\omega t)',
    formulaExplanation:
      'Upper signs apply when moving toward; lower signs apply when moving away from each other.',
    variables: [
      { id: 'sourceVelocityMPerS', name: 'Source Speed (v_s)', symbol: 'v_s', unit: 'm/s', min: 0, max: 70, step: 5, defaultValue: 30, description: 'Speed of siren vehicle.' },
      { id: 'soundSpeedMedium', name: 'Sound Speed (v)', symbol: 'v', unit: 'm/s', min: 300, max: 360, step: 5, defaultValue: 340, description: 'Speed of sound in air.' },
    ],
    prediction: {
      prompt: 'An ambulance siren emits sound at 500 Hz while approaching a stationary pedestrian at 34 m/s (speed of sound = 340 m/s). What frequency does the pedestrian hear?',
      scenario: 'Approaching sound source with v_s = 34 m/s and v = 340 m/s.',
      choices: [
        { id: 'p1', text: '556 Hz (Higher perceived pitch).', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: '450 Hz (Lower perceived pitch).', isCorrect: false, misconceptionExplanation: 'Approaching sources compress sound wavefronts, raising observed frequency.' },
        { id: 'p3', text: '500 Hz (Unchanged frequency).', isCorrect: false, misconceptionExplanation: 'Relative motion produces Doppler frequency shift.' },
      ],
      correctExplanation: 'f\' = f · [v / (v - v_s)] = 500 · [340 / (340 - 34)] = 500 · (340 / 306) = 555.6 Hz.',
      relevantFormula: 'f\' = 500 \\times \\frac{340}{306} \\approx 555.6\\text{ Hz}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Police Radar Guns & Doppler Ultrasound', description: 'Reflected microwave and ultrasound Doppler shifts measure speed of vehicles and bloodstream velocities.' },
      { title: 'Cosmological Redshift & Expanding Universe', description: 'Light from receding galaxies shifts to longer red wavelengths, proving cosmic expansion.' },
    ],
    simulationType: 'class11-physics',
  },
];
