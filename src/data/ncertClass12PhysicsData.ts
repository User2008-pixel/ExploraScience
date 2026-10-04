import { ConceptItem } from '../types/science';

export const NCERT_CLASS12_PHYSICS_CONCEPTS: ConceptItem[] = [
  // =========================================================================
  // CHAPTER 1: ELECTRIC CHARGES AND FIELDS
  // =========================================================================
  {
    id: 'ncert12-phy-coulomb-law-electrostatics',
    title: 'Coulomb’s Law & Principle of Superposition',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'Electrostatic force between point charges in vacuum: F = (1/4πε₀) · (q₁q₂ / r²)',
    description:
      'Coulomb’s Law states that the electrostatic force of attraction or repulsion between two stationary point charges is directly proportional to the product of the magnitudes of the charges and inversely proportional to the square of the distance between them, acting along the line joining them: F = (1/4πε₀) * (q₁q₂ / r²). In SI units, the electrostatic constant k = 1 / (4πε₀) = 8.98755 × 10⁹ N·m²/C², where ε₀ is the permittivity of free space (8.854 × 10⁻¹² C²/N·m²). For a system of multiple charges, the Principle of Superposition dictates that the total force acting on a given charge is the vector sum of individual forces exerted by all other charges, each computed as if no other charges were present.',
    formulaLaTeX: '\\vec{F}_{12} = \\frac{1}{4 \\pi \\varepsilon_0} \\frac{q_1 q_2}{r^2} \\hat{r}_{12} \\quad | \\quad \\vec{F}_{\\text{net}} = \\sum_{i=2}^N \\vec{F}_{1i}',
    formulaExplanation:
      'Electrostatic force is an inverse-square central force. Like charges repel (+F), unlike charges attract (-F). In a dielectric medium of relative permittivity κ (dielectric constant), the force is reduced by factor κ: F_medium = F_vacuum / κ.',
    variables: [
      {
        id: 'chargeQ1MicroC',
        name: 'Charge q₁',
        symbol: 'q_1',
        unit: 'μC',
        min: -20,
        max: 20,
        step: 1,
        defaultValue: 5,
        description: 'Magnitude and sign of first electrostatic charge.',
      },
      {
        id: 'chargeQ2MicroC',
        name: 'Charge q₂',
        symbol: 'q_2',
        unit: 'μC',
        min: -20,
        max: 20,
        step: 1,
        defaultValue: -5,
        description: 'Magnitude and sign of second electrostatic charge.',
      },
      {
        id: 'distanceR',
        name: 'Separation Distance (r)',
        symbol: 'r',
        unit: 'cm',
        min: 2,
        max: 50,
        step: 2,
        defaultValue: 10,
        description: 'Distance between point charges.',
      },
    ],
    prediction: {
      prompt: 'If the distance between two point charges is halved, what happens to the electrostatic force between them?',
      scenario: 'Charges q1 and q2 are separated by distance r with force F. The distance is decreased to r/2.',
      choices: [
        {
          id: 'p1',
          text: 'Force increases by 4 times (quadruples).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Force doubles (2 times).',
          isCorrect: false,
          misconceptionExplanation:
            'Coulomb’s law follows an inverse-square law (1/r²), not an inverse linear relationship (1/r). Halving r multiplies force by 1 / (1/2)² = 4.',
        },
        {
          id: 'p3',
          text: 'Force decreases by 4 times.',
          isCorrect: false,
          misconceptionExplanation:
            'Electrostatic force is inversely proportional to distance; bringing charges closer always increases the force.',
        },
      ],
      correctExplanation:
        'By Coulomb’s Law, F ∝ 1/r². When r\' = r/2, F\' = k q1 q2 / (r/2)² = 4 * (k q1 q2 / r²) = 4F. Halving the separation quadruples the electrostatic interaction force.',
      relevantFormula: 'F\' = \\frac{k q_1 q_2}{(r/2)^2} = 4F',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Laser Printers & Electrostatic Photocopying (Xerography)',
        description: 'Photosensitive selenium drums are charged electrostatically to attract oppositely charged toner powder particles.',
      },
      {
        title: 'Industrial Electrostatic Precipitators',
        description: 'Smokestack exhaust gases pass through high-voltage corona electrodes, charging airborne fly-ash particles for 99% soot collection.',
      },
    ],
    simulationType: 'class12-physics',
  },
  {
    id: 'ncert12-phy-electric-dipole-gauss-law',
    title: 'Electric Dipole & Gauss’s Law of Electrostatics',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'Dipole moment p = q·2a, torque τ = p × E, and total electric flux Φ = ∮ E·dA = q_enclosed / ε₀',
    description:
      'An Electric Dipole consists of two equal and opposite charges (±q) separated by a small distance 2a. Electric Dipole Moment: vector p = q · 2a directed from -q to +q. When placed in a uniform electric field E: (1) Net force is zero (F_net = 0); (2) Net Torque acts on the dipole: τ = p × E = p E sin(θ), aligning the dipole parallel to E; (3) Potential energy: U = -p · E = -p E cos(θ). Gauss’s Law: The total electric flux (Φ) through any closed Gaussian surface in vacuum is equal to 1/ε₀ times the net charge enclosed by the surface: Φ = ∮ E · dA = q_in / ε₀. Gauss’s law permits elegant derivations of electric field for: (a) Infinitely long linear wire: E = λ / (2πε₀r); (b) Infinite thin plane sheet: E = σ / (2ε₀); (c) Uniformly charged thin spherical shell: E = 0 inside shell, E = q / (4πε₀r²) outside.',
    formulaLaTeX: '\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{\\text{enclosed}}}{\\varepsilon_0} \\quad | \\quad \\vec{\\tau} = \\vec{p} \\times \\vec{E}',
    formulaExplanation:
      'Total electric flux through any closed Gaussian surface depends solely on enclosed charge q_in, independent of the size or shape of the surface.',
    variables: [
      {
        id: 'dipoleMomentP',
        name: 'Dipole Moment (p)',
        symbol: 'p',
        unit: '×10⁻²⁹ C·m',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 6,
        description: 'Magnitude of molecular dipole moment (e.g. water molecule H₂O).',
      },
      {
        id: 'externalElectricFieldE',
        name: 'Electric Field (E)',
        symbol: 'E',
        unit: 'kV/m',
        min: 5,
        max: 100,
        step: 5,
        defaultValue: 40,
        description: 'External uniform electrostatic field strength.',
      },
      {
        id: 'alignmentAngleDeg',
        name: 'Dipole Angle (θ)',
        symbol: '\\theta',
        unit: 'deg',
        min: 0,
        max: 180,
        step: 15,
        defaultValue: 90,
        description: 'Angle between dipole moment vector p and electric field vector E.',
      },
    ],
    prediction: {
      prompt: 'What is the electric field inside a hollow metallic spherical conductor carrying a surface charge Q?',
      scenario: 'A hollow copper sphere of radius R is charged to potential 5000 V. What is E at a distance r < R from the center?',
      choices: [
        {
          id: 'p1',
          text: 'E = 0 everywhere inside the hollow conductor.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'E is maximum at the center of the hollow sphere.',
          isCorrect: false,
          misconceptionExplanation:
            'A spherical Gaussian surface drawn inside (r < R) encloses zero net charge (q_enclosed = 0). By Gauss’s law: ∮ E·dA = 0 => E = 0.',
        },
        {
          id: 'p3',
          text: 'E increases linearly from the center to the surface.',
          isCorrect: false,
          misconceptionExplanation:
            'All electrostatic charge on a conductor resides exclusively on the outer surface; interior field is strictly zero (electrostatic shielding).',
        },
      ],
      correctExplanation:
        'By drawing a spherical Gaussian surface inside the conductor with radius r < R, the enclosed charge is q_enclosed = 0 because all free charges reside on the outer metallic boundary. By Gauss’s law: E * 4πr² = 0 / ε₀ => E = 0 everywhere inside. This principle provides Electrostatic Shielding (Faraday Cages).',
      relevantFormula: '\\oint \\vec{E} \\cdot d\\vec{A} = \\frac{0}{\\varepsilon_0} \\implies E = 0 \\quad (r < R)',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Faraday Cage Lightning Protection in Cars & Aircraft',
        description: 'Metallic fuselages act as closed Gaussian shells (E = 0 inside), protecting passengers from atmospheric lightning strikes.',
      },
      {
        title: 'Microwave Oven Dipole Torque Heating',
        description: 'Oscillating 2.45 GHz electric fields exert rapid alternating torque on water dipoles (τ = p × E), converting rotation into thermal cooking heat.',
      },
    ],
    simulationType: 'class12-physics',
  },

  // =========================================================================
  // CHAPTER 2: ELECTROSTATIC POTENTIAL AND CAPACITANCE
  // =========================================================================
  {
    id: 'ncert12-phy-parallel-plate-capacitor-dielectric',
    title: 'Capacitance & Dielectric Polarisation in Parallel Plate Capacitors',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'C = κε₀A / d: Charge storage, dielectric constant κ, and energy U = ½CV²',
    description:
      'A Capacitor is an arrangement of two conducting plates separated by an insulating dielectric medium, used to store electric charge and electrostatic potential energy. For a Parallel Plate Capacitor of plate area A and separation distance d in vacuum: C₀ = ε₀ A / d. When a dielectric slab of dielectric constant κ is completely inserted between the plates: (1) Dielectric molecules undergo electric polarization, developing induced surface bound charges (±q_p) that create an internal opposing field E_p; (2) The net electric field drops to E = E₀ / κ; (3) The potential difference decreases to V = V₀ / κ; (4) Capacitance increases by factor κ: C = κ C₀ = (κ ε₀ A) / d. Energy Stored: U = ½ C V² = ½ Q V = Q² / (2C). Energy density stored in the electric field: u = ½ ε₀ E² (in J/m³).',
    formulaLaTeX: 'C = \\frac{\\kappa \\varepsilon_0 A}{d} \\quad | \\quad U = \\frac{1}{2} C V^2 = \\frac{Q^2}{2C}',
    formulaExplanation:
      'Dielectric constant κ (relative permittivity ε_r) multiplies the vacuum capacitance C₀. Energy stored in electrostatic field between plates scales quadratically with voltage V.',
    variables: [
      {
        id: 'plateAreaCm2',
        name: 'Plate Area (A)',
        symbol: 'A',
        unit: 'cm²',
        min: 50,
        max: 500,
        step: 50,
        defaultValue: 200,
        description: 'Area of parallel conducting plates.',
      },
      {
        id: 'plateSeparationMm',
        name: 'Plate Separation (d)',
        symbol: 'd',
        unit: 'mm',
        min: 0.5,
        max: 5.0,
        step: 0.5,
        defaultValue: 2.0,
        description: 'Distance separating capacitor plates.',
      },
      {
        id: 'dielectricConstantK',
        name: 'Dielectric Constant (κ)',
        symbol: '\\kappa',
        unit: 'unitless',
        min: 1.0,
        max: 80.0,
        step: 1.0,
        defaultValue: 5.0,
        description: 'Dielectric medium (Air=1, Mica=6, Water=80, Ceramic TiO₂=100).',
      },
    ],
    prediction: {
      prompt: 'A parallel plate capacitor charged by a battery is disconnected from the battery. A dielectric slab (κ = 4) is then inserted between its plates. What happens to the stored electrostatic energy?',
      scenario: 'Battery disconnected => Charge Q remains constant. Dielectric inserted => C\' = 4C.',
      choices: [
        {
          id: 'p1',
          text: 'Energy decreases to one-fourth (U\' = U / 4).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Energy increases by 4 times (U\' = 4U).',
          isCorrect: false,
          misconceptionExplanation:
            'When the battery is disconnected, charge Q is conserved (Q = constant). The energy formula U = Q² / (2C) shows that increasing capacitance C by 4 times reduces stored energy by factor 4. The lost electrical energy is converted into mechanical work attracting the dielectric slab into the plates!',
        },
        {
          id: 'p3',
          text: 'Energy remains constant because charge cannot escape.',
          isCorrect: false,
          misconceptionExplanation:
            'Potential difference drops (V\' = V/4), so energy U = 1/2 Q V drops by factor 4.',
        },
      ],
      correctExplanation:
        'With battery disconnected, charge Q is trapped and conserved. Stored energy is U = Q² / (2C). Inserting the dielectric increases capacitance to C\' = κ C = 4C. Therefore U\' = Q² / (2 * 4C) = U / 4. The decrease in electrostatic field energy equals the positive mechanical work done by the field pulling the dielectric slab into the plates.',
      relevantFormula: 'U\' = \\frac{Q^2}{2 C\'} = \\frac{Q^2}{2 (4C)} = \\frac{U}{4}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Camera Xenon Flash Strobe Units',
        description: 'Capacitors charge slowly over seconds from a 3V battery to store 300V, then dump the entire charge in 1 millisecond into the xenon tube for an intense flash.',
      },
      {
        title: 'Computer DRAM Memory Cells',
        description: 'Millions of microscopic trench capacitors store single binary bits (1 = charged, 0 = uncharged) in dynamic RAM chips.',
      },
    ],
    simulationType: 'class12-physics',
  },

  // =========================================================================
  // CHAPTER 3: CURRENT ELECTRICITY (CLASS 12)
  // =========================================================================
  {
    id: 'ncert12-phy-drift-velocity-kirchhoff-rules',
    title: 'Drift Velocity, Mobility & Kirchhoff’s Circuit Laws',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'vd = -eEτ/m, I = neAvd, Junction Rule (ΣI = 0) & Wheatstone Bridge Balance (P/Q = R/S)',
    description:
      'In a metallic conductor, free conduction electrons move randomly at thermal speeds (~10⁵ m/s) with zero net macroscopic flow. When an electric field E is applied: (1) Electrons experience an electrostatic acceleration a = -eE/m and acquire a slow average steady directional speed called Drift Velocity: v_d = -(e E τ) / m, where τ is the mean relaxation time between successive lattice collisions (typically v_d ~ 1 mm/s); (2) Relation between Current and Drift Velocity: I = n e A v_d, where n is free electron number density (~8.5 × 10²⁸ m⁻³ in copper); (3) Kirchhoff’s First Law (Junction Rule): In any electrical network, the algebraic sum of currents meeting at any junction is zero (Σ I = 0, based on Conservation of Charge); (4) Kirchhoff’s Second Law (Loop Rule): In any closed loop of a network, the algebraic sum of changes in potential is zero (Σ ΔV = 0, based on Conservation of Energy); (5) Wheatstone Bridge: A bridge network of 4 resistors P, Q, R, S is balanced when galvanometer current I_g = 0, satisfying P / Q = R / S.',
    formulaLaTeX: 'I = n e A v_d \\quad | \\quad v_d = \\frac{e E \\tau}{m} \\quad | \\quad \\frac{P}{Q} = \\frac{R}{S}',
    formulaExplanation:
      'Current I depends on electron density n, charge e, cross-sectional area A, and drift velocity v_d. Wheatstone bridge condition P/Q = R/S allows precision resistance measurements independent of galvanometer calibration.',
    variables: [
      {
        id: 'appliedElectricFieldE',
        name: 'Electric Field (E)',
        symbol: 'E',
        unit: 'V/m',
        min: 0.1,
        max: 5.0,
        step: 0.1,
        defaultValue: 1.0,
        description: 'Electric field driving electron drift.',
      },
      {
        id: 'wireAreaA',
        name: 'Conductor Cross-Section (A)',
        symbol: 'A',
        unit: 'mm²',
        min: 0.5,
        max: 5.0,
        step: 0.5,
        defaultValue: 2.0,
        description: 'Cross-sectional area of copper wire.',
      },
    ],
    prediction: {
      prompt: 'If electron drift velocity in copper wiring is only ~1 mm/s, why do household lights turn on almost instantaneously when the wall switch is flipped?',
      scenario: 'A light switch is 10 meters away from the ceiling bulb.',
      choices: [
        {
          id: 'p1',
          text: 'The electromagnetic field wavefront propagates through the wire at nearly the speed of light (~3 × 10⁸ m/s), setting all free electrons into drift motion simultaneously.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Individual electrons travel at the speed of light through the wire.',
          isCorrect: false,
          misconceptionExplanation:
            'Individual electrons drift very slowly (~10⁻⁴ to 10⁻³ m/s) because of frequent collisions with copper lattice ions. It would take hours for one electron to travel 10 meters!',
        },
        {
          id: 'p3',
          text: 'Electrons jump through the air outside the wire.',
          isCorrect: false,
          misconceptionExplanation:
            'Electric current is confined entirely within the conducting metal wire.',
        },
      ],
      correctExplanation:
        'When the circuit switch is closed, an electromagnetic field propagates through the circuit conductors at nearly the speed of light (~10⁸ m/s). This field immediately exerts an electrostatic force on free electrons already present throughout the entire length of the wire, setting them into collective drift motion simultaneously.',
      relevantFormula: 'v_{\\text{signal}} \\sim c \\approx 3 \\times 10^8\\text{ m/s} \\gg v_d \\sim 10^{-3}\\text{ m/s}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Meter Bridge & Strain Gauge Sensors',
        description: 'Wheatstone bridge circuits detect micro-ohm resistance shifts in civil structural health monitoring of suspension bridges.',
      },
      {
        title: 'Semiconductor Hall Effect Sensors',
        description: 'Measuring charge carrier drift velocity and mobility determines whether semiconductors are p-type or n-type.',
      },
    ],
    simulationType: 'class12-physics',
  },

  // =========================================================================
  // CHAPTER 4: MOVING CHARGES AND MAGNETISM
  // =========================================================================
  {
    id: 'ncert12-phy-cyclotron-lorentz-force',
    title: 'Lorentz Magnetic Force & Cyclotron Helical Motion',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'F = q(v × B), circular orbit radius r = mv / qB, and cyclotron resonance frequency ν = qB / 2πm',
    description:
      'A charged particle q moving with velocity v in magnetic field B experiences the Lorentz Magnetic Force: F = q(v × B) = q v B sin(θ). Salient features: (1) F is always perpendicular to velocity v; hence work done by a magnetic force on a charge is strictly zero (W = 0); the kinetic energy and speed remain constant, only direction changes; (2) When v ⟂ B (θ = 90°): Magnetic force provides centripetal force: q v B = m v² / r => Orbital Radius: r = (m v) / (q B) = p / (q B); (3) Period of revolution: T = 2πr / v = (2π m) / (q B); (4) Cyclotron Frequency: ν = 1/T = (q B) / (2π m), which is INDEPENDENT of speed v and orbital radius r (isochronous principle); (5) When v is inclined at angle θ: The parallel component v_parallel = v cos(θ) produces uniform linear drift, while v_perp = v sin(θ) produces circular motion, resulting in a Helical Trajectory with pitch p = v_parallel · T.',
    formulaLaTeX: '\\vec{F} = q (\\vec{v} \\times \\vec{B}) \\quad | \\quad r = \\frac{m v}{q B} \\quad | \\quad \\nu_c = \\frac{q B}{2 \\pi m}',
    formulaExplanation:
      'Centripetal acceleration is supplied entirely by Lorentz force. Cyclotron resonance frequency ν_c is independent of particle speed or energy, allowing synchronized RF voltage acceleration across dees.',
    variables: [
      {
        id: 'particleVelocityKmS',
        name: 'Velocity (v)',
        symbol: 'v',
        unit: '×10⁶ m/s',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 5,
        description: 'Speed of charged particle (proton).',
      },
      {
        id: 'magneticFieldTesla',
        name: 'Magnetic Field (B)',
        symbol: 'B',
        unit: 'T',
        min: 0.2,
        max: 3.0,
        step: 0.2,
        defaultValue: 1.0,
        description: 'Perpendicular magnetic field.',
      },
    ],
    prediction: {
      prompt: 'If the kinetic energy of a proton circulating in a uniform magnetic field is quadrupled, what happens to its orbital radius and its frequency of revolution?',
      scenario: 'Kinetic energy increases from K to 4K in a constant magnetic field B.',
      choices: [
        {
          id: 'p1',
          text: 'Radius doubles (2r), but frequency of revolution remains unchanged.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Radius quadruples (4r) and frequency doubles (2ν).',
          isCorrect: false,
          misconceptionExplanation:
            'Cyclotron frequency ν = qB / (2πm) is strictly independent of particle velocity, kinetic energy, or radius!',
        },
        {
          id: 'p3',
          text: 'Both radius and frequency remain unchanged.',
          isCorrect: false,
          misconceptionExplanation:
            'Since K = 1/2 m v², quadrupling K doubles velocity v. Orbital radius r = mv / (qB) is directly proportional to v, so r doubles.',
        },
      ],
      correctExplanation:
        'Kinetic energy K = p² / (2m). Quadrupling K doubles momentum p (and velocity v). Since orbital radius r = p / (qB), the radius doubles (2r). However, cyclotron frequency ν = qB / (2πm) has no dependence on speed or energy; it remains perfectly constant.',
      relevantFormula: 'r = \\frac{\\sqrt{2mK}}{qB} \\propto \\sqrt{K} \\implies r\' = 2r, \\quad \\nu = \\text{constant}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Hospital Medical Cyclotrons for PET Scan Radioisotopes',
        description: 'Cyclotrons accelerate protons into targets to produce Fluorine-18 (t_1/2 = 110 min) for cancer positron emission tomography.',
      },
      {
        title: 'Earth’s Van Allen Radiation Belts & Aurora Borealis',
        description: 'Solar cosmic electrons and protons are trapped in Earth’s geomagnetic dipole field, executing helical corkscrews toward the magnetic poles.',
      },
    ],
    simulationType: 'class12-physics',
  },

  // =========================================================================
  // CHAPTER 7: ALTERNATING CURRENT
  // =========================================================================
  {
    id: 'ncert12-phy-lcr-resonance-phasor-ac',
    title: 'Series LCR Resonance, Impedance & AC Phasor Diagrams',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'Impedance Z = √[R² + (XL - XC)²], resonant frequency ω₀ = 1/√(LC), and Quality Factor Q',
    description:
      'When an alternating voltage v = V_m sin(ωt) is applied across a series combination of Resistor R, Inductor L, and Capacitor C: (1) Resistor: Current and voltage are in phase (ϕ = 0); (2) Inductor: Voltage leads current by π/2 radians (90°), inductive reactance X_L = ωL; (3) Capacitor: Voltage lags current by π/2 radians (90°), capacitive reactance X_C = 1 / (ωC); (4) Total Impedance (Z): Z = √[R² + (X_L - X_C)²]; (5) Phase angle: tan(ϕ) = (X_L - X_C) / R; (6) Electrical Resonance: Occurs when inductive reactance equals capacitive reactance: X_L = X_C => ωL = 1 / (ωC). At resonant frequency ω₀ = 1 / √(LC): (a) Impedance is at its minimum: Z_min = R; (b) Current amplitude reaches maximum: I_max = V_m / R; (c) Power factor cos(ϕ) = 1 (purely resistive). Quality Factor: Q = (ω₀ L) / R = 1/R · √(L/C) measures resonance sharpness.',
    formulaLaTeX: 'Z = \\sqrt{R^2 + (X_L - X_C)^2} \\quad | \\quad \\omega_0 = \\frac{1}{\\sqrt{LC}} \\quad | \\quad Q = \\frac{1}{R} \\sqrt{\\frac{L}{C}}',
    formulaExplanation:
      'At resonance frequency ω₀ = 1/√(LC), reactive components cancel (XL = XC), leaving pure resistance R and maximum current throughput.',
    variables: [
      {
        id: 'acFrequencyHz',
        name: 'AC Frequency (f)',
        symbol: 'f',
        unit: 'Hz',
        min: 20,
        max: 500,
        step: 10,
        defaultValue: 159,
        description: 'Frequency of applied sinusoidal voltage source (f = ω / 2π).',
      },
      {
        id: 'circuitInductanceMh',
        name: 'Inductance (L)',
        symbol: 'L',
        unit: 'mH',
        min: 10,
        max: 200,
        step: 10,
        defaultValue: 100,
        description: 'Inductance of choke coil.',
      },
      {
        id: 'circuitCapacitanceMicroF',
        name: 'Capacitance (C)',
        symbol: 'C',
        unit: 'μF',
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 10,
        description: 'Capacitance of series capacitor.',
      },
    ],
    prediction: {
      prompt: 'At electrical resonance in a series LCR circuit, what is the phase difference between the applied source voltage and the resulting circuit current?',
      scenario: 'Circuit is tuned to resonant frequency where XL = XC.',
      choices: [
        {
          id: 'p1',
          text: 'Zero (current and voltage are perfectly in phase, cos ϕ = 1).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'π/2 radians (90°).',
          isCorrect: false,
          misconceptionExplanation:
            'A 90° phase shift occurs in purely inductive or purely capacitive circuits. At resonance, XL and XC cancel out completely.',
        },
        {
          id: 'p3',
          text: 'π radians (180°).',
          isCorrect: false,
          misconceptionExplanation:
            'tan ϕ = (XL - XC) / R = 0 / R = 0 => ϕ = 0.',
        },
      ],
      correctExplanation:
        'At resonance, XL = XC. The phase angle formula gives tan(ϕ) = (XL - XC) / R = 0 / R = 0, which means ϕ = 0. The circuit behaves as a purely resistive circuit where the current and voltage waves reach their peaks and zeroes at identical instants.',
      relevantFormula: 'X_L = X_C \\implies \\tan\\phi = \\frac{X_L - X_C}{R} = 0 \\implies \\phi = 0^\\circ',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Radio & TV Receiver Station Tuning',
        description: 'Adjusting a variable ganged capacitor shifts resonant frequency ω₀ to match a specific desired broadcast station carrier frequency.',
      },
      {
        title: 'Wireless Inductive EV Fast Chargers',
        description: 'Primary transmitter and secondary vehicle coils are tuned to identical high-Q resonant frequencies (85 kHz) for 95% power transfer across air gaps.',
      },
    ],
    simulationType: 'class12-physics',
  },

  // =========================================================================
  // CHAPTER 10: WAVE OPTICS
  // =========================================================================
  {
    id: 'ncert12-phy-young-double-slit-interference',
    title: 'Wave Optics: Young’s Double Slit Experiment (YDSE)',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'Constructive vs destructive interference: Fringe width β = λD / d & intensity I = 4I₀ cos²(δ/2)',
    description:
      'In 1801, Thomas Young proved the wave nature of light using the Double Slit Experiment (YDSE). Light from a monochromatic source illuminates two closely spaced narrow slits S1 and S2 (distance d apart). By Huygens’ Principle, S1 and S2 act as two coherent secondary wave sources emitting spherical wavelets that interfere on a screen placed at distance D: (1) Path Difference: Δx = S2P - S1P ≈ (y · d) / D; (2) Bright Fringes (Constructive Interference): Occur when path difference is an integral multiple of wavelength: Δx = nλ => y_n = (n λ D) / d (n = 0, ±1, ±2...); (3) Dark Fringes (Destructive Interference): Occur when path difference is an odd half-integral multiple: Δx = (2n - 1) λ / 2 => y_n\' = (2n - 1) λ D / (2d); (4) Fringe Width (β): The separation between two successive bright or dark fringes is completely constant: β = (λ D) / d; (5) Intensity Distribution: I(y) = 4 I₀ cos²(ϕ / 2), where phase difference ϕ = (2π / λ) · Δx.',
    formulaLaTeX: '\\beta = \\frac{\\lambda D}{d} \\quad | \\quad I(\\delta) = 4 I_0 \\cos^2\\left(\\frac{\\delta}{2}\\right) \\quad | \\quad \\delta = \\frac{2\\pi}{\\lambda} \\frac{y d}{D}',
    formulaExplanation:
      'Fringe width β is directly proportional to wavelength λ and screen distance D, and inversely proportional to slit separation d. Equal-width alternating bright and dark bands form symmetrically about the central bright fringe.',
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
        description: 'Wavelength of monochromatic laser (400 nm violet to 700 nm red).',
      },
      {
        id: 'slitSeparationMm',
        name: 'Slit Separation (d)',
        symbol: 'd',
        unit: 'mm',
        min: 0.1,
        max: 1.0,
        step: 0.05,
        defaultValue: 0.3,
        description: 'Distance between coherent pinhole slits S1 and S2.',
      },
      {
        id: 'screenDistanceM',
        name: 'Screen Distance (D)',
        symbol: 'D',
        unit: 'm',
        min: 0.5,
        max: 3.0,
        step: 0.25,
        defaultValue: 1.5,
        description: 'Distance from double slit plane to viewing screen.',
      },
    ],
    prediction: {
      prompt: 'What happens to the interference fringe width β in Young’s Double Slit Experiment if the entire apparatus is submerged in water (n = 1.33)?',
      scenario: 'The YDSE apparatus is transferred from air into a water tank.',
      choices: [
        {
          id: 'p1',
          text: 'Fringe width decreases by a factor of 1.33 (fringes become narrower).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Fringe width increases by 1.33 times (fringes spread out).',
          isCorrect: false,
          misconceptionExplanation:
            'In water, the frequency of light stays constant while speed slows down (v = c/n), reducing wavelength: λ\' = λ / n. Since β ∝ λ, fringe width must decrease.',
        },
        {
          id: 'p3',
          text: 'The interference pattern disappears completely.',
          isCorrect: false,
          misconceptionExplanation:
            'Interference still occurs as long as the medium is transparent and homogeneous; fringes simply compress closer together.',
        },
      ],
      correctExplanation:
        'In water (refractive index n = 4/3), light wavelength contracts to λ\' = λ / n = λ / 1.33. Since fringe width is given by β = (λ D) / d, the new fringe width becomes β\' = (λ\' D) / d = β / n = β / 1.33. The interference fringes compress closer together.',
      relevantFormula: '\\beta\' = \\frac{\\lambda\' D}{d} = \\frac{(\\lambda / n) D}{d} = \\frac{\\beta}{n}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Anti-Reflective Optical Coatings on Eyeglasses & Camera Lenses',
        description: 'Quarter-wavelength thin film coatings (MgF₂) create destructive interference for reflected green light, transmitting 99.8% of light.',
      },
      {
        title: 'Optical Coherence Tomography (OCT) Retinal Scanners',
        description: 'Ophthalmologists use low-coherence interferometry to image micro-scale cross-sections of the human retina with sub-micron resolution.',
      },
    ],
    simulationType: 'class12-physics',
  },

  // =========================================================================
  // CHAPTER 11: DUAL NATURE OF RADIATION AND MATTER
  // =========================================================================
  {
    id: 'ncert12-phy-photoelectric-effect-einstein',
    title: 'Photoelectric Effect & Einstein’s Quantum Photoelectric Equation',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'K_max = hν - Φ₀ = eV₀: Photons, work function Φ₀, threshold frequency ν₀ & stopping potential V₀',
    description:
      'In 1887, Heinrich Hertz and later Hallwachs and Lenard discovered that metallic surfaces emit electrons when illuminated by ultraviolet light. Classical wave theory failed to explain three experimental facts: (1) Existence of Threshold Frequency (ν₀): Below ν₀, no electrons are emitted regardless of light intensity; (2) Instantaneous emission: Emission occurs within ~10⁻⁹ seconds with zero measurable time lag; (3) Kinetic energy independence: Maximum kinetic energy depends strictly on light frequency ν, not intensity. Einstein’s Photoelectric Theory (Nobel Prize 1921): Light consists of discrete localized packets of energy called Photons (quanta), each of energy E = hν. When a photon collides with an electron in metal, its entire energy is transferred to a single electron: Part is used to overcome the minimum binding energy of the metal (Work Function Φ₀ = hν₀), and the remainder appears as maximum kinetic energy of the ejected photoelectron: K_max = hν - Φ₀ = h(ν - ν₀) = e V₀, where V₀ is the Stopping Potential.',
    formulaLaTeX: 'K_{\\max} = h\\nu - \\Phi_0 = h(\\nu - \\nu_0) = e V_0 \\quad | \\quad \\lambda = \\frac{h}{p}',
    formulaExplanation:
      'Planck constant h = 6.626 × 10⁻³⁴ J·s. Stopping potential V₀ measures the retarding voltage needed to stop the most energetic photoelectrons from reaching the anode.',
    variables: [
      {
        id: 'photonFrequencyThz',
        name: 'Incident Light Frequency (ν)',
        symbol: '\\nu',
        unit: 'THz',
        min: 400,
        max: 1200,
        step: 50,
        defaultValue: 800,
        description: 'Frequency of illuminating photons.',
      },
      {
        id: 'metalWorkFunctionEv',
        name: 'Work Function (Φ₀)',
        symbol: '\\Phi_0',
        unit: 'eV',
        min: 1.8,
        max: 5.5,
        step: 0.1,
        defaultValue: 2.2,
        description: 'Metal work function (Cesium=2.14 eV, Potassium=2.3 eV, Platinum=5.65 eV).',
      },
    ],
    prediction: {
      prompt: 'If the intensity of light incident on a photosensitive metal is doubled while keeping frequency constant (above threshold), what happens to the photocurrent and the maximum kinetic energy of photoelectrons?',
      scenario: 'Light beam power is doubled at frequency ν > ν0.',
      choices: [
        {
          id: 'p1',
          text: 'Photocurrent doubles, but maximum kinetic energy remains completely unchanged.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Both photocurrent and maximum kinetic energy double.',
          isCorrect: false,
          misconceptionExplanation:
            'Intensity represents the number of photons arriving per second. Doubling intensity doubles the number of emitted electrons (photocurrent), but each individual photon still carries the same energy E = hν, so K_max is unaltered!',
        },
        {
          id: 'p3',
          text: 'Maximum kinetic energy doubles, but photocurrent remains constant.',
          isCorrect: false,
          misconceptionExplanation:
            'Kinetic energy depends exclusively on light frequency ν, never on light intensity.',
        },
      ],
      correctExplanation:
        'Light intensity is the number of photons arriving per unit area per second. Higher intensity delivers more photons, liberating more electrons per second, thus doubling the saturation photocurrent (I ∝ Intensity). However, each individual photon energy is unchanged (E = hν); hence K_max = hν - Φ₀ and stopping potential V₀ remain strictly constant.',
      relevantFormula: 'I_{\\text{photo}} \\propto \\text{Intensity}, \\quad K_{\\max} = h\\nu - \\Phi_0 \\quad (\\text{Independent of Intensity})',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Solar Photovoltaic Cells & Photodiodes',
        description: 'Solar panels exploit quantum photoelectric absorption to convert solar photons into electrical grid currents.',
      },
      {
        title: 'Night Vision Photomultiplier Tubes',
        description: 'Photocathodes convert ambient starlight photons into photoelectron showers amplified by dynode cascades.',
      },
    ],
    simulationType: 'class12-physics',
  },

  // =========================================================================
  // CHAPTER 14: SEMICONDUCTOR ELECTRONICS
  // =========================================================================
  {
    id: 'ncert12-phy-pn-junction-diode-rectifier',
    title: 'p-n Junction Diode Characteristics & AC Full-Wave Rectification',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'Forward/Reverse bias IV curve, barrier potential Vb ~ 0.7 V (Si), and AC to DC rectification',
    description:
      'A p-n Junction is formed by doping a single semiconductor crystal (silicon) with acceptor impurities (p-side, majority holes) and donor impurities (n-side, majority electrons): (1) Formation: Diffusion of electrons and holes across the boundary creates a central Depletion Layer devoid of free carriers, leaving uncompensated donor (+q) and acceptor (-q) ions that establish a Barrier Potential (V_b ≈ 0.7 V for Si, 0.3 V for Ge); (2) Forward Bias: p connected to positive terminal, n to negative. Depletion width narrows, barrier height reduces (V_b - V), and current rises exponentially above knee voltage; (3) Reverse Bias: p connected to negative, n to positive. Depletion width widens, barrier height increases (V_b + V), and only a tiny nano-ampere minority leakage current flows until Avalanche Breakdown (Zener voltage V_z); (4) Full-Wave Rectifier: A circuit utilizing two diodes with a center-tapped transformer (or 4 diodes in a bridge) converting alternating sinusoidal AC into unidirectional pulsating DC with 81.2% theoretical efficiency.',
    formulaLaTeX: 'I = I_0 \\left(e^{\\frac{e V}{\\eta k_B T}} - 1\\right) \\quad | \\quad \\eta_{\\text{rectifier}} = \\frac{0.812 \\, R_L}{r_f + R_L}',
    formulaExplanation:
      'Shockley ideal diode equation relates diode current I to forward bias voltage V. Full-wave rectifiers conduct on both positive and negative AC half-cycles, doubling ripple frequency (f_out = 2f_in).',
    variables: [
      {
        id: 'acInputVoltageV',
        name: 'AC Peak Voltage (V_m)',
        symbol: 'V_m',
        unit: 'V',
        min: 3,
        max: 24,
        step: 3,
        defaultValue: 12,
        description: 'Peak secondary AC voltage applied to rectifier.',
      },
      {
        id: 'loadResistanceOhms',
        name: 'Load Resistor (R_L)',
        symbol: 'R_L',
        unit: 'Ω',
        min: 100,
        max: 2000,
        step: 100,
        defaultValue: 1000,
        description: 'Output DC load resistor.',
      },
    ],
    prediction: {
      prompt: 'If the input AC frequency fed to a full-wave rectifier is 50 Hz, what is the output pulsating DC ripple frequency?',
      scenario: 'Standard 50 Hz mains AC converted through a center-tapped two-diode full-wave rectifier.',
      choices: [
        {
          id: 'p1',
          text: '100 Hz (ripple frequency is doubled).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: '50 Hz (same as input frequency).',
          isCorrect: false,
          misconceptionExplanation:
            'A half-wave rectifier outputs 50 Hz pulses (only positive cycles). A full-wave rectifier inverts the negative cycle into a positive pulse, producing two output DC pulses per input cycle: 2 × 50 Hz = 100 Hz!',
        },
        {
          id: 'p3',
          text: '25 Hz (halved frequency).',
          isCorrect: false,
          misconceptionExplanation:
            'Two pulses are delivered per cycle, doubling the frequency, never halving.',
        },
      ],
      correctExplanation:
        'In a full-wave rectifier, both the positive and negative halves of the AC cycle are converted into unidirectional output pulses. Diode D1 conducts during the positive half-cycle and diode D2 conducts during the negative half-cycle. Consequently, for each single input cycle of 50 Hz, two positive pulses appear across the load: f_ripple = 2 * f_in = 2 * 50 = 100 Hz.',
      relevantFormula: 'f_{\\text{ripple}} = 2 f_{\\text{in}} = 2 \\times 50\\text{ Hz} = 100\\text{ Hz}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Smartphone & Laptop AC-to-DC Power Adapters',
        description: 'Full-wave diode bridge rectifiers convert 220V AC household power into smooth 5V/20V DC charging currents.',
      },
      {
        title: 'LED Solid-State Lighting',
        description: 'Forward-biased gallium arsenide phosphide (GaAsP) diodes recombine electrons and holes to emit efficient visible photons directly.',
      },
    ],
    simulationType: 'class12-physics',
  },

  // =========================================================================
  // CHAPTER 5: MAGNETISM AND MATTER
  // =========================================================================
  {
    id: 'ncert12-phy-magnetism-earth-magnetic-field',
    title: 'Magnetism, Bar Magnet Dipole & Earth’s Magnetic Field',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'Magnetic dipole moment M = m·2l, Torque τ = M × B, and Earth’s magnetic elements (D, I, H)',
    description:
      'A Bar Magnet behaves as an equivalent magnetic dipole of magnetic length 2l and pole strength m, having magnetic dipole moment M = m · 2l directed from South to North pole. In an external uniform magnetic field B, torque τ = M × B = M B sin(θ) and potential energy U = -M · B = -M B cos(θ). Gauss’s Law for Magnetism states that net magnetic flux through any closed Gaussian surface is identically zero (∮ B · dA = 0), proving magnetic monopoles do not exist. Earth acts as a giant magnetic dipole tilted by ~11.3° to its rotational axis. The Earth’s magnetic field at any point is completely specified by three Magnetic Elements: (1) Magnetic Declination (θ_D): angle between geographic meridian and magnetic meridian; (2) Magnetic Dip or Inclination (δ): angle made by total earth magnetic field B_E with horizontal (δ = 0° at magnetic equator, δ = 90° at magnetic poles); (3) Horizontal Component: B_H = B_E cos(δ) and vertical component B_V = B_E sin(δ), so B_E = √(B_H² + B_V²) and tan(δ) = B_V / B_H.',
    formulaLaTeX: '\\vec{\\tau} = \\vec{M} \\times \\vec{B} \\quad | \\quad B_H = B_E \\cos(\\delta), \\; B_V = B_E \\sin(\\delta) \\implies \\tan(\\delta) = \\frac{B_V}{B_H}',
    formulaExplanation:
      'Gauss’s law for magnetism mandates isolated magnetic monopoles do not exist. At magnetic poles, the dip needle points vertically downward/upward (δ = 90°, B_H = 0). At magnetic equator, dip angle δ = 0° (B_V = 0).',
    variables: [
      {
        id: 'dipAngleDeg',
        name: 'Angle of Dip (δ)',
        symbol: '\\delta',
        unit: 'deg',
        min: 0,
        max: 90,
        step: 5,
        defaultValue: 60,
        description: 'Angle of inclination with horizontal.',
      },
      {
        id: 'horizontalFieldBhMicroT',
        name: 'Horizontal Component (B_H)',
        symbol: 'B_H',
        unit: 'μT',
        min: 10,
        max: 60,
        step: 5,
        defaultValue: 35,
        description: 'Horizontal component of Earth’s magnetic field.',
      },
    ],
    prediction: {
      prompt: 'At the magnetic poles of the Earth, what is the value of the horizontal component of the magnetic field (B_H)?',
      scenario: 'A dip needle is carried to Earth’s magnetic North Pole where dip angle δ = 90°.',
      choices: [
        {
          id: 'p1',
          text: 'B_H = 0 (Total field is purely vertical).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'B_H is maximum equal to total field B_E.',
          isCorrect: false,
          misconceptionExplanation: 'Since B_H = B_E * cos(90°) and cos(90°) = 0, the horizontal component vanishes entirely at magnetic poles!',
        },
        {
          id: 'p3',
          text: 'B_H is equal to vertical component B_V.',
          isCorrect: false,
          misconceptionExplanation: 'B_H = B_V occurs only where dip angle is 45°, not 90°.',
        },
      ],
      correctExplanation:
        'By definition of magnetic elements, B_H = B_E cos(δ). At the magnetic poles, the total magnetic field vector points straight down into the Earth (δ = 90°). Because cos(90°) = 0, B_H = 0. A standard magnetic compass needle loses all directional orientation at the poles.',
      relevantFormula: 'B_H = B_E \\cos(90^\\circ) = 0',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Geomagnetic Navigation in Aviation & Ships',
        description: 'Aviation flight instruments correct true geographic headings for local magnetic declination variations.',
      },
      {
        title: 'Magnetotactic Bacteria & Migratory Birds',
        description: 'Biological magnetite crystals allow organisms to detect the local dip angle to navigate global migration pathways.',
      },
    ],
    simulationType: 'class12-physics',
  },

  // =========================================================================
  // CHAPTER 6: ELECTROMAGNETIC INDUCTION
  // =========================================================================
  {
    id: 'ncert12-phy-electromagnetic-induction-lenz-faraday',
    title: 'Faraday’s Law of Induction, Lenz’s Law & Motional EMF',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'ε = -N (dΦ_B / dt): Flux linkage, induced electromotive force, and Lenz’s conservation of energy',
    description:
      'Electromagnetic Induction is the phenomenon in which an electromotive force (EMF) is induced across an electric conductor situated in a changing magnetic flux. (1) Magnetic Flux: Φ_B = B · A = B A cos(θ) (webers, Wb). (2) Faraday’s Law of Induction: The magnitude of induced EMF in a circuit equals the time rate of change of magnetic flux linked with the circuit: ε = -dΦ_B/dt. For an N-turn coil: ε = -N (dΦ_B/dt). (3) Lenz’s Law: The direction of induced EMF (and current) is always such that it opposes the very change in magnetic flux that produces it. The negative sign is a direct consequence of the Law of Conservation of Energy: work must be done against the opposing magnetic force to generate electrical energy. (4) Motional EMF: For a straight conducting rod of length l moving with velocity v perpendicular to uniform magnetic field B: ε = B l v. (5) Eddy Currents: Circulating currents induced in bulk metallic conductors during flux change, damped by magnetic braking.',
    formulaLaTeX: '\\varepsilon = -N \\frac{d\\Phi_B}{dt} \\quad | \\quad \\varepsilon_{\\text{motional}} = B \\, l \\, v \\quad | \\quad \\Phi_B = B A \\cos(\\theta)',
    formulaExplanation:
      'Induced EMF opposing flux change gives mechanical resistance (Lenz law). Moving rod sweeps area dA = l v dt per second, giving motional EMF = B l v.',
    variables: [
      {
        id: 'magneticFieldTeslaB',
        name: 'Magnetic Field (B)',
        symbol: 'B',
        unit: 'T',
        min: 0.2,
        max: 3.0,
        step: 0.2,
        defaultValue: 1.0,
        description: 'Uniform magnetic field strength.',
      },
      {
        id: 'rodVelocityMPerS',
        name: 'Velocity (v)',
        symbol: 'v',
        unit: 'm/s',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 5,
        description: 'Speed of moving conductor on rails.',
      },
      {
        id: 'rodLengthM',
        name: 'Rod Length (l)',
        symbol: 'l',
        unit: 'm',
        min: 0.1,
        max: 1.0,
        step: 0.1,
        defaultValue: 0.5,
        description: 'Length of conductor cutting magnetic flux.',
      },
    ],
    prediction: {
      prompt: 'A bar magnet is dropped vertically through a long hollow copper tube. How does its terminal acceleration compare with free-fall acceleration g?',
      scenario: 'A strong neodymium magnet falls down a non-magnetic copper pipe.',
      choices: [
        {
          id: 'p1',
          text: 'Acceleration becomes much less than g (terminal velocity reached).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Magnet accelerates faster than g due to magnetic pull.',
          isCorrect: false,
          misconceptionExplanation: 'Copper is non-magnetic; it does not attract the magnet statically. The moving flux induces opposing eddy currents by Lenz’s law!',
        },
        {
          id: 'p3',
          text: 'Acceleration is exactly g because copper is non-magnetic.',
          isCorrect: false,
          misconceptionExplanation: 'Though copper is non-ferromagnetic, it is a great electrical conductor; changing flux induces eddy currents exerting an upward magnetic retarding force.',
        },
      ],
      correctExplanation:
        'As the magnet falls, changing magnetic flux induces circulating eddy currents in the copper pipe walls. By Lenz’s law, these eddy currents generate a magnetic field whose polarity opposes the magnet’s motion (repelling the falling pole above and attracting the receding pole below). This produces an upward retarding force, quickly reducing acceleration until it reaches a slow terminal descent velocity (a << g).',
      relevantFormula: 'F_{\\text{eddy}} = \\frac{B^2 l^2 v}{R} \\implies F_{\\text{net}} = mg - F_{\\text{eddy}}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'High-Speed Maglev Train Electromagnetic Braking',
        description: 'Eddy-current brakes induce kinetic counter-torques on solid copper rails without friction pads or wear.',
      },
      {
        title: 'Induction Stovetops & Metallurgy Furnaces',
        description: 'High-frequency oscillating magnetic fields induce eddy currents directly in stainless steel pans, heating food efficiently.',
      },
    ],
    simulationType: 'class12-physics',
  },

  // =========================================================================
  // CHAPTER 8: ELECTROMAGNETIC WAVES
  // =========================================================================
  {
    id: 'ncert12-phy-electromagnetic-waves-displacement-current',
    title: 'Electromagnetic Waves, Displacement Current & EM Spectrum',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'Maxwell’s displacement current I_d = ε₀ (dΦ_E / dt), c = 1 / √(μ₀ε₀), and transverse E & B oscillations',
    description:
      'James Clerk Maxwell resolved the inconsistency in Ampere’s Circuital Law across charging capacitor plates by discovering Displacement Current: I_d = ε₀ (dΦ_E/dt), arising from time-varying electric fields. Ampere-Maxwell Law: ∮ B · dl = μ₀(I_c + I_d). Electromagnetic waves are self-propagating transverse oscillations of electric field E and magnetic field B, vibrating mutually perpendicular to each other and perpendicular to the direction of propagation (c = E / B). In vacuum, all EM waves travel at universal speed c = 1 / √(μ₀ ε₀) ≈ 3.00 × 10⁸ m/s. The Electromagnetic Spectrum ranges continuously across frequencies: Radio waves (longest λ > 0.1 m), Microwaves (radar, communications), Infrared (heat waves), Visible Light (400–700 nm), Ultraviolet (germicidal, ozone absorption), X-rays (medical radiography), and Gamma rays (highest frequency > 10¹⁹ Hz, nuclear decays).',
    formulaLaTeX: 'c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} = \\frac{E_0}{B_0} \\quad | \\quad I_d = \\varepsilon_0 \\frac{d\\Phi_E}{dt}',
    formulaExplanation:
      'Electric and magnetic wave amplitudes satisfy E_0 = c B_0. Total average energy density is shared equally: u = ½ ε₀ E₀² = ½ B₀² / μ₀.',
    variables: [
      {
        id: 'emFrequencyHz',
        name: 'Frequency (f)',
        symbol: 'f',
        unit: 'MHz',
        min: 50,
        max: 1000,
        step: 50,
        defaultValue: 100,
        description: 'Carrier frequency of electromagnetic wave.',
      },
      {
        id: 'electricFieldAmplitudeE0',
        name: 'Electric Amplitude (E₀)',
        symbol: 'E_0',
        unit: 'V/m',
        min: 10,
        max: 150,
        step: 10,
        defaultValue: 60,
        description: 'Peak electric field amplitude.',
      },
    ],
    prediction: {
      prompt: 'If the electric field of an EM wave travels in the +z direction while the wave propagates in the +x direction, in which direction does the magnetic field B oscillate?',
      scenario: 'Electromagnetic wave traveling along +x with E along +z.',
      choices: [
        {
          id: 'p1',
          text: 'Along the -y direction (since Poynting vector S ∝ E × B points along +x).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Along the +x direction.',
          isCorrect: false,
          misconceptionExplanation: 'EM waves are strictly transverse; neither E nor B can vibrate along the direction of propagation.',
        },
        {
          id: 'p3',
          text: 'Along the +z direction.',
          isCorrect: false,
          misconceptionExplanation: 'E and B vectors must be strictly mutually perpendicular to each other.',
        },
      ],
      correctExplanation:
        'By Maxwell’s equations, the direction of wave propagation is given by the cross-product vector E × B. Since wave vector k is in the +x direction (î) and E is along +z (k̂), we need k̂ × B̂ = î. Since k̂ × (-ĵ) = î, the magnetic field B must oscillate along the -y direction.',
      relevantFormula: '\\hat{k} = \\hat{E} \\times \\hat{B} \\implies \\hat{i} = \\hat{k} \\times (-\\hat{j})',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: '5G Mobile Wireless Communications & Wi-Fi',
        description: 'Gigahertz microwaves carry gigabit-per-second internet packets encoded in modulated EM carrier waves.',
      },
      {
        title: 'Deep Space Astronomy Telescopes (James Webb)',
        description: 'Infrared EM sensors penetrate dense interstellar cosmic dust clouds to image ancient distant galaxies.',
      },
    ],
    simulationType: 'class12-physics',
  },

  // =========================================================================
  // CHAPTER 9: RAY OPTICS AND OPTICAL INSTRUMENTS
  // =========================================================================
  {
    id: 'ncert12-phy-ray-optics-tir-lens-makers-formula',
    title: 'Total Internal Reflection, Lens Maker’s Formula & Telescopes',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'sin(i_c) = 1/μ, Lens Maker 1/f = (μ - 1)(1/R₁ - 1/R₂), and telescope magnification m = f_o / f_e',
    description:
      'Total Internal Reflection (TIR) occurs when light travels from an optically denser medium of refractive index μ to a rarer medium at an angle of incidence exceeding the Critical Angle i_c: sin(i_c) = 1/μ. All incident energy is 100% reflected back into the denser medium with zero transmission loss. Applications include endoscopes, sparkling diamonds, and optical fiber telecommunications. Lens Maker’s Formula computes the focal length f of a thin lens with spherical surfaces of radii R₁ and R₂ in air: 1/f = (μ - 1) [1/R₁ - 1/R₂]. An Astronomical Refracting Telescope consists of an objective lens of large focal length f_o and large aperture, and an eyepiece lens of small focal length f_e. Magnifying power in normal adjustment (image at infinity): m = -f_o / f_e with tube length L = f_o + f_e.',
    formulaLaTeX: '\\sin(i_c) = \\frac{1}{\\mu} \\quad | \\quad \\frac{1}{f} = (\\mu - 1) \\left( \\frac{1}{R_1} - \\frac{1}{R_2} \\right) \\quad | \\quad m = -\\frac{f_o}{f_e}',
    formulaExplanation:
      'TIR enables lossless optical fiber transmission. Lens focal length depends on both refractive index of glass and surface radii of curvature.',
    variables: [
      {
        id: 'coreRefractiveIndexMu',
        name: 'Core Index (μ)',
        symbol: '\\mu',
        unit: 'unitless',
        min: 1.33,
        max: 2.42,
        step: 0.05,
        defaultValue: 1.5,
        description: 'Refractive index of optical medium (Water=1.33, Crown Glass=1.52, Diamond=2.42).',
      },
      {
        id: 'telescopeObjectiveFo',
        name: 'Objective f_o',
        symbol: 'f_o',
        unit: 'cm',
        min: 50,
        max: 200,
        step: 10,
        defaultValue: 100,
        description: 'Focal length of astronomical telescope objective.',
      },
      {
        id: 'telescopeEyepieceFe',
        name: 'Eyepiece f_e',
        symbol: 'f_e',
        unit: 'cm',
        min: 2,
        max: 10,
        step: 1,
        defaultValue: 5,
        description: 'Focal length of telescope eyepiece.',
      },
    ],
    prediction: {
      prompt: 'If a convex glass lens of refractive index μ_g = 1.5 is immersed in a liquid of refractive index μ_l = 1.6, how does its optical behavior change?',
      scenario: 'A converging glass lens placed in a denser liquid medium.',
      choices: [
        {
          id: 'p1',
          text: 'It behaves as a diverging (concave) lens.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'It converges light rays more powerfully.',
          isCorrect: false,
          misconceptionExplanation: 'Relative index μ_rel = μ_g / μ_l = 1.5 / 1.6 < 1. In Lens Maker’s formula (μ_rel - 1) becomes negative, reversing the sign of focal length!',
        },
        {
          id: 'p3',
          text: 'Its focal length remains completely unchanged.',
          isCorrect: false,
          misconceptionExplanation: 'Focal length depends on surrounding medium index via relative refractive index.',
        },
      ],
      correctExplanation:
        'By Lens Maker’s formula: 1/f_med = (μ_g/μ_l - 1)(1/R₁ - 1/R₂). When immersed in a liquid denser than glass (μ_l > μ_g), the factor (μ_g/μ_l - 1) becomes negative. A convex lens which is converging in air (f > 0) becomes diverging (f < 0) in the denser liquid!',
      relevantFormula: '\\frac{1}{f_{\\text{liquid}}} = \\left(\\frac{\\mu_g}{\\mu_l} - 1\\right) \\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right) < 0',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Fiber-Optic Transoceanic Internet Backbones',
        description: 'High-purity silica glass cores guide pulsed laser signals over thousands of kilometers via repeated Total Internal Reflection.',
      },
      {
        title: 'Medical Endoscopy Cameras',
        description: 'Flexible coherent fiber optic bundles illuminate and image internal digestive tracts without surgery.',
      },
    ],
    simulationType: 'class12-physics',
  },

  // =========================================================================
  // CHAPTER 12: ATOMS
  // =========================================================================
  {
    id: 'ncert12-phy-atoms-rutherford-bohr-hydrogen-model',
    title: 'Atomic Structure: Bohr Hydrogen Model & Rydberg Spectral Series',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'Quantized angular momentum L = nh / 2π, energy E_n = -13.6 eV / n², and Rydberg formula',
    description:
      'Niels Bohr postulated: (1) Electrons revolve around positive nucleus in stable non-radiating stationary orbits; (2) Quantization of Angular Momentum: L = m v r = n (h / 2π), where n = 1, 2, 3... (principal quantum number); (3) Spectral Radiative Transitions: Radiation of photon frequency ν is emitted when an electron jumps from higher orbit n_i to lower orbit n_f: ΔE = E_i - E_f = h ν. Orbit radius: r_n = n² a₀, where Bohr radius a₀ = 0.529 Å. Total electron energy: E_n = -13.6 eV / n². Transitions produce distinct Hydrogen Spectral Series: Lyman series (UV, n_f = 1), Balmer series (Visible VIBGYOR, n_f = 2), Paschen series (Near IR, n_f = 3), Brackett (IR, n_f = 4), and Pfund (Far IR, n_f = 5), governed by the Rydberg formula: 1/λ = R [1/n_f² - 1/n_i²], where R = 1.097 × 10⁷ m⁻¹.',
    formulaLaTeX: 'E_n = -\\frac{13.6 \\text{ eV}}{n^2} \\quad | \\quad \\frac{1}{\\lambda} = R_H \\left( \\frac{1}{n_f^2} - \\frac{1}{n_i^2} \\right) \\quad | \\quad L = n \\frac{h}{2\\pi}',
    formulaExplanation:
      'Electron energy is quantized and negative due to attractive nuclear Coulomb binding. Photon emitted matches exact orbit energy difference.',
    variables: [
      {
        id: 'initialOrbitNi',
        name: 'Initial Orbit (n_i)',
        symbol: 'n_i',
        unit: 'level',
        min: 2,
        max: 6,
        step: 1,
        defaultValue: 3,
        description: 'Starting higher electron orbital level.',
      },
      {
        id: 'finalOrbitNf',
        name: 'Final Orbit (n_f)',
        symbol: 'n_f',
        unit: 'level',
        min: 1,
        max: 5,
        step: 1,
        defaultValue: 2,
        description: 'Target lower orbital level (n_f=2 gives Balmer visible lines).',
      },
    ],
    prediction: {
      prompt: 'What is the wavelength of the H-alpha red spectral line emitted when an electron transitions from n = 3 to n = 2 in Hydrogen?',
      scenario: 'First line of Balmer series (n_i = 3 to n_f = 2).',
      choices: [
        {
          id: 'p1',
          text: '656 nm (Crimson red visible photon).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: '486 nm (Cyan blue photon).',
          isCorrect: false,
          misconceptionExplanation: '486 nm is the H-beta line corresponding to n = 4 to n = 2 transition.',
        },
        {
          id: 'p3',
          text: '121 nm (Ultraviolet photon).',
          isCorrect: false,
          misconceptionExplanation: '121 nm is Lyman-alpha in the UV region (n = 2 to n = 1).',
        },
      ],
      correctExplanation:
        'Applying Rydberg’s formula for n_f = 2 and n_i = 3: 1/λ = R_H (1/2² - 1/3²) = R_H (1/4 - 1/9) = 5R_H / 36. Substituting R_H = 1.097 × 10⁷ m⁻¹ gives λ = 36 / (5 × 1.097 × 10⁷) = 656.3 nm, which is the prominent red H-alpha line seen in stellar emission nebulae.',
      relevantFormula: '\\frac{1}{\\lambda} = R_H \\left(\\frac{1}{2^2} - \\frac{1}{3^2}\\right) = \\frac{5 R_H}{36} \\implies \\lambda = 656.3\\text{ nm}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Astrophysical Spectroscopy of Stars & Nebulae',
        description: 'Astronomers analyze stellar absorption spectra to determine temperatures, chemical elements, and radial velocities of distant galaxies.',
      },
      {
        title: 'Laser Quantum Emission Systems',
        description: 'Optical ruby and gas lasers exploit stimulated emission between quantized atomic metastable energy states.',
      },
    ],
    simulationType: 'class12-physics',
  },

  // =========================================================================
  // CHAPTER 13: NUCLEI
  // =========================================================================
  {
    id: 'ncert12-phy-nuclei-mass-defect-binding-energy',
    title: 'Nuclear Binding Energy, Mass Defect & Nuclear Fission / Fusion',
    subject: 'physics',
    gradeLevel: 'Class 12',
    tagline: 'Einstein mass-energy E = Δm·c², Binding Energy curve peaking at Fe-56 (8.75 MeV/nucleon)',
    description:
      'The atomic nucleus consists of Z protons and N = A - Z neutrons bound by the strong nuclear force. (1) Mass Defect (Δm): The rest mass of a stable nucleus is always strictly less than the sum of the rest masses of its constituent individual nucleons: Δm = [Z m_p + (A - Z)m_n] - M_nucleus. (2) Nuclear Binding Energy (E_b): The energy equivalent of mass defect, calculated via Einstein’s relation: E_b = Δm · c² (where 1 atomic mass unit u ≈ 931.5 MeV). (3) Binding Energy per Nucleon (E_bn = E_b / A): Measures nuclear stability. The E_bn vs Mass Number A curve shows: sharp peaks at Helium-4, Carbon-12, Oxygen-16; reaches a broad maximum of 8.75 MeV/nucleon for Iron-56 (most stable nucleus in nature); decreases to ~7.6 MeV for heavy nuclei like Uranium-238. (4) Nuclear Fission: Heavy nuclei (A > 230) split into medium nuclei to gain ~0.9 MeV/nucleon stability, releasing massive energy. (5) Nuclear Fusion: Extremely light nuclei (A < 20) fuse together (e.g. 4 Hydrogen -> 1 Helium in Sun), gaining ~6.7 MeV/nucleon energy.',
    formulaLaTeX: 'E_b = \\Delta m \\cdot c^2 = \\left[ Z m_p + (A - Z) m_n - M \\right] c^2 \\quad | \\quad 1 \\text{ u} = 931.5 \\text{ MeV}',
    formulaExplanation:
      'Peak binding energy at Iron-56 explains why fission of heavy elements and fusion of light elements both liberate immense nuclear energy.',
    variables: [
      {
        id: 'massNumberA',
        name: 'Mass Number (A)',
        symbol: 'A',
        unit: 'nucleons',
        min: 4,
        max: 238,
        step: 10,
        defaultValue: 56,
        description: 'Total number of protons and neutrons in nucleus (e.g. Fe-56, U-238).',
      },
    ],
    prediction: {
      prompt: 'Why does nuclear fusion of hydrogen into helium release far more energy per kilogram than the nuclear fission of Uranium-235?',
      scenario: 'Comparing the energy liberation mechanisms of fusion vs fission.',
      choices: [
        {
          id: 'p1',
          text: 'The increase in binding energy per nucleon is much steeper at light mass numbers (from 1.1 MeV for deuterium to 7.1 MeV for helium).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Fission does not release energy; it consumes energy.',
          isCorrect: false,
          misconceptionExplanation: 'Both fission and fusion release energy because products have higher binding energy per nucleon than reactants.',
        },
        {
          id: 'p3',
          text: 'Uranium has a higher binding energy per nucleon than iron.',
          isCorrect: false,
          misconceptionExplanation: 'Iron-56 has the highest binding energy per nucleon (8.75 MeV); Uranium-238 is lower at ~7.6 MeV.',
        },
      ],
      correctExplanation:
        'The binding energy curve rises very steeply for light nuclei: hydrogen (1.1 MeV/nucleon) fuses into Helium-4 (7.07 MeV/nucleon), yielding a massive ΔE_bn of ~6 MeV per nucleon. In Uranium fission, ΔE_bn is only from ~7.6 MeV to ~8.5 MeV (~0.9 MeV per nucleon). Because hydrogen atoms are so light, a kilogram of fusion fuel provides ~4 times more energy than a kilogram of fission fuel.',
      relevantFormula: '\\Delta E_{\\text{fusion/nucleon}} \\approx 6.0\\text{ MeV} \\gg \\Delta E_{\\text{fission/nucleon}} \\approx 0.9\\text{ MeV}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      {
        title: 'Nuclear Power Plants (CANDU, PWR, Pressurized Water Reactors)',
        description: 'Controlled U-235 thermal neutron chain reactions produce steam generating gigawatts of zero-carbon baseload electricity.',
      },
      {
        title: 'Solar Stellar Nucleosynthesis & ITER Fusion Tokamak',
        description: 'Gravitational core pressures in stars fuse hydrogen into helium, powering all planetary warmth and terrestrial life.',
      },
    ],
    simulationType: 'class12-physics',
  },
];
