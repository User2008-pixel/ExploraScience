import { ConceptItem } from '../types/science';

export const NCERT_CLASS11_CHEMISTRY_CONCEPTS: ConceptItem[] = [
  // --- ATOMIC STRUCTURE & QUANTUM NUMBERS ---
  {
    id: 'ncert11-chem-atomic-orbitals-quantum-numbers',
    title: 'Atomic Orbitals, Quantum Numbers & Electron Configurations',
    subject: 'chemistry',
    gradeLevel: 'Class 11',
    tagline: 'Principal n, Azimuthal l, Magnetic m_l, Spin m_s, Aufbau, Pauli & Hund’s Rule',
    description:
      'Schrödinger’s wave equation ψ replaces classical planetary orbits with three-dimensional electron probability distributions (Atomic Orbitals): (1) Principal Quantum Number (n = 1, 2, 3...): Determines main energy level and orbital size (radius r_n ∝ n²); (2) Azimuthal Quantum Number (l = 0 to n-1): Defines orbital shape: l = 0 (spherical s), l = 1 (dumbbell p_x, p_y, p_z), l = 2 (double-dumbbell d), l = 3 (complex f); (3) Magnetic Quantum Number (m_l = -l to +l): Specifies spatial orientation in magnetic fields (2l + 1 orientations per subshell); (4) Electron Spin (m_s = +½, -½): Intrinsic clockwise or counter-clockwise angular momentum. Filling rules: Aufbau Principle (lowest energy orbitals fill first via n + l rule), Pauli Exclusion Principle (no two electrons in an atom can share identical four quantum numbers), and Hund’s Rule of Maximum Multiplicity (degenerate orbitals are singly occupied with parallel spins before pairing).',
    formulaLaTeX: '\\Delta x \\cdot \\Delta p \\ge \\frac{h}{4\\pi} \\quad | \\quad \\lambda = \\frac{h}{p} \\quad | \\quad E_n = -\\frac{13.6 \\, Z^2}{n^2} \\text{ eV}',
    formulaExplanation:
      'Energy of orbitals in multi-electron atoms depends on (n + l). For equal (n + l), lower n orbital fills first.',
    variables: [
      { id: 'principalQuantumN', name: 'Principal Shell (n)', symbol: 'n', unit: 'level', min: 1, max: 4, step: 1, defaultValue: 2, description: 'Energy level (1=K, 2=L, 3=M, 4=N).' },
      { id: 'azimuthalQuantumL', name: 'Subshell (l)', symbol: 'l', unit: 'type', min: 0, max: 3, step: 1, defaultValue: 1, description: '0=s, 1=p, 2=d, 3=f.' },
    ],
    prediction: {
      prompt: 'According to the (n + l) rule of Aufbau energy ordering, which orbital fills with electrons first: 4s or 3d?',
      scenario: 'Comparing the energy of 4s orbital (n=4, l=0) vs 3d orbital (n=3, l=2).',
      choices: [
        { id: 'p1', text: '4s fills before 3d because (4 + 0 = 4) is less than (3 + 2 = 5).', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: '3d fills before 4s because its principal quantum number n=3 is lower.', isCorrect: false, misconceptionExplanation: 'Multi-electron orbital energy depends on (n + l), not n alone.' },
        { id: 'p3', text: 'Both orbitals have identical energies and fill simultaneously.', isCorrect: false, misconceptionExplanation: '4s and 3d are not degenerate; 4s has lower energy in neutral atoms.' },
      ],
      correctExplanation: 'For 4s: n + l = 4 + 0 = 4. For 3d: n + l = 3 + 2 = 5. The orbital with lower (n + l) possesses lower energy, so Potassium (Z=19) fills 4s¹ before occupying 3d.',
      relevantFormula: '(n+l)_{4s} = 4 < (n+l)_{3d} = 5 \\implies E_{4s} < E_{3d}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Magnetic Resonance Imaging (MRI)', description: 'Nuclear and electron spin transitions align in high-field superconducting magnets for non-invasive medical imaging.' },
      { title: 'Transition Metal Catalysis & Colors', description: 'Partially filled d-orbitals permit variable oxidation states and d-d electron transitions producing vibrant gemstone colors.' },
    ],
    simulationType: 'class11-chemistry',
  },

  // --- PERIODICITY & PERIODIC TRENDS ---
  {
    id: 'ncert11-chem-periodic-trends-properties',
    title: 'Periodic Table Trends: Atomic Radius, Ionization & Electronegativity',
    subject: 'chemistry',
    gradeLevel: 'Class 11',
    tagline: 'Effective nuclear charge Z_eff, screening shielding effect, and periodic periodicity',
    description:
      'Periodic trends emerge from effective nuclear charge (Z_eff = Z - σ) and principal quantum shell n: (1) Atomic Radius: Decreases across a period from left to right because increasing nuclear charge pulls valence electrons closer; increases down a group as new electronic shells are added; (2) Ionization Enthalpy (Δ_i H): Minimum energy required to remove the most loosely bound electron from an isolated gaseous atom. Increases across a period (higher Z_eff, smaller radius); decreases down a group (increased shielding and distance). Anomalies: Beryllium (2s² full) has higher IE than Boron (2p¹); Nitrogen (2p³ half-filled extra stable) has higher IE than Oxygen (2p⁴); (3) Electronegativity (Pauling Scale): Tendency of an atom in a molecule to attract shared bonding electrons. Fluorine is the most electronegative element (4.0), followed by Oxygen (3.5) and Nitrogen (3.0).',
    formulaLaTeX: 'Z_{\\text{eff}} = Z - \\sigma \\quad | \\quad \\Delta_i H \\propto \\frac{Z_{\\text{eff}}}{r}',
    formulaExplanation:
      'Across a period, Z_eff increases while screening constant increases slowly, drawing valence electrons tighter to the nucleus.',
    variables: [
      { id: 'atomicNumberZ', name: 'Atomic Number (Z)', symbol: 'Z', unit: 'protons', min: 3, max: 18, step: 1, defaultValue: 11, description: 'Select element from Lithium (3) to Argon (18).' },
    ],
    prediction: {
      prompt: 'Why is the first ionization enthalpy of Nitrogen (Z=7) greater than that of Oxygen (Z=8)?',
      scenario: 'Comparing nitrogen 1s² 2s² 2p³ with oxygen 1s² 2s² 2p⁴.',
      choices: [
        { id: 'p1', text: 'Nitrogen possesses a stable half-filled 2p³ subshell with high exchange energy.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Oxygen has a smaller nuclear charge than nitrogen.', isCorrect: false, misconceptionExplanation: 'Oxygen has Z=8 protons, which is greater than nitrogen Z=7.' },
        { id: 'p3', text: 'Nitrogen has an extra electron shell.', isCorrect: false, misconceptionExplanation: 'Both nitrogen and oxygen reside in the second period (n=2).' },
      ],
      correctExplanation: 'Nitrogen has electronic configuration 1s² 2s² 2p_x¹ 2p_y¹ 2p_z¹ (exactly half-filled 2p subshell, symmetrically distributed spins with high exchange stability). In Oxygen (2p_x² 2p_y¹ 2p_z¹), electron-electron repulsion between paired electrons in the same 2p_x orbital makes it easier to remove one electron.',
      relevantFormula: '\\Delta_i H(\\text{N}) = 1402 \\text{ kJ/mol} > \\Delta_i H(\\text{O}) = 1314 \\text{ kJ/mol}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Lithium-Ion Battery Anodes', description: 'Lithium has the lowest standard reduction potential (-3.05 V) and lowest atomic weight, maximizing energy storage density.' },
      { title: 'Noble Gas Inertness in Arc Welding', description: 'Argon’s completely filled octet gives massive ionization enthalpy, serving as non-reactive shielding gas for welding molten metals.' },
    ],
    simulationType: 'class11-chemistry',
  },

  // --- CHEMICAL BONDING & VSEPR MOLECULAR GEOMETRY ---
  {
    id: 'ncert11-chem-vsepr-molecular-geometry-hybridization',
    title: 'VSEPR Theory, Orbital Hybridisation & 3D Molecular Geometry',
    subject: 'chemistry',
    gradeLevel: 'Class 11',
    tagline: 'Repulsion order: lp-lp > lp-bp > bp-bp; sp, sp², sp³, sp³d, sp³d² hybridisation',
    description:
      'Valence Shell Electron Pair Repulsion (VSEPR) Theory predicts molecular shapes: Electron pairs surrounding a central atom repel each other and position themselves as far apart as possible in 3D space to minimize electrostatic repulsion. Magnitude of repulsion: Lone Pair - Lone Pair (lp - lp) > Lone Pair - Bond Pair (lp - bp) > Bond Pair - Bond Pair (bp - bp). Geometries: (1) Linear: 2 bond pairs, 180° (BeCl₂, CO₂, sp hybrid); (2) Trigonal Planar: 3 bond pairs, 120° (BF₃, sp²); (3) Tetrahedral: 4 bond pairs, 109.5° (CH₄, sp³). In ammonia NH₃ (3 bp + 1 lp), lone-pair repulsion compresses H-N-H bond angle to 107° (Pyramidal); in water H₂O (2 bp + 2 lp), two lone pairs compress H-O-H angle to 104.5° (Bent/V-shaped); (4) Trigonal Bipyramidal: 5 pairs (PCl₅, sp³d, axial bonds longer than equatorial); (5) Octahedral: 6 pairs, 90° (SF₆, sp³d²).',
    formulaLaTeX: '\\text{Steric Number} = \\frac{1}{2} [V + M - C + A] \\quad | \\quad \\text{Repulsion: } lp\\text{-}lp > lp\\text{-}bp > bp\\text{-}bp',
    formulaExplanation:
      'Steric number dictates the spatial arrangement of electron domains, while actual molecular geometry reflects the arrangement of bonded atoms.',
    variables: [
      { id: 'stericNumberSn', name: 'Steric Number (bp + lp)', symbol: 'SN', unit: 'domains', min: 2, max: 6, step: 1, defaultValue: 4, description: '2=sp, 3=sp2, 4=sp3, 5=sp3d, 6=sp3d2.' },
      { id: 'lonePairCount', name: 'Lone Pairs (lp)', symbol: 'lp', unit: 'pairs', min: 0, max: 2, step: 1, defaultValue: 0, description: 'Number of unshared electron pairs.' },
    ],
    prediction: {
      prompt: 'Why is the bond angle in a water molecule (104.5°) smaller than the ideal tetrahedral angle in methane (109.5°)?',
      scenario: 'Comparing tetrahedral CH4 (0 lp) with bent H2O (2 lp).',
      choices: [
        { id: 'p1', text: 'Two lone pairs on oxygen exert greater repulsive forces than bond pairs, compressing the H-O-H bond angle.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Hydrogen atoms in water are smaller than in methane.', isCorrect: false, misconceptionExplanation: 'Hydrogen atoms are identical in both molecules.' },
        { id: 'p3', text: 'Oxygen has sp² hybridisation while carbon has sp³.', isCorrect: false, misconceptionExplanation: 'Both oxygen in water and carbon in methane undergo sp³ hybridisation.' },
      ],
      correctExplanation: 'According to VSEPR theory, lone pair electrons are localized exclusively on the oxygen nucleus, occupying larger spatial volume than bonded electron pairs. The strong lp-lp and lp-bp repulsions push the two O-H bond pairs together, reducing the angle from 109.5° to 104.5°.',
      relevantFormula: '\\angle(\\text{CH}_4) = 109.5^\\circ > \\angle(\\text{NH}_3) = 107^\\circ > \\angle(\\text{H}_2\\text{O}) = 104.5^\\circ',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Water’s Anomalous Expansion & Life in Ice-Covered Lakes', description: 'The 104.5° bent structure and hydrogen bonding create an open hexagonal ice crystal lattice that is less dense than liquid water, allowing aquatic life to survive under frozen lakes.' },
      { title: 'Pharmaceutical Drug Receptor Docking', description: 'Medicinal enzymes recognize ligand drug molecules through precise complementary three-dimensional geometries and chiral bond orientations.' },
    ],
    simulationType: 'class11-chemistry',
  },

  // --- CHEMICAL EQUILIBRIUM & LE CHATELIER ---
  {
    id: 'ncert11-chem-chemical-equilibrium-le-chatelier',
    title: 'Chemical Equilibrium, Equilibrium Constant & Le Chatelier’s Principle',
    subject: 'chemistry',
    gradeLevel: 'Class 11',
    tagline: 'K_c = [C]^c [D]^d / [A]^a [B]^b, dynamic forward = reverse rate, Le Chatelier shift',
    description:
      'In a closed system, a reversible reaction reaches Chemical Equilibrium when the forward reaction rate equals the reverse reaction rate (dynamic equilibrium, concentrations of reactants and products remain constant over time). Law of Mass Action: For aA + bB ⇌ cC + dD, Equilibrium Constant K_c = ([C]^c [D]^d) / ([A]^a [B]^b) and K_p = K_c (RT)^Δn. Le Chatelier’s Principle states that if a system at equilibrium is subjected to a disturbance in concentration, pressure, or temperature, the system will shift in the direction that counteracts the imposed change: (1) Increasing reactant concentration shifts equilibrium forward; (2) Increasing pressure shifts equilibrium toward fewer gaseous moles (Haber synthesis: N₂ + 3H₂ ⇌ 2NH₃, 4 moles → 2 moles, high pressure favors NH₃); (3) For exothermic reactions (ΔH < 0), lowering temperature shifts forward.',
    formulaLaTeX: 'K_p = K_c (RT)^{\\Delta n_g} \\quad | \\quad \\Delta G^\\circ = -RT \\ln(K)',
    formulaExplanation:
      'Equilibrium constant K depends exclusively on temperature. Catalysts accelerate both forward and reverse rates equally without altering K.',
    variables: [
      { id: 'systemPressureAtm', name: 'Pressure (P)', symbol: 'P', unit: 'atm', min: 1, max: 10, step: 1, defaultValue: 2, description: 'Total system pressure.' },
      { id: 'systemTempKelvin', name: 'Temperature (T)', symbol: 'T', unit: 'K', min: 300, max: 700, step: 50, defaultValue: 450, description: 'Reaction temperature in Kelvin.' },
    ],
    prediction: {
      prompt: 'In the industrial Haber process for ammonia synthesis: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + 92 kJ (exothermic), what operational conditions maximize ammonia yield?',
      scenario: 'Applying Le Chatelier’s principle to 4 gaseous reactant moles producing 2 gaseous product moles with ΔH = -92 kJ/mol.',
      choices: [
        { id: 'p1', text: 'High pressure (shifts toward fewer gas moles) and moderate/low temperature (favors exothermic forward reaction).', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Low pressure and high temperature.', isCorrect: false, misconceptionExplanation: 'High temperature shifts exothermic reactions backward, reducing yield.' },
        { id: 'p3', text: 'Low pressure and low temperature.', isCorrect: false, misconceptionExplanation: 'Low pressure shifts equilibrium toward 4 moles of reactants (backward).' },
      ],
      correctExplanation: 'Reactants comprise 4 moles of gas (1 N₂ + 3 H₂) while products comprise 2 moles (2 NH₃). High pressure shifts equilibrium forward toward fewer moles. Since ΔH is negative (exothermic), lowering temperature favors the forward reaction (an optimum ~450°C with iron catalyst is used commercially).',
      relevantFormula: '\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g), \\quad \\Delta H = -92\\text{ kJ/mol}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Industrial Haber-Bosch Ammonia Fertilizers', description: 'Synthesizing hundreds of millions of tons of ammonia annually using 200 atm pressure sustains global agricultural crop yields.' },
      { title: 'Hemoglobin Oxygen Binding Equilibrium in Blood', description: 'High oxygen partial pressure in the lungs shifts Hb + 4O₂ ⇌ Hb(O₂)₄ forward; low pressure in exercising muscles shifts it backward to release oxygen.' },
    ],
    simulationType: 'class11-chemistry',
  },
];
