import { ConceptItem } from '../types/science';

export const NCERT_CLASS10_CHEMISTRY_CONCEPTS: ConceptItem[] = [
  // --- CHAPTER 1: CHEMICAL REACTIONS AND EQUATIONS ---
  {
    id: 'ncert10-chem-types-of-reactions-redox',
    title: 'Types of Chemical Reactions, Balancing & Redox Processes',
    subject: 'chemistry',
    gradeLevel: 'Class 10',
    tagline: 'Combination, Decomposition, Displacement, Double Displacement & Oxidation-Reduction',
    description:
      'Chemical reactions involve the breaking and forming of bonds between atoms to produce new substances. (1) Combination: Two or more reactants combine to form a single product (e.g., CaO + H₂O → Ca(OH)₂ quicklime slaking with high exothermic heat); (2) Decomposition: A single compound breaks down into simpler substances via heat (thermal: CaCO₃ → CaO + CO₂), light (photochemical: 2AgCl → 2Ag + Cl₂), or electricity (electrolysis: 2H₂O → 2H₂ + O₂); (3) Displacement: A more reactive metal displaces a less reactive metal from its aqueous salt solution (Fe + CuSO₄ → FeSO₄ + Cu reddish deposit); (4) Double Displacement (Precipitation): Mutual exchange of ions forms an insoluble precipitate (Na₂SO₄ + BaCl₂ → BaSO₄↓ white ppt + 2NaCl); (5) Oxidation-Reduction (Redox): Oxidation is gain of oxygen or loss of electrons; reduction is loss of oxygen or gain of electrons (CuO + H₂ → Cu + H₂O).',
    formulaLaTeX: '\\text{Fe} + \\text{CuSO}_4 \\to \\text{FeSO}_4 + \\text{Cu} \\downarrow \\quad | \\quad \\text{CuO} + \\text{H}_2 \\xrightarrow{\\Delta} \\text{Cu} + \\text{H}_2\\text{O}',
    formulaExplanation:
      'In redox, the substance gaining oxygen is oxidized (reducing agent); the substance losing oxygen is reduced (oxidizing agent).',
    variables: [
      { id: 'reactionTempCelsius', name: 'Temperature (T)', symbol: 'T', unit: '°C', min: 25, max: 500, step: 25, defaultValue: 100, description: 'Reaction activation temperature.' },
    ],
    prediction: {
      prompt: 'When an iron nail is immersed in a blue copper sulfate solution for 30 minutes, what observable chemical changes take place?',
      scenario: 'An iron nail (Fe) placed in blue CuSO4 (aq) solution.',
      choices: [
        { id: 'p1', text: 'Blue solution turns pale green and reddish-brown copper deposits on the iron nail.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Solution turns completely colorless with no solid deposit.', isCorrect: false, misconceptionExplanation: 'Fe2+ ions in FeSO4 have a distinct pale green color.' },
        { id: 'p3', text: 'No reaction occurs because copper is more reactive than iron.', isCorrect: false, misconceptionExplanation: 'Iron is higher than copper in the reactivity series.' },
      ],
      correctExplanation: 'Iron is more reactive than copper. Iron atoms lose 2 electrons to form pale green Fe²⁺ ions in solution, while Cu²⁺ ions gain electrons and deposit as metallic copper (reddish-brown coating).',
      relevantFormula: '\\text{Fe}(s) + \\text{Cu}^{2+}(aq) \\to \\text{Fe}^{2+}(aq) + \\text{Cu}(s)',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Black-and-White Photography', description: 'Photolytic decomposition of light-sensitive silver chloride (AgCl) and silver bromide (AgBr) forms metallic silver grains.' },
      { title: 'Rancidity & Antioxidants in Food', description: 'Oils and fats undergo atmospheric oxidation, producing foul odors, prevented by flushing potato chip bags with inert nitrogen gas.' },
    ],
    simulationType: 'class10-chemistry',
  },

  // --- CHAPTER 2: ACIDS, BASES AND SALTS ---
  {
    id: 'ncert10-chem-acids-bases-ph-scale',
    title: 'Acids, Bases, Universal pH Scale & Salt Chemistry',
    subject: 'chemistry',
    gradeLevel: 'Class 10',
    tagline: 'pH = -log[H⁺], neutralization acid + base → salt + water, and chlor-alkali products',
    description:
      'Acids generate hydronium ions (H₃O⁺) in aqueous solution (turn blue litmus red, sour taste), while bases generate hydroxide ions (OH⁻) (turn red litmus blue, bitter taste, soapy touch). Neutralization: Acid + Base → Salt + Water (HCl + NaOH → NaCl + H₂O, exothermic). The Universal pH Scale (0 to 14) quantifies hydrogen ion concentration: Neutral pH = 7 (pure water); Acidic pH < 7 (high [H⁺], gastric juice pH ~ 1.2, lemon juice pH ~ 2.2); Basic pH > 7 (high [OH⁻], milk of magnesia pH ~ 10, sodium hydroxide pH ~ 14). Common salts: (1) Bleaching Powder: Ca(OH)₂ + Cl₂ → CaOCl₂ + H₂O; (2) Baking Soda: NaHCO₃ produces CO₂ during heating for fluffy cakes; (3) Washing Soda: Na₂CO₃·10H₂O; (4) Plaster of Paris: CaSO₄·½H₂O setting hard into gypsum with water.',
    formulaLaTeX: '\\text{pH} = -\\log_{10}[\\text{H}^+] \\quad | \\quad \\text{HCl} + \\text{NaOH} \\to \\text{NaCl} + \\text{H}_2\\text{O}',
    formulaExplanation:
      'Each one-unit change in pH corresponds to a tenfold (10x) change in hydrogen ion concentration.',
    variables: [
      { id: 'solutionPhValue', name: 'Solution pH', symbol: '\\text{pH}', unit: 'pH units', min: 1, max: 14, step: 1, defaultValue: 7, description: 'Universal indicator pH level.' },
    ],
    prediction: {
      prompt: 'Tooth decay in humans begins when the pH inside the oral mouth cavity drops below what critical threshold?',
      scenario: 'Bacterial breakdown of sugary food particles produces organic acids in the mouth.',
      choices: [
        { id: 'p1', text: 'pH 5.5 (Tooth enamel hydroxyapatite dissolves in acid below pH 5.5).', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'pH 7.0 (Neutral water level).', isCorrect: false, misconceptionExplanation: 'Saliva naturally buffers oral pH around 6.5–7.5 without damaging enamel.' },
        { id: 'p3', text: 'pH 2.0 (Extreme battery acid).', isCorrect: false, misconceptionExplanation: 'Calcium hydroxyapatite demineralizes well before extreme acid levels.' },
      ],
      correctExplanation: 'Tooth enamel is calcium phosphate (hydroxyapatite), the hardest substance in the body. Below pH 5.5, oral acid dissolves enamel. Alkaline toothpastes neutralize these acids.',
      relevantFormula: '\\text{Demineralization threshold: } \\text{pH} < 5.5',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Antacid Tablets for Acidity', description: 'Mild bases like magnesium hydroxide Mg(OH)₂ (Milk of Magnesia) neutralize excess stomach hydrochloric acid.' },
      { title: 'Soil Treatment with Slaked Lime', description: 'Farmers apply powdered limestone (CaCO₃) or slaked lime Ca(OH)₂ to acidic agricultural soils to optimize crop nutrient uptake.' },
    ],
    simulationType: 'class10-chemistry',
  },

  // --- CHAPTER 3: METALS AND NON-METALS ---
  {
    id: 'ncert10-chem-metals-reactivity-ionic-bonding',
    title: 'Reactivity Series of Metals & Ionic (Electrovalent) Bonding',
    subject: 'chemistry',
    gradeLevel: 'Class 10',
    tagline: 'K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au & electron transfer NaCl',
    description:
      'Metals are electropositive elements that readily lose valence electrons to form cations. Reactivity Series arranges metals in decreasing order of chemical reactivity: Potassium and sodium react vigorously with cold water (2Na + 2H₂O → 2NaOH + H₂↑ + heat); Magnesium reacts with hot water; Iron and zinc react only with steam; Copper, silver, and gold do not react with water or dilute acids. Ionic Bonding: Formed by complete transfer of electrons from a metal atom to a non-metal atom. Example: Sodium (2,8,1) loses 1 electron to become Na⁺; Chlorine (2,8,7) gains 1 electron to become Cl⁻. Strong electrostatic forces of attraction between oppositely charged ions form a crystalline ionic lattice with high melting point and conductivity in molten/aqueous state.',
    formulaLaTeX: '\\text{Na} \\to \\text{Na}^+ + e^- \\quad | \\quad \\text{Cl} + e^- \\to \\text{Cl}^- \\implies \\text{Na}^+ + \\text{Cl}^- \\to \\text{NaCl}',
    formulaExplanation:
      'Ionic compounds do not conduct electricity in solid state because ions are fixed in rigid lattice; in molten or dissolved state, free ions act as charge carriers.',
    variables: [
      { id: 'metalSelectionRank', name: 'Metal Reactivity Rank', symbol: 'M', unit: 'rank', min: 1, max: 5, step: 1, defaultValue: 2, description: '1=Potassium, 2=Magnesium, 3=Zinc, 4=Iron, 5=Copper.' },
    ],
    prediction: {
      prompt: 'Why do ionic compounds like sodium chloride (NaCl) have high melting and boiling points?',
      scenario: 'Comparing melting points of ionic crystals vs covalent molecules.',
      choices: [
        { id: 'p1', text: 'Immense energy is required to break strong inter-ionic electrostatic attraction throughout the 3D crystal lattice.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'They contain strong covalent bonds between shared electron pairs.', isCorrect: false, misconceptionExplanation: 'Ionic compounds consist of ions, not shared covalent electron pairs.' },
        { id: 'p3', text: 'Ionic compounds are liquid at room temperature.', isCorrect: false, misconceptionExplanation: 'Ionic compounds are hard crystalline solids at room temperature.' },
      ],
      correctExplanation: 'In NaCl, each Na⁺ is surrounded octahedrally by 6 Cl⁻ ions and vice versa. Overcoming this immense three-dimensional electrostatic lattice attraction requires very high thermal kinetic energy (melting point ~801°C).',
      relevantFormula: 'E_{\\text{lattice}} \\propto \\frac{q_1 q_2}{r_0}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Galvanization of Iron Sheets', description: 'Applying a protective sacrificial zinc coating on iron prevents rust: zinc oxidizes preferentially even if scratched.' },
      { title: 'Electrolytic Refining of Copper', description: 'Impure copper anode dissolves, depositing 99.99% pure copper on cathode in acidified copper sulfate bath.' },
    ],
    simulationType: 'class10-chemistry',
  },

  // --- CHAPTER 4: CARBON AND ITS COMPOUNDS ---
  {
    id: 'ncert10-chem-carbon-compounds-micelles',
    title: 'Carbon Covalent Bonding, Hydrocarbons & Soap Micelles',
    subject: 'chemistry',
    gradeLevel: 'Class 10',
    tagline: 'Tetravalency, catenation, homologous series, and hydrophobic/hydrophilic soap micelles',
    description:
      'Carbon forms millions of compounds due to two unique properties: (1) Catenation: Remarkable ability to form long stable covalent chains with other carbon atoms; (2) Tetravalency: Four valence electrons share four electron pairs with other atoms. Hydrocarbons: Alkanes (single bond C_n H_{2n+2}), Alkenes (double bond C_n H_{2n}), and Alkynes (triple bond C_n H_{2n-2}). Functional groups include alcohols (-OH), aldehydes (-CHO), ketones (>C=O), and carboxylic acids (-COOH). Soaps & Detergents: Soaps are sodium or potassium salts of long-chain fatty acids (e.g., sodium stearate C₁₇H₃₅COO⁻Na⁺). A soap molecule possesses a dual nature: an ionic hydrophilic head (water-soluble) and a long non-polar hydrophobic hydrocarbon tail (oil/grease-soluble). In water, soap molecules cluster radially into spherical Micelles: hydrophobic tails point inward trapping oily dirt droplets at the core, while ionic heads point outward into water, forming a stable emulsion washed away by water rinsing.',
    formulaLaTeX: '\\text{C}_n\\text{H}_{2n+2} \\; (\\text{Alkane}) \\quad | \\quad \\text{R-COO}^-\\text{Na}^+ \\; (\\text{Soap Micelle})',
    formulaExplanation:
      'Micelle electrostatic repulsion between outer negative ionic heads prevents dirt droplets from coagulating, keeping them suspended as an emulsion.',
    variables: [
      { id: 'carbonChainLength', name: 'Carbon Chain Length (n)', symbol: 'n', unit: 'atoms', min: 1, max: 6, step: 1, defaultValue: 1, description: '1=Methane, 2=Ethane, 3=Propane, 4=Butane.' },
    ],
    prediction: {
      prompt: 'Why does soap fail to clean oily clothes effectively in hard water containing dissolved calcium and magnesium ions?',
      scenario: 'Soap is added to hard well water containing Ca²⁺ and Mg²⁺ salts.',
      choices: [
        { id: 'p1', text: 'Soap reacts with Ca²⁺ and Mg²⁺ to form an insoluble curdy precipitate (scum), wasting soap before micelles can form.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Hard water makes soap acidic and destroys the fatty acid tails.', isCorrect: false, misconceptionExplanation: 'Soap remains alkaline; insoluble calcium stearate precipitate forms.' },
        { id: 'p3', text: 'Soap dissolves completely and creates excessive foaming.', isCorrect: false, misconceptionExplanation: 'In hard water, lather does not form until all Ca/Mg ions precipitate as scum.' },
      ],
      correctExplanation: 'Soluble sodium soap molecules react with divalent Ca²⁺ and Mg²⁺ ions in hard water: 2 C₁₇H₃₅COONa + Ca²⁺ → (C₁₇H₃₅COO)₂Ca↓ (insoluble white scum) + 2Na⁺. Synthetic detergents solve this because their sulfonate groups do not form insoluble precipitates with calcium.',
      relevantFormula: '2\\text{RCOO}^- + \\text{Ca}^{2+} \\to (\\text{RCOO})_2\\text{Ca} \\downarrow \\; (\\text{Scum})',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Soap & Hand Sanitizer Virus Inactivation', description: 'Hydrophobic tails of soap micelles dissolve and dismantle the lipid bilayer envelope surrounding viruses like Coronaviruses and Influenza.' },
      { title: 'Diamond vs Graphite Allotropes', description: 'Rigid 3D tetrahedral network makes diamond the hardest natural material, while hexagonal layered sheets with delocalized electrons make graphite a slippery electrical conductor.' },
    ],
    simulationType: 'class10-chemistry',
  },
];
