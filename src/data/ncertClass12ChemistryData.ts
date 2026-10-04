import { ConceptItem } from '../types/science';

export const NCERT_CLASS12_CHEMISTRY_CONCEPTS: ConceptItem[] = [
  // --- SOLUTIONS & COLLIGATIVE PROPERTIES ---
  {
    id: 'ncert12-chem-solutions-colligative-properties',
    title: 'Solutions: Raoult’s Law, Boiling Point Elevation & Osmotic Pressure',
    subject: 'chemistry',
    gradeLevel: 'Class 12',
    tagline: 'Colligative properties depend only on solute particle count: ΔT_b = i K_b m and Π = i C R T',
    description:
      'Colligative properties are thermodynamic properties of dilute solutions that depend strictly on the number of solute particles, independent of their chemical identity: (1) Relative Lowering of Vapor Pressure (Raoult’s Law): (P₁° - P₁) / P₁° = x₂ (mole fraction of non-volatile solute); (2) Elevation of Boiling Point: Dissolving non-volatile solute lowers vapor pressure, requiring a higher temperature for vapor pressure to reach 1 atm: ΔT_b = T_b - T_b° = i K_b m (where K_b is the molal ebullioscopic constant, m is molality); (3) Depression of Freezing Point: ΔT_f = i K_f m; (4) Osmotic Pressure (Π): Minimum external pressure required to prevent the osmosis of solvent through a semi-permeable membrane: Π = i C R T = i (n₂/V) R T (used to determine molar masses of polymers and proteins); (5) van ’t Hoff Factor (i): i = (observed colligative property) / (calculated property), where i > 1 for electrolytes (dissociation NaCl i ≈ 2, BaCl₂ i ≈ 3) and i < 1 for association (acetic acid in benzene dimers i ≈ 0.5).',
    formulaLaTeX: '\\Delta T_b = i \\, K_b \\, m \\quad | \\quad \\Delta T_f = i \\, K_f \\, m \\quad | \\quad \\Pi = i \\, C R T',
    formulaExplanation:
      'Electrolytes that dissociate into multiple ions in solution multiply the colligative effect by the van ’t Hoff factor i.',
    variables: [
      { id: 'soluteMolalityM', name: 'Molality (m)', symbol: 'm', unit: 'mol/kg', min: 0.1, max: 2.0, step: 0.1, defaultValue: 0.5, description: 'Concentration of dissolved solute particles.' },
      { id: 'vantHoffFactorI', name: 'van ’t Hoff Factor (i)', symbol: 'i', unit: 'factor', min: 1.0, max: 3.0, step: 0.5, defaultValue: 1.0, description: '1.0 for glucose/urea, 2.0 for NaCl, 3.0 for CaCl₂.' },
    ],
    prediction: {
      prompt: 'Which of the following 0.1 M aqueous solutions exhibits the lowest freezing point (largest depression of freezing point ΔT_f)?',
      scenario: 'Comparing 0.1 M solutions of Glucose (i=1), NaCl (i=2), and AlCl3 (i=4).',
      choices: [
        { id: 'p1', text: '0.1 M AlCl₃ solution (dissociates into 4 ions: Al³⁺ + 3Cl⁻, giving highest total particle concentration).', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: '0.1 M Glucose solution.', isCorrect: false, misconceptionExplanation: 'Glucose is a non-electrolyte (i=1) and produces the fewest particles.' },
        { id: 'p3', text: '0.1 M NaCl solution.', isCorrect: false, misconceptionExplanation: 'NaCl produces 2 ions, less than AlCl3 (4 ions).' },
      ],
      correctExplanation: 'Depression of freezing point is a colligative property: ΔT_f = i K_f m. For 0.1 M AlCl₃, i = 4, giving an effective particle concentration of 0.4 mol/L. This produces the largest depression ΔT_f, yielding the lowest freezing point.',
      relevantFormula: '\\Delta T_f(\\text{AlCl}_3) = 4 K_f m > \\Delta T_f(\\text{NaCl}) = 2 K_f m > \\Delta T_f(\\text{Glucose}) = 1 K_f m',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Highway Anti-Freeze Deicing with Rock Salt', description: 'Sprinkling calcium chloride (CaCl₂) or sodium chloride on icy winter highways lowers the freezing point of water below 0°C, melting snow.' },
      { title: 'Intravenous Saline Injections (0.9% NaCl)', description: 'Medical IV saline is isotonic with blood plasma (~300 mOsm/L) to prevent red blood cells from swelling (hemolysis) or shrinking (crenation).' },
    ],
    simulationType: 'class12-chemistry',
  },

  // --- ELECTROCHEMISTRY & NERNST EQUATION ---
  {
    id: 'ncert12-chem-electrochemistry-nernst-equation',
    title: 'Electrochemistry: Galvanic Daniell Cell & Nernst Equation',
    subject: 'chemistry',
    gradeLevel: 'Class 12',
    tagline: 'Anode oxidation Zn → Zn²⁺ + 2e⁻, Cathode reduction Cu²⁺ + 2e⁻ → Cu, and E_cell = E° - (0.0591/n) log Q',
    description:
      'Galvanic Cells convert chemical energy of a spontaneous redox reaction into electrical energy: (1) Daniell Cell: Zinc electrode immersed in 1 M ZnSO₄ acts as Anode (oxidation: Zn(s) → Zn²⁺ + 2e⁻, negative terminal); Copper electrode in 1 M CuSO₄ acts as Cathode (reduction: Cu²⁺ + 2e⁻ → Cu(s), positive terminal). Electrons flow in external wire from Zn to Cu; conventional current flows from Cu to Zn; (2) Salt Bridge: Contains inert electrolyte (KCl/KNO₃ in agar-agar) to maintain electrical neutrality and prevent liquid-junction potential; (3) Standard Cell Potential: E°_cell = E°_cathode - E°_anode = +0.34 V - (-0.76 V) = +1.10 V; (4) Nernst Equation: Calculates cell EMF under non-standard conditions at 298 K: E_cell = E°_cell - (0.0591 / n) log₁₀ Q = E°_cell - (0.0591 / 2) log₁₀ ([Zn²⁺] / [Cu²⁺]); (5) Maximum Electrical Work: ΔG° = -n F E°_cell.',
    formulaLaTeX: 'E_{\\text{cell}} = E^\\circ_{\\text{cell}} - \\frac{0.0591}{n} \\log_{10}\\left(\\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]}\\right) \\quad | \\quad \\Delta G^\\circ = -n F E^\\circ',
    formulaExplanation:
      'As the cell discharges, [Zn²⁺] increases and [Cu²⁺] decreases until reaction quotient Q = K_c and cell potential E_cell drops to zero (dead battery).',
    variables: [
      { id: 'zincIonConcMolar', name: 'Anode [Zn²⁺]', symbol: '[\\text{Zn}^{2+}]', unit: 'M', min: 0.01, max: 2.0, step: 0.1, defaultValue: 0.1, description: 'Zinc ion concentration at anode.' },
      { id: 'copperIonConcMolar', name: 'Cathode [Cu²⁺]', symbol: '[\\text{Cu}^{2+}]', unit: 'M', min: 0.1, max: 2.0, step: 0.1, defaultValue: 1.0, description: 'Copper ion concentration at cathode.' },
    ],
    prediction: {
      prompt: 'If the concentration of copper ions [Cu²⁺] in a Daniell cell is increased from 0.1 M to 1.0 M, what happens to the output cell EMF?',
      scenario: 'Cathode [Cu²⁺] increased while keeping anode [Zn²⁺] constant.',
      choices: [
        { id: 'p1', text: 'Cell EMF increases.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Cell EMF decreases.', isCorrect: false, misconceptionExplanation: 'Increasing reactant concentration shifts redox forward, raising cell voltage.' },
        { id: 'p3', text: 'Cell EMF remains unchanged at 1.10 V.', isCorrect: false, misconceptionExplanation: 'Non-standard concentration changes cell EMF via the Nernst equation.' },
      ],
      correctExplanation: 'By Nernst equation: E_cell = E° - (0.0591/2) log([Zn²⁺]/[Cu²⁺]). Increasing denominator [Cu²⁺] decreases the quotient Q, reducing the subtracted term and increasing the net output cell voltage.',
      relevantFormula: 'E_{\\text{cell}} = 1.10 - 0.02955 \\log\\left(\\frac{[\\text{Zn}^{2+}]}{[\\text{Cu}^{2+}]}\\right)',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Hydrogen Fuel Cell Vehicles (FCVs)', description: 'Hydrogen gas is oxidized at anode and oxygen reduced at cathode, generating clean electricity with water as sole byproduct.' },
      { title: 'Lithium-Ion Smartphone Batteries', description: 'Rechargeable secondary cells shuttle Li⁺ ions between graphite anode and lithium cobalt oxide cathode.' },
    ],
    simulationType: 'class12-chemistry',
  },

  // --- CHEMICAL KINETICS & ARRHENIUS EQUATION ---
  {
    id: 'ncert12-chem-chemical-kinetics-arrhenius',
    title: 'Chemical Kinetics: Reaction Rate, Order & Arrhenius Equation',
    subject: 'chemistry',
    gradeLevel: 'Class 12',
    tagline: 'Rate = k [A]^x [B]^y, first order t_½ = 0.693/k, and Arrhenius k = A · e^(-E_a / RT)',
    description:
      'Chemical Kinetics studies the speeds of chemical processes and their molecular mechanisms: (1) Rate of Reaction: Change in concentration of reactant or product per unit time: Rate = -d[R]/dt = d[P]/dt; (2) Rate Law & Order: Rate = k [A]^x [B]^y, where overall order n = x + y (determined experimentally, can be fractional or zero); (3) Integrated Rate Law for First-Order Reactions: ln([A]₀ / [A]_t) = k t => [A]_t = [A]₀ e^(-kt), with constant half-life t_½ = 0.693 / k (independent of initial concentration); (4) Collision Theory & Activation Energy (E_a): Reactant molecules must collide with proper spatial orientation and possess minimum threshold kinetic energy to form activated transition state complexes; (5) Arrhenius Equation: Temperature dependence of rate constant: k = A e^(-E_a / RT) => ln(k₂/k₁) = (E_a / R) · (1/T₁ - 1/T₂). Raising temperature by 10°C typically doubles reaction rate.',
    formulaLaTeX: 'k = A e^{-\\frac{E_a}{RT}} \\quad | \\quad t_{1/2} = \\frac{0.693}{k} \\quad | \\quad \\ln\\left(\\frac{k_2}{k_1}\\right) = \\frac{E_a}{R} \\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)',
    formulaExplanation:
      'Catalysts lower activation energy E_a by providing an alternative reaction path with lower energetic barrier, accelerating reaction rate exponentially.',
    variables: [
      { id: 'reactionTempKelvin', name: 'Temperature (T)', symbol: 'T', unit: 'K', min: 280, max: 400, step: 10, defaultValue: 300, description: 'Absolute reaction temperature.' },
      { id: 'activationEnergyKj', name: 'Activation Energy (E_a)', symbol: 'E_a', unit: 'kJ/mol', min: 20, max: 120, step: 10, defaultValue: 60, description: 'Energy barrier to form activated complex.' },
    ],
    prediction: {
      prompt: 'How does a chemical catalyst increase the rate of a chemical reaction without being consumed?',
      scenario: 'A catalyst (e.g. platinum in catalytic converter) is added to a reaction mixture.',
      choices: [
        { id: 'p1', text: 'It provides an alternative reaction mechanism with a lower activation energy barrier (E_a).', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'It increases the total thermal kinetic energy of the molecules.', isCorrect: false, misconceptionExplanation: 'Thermal kinetic energy depends on temperature, not on catalysts.' },
        { id: 'p3', text: 'It shifts the equilibrium constant K to favor products.', isCorrect: false, misconceptionExplanation: 'Catalysts accelerate both forward and backward rates equally; they never alter equilibrium constant K.' },
      ],
      correctExplanation: 'A catalyst offers an alternate reaction pathway with a lower activation energy E_a. According to the Arrhenius equation k = A exp(-E_a/RT), lowering E_a exponentially increases the fraction of molecular collisions that possess sufficient energy to react.',
      relevantFormula: 'k_{\\text{cat}} = A e^{-\\frac{E_{a,\\text{cat}}}{RT}} \\gg k_{\\text{uncat}}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Automobile Platinum Catalytic Converters', description: 'Catalytic honeycombs convert toxic CO and unburned hydrocarbons into CO₂ and H₂O in milliseconds at exhaust temperatures.' },
      { title: 'Radioactive Carbon-14 Dating', description: 'First-order nuclear decay of C-14 with constant half-life (t_½ = 5730 years) determines age of ancient fossils and archaeological artifacts.' },
    ],
    simulationType: 'class12-chemistry',
  },

  // --- COORDINATION COMPOUNDS & CRYSTAL FIELD THEORY ---
  {
    id: 'ncert12-chem-coordination-compounds-cft',
    title: 'Coordination Compounds & Crystal Field Theory (CFT)',
    subject: 'chemistry',
    gradeLevel: 'Class 12',
    tagline: 'Octahedral splitting Δ_o into t_2g and e_g, spectrochemical series, and d-d transition colors',
    description:
      'Coordination compounds consist of a central transition metal ion surrounded by coordinate-covalent donor ligand atoms: (1) Werner’s Coordination Theory: Primary valence (ionizable oxidation state) and Secondary valence (non-ionizable directional coordination number); (2) Crystal Field Theory (CFT): Treats metal-ligand bonds as electrostatic ionic interactions. In an octahedral complex, surrounding negative ligands approach along the Cartesian axes (x, y, z), causing the five degenerate d-orbitals to split energetically into two sets: lower-energy triply degenerate t_2g orbitals (d_xy, d_yz, d_zx pointing between axes) and higher-energy doubly degenerate e_g orbitals (d_x²-y², d_z² pointing directly at ligands), separated by crystal field splitting energy Δ_o; (3) Spectrochemical Series: Weak field ligands (I⁻ < Br⁻ < Cl⁻ < F⁻ < H₂O) give small Δ_o (high-spin complexes); strong field ligands (NH₃ < en < CN⁻ < CO) give large Δ_o (low-spin paired complexes); (4) Color: Electron absorption of specific visible wavelengths promotes a t_2g electron to e_g (d-d transition), transmitting the complementary color.',
    formulaLaTeX: '\\Delta_o = E(e_g) - E(t_{2g}) \\quad | \\quad \\text{CFSE} = \\left[-0.4 \\, n(t_{2g}) + 0.6 \\, n(e_g)\\right] \\Delta_o + mP',
    formulaExplanation:
      'Strong-field ligands (large Δ_o > P pairing energy) force electrons to pair in t_2g orbitals before filling e_g.',
    variables: [
      { id: 'ligandStrengthDelta', name: 'Ligand Field (Δ_o)', symbol: '\\Delta_o', unit: 'kJ/mol', min: 100, max: 350, step: 25, defaultValue: 200, description: '100=Weak field (H2O), 350=Strong field (CN-).' },
    ],
    prediction: {
      prompt: 'Why are transition metal complex ions like [Ti(H₂O)₆]³⁺ (titanium(III) d¹ complex) intensely colored (violet)?',
      scenario: 'A solution of [Ti(H2O)6]3+ absorbs green-yellow light (~500 nm).',
      choices: [
        { id: 'p1', text: 'Absorption of light promotes an electron from lower t_2g to higher e_g orbital (d-d transition), and the transmitted complementary light is violet.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Water molecules undergo chemical combustion in the solution.', isCorrect: false, misconceptionExplanation: 'Hydrated titanium complexes are chemically stable in water.' },
        { id: 'p3', text: 'Titanium nucleus undergoes radioactive alpha decay.', isCorrect: false, misconceptionExplanation: 'Color in coordination chemistry is purely an electronic d-d transition phenomenon.' },
      ],
      correctExplanation: 'In octahedral [Ti(H₂O)₆]³⁺, the single 3d¹ electron occupies a t_2g orbital. When white light passes through, a photon of green-yellow light (λ ~ 500 nm) is absorbed matching crystal field splitting energy Δ_o, promoting the electron to e_g. The unabsorbed transmitted complementary light appears purple-violet.',
      relevantFormula: '\\Delta_o = \\frac{h c}{\\lambda} \\quad (\\text{d-d electronic transition})',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Hemoglobin & Chlorophyll Metal Complexes', description: 'Hemoglobin coordinates an iron(II) heme complex for oxygen transport, while chlorophyll coordinates magnesium for photosynthetic solar harvesting.' },
      { title: 'Cisplatin Cancer Chemotherapy', description: 'cis-[Pt(NH₃)₂Cl₂] cross-links guanine DNA bases in rapidly dividing cancer cells, inhibiting replication.' },
    ],
    simulationType: 'class12-chemistry',
  },
];
