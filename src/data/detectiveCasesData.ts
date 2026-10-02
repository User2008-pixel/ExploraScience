import { DetectiveCase } from '../types/science';

export const DETECTIVE_CASES: DetectiveCase[] = [
  {
    id: 'case-two-spoons',
    title: 'The Mystery of the Two Spoons',
    subject: 'physics',
    difficulty: 'explorer',
    gradeLevel: 'Class 9',
    gradeLevels: ['Class 9', 'Class 11'],
    caseNumber: 'CASE-PHY-01',
    premise:
      'Two spoons—one crafted from polished stainless steel and the other carved from dry birch wood—have rested side-by-side in an ambient 20°C laboratory overnight. A student touches both and insists: "The metal spoon must be much colder than the wooden spoon!"',
    mysteryQuestion:
      'Is the metal spoon actually at a lower temperature, or is our thermal perception misleading us?',
    initialEvidence: [
      'Both spoons have been in the same sealed, temperature-controlled room (20°C) for over 14 hours.',
      'Human fingers feel an immediate chill upon touching the steel spoon.',
      'A calibrated infrared thermometer and contact thermistor are available on the laboratory bench.',
    ],
    simulationType: 'thermal-conduction',
    availableVariables: [
      {
        id: 'materialThermalConductivity',
        label: 'Material Thermal Conductivity (k)',
        symbol: 'k',
        unit: 'W/m·K',
        min: 0.1,
        max: 400,
        step: 10,
        defaultVal: 16, // Steel ~16, Wood ~0.15, Silver ~400
      },
      {
        id: 'contactTime',
        label: 'Finger Contact Duration',
        symbol: '\\Delta t',
        unit: 's',
        min: 1,
        max: 30,
        step: 1,
        defaultVal: 5,
      },
      {
        id: 'ambientTemp',
        label: 'Room Ambient Temperature',
        symbol: 'T_{\\text{room}}',
        unit: '°C',
        min: 10,
        max: 35,
        step: 1,
        defaultVal: 20,
      },
      {
        id: 'skinTemp',
        label: 'Finger Skin Temperature',
        symbol: 'T_{\\text{skin}}',
        unit: '°C',
        min: 30,
        max: 37,
        step: 0.5,
        defaultVal: 34,
      },
    ],
    availableEquipment: [
      'Contact Digital Thermistor',
      'Infrared Thermal Camera',
      'Heat Flux Sensor (q = -k dT/dx)',
      'Digital Stopwatch',
    ],
    correctIndependentVar: 'materialThermalConductivity',
    correctDependentVar: 'heatFlux',
    scientificFormula: '\\frac{d Q}{d t} = -k A \\frac{\\Delta T}{\\Delta x}, \\quad T_{\\text{steel}} = T_{\\text{wood}} = T_{\\text{room}} = 20^\\circ\\text{C}',
    progressiveHints: [
      'Think about what happens to objects left in the same room for a prolonged period (Zeroth Law of Thermodynamics).',
      'Do human thermal receptors measure absolute temperature, or the rate of heat energy transferred away from the skin?',
      "Compare the thermal conductivity k of metals (~16-400 W/m·K) to wood (~0.15 W/m·K) using Fourier's Law.",
      'Both spoons are at exactly 20°C! The metal feels colder because it drains thermal energy from your 34°C finger over 100 times faster.',
    ],
    scientificExplanation: {
      summary:
        'Both spoons are at the exact same temperature (20°C), in perfect thermal equilibrium with the room. The sensory perception of coldness is caused by high heat conduction rate, not lower temperature.',
      whyItHappens:
        "Human skin thermoreceptors do not measure absolute temperature; they register the rate of heat loss (dQ/dt). Stainless steel has a high thermal conductivity (k ≈ 16 W/m·K), rapidly conducting thermal energy away from your 34°C fingertips. Wood (k ≈ 0.15 W/m·K) is a thermal insulator, so the skin surface remains warm.",
      commonMisconceptions:
        'Believing that if an object "feels" colder, its physical thermometer reading must be lower. In reality, thermal sensation reflects heat flux q, not internal temperature T.',
      formalLaw:
        "Zeroth Law of Thermodynamics & Fourier's Law of Thermal Conduction: \\frac{d Q}{d t} = -k A \\frac{\\partial T}{\\partial x}",
    },
  },

  {
    id: 'case-car-stopping',
    title: 'Why Did the Car Stop?',
    subject: 'physics',
    difficulty: 'investigator',
    gradeLevel: 'Class 9',
    gradeLevels: ['Class 9', 'Class 11'],
    caseNumber: 'CASE-PHY-02',
    premise:
      'An autonomous test vehicle travelling at 20 m/s slammed on its brakes on two different road segments. On Dry Asphalt it came to a complete halt in 25.5 meters, but on Wet Ice it skidded for an alarming 102 meters! The student investigator must determine which mechanical parameter governs stopping distance.',
    mysteryQuestion:
      'What fundamental physical factor dictates the braking distance, and how does initial velocity scale with stopping distance?',
    initialEvidence: [
      'Vehicle mass: 1,200 kg with all 4 wheels locked in emergency ABS braking.',
      'Stopping distance on dry asphalt: 25.5 m at 20 m/s.',
      'Stopping distance on wet ice: 102.0 m at 20 m/s.',
      'Telemetry recorded speed versus time profiles during deceleration.',
    ],
    simulationType: 'car-stopping',
    availableVariables: [
      {
        id: 'initialVelocity',
        label: 'Initial Speed (v₀)',
        symbol: 'v_0',
        unit: 'm/s',
        min: 10,
        max: 40,
        step: 2,
        defaultVal: 20,
      },
      {
        id: 'surfaceFriction',
        label: 'Surface Friction Coefficient (μ_k)',
        symbol: '\\mu_k',
        unit: '',
        min: 0.1,
        max: 0.9,
        step: 0.05,
        defaultVal: 0.8, // Dry asphalt ~0.8, Ice ~0.1
      },
      {
        id: 'vehicleMass',
        label: 'Vehicle Mass (m)',
        symbol: 'm',
        unit: 'kg',
        min: 800,
        max: 3000,
        step: 100,
        defaultVal: 1200,
      },
    ],
    availableEquipment: [
      'High-Speed Optical Radar Gun',
      'Accelerometer & Gyroscope Telemetry',
      'Distance Laser Measure Tape',
      'Weight Scales',
    ],
    correctIndependentVar: 'surfaceFriction',
    correctDependentVar: 'stoppingDistance',
    scientificFormula: 'W = \\Delta K \\implies -f_k d = 0 - \\frac{1}{2}m v_0^2 \\implies -(\\mu_k m g) d = -\\frac{1}{2}m v_0^2 \\implies d = \\frac{v_0^2}{2 \\mu_k g}',
    progressiveHints: [
      'Does changing the vehicle mass alter stopping distance when friction is constant? Look at how m appears on both sides of the equation.',
      'How does kinetic energy depend on initial speed: linear or quadratic?',
      'Apply the Work-Energy theorem: Work done by friction equals the change in kinetic energy.',
      'Stopping distance d = v₀² / (2 μ_k g). Notice mass cancels out completely! Distance is inversely proportional to friction coefficient μ_k and scales quadratically with speed.',
    ],
    scientificExplanation: {
      summary:
        'Stopping distance is governed solely by the road friction coefficient μ_k and the square of velocity v₀². Vehicle mass cancels out completely because a heavier car has more inertia but also generates proportionally more frictional force.',
      whyItHappens:
        'The kinetic friction force is f_k = \\mu_k m g. By the Work-Energy Theorem, the work done to dissipate kinetic energy is f_k \\cdot d = \\frac{1}{2} m v_0^2. Dividing both sides by mass m reveals that mass has zero effect on ideal braking distance!',
      commonMisconceptions:
        'Many believe a heavy truck takes longer to brake simply because it is heavy. In ideal tires without thermal fading, mass cancels out; the difference is tire-road adhesion and brake heating.',
      formalLaw:
        'Work-Energy Theorem: d = \\frac{v_0^2}{2 \\mu_k g}',
    },
  },

  {
    id: 'case-circuit-mystery',
    title: 'The Circuit Mystery: The Dim Bulb',
    subject: 'physics',
    difficulty: 'investigator',
    gradeLevel: 'Class 10',
    gradeLevels: ['Class 10', 'Class 12'],
    caseNumber: 'CASE-PHY-03',
    premise:
      'A technician installs a 12V automotive halogen bulb onto a newly built DC test bench. Although the laboratory DC supply is dialed to 12V, the bulb burns with an unexpectedly dim, reddish glow instead of bright white.',
    mysteryQuestion:
      'Why is the bulb failing to illuminate at full rated brightness despite the 12V supply setting?',
    initialEvidence: [
      'The bulb is rated for 12V, 24W (rated current: 2.0 A, nominal hot resistance: 6.0 Ω).',
      'When connected to the bench terminals, an ammeter reads only 0.8 A.',
      'A digital voltmeter reads only 4.8 V across the bulb terminals!',
    ],
    simulationType: 'circuit-mystery',
    availableVariables: [
      {
        id: 'supplyVoltage',
        label: 'Source EMF',
        symbol: '\\mathcal{E}',
        unit: 'V',
        min: 6,
        max: 24,
        step: 0.5,
        defaultVal: 12,
      },
      {
        id: 'internalResistance',
        label: 'Internal / Lead Resistance (r)',
        symbol: 'r_{\\text{int}}',
        unit: 'Ω',
        min: 0.1,
        max: 15,
        step: 0.5,
        defaultVal: 9.0, // High internal resistance culprit!
      },
      {
        id: 'bulbResistance',
        label: 'Bulb Resistance (R_bulb)',
        symbol: 'R_{\\text{bulb}}',
        unit: 'Ω',
        min: 2,
        max: 20,
        step: 0.5,
        defaultVal: 6.0,
      },
    ],
    availableEquipment: [
      'Digital Multimeter (Voltmeter / Ammeter / Ohmmeter)',
      'Kelvin 4-Wire Contact Probes',
      'Variable Resistor Decade Box',
      'Lux Meter (Illuminance Photometer)',
    ],
    correctIndependentVar: 'internalResistance',
    correctDependentVar: 'terminalVoltage',
    scientificFormula: 'V_{\\text{terminal}} = \\mathcal{E} - I r_{\\text{int}}, \\quad I = \\frac{\\mathcal{E}}{R_{\\text{bulb}} + r_{\\text{int}}}, \\quad P_{\\text{bulb}} = I^2 R_{\\text{bulb}}',
    progressiveHints: [
      'Measure the voltage across the bulb while the switch is closed versus open.',
      'Where is the missing 7.2 V dropping if only 4.8 V appears across the bulb?',
      'Check the internal resistance of the power supply and leads (r_int).',
      'A corroded connection or high internal battery resistance (r = 9 Ω) creates a voltage divider, stealing most of the potential difference!',
    ],
    scientificExplanation: {
      summary:
        'A high internal resistance (r_int = 9 Ω) in series with the bulb created an unintentional voltage divider. Instead of receiving the full 12V, the bulb only received 4.8V, dropping dissipated power from 24W to just 3.8W.',
      whyItHappens:
        'By Kirchhoff’s Voltage Law, \\mathcal{E} = I(R_{\\text{bulb}} + r_{\\text{int}}). When r_int is significant, terminal voltage drops sharply: V = \\mathcal{E} - I r_{\\text{int}}. Because optical luminosity scales with P = V^2/R, a 60% drop in voltage causes an ~84% collapse in light emission.',
      commonMisconceptions:
        'Assuming a power supply stamped "12V" will always supply 12V to any load, ignoring the voltage drop across internal source impedance under heavy current draw.',
      formalLaw:
        "Ohm's Law & Kirchhoff's Loop Rule: V_{\\text{terminal}} = \\mathcal{E} - I r",
    },
  },

  {
    id: 'case-reaction-slowdown',
    title: 'Why Did the Reaction Slow Down?',
    subject: 'chemistry',
    difficulty: 'scientist',
    gradeLevel: 'Class 10',
    gradeLevels: ['Class 10', 'Class 12'],
    caseNumber: 'CASE-CHM-01',
    premise:
      'In an industrial chemical reactor, hydrogen peroxide decomposition (2H₂O₂ → 2H₂O + O₂) started vigorously with intense effervescence. After 60 seconds, oxygen bubble evolution suddenly plummeted by 80%, even though chemical analysis showed 75% of the H₂O₂ reactant was still unreacted!',
    mysteryQuestion:
      'Why did the reaction rate crash while the reactant was still abundant?',
    initialEvidence: [
      'Reactant H₂O₂ remaining: 75% of initial concentration.',
      'Reactor temperature sensor showed temperature dropping from 45°C to 18°C.',
      'The catalytic manganese dioxide (MnO₂) powder had clumped into large granules.',
    ],
    simulationType: 'reaction-slowdown',
    availableVariables: [
      {
        id: 'catalystSurfaceArea',
        label: 'Catalyst Surface Area',
        symbol: 'A_{\\text{surf}}',
        unit: 'cm²',
        min: 10,
        max: 500,
        step: 20,
        defaultVal: 80,
      },
      {
        id: 'temperatureK',
        label: 'Reactor Temperature (T)',
        symbol: 'T',
        unit: 'K',
        min: 275,
        max: 350,
        step: 5,
        defaultVal: 291,
      },
      {
        id: 'reactantConcentration',
        label: 'Substrate [H₂O₂]',
        symbol: '[\\text{H}_2\\text{O}_2]',
        unit: 'M',
        min: 0.1,
        max: 2.0,
        step: 0.1,
        defaultVal: 1.5,
      },
    ],
    availableEquipment: [
      'Gas Syringe Eudiometer (O₂ Volume Collector)',
      'Digital Thermocouple Probe',
      'Laser Particle Surface Area Analyzer',
      'Spectrophotometer',
    ],
    correctIndependentVar: 'catalystSurfaceArea',
    correctDependentVar: 'reactionRate',
    scientificFormula: '\\text{Rate} = k [\\text{H}_2\\text{O}_2] \\cdot A_{\\text{surf}}, \\quad k = A_0 e^{-\\frac{E_a}{R T}}',
    progressiveHints: [
      'If 75% of reactant remains, reactant depletion cannot explain an 80% slowdown.',
      'Look closely at the physical state of the heterogeneous catalyst.',
      'How does clumping (loss of specific surface area) reduce the frequency of effective active-site collisions?',
      'Catalyst clumping combined with evaporative cooling reduced available catalytic surface area and reaction temperature, collapsing the rate.',
    ],
    scientificExplanation: {
      summary:
        'The heterogeneous catalyst (MnO₂) aggregated into coarse clumps, drastically cutting active surface area. Furthermore, temperature dropped, reducing the rate constant k exponentially via the Arrhenius equation.',
      whyItHappens:
        'In heterogeneous catalysis, reactant molecules must adsorb onto the catalyst surface. When fine powder clumps into dense aggregates, specific surface area plunges by orders of magnitude, slashing the rate of effective catalytic turnover regardless of reactant concentration.',
      commonMisconceptions:
        'Assuming chemical reactions slow down only because reactants are consumed. Heterogeneous reaction rates are frequently limited by catalyst surface area and temperature.',
      formalLaw:
        "Arrhenius Kinetics & Heterogeneous Adsorption Rate Law: \\text{Rate} = k A_{\\text{surf}} [A]",
    },
  },

  {
    id: 'case-plant-limiting-factor',
    title: 'Why Did the Plant Stop Growing?',
    subject: 'biology',
    difficulty: 'scientist',
    gradeLevel: 'Class 11',
    gradeLevels: ['Class 10', 'Class 11'],
    caseNumber: 'CASE-BIO-01',
    premise:
      'A vertical urban farm installed high-intensity 1,200 W LED arrays to boost spinach growth rates. Despite quadrupling the electric lighting power, spinach biomass yield plateaued completely after 2 weeks, baffling the cultivation team.',
    mysteryQuestion:
      'Why did adding massive amounts of radiant light energy fail to stimulate any additional photosynthetic growth?',
    initialEvidence: [
      'Light intensity: increased from 300 to 1,200 μmol/m²·s (4× increase).',
      'Growth rate: completely flat at 1.4 g/day.',
      'Enclosed greenhouse air CO₂ reading: 320 ppm.',
      'Room temperature: strictly held at 22°C.',
    ],
    simulationType: 'plant-growth',
    availableVariables: [
      {
        id: 'co2Level',
        label: 'Carbon Dioxide [CO₂]',
        symbol: '[\\text{CO}_2]',
        unit: 'ppm',
        min: 200,
        max: 1500,
        step: 50,
        defaultVal: 320,
      },
      {
        id: 'lightLevel',
        label: 'Light Intensity (PAR)',
        symbol: 'I',
        unit: 'μmol/m²·s',
        min: 100,
        max: 1400,
        step: 50,
        defaultVal: 1200,
      },
      {
        id: 'ambientTemp',
        label: 'Ambient Temperature',
        symbol: 'T',
        unit: '°C',
        min: 10,
        max: 38,
        step: 1,
        defaultVal: 22,
      },
    ],
    availableEquipment: [
      'Infrared Gas Analyzer (IRGA) for Net CO₂ Assimilation',
      'Chlorophyll Fluorometer',
      'PAR Quantum Light Sensor',
      'Electronic Biomass Microbalance',
    ],
    correctIndependentVar: 'co2Level',
    correctDependentVar: 'photosyntheticRate',
    scientificFormula: 'P_{\\text{net}} = \\min\\left( \\alpha I, \\frac{V_{\\text{cmax}} [\\text{CO}_2]}{[\\text{CO}_2] + K_c(1 + [\\text{O}_2]/K_o)} \\right) - R_d',
    progressiveHints: [
      'Recall Blackman’s Principle of Limiting Factors in plant physiology.',
      'What are the two major stages of photosynthesis: light-dependent reactions vs Calvin cycle?',
      'Check the ambient CO₂ concentration (320 ppm). Does the RuBisCO enzyme have enough carbon substrate to match the ATP produced by the light?',
      'CO₂ is the limiting factor! At 320 ppm, RuBisCO is carbon-starved. Increasing light beyond light saturation yields zero growth without extra CO₂.',
    ],
    scientificExplanation: {
      summary:
        'The plant was severely limited by carbon dioxide availability (320 ppm). The light reactions were producing ATP and NADPH at peak capacity, but the Calvin cycle enzyme RuBisCO lacked CO₂ substrate to fix into sugars.',
      whyItHappens:
        'Photosynthesis operates as a multi-step factory. High light charges the thylakoid batteries (ATP/NADPH). However, carbon fixation in the stroma requires CO₂. When CO₂ is low, the photosystems become photo-inhibited and extra photons are simply dissipated as heat.',
      commonMisconceptions:
        'Assuming more light always yields more plant growth. Without balancing nutrients, water, and CO₂, excess light leads to saturation and light stress.',
      formalLaw:
        "Blackman's Law of Limiting Factors (1905)",
    },
  },

  {
    id: 'case-enzyme-inactivation',
    title: 'The Enzyme Mystery: Inactive Salivary Amylase',
    subject: 'biology',
    difficulty: 'investigator',
    gradeLevel: 'Class 12',
    gradeLevels: ['Class 10', 'Class 11', 'Class 12'],
    caseNumber: 'CASE-BIO-02',
    premise:
      'A biology student heated a test tube containing human salivary amylase and starch to 80°C for 5 minutes, then cooled it back down to body temperature (37°C) and added iodine solution. The solution immediately turned deep blue-black, indicating starch was never broken down into maltose!',
    mysteryQuestion:
      'Why didn’t the enzyme resume breaking down starch once it was cooled back to its optimal 37°C temperature?',
    initialEvidence: [
      'Human salivary amylase works optimally at 37°C and pH 6.8.',
      'Heating occurred to 80°C for 5 minutes.',
      'Cooled back to 37°C before starch was introduced.',
      'Iodine test: Starch remained 100% intact (zero maltose produced).',
    ],
    simulationType: 'enzyme-denaturation',
    availableVariables: [
      {
        id: 'treatmentTemp',
        label: 'Peak Treatment Temperature',
        symbol: 'T_{\\text{peak}}',
        unit: '°C',
        min: 20,
        max: 95,
        step: 5,
        defaultVal: 80,
      },
      {
        id: 'reactionPH',
        label: 'Incubation pH',
        symbol: '\\text{pH}',
        unit: '',
        min: 2,
        max: 12,
        step: 0.5,
        defaultVal: 6.8,
      },
      {
        id: 'substrateAmount',
        label: 'Starch Substrate',
        symbol: '[\\text{Starch}]',
        unit: 'g/L',
        min: 1,
        max: 20,
        step: 1,
        defaultVal: 5,
      },
    ],
    availableEquipment: [
      'Spectrophotometer (Maltose Reducing Sugar Assay)',
      'Water Bath Incubator with Precision PID Controller',
      'Circular Dichroism Spectrometer (Protein Tertiary Folding)',
      'Digital pH Meter',
    ],
    correctIndependentVar: 'treatmentTemp',
    correctDependentVar: 'enzymeActivity',
    scientificFormula: '\\text{Native Enzyme (Folded)} \\xrightarrow{\\Delta H > 0} \\text{Denatured Protein (Unfolded)}, \\quad k_{\\text{cat}} \\to 0',
    progressiveHints: [
      'What kind of chemical bonds maintain the 3D tertiary structure of an enzyme active site?',
      'What happens to thermal kinetic vibration of protein peptide chains above 60°C?',
      'Is thermal protein denaturation reversible like melting ice, or irreversible like boiling an egg?',
      'Thermal denaturation at 80°C breaks hydrogen and ionic bonds, causing the protein to unfold and coagulate irreversibly. Cooling does not restore the catalytic active site!',
    ],
    scientificExplanation: {
      summary:
        'Heating to 80°C broke the delicate non-covalent bonds (hydrogen bonds, hydrophobic interactions, salt bridges) holding the enzyme in its active 3D conformation. The protein denatured irreversibly, destroying the active site forever.',
      whyItHappens:
        'Enzyme active sites depend on precise nanometer-scale geometry. High thermal agitation provides enough kinetic energy to overcome weak tertiary stabilizing interactions. Once unfolded, hydrophobic residues aggregate irreversibly, permanently inactivating the enzyme even when cooled back to 37°C.',
      commonMisconceptions:
        'Thinking that because temperature returned to "optimal 37°C", the enzyme will automatically refold and function normally.',
      formalLaw:
        'Thermodynamics of Protein Denaturation & Loss of Catalytic Conformation',
    },
  },
];
