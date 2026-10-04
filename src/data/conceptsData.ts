import { ConceptItem } from '../types/science';
import { NCERT_CLASS9_CHEMISTRY_CONCEPTS } from './ncertClass9ChemistryData';
import { NCERT_CLASS9_BIOLOGY_CONCEPTS } from './ncertClass9BiologyData';
import { NCERT_CLASS10_PHYSICS_CONCEPTS } from './ncertClass10PhysicsData';
import { NCERT_CLASS11_PHYSICS_CONCEPTS } from './ncertClass11PhysicsData';
import { NCERT_CLASS12_PHYSICS_CONCEPTS } from './ncertClass12PhysicsData';
import { NCERT_CLASS10_CHEMISTRY_CONCEPTS } from './ncertClass10ChemistryData';
import { NCERT_CLASS11_CHEMISTRY_CONCEPTS } from './ncertClass11ChemistryData';
import { NCERT_CLASS12_CHEMISTRY_CONCEPTS } from './ncertClass12ChemistryData';
import { NCERT_CLASS10_BIOLOGY_CONCEPTS } from './ncertClass10BiologyData';
import { NCERT_CLASS11_BIOLOGY_CONCEPTS } from './ncertClass11BiologyData';
import { NCERT_CLASS12_BIOLOGY_CONCEPTS } from './ncertClass12BiologyData';

export const CONCEPTS_DATA: ConceptItem[] = [
  // --- PHYSICS ---
  {
    id: 'projectile-motion',
    title: 'Projectile Motion & Ballistics',
    subject: 'physics',
    gradeLevel: 'Class 11',
    tagline: 'Two-dimensional motion under constant gravitational acceleration',
    description:
      'A projectile moves through space influenced only by gravity (neglecting air resistance). The horizontal motion proceeds at constant velocity while the vertical motion experiences constant downward acceleration, forming a parabola.',
    formulaLaTeX: 'R = \\frac{v_0^2 \\sin(2\\theta)}{g}, \\quad H = \\frac{v_0^2 \\sin^2\\theta}{2g}, \\quad t = \\frac{2v_0 \\sin\\theta}{g}',
    formulaExplanation:
      'The range R depends quadratically on initial velocity v_0 and reaches maximum at \\theta = 45^\\circ. The maximum height H and total flight time t depend strictly on the vertical velocity component v_{0y} = v_0 \\sin\\theta.',
    simulationType: 'projectile-motion',
    variables: [
      {
        id: 'velocity',
        name: 'Initial Velocity',
        symbol: 'v_0',
        unit: 'm/s',
        min: 5,
        max: 50,
        step: 1,
        defaultValue: 25,
        description: 'Magnifies both horizontal distance and vertical altitude.',
      },
      {
        id: 'angle',
        name: 'Launch Angle',
        symbol: '\\theta',
        unit: '°',
        min: 10,
        max: 85,
        step: 1,
        defaultValue: 45,
        description: 'Controls the partition between horizontal drift and vertical lift.',
      },
      {
        id: 'gravity',
        name: 'Gravitational Field',
        symbol: 'g',
        unit: 'm/s²',
        min: 1.6,
        max: 25,
        step: 0.2,
        defaultValue: 9.8,
        description: 'Earth = 9.8, Moon = 1.62, Mars = 3.71, Jupiter = 24.79.',
      },
      {
        id: 'initialHeight',
        name: 'Launch Platform Height',
        symbol: 'y_0',
        unit: 'm',
        min: 0,
        max: 20,
        step: 0.5,
        defaultValue: 0,
        description: 'Initial elevation above target ground level.',
      },
    ],
    prediction: {
      prompt: 'Intuition Check: Optimal Angle with Platform Elevation',
      scenario:
        'When launching a projectile from a elevated cliff (y_0 = 10 m), will the angle that yields the maximum horizontal range still be 45°?',
      choices: [
        {
          id: 'p1',
          text: 'Greater than 45°, because it needs more height to travel further.',
          isCorrect: false,
          misconceptionExplanation:
            'Many students assume higher angles always give more distance when elevated. However, spending excess velocity on vertical climb wastes kinetic energy when the cliff already provides height.',
        },
        {
          id: 'p2',
          text: 'Less than 45°, because the cliff already gives extra flight time.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Exactly 45°, because 45° is mathematically invariant in kinematics.',
          isCorrect: false,
          misconceptionExplanation:
            '45° maximizes range ONLY when the launch point and landing point are at the identical height (y_0 = y_final = 0).',
        },
      ],
      correctExplanation:
        'When launching from a cliff (y_0 > 0), gravity will pull the object downward for an extended period anyway. Allocating more initial velocity to the horizontal axis (angle < 45°) increases horizontal speed v_x without losing the necessary flight time, maximizing total range.',
      relevantFormula: '\\theta_{\\text{opt}} = \\arcsin\\left( \\frac{1}{\\sqrt{2 + \\frac{2gy_0}{v_0^2}}} \\right) < 45^\\circ',
    },
    relatedConcepts: [
      { id: 'newtons-laws', name: "Newton's Laws of Motion", subject: 'physics' },
      { id: 'work-energy-power', name: 'Conservation of Energy', subject: 'physics' },
      { id: 'gravitation', name: 'Gravitation & Orbits', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Olympic Javelin & Shot Put',
        description: 'Athletes release the projectile from shoulder height (~1.8 m - 2.0 m) at approximately 34°–38° rather than 45° to maximize distance.',
      },
      {
        title: 'Artillery & Ballistic Missiles',
        description: 'Flight computers calculate parabolic trajectories adjusted for curvature, atmospheric density gradients, and Coriolis acceleration.',
      },
      {
        title: 'Spacecraft Atmospheric Re-entry',
        description: 'Suborbital flight paths use ballistic coasting trajectories to conserve precious orbital propulsion fuel.',
      },
    ],
  },

  {
    id: 'newtons-laws',
    title: "Newton's Second Law & Friction",
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Dynamics of force, inertia, acceleration, and contact resistance',
    description:
      'The net external force on a body is directly proportional to its rate of change of momentum. For constant mass, \\vec{F}_{\\text{net}} = m \\vec{a}. Friction opposes relative motion with maximum magnitude f_s \\le \\mu_s N and kinetic resistance f_k = \\mu_k N.',
    formulaLaTeX: '\\sum \\vec{F} = m \\vec{a} \\implies a = \\frac{F_{\\text{app}} - \\mu_k m g}{m} = \\frac{F_{\\text{app}}}{m} - \\mu_k g',
    formulaExplanation:
      'Acceleration is directly proportional to the applied force exceeding kinetic friction, and inversely proportional to inertial mass m.',
    simulationType: 'newtons-laws',
    variables: [
      {
        id: 'appliedForce',
        name: 'Applied Force',
        symbol: 'F_{\\text{app}}',
        unit: 'N',
        min: 0,
        max: 100,
        step: 2,
        defaultValue: 40,
        description: 'The horizontal push applied to the object.',
      },
      {
        id: 'mass',
        name: 'Object Mass',
        symbol: 'm',
        unit: 'kg',
        min: 1,
        max: 25,
        step: 0.5,
        defaultValue: 5,
        description: 'Measure of translational inertia; resistance to acceleration.',
      },
      {
        id: 'frictionCoeff',
        name: 'Kinetic Friction Coefficient',
        symbol: '\\mu_k',
        unit: '',
        min: 0,
        max: 0.8,
        step: 0.05,
        defaultValue: 0.2,
        description: '0 = frictionless ice, 0.2 = polished wood, 0.7 = rough asphalt.',
      },
    ],
    prediction: {
      prompt: 'Inertia & Force Challenge',
      scenario:
        'A box is accelerating on a frictionless floor under a constant 30 N force. If the mass of the box is suddenly doubled while the force stays 30 N, what happens to acceleration?',
      choices: [
        {
          id: 'p1',
          text: 'Acceleration doubles because heavier objects carry more momentum.',
          isCorrect: false,
          misconceptionExplanation:
            'A common confusion: heavier objects have more inertia, making them harder to accelerate, not easier.',
        },
        {
          id: 'p2',
          text: 'Acceleration is halved because a = F / m.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Acceleration remains unchanged because the applied force is still 30 N.',
          isCorrect: false,
          misconceptionExplanation:
            'Force alone does not dictate acceleration; mass determines how much acceleration that force produces.',
        },
      ],
      correctExplanation:
        'From \\vec{a} = \\frac{\\vec{F}}{m}, when m is doubled (m \\to 2m) with constant F, the acceleration is strictly halved (a \\to a/2).',
      relevantFormula: 'a = \\frac{F}{m} \\implies a_2 = \\frac{F}{2m} = \\frac{1}{2} a_1',
    },
    relatedConcepts: [
      { id: 'projectile-motion', name: 'Projectile Motion', subject: 'physics' },
      { id: 'work-energy-power', name: 'Work-Energy Theorem', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Automotive ABS Brakes',
        description: 'Prevents tires from locking into kinetic sliding (\\mu_k < \\mu_s), keeping tires near peak static friction for minimum stopping distance.',
      },
      {
        title: 'Rocket Payload Capacities',
        description: 'Engineers minimize spacecraft mass at immense expense because every kilogram cut increases net acceleration a = (T - mg)/m.',
      },
    ],
  },

  {
    id: 'current-electricity',
    title: "Ohm's Law & Circuit Analysis",
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Electric potential, electron drift, resistance, and Joule heating',
    description:
      'Current I flowing through an ohmic conductor between two points is directly proportional to the potential difference V across them, provided temperature and physical dimensions remain constant.',
    formulaLaTeX: 'V = I \\cdot R, \\quad P = V \\cdot I = I^2 R = \\frac{V^2}{R}',
    formulaExplanation:
      'Resistance R impedes electric charge flow. The electric power dissipated as thermal energy or light in a bulb scales quadratically with current.',
    simulationType: 'ohms-law',
    variables: [
      {
        id: 'voltage',
        name: 'Electromotive Force / Voltage',
        symbol: 'V',
        unit: 'V',
        min: 1,
        max: 24,
        step: 0.5,
        defaultValue: 12,
        description: 'Electric potential difference driving electrons.',
      },
      {
        id: 'resistance',
        name: 'Circuit Resistance',
        symbol: 'R',
        unit: 'Ω',
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 6,
        description: 'Impedance to electron drift due to lattice ion scattering.',
      },
    ],
    prediction: {
      prompt: 'Power & Brightness Paradox',
      scenario:
        'Two identical light bulbs are connected first in series and then in parallel across the exact same 12V battery. In which configuration will the total light output be greater?',
      choices: [
        {
          id: 'p1',
          text: 'In series, because the current travels through both bulbs together.',
          isCorrect: false,
          misconceptionExplanation:
            'In series, total resistance doubles (2R), so current drops to half, cutting total circuit power to P = V^2 / (2R).',
        },
        {
          id: 'p2',
          text: 'In parallel, because both bulbs receive the full 12V and total resistance is halved.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Both emit equal brightness because the battery energy is the same.',
          isCorrect: false,
          misconceptionExplanation:
            'Batteries do not deliver constant power; they supply constant voltage. Power draw depends entirely on circuit resistance.',
        },
      ],
      correctExplanation:
        'In parallel, total equivalent resistance is R/2, yielding total power P = V^2 / (R/2) = 2 V^2 / R, which is 4 times brighter than the series circuit!',
      relevantFormula: 'P_{\\text{parallel}} = 2 \\frac{V^2}{R} = 4 P_{\\text{series}}',
    },
    relatedConcepts: [
      { id: 'electrostatics', name: 'Electrostatics & Coulomb Law', subject: 'physics' },
      { id: 'electrochemical-cell', name: 'Electrochemical Galvanic Cells', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Household Parallel Wiring',
        description: 'Home appliances are connected in parallel so each operates at standard 230V/120V independently without one switching off the rest.',
      },
      {
        title: 'EV Battery Management Systems',
        description: 'Monitors internal resistance and temperature to avoid catastrophic thermal runaway during high-current DC fast charging.',
      },
    ],
  },

  {
    id: 'gravitation',
    title: 'Universal Gravitation & Orbits',
    subject: 'physics',
    gradeLevel: 'Class 11',
    tagline: "Newton's law of gravitation and Keplerian orbital velocity",
    description:
      'Every particle in the universe attracts every other particle with a force proportional to the product of their masses and inversely proportional to the square of distance.',
    formulaLaTeX: 'F = G \\frac{m_1 m_2}{r^2}, \\quad v_{\\text{orbit}} = \\sqrt{\\frac{G M}{r}}, \\quad T^2 = \\frac{4\\pi^2}{G M} r^3',
    formulaExplanation:
      'Gravitational force provides the required centripetal acceleration F_g = m v^2 / r for stable circular orbits.',
    simulationType: 'gravitation-orbit',
    variables: [
      {
        id: 'orbitalRadius',
        name: 'Orbital Altitude / Radius',
        symbol: 'r',
        unit: '×10³ km',
        min: 7,
        max: 42,
        step: 1,
        defaultValue: 10,
        description: 'Distance from Earth center (LEO ~7,000 km, GEO ~42,164 km).',
      },
      {
        id: 'centralMass',
        name: 'Central Body Mass (Earth equivalents)',
        symbol: 'M',
        unit: 'M_⊕',
        min: 0.5,
        max: 5,
        step: 0.25,
        defaultValue: 1,
        description: 'Gravitational source mass creating the spacetime curvature / potential well.',
      },
    ],
    prediction: {
      prompt: 'Orbital Speed Paradox',
      scenario:
        'A satellite fires its thrusters to move from a Low Earth Orbit (r = 7,000 km) to a higher Geostationary Orbit (r = 42,000 km). What happens to its circular orbital speed?',
      choices: [
        {
          id: 'p1',
          text: 'It speeds up, because it required extra propulsion energy to climb.',
          isCorrect: false,
          misconceptionExplanation:
            'While total mechanical energy increased (less negative), kinetic energy decreased as it converted into gravitational potential energy.',
        },
        {
          id: 'p2',
          text: 'It slows down, because gravity weakens with distance: v = \\sqrt{GM/r}.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'It stays constant because circular orbits require the same orbital speed.',
          isCorrect: false,
          misconceptionExplanation:
            'Orbital speed is strictly tied to radius: higher satellites move noticeably slower (ISS: 7.8 km/s, Moon: 1.0 km/s).',
        },
      ],
      correctExplanation:
        'Higher orbits require lower circular velocities. Even though energy was added to climb the gravity well, kinetic energy is traded for gravitational potential energy: v = \\sqrt{GM/r}.',
      relevantFormula: 'v = \\sqrt{\\frac{GM}{r}} \\implies r_2 > r_1 \\implies v_2 < v_1',
    },
    relatedConcepts: [
      { id: 'projectile-motion', name: 'Projectile Motion', subject: 'physics' },
      { id: 'work-energy-power', name: 'Work, Energy & Power', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'GPS Satellite Constellations',
        description: 'Operate at medium Earth orbit (20,200 km) with orbital periods of exactly 12 sidereal hours.',
      },
      {
        title: 'James Webb Space Telescope (L2)',
        description: 'Balances solar and terrestrial gravity at Sun-Earth Lagrange point 2, 1.5 million km from Earth.',
      },
    ],
  },

  {
    id: 'ray-optics',
    title: "Ray Optics & Snell's Law",
    subject: 'physics',
    gradeLevel: 'Class 10',
    tagline: 'Wave speed change at interfaces causing light refraction and total reflection',
    description:
      'Light travels at different phase velocities in different optical media. At an interface, wavefront bending obeys Snell’s law: n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2. When traveling into a rarer medium beyond the critical angle \\theta_c, total internal reflection occurs.',
    formulaLaTeX: 'n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2, \\quad \\sin\\theta_c = \\frac{n_2}{n_1} \\quad (n_1 > n_2)',
    formulaExplanation:
      'Refractive index n = c / v measures optical density. Total internal reflection occurs when \\theta_1 \\ge \\theta_c.',
    simulationType: 'ray-optics',
    variables: [
      {
        id: 'angle1',
        name: 'Incident Angle',
        symbol: '\\theta_1',
        unit: '°',
        min: 0,
        max: 85,
        step: 1,
        defaultValue: 30,
        description: 'Angle of ray with respect to the normal line.',
      },
      {
        id: 'n1',
        name: 'Medium 1 Refractive Index',
        symbol: 'n_1',
        unit: '',
        min: 1.0,
        max: 2.5,
        step: 0.1,
        defaultValue: 1.5,
        description: '1.0 = vacuum/air, 1.33 = water, 1.5 = glass, 2.42 = diamond.',
      },
      {
        id: 'n2',
        name: 'Medium 2 Refractive Index',
        symbol: 'n_2',
        unit: '',
        min: 1.0,
        max: 2.5,
        step: 0.1,
        defaultValue: 1.0,
        description: 'Refractive index of second optical medium.',
      },
    ],
    prediction: {
      prompt: 'Critical Angle & Total Internal Reflection',
      scenario:
        'A light beam passes from glass (n = 1.5) into air (n = 1.0) at an incident angle of 50°. What happens to the ray?',
      choices: [
        {
          id: 'p1',
          text: 'It bends away from the normal into the air at ~70°.',
          isCorrect: false,
          misconceptionExplanation:
            'At 50°, \\sin(50°) ≈ 0.766, so n_1/n_2 \\sin(50°) = 1.5 × 0.766 = 1.15 > 1. Sine cannot exceed 1!',
        },
        {
          id: 'p2',
          text: 'Total internal reflection occurs; 100% of the light reflects back into the glass.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'The beam is completely absorbed at the interface boundary.',
          isCorrect: false,
          misconceptionExplanation:
            'Transparent optical boundaries do not absorb; exceeding critical angle causes pristine reflection.',
        },
      ],
      correctExplanation:
        'The critical angle is \\theta_c = \\arcsin(1.0 / 1.5) \\approx 41.8^\\circ. Since 50° > 41.8°, no refracted wave can exit; total internal reflection reflects 100% of the beam back!',
      relevantFormula: '\\theta_c = \\arcsin\\left(\\frac{1.0}{1.5}\\right) \\approx 41.8^\\circ < 50^\\circ \\implies \\text{TIR}',
    },
    relatedConcepts: [
      { id: 'wave-optics', name: 'Wave Optics & Interference', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Fiber Optic Internet Cables',
        description: 'Ultra-pure silica glass fibers guide laser pulses across transoceanic distances via continuous total internal reflection with minimal attenuation.',
      },
      {
        title: 'Medical Endoscopes',
        description: 'Coherent fiber optic bundles transmit direct optical imaging from inside the human body without bulky electronic cameras.',
      },
    ],
  },

  {
    id: 'simple-harmonic-motion',
    title: 'Simple Harmonic Motion (SHM)',
    subject: 'physics',
    gradeLevel: 'Class 11',
    tagline: 'Linear restoring forces, phase oscillations, and periodic motion',
    description:
      'When an object is displaced from equilibrium, a restoring force proportional to displacement F = -kx produces simple harmonic oscillation. Total mechanical energy cycles continuously between potential and kinetic forms.',
    formulaLaTeX: 'F = -k x, \\quad \\omega = \\sqrt{\\frac{k}{m}}, \\quad T = 2\\pi \\sqrt{\\frac{m}{k}}, \\quad E_{\\text{total}} = \\frac{1}{2} k A^2',
    formulaExplanation:
      'The period T is completely independent of the oscillation amplitude A for ideal simple harmonic oscillators (isochronism).',
    simulationType: 'shm-oscillator',
    variables: [
      {
        id: 'springConstant',
        name: 'Spring Stiffness',
        symbol: 'k',
        unit: 'N/m',
        min: 5,
        max: 80,
        step: 5,
        defaultValue: 25,
        description: 'Restoring force constant per unit displacement.',
      },
      {
        id: 'oscMass',
        name: 'Oscillating Mass',
        symbol: 'm',
        unit: 'kg',
        min: 0.5,
        max: 8,
        step: 0.5,
        defaultValue: 2,
        description: 'Inertial mass attached to the spring oscillator.',
      },
      {
        id: 'amplitude',
        name: 'Displacement Amplitude',
        symbol: 'A',
        unit: 'm',
        min: 0.1,
        max: 1.0,
        step: 0.05,
        defaultValue: 0.5,
        description: 'Maximum initial displacement from equilibrium.',
      },
    ],
    prediction: {
      prompt: 'Amplitude and Time Period Independence',
      scenario:
        'A mass on a spring oscillates with a period of 2.0 seconds at an amplitude of 10 cm. If the amplitude is pulled out to 20 cm, what will the new time period be?',
      choices: [
        {
          id: 'p1',
          text: '4.0 s, because the mass has to travel twice the physical distance.',
          isCorrect: false,
          misconceptionExplanation:
            'While the distance doubled, the restoring force (F = -kx) and maximum velocity also doubled, perfectly canceling out the extra distance!',
        },
        {
          id: 'p2',
          text: '2.0 s, because SHM time period is completely independent of amplitude.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: '1.41 s, because period scales with square root of distance.',
          isCorrect: false,
          misconceptionExplanation:
            'The formula T = 2\\pi \\sqrt{m/k} contains no amplitude term A.',
        },
      ],
      correctExplanation:
        'In pure Simple Harmonic Motion, the period is isochronous (independent of amplitude). Doubling the amplitude doubles restoring force and acceleration, exactly compensating for the longer path.',
      relevantFormula: 'T = 2\\pi \\sqrt{\\frac{m}{k}} \\quad (\\text{independent of } A)',
    },
    relatedConcepts: [
      { id: 'work-energy-power', name: 'Work, Energy & Power', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Tuned Mass Dampers in Skyscrapers',
        description: 'Taipei 101 houses a 660-tonne pendulum that oscillates out of phase with typhoon winds to stabilize the building.',
      },
      {
        title: 'Quartz Crystal Watches',
        description: 'Piezoelectric quartz crystals vibrate at exactly 32,768 Hz under harmonic oscillation to keep precise time.',
      },
    ],
  },

  // --- CHEMISTRY ---
  {
    id: 'chemical-kinetics',
    title: 'Chemical Kinetics & Reaction Rates',
    subject: 'chemistry',
    gradeLevel: 'Class 12',
    tagline: 'Collision theory, activation energy, and the Arrhenius temperature dependence',
    description:
      'For a reaction to occur, reactant molecules must collide with sufficient kinetic energy exceeding the activation energy E_a and with proper steric orientation. Rate constants scale exponentially with temperature according to the Arrhenius equation.',
    formulaLaTeX: '\\text{Rate} = k [A]^m [B]^n, \\quad k = A e^{-\\frac{E_a}{R T}} \\implies \\ln k = \\ln A - \\frac{E_a}{R T}',
    formulaExplanation:
      'Increasing temperature shifts the Maxwell-Boltzmann distribution, exponentially increasing the fraction of particles with kinetic energy E \\ge E_a. Catalysts lower E_a by offering an alternative pathway.',
    simulationType: 'reaction-rate',
    variables: [
      {
        id: 'temperature',
        name: 'Reaction Temperature',
        symbol: 'T',
        unit: 'K',
        min: 273,
        max: 500,
        step: 5,
        defaultValue: 298,
        description: 'Shifts kinetic energy distribution of colliding molecules.',
      },
      {
        id: 'concentration',
        name: 'Reactant Concentration [A]',
        symbol: '[A]',
        unit: 'M',
        min: 0.1,
        max: 3.0,
        step: 0.1,
        defaultValue: 1.0,
        description: 'Increases collision frequency per unit volume per second.',
      },
      {
        id: 'activationEnergy',
        name: 'Activation Energy Barrier',
        symbol: 'E_a',
        unit: 'kJ/mol',
        min: 20,
        max: 100,
        step: 5,
        defaultValue: 50,
        description: 'Minimum kinetic threshold required for bond rupture/formation.',
      },
    ],
    prediction: {
      prompt: 'Catalyst vs Reaction Equilibrium',
      scenario:
        'A student adds a platinum catalyst to a slow reversible equilibrium reaction: A + B ⇌ C. What happens to the final equilibrium yield of product C?',
      choices: [
        {
          id: 'p1',
          text: 'The yield of C increases because the catalyst speeds up the forward reaction.',
          isCorrect: false,
          misconceptionExplanation:
            'A widespread misconception! A catalyst accelerates BOTH forward and reverse reactions equally by lowering the same energy barrier.',
        },
        {
          id: 'p2',
          text: 'The yield of C remains exactly identical; equilibrium is reached faster.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'The yield of C decreases because the reverse reaction is favored.',
          isCorrect: false,
          misconceptionExplanation:
            'Catalysts do not alter the free energy change \\Delta G^\\circ or equilibrium constant K_{eq}.',
        },
      ],
      correctExplanation:
        'A catalyst lowers the activation barrier for both forward and reverse pathways by the same amount \\Delta E_a. Consequently, k_f and k_b increase by the exact same ratio, leaving K_{eq} = k_f / k_b unchanged. It only reduces the time required to attain equilibrium.',
      relevantFormula: 'K_{\\text{eq}} = \\frac{k_f}{k_b} = e^{-\\frac{\\Delta G^\\circ}{RT}} \\quad (\\text{unaltered by catalyst})',
    },
    relatedConcepts: [
      { id: 'chemical-equilibrium', name: 'Chemical Equilibrium & Le Chatelier', subject: 'chemistry' },
      { id: 'enzyme-activity', name: 'Biological Enzyme Catalysis', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Haber-Bosch Ammonia Synthesis',
        description: 'Uses porous iron catalysts with potassium promoters at 450°C and 200 atm to produce global agricultural fertilizer.',
      },
      {
        title: 'Automotive Catalytic Converters',
        description: 'Ceramic honeycombs coated in Platinum/Rhodium convert toxic CO and unburnt hydrocarbons into CO_2 and H_2O in milliseconds.',
      },
    ],
  },

  {
    id: 'electrochemical-cell',
    title: 'Galvanic Cells & Nernst Equation',
    subject: 'chemistry',
    gradeLevel: 'Class 12',
    tagline: 'Spontaneous redox reactions converting chemical energy into electrical work',
    description:
      'In a Daniell galvanic cell, spontaneous zinc oxidation at the anode (Zn → Zn²⁺ + 2e⁻) drives electrons through an external wire to reduce copper ions at the cathode (Cu²⁺ + 2e⁻ → Cu). The salt bridge maintains electrical neutrality by ion migration.',
    formulaLaTeX: 'E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{R T}{n F} \\ln Q = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log_{10}\\left(\\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]}\\right)',
    formulaExplanation:
      'Standard electromotive force E° = E°(cathode) - E°(anode) = +0.34 - (-0.76) = +1.10 V. Non-standard potential shifts with the reaction quotient Q.',
    simulationType: 'electrochemical-cell',
    variables: [
      {
        id: 'zincConc',
        name: 'Anode Ion Concentration [Zn²⁺]',
        symbol: '[\\text{Zn}^{2+}]',
        unit: 'M',
        min: 0.01,
        max: 2.0,
        step: 0.05,
        defaultValue: 1.0,
        description: 'Concentration of product ions in anode beaker.',
      },
      {
        id: 'copperConc',
        name: 'Cathode Ion Concentration [Cu²⁺]',
        symbol: '[\\text{Cu}^{2+}]',
        unit: 'M',
        min: 0.01,
        max: 2.0,
        step: 0.05,
        defaultValue: 1.0,
        description: 'Concentration of reactant ions in cathode beaker.',
      },
      {
        id: 'temperatureK',
        name: 'Cell Temperature',
        symbol: 'T',
        unit: 'K',
        min: 273,
        max: 350,
        step: 5,
        defaultValue: 298,
        description: 'Operating temperature entering the RT/nF factor.',
      },
    ],
    prediction: {
      prompt: 'Nernst Concentration Shift Prediction',
      scenario:
        'If the concentration of Cu²⁺ ions in the cathode compartment is increased tenfold (from 0.1 M to 1.0 M) while [Zn²⁺] remains constant, what happens to the cell potential E_cell?',
      choices: [
        {
          id: 'p1',
          text: 'It increases by approximately 0.03 V because Q decreases.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'It decreases because higher solute concentration increases internal resistance.',
          isCorrect: false,
          misconceptionExplanation:
            'Le Chatelier’s principle applies electrochemically: adding reactant ion Cu²⁺ drives the spontaneous forward reaction, boosting voltage.',
        },
        {
          id: 'p3',
          text: 'It stays exactly 1.10 V because electrode metals define the voltage.',
          isCorrect: false,
          misconceptionExplanation:
            '1.10 V is only true at standard 1.0 M concentration. Non-standard concentrations follow the Nernst equation.',
        },
      ],
      correctExplanation:
        'The reaction quotient is Q = [Zn²⁺]/[Cu²⁺]. Increasing [Cu²⁺] by a factor of 10 decreases Q by 10. In \\Delta E = -\\frac{0.0591}{2}\\log_{10}(1/10) = +0.0295\\text{ V}. The voltage increases by ~0.03 V!',
      relevantFormula: '\\Delta E = -\\frac{0.0591}{2} \\log_{10}\\left(10^{-1}\\right) = +0.0296\\text{ V}',
    },
    relatedConcepts: [
      { id: 'current-electricity', name: "Ohm's Law & Circuit Analysis", subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Lithium-Ion Batteries',
        description: 'Reversible intercalation of Li⁺ ions between graphite anode and transition-metal oxide cathode powers modern smartphones and EVs.',
      },
      {
        title: 'Sacrificial Zinc Anodes on Ships',
        description: 'Zinc blocks bolted to steel ship hulls oxidize preferentially (lower E°), preventing seawater corrosion of iron.',
      },
    ],
  },

  {
    id: 'molecular-geometry',
    title: 'VSEPR Theory & Molecular Geometry',
    subject: 'chemistry',
    gradeLevel: 'Class 11',
    tagline: 'Valence Shell Electron Pair Repulsion determining 3D molecular architecture',
    description:
      'Electron pairs around a central atom repel each other electrostatic forces and adopt spatial arrangements that minimize repulsion. Lone pair–lone pair repulsion is strongest, compressing adjacent bond angles.',
    formulaLaTeX: '\\text{Steric Number (SN)} = \\text{Bonded Atoms} + \\text{Lone Pairs}',
    formulaExplanation:
      'SN = 2: Linear (180°); SN = 3: Trigonal Planar (120°); SN = 4: Tetrahedral (109.5°); SN = 5: Trigonal Bipyramidal; SN = 6: Octahedral (90°). Lone pairs compress bond angles by ~2.5° each.',
    simulationType: 'molecular-geometry',
    variables: [
      {
        id: 'bondedPairs',
        name: 'Bonding Electron Pairs',
        symbol: 'B',
        unit: 'pairs',
        min: 2,
        max: 6,
        step: 1,
        defaultValue: 4,
        description: 'Number of covalent bonding electron domains attached to central atom.',
      },
      {
        id: 'lonePairs',
        name: 'Lone Electron Pairs',
        symbol: 'L',
        unit: 'pairs',
        min: 0,
        max: 3,
        step: 1,
        defaultValue: 0,
        description: 'Non-bonding valence electron domains occupying greater angular volume.',
      },
    ],
    prediction: {
      prompt: 'Water Molecule Bond Angle Riddle',
      scenario:
        'In a water molecule (H₂O), the central oxygen atom is surrounded by 4 electron pairs (2 bonding pairs, 2 lone pairs). Why is its bond angle 104.5° instead of the standard tetrahedral 109.5°?',
      choices: [
        {
          id: 'p1',
          text: 'Hydrogen atoms attract each other, pulling the bond inward.',
          isCorrect: false,
          misconceptionExplanation:
            'Hydrogens possess partial positive charges (\\delta^+) and actually repel each other electrostatically.',
        },
        {
          id: 'p2',
          text: 'Lone pairs are held closer to the oxygen nucleus and exert stronger electrostatic repulsion on bonding pairs.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Oxygen changes its hybridization from sp³ to sp² in liquid state.',
          isCorrect: false,
          misconceptionExplanation:
            'The hybridization remains sp³; repulsion anisotropy causes the angular compression.',
        },
      ],
      correctExplanation:
        'Repulsion order is: Lone Pair–Lone Pair > Lone Pair–Bonding Pair > Bonding Pair–Bonding Pair. The two unshared lone pairs expand, squeezing the H-O-H bond angle down from 109.5° to 104.5°.',
      relevantFormula: '\\angle_{\\text{H-O-H}} = 104.5^\\circ < 109.5^\\circ \\quad (\\text{due to } \\text{LP-LP repulsion})',
    },
    relatedConcepts: [
      { id: 'chemical-bonding', name: 'Chemical Bonding & Hybridization', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Drug Receptor Binding in Medicine',
        description: 'Pharmaceutical molecules must fit into macromolecular enzyme binding pockets with sub-angstrom 3D geometric stereospecificity.',
      },
      {
        title: 'Water Density Anomaly',
        description: 'The 104.5° bent angle creates an open hexagonal ice crystal lattice, making ice less dense than liquid water and allowing aquatic life to survive winter.',
      },
    ],
  },

  // --- BIOLOGY ---
  {
    id: 'photosynthesis',
    title: 'Photosynthesis & Limiting Factors',
    subject: 'biology',
    gradeLevel: 'Class 11',
    tagline: "Blackman's law of limiting factors in light and dark reactions",
    description:
      'Photosynthesis converts radiant solar energy into chemical energy stored in glucose. The overall biochemical rate is governed by Blackman’s Principle of Limiting Factors: the rate is paced by whichever critical factor (Light, CO₂, Temperature) is closest to its minimum.',
    formulaLaTeX: '6\\text{CO}_2 + 6\\text{H}_2\\text{O} + h\\nu \\xrightarrow{\\text{chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2',
    formulaExplanation:
      'Light reactions in the thylakoid membrane generate ATP & NADPH via photolysis of water. Calvin-Benson cycle in the stroma fixes CO₂ into triose phosphate sugars.',
    simulationType: 'photosynthesis',
    variables: [
      {
        id: 'lightIntensity',
        name: 'Light Intensity (PAR)',
        symbol: 'I_{\\text{light}}',
        unit: 'μmol/m²·s',
        min: 0,
        max: 1000,
        step: 25,
        defaultValue: 400,
        description: 'Photosynthetically active radiation driving photosystems II & I.',
      },
      {
        id: 'co2Concentration',
        name: 'Carbon Dioxide Concentration',
        symbol: '[\\text{CO}_2]',
        unit: 'ppm',
        min: 100,
        max: 1200,
        step: 50,
        defaultValue: 400,
        description: 'Substrate for RuBisCO carbon fixation in stroma.',
      },
      {
        id: 'tempC',
        name: 'Chloroplast Temperature',
        symbol: 'T',
        unit: '°C',
        min: 5,
        max: 50,
        step: 1,
        defaultValue: 25,
        description: 'Influences RuBisCO enzymatic reaction rate until thermal denaturation at >42°C.',
      },
    ],
    prediction: {
      prompt: 'Blackman Plateau Dilemma',
      scenario:
        'A greenhouse plant is supplied with dim light (100 μmol/m²·s) and ambient CO₂ (400 ppm). If the CO₂ level is pumped up to 1200 ppm while keeping light dim, what happens to the photosynthetic rate?',
      choices: [
        {
          id: 'p1',
          text: 'Rate increases threefold because carbon is the primary building block of glucose.',
          isCorrect: false,
          misconceptionExplanation:
            'Adding a non-limiting factor has minimal effect when another critical reagent is severely deficient.',
        },
        {
          id: 'p2',
          text: 'Rate plateaus almost immediately because light is the active limiting factor.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Photosynthesis completely shuts down due to CO₂ toxicity.',
          isCorrect: false,
          misconceptionExplanation:
            '1200 ppm is well tolerated; the rate simply cannot exploit the extra carbon without ATP/NADPH from light.',
        },
      ],
      correctExplanation:
        'According to Blackman’s Law of Limiting Factors, when a process depends on several factors, its rate is limited by the pace of the slowest factor. Under low light, the light reactions cannot synthesize enough ATP and NADPH; increasing CO₂ provides no benefit until light intensity is raised.',
      relevantFormula: '\\text{Rate} = \\min\\left( f(I_{\\text{light}}), g([\\text{CO}_2]), h(T) \\right)',
    },
    relatedConcepts: [
      { id: 'enzyme-activity', name: 'Enzyme Kinetics & RuBisCO', subject: 'biology' },
      { id: 'chemical-kinetics', name: 'Chemical Reaction Rates', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Commercial Hydroponic Greenhouses',
        description: 'Growers enrich greenhouse air with CO₂ to ~1,000 ppm only when high-power LED grow lights operate, optimizing crop harvest yields.',
      },
      {
        title: 'C4 and CAM Plant Adaptations',
        description: 'Corn and sugarcane concentrate CO₂ internally around RuBisCO to prevent photorespiration in intense tropical climates.',
      },
    ],
  },

  {
    id: 'dna-replication',
    title: 'DNA Replication Fork Architecture',
    subject: 'biology',
    gradeLevel: 'Class 12',
    tagline: 'Semi-conservative enzymatic synthesis of complementary nucleic acid strands',
    description:
      'DNA replication is semi-conservative and bidirectional. Helicase unwinds the double helix, single-strand binding proteins stabilize template strands, and DNA Polymerase III synthesizes DNA strictly in the 5′ → 3′ direction, yielding continuous leading strand synthesis and discontinuous Okazaki fragment formation on the lagging strand.',
    formulaLaTeX: '5\' \\to 3\' \\text{ directionality}, \\quad \\Delta G_{\\text{hydrolysis}} (\\text{dNTP} \\to \\text{dNMP} + \\text{PP}_i) < 0',
    formulaExplanation:
      'DNA Polymerase requires a free 3′-OH primer terminus. The antiparallel geometry of DNA necessitates discontinuous back-stitching synthesis on the lagging strand.',
    simulationType: 'dna-replication',
    variables: [
      {
        id: 'replicationStep',
        name: 'Replication Stage',
        symbol: 'S',
        unit: 'step',
        min: 1,
        max: 5,
        step: 1,
        defaultValue: 1,
        description: '1: Initiation, 2: Helicase Unwinding, 3: Priming, 4: Elongation, 5: Ligase Sealing.',
      },
      {
        id: 'speed',
        name: 'Enzyme Polymerization Speed',
        symbol: 'v_{\\text{synth}}',
        unit: 'nt/s',
        min: 50,
        max: 1000,
        step: 50,
        defaultValue: 500,
        description: 'Catalytic rate of bacterial DNA Polymerase III (up to 1,000 nucleotides/sec).',
      },
    ],
    prediction: {
      prompt: 'Antiparallel Synthesis Dilemma',
      scenario:
        'Why can’t DNA Polymerase simply synthesize both the leading and lagging strands continuously in the direction of fork movement?',
      choices: [
        {
          id: 'p1',
          text: 'Because cell energy (ATP) would be depleted too rapidly.',
          isCorrect: false,
          misconceptionExplanation:
            'Hydrolysis of incoming dNTPs provides ample thermodynamic driving force regardless of strand geometry.',
        },
        {
          id: 'p2',
          text: 'Because DNA strands are antiparallel, and DNA Polymerase can only add nucleotides to a free 3′-OH end.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Because lagging strands consist of RNA instead of DNA.',
          isCorrect: false,
          misconceptionExplanation:
            'Lagging strands are synthesized as DNA Okazaki fragments initiated by transient RNA primers that are later replaced.',
        },
      ],
      correctExplanation:
        'DNA Polymerase can ONLY catalyze nucleophilic attack of the 3′-OH group onto the alpha-phosphate of incoming dNTPs. Since the template strands run in opposite directions (5′ → 3′ and 3′ → 5′), the lagging strand must be synthesized backward in short Okazaki fragments as new template is exposed.',
      relevantFormula: '5\'\\text{-Template} \\implies 3\'\\text{-OH nucleophilic attack } (5\' \\to 3\' \\text{ synthesis})',
    },
    relatedConcepts: [
      { id: 'enzyme-activity', name: 'Enzyme Catalysis & Polymerases', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Polymerase Chain Reaction (PCR)',
        description: 'Taq polymerase amplifies trace forensic or viral DNA samples through cyclical thermal denaturing, annealing, and extension.',
      },
      {
        title: 'Chemotherapy Topoisomerase Inhibitors',
        description: 'Drugs like doxorubicin and camptothecin trap topoisomerases during cancer cell replication, inducing lethal double-strand DNA breaks.',
      },
    ],
  },

  {
    id: 'enzyme-activity',
    title: 'Enzyme Kinetics & Catalysis',
    subject: 'biology',
    gradeLevel: 'Class 11',
    tagline: 'Michaelis-Menten kinetics, active site conformation, and denaturation',
    description:
      'Enzymes are biological catalysts that accelerate biochemical reactions by stabilizing the transition state and lowering activation energy. Enzyme activity depends on substrate concentration [S], approaching a maximum velocity V_max as active sites saturate, with sharp sensitivities to pH and temperature.',
    formulaLaTeX: 'v = \\frac{V_{\\text{max}} [S]}{K_m + [S]}, \\quad K_m = [S] \\text{ when } v = \\frac{V_{\\text{max}}}{2}',
    formulaExplanation:
      'The Michaelis constant K_m inversely reflects enzyme-substrate affinity. At temperatures > 45°C or extreme pH, hydrogen and ionic bonds disrupt, irreversibly denaturing the tertiary protein structure.',
    simulationType: 'enzyme-activity',
    variables: [
      {
        id: 'substrateConc',
        name: 'Substrate Concentration [S]',
        symbol: '[S]',
        unit: 'mM',
        min: 0,
        max: 50,
        step: 1,
        defaultValue: 10,
        description: 'Availability of ligand molecules to bind active sites.',
      },
      {
        id: 'tempC',
        name: 'Reaction Temperature',
        symbol: 'T',
        unit: '°C',
        min: 10,
        max: 75,
        step: 1,
        defaultValue: 37,
        description: 'Optimal at ~37°C for human enzymes; denatures rapidly above 55°C.',
      },
      {
        id: 'phLevel',
        name: 'Solution pH',
        symbol: '\\text{pH}',
        unit: '',
        min: 1,
        max: 12,
        step: 0.5,
        defaultValue: 7.0,
        description: 'Alters ionization state of catalytic amino acid side chains.',
      },
    ],
    prediction: {
      prompt: 'Enzyme Saturation Prediction',
      scenario:
        'An in vitro enzyme reaction is running near its maximum velocity (v ≈ V_max = 100 μmol/min) at [S] = 40 mM. What happens to the rate if the substrate concentration is doubled to 80 mM?',
      choices: [
        {
          id: 'p1',
          text: 'Rate doubles to ~200 μmol/min due to doubled collision frequency.',
          isCorrect: false,
          misconceptionExplanation:
            'Linear collision scaling only holds at very low substrate concentration ([S] << K_m). At saturation, active sites are the bottleneck.',
        },
        {
          id: 'p2',
          text: 'Rate remains almost unchanged (~102 μmol/min) because nearly all active sites are already occupied.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Rate drops to zero due to substrate inhibition.',
          isCorrect: false,
          misconceptionExplanation:
            'While substrate inhibition exists in rare enzymes, standard Michaelis-Menten kinetics simply plateaus asymptotically at V_max.',
        },
      ],
      correctExplanation:
        'When [S] >> K_m, the term K_m + [S] ≈ [S], so v = \\frac{V_{\\text{max}} [S]}{[S]} = V_{\\text{max}}. The enzyme catalytic turnover rate k_{cat} becomes zero-order with respect to substrate.',
      relevantFormula: '\\lim_{[S] \\to \\infty} v = V_{\\text{max}} \\quad (\\text{zero-order saturation kinetics})',
    },
    relatedConcepts: [
      { id: 'chemical-kinetics', name: 'Chemical Kinetics & Reaction Rates', subject: 'chemistry' },
      { id: 'photosynthesis', name: 'Photosynthesis & RuBisCO', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Penicillin Antibiotic Action',
        description: 'Inactivates bacterial transpeptidase via irreversible suicide inhibition, preventing bacterial cell wall cross-linking.',
      },
      {
        title: 'Industrial Brewing & Detergents',
        description: 'Engineered thermophilic bacterial amylases and proteases clean laundry in hot washing cycles without denaturing.',
      },
    ],
  },

  // --- NEW ADVANCED CONCEPTS ---
  {
    id: 'wave-optics',
    title: "Wave Optics & Young's Double Slit",
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'Wave nature of light, spatial coherence, and interference fringes',
    description:
      'When coherent monochromatic light illuminates two narrow parallel slits separated by distance d, the secondary wavelets overlap and interfere constructively and destructively on a distant screen, producing alternating bright and dark fringes.',
    formulaLaTeX: '\\beta = \\frac{\\lambda D}{d}, \\quad y_m = m \\frac{\\lambda D}{d}, \\quad I = I_0 \\cos^2\\left(\\frac{\\pi d y}{\\lambda D}\\right)',
    formulaExplanation:
      'Fringe width \\beta is directly proportional to wavelength \\lambda and screen distance D, and inversely proportional to slit separation d.',
    simulationType: 'wave-optics',
    variables: [
      {
        id: 'wavelengthNm',
        name: 'Light Wavelength (λ)',
        symbol: '\\lambda',
        unit: 'nm',
        min: 400,
        max: 700,
        step: 25,
        defaultValue: 550,
        description: 'Violet (400nm) to Red (700nm); dictates wavefront spatial frequency.',
      },
      {
        id: 'slitDistanceMm',
        name: 'Slit Separation (d)',
        symbol: 'd',
        unit: 'mm',
        min: 0.15,
        max: 0.8,
        step: 0.05,
        defaultValue: 0.3,
        description: 'Distance between the two coherent line slits.',
      },
      {
        id: 'screenDistanceM',
        name: 'Distance to Screen (D)',
        symbol: 'D',
        unit: 'm',
        min: 0.8,
        max: 2.5,
        step: 0.1,
        defaultValue: 1.5,
        description: 'Optical propagation distance to observation detector.',
      },
    ],
    prediction: {
      prompt: 'Wavelength Interference Shift',
      scenario:
        'A double slit apparatus is illuminated with red laser light (650 nm), producing sharp fringes with width beta. If the laser is switched to violet light (400 nm), what happens to the spacing between fringes?',
      choices: [
        {
          id: 'p1',
          text: 'Fringe width increases because violet photons have higher energy.',
          isCorrect: false,
          misconceptionExplanation:
            'While photon energy E = hc/lambda is higher for violet, fringe spacing depends on spatial wavelength lambda, which is shorter for violet!',
        },
        {
          id: 'p2',
          text: 'Fringe width beta decreases because lambda is smaller: beta = lambda * D / d.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Fringe width remains unchanged because slit separation d did not change.',
          isCorrect: false,
          misconceptionExplanation:
            'Fringe width is directly proportional to wavelength. Changing color changes lambda and thus fringe spacing.',
        },
      ],
      correctExplanation:
        'From \\beta = \\frac{\\lambda D}{d}, fringe spacing is directly proportional to wavelength. Since \\lambda_{\\text{violet}} < \\lambda_{\\text{red}}, the fringes pack closer together.',
      relevantFormula: '\\beta_2 = \\beta_1 \\left(\\frac{\\lambda_2}{\\lambda_1}\\right) = \\beta_1 \\left(\\frac{400}{650}\\right) \\approx 0.615 \\beta_1',
    },
    relatedConcepts: [
      { id: 'ray-optics', name: "Ray Optics & Snell's Law", subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Anti-Reflective Optical Coatings',
        description: 'Quarter-wavelength thin film destructive interference eliminates reflections on camera lenses and eyeglasses.',
      },
      {
        title: 'X-Ray Crystallography',
        description: 'Bragg diffraction of atomic crystal lattices enabled Watson and Crick to deduce the double helix structure of DNA.',
      },
    ],
  },

  {
    id: 'work-energy-power',
    title: 'Work, Energy & Conservation of Mechanical Energy',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Transformation between kinetic and gravitational potential energy',
    description:
      'In an isolated system governed by conservative gravitational forces, the total mechanical energy E = K + U remains strictly constant. Work done by net external forces equals the change in kinetic energy.',
    formulaLaTeX: 'E_{\\text{mech}} = K + U = \\frac{1}{2} m v^2 + m g h = \\text{constant}',
    formulaExplanation:
      'At the highest point, velocity is zero and energy is entirely potential (U = mgh). At the bottom, potential energy converts fully into kinetic energy, reaching peak velocity v = sqrt(2gh).',
    simulationType: 'work-energy',
    variables: [
      {
        id: 'initialHeightM',
        name: 'Ramp Release Height (h₀)',
        symbol: 'h_0',
        unit: 'm',
        min: 2,
        max: 20,
        step: 1,
        defaultValue: 10,
        description: 'Initial elevation establishing the total mechanical energy reservoir.',
      },
      {
        id: 'massKg',
        name: 'Cart Mass (m)',
        symbol: 'm',
        unit: 'kg',
        min: 2,
        max: 40,
        step: 2,
        defaultValue: 10,
        description: 'Total translational mass moving along the conservative track.',
      },
      {
        id: 'frictionWorkPercent',
        name: 'Dissipative Thermal Friction Work',
        symbol: 'W_{\\text{friction}}',
        unit: '%',
        min: 0,
        max: 40,
        step: 5,
        defaultValue: 0,
        description: 'Percent of mechanical energy irreversibly converted to thermal internal energy.',
      },
    ],
    prediction: {
      prompt: 'Roller Coaster Mass Independence',
      scenario:
        'A 50 kg adult and a 20 kg child slide down identical frictionless water slides from the same 15-meter tower. Who reaches the bottom with the higher velocity?',
      choices: [
        {
          id: 'p1',
          text: 'The 50 kg adult, because greater mass possesses more potential energy.',
          isCorrect: false,
          misconceptionExplanation:
            'While the adult has more energy (mgh), they also possess proportionally more inertia (1/2 mv^2), so mass cancels out!',
        },
        {
          id: 'p2',
          text: 'Both reach the bottom with the exact same velocity: v = sqrt(2gh).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'The 20 kg child, because lighter objects experience less drag.',
          isCorrect: false,
          misconceptionExplanation:
            'On an ideal frictionless track, speed is completely independent of mass.',
        },
      ],
      correctExplanation:
        'Equating potential and kinetic energy: m g h = \\frac{1}{2} m v^2. Dividing both sides by m gives v = \\sqrt{2gh}, demonstrating that velocity depends solely on gravity and height, not mass!',
      relevantFormula: 'mgh = \\frac{1}{2}mv^2 \\implies v = \\sqrt{2gh}',
    },
    relatedConcepts: [
      { id: 'newtons-laws', name: "Newton's Second Law & Friction", subject: 'physics' },
      { id: 'projectile-motion', name: 'Projectile Motion', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Hydroelectric Dam Power Plants',
        description: 'Water stored behind Hoover Dam converts potential energy mgh into kinetic energy to spin multi-megawatt electric turbines.',
      },
      {
        title: 'Roller Coaster Engineering',
        description: 'Coasters use motorized chains only for the initial lift hill; all subsequent loops and drops rely on gravitational energy conservation.',
      },
    ],
  },

  {
    id: 'states-of-matter',
    title: 'States of Matter & The Ideal Gas Law',
    subject: 'chemistry',
    gradeLevel: 'Class 11',
    tagline: 'Kinetic molecular theory, pressure-volume isotherms, and temperature',
    description:
      'Gases consist of microscopic particles in continuous, random, elastic motion. The macroscopic state of an ideal gas is defined by the Ideal Gas Equation of State PV = nRT, unifying Boyle’s, Charles’s, and Avogadro’s empirical laws.',
    formulaLaTeX: 'P V = n R T, \\quad P_1 V_1 / T_1 = P_2 V_2 / T_2, \\quad v_{\\text{rms}} = \\sqrt{\\frac{3 R T}{M}}',
    formulaExplanation:
      'Pressure P arises from the momentum impulse imparted by gas molecules colliding against container walls per unit area per second. Compressing volume V doubles collision frequency, doubling pressure.',
    simulationType: 'states-of-matter',
    variables: [
      {
        id: 'temperatureK',
        name: 'Chamber Temperature (T)',
        symbol: 'T',
        unit: 'K',
        min: 150,
        max: 600,
        step: 25,
        defaultValue: 300,
        description: 'Direct measure of the average translational kinetic energy of molecules.',
      },
      {
        id: 'volumeLiters',
        name: 'Piston Cylinder Volume (V)',
        symbol: 'V',
        unit: 'L',
        min: 5,
        max: 30,
        step: 1,
        defaultValue: 15,
        description: 'Physical space available for particle motion.',
      },
      {
        id: 'molesN',
        name: 'Gas Quantity (n)',
        symbol: 'n',
        unit: 'mol',
        min: 0.5,
        max: 3.0,
        step: 0.25,
        defaultValue: 1.0,
        description: 'Number of moles of gas particles inside the sealed cylinder.',
      },
    ],
    prediction: {
      prompt: 'Piston Compression Riddle',
      scenario:
        'A cylinder filled with gas at 1.0 atm is compressed by pushing the piston inward so its volume is cut in half (V -> V/2) while temperature is held constant at 300 K. What happens to the internal gas pressure?',
      choices: [
        {
          id: 'p1',
          text: 'Pressure doubles to 2.0 atm according to Boyle’s Law (P1*V1 = P2*V2).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Pressure drops to 0.5 atm because the gas particles have less room to move.',
          isCorrect: false,
          misconceptionExplanation:
            'Reducing volume crowds particles together, which increases wall collision frequency, raising pressure, not lowering it.',
        },
        {
          id: 'p3',
          text: 'Pressure stays at 1.0 atm because temperature did not change.',
          isCorrect: false,
          misconceptionExplanation:
            'While particle speed did not change (isothermal), particles hit the walls twice as frequently because the distance between walls halved.',
        },
      ],
      correctExplanation:
        'By Boyle’s Law at constant temperature, pressure is inversely proportional to volume: P \\propto 1/V. Halving the volume doubles the wall collision rate per second, exactly doubling pressure: P_2 = 2 P_1 = 2.0 atm.',
      relevantFormula: 'P_1 V_1 = P_2 V_2 \\implies P_2 = P_1 \\left(\\frac{V_1}{V_1 / 2}\\right) = 2 P_1 = 2.0\\text{ atm}',
    },
    relatedConcepts: [
      { id: 'chemical-equilibrium', name: 'Chemical Equilibrium & Le Chatelier', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Scuba Diving Decompression & Boyle Law',
        description: 'Every 10 meters of water depth adds ~1 atm of hydrostatic pressure, compressing gas volume in divers’ lungs and equipment.',
      },
      {
        title: 'Automotive Engine Combustion Stroke',
        description: 'Pistons compress air-fuel mixture 10:1 to raise pressure and temperature before spark ignition.',
      },
    ],
  },

  {
    id: 'chemical-equilibrium',
    title: "Chemical Equilibrium & Le Chatelier's Principle",
    subject: 'chemistry',
    gradeLevel: 'Class 11',
    tagline: 'Dynamic balance between forward and reverse reaction velocities',
    description:
      'A chemical system at equilibrium maintains constant macroscopic concentrations because forward and reverse rates are equal (rf = rb). When a dynamic equilibrium is subjected to an external disturbance (temperature, pressure, concentration), the system shifts to counteract that disturbance.',
    formulaLaTeX: 'K_c = \\frac{[C]^c [D]^d}{[A]^a [B]^b}, \\quad \\Delta G = \\Delta G^\\circ + R T \\ln Q = 0 \\implies \\Delta G^\\circ = -R T \\ln K',
    formulaExplanation:
      'For exothermic reactions, heating shifts equilibrium to the left (absorbing heat). Compressing the volume shifts equilibrium to the side with fewer gas moles.',
    simulationType: 'chemical-equilibrium',
    variables: [
      {
        id: 'temperatureK',
        name: 'Reactor Temperature (T)',
        symbol: 'T',
        unit: 'K',
        min: 400,
        max: 800,
        step: 25,
        defaultValue: 500,
        description: 'Exothermic reactions shift toward reactants when heated.',
      },
      {
        id: 'totalPressureAtm',
        name: 'Total Chamber Pressure (P)',
        symbol: 'P',
        unit: 'atm',
        min: 20,
        max: 250,
        step: 10,
        defaultValue: 100,
        description: 'High pressure favors the side with fewer gas moles (4 moles -> 2 moles).',
      },
      {
        id: 'reactantRatio',
        name: 'Feed Ratio (H₂ : N₂)',
        symbol: 'r_{\\text{feed}}',
        unit: ':1',
        min: 1.0,
        max: 5.0,
        step: 0.5,
        defaultValue: 3.0,
        description: 'Stoichiometric optimal ratio is 3:1.',
      },
    ],
    prediction: {
      prompt: 'Haber Exothermic Dilemma',
      scenario:
        'In the industrial Haber ammonia process: N2(g) + 3H2(g) ⇌ 2NH3(g) (ΔH = -92 kJ/mol), why do chemical plants operate at 450°C rather than room temperature (25°C), even though room temperature favors a much higher equilibrium yield?',
      choices: [
        {
          id: 'p1',
          text: 'Because at room temperature, reaction kinetics are so slow that equilibrium would take years to reach.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Because catalysts only function at high pressure and stop working when cooled.',
          isCorrect: false,
          misconceptionExplanation:
            'Catalysts function across temperatures, but their turnover rate is governed by the Arrhenius equation.',
        },
        {
          id: 'p3',
          text: 'Because nitrogen gas condenses into a liquid below 100°C.',
          isCorrect: false,
          misconceptionExplanation:
            'Nitrogen boils at an extremely low -196°C; it remains a gas at room temperature.',
        },
      ],
      correctExplanation:
        'The Haber dilemma is an engineering trade-off between thermodynamics and kinetics. Low temperature thermodynamically favors NH3 yield, but the strong N≡N triple bond (945 kJ/mol) requires high kinetic energy to break. 450°C provides a practical commercial balance.',
      relevantFormula: 'K_{\\text{thermo}}(25^\\circ\\text{C}) \\gg K_{\\text{thermo}}(450^\\circ\\text{C}), \\quad \\text{but } k_{\\text{kinetic}}(450^\\circ\\text{C}) \\gg k_{\\text{kinetic}}(25^\\circ\\text{C})',
    },
    relatedConcepts: [
      { id: 'chemical-kinetics', name: 'Chemical Kinetics & Reaction Rates', subject: 'chemistry' },
      { id: 'states-of-matter', name: 'States of Matter & Gas Laws', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Global Nitrogen Fertilizer',
        description: 'The Haber-Bosch process feeds roughly half the human population by synthesizing agricultural ammonium nitrate.',
      },
      {
        title: 'Blood pH Homeostasis & Bicarbonate Buffer',
        description: 'CO2 + H2O ⇌ H2CO3 ⇌ H+ + HCO3- dynamically buffers human blood to pH 7.35–7.45.',
      },
    ],
  },

  {
    id: 'human-circulation',
    title: 'Human Circulation & The Cardiac Cycle',
    subject: 'biology',
    gradeLevel: 'Class 11',
    tagline: 'Hemodynamics, ventricular volume, and the Frank-Starling law',
    description:
      'The human heart operates as a synchronized dual-circuit muscular pump. Systemic circulation supplies oxygenated blood to the body, while pulmonary circulation re-oxygenates blood in the lungs. Cardiac output equals heart rate multiplied by ventricular stroke volume.',
    formulaLaTeX: 'CO = HR \\times SV, \\quad SV = EDV - ESV, \\quad MAP = DP + \\frac{1}{3}(SP - DP)',
    formulaExplanation:
      'Frank-Starling law of the heart states that greater ventricular filling during diastole (increased End-Diastolic Volume) stretches myocardial fibers, generating a more forceful systolic contraction.',
    simulationType: 'human-circulation',
    variables: [
      {
        id: 'heartRateBpm',
        name: 'Heart Rate (HR)',
        symbol: 'HR',
        unit: 'BPM',
        min: 50,
        max: 160,
        step: 5,
        defaultValue: 72,
        description: 'Number of cardiac ventricular contraction cycles per minute.',
      },
      {
        id: 'endDiastolicVolumeMl',
        name: 'End-Diastolic Volume (EDV)',
        symbol: 'EDV',
        unit: 'mL',
        min: 90,
        max: 180,
        step: 5,
        defaultValue: 120,
        description: 'Volume of blood in ventricle at the end of diastolic filling.',
      },
      {
        id: 'peripheralResistanceUnit',
        name: 'Total Peripheral Resistance',
        symbol: 'TPR',
        unit: 'PRU',
        min: 0.6,
        max: 1.8,
        step: 0.1,
        defaultValue: 1.0,
        description: 'Vascular resistance to arterial blood flow (vasoconstriction vs vasodilation).',
      },
    ],
    prediction: {
      prompt: 'Athlete Bradycardia Paradox',
      scenario:
        'An endurance marathon runner has a resting heart rate of only 45 BPM, compared to 75 BPM in an average person. How does the athlete maintain a normal resting cardiac output (~5.0 L/min)?',
      choices: [
        {
          id: 'p1',
          text: 'Their tissues consume far less oxygen, so they only require 2.5 L/min.',
          isCorrect: false,
          misconceptionExplanation:
            'Basal metabolic rate is similar; resting oxygen demand requires the same ~5 L/min output.',
        },
        {
          id: 'p2',
          text: 'Their heart has developed physiological cardiac hypertrophy, producing a much larger stroke volume (SV > 110 mL).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Their blood vessels pump blood independently of the heart.',
          isCorrect: false,
          misconceptionExplanation:
            'Blood vessels regulate resistance via vasomotion, but the heart remains the central pump.',
        },
      ],
      correctExplanation:
        'Because CO = HR × SV, an athletic enlarged left ventricle with high contractility ejects ~110 mL per beat. 45 BPM × 111 mL ≈ 5.0 L/min, matching normal metabolic demand at a far lower heart rate.',
      relevantFormula: 'CO = 45\\text{ BPM} \\times 111\\text{ mL} \\approx 5.0\\text{ L/min}',
    },
    relatedConcepts: [
      { id: 'photosynthesis', name: 'Photosynthesis & Limiting Factors', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Hypertension Clinical Diagnostics',
        description: 'Arterial stiffening increases systemic vascular resistance, elevating systolic pressure beyond 140 mmHg and straining ventricular muscle.',
      },
      {
        title: 'Cardiopulmonary Resuscitation (CPR)',
        description: 'Chest compressions artificially compress the thoracic cavity, generating manual stroke volume during cardiac arrest.',
      },
    ],
  },

  {
    id: 'genetics',
    title: 'Mendelian Genetics & Dihybrid Cross',
    subject: 'biology',
    gradeLevel: 'Class 10',
    tagline: "Mendel's laws of segregation and independent assortment",
    description:
      'Gregor Mendel discovered the particulate nature of inheritance. Alleles for distinct traits segregate independently during gamete formation (meiosis). A dihybrid cross between heterozygous parents (RrYy × RrYy) yields the classic 9:3:3:1 phenotypic ratio.',
    formulaLaTeX: 'P(\\text{dominant phenotype}) = \\frac{3}{4}, \\quad P(A \\cap B) = P(A) \\times P(B) = \\frac{3}{4} \\times \\frac{3}{4} = \\frac{9}{16}',
    formulaExplanation:
      'Because genes located on non-homologous chromosomes sort independently into gametes, the probabilities of individual traits multiply.',
    simulationType: 'genetics',
    variables: [
      {
        id: 'seedShapeDominance',
        name: 'Seed Texture Alleles',
        symbol: 'R / r',
        unit: '',
        min: 0,
        max: 2,
        step: 1,
        defaultValue: 1,
        description: '0: rr (wrinkled), 1: Rr (heterozygous round), 2: RR (homozygous round).',
      },
      {
        id: 'seedColorDominance',
        name: 'Seed Color Alleles',
        symbol: 'Y / y',
        unit: '',
        min: 0,
        max: 2,
        step: 1,
        defaultValue: 1,
        description: '0: yy (green), 1: Yy (heterozygous yellow), 2: YY (homozygous yellow).',
      },
    ],
    prediction: {
      prompt: 'Independent Assortment Probability',
      scenario:
        'In a pea dihybrid cross RrYy × RrYy, what is the exact mathematical probability that an offspring will exhibit BOTH recessive traits (wrinkled and green, rryy)?',
      choices: [
        {
          id: 'p1',
          text: '1/16 (6.25%), because P(rr) = 1/4 and P(yy) = 1/4, and (1/4) * (1/4) = 1/16.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: '1/4 (25%), because there are four possible phenotypic combinations.',
          isCorrect: false,
          misconceptionExplanation:
            'The four phenotypes are not equally probable; dominant alleles appear much more frequently in heterozygotes.',
        },
        {
          id: 'p3',
          text: '3/16 (18.75%), corresponding to the minor term in 9:3:3:1.',
          isCorrect: false,
          misconceptionExplanation:
            '3/16 is the probability of having ONE dominant and ONE recessive trait (e.g. Round Green or Wrinkled Yellow). Double recessive is 1/16.',
        },
      ],
      correctExplanation:
        'By the Law of Independent Assortment, the events are independent. P(wrinkled) = 1/4. P(green) = 1/4. The joint probability P(wrinkled AND green) = 1/4 × 1/4 = 1/16.',
      relevantFormula: 'P(rr \\cap yy) = P(rr) \\times P(yy) = \\frac{1}{4} \\times \\frac{1}{4} = \\frac{1}{16} = 0.0625',
    },
    relatedConcepts: [
      { id: 'dna-replication', name: 'DNA Replication Fork Architecture', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Agricultural Crop Hybridization',
        description: 'Plant breeders select for multi-gene disease resistance and high drought tolerance using Mendelian segregation matrices.',
      },
      {
        title: 'Genetic Counseling & Recessive Disorders',
        description: 'Calculates probability of carrier parents passing on cystic fibrosis or sickle cell anemia alleles to offspring.',
      },
    ],
  },
  // --- ADDITIONAL ADVANCED CONCEPTS ---
  {
    id: 'electrostatics',
    title: 'Electrostatics & Coulomb\'s Law',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'Inverse-square electrostatic interactions and vector superposition',
    description:
      'Charged particles exert forces on one another that are directly proportional to the product of their charges and inversely proportional to the square of the distance between them. Like charges repel, opposite charges attract.',
    formulaLaTeX: 'F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{|q_1 q_2|}{r^2}, \\quad \\vec{E} = \\frac{\\vec{F}}{q_0}',
    formulaExplanation:
      'The electrostatic force F acts along the line joining the charges. The permittivity of free space \\varepsilon_0 establishes the strength of field interactions in vacuum (k \\approx 8.99 \\times 10^9\\,\\text{N}\\cdot\\text{m}^2/\\text{C}^2).',
    simulationType: 'electrostatics',
    variables: [
      {
        id: 'charge1',
        name: 'Charge 1 (q₁)',
        symbol: 'q_1',
        unit: 'μC',
        min: -10,
        max: 10,
        step: 1,
        defaultValue: 5,
        description: 'Magnitude and sign of source charge 1.',
      },
      {
        id: 'charge2',
        name: 'Charge 2 (q₂)',
        symbol: 'q_2',
        unit: 'μC',
        min: -10,
        max: 10,
        step: 1,
        defaultValue: -5,
        description: 'Magnitude and sign of source charge 2.',
      },
      {
        id: 'distanceCm',
        name: 'Separation Distance',
        symbol: 'r',
        unit: 'cm',
        min: 5,
        max: 40,
        step: 1,
        defaultValue: 20,
        description: 'Distance separating charge centers.',
      },
    ],
    prediction: {
      prompt: 'Distance Halving vs Electrostatic Force',
      scenario:
        'Two point charges of +4 μC and -4 μC are separated by 20 cm, experiencing an attractive force F. If the separation distance is reduced to 10 cm, what will the new force be?',
      choices: [
        {
          id: 'p1',
          text: 'The force quadruples (4F) because force is inversely proportional to r squared.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'The force doubles (2F) because distance was halved.',
          isCorrect: false,
          misconceptionExplanation:
            'This assumes a linear relationship F ∝ 1/r. Coulomb\'s law obeys an inverse-square relationship F ∝ 1/r², so halving distance scales force by 1/(1/2)² = 4.',
        },
        {
          id: 'p3',
          text: 'The force remains constant because the charge magnitudes did not change.',
          isCorrect: false,
          misconceptionExplanation:
            'Force depends strictly on separation distance as well as charges.',
        },
      ],
      correctExplanation:
        'Because F = k|q1 q2|/r², dividing r by 2 results in F_new = k|q1 q2| / (r/2)² = 4 × (k|q1 q2| / r²) = 4F.',
      relevantFormula: 'F_{\\text{new}} = \\frac{k |q_1 q_2|}{\\left(\\frac{r}{2}\\right)^2} = 4 \\cdot \\frac{k |q_1 q_2|}{r^2} = 4F',
    },
    relatedConcepts: [
      { id: 'current-electricity', name: 'Current Electricity & Ohm\'s Law', subject: 'physics' },
      { id: 'gravitation', name: 'Universal Gravitation & Keplerian Orbits', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Laser Printers & Photocopying',
        description: 'Electrostatic drums attract charged toner particles to specific regions exposed by laser beams.',
      },
      {
        title: 'Electrostatic Precipitators in Smoke Stacks',
        description: 'Ionizing grids charge soot and fly-ash particles, which are then collected on oppositely charged plates.',
      },
    ],
  },
  {
    id: 'thermodynamics-carnot',
    title: 'Thermodynamics & The Carnot Heat Engine',
    subject: 'physics',
    gradeLevel: 'Class 11',
    tagline: 'Second law of thermodynamics, reversible cycles, and theoretical thermal efficiency',
    description:
      'The Carnot cycle consists of two isothermal processes and two adiabatic processes. It sets the absolute maximum theoretical efficiency that any heat engine operating between two temperatures can ever achieve.',
    formulaLaTeX: '\\eta_{\\text{Carnot}} = 1 - \\frac{T_C}{T_H} = \\frac{W_{\\text{net}}}{Q_H}',
    formulaExplanation:
      'No engine can be 100% efficient because T_C cannot reach absolute zero (0 K). The efficiency depends exclusively on the absolute temperatures in Kelvin of the hot source T_H and cold sink T_C.',
    simulationType: 'thermodynamics-carnot',
    variables: [
      {
        id: 'hotReservoirTempK',
        name: 'Hot Reservoir Temperature (T_H)',
        symbol: 'T_H',
        unit: 'K',
        min: 400,
        max: 1000,
        step: 25,
        defaultValue: 650,
        description: 'Absolute temperature of combustion / heat source.',
      },
      {
        id: 'coldReservoirTempK',
        name: 'Cold Reservoir Temperature (T_C)',
        symbol: 'T_C',
        unit: 'K',
        min: 200,
        max: 380,
        step: 10,
        defaultValue: 300,
        description: 'Absolute temperature of exhaust sink / cooling tower.',
      },
      {
        id: 'compressionRatio',
        name: 'Compression Ratio',
        symbol: 'r_c',
        unit: '',
        min: 2,
        max: 8,
        step: 0.5,
        defaultValue: 4,
        description: 'Ratio of maximum to minimum cylinder volume.',
      },
    ],
    prediction: {
      prompt: 'Thermal Efficiency Upper Limit',
      scenario:
        'A power plant operates between a steam boiler at 600 K and river cooling water at 300 K. An inventor claims their new prototype converts 65% of boiler heat into useful electricity without auxiliary fuel. Is this physically possible?',
      choices: [
        {
          id: 'p1',
          text: 'No, because the maximum theoretical Carnot efficiency is 1 - (300/600) = 50%.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Yes, with superior superconducting materials and zero friction, efficiency can exceed 60%.',
          isCorrect: false,
          misconceptionExplanation:
            'Carnot efficiency is set by the Second Law of Thermodynamics (entropy conservation). Eliminating mechanical friction cannot bypass the fundamental thermodynamic temperature ratio limit.',
        },
        {
          id: 'p3',
          text: 'Yes, because 65% is well below 100%.',
          isCorrect: false,
          misconceptionExplanation:
            'Even though it is under 100%, the Carnot limit between these specific temperatures is strictly 50%. Any higher violates the Second Law.',
        },
      ],
      correctExplanation:
        'The Carnot efficiency η_max = 1 - (T_C / T_H) = 1 - (300 / 600) = 0.50 (50%). Any real heat engine must have an efficiency strictly less than or equal to 50%. A claim of 65% violates the Second Law of Thermodynamics.',
      relevantFormula: '\\eta_{\\text{max}} = 1 - \\frac{300\\,\\text{K}}{600\\,\\text{K}} = 0.50\\,(50\\%)',
    },
    relatedConcepts: [
      { id: 'states-of-matter', name: 'States of Matter & Ideal Gas Laws', subject: 'chemistry' },
      { id: 'work-energy-power', name: 'Work, Energy & Power Dynamics', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Thermal & Nuclear Power Plants',
        description: 'Superheating steam to high temperatures (580°C / 853 K) maximizes electricity generation efficiency before condenser cooling.',
      },
      {
        title: 'Refrigerators & Heat Pumps',
        description: 'Reversing the Carnot cycle pumps heat against the natural thermal gradient from cold interior to warm room air.',
      },
    ],
  },
  {
    id: 'atomic-structure',
    title: 'Atomic Structure & Bohr Energy Quantization',
    subject: 'chemistry',
    gradeLevel: 'Class 11',
    tagline: 'Quantized electron orbits, Rydberg photon emissions, and spectral lines',
    description:
      'Niels Bohr postulated that electrons in atoms occupy discrete, non-radiating stationary orbits with quantized angular momentum. Photons are emitted or absorbed only when electrons jump between energy levels.',
    formulaLaTeX: 'E_n = -\\frac{13.6\\,Z^2}{n^2}\\,\\text{eV}, \\quad \\Delta E = h\\nu = \\frac{hc}{\\lambda} = R_H Z^2 \\left( \\frac{1}{n_1^2} - \\frac{1}{n_2^2} \\right)',
    formulaExplanation:
      'The principal quantum number n defines orbital energy. Transitions dropping to n=1 emit ultraviolet photons (Lyman series); transitions dropping to n=2 emit visible light (Balmer series).',
    simulationType: 'atomic-structure',
    variables: [
      {
        id: 'initialEnergyLevelN',
        name: 'Initial Orbital (n_initial)',
        symbol: 'n_i',
        unit: '',
        min: 1,
        max: 5,
        step: 1,
        defaultValue: 3,
        description: 'Starting electron energy level.',
      },
      {
        id: 'targetEnergyLevelN',
        name: 'Target Orbital (n_target)',
        symbol: 'n_f',
        unit: '',
        min: 1,
        max: 5,
        step: 1,
        defaultValue: 2,
        description: 'Destination electron energy level.',
      },
      {
        id: 'atomicNumberZ',
        name: 'Atomic Number (Z)',
        symbol: 'Z',
        unit: '',
        min: 1,
        max: 3,
        step: 1,
        defaultValue: 1,
        description: 'Nuclear charge (1 = H, 2 = He+, 3 = Li2+).',
      },
    ],
    prediction: {
      prompt: 'Visible Hydrogen Spectral Line',
      scenario:
        'In a hydrogen atom (Z=1), an electron falls from orbit n=3 to orbit n=2. What kind of photon is emitted?',
      choices: [
        {
          id: 'p1',
          text: 'Red visible photon (H-alpha line at ~656 nm, Balmer Series).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'High-energy ultraviolet photon (Lyman Series).',
          isCorrect: false,
          misconceptionExplanation:
            'Lyman series transitions terminate on n=1. Transitions ending on n=2 fall into the visible spectrum (Balmer series).',
        },
        {
          id: 'p3',
          text: 'Infrared photon with zero visible coloration.',
          isCorrect: false,
          misconceptionExplanation:
            'Transitions terminating on n=3 (Paschen series) produce infrared, but transitions to n=2 produce visible photons.',
        },
      ],
      correctExplanation:
        'For n=3 to n=2: ΔE = -1.51 eV - (-3.40 eV) = 1.89 eV. Wavelength λ = 1240 / 1.89 ≈ 656 nm, which produces the prominent crimson-red H-alpha spectral line of hydrogen.',
      relevantFormula: '\\Delta E = 13.6 \\left( \\frac{1}{2^2} - \\frac{1}{3^2} \\right) = 13.6 \\times \\frac{5}{36} \\approx 1.89\\,\\text{eV} \\implies \\lambda \\approx 656\\,\\text{nm}',
    },
    relatedConcepts: [
      { id: 'wave-optics', name: 'Wave Optics & Interference Phenomena', subject: 'physics' },
      { id: 'molecular-geometry', name: 'Molecular Geometry & VSEPR Theory', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Astronomical Stellar Spectroscopy',
        description: 'Telescopes identify elemental composition and radial velocity of distant stars by analyzing absorption and emission lines in starlight.',
      },
      {
        title: 'Fluorescent & Neon Gas Discharge Lighting',
        description: 'Electrical currents excite gas atoms to higher states; their cascade back down emits characteristic vibrant colors.',
      },
    ],
  },
  {
    id: 'nervous-system',
    title: 'Nervous System & Action Potentials',
    subject: 'biology',
    gradeLevel: 'Class 11',
    tagline: 'Electrochemical signaling, voltage-gated ion channels, and saltatory conduction',
    description:
      'Neurons transmit rapid electrical signals along their axons via action potentials. When depolarizing stimuli reach the threshold (-55 mV), voltage-gated sodium channels open in an all-or-nothing regenerative cascade.',
    formulaLaTeX: 'V_m = \\frac{RT}{F} \\ln \\left( \\frac{P_{\\text{K}}[\\text{K}^+]_o + P_{\\text{Na}}[\\text{Na}^+]_o}{P_{\\text{K}}[\\text{K}^+]_i + P_{\\text{Na}}[\\text{Na}^+]_i} \\right)',
    formulaExplanation:
      'The Goldman-Hodgkin-Katz equation calculates membrane potential based on relative ionic permeabilities (P_K, P_Na) and intra/extracellular ion concentrations. In resting state P_K >> P_Na; during action potential spike P_Na >> P_K.',
    simulationType: 'nervous-system',
    variables: [
      {
        id: 'stimulusIntensityMv',
        name: 'Stimulus Intensity',
        symbol: '\\Delta V',
        unit: 'mV',
        min: 0,
        max: 40,
        step: 2,
        defaultValue: 25,
        description: 'Excitatory post-synaptic potential amplitude.',
      },
      {
        id: 'myelinationPercent',
        name: 'Myelination Degree',
        symbol: 'M',
        unit: '%',
        min: 0,
        max: 100,
        step: 10,
        defaultValue: 80,
        description: 'Insulating myelin sheath coverage along axon fiber.',
      },
      {
        id: 'extracellularNaMmol',
        name: 'Extracellular [Na⁺]',
        symbol: '[\\text{Na}^+]_o',
        unit: 'mmol/L',
        min: 100,
        max: 180,
        step: 5,
        defaultValue: 145,
        description: 'Concentration of sodium ions outside the membrane.',
      },
    ],
    prediction: {
      prompt: 'All-or-Nothing Principle in Neurons',
      scenario:
        'A neuron has a resting potential of -70 mV and a threshold of -55 mV. Stimulus A depolarizes the axon hillock by +10 mV. Stimulus B depolarizes it by +30 mV. What occurs in each scenario?',
      choices: [
        {
          id: 'p1',
          text: 'Stimulus A produces no action potential (subthreshold); Stimulus B produces a complete, full-sized action potential spike.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Stimulus A produces a small action potential; Stimulus B produces a spike 3 times larger in amplitude.',
          isCorrect: false,
          misconceptionExplanation:
            'Action potentials do not scale in height with stimulus intensity! They are "all-or-nothing". If threshold is reached, amplitude is always maximal; stimulus strength is encoded by frequency of spikes, not height.',
        },
        {
          id: 'p3',
          text: 'Both stimuli trigger action potentials because any positive voltage triggers channel opening.',
          isCorrect: false,
          misconceptionExplanation:
            'A subthreshold depolarization (-70 + 10 = -60 mV) fails to open sufficient voltage-gated Na+ channels and dissipates passively.',
        },
      ],
      correctExplanation:
        'The All-or-Nothing Law dictates that if depolarization reaches -55 mV (threshold), an identical full action potential fires. Stimulus A brings potential to -60 mV (subthreshold, no fire). Stimulus B reaches -40 mV (suprathreshold, fires full action potential).',
      relevantFormula: 'V_{\\text{rest}} + \\Delta V \\ge V_{\\text{threshold}} \\implies -70 + 30 = -40\\,\\text{mV} > -55\\,\\text{mV}',
    },
    relatedConcepts: [
      { id: 'current-electricity', name: 'Current Electricity & Ohm\'s Law', subject: 'physics' },
      { id: 'human-circulation', name: 'Human Circulation & Hemodynamics', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Local Anesthetics (e.g. Lidocaine)',
        description: 'Reversibly block voltage-gated Na⁺ channels in sensory neurons, halting pain signal transmission to the brain.',
      },
      {
        title: 'Multiple Sclerosis Pathology',
        description: 'Autoimmune destruction of myelin causes leakage of current and failure of saltatory conduction along motor nerves.',
      },
    ],
  },
  {
    id: 'cell-osmosis',
    title: 'Cell Structure & Osmotic Transport',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Water potential, semipermeable lipid bilayers, and cellular turgor dynamics',
    description:
      'Osmosis is the net passive diffusion of water molecules from a region of higher water potential (lower solute concentration) to lower water potential (higher solute concentration) across a selectively permeable membrane.',
    formulaLaTeX: '\\Psi_w = \\Psi_s + \\Psi_p, \\quad \\Pi = iCRT',
    formulaExplanation:
      'Total water potential \\Psi_w comprises solute potential \\Psi_s (always negative) and pressure potential \\Psi_p. In plant cells, the rigid cell wall exerts positive turgor pressure preventing lysis in hypotonic solutions.',
    simulationType: 'cell-osmosis',
    variables: [
      {
        id: 'externalSoluteConc',
        name: 'External Saline Conc',
        symbol: 'C_o',
        unit: '%',
        min: 0.1,
        max: 3.0,
        step: 0.1,
        defaultValue: 0.9,
        description: 'Solute concentration of ambient beaker solution (0.9% is isotonic).',
      },
      {
        id: 'temperatureC',
        name: 'Incubation Temp',
        symbol: 'T',
        unit: '°C',
        min: 10,
        max: 45,
        step: 1,
        defaultValue: 25,
        description: 'Thermal energy driving kinetic diffusion velocity.',
      },
    ],
    prediction: {
      prompt: 'Red Blood Cells in Pure Distilled Water',
      scenario:
        'Human red blood cells (internal osmolarity ~0.9% saline) are placed into a beaker of pure distilled water (0.0% solute). What happens to the cells?',
      choices: [
        {
          id: 'p1',
          text: 'Water rushes into the cells via endosmosis, causing them to swell and burst (hemolysis).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Water leaves the cells, causing them to shrivel into spiky shapes (crenation).',
          isCorrect: false,
          misconceptionExplanation:
            'Crenation occurs when cells are placed in hypertonic (high solute) environments, not pure water.',
        },
        {
          id: 'p3',
          text: 'The cells swell until internal wall pressure balances osmotic influx, becoming turgid.',
          isCorrect: false,
          misconceptionExplanation:
            'Animal cells lack a rigid cellulose cell wall! Unlike plant cells, red blood cells cannot resist high osmotic pressure and will burst (lyse).',
        },
      ],
      correctExplanation:
        'Pure water has zero solute and maximal water potential (0 MPa). Because red blood cells lack a rigid cellulose wall to generate counteractive pressure potential (Ψ_p), the relentless osmotic influx stretches the lipid membrane beyond its elastic limit, causing lysis.',
      relevantFormula: '\\Psi_{w,\\text{external}} = 0 > \\Psi_{w,\\text{cell}} \\implies \\text{Net Inflow into Cell} \\to \\text{Cell Lysis}',
    },
    relatedConcepts: [
      { id: 'states-of-matter', name: 'States of Matter & Ideal Gas Laws', subject: 'chemistry' },
      { id: 'photosynthesis', name: 'Photosynthetic Limiting Factors', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Intravenous (IV) Saline Infusions',
        description: 'Hospitals infuse 0.9% sterile saline rather than pure water to maintain isotonic osmolarity and prevent erythrocyte hemolysis.',
      },
      {
        title: 'Food Preservation via Salting and Pickling',
        description: 'High salt or sugar concentrations draw water out of bacterial and fungal cells by exosmosis, arresting spoilage.',
      },
    ],
  },

  // ==========================================
  // NCERT CLASS 9 PHYSICS COMPLETE SYLLABUS
  // ==========================================

  // --- CHAPTER: MOTION ---
  {
    id: 'ncert9-motion-distance-displacement',
    title: 'Describing Motion: Distance vs Displacement',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Scalar path length vs vector shortest distance between initial and final positions',
    description:
      'Motion is the change in position of an object with time relative to a reference point (origin). Distance is the actual total path length traversed (scalar, always positive), while displacement is the shortest straight-line distance from initial to final position directed along a vector (can be positive, negative, or zero).',
    formulaLaTeX: 's = \\sum |\\Delta x_i|, \\quad \\vec{d} = \\vec{x}_{\\text{final}} - \\vec{x}_{\\text{initial}}, \\quad |\\vec{d}| \\le s',
    formulaExplanation:
      'Displacement magnitude is equal to distance only along a unidirectional straight-line path. For any returning or curved journey (such as completing one circular lap), displacement is zero while distance is non-zero (2πr).',
    simulationType: 'projectile-motion',
    variables: [
      {
        id: 'forwardPathM',
        name: 'Forward Distance Traversed',
        symbol: 'x_1',
        unit: 'm',
        min: 10,
        max: 100,
        step: 5,
        defaultValue: 60,
        description: 'Linear forward path length along the reference coordinate.',
      },
      {
        id: 'returnPathM',
        name: 'Return Path Distance',
        symbol: 'x_2',
        unit: 'm',
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 20,
        description: 'Path length traversed back towards the starting point.',
      },
    ],
    prediction: {
      prompt: 'Conceptual Prediction: A Farmer Walking Along a Square Field',
      scenario:
        'A farmer moves along the boundary of a square field of side 10 m in 40 seconds. What will be the magnitude of displacement of the farmer at the end of 2 minutes 20 seconds (140 s) from his initial position?',
      choices: [
        {
          id: 'p1',
          text: '140 m, because distance and displacement are always equal in uniform walking.',
          isCorrect: false,
          misconceptionExplanation: '140 m is the total odometer distance walked, not the shortest vector distance from the start.',
        },
        {
          id: 'p2',
          text: '14.14 m (10√2 m), because the farmer completes 3.5 rounds and lands at the diagonally opposite corner.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Zero, because completing rounds always cancels all motion completely.',
          isCorrect: false,
          misconceptionExplanation: 'Displacement is zero only for integer full rounds. 140 s / 40 s = 3.5 rounds, leaving him at the opposite corner.',
        },
      ],
      correctExplanation:
        'In 140 s, the farmer completes 140 / 40 = 3.5 full laps around the 10 m × 10 m square. After 3 full rounds he is back at origin A; in the remaining 0.5 round he walks two sides (20 m) to reach opposite vertex C. By Pythagoras theorem, displacement = √(10² + 10²) = 10√2 ≈ 14.14 m.',
      relevantFormula: '|\\vec{d}| = \\sqrt{L^2 + L^2} = L\\sqrt{2} = 10\\sqrt{2} \\approx 14.14\\text{ m}',
    },
    relatedConcepts: [
      { id: 'ncert9-uniform-motion-velocity', name: 'Uniform Motion & Velocity', subject: 'physics' },
      { id: 'ncert9-acceleration-kinematics', name: 'Acceleration in Kinematics', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Vehicle Odometer vs GPS Navigation',
        description: 'The dashboard odometer logs scalar wheel rotation distance, while satellite GPS measures straight-line displacement coordinates.',
      },
      {
        title: 'Athletic Track Races',
        description: 'In a 400 m oval race starting and ending on the same line, the distance run is 400 m, but net displacement is exactly 0 m.',
      },
      {
        title: 'Aviation Flight Planning',
        description: 'Aircraft flight paths calculate great-circle displacement vectors to minimize fuel consumption against jet stream headwinds.',
      },
    ],
  },
  {
    id: 'ncert9-uniform-motion-velocity',
    title: 'Uniform vs Non-Uniform Motion, Speed & Velocity',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Equal distances in equal time intervals, and speed with directional orientation',
    description:
      'An object is in uniform motion when it covers equal distances in equal intervals of time along a straight line, no matter how small these time intervals may be. Velocity is the speed of an object moving in a definite direction (rate of displacement). Average speed is total distance divided by total time, whereas average velocity is (initial + final velocity)/2 for uniformly accelerated motion.',
    formulaLaTeX: 'v_{\\text{avg}} = \\frac{\\text{Total Distance}}{\\text{Total Time}} = \\frac{s}{t}, \\quad \\vec{v}_{\\text{avg}} = \\frac{\\text{Net Displacement}}{\\text{Total Time}} = \\frac{\\vec{d}}{t}, \\quad v_{\\text{avg}} = \\frac{u + v}{2}',
    formulaExplanation:
      'Speed has magnitude only (m/s). Velocity specifies both magnitude and direction. Velocity changes if speed changes, direction changes, or both change simultaneously.',
    simulationType: 'projectile-motion',
    variables: [
      {
        id: 'distanceD1',
        name: 'Segment 1 Distance',
        symbol: 's_1',
        unit: 'm',
        min: 10,
        max: 100,
        step: 5,
        defaultValue: 30,
        description: 'Distance covered in first stage of motion.',
      },
      {
        id: 'timeT1',
        name: 'Segment 1 Duration',
        symbol: 't_1',
        unit: 's',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 2,
        description: 'Time elapsed during first stage.',
      },
      {
        id: 'distanceD2',
        name: 'Segment 2 Distance',
        symbol: 's_2',
        unit: 'm',
        min: 10,
        max: 100,
        step: 5,
        defaultValue: 30,
        description: 'Distance covered in second stage.',
      },
      {
        id: 'timeT2',
        name: 'Segment 2 Duration',
        symbol: 't_2',
        unit: 's',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 4,
        description: 'Time elapsed during second stage.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: Average Speed for a Return Journey',
      scenario:
        'Abdul drives to school at an average speed of 20 km/h. On his return trip along the same route, there is less traffic and the average speed is 30 km/h. What is his average speed for the entire round trip?',
      choices: [
        {
          id: 'p1',
          text: '25 km/h, the simple arithmetic mean of (20 + 30) / 2.',
          isCorrect: false,
          misconceptionExplanation: 'Arithmetic average fails because he spent more time driving at the slower speed than at the faster speed.',
        },
        {
          id: 'p2',
          text: '24 km/h, calculated using harmonic mean of equal distance segments.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Zero, because he returned to his starting point.',
          isCorrect: false,
          misconceptionExplanation: 'Average VELOCITY is zero for a round trip, but average SPEED is total distance / total time (> 0).',
        },
      ],
      correctExplanation:
        'Let distance each way be s. Time to school t₁ = s / 20. Return time t₂ = s / 30. Total distance = 2s. Total time = s/20 + s/30 = 5s / 60 = s / 12. Average speed = Total Distance / Total Time = 2s / (s/12) = 24 km/h.',
      relevantFormula: 'v_{\\text{avg}} = \\frac{2 v_1 v_2}{v_1 + v_2} = \\frac{2 \\times 20 \\times 30}{20 + 30} = \\frac{1200}{50} = 24\\text{ km/h}',
    },
    relatedConcepts: [
      { id: 'ncert9-motion-distance-displacement', name: 'Distance vs Displacement', subject: 'physics' },
      { id: 'ncert9-acceleration-kinematics', name: 'Acceleration in Kinematics', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Highway Cruise Control',
        description: 'Cruise control computers throttle fuel delivery to maintain constant velocity and zero acceleration on flat freeways.',
      },
      {
        title: 'Radar Gun Traffic Enforcement',
        description: 'Doppler radar calculates instantaneous velocity from microwave frequency shifts reflected off approaching automobiles.',
      },
      {
        title: 'Tsunami Wave Tracking',
        description: 'Oceanographers track seismic sea wave velocity (v = √(gd)) across deep ocean trenches to issue coastal evacuation warnings.',
      },
    ],
  },
  {
    id: 'ncert9-acceleration-kinematics',
    title: 'Rate of Change of Velocity: Acceleration & Deceleration',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Non-uniform velocity changes per unit time, braking deceleration and free-fall',
    description:
      'Acceleration is the measure of the rate of change of velocity of an object per unit time: a = (v - u) / t. If velocity increases with time, acceleration is positive (directed along motion). If velocity decreases (e.g. applying car brakes), acceleration is negative, termed deceleration or retardation. Uniform acceleration occurs when velocity changes by equal amounts in equal intervals of time (e.g. free fall under gravity).',
    formulaLaTeX: 'a = \\frac{v - u}{t}, \\quad \\text{SI Unit: m/s}^2, \\quad \\text{Retardation} = -a',
    formulaExplanation:
      'Where u is initial velocity at t = 0, v is final velocity at time t, and a is constant acceleration. Negative acceleration indicates force opposing velocity.',
    simulationType: 'newtons-laws',
    variables: [
      {
        id: 'initialVelU',
        name: 'Initial Velocity (u)',
        symbol: 'u',
        unit: 'm/s',
        min: 0,
        max: 40,
        step: 2,
        defaultValue: 0,
        description: 'Starting speed of the vehicle.',
      },
      {
        id: 'finalVelV',
        name: 'Final Velocity (v)',
        symbol: 'v',
        unit: 'm/s',
        min: 0,
        max: 50,
        step: 2,
        defaultValue: 20,
        description: 'Velocity reached after acceleration interval.',
      },
      {
        id: 'durationT',
        name: 'Time Elapsed (t)',
        symbol: 't',
        unit: 's',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 5,
        description: 'Time duration of the acceleration event.',
      },
    ],
    prediction: {
      prompt: 'NCERT In-Text Check: Bus Braking Retardation',
      scenario:
        'A bus decreases its speed from 80 km/h to 60 km/h in 5 seconds. What is the acceleration of the bus in SI units?',
      choices: [
        {
          id: 'p1',
          text: '-4.0 m/s², because (60 - 80) / 5 = -4.',
          isCorrect: false,
          misconceptionExplanation: 'You must convert km/h to m/s before dividing by seconds! 80 km/h ≠ 80 m/s.',
        },
        {
          id: 'p2',
          text: '-1.11 m/s² (or retardation of +1.11 m/s²).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: '+1.11 m/s², because speed values are always positive.',
          isCorrect: false,
          misconceptionExplanation: 'Acceleration has a negative sign because final velocity is smaller than initial velocity (braking).',
        },
      ],
      correctExplanation:
        'Convert to m/s by multiplying by 5/18: u = 80 × (5/18) = 22.22 m/s. Final v = 60 × (5/18) = 16.67 m/s. Acceleration a = (v - u) / t = (16.67 - 22.22) / 5 = -5.55 / 5 = -1.11 m/s².',
      relevantFormula: 'a = \\frac{(60 - 80) \\times \\frac{5}{18}}{5} = \\frac{-20 \\times 5}{90} = -1.11\\text{ m/s}^2',
    },
    relatedConcepts: [
      { id: 'ncert9-uniform-motion-velocity', name: 'Uniform Motion & Velocity', subject: 'physics' },
      { id: 'ncert9-equations-of-motion', name: 'Equations of Motion', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Emergency Braking in Automobiles (ABS)',
        description: 'Anti-lock braking systems modulate caliper pressure to achieve maximum safe deceleration (~8 m/s²) without wheel lockup.',
      },
      {
        title: 'Free Fall in Physics',
        description: 'Any body dropped near Earth accelerates downwards at constant g = 9.8 m/s² regardless of its mass in vacuum.',
      },
      {
        title: 'Fighter Jet Catapult Launch',
        description: 'Aircraft carrier steam catapults accelerate jets from 0 to 75 m/s in 2.5 seconds, subjecting pilots to over 3g of acceleration.',
      },
    ],
  },
  {
    id: 'ncert9-equations-of-motion',
    title: 'The Three Kinematic Equations of Motion',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Mathematical relations uniting initial velocity, final velocity, acceleration, time, and distance',
    description:
      'For an object moving with uniform linear acceleration a, three foundational kinematic equations connect initial velocity u, final velocity v, acceleration a, time t, and distance s: (1) v = u + at (Velocity-time relation), (2) s = ut + ½at² (Position-time relation), (3) 2as = v² - u² (Position-velocity relation). These equations form the bedrock of classical Newtonian kinematics.',
    formulaLaTeX: 'v = u + at, \\quad s = ut + \\frac{1}{2}at^2, \\quad v^2 = u^2 + 2as',
    formulaExplanation:
      'Derived from velocity-time graphs where slope = a and area under v-t graph = distance s = Area of rectangle (ut) + Area of triangle (½ × t × at).',
    simulationType: 'projectile-motion',
    variables: [
      {
        id: 'initialSpeedU',
        name: 'Initial Speed (u)',
        symbol: 'u',
        unit: 'm/s',
        min: 0,
        max: 30,
        step: 1,
        defaultValue: 0,
        description: 'Velocity when timer starts.',
      },
      {
        id: 'accelerationA',
        name: 'Constant Acceleration (a)',
        symbol: 'a',
        unit: 'm/s²',
        min: 0.5,
        max: 10,
        step: 0.5,
        defaultValue: 2.0,
        description: 'Rate of velocity increase per second.',
      },
      {
        id: 'timeT',
        name: 'Motion Duration (t)',
        symbol: 't',
        unit: 's',
        min: 1,
        max: 15,
        step: 1,
        defaultValue: 6,
        description: 'Total elapsed time.',
      },
    ],
    prediction: {
      prompt: 'NCERT Numerical Check: Train Starting from Rest',
      scenario:
        'A train starting from rest attains a velocity of 72 km/h in 5 minutes. Assuming that the acceleration is uniform, find the distance travelled by the train for attaining this velocity.',
      choices: [
        {
          id: 'p1',
          text: '3 km (3000 m), using s = ut + ½at².',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: '7.2 km, multiplying 72 km/h by 5 minutes.',
          isCorrect: false,
          misconceptionExplanation: 'The train accelerates from 0 to 72 km/h; it did not travel at 72 km/h the entire time.',
        },
        {
          id: 'p3',
          text: '6 km, assuming simple linear proportionality without the factor of 1/2.',
          isCorrect: false,
          misconceptionExplanation: 'Distance is the area of a triangle under the v-t graph, which includes the ½ factor.',
        },
      ],
      correctExplanation:
        'Initial u = 0. Final v = 72 × (5/18) = 20 m/s. Time t = 5 × 60 = 300 s. Acceleration a = (v - u)/t = 20 / 300 = 1/15 m/s². Distance s = ut + ½at² = 0 + ½ × (1/15) × (300)² = ½ × (1/15) × 90000 = 3000 m = 3 km.',
      relevantFormula: 's = \\frac{1}{2} a t^2 = \\frac{1}{2} \\left(\\frac{1}{15}\\right) (300)^2 = 3000\\text{ m} = 3\\text{ km}',
    },
    relatedConcepts: [
      { id: 'ncert9-acceleration-kinematics', name: 'Acceleration & Retardation', subject: 'physics' },
      { id: 'ncert9-motion-graphs', name: 'Kinematic Motion Graphs', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Runway Length Design for Commercial Aircraft',
        description: 'Aviation engineers use v² = 2as to compute minimum runway length required for planes to reach takeoff rotation speed (v_rotate).',
      },
      {
        title: 'Skid Mark Forensic Reconstruction',
        description: 'Traffic accident investigators measure skid mark length s on asphalt to deduce initial pre-impact vehicle speed via v = √(2μgs).',
      },
      {
        title: 'Elevator Velocity Profiling',
        description: 'High-speed skyscraper elevators accelerate uniformly up to speed, coast, and decelerate using kinematic cubic profiles to ensure passenger comfort.',
      },
    ],
  },
  {
    id: 'ncert9-motion-graphs',
    title: 'Graphical Analysis: Distance-Time & Velocity-Time Graphs',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Slopes reveal speed & acceleration; enclosed area reveals total displacement',
    description:
      'Graphs provide a visual representation of motion. In a Distance-Time (s-t) graph, a straight line represents uniform motion, a horizontal line represents rest, and the slope equals speed (v = Δs/Δt). In a Velocity-Time (v-t) graph, the slope represents acceleration (a = Δv/Δt), a horizontal line represents uniform velocity, and the area under the curve equals displacement.',
    formulaLaTeX: '\\text{Slope of } s\\text{-}t \\text{ graph} = \\frac{\\Delta s}{\\Delta t} = \\text{Speed}, \\quad \\text{Slope of } v\\text{-}t = \\frac{\\Delta v}{\\Delta t} = \\text{Acceleration}, \\quad \\text{Area under } v\\text{-}t = s',
    formulaExplanation:
      'Area of rectangle (height u × width t) plus area of triangle (½ × base t × height at) gives distance s = ut + ½at².',
    simulationType: 'projectile-motion',
    variables: [
      {
        id: 'initialVel',
        name: 'Initial Speed (u)',
        symbol: 'u',
        unit: 'm/s',
        min: 0,
        max: 20,
        step: 2,
        defaultValue: 10,
        description: 'Height of v-t intercept at t = 0.',
      },
      {
        id: 'finalVel',
        name: 'Final Speed (v)',
        symbol: 'v',
        unit: 'm/s',
        min: 10,
        max: 40,
        step: 2,
        defaultValue: 25,
        description: 'Height of v-t curve at end of interval.',
      },
      {
        id: 'intervalT',
        name: 'Time Interval (t)',
        symbol: 't',
        unit: 's',
        min: 2,
        max: 12,
        step: 1,
        defaultValue: 8,
        description: 'Base width of the trapezoid under the curve.',
      },
    ],
    prediction: {
      prompt: 'NCERT Graph Check: Interpreting Horizontal Lines in Motion Graphs',
      scenario:
        'What does a horizontal line parallel to the time axis represent in: (1) a Distance-Time graph, and (2) a Velocity-Time graph?',
      choices: [
        {
          id: 'p1',
          text: '(1) Uniform speed, (2) Uniform acceleration.',
          isCorrect: false,
          misconceptionExplanation: 'In a distance-time graph, a horizontal line means distance is NOT changing with time—the object is stationary!',
        },
        {
          id: 'p2',
          text: '(1) Object is at rest (speed = 0), (2) Object moves with uniform velocity (acceleration = 0).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: '(1) Infinite speed, (2) Zero velocity.',
          isCorrect: false,
          misconceptionExplanation: 'Infinite speed corresponds to a vertical vertical line, not a horizontal line.',
        },
      ],
      correctExplanation:
        'In an s-t graph, slope = ds/dt = speed. A horizontal line has zero slope, meaning speed = 0 (object at rest). In a v-t graph, slope = dv/dt = acceleration. A horizontal line has zero slope, meaning velocity is constant and acceleration = 0.',
      relevantFormula: '\\text{Slope} = \\frac{\\Delta y}{\\Delta x} = 0 \\implies v = 0 \\text{ (in } s\\text{-}t), \\quad a = 0 \\text{ (in } v\\text{-}t)',
    },
    relatedConcepts: [
      { id: 'ncert9-equations-of-motion', name: 'Equations of Motion', subject: 'physics' },
      { id: 'ncert9-acceleration-kinematics', name: 'Acceleration in Kinematics', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Seismograph Earth Tremor Recordings',
        description: 'Seismologists integrate ground acceleration-time graphs twice to compute actual tectonic fault displacements during earthquakes.',
      },
      {
        title: 'Sports Performance Tracking (Catapult/GPS)',
        description: 'Elite football trackers plot sprint v-t curves to evaluate players maximal acceleration bursts and sprint endurance.',
      },
      {
        title: 'Automotive Engine Dynamometer Plots',
        description: 'Engineers record RPM-time graphs on dynamometers to extract peak engine horsepower and torque curves.',
      },
    ],
  },
  {
    id: 'ncert9-circular-motion',
    title: 'Uniform Circular Motion & Centripetal Acceleration',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Constant orbital speed with continuously accelerating velocity direction',
    description:
      'When an object moves along a circular path of radius r with constant speed v, its motion is called uniform circular motion. Although speed is constant, the direction of motion changes continuously at every point along the tangent. Because velocity is continuously changing direction, uniform circular motion is inherently an accelerated motion directed radially inwards toward the center.',
    formulaLaTeX: 'v = \\frac{2\\pi r}{t}, \\quad a_c = \\frac{v^2}{r} = \\omega^2 r, \\quad F_c = \\frac{m v^2}{r}',
    formulaExplanation:
      'The speed is total circumference (2πr) divided by period t. The continuous inward redirection is maintained by a centripetal force directed toward the center.',
    simulationType: 'gravitation-orbit',
    variables: [
      {
        id: 'radiusM',
        name: 'Circular Track Radius',
        symbol: 'r',
        unit: 'm',
        min: 10,
        max: 200,
        step: 10,
        defaultValue: 50,
        description: 'Radius of the circular trajectory.',
      },
      {
        id: 'timePeriodS',
        name: 'Time for One Revolution',
        symbol: 't',
        unit: 's',
        min: 5,
        max: 60,
        step: 5,
        defaultValue: 20,
        description: 'Time taken to complete one full revolution.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: Releasing an Object from a Whirling String',
      scenario:
        'A piece of stone tied to a thread is rotated in a horizontal circular path. If the thread suddenly snaps, in what direction will the stone fly?',
      choices: [
        {
          id: 'p1',
          text: 'Radially outwards directly away from the center.',
          isCorrect: false,
          misconceptionExplanation: 'Centrifugal force is not a real force propelling it outward; inertia keeps it moving along its instantaneous velocity vector.',
        },
        {
          id: 'p2',
          text: 'Tangentially along a straight line touching the circular path at that instant.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'It will continue moving in a spiral circle of increasing radius.',
          isCorrect: false,
          misconceptionExplanation: 'Without a centripetal tension force pulling inward, Newton’s 1st law dictates straight-line rectilinear motion.',
        },
      ],
      correctExplanation:
        'According to Newton\'s First Law of Motion (Inertia), an object in motion continues in a straight line unless acted upon by a net force. The tension in the string was providing the centripetal inward acceleration. The instant the string breaks, tension vanishes, and the stone flies off tangentially along its instantaneous velocity vector.',
      relevantFormula: '\\vec{v}_{\\text{tangent}} \\perp \\vec{r}, \\quad \\sum \\vec{F} = 0 \\implies \\text{Straight Line Motion}',
    },
    relatedConcepts: [
      { id: 'ncert9-first-law-inertia', name: 'Inertia & Newton’s 1st Law', subject: 'physics' },
      { id: 'ncert9-universal-gravitation', name: 'Universal Gravitation & Orbits', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Banked Highway Curves & Velodromes',
        description: 'Curved race tracks are tilted inward so horizontal normal force components provide centripetal force, preventing skid at high speeds.',
      },
      {
        title: 'Centrifuge Blood Separation',
        description: 'Laboratory centrifuges spin blood vials at 4000 RPM; dense erythrocytes experience high centripetal acceleration and separate to the bottom.',
      },
      {
        title: 'Geostationary Communication Satellites',
        description: 'Satellites orbit Earth at 35,786 km with period t = 24 hours, remaining permanently parked over the same ground coordinate.',
      },
    ],
  },

  // --- CHAPTER: FORCE AND LAWS OF MOTION ---
  {
    id: 'ncert9-first-law-inertia',
    title: 'Galileo\'s Incline, Inertia & Newton\'s First Law of Motion',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'An object remains in state of rest or uniform motion unless compelled by an unbalanced force',
    description:
      'Galileo deduced that objects move with constant speed when no unbalanced force acts on them by observing marbles rolling down and up opposing double inclined planes. Newton formalized this as the First Law of Motion: An object remains in a state of rest or of uniform motion in a straight line unless compelled to change that state by an applied external unbalanced force. Inertia is the natural tendency of objects to resist a change in their state of rest or motion. Mass is the quantitative measure of inertia.',
    formulaLaTeX: '\\sum \\vec{F}_{\\text{ext}} = 0 \\implies \\vec{a} = 0 \\implies \\vec{v} = \\text{constant}',
    formulaExplanation:
      'Heavier objects have greater inertia because greater mass requires greater force to produce the same acceleration.',
    simulationType: 'newtons-laws',
    variables: [
      {
        id: 'bodyMassKg',
        name: 'Inertial Mass of Object',
        symbol: 'm',
        unit: 'kg',
        min: 1,
        max: 50,
        step: 2,
        defaultValue: 10,
        description: 'Measure of the body\'s resistance to change in velocity.',
      },
      {
        id: 'externalForceN',
        name: 'Net Unbalanced Force',
        symbol: 'F_{\\text{net}}',
        unit: 'N',
        min: 0,
        max: 60,
        step: 5,
        defaultValue: 0,
        description: 'Zero net force maintains constant velocity.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: Why Do Passengers Jerk Forward When a Bus Brakes?',
      scenario:
        'When a fast-moving bus suddenly applies emergency brakes, why do passengers lurch violently forward?',
      choices: [
        {
          id: 'p1',
          text: 'Because the brakes push the passengers forward from behind.',
          isCorrect: false,
          misconceptionExplanation: 'The brakes apply a backward stopping force on the bus wheels, not a forward push on passengers.',
        },
        {
          id: 'p2',
          text: 'Due to inertia of motion: feet stop with the bus floor while the upper body continues moving forward.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Because air inside the bus compresses into a forward shockwave.',
          isCorrect: false,
          misconceptionExplanation: 'Air density changes inside a braking bus are minuscule and not the cause of passenger forward momentum.',
        },
      ],
      correctExplanation:
        'When the bus stops suddenly, the passengers\' feet, being in frictional contact with the bus floor, come to rest immediately. However, the upper part of their bodies tends to maintain its state of uniform forward motion due to inertia of motion (Newton\'s 1st Law), causing them to lurch forward.',
      relevantFormula: '\\vec{v}_{\\text{upper body}} = v_0 \\ne 0 \\implies \\text{Inertia of Motion}',
    },
    relatedConcepts: [
      { id: 'ncert9-momentum-second-law', name: 'Momentum & Newton’s 2nd Law', subject: 'physics' },
      { id: 'ncert9-third-law-action-reaction', name: 'Newton’s 3rd Law of Motion', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Seatbelts and Inertia Reels in Cars',
        description: 'Seatbelts supply the backward retarding force required to safely decelerate passengers and prevent impact with the windshield.',
      },
      {
        title: 'Dusting Carpets with a Stick',
        description: 'Beating a carpet causes the cloth fibers to accelerate backward suddenly, while dust particles stay behind due to inertia and fall out.',
      },
      {
        title: 'Striking the Bottom of a Coin Stack in Carrom',
        description: 'A sharp strike ejects only the bottom coin while the rest of the pile settles vertically down due to inertia of rest.',
      },
    ],
  },
  {
    id: 'ncert9-momentum-second-law',
    title: 'Linear Momentum & Newton\'s Second Law of Motion',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'F = dp/dt = ma: The rate of change of momentum is proportional to applied force',
    description:
      'The linear momentum p of an object is defined as the product of its mass m and velocity v: p = mv (a vector directed along velocity, with SI unit kg·m/s). Newton\'s Second Law states that the rate of change of momentum of an object is directly proportional to the applied unbalanced force in the direction of force: F ∝ (p₂ - p₁) / t = m(v - u) / t = ma. Hence F = ma. A small bullet possesses deadly momentum due to high velocity; a slow massive truck possesses enormous momentum due to large mass.',
    formulaLaTeX: 'p = m v, \\quad F = \\frac{\\Delta p}{\\Delta t} = \\frac{m(v - u)}{t} = m a, \\quad \\text{SI Unit: Newton (N)} = 1\\text{ kg}\\cdot\\text{m/s}^2',
    formulaExplanation:
      'Applied force is proportional to acceleration. Increasing impact duration Δt reduces the impact force F = Δp/Δt.',
    simulationType: 'newtons-laws',
    variables: [
      {
        id: 'massM',
        name: 'Body Mass',
        symbol: 'm',
        unit: 'kg',
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 5,
        description: 'Inertial mass of the moving object.',
      },
      {
        id: 'appliedForceF',
        name: 'Applied Net Force',
        symbol: 'F',
        unit: 'N',
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 25,
        description: 'Unbalanced external force acting on mass.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: Why Does a Cricket Fielder Pull Hands Backwards?',
      scenario:
        'Why does a cricket fielder gradually pull his hands backwards while catching a fast-moving cricket ball?',
      choices: [
        {
          id: 'p1',
          text: 'To look stylish and display superior athletic technique.',
          isCorrect: false,
          misconceptionExplanation: 'Biomechanics is driven by physics safety principles, not aesthetics.',
        },
        {
          id: 'p2',
          text: 'To increase the impact time Δt, thereby reducing the stopping force F = Δp/Δt and preventing injury.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'To decrease the final momentum of the ball to below zero.',
          isCorrect: false,
          misconceptionExplanation: 'Final momentum is zero in both cases; pulling hands back changes the TIME taken to reach zero.',
        },
      ],
      correctExplanation:
        'A fast ball carries large momentum p = mv. To bring it to rest (v = 0), change in momentum Δp is fixed. By pulling hands backward, the fielder increases the time interval Δt of deceleration. Since F = Δp / Δt, increasing Δt substantially reduces the retarding force exerted on the palms, preventing bone and tissue injury.',
      relevantFormula: 'F = \\frac{\\Delta p}{\\Delta t} \\implies \\text{Increasing } \\Delta t \\text{ decreases force } F',
    },
    relatedConcepts: [
      { id: 'ncert9-first-law-inertia', name: 'Inertia & Newton’s 1st Law', subject: 'physics' },
      { id: 'ncert9-third-law-action-reaction', name: 'Newton’s 3rd Law of Motion', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Automotive Airbags & Crumple Zones',
        description: 'Vehicular crumple zones and airbags lengthen crash deceleration time from 0.02s to 0.15s, reducing peak impact forces on passengers by 80%.',
      },
      {
        title: 'High Jump Sand Pits and Foam Cushions',
        description: 'Athletes landing on deep foam experience prolonged deceleration time, reducing impact force compared to landing on hard ground.',
      },
      {
        title: 'Karate Brick Breaking Technique',
        description: 'A martial artist strikes with immense hand speed and halts in an ultra-short time (~0.005s), concentrating thousands of Newtons of force to snap bricks.',
      },
    ],
  },
  {
    id: 'ncert9-third-law-action-reaction',
    title: 'Newton\'s Third Law: Action-Reaction Pairs & Recoil',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'To every action, there is an equal and opposite reaction acting on different bodies',
    description:
      'Whenever one body exerts a force on another body, the second body instantaneously exerts an equal and opposite force on the first: F_AB = -F_BA. Action and reaction forces are equal in magnitude, opposite in direction, simultaneous, and ALWAYS act on two different bodies (hence they never cancel each other out). Even though forces are equal in magnitude, they can produce different accelerations if the bodies have different masses (a = F/m).',
    formulaLaTeX: '\\vec{F}_{AB} = -\\vec{F}_{BA}, \\quad m_1 \\vec{a}_1 = -m_2 \\vec{a}_2 \\implies v_{\\text{recoil}} = -\\left(\\frac{m_{\\text{bullet}}}{m_{\\text{gun}}}\\right) v_{\\text{bullet}}',
    formulaExplanation:
      'Because mass of gun is vastly larger than bullet mass, gun recoil acceleration is much smaller than bullet forward acceleration.',
    simulationType: 'newtons-laws',
    variables: [
      {
        id: 'bulletMassG',
        name: 'Bullet Mass',
        symbol: 'm_b',
        unit: 'g',
        min: 10,
        max: 50,
        step: 5,
        defaultValue: 20,
        description: 'Mass of fired projectile in grams.',
      },
      {
        id: 'bulletSpeedMs',
        name: 'Bullet Muzzle Velocity',
        symbol: 'v_b',
        unit: 'm/s',
        min: 100,
        max: 500,
        step: 50,
        defaultValue: 300,
        description: 'Forward speed of the bullet.',
      },
      {
        id: 'gunMassKg',
        name: 'Rifle Mass',
        symbol: 'm_g',
        unit: 'kg',
        min: 1,
        max: 10,
        step: 0.5,
        defaultValue: 4.0,
        description: 'Inertial mass of the firearm.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: Recoil Velocity of a Rifle',
      scenario:
        'A bullet of mass 20 g is horizontally fired with a velocity 150 m/s from a pistol of mass 2 kg. What is the recoil velocity of the pistol?',
      choices: [
        {
          id: 'p1',
          text: '-1.5 m/s (pistol recoils backward at 1.5 m/s).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: '+150 m/s, matching bullet velocity.',
          isCorrect: false,
          misconceptionExplanation: 'Equal force does not mean equal velocity; pistol is 100 times heavier than the bullet.',
        },
        {
          id: 'p3',
          text: '-15 m/s, forgetting to convert grams to kilograms.',
          isCorrect: false,
          misconceptionExplanation: '20 g = 0.02 kg. Forgetting unit conversion results in a 10x error.',
        },
      ],
      correctExplanation:
        'Initial momentum before firing = 0. By conservation of momentum / Newton\'s 3rd Law: m_bullet × v_bullet + m_pistol × v_recoil = 0. (0.02 kg × 150 m/s) + (2 kg × v_recoil) = 0 => 3 + 2 v_recoil = 0 => v_recoil = -1.5 m/s.',
      relevantFormula: 'v_{\\text{recoil}} = -\\frac{m_b v_b}{m_g} = -\\frac{0.02 \\times 150}{2} = -1.5\\text{ m/s}',
    },
    relatedConcepts: [
      { id: 'ncert9-momentum-second-law', name: 'Momentum & 2nd Law', subject: 'physics' },
      { id: 'ncert9-conservation-momentum', name: 'Conservation of Momentum', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Rocket Engine Thrust in Vacuum',
        description: 'Rockets expel high-velocity exhaust gases backward; the reaction force pushes the rocket vehicle forward even in empty space.',
      },
      {
        title: 'Stepping Out of a Rowing Boat',
        description: 'As a sailor steps forward onto the bank, their foot pushes the boat backward, causing the boat to drift away from the shore.',
      },
      {
        title: 'Firefighter Hose Reaction',
        description: 'High-pressure water exiting a nozzle at 40 m/s pushes the nozzle backward with hundreds of Newtons, requiring multiple firefighters to hold it.',
      },
    ],
  },
  {
    id: 'ncert9-conservation-momentum',
    title: 'Law of Conservation of Linear Momentum',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'In an isolated system, total momentum before collision equals total momentum after collision',
    description:
      'In the absence of an external unbalanced force, the total momentum of two colliding bodies remains conserved: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂. When body A collides with body B, the impulse force exerted by A on B is equal and opposite to the impulse exerted by B on A (Newton\'s 3rd Law), resulting in equal and opposite momentum transfers with zero net change in system momentum.',
    formulaLaTeX: 'm_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2, \\quad \\Delta p_{\\text{system}} = 0',
    formulaExplanation:
      'Where m₁, m₂ are masses, u₁, u₂ are initial velocities, and v₁, v₂ are final velocities after collision.',
    simulationType: 'newtons-laws',
    variables: [
      {
        id: 'cartMass1',
        name: 'Cart 1 Mass (m₁)',
        symbol: 'm_1',
        unit: 'kg',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 2,
        description: 'Mass of first glider/cart.',
      },
      {
        id: 'cartVel1',
        name: 'Cart 1 Velocity (u₁)',
        symbol: 'u_1',
        unit: 'm/s',
        min: 1,
        max: 15,
        step: 1,
        defaultValue: 6,
        description: 'Initial velocity of first cart.',
      },
      {
        id: 'cartMass2',
        name: 'Cart 2 Mass (m₂)',
        symbol: 'm_2',
        unit: 'kg',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 4,
        description: 'Mass of stationary second cart.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: Inelastic Collision of Two Hockey Players',
      scenario:
        'Two hockey players of opposite teams, while trying to hit a ball, collide and become entangled. Player A of mass 60 kg was moving at 5.0 m/s, while Player B of mass 55 kg was moving towards Player A at 6.0 m/s. In which direction and with what velocity will they move after becoming entangled?',
      choices: [
        {
          id: 'p1',
          text: '0.26 m/s in the direction of Player B, because Player B had greater initial momentum.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: '0.26 m/s in the direction of Player A, because Player A is heavier.',
          isCorrect: false,
          misconceptionExplanation: 'Player A momentum = 60 × 5 = +300 kg·m/s. Player B momentum = 55 × (-6) = -330 kg·m/s. Net momentum is negative (in Player B\'s direction).',
        },
        {
          id: 'p3',
          text: 'Zero, because they cancel out completely.',
          isCorrect: false,
          misconceptionExplanation: '300 ≠ 330, so net momentum is -30 kg·m/s, not zero.',
        },
      ],
      correctExplanation:
        'Total momentum before = (60 × +5.0) + (55 × -6.0) = +300 - 330 = -30 kg·m/s. After entangling, combined mass = 60 + 55 = 115 kg. Final velocity v = Total Momentum / Combined Mass = -30 / 115 = -0.26 m/s (moving in original direction of player B).',
      relevantFormula: 'v = \\frac{m_1 u_1 + m_2 u_2}{m_1 + m_2} = \\frac{300 - 330}{115} = -0.26\\text{ m/s}',
    },
    relatedConcepts: [
      { id: 'ncert9-third-law-action-reaction', name: 'Newton’s 3rd Law of Motion', subject: 'physics' },
      { id: 'ncert9-momentum-second-law', name: 'Momentum & 2nd Law', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Newton\'s Cradle Executive Toy',
        description: 'Lifting and dropping one steel ball transmits impulse through stationary spheres, ejecting only one ball on the opposite side to conserve both momentum and energy.',
      },
      {
        title: 'Billiards / Pool Cue Ball Collisions',
        description: 'When a cue ball strikes a stationary ball of equal mass head-on elastically, the cue ball stops completely and the target ball departs with original velocity.',
      },
      {
        title: 'Spacecraft Docking in Orbit',
        description: 'Automated ISS resupply cargo capsules calculate precise momentum matching vectors before magnetic latching.',
      },
    ],
  },

  // --- CHAPTER: GRAVITATION ---
  {
    id: 'ncert9-universal-gravitation',
    title: 'Newton\'s Universal Law of Gravitation',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Inverse-square attractive mutual force acting between all masses in the universe',
    description:
      'Every object in the universe attracts every other object with a force that is directly proportional to the product of their masses and inversely proportional to the square of the distance between their centers: F = G (M₁M₂) / d². Universal Gravitational Constant G = 6.674 × 10⁻¹¹ N·m²/kg² was experimentally measured by Henry Cavendish using a sensitive torsion balance. This law binds planets in orbits, produces ocean tides, and holds Earth\'s atmosphere in place.',
    formulaLaTeX: 'F = G \\frac{M_1 M_2}{d^2}, \\quad G = 6.674 \\times 10^{-11}\\text{ N}\\cdot\\text{m}^2/\\text{kg}^2',
    formulaExplanation:
      'Doubling distance d reduces gravitational force to ¼ (inverse-square law). Doubling either mass doubles the attractive force.',
    simulationType: 'gravitation-orbit',
    variables: [
      {
        id: 'massM1',
        name: 'Mass of Body 1',
        symbol: 'M_1',
        unit: 'kg',
        min: 10,
        max: 1000,
        step: 50,
        defaultValue: 200,
        description: 'First gravitational source mass.',
      },
      {
        id: 'massM2',
        name: 'Mass of Body 2',
        symbol: 'M_2',
        unit: 'kg',
        min: 10,
        max: 1000,
        step: 50,
        defaultValue: 100,
        description: 'Second gravitational mass.',
      },
      {
        id: 'distanceD',
        name: 'Separation Distance',
        symbol: 'd',
        unit: 'm',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 5,
        description: 'Center-to-center separation distance.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: What Happens to Force When Distance is Tripled?',
      scenario:
        'If the distance between two masses is tripled (d → 3d), what happens to the gravitational attraction force between them?',
      choices: [
        {
          id: 'p1',
          text: 'It reduces to one-third (F / 3).',
          isCorrect: false,
          misconceptionExplanation: 'Gravity obeys an inverse-square law (1/d²), not an inverse linear law (1/d).',
        },
        {
          id: 'p2',
          text: 'It reduces to one-ninth (F / 9).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'It increases by 3 times.',
          isCorrect: false,
          misconceptionExplanation: 'Increasing separation weakens gravitational attraction.',
        },
      ],
      correctExplanation:
        'According to the Universal Law of Gravitation, F ∝ 1/d². If distance becomes 3d, F\' = G(M₁M₂)/(3d)² = G(M₁M₂)/(9d²) = F/9. The force drops to one-ninth of its original magnitude.',
      relevantFormula: 'F\' = \\frac{G M_1 M_2}{(3d)^2} = \\frac{1}{9} F',
    },
    relatedConcepts: [
      { id: 'ncert9-free-fall-acceleration', name: 'Free Fall & g', subject: 'physics' },
      { id: 'ncert9-circular-motion', name: 'Uniform Circular Motion', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Lunar & Solar Ocean Tides',
        description: 'Differential gravitational pull of the Moon and Sun creates twice-daily high and low ocean tides across Earth.',
      },
      {
        title: 'Planetary Orbits & Keplerian Ellipses',
        description: 'The Sun\'s immense gravitational attraction provides the exact centripetal force keeping all planets in stable revolution.',
      },
      {
        title: 'Orbital Slingshot Gravity Assists',
        description: 'Interplanetary probes like Voyager and Cassini fly close to Jupiter to gain velocity from its orbital gravitational field.',
      },
    ],
  },
  {
    id: 'ncert9-free-fall-acceleration',
    title: 'Free Fall, Acceleration due to Gravity (g), Mass vs Weight',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Mass is constant matter quantity; weight is gravitational force W = mg',
    description:
      'When an object falls towards Earth solely under the influence of gravitational force, it is said to be in free fall. The acceleration produced during free fall is the acceleration due to gravity, g = GM / R² ≈ 9.8 m/s² (independent of the falling body\'s mass). Mass (m) is the constant quantity of matter inside an object (measured in kg with physical balance). Weight (W = mg) is the force of gravitational pull on the object (measured in Newtons with spring balance). On the Moon, g_moon ≈ g_earth / 6 ≈ 1.62 m/s², so an object weighs 1/6th as much on the Moon, while its mass remains strictly identical.',
    formulaLaTeX: 'g = \\frac{G M}{R^2} \\approx 9.8\\text{ m/s}^2, \\quad W = m g, \\quad W_{\\text{moon}} = \\frac{1}{6} W_{\\text{earth}}',
    formulaExplanation:
      'Because Earth is an oblate spheroid with larger equatorial radius than polar radius, g is slightly greater at the poles (9.83 m/s²) than at the equator (9.78 m/s²).',
    simulationType: 'projectile-motion',
    variables: [
      {
        id: 'massKg',
        name: 'Object Mass (m)',
        symbol: 'm',
        unit: 'kg',
        min: 1,
        max: 100,
        step: 5,
        defaultValue: 60,
        description: 'Invariable quantity of matter.',
      },
      {
        id: 'surfaceGravity',
        name: 'Local Gravitational Field (g)',
        symbol: 'g',
        unit: 'm/s²',
        min: 1.62,
        max: 24.79,
        step: 0.5,
        defaultValue: 9.8,
        description: 'Earth = 9.8, Moon = 1.62, Jupiter = 24.79.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: Dropping a Feather and a Heavy Stone in Vacuum',
      scenario:
        'If a light bird feather and a 10 kg iron cannonball are released simultaneously from the same height inside an evacuated glass vacuum chamber, which will hit the ground first?',
      choices: [
        {
          id: 'p1',
          text: 'The heavy iron cannonball, because gravity pulls harder on heavier masses.',
          isCorrect: false,
          misconceptionExplanation: 'Gravity exerts more force (W = mg), but the heavier cannonball has proportionally more inertia (m), canceling mass exactly: a = F/m = mg/m = g.',
        },
        {
          id: 'p2',
          text: 'Both hit the ground at the exact same instant.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'The feather, because it is lighter and floats faster.',
          isCorrect: false,
          misconceptionExplanation: 'Floating is caused by buoyant air resistance, which is absent in a vacuum.',
        },
      ],
      correctExplanation:
        'In vacuum, air resistance is zero. The downward acceleration of any freely falling body is g = GM / R², which does not contain the mass m of the falling object. Both the feather and the heavy iron ball experience identical downward acceleration of 9.8 m/s² and hit the ground at the exact same instant, as demonstrated by Apollo 15 on the Moon.',
      relevantFormula: 'a = \\frac{F}{m} = \\frac{G M m / R^2}{m} = \\frac{G M}{R^2} = g \\quad (\\text{Independent of } m)',
    },
    relatedConcepts: [
      { id: 'ncert9-universal-gravitation', name: 'Universal Gravitation', subject: 'physics' },
      { id: 'ncert9-equations-of-motion', name: 'Equations of Motion', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Astronaut Weightlessness in Low Earth Orbit',
        description: 'Astronauts on the ISS float not because gravity is zero (g is ~8.9 m/s² at 400 km), but because the station and astronauts are in continuous free fall together.',
      },
      {
        title: 'Spring Balance vs Beam Balance Calibration',
        description: 'A grocer\'s beam balance compares masses and works identically on the Moon; a spring scale measures gravitational weight force W = mg and shifts with local g.',
      },
      {
        title: 'Parachute Terminal Velocity',
        description: 'Skydiving parachutes increase air drag until air resistance equals gravitational weight (F_drag = mg), reaching a safe terminal landing velocity of ~5 m/s.',
      },
    ],
  },
  {
    id: 'ncert9-thrust-and-pressure',
    title: 'Thrust, Pressure & Fluid Hydrostatic Pressure',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Perpendicular force distributed over contact area: P = Thrust / Area',
    description:
      'The net force acting perpendicular to a surface is called thrust. Pressure is defined as the thrust per unit area of contact: P = Thrust / Area = F / A. The SI unit of pressure is Pascal (Pa) = 1 N/m², named in honor of Blaise Pascal. A given thrust exerts tremendous pressure when acting over a tiny contact area (e.g. sharp needle, knife edge), and low pressure when spread over a large contact area (e.g. broad straps on school bags, wide caterpillar tracks on tanks). Fluids (liquids and gases) exert pressure in all directions and pressure increases linearly with depth: P = ρgh.',
    formulaLaTeX: 'P = \\frac{\\text{Thrust}}{\\text{Area}} = \\frac{F}{A}, \\quad P_{\\text{fluid}} = \\rho g h, \\quad 1\\text{ Pa} = 1\\text{ N/m}^2',
    formulaExplanation:
      'Decreasing contact area A dramatically amplifies pressure P for the same applied force. Fluid pressure depends on density ρ, gravity g, and depth h, independent of container shape.',
    simulationType: 'ideal-gas',
    variables: [
      {
        id: 'appliedThrustN',
        name: 'Perpendicular Thrust (F)',
        symbol: 'F',
        unit: 'N',
        min: 10,
        max: 500,
        step: 10,
        defaultValue: 100,
        description: 'Total perpendicular load force.',
      },
      {
        id: 'surfaceAreaCm2',
        name: 'Contact Area',
        symbol: 'A',
        unit: 'cm²',
        min: 0.1,
        max: 50,
        step: 0.5,
        defaultValue: 5,
        description: 'Surface area over which thrust is distributed.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: Why Do Camels Walk Easily on Loose Sand?',
      scenario:
        'Why can a heavy camel walk and run with ease on loose desert sand, whereas a human sinks deeply?',
      choices: [
        {
          id: 'p1',
          text: 'Camels have broad flat feet with large surface area, which drastically reduces pressure on the sand.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Camels weigh less than humans.',
          isCorrect: false,
          misconceptionExplanation: 'A camel weighs 400–600 kg, roughly 7 times heavier than an adult human.',
        },
        {
          id: 'p3',
          text: 'Sand exerts no upward normal reaction on camels.',
          isCorrect: false,
          misconceptionExplanation: 'Sand must exert an upward normal force equal to the camel\'s weight to support it.',
        },
      ],
      correctExplanation:
        'Pressure P = Force / Area. Although the camel has a large weight force, its broad flat hooves provide a large surface area A. This spreads the weight, reducing the pressure P = F/A below the sinkage threshold of loose desert sand. A human has small shoe soles, concentrating weight onto a small area and creating high pressure that sinks.',
      relevantFormula: 'P = \\frac{F}{A} \\implies \\text{Large } A \\implies \\text{Low Pressure } P',
    },
    relatedConcepts: [
      { id: 'ncert9-archimedes-buoyancy', name: 'Archimedes\' Principle & Buoyancy', subject: 'physics' },
      { id: 'ncert9-free-fall-acceleration', name: 'Mass vs Weight', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Sharp Knives vs Blunt Knives',
        description: 'A sharp knife has an edge thickness of micrometers, creating gigapascals of pressure with modest hand force to slice vegetables easily.',
      },
      {
        title: 'Wide Straps on School Backpacks',
        description: 'Wide shoulder straps distribute heavy textbook weight over a broad collarbone area, preventing painful pressure cuts.',
      },
      {
        title: 'Hydraulic Heavy Earth-Movers and Excavators',
        description: 'Pascal\'s law in hydraulic fluid allows small input piston forces to generate tens of thousands of Newtons at excavator bucket cylinders.',
      },
    ],
  },
  {
    id: 'ncert9-archimedes-buoyancy',
    title: 'Archimedes\' Principle, Buoyancy & Laws of Floatation',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Upward buoyant force equals weight of displaced fluid: F_B = V · ρ_fluid · g',
    description:
      'When a body is immersed fully or partially in a fluid, it experiences an upward buoyant force (upthrust) equal to the weight of the fluid displaced by it: F_B = V_disp · ρ_fluid · g. If the buoyant force is greater than or equal to the object\'s weight, the object floats (average density ρ_body ≤ ρ_fluid). If buoyant force is less than weight, the object sinks (ρ_body > ρ_fluid). An iron nail sinks because iron density (~7.8 g/cm³) exceeds water (1.0 g/cm³), but a giant steel ship floats because its hollow hull encloses vast air pockets, making average ship density lower than water.',
    formulaLaTeX: 'F_B = V_{\\text{displaced}} \\cdot \\rho_{\\text{fluid}} \\cdot g, \\quad \\text{Apparent Weight} = W_{\\text{true}} - F_B, \\quad \\text{Relative Density} = \\frac{\\rho_{\\text{substance}}}{\\rho_{\\text{water}}}',
    formulaExplanation:
      'A floating body displaces a volume of fluid whose weight exactly matches the total weight of the floating body.',
    simulationType: 'ideal-gas',
    variables: [
      {
        id: 'objectVolumeCm3',
        name: 'Object Volume',
        symbol: 'V',
        unit: 'cm³',
        min: 100,
        max: 2000,
        step: 100,
        defaultValue: 500,
        description: 'Total geometric volume of the body.',
      },
      {
        id: 'objectDensity',
        name: 'Object Density',
        symbol: '\\rho_b',
        unit: 'g/cm³',
        min: 0.2,
        max: 8.0,
        step: 0.2,
        defaultValue: 0.8,
        description: 'Wood ≈ 0.6, Ice ≈ 0.92, Water = 1.0, Iron = 7.8.',
      },
      {
        id: 'fluidDensity',
        name: 'Fluid Density',
        symbol: '\\rho_f',
        unit: 'g/cm³',
        min: 0.8,
        max: 1.3,
        step: 0.05,
        defaultValue: 1.0,
        description: 'Freshwater = 1.0, Seawater = 1.03, Oil = 0.85.',
      },
    ],
    prediction: {
      prompt: 'NCERT In-Text Check: Iron Nail Sinks but Steel Ship Floats',
      scenario:
        'Why does a solid iron nail sink in a bucket of water, whereas an ocean liner made of thousands of tons of steel floats easily?',
      choices: [
        {
          id: 'p1',
          text: 'Because seawater is thicker and saltier than bucket tap water.',
          isCorrect: false,
          misconceptionExplanation: 'Even in freshwater lakes, iron nails sink and steel cruise ships float.',
        },
        {
          id: 'p2',
          text: 'The ship has a hollow hull containing air, displacing a water volume whose weight matches the ship\'s total weight.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Because the surface tension of the vast ocean pushes the ship upward.',
          isCorrect: false,
          misconceptionExplanation: 'Surface tension supports tiny water strider insects, not multi-thousand ton metal ships.',
        },
      ],
      correctExplanation:
        'An iron nail is solid iron with density ~7.8 g/cm³, greater than water (1.0 g/cm³), so its weight exceeds the buoyant force of water it can displace. A ship has a large hollow hull enclosing enormous air volume. The overall average density of the ship (Mass_total / Volume_hull) is substantially less than 1.0 g/cm³. Hence the weight of displaced water equals ship weight while much of the hull remains above water.',
      relevantFormula: '\\rho_{\\text{ship,avg}} = \\frac{m_{\\text{steel}} + m_{\\text{air}}}{V_{\\text{hull}}} < \\rho_{\\text{water}} \\implies \\text{Floats}',
    },
    relatedConcepts: [
      { id: 'ncert9-thrust-and-pressure', name: 'Thrust & Pressure', subject: 'physics' },
      { id: 'ncert9-free-fall-acceleration', name: 'Mass vs Weight', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Submarine Ballast Dive & Surface Tanks',
        description: 'Submarines submerge by flooding ballast tanks with seawater (increasing density), and surface by blowing compressed air to displace water.',
      },
      {
        title: 'Hydrometer for Milk Purity (Lactometer)',
        description: 'Lactometers float at calibrated depths in milk; adulteration with water lowers liquid density, causing the stem to sink deeper.',
      },
      {
        title: 'Hot Air Balloons in the Atmosphere',
        description: 'Burners heat air inside the envelope; hot air expands and becomes less dense than ambient cold air, generating upward atmospheric buoyancy.',
      },
    ],
  },

  // --- CHAPTER: WORK AND ENERGY ---
  {
    id: 'ncert9-work-done-force',
    title: 'Scientific Definition of Work Done by a Force',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Work is done only when an applied force produces displacement along its line of action',
    description:
      'In everyday language, mental studying or holding a heavy suitcase stationary is called "hard work", but in physics, work done is zero if there is no displacement. Work done on an object is defined as the product of the magnitude of force and the displacement in the direction of force: W = F · s · cosθ. Work is a scalar quantity with SI unit Joule (J) = 1 N·m. Work is positive when force and displacement are in the same direction (θ = 0°), negative when force opposes displacement (e.g. friction braking θ = 180°), and ZERO when force is perpendicular to displacement (e.g. carrying luggage horizontally where gravity acts downward θ = 90°).',
    formulaLaTeX: 'W = \\vec{F} \\cdot \\vec{s} = F s \\cos\\theta, \\quad 1\\text{ Joule} = 1\\text{ N} \\times 1\\text{ m}',
    formulaExplanation:
      'If s = 0 (pushing against a rigid wall) or θ = 90° (carrying weight horizontally), work done W = 0.',
    simulationType: 'work-energy',
    variables: [
      {
        id: 'forceMagN',
        name: 'Applied Force (F)',
        symbol: 'F',
        unit: 'N',
        min: 5,
        max: 200,
        step: 5,
        defaultValue: 50,
        description: 'Magnitude of the applied mechanical force.',
      },
      {
        id: 'displacementM',
        name: 'Displacement Distance (s)',
        symbol: 's',
        unit: 'm',
        min: 0,
        max: 20,
        step: 1,
        defaultValue: 8,
        description: 'Distance moved along coordinate axis.',
      },
      {
        id: 'forceAngleDeg',
        name: 'Angle Between Force & Motion',
        symbol: '\\theta',
        unit: '°',
        min: 0,
        max: 180,
        step: 15,
        defaultValue: 0,
        description: '0° = Same direction, 90° = Perpendicular (W=0), 180° = Opposing.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: Work Done by a Porter Carrying Luggage',
      scenario:
        'A porter carries a heavy suitcase of mass 15 kg on his head and walks horizontally across a flat railway platform for 20 meters. What is the work done by the porter against gravity?',
      choices: [
        {
          id: 'p1',
          text: '3000 Joules (15 kg × 10 m/s² × 20 m).',
          isCorrect: false,
          misconceptionExplanation: 'This would be work done if he lifted the luggage 20 meters vertically upwards.',
        },
        {
          id: 'p2',
          text: 'Zero Joules, because the gravitational force acts vertically down while motion is purely horizontal (cos 90° = 0).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Negative 3000 Joules.',
          isCorrect: false,
          misconceptionExplanation: 'Gravitational force is perpendicular to displacement, not opposite to it.',
        },
      ],
      correctExplanation:
        'Gravitational force acts vertically downwards (F_g = mg = 150 N). The displacement vector is purely horizontal (s = 20 m). The angle between force and displacement is θ = 90°. Since cos(90°) = 0, work done against gravity is W = F s cos(90°) = 150 × 20 × 0 = 0 Joules.',
      relevantFormula: 'W = F s \\cos(90^\\circ) = 0\\text{ J}',
    },
    relatedConcepts: [
      { id: 'ncert9-kinetic-energy', name: 'Kinetic Energy & Work-Energy Theorem', subject: 'physics' },
      { id: 'ncert9-potential-energy', name: 'Gravitational Potential Energy', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Work Done by Satellite in Circular Orbit',
        description: 'Earth\'s gravitational pull is perpendicular to the satellite\'s tangential velocity at every instant (θ = 90°); hence gravity does zero work on orbiting satellites.',
      },
      {
        title: 'Frictional Retardation Work',
        description: 'Brakes apply kinetic friction backwards against vehicle forward motion (θ = 180°, cos 180° = -1), doing negative work to drain vehicle kinetic energy.',
      },
      {
        title: 'Weightlifting Deadlifts vs Holding Static',
        description: 'An Olympic lifter does positive work lifting a 200 kg barbell from floor to chest, but does zero physical work holding it stationary overhead.',
      },
    ],
  },
  {
    id: 'ncert9-kinetic-energy',
    title: 'Kinetic Energy & Work-Energy Theorem',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Energy possessed by an object due to its motion: E_k = ½ m v²',
    description:
      'Kinetic energy is the energy possessed by an object by virtue of its motion. The kinetic energy of a body of mass m moving with velocity v is equal to the work done on it to accelerate it from rest to that velocity: E_k = ½ mv². The Work-Energy Theorem states that the net work done on an object equals the change in its kinetic energy: W_net = ΔE_k = ½mv² - ½mu². Because velocity is squared, doubling vehicle speed quadruples its kinetic energy and quadruples required braking distance.',
    formulaLaTeX: 'E_k = \\frac{1}{2} m v^2, \\quad W_{\\text{net}} = \\Delta E_k = \\frac{1}{2} m v^2 - \\frac{1}{2} m u^2',
    formulaExplanation:
      'Quadratic dependence on speed v means a car moving at 100 km/h possesses 4 times the kinetic energy of the same car moving at 50 km/h.',
    simulationType: 'work-energy',
    variables: [
      {
        id: 'massKg',
        name: 'Object Mass (m)',
        symbol: 'm',
        unit: 'kg',
        min: 1,
        max: 50,
        step: 2,
        defaultValue: 10,
        description: 'Inertial mass of the moving body.',
      },
      {
        id: 'velocityMs',
        name: 'Velocity (v)',
        symbol: 'v',
        unit: 'm/s',
        min: 0,
        max: 30,
        step: 1,
        defaultValue: 12,
        description: 'Instantaneous speed of the body.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: What Happens to Kinetic Energy if Speed is Doubled?',
      scenario:
        'If the speed of a vehicle is doubled (v → 2v) while its mass remains constant, by what factor does its kinetic energy increase?',
      choices: [
        {
          id: 'p1',
          text: 'It doubles (2x).',
          isCorrect: false,
          misconceptionExplanation: 'Kinetic energy depends on the SQUARE of velocity (v²), not velocity linearly.',
        },
        {
          id: 'p2',
          text: 'It quadruples (4x).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'It increases by 8 times.',
          isCorrect: false,
          misconceptionExplanation: 'Cube dependence applies to wind turbine power, not particle kinetic energy.',
        },
      ],
      correctExplanation:
        'Kinetic energy is E_k = ½mv². When speed becomes 2v, new kinetic energy E_k\' = ½m(2v)² = ½m(4v²) = 4 × (½mv²) = 4 E_k. Quadrupling kinetic energy explains why high-speed traffic crashes are exponentially more devastating.',
      relevantFormula: 'E_k\' = \\frac{1}{2} m (2v)^2 = 4 \\left(\\frac{1}{2} m v^2\\right) = 4 E_k',
    },
    relatedConcepts: [
      { id: 'ncert9-work-done-force', name: 'Work Done by Force', subject: 'physics' },
      { id: 'ncert9-energy-conservation', name: 'Conservation of Energy', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Highway Speed Limits & Braking Distances',
        description: 'Braking distance s = v²/(2μg) grows quadratically; stopping from 120 km/h requires over double the road distance of stopping from 80 km/h.',
      },
      {
        title: 'Wind Turbine Power Generation',
        description: 'Wind turbines extract kinetic energy from rushing air masses (P = ½ρAv³), converting fluid motion into electrical grid megawatts.',
      },
      {
        title: 'Meteorite Impact Craters',
        description: 'Hypervelocity space rocks hitting Earth at 20 km/s possess kinetic energy comparable to nuclear detonations (½mv² ≈ megatons of TNT).',
      },
    ],
  },
  {
    id: 'ncert9-potential-energy',
    title: 'Gravitational Potential Energy & Path Independence',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Stored energy of position in a gravitational field: E_p = mgh',
    description:
      'Potential energy is energy stored in an object by virtue of its position, elevation, or configuration. Gravitational potential energy E_p of an object raised to height h above the ground equals the work done against gravity in lifting it: E_p = mgh. Crucially, gravitational force is a conservative force, meaning work done against gravity depends ONLY on the vertical height difference between initial and final levels, completely independent of the path taken (stairs, straight vertical lift, or inclined ramp).',
    formulaLaTeX: 'E_p = m g h, \\quad W_{\\text{gravity}} = -\\Delta E_p = -(m g h_2 - m g h_1)',
    formulaExplanation:
      'Where m is mass (kg), g is gravitational acceleration (9.8 m/s²), and h is vertical elevation (m).',
    simulationType: 'work-energy',
    variables: [
      {
        id: 'massM',
        name: 'Object Mass (m)',
        symbol: 'm',
        unit: 'kg',
        min: 1,
        max: 50,
        step: 2,
        defaultValue: 10,
        description: 'Mass of the elevated body.',
      },
      {
        id: 'elevationH',
        name: 'Vertical Height (h)',
        symbol: 'h',
        unit: 'm',
        min: 1,
        max: 30,
        step: 1,
        defaultValue: 10,
        description: 'Vertical height above reference ground level.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: Lifting Mass Vertically vs Up an Incline',
      scenario:
        'A 10 kg mass is lifted to a height of 5 meters in two ways: (Case A) Lifted straight vertically. (Case B) Pushed up a frictionless 15-meter long inclined ramp to the same 5-meter height. In which case is the work done against gravity greater?',
      choices: [
        {
          id: 'p1',
          text: 'Case B, because the 15-meter ramp distance is much longer.',
          isCorrect: false,
          misconceptionExplanation: 'On an incline, the required pushing force F = mg sinθ is proportionally smaller by the exact same ratio that distance is longer.',
        },
        {
          id: 'p2',
          text: 'Work done against gravity is exactly equal in both cases (E_p = mgh).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Case A, because vertical lifting is harder on human muscles.',
          isCorrect: false,
          misconceptionExplanation: 'Mechanical work against gravity depends strictly on net elevation Δh, not path duration or muscle exertion.',
        },
      ],
      correctExplanation:
        'Gravitational potential energy E_p = mgh is a state function of vertical elevation h. On a frictionless incline of length L and height h, the parallel force component is F = mg sinθ = mg(h/L). Work done is W = F × L = [mg(h/L)] × L = mgh. Path shape and length do not alter work done against gravity.',
      relevantFormula: 'W = F \\cdot L = \\left(mg \\frac{h}{L}\\right) L = mgh = 10 \\times 9.8 \\times 5 = 490\\text{ J}',
    },
    relatedConcepts: [
      { id: 'ncert9-energy-conservation', name: 'Conservation of Energy', subject: 'physics' },
      { id: 'ncert9-work-done-force', name: 'Work Done by Force', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Hydroelectric Dam Reservoirs',
        description: 'Dams store millions of cubic meters of river water at high elevation; opening sluice gates converts gravitational potential energy (mgh) into electricity.',
      },
      {
        title: 'Roller Coaster Lift Hills',
        description: 'Motorized chain lifts pull roller coaster trains to the apex of the first hill, storing potential energy that drives the entire circuit of loops and hills.',
      },
      {
        title: 'Pumped Hydro Energy Storage (PHES)',
        description: 'Renewable power grids pump water uphill during sunny hours and release it through turbines at night, acting as giant gravitational batteries.',
      },
    ],
  },
  {
    id: 'ncert9-energy-conservation',
    title: 'Law of Conservation of Mechanical Energy in Free Fall',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Energy can neither be created nor destroyed, only transformed from one form to another',
    description:
      'The Law of Conservation of Energy states that energy can only be converted from one form to another; the total energy of an isolated system remains constant. For a body of mass m falling freely under gravity from height h: At the top (point A), v = 0, so E_A = 0 + mgh = mgh. At midway point B (height h - x), velocity is v = √(2gx), so E_B = ½m(2gx) + mg(h - x) = mgx + mgh - mgx = mgh. Just before striking ground (point C), height is 0 and v = √(2gh), so E_C = ½m(2gh) + 0 = mgh. Total mechanical energy E = K + U remains constant throughout the entire descent.',
    formulaLaTeX: 'E_{\\text{total}} = E_k + E_p = \\frac{1}{2} m v^2 + m g h = \\text{constant}',
    formulaExplanation:
      'As height h decreases, potential energy converts continuously into kinetic energy with constant sum.',
    simulationType: 'work-energy',
    variables: [
      {
        id: 'initialHeightM',
        name: 'Drop Height (h)',
        symbol: 'h_0',
        unit: 'm',
        min: 5,
        max: 50,
        step: 5,
        defaultValue: 20,
        description: 'Starting height of the falling body.',
      },
      {
        id: 'bodyMassKg',
        name: 'Body Mass (m)',
        symbol: 'm',
        unit: 'kg',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 5,
        description: 'Mass of the falling object.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: Energy Conversion at Midpoint of Free Fall',
      scenario:
        'A ball of mass 2 kg is dropped from a height of 20 m. At the exact midpoint of its descent (height = 10 m), what are its kinetic and potential energies? (Take g = 10 m/s²)',
      choices: [
        {
          id: 'p1',
          text: 'Potential energy = 200 J, Kinetic energy = 200 J.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Potential energy = 400 J, Kinetic energy = 0 J.',
          isCorrect: false,
          misconceptionExplanation: 'This is the initial state at the top before dropping, not at the midpoint.',
        },
        {
          id: 'p3',
          text: 'Potential energy = 100 J, Kinetic energy = 300 J.',
          isCorrect: false,
          misconceptionExplanation: 'At exact halfway height (h/2), exactly half of the initial potential energy has converted to kinetic.',
        },
      ],
      correctExplanation:
        'Initial total energy at top = mgh = 2 × 10 × 20 = 400 J. At midpoint (h = 10 m), potential energy E_p = mgh = 2 × 10 × 10 = 200 J. By conservation of energy, kinetic energy E_k = E_total - E_p = 400 - 200 = 200 J. Both kinetic and potential energies are equal to 200 J.',
      relevantFormula: 'E_k = E_{\\text{total}} - m g h = 400 - 200 = 200\\text{ J}',
    },
    relatedConcepts: [
      { id: 'ncert9-kinetic-energy', name: 'Kinetic Energy', subject: 'physics' },
      { id: 'ncert9-potential-energy', name: 'Gravitational Potential Energy', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Bungee Jumping Physics',
        description: 'Gravitational potential energy converts first to kinetic energy during free fall, and then into elastic potential energy as the cord stretches to a halt.',
      },
      {
        title: 'Pendulum Clocks (Grandfather Clock)',
        description: 'A swinging pendulum continuously exchanges potential energy at extreme angles with kinetic energy at the bottom center to tick with regular period.',
      },
      {
        title: 'Pile Driver Construction Hammers',
        description: 'Heavy 5-ton weights hoisted high possess large mgh; releasing them converts potential energy to kinetic impact that drives concrete piles into deep bedrock.',
      },
    ],
  },
  {
    id: 'ncert9-power-commercial-energy',
    title: 'Rate of Doing Work: Power & Commercial Energy Unit (kWh)',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Power is rate of energy consumption (P = W/t); 1 kWh = 3.6 × 10⁶ Joules',
    description:
      'Power measures the speed at which work is done or energy is consumed: Power = Work Done / Time = W / t. The SI unit of power is Watt (W) = 1 Joule per second (J/s), named after James Watt. A more powerful machine does the same work in less time. In daily life and utility billing, the Joule is too small, so electricity boards bill in kilowatt-hours (kWh) or "Units": 1 kWh is the energy consumed by a 1000 W appliance operating continuously for 1 hour: 1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ Joules.',
    formulaLaTeX: 'P = \\frac{W}{t} = \\frac{E}{t}, \\quad 1\\text{ Watt} = 1\\text{ J/s}, \\quad 1\\text{ kWh} = 3.6 \\times 10^6\\text{ J} = 3.6\\text{ MJ}',
    formulaExplanation:
      'Commercial electrical energy consumption: Energy (kWh) = Power (kW) × Time (hours). 1 Unit = 1 kWh.',
    simulationType: 'work-energy',
    variables: [
      {
        id: 'powerWatts',
        name: 'Appliance Power Rating',
        symbol: 'P',
        unit: 'W',
        min: 50,
        max: 2500,
        step: 50,
        defaultValue: 1000,
        description: 'Electrical power rating of appliance.',
      },
      {
        id: 'operatingHours',
        name: 'Daily Usage Hours',
        symbol: 't_{\\text{daily}}',
        unit: 'hours',
        min: 1,
        max: 24,
        step: 1,
        defaultValue: 5,
        description: 'Number of hours operated per day.',
      },
      {
        id: 'billingDays',
        name: 'Billing Period Days',
        symbol: 'N',
        unit: 'days',
        min: 1,
        max: 31,
        step: 1,
        defaultValue: 30,
        description: 'Billing cycle duration in days.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: Electric Heater Energy Consumption in Units',
      scenario:
        'An electric heater is rated 1500 W. How much electrical energy does it consume in 10 hours in commercial "units" (kWh)?',
      choices: [
        {
          id: 'p1',
          text: '15 Units (15 kWh).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: '15000 Units.',
          isCorrect: false,
          misconceptionExplanation: '15000 is Watt-hours (Wh). Commercial units are kiloWatt-hours (kWh) = Wh / 1000.',
        },
        {
          id: 'p3',
          text: '1.5 Units.',
          isCorrect: false,
          misconceptionExplanation: '1500 W × 10 h = 15,000 Wh = 15 kWh.',
        },
      ],
      correctExplanation:
        'Power P = 1500 W = 1.5 kW. Time t = 10 hours. Energy = Power × Time = 1.5 kW × 10 h = 15 kWh. Since 1 commercial unit of electricity = 1 kWh, the heater consumes exactly 15 Units of electricity.',
      relevantFormula: 'E = P \\times t = \\frac{1500}{1000}\\text{ kW} \\times 10\\text{ h} = 15\\text{ kWh} = 15\\text{ Units}',
    },
    relatedConcepts: [
      { id: 'ncert9-work-done-force', name: 'Work Done by Force', subject: 'physics' },
      { id: 'current-electricity', name: 'Electric Current & Ohm\'s Law', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Household Electric Meter Utility Bills',
        description: 'Residential power meters log kilowatt-hours; monthly electricity tariffs multiply total kWh units by local kilowatt-hour rates.',
      },
      {
        title: 'Electric Vehicle (EV) Battery Capacity',
        description: 'EV battery packs are rated in kilowatt-hours (e.g. 60 kWh to 100 kWh), dictating maximum driving range before recharging.',
      },
      {
        title: 'Solar Photovoltaic Inverter Sizing',
        description: 'Rooftop solar panels specify peak kilowatt rating (kWp) to match household air conditioner and refrigerator power draw.',
      },
    ],
  },

  // --- CHAPTER: SOUND ---
  {
    id: 'ncert9-sound-propagation',
    title: 'Production & Propagation of Sound: Longitudinal Compression Waves',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Sound is a mechanical wave requiring a material medium to propagate via compressions and rarefactions',
    description:
      'Sound is produced by vibrating objects (vocal cords, tuning forks, guitar strings, drumheads). As a vibrating prong moves forward, it compresses the surrounding air molecules, forming a region of high pressure and density called a Compression (C). As it moves backward, it creates a region of low pressure and density called a Rarefaction (R). Sound is a mechanical longitudinal wave: individual medium particles oscillate back and forth parallel to the direction of wave propagation, transporting energy without net transport of matter. Sound CANNOT travel through a vacuum (demonstrated by the classic Bell Jar experiment).',
    formulaLaTeX: '\\text{Mechanical Longitudinal Wave: } \\vec{v}_{\\text{particle}} \\parallel \\vec{v}_{\\text{wave}}, \\quad \\text{Vacuum Transmission} = 0',
    formulaExplanation:
      'Compressions are regions of high particle density and peak pressure; rarefactions are regions of low particle density and minimum pressure.',
    simulationType: 'shm-oscillator',
    variables: [
      {
        id: 'tuningForkFreq',
        name: 'Vibration Frequency',
        symbol: '\\nu',
        unit: 'Hz',
        min: 100,
        max: 1000,
        step: 50,
        defaultValue: 256,
        description: 'Number of complete compression-rarefaction cycles per second.',
      },
      {
        id: 'amplitudeIntensity',
        name: 'Vibrational Amplitude',
        symbol: 'A',
        unit: 'mm',
        min: 0.1,
        max: 5.0,
        step: 0.2,
        defaultValue: 1.5,
        description: 'Maximal displacement from mean position determining loudness.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: Sound on the Surface of the Moon',
      scenario:
        'Can two astronauts talking normally hear each other speak directly on the surface of the Moon without their radio headsets?',
      choices: [
        {
          id: 'p1',
          text: 'Yes, because low gravity makes sound carry further.',
          isCorrect: false,
          misconceptionExplanation: 'Gravity has negligible effect on sound propagation; a material medium is what is required.',
        },
        {
          id: 'p2',
          text: 'No, because the Moon has no atmosphere/medium to transmit mechanical sound waves.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Yes, but the sound pitch will be 6 times higher.',
          isCorrect: false,
          misconceptionExplanation: 'Zero medium means zero sound transmission.',
        },
      ],
      correctExplanation:
        'Sound is a mechanical wave requiring a material medium (solid, liquid, or gas) to propagate compressions and rarefactions. The Moon has virtually no atmosphere (vacuum). Without air molecules to oscillate, vocal cord sound vibrations cannot propagate. Astronauts must use radio electromagnetic waves, which propagate freely through vacuum.',
      relevantFormula: 'v_{\\text{vacuum}} = 0 \\implies \\text{No Sound Transmission}',
    },
    relatedConcepts: [
      { id: 'ncert9-sound-wave-properties', name: 'Sound Wave Properties', subject: 'physics' },
      { id: 'ncert9-echo-reverberation', name: 'Reflection & Echo of Sound', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Electric Bell in Bell Jar Experiment',
        description: 'Pumping air out of a sealed glass jar causes a ringing electric bell to grow faint and become completely silent, proving vacuum blocks sound.',
      },
      {
        title: 'Acoustic Tuning Forks in Medical Testing',
        description: 'Doctors place vibrating tuning forks against the skull bone (Rinne and Weber tests) to test for conductive hearing loss.',
      },
      {
        title: 'Loudspeaker Diaphragms',
        description: 'Audio speakers oscillate electromagnetic voice coils back and forth, driving the cone to push air molecules into acoustic compressions.',
      },
    ],
  },
  {
    id: 'ncert9-sound-wave-properties',
    title: 'Characteristics of Sound: Frequency, Wavelength & Speed (v = νλ)',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Wavelength λ, Frequency ν, Time Period T, and Wave Speed relation: v = ν · λ',
    description:
      'A sound wave is described by five fundamental characteristics: (1) Wavelength (λ): Distance between two consecutive compressions or rarefactions (m). (2) Frequency (ν): Number of complete oscillations per second (Hz). (3) Time Period (T): Time taken for one complete oscillation (T = 1/ν). (4) Amplitude (A): Magnitude of maximum disturbance (governs loudness, loudness ∝ A²). (5) Wave Speed (v): Distance traversed per second: v = Distance / Time = λ / T = νλ. Pitch depends on frequency (high frequency = shrill high pitch). Loudness depends on amplitude.',
    formulaLaTeX: 'v = \\nu \\lambda = \\frac{\\lambda}{T}, \\quad T = \\frac{1}{\\nu}, \\quad \\text{Loudness} \\propto A^2',
    formulaExplanation:
      'Wave speed v depends on the properties of the transmitting medium. High frequency produces higher pitch; large amplitude produces louder sound.',
    simulationType: 'shm-oscillator',
    variables: [
      {
        id: 'frequencyHz',
        name: 'Sound Frequency (ν)',
        symbol: '\\nu',
        unit: 'Hz',
        min: 100,
        max: 4000,
        step: 50,
        defaultValue: 440,
        description: 'Pitch of sound (440 Hz = Musical A4 note).',
      },
      {
        id: 'speedSoundMs',
        name: 'Speed of Sound in Medium (v)',
        symbol: 'v',
        unit: 'm/s',
        min: 300,
        max: 1500,
        step: 20,
        defaultValue: 340,
        description: 'Air at 20°C ≈ 343 m/s, Water ≈ 1480 m/s.',
      },
    ],
    prediction: {
      prompt: 'NCERT Numerical Check: Calculating Wavelength of a Sound Wave',
      scenario:
        'A sound wave has a frequency of 2 kHz (2000 Hz) and wavelength 35 cm. How long will it take to travel a distance of 1.5 km?',
      choices: [
        {
          id: 'p1',
          text: '2.14 seconds.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: '4.28 seconds.',
          isCorrect: false,
          misconceptionExplanation: 'Check wave speed v = νλ: 2000 × 0.35 = 700 m/s. Time = 1500 / 700 = 2.14 s.',
        },
        {
          id: 'p3',
          text: '0.75 seconds.',
          isCorrect: false,
          misconceptionExplanation: 'Ensure wavelength is converted from cm to meters: 35 cm = 0.35 m.',
        },
      ],
      correctExplanation:
        'Frequency ν = 2000 Hz. Wavelength λ = 35 cm = 0.35 m. Speed of sound v = ν × λ = 2000 × 0.35 = 700 m/s. Distance to travel s = 1.5 km = 1500 m. Time taken t = Distance / Speed = 1500 / 700 = 2.14 seconds.',
      relevantFormula: 'v = \\nu \\lambda = 2000 \\times 0.35 = 700\\text{ m/s}, \\quad t = \\frac{s}{v} = \\frac{1500}{700} = 2.14\\text{ s}',
    },
    relatedConcepts: [
      { id: 'ncert9-sound-propagation', name: 'Sound Wave Propagation', subject: 'physics' },
      { id: 'ncert9-echo-reverberation', name: 'Reflection of Sound & Echo', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Musical Pitch Tuning (Concert Pitch A440)',
        description: 'Orchestras calibrate violins and oboes to exactly 440 Hz so pitch frequencies harmoniously resonate without acoustic beating.',
      },
      {
        title: 'Human Hearing Audible Frequency Band',
        description: 'Young human ears detect frequencies from 20 Hz to 20,000 Hz; aging causes hair cell loss reducing high-frequency reception above 14 kHz.',
      },
      {
        title: 'Noise Cancelling Headphones',
        description: 'Active noise cancelling microphones sample incoming noise waves and invert their phase (180° shift) to achieve destructive acoustic cancellation.',
      },
    ],
  },
  {
    id: 'ncert9-echo-reverberation',
    title: 'Reflection of Sound, Echo Criteria & Reverberation',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: '2d = v · t: Minimum 17.2 m distance for distinct echo in air at 22°C',
    description:
      'Sound bounces off obstacles following the laws of reflection: angle of incidence equals angle of reflection. An echo is the distinct repetition of sound caused by reflection from a distant obstacle. The sensation of sound persists in our brain for about 0.1 second (persistence of hearing). To hear a clear distinct echo, the reflected sound must reach the ear after at least 0.1 s: 2d = v · t => d = (v · 0.1)/2. At 22°C where v = 344 m/s, minimum obstacle distance d = 344 × 0.1 / 2 = 17.2 meters. In auditoriums, repeated multiple reflections produce prolonged sound called reverberation, controlled using acoustic absorbing panels.',
    formulaLaTeX: '2d = v \\cdot t \\implies d_{\\text{min}} = \\frac{v \\times 0.1\\text{ s}}{2} = 17.2\\text{ m} \\quad (\\text{at } 22^\\circ\\text{C})',
    formulaExplanation:
      'Sound travels distance d to obstacle and distance d back to listener (total roundtrip = 2d). Persistence of hearing = 0.1 s.',
    simulationType: 'shm-oscillator',
    variables: [
      {
        id: 'obstacleDistanceM',
        name: 'Reflecting Wall Distance',
        symbol: 'd',
        unit: 'm',
        min: 5,
        max: 100,
        step: 5,
        defaultValue: 25,
        description: 'Distance to tall building or cliff face.',
      },
      {
        id: 'airTemperatureC',
        name: 'Air Temperature',
        symbol: 'T',
        unit: '°C',
        min: 0,
        max: 40,
        step: 5,
        defaultValue: 22,
        description: 'Speed of sound increases ~0.6 m/s per °C.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: Clapping Hands Near a Cliff',
      scenario:
        'A person clapped his hands near a cliff and heard the echo after 5 seconds. What is the distance of the cliff from the person if the speed of sound v is taken as 346 m/s?',
      choices: [
        {
          id: 'p1',
          text: '865 meters.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: '1730 meters.',
          isCorrect: false,
          misconceptionExplanation: '1730 m is the total roundtrip distance (2d). The cliff distance is half: d = 1730 / 2 = 865 m.',
        },
        {
          id: 'p3',
          text: '69.2 meters.',
          isCorrect: false,
          misconceptionExplanation: 'Do not divide speed by time; use 2d = v × t.',
        },
      ],
      correctExplanation:
        'Total roundtrip distance traveled by sound is 2d. Given time t = 5 s, speed v = 346 m/s: 2d = v × t = 346 × 5 = 1730 meters. Therefore, distance of cliff d = 1730 / 2 = 865 meters.',
      relevantFormula: 'd = \\frac{v \\times t}{2} = \\frac{346 \\times 5}{2} = 865\\text{ m}',
    },
    relatedConcepts: [
      { id: 'ncert9-sound-wave-properties', name: 'Sound Wave Properties', subject: 'physics' },
      { id: 'ncert9-ultrasound-sonar', name: 'Ultrasound & SONAR', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Acoustic Design of Concert Halls and Theatres',
        description: 'Architects curve auditorium ceilings and install perforated mineral fiber panels to prevent muddying reverberations while directing sound to all rows.',
      },
      {
        title: 'Megaphones and Stethoscopes',
        description: 'Stethoscope rubber tubes and megaphones use multiple internal acoustic reflections to guide sound waves forward without lateral dispersion.',
      },
      {
        title: 'Bat Biosonar Echolocation',
        description: 'Microbats emit ultrasonic clicks and analyze echo arrival delay to build 3D mental obstacle and insect prey maps in total darkness.',
      },
    ],
  },
  {
    id: 'ncert9-ultrasound-sonar',
    title: 'Ultrasound, Infrasound & SONAR Echo Sounding Applications',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'High-frequency acoustic waves (> 20 kHz) for medical imaging, flaw detection, and SONAR depth ranging',
    description:
      'Sound frequencies below 20 Hz are called Infrasound (produced by elephants, whales, earthquakes). Frequencies above 20,000 Hz (20 kHz) are called Ultrasound (emitted by bats, dolphins, porpoises). Ultrasound possesses high frequency and short wavelength, allowing it to penetrate deep media and travel along straight beams without spreading. Key applications: (1) SONAR (Sound Navigation And Ranging) measures ocean depth and detects submerged submarines using transmitter and detector pulses: 2d = v · t. (2) Medical Ultrasonography (USG) visualizes internal organs. (3) Ultrasonic flaw detection finds invisible internal cracks in metal blocks without destroying them.',
    formulaLaTeX: '2d = v \\cdot t \\implies d = \\frac{v \\cdot t}{2}, \\quad f_{\\text{ultrasound}} > 20{,}000\\text{ Hz}',
    formulaExplanation:
      'Where d is depth of seabed or flaw, v is ultrasound speed in water or metal, and t is pulse transit and reflection return time.',
    simulationType: 'shm-oscillator',
    variables: [
      {
        id: 'waterSpeedMs',
        name: 'Ultrasound Speed in Seawater',
        symbol: 'v',
        unit: 'm/s',
        min: 1400,
        max: 1600,
        step: 10,
        defaultValue: 1531,
        description: 'Speed of ultrasound waves in seawater.',
      },
      {
        id: 'returnTimeS',
        name: 'Echo Transit Time',
        symbol: 't',
        unit: 's',
        min: 0.5,
        max: 8.0,
        step: 0.2,
        defaultValue: 3.42,
        description: 'Time between pulse transmission and echo detection.',
      },
    ],
    prediction: {
      prompt: 'NCERT Check: SONAR Ocean Depth Measurement',
      scenario:
        'A submarine sends out a SONAR signal which returns from an underwater reef in 3.42 seconds. If the speed of sound in seawater is 1531 m/s, what is the distance of the reef from the submarine?',
      choices: [
        {
          id: 'p1',
          text: '2618 meters (2.62 km).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: '5236 meters.',
          isCorrect: false,
          misconceptionExplanation: '5236 m is the two-way roundtrip distance. The one-way distance to the reef is half: d = 5236 / 2 = 2618 m.',
        },
        {
          id: 'p3',
          text: '447 meters.',
          isCorrect: false,
          misconceptionExplanation: 'Do not divide speed by time; use d = (v × t) / 2.',
        },
      ],
      correctExplanation:
        'SONAR pulse travels to the reef and back to the detector: 2d = v × t. Total roundtrip distance = 1531 m/s × 3.42 s = 5236.02 m. Distance of the reef d = 5236.02 / 2 = 2618 meters (approx 2.62 km).',
      relevantFormula: 'd = \\frac{v \\times t}{2} = \\frac{1531 \\times 3.42}{2} = 2618.01\\text{ m}',
    },
    relatedConcepts: [
      { id: 'ncert9-echo-reverberation', name: 'Reflection of Sound', subject: 'physics' },
      { id: 'ncert9-sound-wave-properties', name: 'Sound Wave Characteristics', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Obstetric Ultrasound (USG Baby Scans)',
        description: 'Transducers emit megahertz ultrasound pulses that reflect off tissue density interfaces, generating real-time fetal anatomy imaging with zero ionizing radiation.',
      },
      {
        title: 'Naval Submarine Detection & Bathymetry',
        description: 'Naval vessels ping acoustic SONAR arrays to map underwater topography, shipwrecks, and submerged submarine contacts.',
      },
      {
        title: 'Ultrasonic Kidney Stone Lithotripsy',
        description: 'Focused high-intensity ultrasound shockwaves shatter kidney stones non-invasively into fine sand that passes naturally.',
      },
    ],
  },
  // --- ADDITIONAL CLASS 9 NCERT PHYSICS CURRICULUM CONCEPTS ---
  {
    id: 'ncert9-average-speed-velocity',
    title: 'Average Speed vs Average Velocity in Non-Uniform Motion',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Scalar total distance rate vs vector net displacement rate over multi-leg journeys',
    description:
      'In non-uniform motion, speed varies throughout the journey. Average speed is the ratio of total distance traversed to total time taken (a scalar that can never be zero for a moving body). Average velocity is the ratio of net displacement to total time taken (a vector that equals zero whenever an object returns to its starting point). For uniformly accelerated motion, average velocity simplifies to the arithmetic mean: (u + v) / 2.',
    formulaLaTeX: 'v_{\\text{av}} = \\frac{s_{\\text{total}}}{t_{\\text{total}}}, \\quad \\vec{v}_{\\text{av}} = \\frac{\\Delta \\vec{x}}{t_{\\text{total}}}, \\quad v_{\\text{av}} = \\frac{u + v}{2} \\text{ (uniform } a)',
    formulaExplanation:
      'Average speed accounts for the entire odometer distance. If an object travels distance s_1 with speed v_1 and distance s_2 with speed v_2, total time is s_1/v_1 + s_2/v_2. Average velocity considers only the direct vector change in position Δx.',
    simulationType: 'projectile-motion',
    variables: [
      {
        id: 'distanceForwardM',
        name: 'Forward Leg Distance',
        symbol: 's_1',
        unit: 'm',
        min: 20,
        max: 200,
        step: 10,
        defaultValue: 90,
        description: 'Distance of forward swimming/travel lap.',
      },
      {
        id: 'speedForwardMs',
        name: 'Forward Speed',
        symbol: 'v_1',
        unit: 'm/s',
        min: 1,
        max: 10,
        step: 0.5,
        defaultValue: 3,
        description: 'Constant velocity during forward stage.',
      },
      {
        id: 'distanceReturnM',
        name: 'Return Leg Distance',
        symbol: 's_2',
        unit: 'm',
        min: 0,
        max: 200,
        step: 10,
        defaultValue: 90,
        description: 'Distance of return path back toward starting origin.',
      },
      {
        id: 'speedReturnMs',
        name: 'Return Speed',
        symbol: 'v_2',
        unit: 'm/s',
        min: 1,
        max: 10,
        step: 0.5,
        defaultValue: 2,
        description: 'Constant velocity during return stage.',
      },
    ],
    prediction: {
      prompt: 'NCERT Textbook Challenge: Usha Swimming in a 90-meter Pool',
      scenario:
        'Usha swims in a 90 m long pool. She covers 180 m in one minute by swimming from one end to the other and back along the same straight path. What are her average speed and average velocity?',
      choices: [
        {
          id: 'p1',
          text: 'Average speed = 3 m/s, Average velocity = 0 m/s',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Average speed = 3 m/s, Average velocity = 3 m/s',
          isCorrect: false,
          misconceptionExplanation: 'Incorrect: velocity depends on displacement. Returning to origin gives net displacement = 0 m, so average velocity is 0 m/s.',
        },
        {
          id: 'p3',
          text: 'Average speed = 0 m/s, Average velocity = 0 m/s',
          isCorrect: false,
          misconceptionExplanation: 'Incorrect: speed is a scalar based on actual distance walked/swum (180 m), which is positive and non-zero.',
        },
      ],
      correctExplanation:
        'Total distance covered = 90 m + 90 m = 180 m in 60 s. Average speed = 180 m / 60 s = 3 m/s. Because she finishes at the initial origin point, her displacement is exactly 0 m. Average velocity = 0 m / 60 s = 0 m/s.',
      relevantFormula: 'v_{\\text{av}} = \\frac{180\\text{ m}}{60\\text{ s}} = 3\\text{ m/s}, \\quad \\vec{v}_{\\text{av}} = \\frac{0\\text{ m}}{60\\text{ s}} = 0\\text{ m/s}',
    },
    relatedConcepts: [
      { id: 'ncert9-motion-distance-displacement', name: 'Distance vs Displacement', subject: 'physics' },
      { id: 'ncert9-uniform-motion-velocity', name: 'Uniform Motion & Velocity', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Commuter City Traffic & Fuel Economy',
        description: 'A car navigating stop-and-go urban traffic has an instantaneous speed fluctuating between 0 and 60 km/h, but an average trip speed of 24 km/h.',
      },
      {
        title: 'Roundtrip Airline Flights',
        description: 'A commercial plane flying London-New York and back covers 11,000 km distance with zero net displacement and zero vector velocity.',
      },
    ],
  },
  {
    id: 'ncert9-graphical-derivation-equations',
    title: 'Graphical Derivation of the Three Kinematic Equations',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Geometric derivation of v = u + at, s = ut + ½at², and v² - u² = 2as from velocity-time area and slope',
    description:
      'The three kinematic equations for uniformly accelerated motion can be derived rigorously from a velocity-time graph. The slope of the line equals acceleration: a = (v - u) / t, giving v = u + at. The distance s traversed equals the area under the v-t graph (trapezium OABC), partitioned into rectangle OADC (area = u × t) and triangle ABD (area = ½ × (v - u) × t = ½at²). Alternatively, using the trapezium area formula [(u + v)/2] × t and substituting t = (v - u)/a yields 2as = v² - u².',
    formulaLaTeX: 'v = u + at, \\quad s = ut + \\frac{1}{2}at^2, \\quad 2as = v^2 - u^2',
    formulaExplanation:
      'Area under a velocity-time graph always represents the physical displacement. Partitioning the area into base rectangle ut and acceleration triangle ½at² shows why distance grows quadratically with elapsed time t.',
    simulationType: 'projectile-motion',
    variables: [
      {
        id: 'initialVelocityU',
        name: 'Initial Velocity',
        symbol: 'u',
        unit: 'm/s',
        min: 0,
        max: 30,
        step: 1,
        defaultValue: 8,
        description: 'Base height of the velocity-time rectangle.',
      },
      {
        id: 'accelerationA',
        name: 'Uniform Acceleration',
        symbol: 'a',
        unit: 'm/s²',
        min: 0.5,
        max: 10,
        step: 0.5,
        defaultValue: 2.5,
        description: 'Slope of the velocity-time graph.',
      },
      {
        id: 'timeT',
        name: 'Time Duration',
        symbol: 't',
        unit: 's',
        min: 1,
        max: 15,
        step: 1,
        defaultValue: 6,
        description: 'Base width along the time horizontal axis.',
      },
    ],
    prediction: {
      prompt: 'NCERT Graphical Geometry Check: Upper Triangle ABD Area',
      scenario:
        'In the standard NCERT velocity-time graph with initial velocity u > 0 and slope a, the total area under the curve is divided into rectangle OADC and triangle ABD. What does the area of triangle ABD physically represent?',
      choices: [
        {
          id: 'p1',
          text: 'The extra distance (½at²) covered specifically due to acceleration.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'The final peak velocity attained by the vehicle.',
          isCorrect: false,
          misconceptionExplanation: 'Area under a velocity-time graph has units of (m/s) × s = meters (distance), not m/s (velocity).',
        },
        {
          id: 'p3',
          text: 'The rate of change of momentum over time.',
          isCorrect: false,
          misconceptionExplanation: 'Slope or area of kinematic v-t graph does not yield force or rate of momentum without mass.',
        },
      ],
      correctExplanation:
        'The rectangle area (u × t) represents distance the object would have covered if it stayed at steady speed u. The upper triangle area ½ × base × height = ½ × t × (v - u) = ½ × t × (at) = ½at² represents the bonus displacement added purely because it accelerated.',
      relevantFormula: 's = \\text{Area}(OADC) + \\text{Area}(ABD) = ut + \\frac{1}{2}(v - u)t = ut + \\frac{1}{2}at^2',
    },
    relatedConcepts: [
      { id: 'ncert9-equations-of-motion', name: 'Three Kinematic Equations', subject: 'physics' },
      { id: 'ncert9-motion-graphs', name: 'Motion Graphs Analysis', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'High-Speed Bullet Train Braking Distance',
        description: 'Railway engineers use 2as = v² - u² to calculate safety stopping corridors for high-speed trains decelerating at emergency brake rates.',
      },
      {
        title: 'Runway Length Design for Jet Airliners',
        description: 'Airport planners determine minimum takeoff runway length using s = (v² - u²)/(2a) based on aircraft maximum takeoff speed v.',
      },
    ],
  },
  {
    id: 'ncert9-balanced-unbalanced-forces',
    title: 'Balanced vs Unbalanced Forces & Net Resultant Dynamics',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Equilibrium with zero net force vs unbalanced resultant force generating acceleration',
    description:
      'Forces occur when bodies interact. If the vector sum of all external forces acting on a body equals zero (ΣF = 0), the forces are balanced: the body remains at rest or continues in uniform straight-line motion (zero acceleration), though it may undergo elastic deformation (like squishing a sponge or spring). If the net force is non-zero (ΣF ≠ 0), the forces are unbalanced and produce an acceleration in the direction of the net resultant force.',
    formulaLaTeX: '\\vec{F}_{\\text{net}} = \\sum \\vec{F}_i = m\\vec{a}, \\quad \\vec{F}_{\\text{net}} = 0 \\implies \\vec{a} = 0, \\quad \\vec{F}_{\\text{net}} > 0 \\implies \\vec{a} = \\frac{\\vec{F}_{\\text{net}}}{m}',
    formulaExplanation:
      'A wooden block pushed on a rough table does not move initially because opposing static friction balances the push force. Once the push surpasses the maximum static friction threshold, an unbalanced force accelerates the block.',
    simulationType: 'newtons-laws',
    variables: [
      {
        id: 'appliedForceN',
        name: 'Applied Push Force',
        symbol: 'F_1',
        unit: 'N',
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 40,
        description: 'Forward push applied to object.',
      },
      {
        id: 'frictionOpposingN',
        name: 'Opposing Resistance / Friction',
        symbol: 'f',
        unit: 'N',
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 40,
        description: 'Opposing force resisting motion.',
      },
      {
        id: 'massKg',
        name: 'Object Mass',
        symbol: 'm',
        unit: 'kg',
        min: 2,
        max: 20,
        step: 1,
        defaultValue: 5,
        description: 'Inertial mass of the sliding block.',
      },
    ],
    prediction: {
      prompt: 'NCERT Equilibrium Inquiry: Tug of War Stalemate',
      scenario:
        'Two teams in a tug-of-war pull on a central rope with equal horizontal forces of 1500 N in opposite directions. The rope remains stationary. What is the net external force on the rope, and what is the mechanical tension within the rope fibres?',
      choices: [
        {
          id: 'p1',
          text: 'Net force = 0 N, Rope tension = 1500 N',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Net force = 3000 N, Rope tension = 3000 N',
          isCorrect: false,
          misconceptionExplanation: 'Incorrect: opposite forces cancel vectorially (1500 N - 1500 N = 0 N), yielding zero net force.',
        },
        {
          id: 'p3',
          text: 'Net force = 0 N, Rope tension = 0 N',
          isCorrect: false,
          misconceptionExplanation: 'Incorrect: while acceleration is zero, the rope is under severe mechanical tensile stress of 1500 N.',
        },
      ],
      correctExplanation:
        'Because the two 1500 N forces pull in diametrically opposite directions, their vector sum is F_net = 1500 N - 1500 N = 0 N (balanced forces, zero acceleration). However, every cross-section of the rope transmits 1500 N of pulling force, meaning rope tension is 1500 N.',
      relevantFormula: '\\vec{F}_{\\text{net}} = \\vec{F}_1 + \\vec{F}_2 = +1500\\text{ N} - 1500\\text{ N} = 0\\text{ N}, \\quad T = 1500\\text{ N}',
    },
    relatedConcepts: [
      { id: 'ncert9-first-law-inertia', name: "Newton's First Law & Inertia", subject: 'physics' },
      { id: 'ncert9-momentum-second-law', name: "Newton's Second Law & Momentum", subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Cruising Jet Airliner at 900 km/h',
        description: 'When an airliner flies at steady cruising altitude, jet engine forward thrust exactly balances aerodynamic drag, and wing lift exactly balances gravity (ΣF = 0).',
      },
      {
        title: 'Elevator Weightlessness vs Acceleration',
        description: 'When an elevator cable tension equals passenger weight, forces are balanced and passengers feel their normal weight. When accelerating upward, tension is unbalanced.',
      },
    ],
  },
  {
    id: 'ncert9-inertia-and-mass',
    title: 'Mass as the Quantitative Measure of Inertia & Demonstrations',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Inherent resistance of matter to changes in state of rest or uniform motion',
    description:
      'Inertia is the natural tendency of an object to resist changes in its state of rest or of uniform motion along a straight line. Mass is the quantitative measure of inertia: a heavier object possesses greater inertia and requires a larger net force to achieve the same acceleration. Classic demonstrations include flicking a smooth cardboard card from under a heavy 5-rupee coin (the coin drops vertically into the glass due to inertia of rest), passengers lunging forward when bus brakes slam (inertia of motion), and shaking a wet umbrella or beating a carpet to dislodge dust particles.',
    formulaLaTeX: '\\text{Inertia} \\propto m, \\quad \\vec{a} = \\frac{\\vec{F}_{\\text{net}}}{m}, \\quad m_1 a_1 = m_2 a_2',
    formulaExplanation:
      'For a given applied impulse or force, the acceleration produced is inversely proportional to mass. A 5-rupee coin has significantly more mass and inertia than a 1-rupee coin or a plastic token.',
    simulationType: 'newtons-laws',
    variables: [
      {
        id: 'coinMassG',
        name: 'Coin Mass',
        symbol: 'm',
        unit: 'g',
        min: 2,
        max: 50,
        step: 2,
        defaultValue: 9,
        description: 'Mass of coin placed on top of cardboard card.',
      },
      {
        id: 'cardFlickSpeedMs',
        name: 'Card Flick Speed',
        symbol: 'v_{\\text{card}}',
        unit: 'm/s',
        min: 1,
        max: 15,
        step: 1,
        defaultValue: 8,
        description: 'Horizontal speed imparted to cardboard during quick snap flick.',
      },
    ],
    prediction: {
      prompt: 'NCERT Cardboard & Glass Tumbler Activity',
      scenario:
        'A smooth playing card is placed over the mouth of an empty glass tumbler, and a heavy 5-rupee coin is rested on it. When the card is given a sharp horizontal flick with a finger, what happens to the coin?',
      choices: [
        {
          id: 'p1',
          text: 'The coin flies horizontally along with the card across the room.',
          isCorrect: false,
          misconceptionExplanation: 'Incorrect: friction between smooth card and coin during a millisecond flick is too brief to overcome the coin inertia.',
        },
        {
          id: 'p2',
          text: 'The coin drops straight down into the glass tumbler due to inertia of rest.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'The coin levitates upward above the tumbler due to air displacement.',
          isCorrect: false,
          misconceptionExplanation: 'Incorrect: downward gravitational force immediately pulls the unsupported coin into the glass.',
        },
      ],
      correctExplanation:
        'The quick flick acts on the card for a split millisecond, sliding it out. Because of its substantial mass and inertia of rest, the coin tends to maintain its resting position. Once the supporting card is removed, gravity pulls it directly down into the tumbler.',
      relevantFormula: '\\vec{F}_{\\text{friction}} \\Delta t \\approx 0 \\implies \\Delta \\vec{p}_{\\text{coin}} \\approx 0 \\implies \\text{Coin drops vertically under } g',
    },
    relatedConcepts: [
      { id: 'ncert9-first-law-inertia', name: "Newton's First Law of Motion", subject: 'physics' },
      { id: 'ncert9-momentum-second-law', name: "Linear Momentum & Second Law", subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Beating a Dusty Carpet with a Stick',
        description: 'Striking a carpet makes the fabric jerk forward, while dust particles remain behind due to inertia of rest and separate from the fibers.',
      },
      {
        title: 'Safety Seatbelts in Motor Vehicles',
        description: 'When a car brakes abruptly, passenger bodies continue moving forward due to inertia of motion. Seatbelts apply external stopping force to prevent dashboard collision.',
      },
    ],
  },
  {
    id: 'ncert9-impulse-momentum-theorem',
    title: 'Impulse of Force & Cushioning Effect (Catching a Cricket Ball)',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Extending impact time Δt to minimize peak collision force: F_avg = Δp / Δt',
    description:
      'When a body experiences a collision, its momentum changes by Δp = m(v - u). The average impact force is inversely proportional to the duration of contact Δt: F_avg = Δp / Δt. By pulling hands backward while catching a fast cricket ball, a fielder extends the stopping time from 0.02 s to 0.2 s, decreasing the destructive impact force by tenfold. The same principle explains automotive airbags, seatbelts, high jumpers landing on foam mats, and karate strikes (where minimizing Δt maximizes shattering peak force).',
    formulaLaTeX: '\\vec{J} = \\vec{F}_{\\text{avg}} \\Delta t = \\Delta \\vec{p} = m(\\vec{v} - \\vec{u}), \\quad \\vec{F}_{\\text{avg}} = \\frac{m(v - u)}{\\Delta t}',
    formulaExplanation:
      'For a fixed change in momentum Δp, increasing the time interval Δt drastically reduces the stopping force F_avg experienced by the athlete palms.',
    simulationType: 'newtons-laws',
    variables: [
      {
        id: 'ballMassKg',
        name: 'Ball Mass',
        symbol: 'm',
        unit: 'kg',
        min: 0.1,
        max: 0.3,
        step: 0.02,
        defaultValue: 0.16,
        description: 'Standard leather cricket ball mass.',
      },
      {
        id: 'incomingSpeedMs',
        name: 'Incoming Speed',
        symbol: 'u',
        unit: 'm/s',
        min: 10,
        max: 45,
        step: 1,
        defaultValue: 30,
        description: 'Velocity of ball before catch impact.',
      },
      {
        id: 'catchDurationS',
        name: 'Catch Time Duration',
        symbol: '\\Delta t',
        unit: 's',
        min: 0.02,
        max: 0.4,
        step: 0.02,
        defaultValue: 0.15,
        description: 'Time taken to bring ball from velocity u to rest (v = 0).',
      },
    ],
    prediction: {
      prompt: 'NCERT Cricket Catch Comparison: Stiff Hands vs Withdrawn Hands',
      scenario:
        'A 0.16 kg cricket ball traveling at 25 m/s is caught by a fielder. Fielder A stops it abruptly in 0.02 seconds (stiff hands). Fielder B withdraws hands backward, stopping it in 0.20 seconds. What is the impact force experienced by Fielder A compared to Fielder B?',
      choices: [
        {
          id: 'p1',
          text: 'Fielder A experiences 200 N, which is 10 times greater than Fielder B (20 N).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Both experience identical forces because the ball has the same kinetic energy.',
          isCorrect: false,
          misconceptionExplanation: 'Force depends on rate of momentum change (Δp / Δt). Tenfold longer time reduces force by tenfold.',
        },
        {
          id: 'p3',
          text: 'Fielder B experiences a greater force because moving backwards adds extra work.',
          isCorrect: false,
          misconceptionExplanation: 'Withdrawing hands cushions the impact, decreasing deceleration and force.',
        },
      ],
      correctExplanation:
        'Change in momentum Δp = m(0 - u) = 0.16 kg × (-25 m/s) = -4.0 kg·m/s. For Fielder A: F = 4.0 / 0.02 s = 200 N. For Fielder B: F = 4.0 / 0.20 s = 20 N. Withdrawing hands reduces the impact force by 90%, preventing hand injuries.',
      relevantFormula: 'F_A = \\frac{0.16 \\times 25}{0.02} = 200\\text{ N}, \\quad F_B = \\frac{0.16 \\times 25}{0.20} = 20\\text{ N}',
    },
    relatedConcepts: [
      { id: 'ncert9-momentum-second-law', name: "Newton's Second Law & Momentum", subject: 'physics' },
      { id: 'ncert9-conservation-momentum', name: 'Conservation of Momentum', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Automotive Airbags & Crumple Zones',
        description: 'Vehicles are engineered to crumple during crashes, elongating collision duration from 10 ms to 100 ms to diminish peak deceleration forces on passengers.',
      },
      {
        title: 'Karate Brick Breaking Strike',
        description: 'A martial artist strikes a slab with maximum velocity and minimal contact time (milliseconds), generating massive peak force that exceeds stone tensile fracture limits.',
      },
    ],
  },
  {
    id: 'ncert9-recoil-and-propulsion',
    title: 'Recoil of Guns, Rocket Thrust & Action-Reaction Pairs',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Opposite recoil velocity generated during bullet ejection and propellant gas expulsion',
    description:
      'According to Newton Third Law and the Law of Conservation of Momentum, when a gun fires a bullet, the forward force on the bullet is matched by an equal and opposite backward force on the gun. Because the gun has much greater mass than the bullet (M >> m), its backward recoil velocity V_recoil is much smaller: V_recoil = -(m/M) × v_bullet. The same physics governs rocket propulsion (exhaust gases expelled at high velocity produce forward reaction thrust), firefighter hose kicks, and inflated balloons flying when opened.',
    formulaLaTeX: 'm_{\\text{bullet}} v_{\\text{bullet}} + M_{\\text{gun}} V_{\\text{recoil}} = 0 \\implies V_{\\text{recoil}} = -\\frac{m_{\\text{bullet}}}{M_{\\text{gun}}} v_{\\text{bullet}}',
    formulaExplanation:
      'Initial total momentum is zero. After firing, the sum of bullet and gun momenta remains zero, directing recoil opposite to the bullet trajectory.',
    simulationType: 'newtons-laws',
    variables: [
      {
        id: 'bulletMassG',
        name: 'Bullet Mass',
        symbol: 'm_b',
        unit: 'g',
        min: 10,
        max: 60,
        step: 5,
        defaultValue: 20,
        description: 'Mass of projectile bullet.',
      },
      {
        id: 'bulletSpeedMs',
        name: 'Bullet Muzzle Velocity',
        symbol: 'v_b',
        unit: 'm/s',
        min: 100,
        max: 600,
        step: 25,
        defaultValue: 300,
        description: 'Forward muzzle velocity of fired bullet.',
      },
      {
        id: 'gunMassKg',
        name: 'Gun / Rifle Mass',
        symbol: 'M_g',
        unit: 'kg',
        min: 1.0,
        max: 10.0,
        step: 0.5,
        defaultValue: 4.0,
        description: 'Mass of the firearm.',
      },
    ],
    prediction: {
      prompt: 'NCERT Solved Example 8.6: Pistol Recoil Velocity',
      scenario:
        'A bullet of mass 20 g (0.02 kg) is horizontally fired with a velocity of 150 m/s from a pistol of mass 2 kg. What is the recoil velocity of the pistol?',
      choices: [
        {
          id: 'p1',
          text: '-1.5 m/s (backward in opposite direction)',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: '+1.5 m/s (forward in bullet direction)',
          isCorrect: false,
          misconceptionExplanation: 'Incorrect: momentum conservation requires the gun momentum to point opposite to the bullet (negative direction).',
        },
        {
          id: 'p3',
          text: '-15 m/s',
          isCorrect: false,
          misconceptionExplanation: 'Arithmetic error: 0.02 kg × 150 m/s = 3 kg·m/s; divided by 2 kg gives 1.5 m/s, not 15 m/s.',
        },
      ],
      correctExplanation:
        'Total initial momentum before firing = 0. Total final momentum = m_b v_b + M_g V_g = 0. (0.02 kg × 150 m/s) + (2 kg × V_g) = 0 -> 3 + 2 V_g = 0 -> V_g = -1.5 m/s. The negative sign signifies backward recoil.',
      relevantFormula: 'V_g = -\\frac{m_b v_b}{M_g} = -\\frac{0.02 \\times 150}{2} = -1.5\\text{ m/s}',
    },
    relatedConcepts: [
      { id: 'ncert9-third-law-action-reaction', name: "Newton's Third Law of Motion", subject: 'physics' },
      { id: 'ncert9-conservation-momentum', name: 'Conservation of Momentum', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Spaceflight Rocket Propulsion in Vacuum',
        description: 'Rockets carry their own fuel and oxidiser. Expelling combustion exhaust gases backward at 4,000 m/s accelerates the rocket forward in empty space without pushing against air.',
      },
      {
        title: 'Firefighter High-Pressure Hose Reaction',
        description: 'Water exiting an industrial fire hose at 20 m/s exerts an immense backward recoil force, requiring two or three firefighters to anchor the nozzle.',
      },
    ],
  },
  {
    id: 'ncert9-motion-under-gravity',
    title: 'Vertical Motion Under Gravity: Ascent, Peak & Descent',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'One-dimensional vertical kinematics under downward gravitational acceleration g = 9.8 m/s²',
    description:
      'When a ball is thrown vertically upward with initial velocity u, it decelerates under constant downward gravity (a = -g = -9.8 m/s²). At maximum height h_max, its instantaneous vertical velocity is momentarily zero (v = 0), while acceleration remains -9.8 m/s² downward. It then accelerates downward, taking equal time to descend: t_ascent = t_descent = u / g, hitting the ground with the identical speed u (in the absence of air drag).',
    formulaLaTeX: 'v = u - gt, \\quad h = ut - \\frac{1}{2}gt^2, \\quad v^2 = u^2 - 2gh, \\quad h_{\\text{max}} = \\frac{u^2}{2g}',
    formulaExplanation:
      'By sign convention, upward vectors are positive and downward vectors are negative. Gravity always points downward, decelerating upward motion and accelerating downward return.',
    simulationType: 'projectile-motion',
    variables: [
      {
        id: 'launchSpeedUpMs',
        name: 'Initial Upward Velocity',
        symbol: 'u',
        unit: 'm/s',
        min: 5,
        max: 50,
        step: 1,
        defaultValue: 19.6,
        description: 'Upward launch velocity.',
      },
      {
        id: 'gravitationalFieldG',
        name: 'Gravity Acceleration',
        symbol: 'g',
        unit: 'm/s²',
        min: 1.6,
        max: 25,
        step: 0.2,
        defaultValue: 9.8,
        description: 'Local downward gravitational acceleration.',
      },
    ],
    prediction: {
      prompt: 'NCERT Textbook Problem: Stone Thrown Vertically Upward',
      scenario:
        'A stone is thrown vertically upward with a speed of 19.6 m/s. Taking g = 9.8 m/s², what is the total roundtrip time the stone takes before returning to the thrower hand?',
      choices: [
        {
          id: 'p1',
          text: '4.0 seconds (2.0 s ascent + 2.0 s descent)',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: '2.0 seconds',
          isCorrect: false,
          misconceptionExplanation: '2.0 seconds is the time to reach maximum height; total flight time to return is twice this value.',
        },
        {
          id: 'p3',
          text: '1.0 second',
          isCorrect: false,
          misconceptionExplanation: 'Incorrect: using v = u - gt with v = 0 gives t = 19.6 / 9.8 = 2 s for ascent alone.',
        },
      ],
      correctExplanation:
        'At apex, v = 0. Using v = u - gt gives 0 = 19.6 - 9.8 t -> t_up = 2.0 s. By parabolic flight symmetry, descent time equals ascent time: t_down = 2.0 s. Total flight time = 2.0 + 2.0 = 4.0 seconds.',
      relevantFormula: 't_{\\text{total}} = \\frac{2u}{g} = \\frac{2 \\times 19.6}{9.8} = 4.0\\text{ s}',
    },
    relatedConcepts: [
      { id: 'ncert9-free-fall-acceleration', name: 'Free Fall & Acceleration due to Gravity', subject: 'physics' },
      { id: 'ncert9-equations-of-motion', name: 'Equations of Motion', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Geyser Eruptions (Old Faithful)',
        description: 'Geologists calculate geothermal reservoir pressure by measuring maximum water plume height h_max and applying u = √(2gh).',
      },
      {
        title: 'Basketball Rebound Timing',
        description: 'Athletes predict flight hang-time and peak apex using vertical kinematic symmetry during jump shots.',
      },
    ],
  },
  {
    id: 'ncert9-weight-moon-planets',
    title: 'Weight on the Moon & Other Worlds: W_moon = (1/6) W_earth',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Planetary gravitational force scaling with celestial mass M and radius R: g = GM / R²',
    description:
      'While mass is the quantity of matter in a body and remains constant anywhere in the universe (scalar, measured in kg), weight is the gravitational force exerted on that mass by a celestial body: W = mg (vector, measured in Newtons). Because the Moon mass (7.36 × 10²² kg) is 1/100 of Earth and its radius (1.74 × 10⁶ m) is 1/3.7 of Earth, the lunar surface gravity is g_moon ≈ 1.62 m/s², exactly 1/6th of Earth (9.8 m/s²). Consequently, an astronaut weighing 600 N on Earth weighs only 100 N on the Moon.',
    formulaLaTeX: 'g = \\frac{G M}{R^2}, \\quad W = mg, \\quad \\frac{W_{\\text{moon}}}{W_{\\text{earth}}} = \\frac{M_m}{M_e} \\left(\\frac{R_e}{R_m}\\right)^2 \\approx \\frac{1}{6}',
    formulaExplanation:
      'The Moon smaller mass weakens gravity by 100x, but its smaller radius strengthens gravity by (3.7)² ≈ 16x. The combined ratio yields 16/100 ≈ 1/6.',
    simulationType: 'gravitation-orbit',
    variables: [
      {
        id: 'bodyMassKg',
        name: 'Object Mass',
        symbol: 'm',
        unit: 'kg',
        min: 5,
        max: 120,
        step: 5,
        defaultValue: 60,
        description: 'Invariant mass of object across all planets.',
      },
      {
        id: 'earthGravityG',
        name: 'Earth Gravity',
        symbol: 'g_e',
        unit: 'm/s²',
        min: 9.7,
        max: 9.9,
        step: 0.05,
        defaultValue: 9.8,
        description: 'Gravitational acceleration on Earth.',
      },
      {
        id: 'moonGravityG',
        name: 'Moon Gravity',
        symbol: 'g_m',
        unit: 'm/s²',
        min: 1.5,
        max: 1.8,
        step: 0.05,
        defaultValue: 1.63,
        description: 'Gravitational acceleration on Lunar surface.',
      },
    ],
    prediction: {
      prompt: 'NCERT Solved Example 9.4: Mass & Weight on Moon',
      scenario:
        'An object has a mass of 12 kg on Earth. What are its mass and weight on the surface of the Moon? (Take g_earth = 9.8 m/s²)',
      choices: [
        {
          id: 'p1',
          text: 'Mass = 12 kg, Weight = 19.6 N',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Mass = 2 kg, Weight = 19.6 N',
          isCorrect: false,
          misconceptionExplanation: 'Mass is the quantity of matter and never changes when traveling to space or other planets.',
        },
        {
          id: 'p3',
          text: 'Mass = 12 kg, Weight = 117.6 N',
          isCorrect: false,
          misconceptionExplanation: '117.6 N is its weight on Earth (12 × 9.8 N). On the Moon it is 1/6th: 19.6 N.',
        },
      ],
      correctExplanation:
        'Mass is an invariant intrinsic property: mass on Moon = 12 kg. Weight on Moon = (1/6) × W_earth = (1/6) × (12 kg × 9.8 m/s²) = 19.6 N.',
      relevantFormula: 'm_{\\text{moon}} = 12\\text{ kg}, \\quad W_{\\text{moon}} = \\frac{1}{6} W_{\\text{earth}} = \\frac{12 \\times 9.8}{6} = 19.6\\text{ N}',
    },
    relatedConcepts: [
      { id: 'ncert9-free-fall-acceleration', name: 'Free Fall & Mass vs Weight', subject: 'physics' },
      { id: 'ncert9-universal-gravitation', name: 'Universal Law of Gravitation', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Apollo Astronaut Lunar Rovers',
        description: 'Astronauts on Apollo missions bounced effortlessly carrying 80 kg spacesuits because total system weight felt like only 13 kg.',
      },
      {
        title: 'Mars Rover Suspension Calibration',
        description: 'NASA Curiosity and Perseverance rovers are calibrated for Mars gravity (g_mars = 3.71 m/s², ~38% of Earth), allowing lighter chassis suspension.',
      },
    ],
  },
  {
    id: 'ncert9-atmospheric-fluid-pressure',
    title: 'Atmospheric Pressure, Hydraulic Transmission & Hydrostatics',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Atmospheric column weight, Pascal hydraulic principle, and hydrostatic depth pressure',
    description:
      'The blanket of air surrounding Earth exerts immense atmospheric pressure (1 atm ≈ 1.013 × 10⁵ N/m² = 101.3 kPa) on all surfaces, equivalent to supporting a 10-meter column of water. We do not feel crushed because internal fluid blood pressure balances it out. Liquids also exert pressure equally in all directions at a given depth: P = ρgh. In hydraulic jacks and brakes (Pascal Principle), applying a small force on a small piston produces a massive force on a large piston (F₁/A₁ = F₂/A₂).',
    formulaLaTeX: 'P = \\frac{F}{A} = \\rho g h, \\quad P_{\\text{atm}} \\approx 1.013 \\times 10^5\\text{ Pa}, \\quad \\frac{F_1}{A_1} = \\frac{F_2}{A_2}',
    formulaExplanation:
      'Pressure increases linearly with liquid depth h and density ρ. Hydraulic systems amplify force by the ratio of piston cross-sectional areas A₂ / A₁.',
    simulationType: 'ideal-gas',
    variables: [
      {
        id: 'liquidDepthM',
        name: 'Liquid Depth',
        symbol: 'h',
        unit: 'm',
        min: 0.5,
        max: 20,
        step: 0.5,
        defaultValue: 5,
        description: 'Immersion depth beneath the liquid surface.',
      },
      {
        id: 'liquidDensityKgM3',
        name: 'Liquid Density',
        symbol: '\\rho',
        unit: 'kg/m³',
        min: 800,
        max: 13600,
        step: 100,
        defaultValue: 1000,
        description: 'Density of fluid (water = 1000, mercury = 13600).',
      },
      {
        id: 'pistonAreaRatio',
        name: 'Hydraulic Piston Area Ratio A2/A1',
        symbol: 'A_2/A_1',
        unit: 'ratio',
        min: 2,
        max: 50,
        step: 2,
        defaultValue: 20,
        description: 'Mechanical force multiplication ratio in hydraulic press.',
      },
    ],
    prediction: {
      prompt: 'NCERT Everyday Physics: Why Can We Drink with a Straw?',
      scenario:
        'When you drink a cold juice through a plastic straw into your mouth, what is the exact physical mechanism forcing the liquid upward against gravity?',
      choices: [
        {
          id: 'p1',
          text: 'Sucking reduces air pressure inside the straw, allowing higher external atmospheric pressure to push juice up.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'The straw generates a magnetic suction force on polar water molecules.',
          isCorrect: false,
          misconceptionExplanation: 'Suction is not an attractive pull; it is the atmospheric pressure gradient doing work.',
        },
        {
          id: 'p3',
          text: 'The liquid naturally defies gravity inside narrow cylindrical plastic geometries.',
          isCorrect: false,
          misconceptionExplanation: 'Capillary action in a straw is negligible; atmospheric pressure drives the liquid column.',
        },
      ],
      correctExplanation:
        'Sucking removes air from inside the straw, creating a low-pressure partial vacuum. The full atmospheric pressure (~101 kPa) acting on the open juice surface in the cup pushes the juice up into the straw and into your mouth.',
      relevantFormula: '\\Delta P = P_{\\text{atm}} - P_{\\text{straw}} = \\rho g h',
    },
    relatedConcepts: [
      { id: 'ncert9-thrust-and-pressure', name: 'Thrust & Pressure', subject: 'physics' },
      { id: 'ncert9-archimedes-buoyancy', name: "Archimedes' Principle & Buoyancy", subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Automotive Hydraulic Disc Brakes',
        description: 'Light foot pedal pressure transmits Pascal hydraulic fluid pressure equally to calliper pistons, squeezing brake pads with thousands of Newtons against steel rotors.',
      },
      {
        title: 'Deep-Sea Submarine Pressure Hulls',
        description: 'At 1,000 meters depth, hydrostatic water pressure exceeds 100 atmospheres (10 MPa), necessitating thick titanium hulls to avoid implosion.',
      },
    ],
  },
  {
    id: 'ncert9-density-relative-density',
    title: 'Density, Relative Density & Floatation Principle',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Mass-to-volume ratio determining buoyant equilibrium: Why iron ships float but iron nails sink',
    description:
      'Density is mass per unit volume (ρ = m/V, SI unit kg/m³). Relative Density (RD) is the ratio of substance density to the density of pure water at 4°C (1000 kg/m³). Being a pure ratio of identical physical quantities, relative density has no units. An object floats if its average density is less than the fluid (RD < 1) and sinks if denser (RD > 1). A solid iron nail (ρ = 7800 kg/m³) sinks in water, but a steel ship of identical mass floats because its hollow hull encloses vast pockets of air, making its average density much less than water (1000 kg/m³).',
    formulaLaTeX: '\\rho = \\frac{m}{V}, \\quad \\text{Relative Density (RD)} = \\frac{\\rho_{\\text{substance}}}{\\rho_{\\text{water}}}, \\quad \\frac{V_{\\text{submerged}}}{V_{\\text{total}}} = \\frac{\\rho_{\\text{object}}}{\\rho_{\\text{fluid}}}',
    formulaExplanation:
      'Pure water has density 1000 kg/m³ (1 g/cm³). Relative density > 1 indicates sinking in water; RD < 1 indicates floating. The fraction of volume submerged exactly equals the density ratio.',
    simulationType: 'ideal-gas',
    variables: [
      {
        id: 'objectDensityKgM3',
        name: 'Object Density',
        symbol: '\\rho_{\\text{obj}}',
        unit: 'kg/m³',
        min: 200,
        max: 12000,
        step: 100,
        defaultValue: 917,
        description: 'Density of test specimen (e.g. ice = 917, iron = 7800).',
      },
      {
        id: 'fluidDensityKgM3',
        name: 'Fluid Density',
        symbol: '\\rho_{\\text{fluid}}',
        unit: 'kg/m³',
        min: 700,
        max: 1400,
        step: 50,
        defaultValue: 1000,
        description: 'Density of immersing liquid (water = 1000, seawater = 1025).',
      },
      {
        id: 'objectVolumeM3',
        name: 'Total Volume',
        symbol: 'V',
        unit: 'm³',
        min: 0.05,
        max: 2.0,
        step: 0.05,
        defaultValue: 0.5,
        description: 'Total volume displacement of the object.',
      },
    ],
    prediction: {
      prompt: 'NCERT Solved Example 9.7: Silver Block in Mercury',
      scenario:
        'The relative density of silver is 10.8. The density of water is 10³ kg/m³. What is the density of silver in SI units, and will a solid silver cube sink or float in liquid mercury (density = 13.6 × 10³ kg/m³)?',
      choices: [
        {
          id: 'p1',
          text: 'Density = 10.8 × 10³ kg/m³; it will float in mercury because silver is less dense than mercury.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Density = 10.8 kg/m³; it will sink in mercury.',
          isCorrect: false,
          misconceptionExplanation: 'Incorrect: relative density must be multiplied by water density (1000 kg/m³) to obtain SI density in kg/m³.',
        },
        {
          id: 'p3',
          text: 'Density = 10.8 × 10³ kg/m³; it will sink because all metals sink in liquids.',
          isCorrect: false,
          misconceptionExplanation: 'Incorrect: whether an object sinks or floats depends entirely on relative density. Since silver (10.8) < mercury (13.6), it floats.',
        },
      ],
      correctExplanation:
        'Density of silver = Relative Density × Density of water = 10.8 × 1000 kg/m³ = 10,800 kg/m³. Because silver density (10,800 kg/m³) is lower than liquid mercury density (13,600 kg/m³), the silver cube will float in mercury with ~79% of its volume submerged.',
      relevantFormula: '\\rho_{\\text{silver}} = \\text{RD} \\times \\rho_{\\text{water}} = 10.8 \\times 10^3 = 10,800\\text{ kg/m}^3 < 13,600\\text{ kg/m}^3',
    },
    relatedConcepts: [
      { id: 'ncert9-archimedes-buoyancy', name: "Archimedes' Principle & Buoyancy", subject: 'physics' },
      { id: 'ncert9-thrust-and-pressure', name: 'Thrust and Pressure', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Floating Arctic Icebergs (90% Submerged)',
        description: 'Because glacial ice has density 917 kg/m³ and seawater has density 1025 kg/m³, the submerged volume fraction is 917/1025 ≈ 89.5%, leaving only the "tip of the iceberg" visible.',
      },
      {
        title: 'Lactometer & Hydrometer Testing',
        description: 'Lactometers use calibrated floatation depth to measure relative density of milk; if water is added, the milk density drops and the lactometer sinks deeper.',
      },
    ],
  },
  {
    id: 'ncert9-types-of-work-positive-negative-zero',
    title: 'Positive, Negative & Zero Work in Mechanics',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Directional dot product W = F s cos θ determining energy delivery, dissipation, or zero work',
    description:
      'Work done depends on the angle θ between applied force F and displacement s: W = F s cos θ. When force and displacement are in the same direction (θ = 0°), work is positive (energy transferred to the body, e.g. pulling a toy cart). When force opposes displacement (θ = 180°), work is negative (energy extracted from the body, e.g. friction decelerating a skidding car, or gravity when lifting an object). When force is perpendicular to displacement (θ = 90°, cos 90° = 0), work done is exactly zero. Hence, a porter carrying luggage on his head walking horizontally does zero work against gravity, and Earth does zero work on an orbiting satellite in circular orbit.',
    formulaLaTeX: 'W = \\vec{F} \\cdot \\vec{s} = F s \\cos\\theta \\implies \\begin{cases} \\theta = 0^\\circ \\implies W = +Fs \\\\ \\theta = 90^\\circ \\implies W = 0 \\\\ \\theta = 180^\\circ \\implies W = -Fs \\end{cases}',
    formulaExplanation:
      'Perpendicular forces (θ = 90°) alter the direction of velocity (centripetal motion) without changing kinetic energy, so no mechanical work is performed.',
    simulationType: 'work-energy',
    variables: [
      {
        id: 'appliedForceN',
        name: 'Force Magnitude',
        symbol: 'F',
        unit: 'N',
        min: 5,
        max: 100,
        step: 5,
        defaultValue: 50,
        description: 'Magnitude of applied mechanical force.',
      },
      {
        id: 'displacementM',
        name: 'Displacement',
        symbol: 's',
        unit: 'm',
        min: 1,
        max: 25,
        step: 1,
        defaultValue: 10,
        description: 'Displacement traversed along coordinate axis.',
      },
      {
        id: 'forceAngleDeg',
        name: 'Angle Between Force and Motion',
        symbol: '\\theta',
        unit: '°',
        min: 0,
        max: 180,
        step: 15,
        defaultValue: 90,
        description: '0° = same direction, 90° = perpendicular, 180° = opposing.',
      },
    ],
    prediction: {
      prompt: 'NCERT Textbook Challenge: Porter Carrying Luggage on Platform',
      scenario:
        'A porter lifts luggage of 15 kg from the ground and puts it on his head 1.5 m above the ground. He then walks 20 m along a horizontal platform at constant speed. What is the work done by the porter against gravity (i) during lifting, and (ii) while walking horizontally?',
      choices: [
        {
          id: 'p1',
          text: '(i) Lifting: +220.5 J; (ii) Horizontal walk: 0 J',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: '(i) Lifting: +220.5 J; (ii) Horizontal walk: +2940 J',
          isCorrect: false,
          misconceptionExplanation: 'Incorrect: during horizontal walking, the upward supporting force is perpendicular to horizontal displacement (θ = 90°), so cos 90° = 0 and work is zero.',
        },
        {
          id: 'p3',
          text: '(i) Lifting: 0 J; (ii) Horizontal walk: +220.5 J',
          isCorrect: false,
          misconceptionExplanation: 'Incorrect: lifting upward against gravity requires work W = mgh = 15 × 9.8 × 1.5 = 220.5 J.',
        },
      ],
      correctExplanation:
        'During lifting: force is upward and displacement is upward (θ = 0°): W = mgh = 15 kg × 9.8 m/s² × 1.5 m = +220.5 Joules. During horizontal walking: the supporting force is vertical while displacement is horizontal (θ = 90°): W = F s cos 90° = 0 Joules. In physics, carrying a load horizontally does zero work against gravity.',
      relevantFormula: 'W_{\\text{lift}} = mgh = 15 \\times 9.8 \\times 1.5 = 220.5\\text{ J}, \\quad W_{\\text{walk}} = F s \\cos(90^\\circ) = 0\\text{ J}',
    },
    relatedConcepts: [
      { id: 'ncert9-work-done-force', name: 'Work Done by a Force', subject: 'physics' },
      { id: 'ncert9-kinetic-energy', name: 'Kinetic Energy & Work-Energy Theorem', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Planetary Orbits & Centripetal Gravity',
        description: 'The Sun gravity is always perpendicular to Earth orbital velocity vector (θ = 90°), meaning gravity does zero work on Earth, preserving constant orbital kinetic energy.',
      },
      {
        title: 'Vehicle Brake Shoes (Negative Work)',
        description: 'Friction between brake pads and spinning wheels acts at θ = 180° opposite to motion, doing negative work that converts kinetic energy into dissipated brake heat.',
      },
    ],
  },
  {
    id: 'ncert9-forms-interconversion-energy',
    title: 'Interconversion of Energy Forms & Universal Energy Conservation',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Transformation across mechanical, chemical, thermal, electrical, and radiant energy domains',
    description:
      'According to the Law of Conservation of Energy, energy can neither be created nor destroyed; it can only be transformed from one form to another. The total energy of an isolated system remains constant. In a hydroelectric dam, water gravitational potential energy converts to kinetic energy of falling water, which turns turbine blades into mechanical rotational energy, and electromagnetic generators convert it to electrical energy. In green plants, radiant solar light energy transforms into chemical bond energy (glucose) via photosynthesis. In oscillating pendulums, potential energy continuously trades with kinetic energy.',
    formulaLaTeX: 'E_{\\text{total}} = E_{\\text{kinetic}} + E_{\\text{potential}} + E_{\\text{thermal}} + E_{\\text{electrical}} = \\text{constant}',
    formulaExplanation:
      'Energy losses in machines always appear as dissipated low-grade thermal heat and acoustic sound energy, keeping total energy invariant.',
    simulationType: 'work-energy',
    variables: [
      {
        id: 'waterHeightDamM',
        name: 'Dam Water Reservoir Height',
        symbol: 'h',
        unit: 'm',
        min: 10,
        max: 100,
        step: 5,
        defaultValue: 50,
        description: 'Gravitational head elevation of stored water.',
      },
      {
        id: 'waterFlowRateKgS',
        name: 'Water Flow Rate',
        symbol: '\\dot{m}',
        unit: 'kg/s',
        min: 100,
        max: 5000,
        step: 100,
        defaultValue: 1000,
        description: 'Mass of water passing through turbine penstock per second.',
      },
      {
        id: 'generatorEfficiencyPct',
        name: 'Turbine-Generator Efficiency',
        symbol: '\\eta',
        unit: '%',
        min: 40,
        max: 95,
        step: 5,
        defaultValue: 85,
        description: 'Percentage of mechanical energy converted into electricity.',
      },
    ],
    prediction: {
      prompt: 'NCERT Audio Transducer Chain: Microphone to Loudspeaker',
      scenario:
        'When a singer performs into a microphone connected through an amplifier to a stage loudspeaker, what exact energy transformations take place in order?',
      choices: [
        {
          id: 'p1',
          text: 'Sound energy → Electrical energy (microphone) → Electrical energy → Sound energy (loudspeaker)',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Electrical energy → Sound energy (microphone) → Sound energy → Electrical energy (loudspeaker)',
          isCorrect: false,
          misconceptionExplanation: 'Incorrect: microphones receive sound waves and generate electrical currents; speakers do the reverse.',
        },
        {
          id: 'p3',
          text: 'Thermal energy → Chemical energy → Nuclear radiation',
          isCorrect: false,
          misconceptionExplanation: 'Incorrect: sound amplification operates strictly in the acoustic and electromagnetic domains.',
        },
      ],
      correctExplanation:
        'The sound pressure waves from the singer voice vibrate a delicate diaphragm in the microphone, generating an alternating electrical signal (sound -> electrical). The amplifier strengthens the signal, and the loudspeaker electromagnetic coil pushes a paper cone to vibrate the surrounding air, recreating sound waves (electrical -> sound).',
      relevantFormula: '\\text{Sound Wave} \\xrightarrow{\\text{Mic}} \\text{Electrical Signal} \\xrightarrow{\\text{Amp}} \\text{Amplified Signal} \\xrightarrow{\\text{Speaker}} \\text{Sound Wave}',
    },
    relatedConcepts: [
      { id: 'ncert9-energy-conservation', name: 'Conservation of Mechanical Energy', subject: 'physics' },
      { id: 'ncert9-potential-energy', name: 'Gravitational Potential Energy', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Hydroelectric Power Dams (Tehri / Hoover)',
        description: 'Massive gravitational potential energy of reservoir water is converted to kinetic energy in penstocks and converted to electricity at >90% mechanical efficiency.',
      },
      {
        title: 'Electric Vehicles (Regenerative Braking)',
        description: 'During braking, EV drive motors run in reverse as generators, converting vehicle kinetic energy back into chemical potential energy stored in lithium battery packs.',
      },
    ],
  },
  {
    id: 'ncert9-speed-sound-media',
    title: 'Speed of Sound in Media, Temperature & Sonic Booms',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Elastic modulus and density governing acoustic speed: v_solid > v_liquid > v_gas',
    description:
      'The speed of sound depends on the properties of the medium through which it travels: elasticity, density, and temperature. Sound travels fastest in solids (elastic tightly packed lattices restore vibrating particles rapidly), slower in liquids, and slowest in gases: v_aluminium (6420 m/s) > v_water (1498 m/s) > v_air at 20°C (343 m/s). As the temperature of air increases, the speed of sound increases (v ≈ 331 + 0.6 × T°C m/s). When an aircraft travels faster than the speed of sound (supersonic, Mach > 1), it pushes air molecules faster than acoustic pressure waves can disperse, creating conical shockwaves that produce a thunderous sonic boom.',
    formulaLaTeX: 'v = \\sqrt{\\frac{B}{\\rho}}, \\quad v_{\\text{solid}} > v_{\\text{liquid}} > v_{\\text{gas}}, \\quad v(T) \\approx 331 + 0.61 \\cdot T(^\\circ\\text{C})',
    formulaExplanation:
      'Bulk modulus B measures resistance to compression; density ρ measures inertia. Higher elasticity in steel and granite overcomes higher density, producing ultra-high acoustic propagation speeds.',
    simulationType: 'shm-oscillator',
    variables: [
      {
        id: 'airTemperatureC',
        name: 'Air Temperature',
        symbol: 'T',
        unit: '°C',
        min: -20,
        max: 50,
        step: 2,
        defaultValue: 20,
        description: 'Ambient temperature affecting gas particle thermal speed.',
      },
      {
        id: 'aircraftMachNumber',
        name: 'Aircraft Mach Number',
        symbol: 'M',
        unit: 'Mach',
        min: 0.5,
        max: 3.0,
        step: 0.1,
        defaultValue: 1.4,
        description: 'Ratio of flight speed to ambient sound speed (M > 1 is supersonic).',
      },
    ],
    prediction: {
      prompt: 'NCERT Textbook Thought Experiment: Train Tracks Hearing Trick',
      scenario:
        'If you place your ear directly against a long continuous steel railway track, why do you hear the sound of an approaching train click-clack twice: first through the rail, and a few seconds later through the air?',
      choices: [
        {
          id: 'p1',
          text: 'Sound travels roughly 15 times faster through steel (~5100 m/s) than through air (~343 m/s), arriving through the rail first.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'The train locomotive engine emits two distinct sounds with a built-in time delay.',
          isCorrect: false,
          misconceptionExplanation: 'A single physical impact generates both sound waves simultaneously.',
        },
        {
          id: 'p3',
          text: 'Steel absorbs sound and re-transmits it as radio electromagnetic waves.',
          isCorrect: false,
          misconceptionExplanation: 'Both waves are mechanical longitudinal sound waves; the difference is medium propagation speed.',
        },
      ],
      correctExplanation:
        'Steel has immense elastic modulus compared to compressible air. Sound speeds along steel rails at ~5100 m/s, covering 1 km in just 0.20 seconds. In air (343 m/s), that same wave takes nearly 2.92 seconds to reach your ear, producing two distinct audible arrivals separated by ~2.7 seconds.',
      relevantFormula: '\\Delta t = t_{\\text{air}} - t_{\\text{steel}} = \\frac{d}{v_{\\text{air}}} - \\frac{d}{v_{\\text{steel}}} = \\frac{1000}{343} - \\frac{1000}{5100} \\approx 2.72\\text{ s}',
    },
    relatedConcepts: [
      { id: 'ncert9-sound-propagation', name: 'Sound Wave Propagation', subject: 'physics' },
      { id: 'ncert9-sound-wave-properties', name: 'Sound Wave Characteristics', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Earthquake P-Waves vs S-Waves',
        description: 'Primary seismic waves are longitudinal sound-like compression waves traveling through Earth crust rock at 6,000 m/s, alerting early-warning detection systems.',
      },
      {
        title: 'Supersonic Aircraft Sonic Booms',
        description: 'Concorde and modern fighter jets flying above Mach 1 drag a cone of high-pressure compressed air across the terrain, perceived on the ground as twin explosive thuds.',
      },
    ],
  },
  {
    id: 'ncert9-structure-human-ear',
    title: 'Structure & Auditory Mechanism of the Human Ear',
    subject: 'physics',
    gradeLevel: 'Class 9',
    tagline: 'Anatomy and physics of outer, middle, and inner ear transducing sound waves into nerve signals',
    description:
      'The human ear is a biological sensory transducer that converts longitudinal air pressure variations into electrical nerve impulses. It comprises three compartments: (1) Outer Ear: The pinna collects compressions and directs them down the auditory canal to vibrate the thin tympanic membrane (eardrum). (2) Middle Ear: Three tiny interlocking bones or ossicles (malleus/hammer, incus/anvil, and stapes/stirrup) act as a hydraulic lever system, amplifying the pressure vibrations by approximately 20 to 30 times. (3) Inner Ear: The vibrating stirrup strikes the oval window, setting fluid waves in motion inside the snail-shaped cochlea. Cochlear sensory hair cells detect these frequencies and transduce mechanical motion into electrical impulses transmitted via the auditory nerve to the brain.',
    formulaLaTeX: '\\text{Pressure Gain} \\approx \\frac{A_{\\text{eardrum}}}{A_{\\text{oval window}}} \\times \\text{Lever Ratio} \\approx \\frac{55\\text{ mm}^2}{3.2\\text{ mm}^2} \\times 1.3 \\approx 22\\times',
    formulaExplanation:
      'The eardrum area is ~17x larger than the oval window. Concentrating force from a large area onto a tiny footprint amplifies acoustic pressure to drive viscous cochlear liquid.',
    simulationType: 'shm-oscillator',
    variables: [
      {
        id: 'soundFrequencyHz',
        name: 'Incoming Sound Frequency',
        symbol: 'f',
        unit: 'Hz',
        min: 50,
        max: 18000,
        step: 50,
        defaultValue: 1000,
        description: 'Frequency of audible sound wave (audible range: 20 Hz - 20 kHz).',
      },
      {
        id: 'soundIntensityDb',
        name: 'Sound Pressure Level',
        symbol: 'L',
        unit: 'dB',
        min: 20,
        max: 120,
        step: 5,
        defaultValue: 65,
        description: 'Acoustic decibel loudness level (whisper = 30 dB, conversation = 60 dB).',
      },
      {
        id: 'eardrumVibrationUm',
        name: 'Eardrum Vibration Amplitude',
        symbol: 'A_{\\text{tympanic}}',
        unit: 'μm',
        min: 0.1,
        max: 10,
        step: 0.1,
        defaultValue: 1.2,
        description: 'Physical displacement amplitude of tympanic membrane.',
      },
    ],
    prediction: {
      prompt: 'NCERT Ear Anatomy Inquiry: Purpose of the Middle Ear Bones',
      scenario:
        'Why does the middle ear contain three tiny interlocking bones (hammer, anvil, and stirrup) instead of connecting the eardrum directly to the cochlea?',
      choices: [
        {
          id: 'p1',
          text: 'They act as a hydraulic lever system, amplifying sound pressure ~22 times to overcome the high resistance of cochlear liquid.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'They convert sound waves into radio electromagnetic waves before entering the skull.',
          isCorrect: false,
          misconceptionExplanation: 'The ear operates purely by mechanical pressure transduction and bio-electric ionic nerve action potentials.',
        },
        {
          id: 'p3',
          text: 'They block all loud sounds completely to eliminate the sensation of noise.',
          isCorrect: false,
          misconceptionExplanation: 'While the stapedius muscle provides minor attenuation for loud noise, the primary purpose is acoustic impedance matching amplification.',
        },
      ],
      correctExplanation:
        'Air has very low acoustic impedance, while the perilymph fluid inside the cochlea has high impedance (like water). If sound hit the fluid directly, 99.9% of sound energy would bounce off. The ossicle lever system concentrates force from the wide eardrum (55 mm²) onto the tiny oval window (3.2 mm²), magnifying pressure ~22 times so fluid waves can stimulate cochlea hair cells.',
      relevantFormula: 'P_{\\text{cochlea}} = \\frac{A_{\\text{eardrum}}}{A_{\\text{oval}}} \\times \\text{Lever Ratio} \\times P_{\\text{air}} \\approx 22 \\cdot P_{\\text{air}}',
    },
    relatedConcepts: [
      { id: 'ncert9-sound-propagation', name: 'Sound Propagation & Longitudinal Waves', subject: 'physics' },
      { id: 'ncert9-sound-wave-properties', name: 'Sound Wave Properties', subject: 'physics' },
    ],
    realWorldApplications: [
      {
        title: 'Cochlear Bionic Implants',
        description: 'For patients with damaged cochlear hair cells, electronic cochlear implants bypass the ear canal and middle ear bones, stimulating the auditory nerve directly with electrode arrays.',
      },
      {
        title: 'Eustachian Tube Ear-Popping During Flights',
        description: 'When an airplane climbs, outside air pressure drops. The Eustachian tube opens during swallowing to equalize air pressure between the middle ear cavity and atmosphere.',
      },
    ],
  },
  ...NCERT_CLASS9_CHEMISTRY_CONCEPTS,
  ...NCERT_CLASS9_BIOLOGY_CONCEPTS,
  ...NCERT_CLASS10_PHYSICS_CONCEPTS,
  ...NCERT_CLASS11_PHYSICS_CONCEPTS,
  ...NCERT_CLASS12_PHYSICS_CONCEPTS,
  ...NCERT_CLASS10_CHEMISTRY_CONCEPTS,
  ...NCERT_CLASS11_CHEMISTRY_CONCEPTS,
  ...NCERT_CLASS12_CHEMISTRY_CONCEPTS,
  ...NCERT_CLASS10_BIOLOGY_CONCEPTS,
  ...NCERT_CLASS11_BIOLOGY_CONCEPTS,
  ...NCERT_CLASS12_BIOLOGY_CONCEPTS,
];

