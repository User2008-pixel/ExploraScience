import { ConceptItem } from '../types/science';

export const NCERT_CLASS11_BIOLOGY_CONCEPTS: ConceptItem[] = [
  // --- CELL BIOLOGY: FLUID MOSAIC MODEL ---
  {
    id: 'ncert11-bio-fluid-mosaic-membrane-transport',
    title: 'Cell Biology: Singer-Nicolson Fluid Mosaic Model & Membrane Transport',
    subject: 'biology',
    gradeLevel: 'Class 11',
    tagline: 'Phospholipid bilayer, integral/peripheral proteins, cholesterol fluidity, and active transport',
    description:
      'Proposed by Singer and Nicolson in 1972, the Fluid Mosaic Model describes the plasma membrane as a quasi-fluid matrix: (1) Phospholipid Bilayer: Amphipathic phospholipids with hydrophilic polar phosphate heads facing outward toward aqueous cytoplasm/interstitial fluid and hydrophobic non-polar fatty acid tails sequestered inward, forming an impermeable hydrophobic barrier to ions and large polar molecules; (2) Membrane Fluidity: Lateral diffusion of lipids and proteins enables endocytosis, cell division, and intracellular junctions; (3) Proteins: Integral (transmembrane) carrier proteins, ion channels, aquaporins, and peripheral glycoproteins functioning as receptors and cell-surface antigens; (4) Transport Mechanisms: Passive diffusion (down concentration gradient without ATP), Osmosis, Facilitated diffusion via permeases, and Active Transport (against electrochemical gradient powered by ATP hydrolysis, e.g. Na⁺/K⁺-ATPase pump exporting 3 Na⁺ and importing 2 K⁺).',
    formulaLaTeX: '\\text{Na}^+/\\text{K}^+\\text{-ATPase: } 3\\text{Na}^+_{\\text{in}} + 2\\text{K}^+_{\\text{out}} + \\text{ATP} \\to 3\\text{Na}^+_{\\text{out}} + 2\\text{K}^+_{\\text{in}} + \\text{ADP} + \\text{P}_i',
    formulaExplanation:
      'Membrane fluidity depends on temperature, unsaturated fatty acid cis-double bond kinks, and cholesterol buffering.',
    variables: [
      { id: 'membraneFluidityTemp', name: 'Temperature (T)', symbol: 'T', unit: '°C', min: 10, max: 45, step: 5, defaultValue: 37, description: 'Physiological temperature influencing bilayer viscosity.' },
    ],
    prediction: {
      prompt: 'Why are small non-polar molecules like O₂ and CO₂ able to diffuse rapidly across the plasma membrane, whereas small polar ions like Na⁺ and K⁺ cannot cross without transport proteins?',
      scenario: 'Comparing the permeability of cell membrane lipid bilayer to hydrophobic vs ionic species.',
      choices: [
        { id: 'p1', text: 'The hydrophobic core of non-polar fatty acid tails strongly repels charged hydrated ions, while dissolving non-polar O₂/CO₂.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Na⁺ and K⁺ ions are physically much larger than O₂ molecules.', isCorrect: false, misconceptionExplanation: 'Na+ has a smaller ionic radius than an O2 molecule; its charge and hydration shell prevent permeability.' },
        { id: 'p3', text: 'Oxygen molecules carry a positive electrical charge.', isCorrect: false, misconceptionExplanation: 'O2 is a neutral non-polar diatomic molecule.' },
      ],
      correctExplanation: 'The interior of the phospholipid bilayer is composed of non-polar hydrocarbon fatty acid tails. Non-polar gases (O₂, CO₂, N₂) dissolve directly in this hydrophobic lipid core and diffuse freely. Ions like Na⁺ and K⁺ are surrounded by water hydration shells and cannot enter the low-dielectric hydrocarbon core without specific transmembrane ion channel proteins.',
      relevantFormula: '\\Delta G_{\\text{hydration}} \\gg 0 \\implies \\text{Insoluble in non-polar lipid core}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Liposomal Targeted Drug Delivery Systems', description: 'Synthetic phospholipid nanovesicles encapsulate hydrophilic chemotherapy drugs, fusing with cancer cell membranes to deliver medications selectively.' },
      { title: 'Digitalis (Digoxin) Heart Failure Therapy', description: 'Inhibits myocardial Na⁺/K⁺-ATPase pumps, increasing intracellular calcium to strengthen cardiac contraction force.' },
    ],
    simulationType: 'class11-biology',
  },

  // --- CELL DIVISION: MITOSIS CYCLE ---
  {
    id: 'ncert11-bio-mitosis-cell-division-cycle',
    title: 'Cell Cycle & Mitosis: Chromosome Segregation & Cytokinesis',
    subject: 'biology',
    gradeLevel: 'Class 11',
    tagline: 'Interphase (G₁, S, G₂), Prophase, Metaphase plate, Anaphase sister chromatid disjunction, Telophase',
    description:
      'The eukaryotic cell cycle coordinates exact duplication and equitable distribution of genetic material: (1) Interphase (95% of cycle): G₁ phase (metabolic growth and organelle duplication), S phase (DNA replication doubles chromosome DNA content from 2C to 4C, while chromosome number remains 2n), and G₂ phase (tubulin protein synthesis for spindle apparatus); (2) M Phase (Mitosis): Prophase (chromatin condenses into visible chromosomes with centromeres, nuclear envelope breaks down), Metaphase (chromosomes align along the equatorial Metaphase Plate, spindle fibers attach to kinetochores), Anaphase (centromeres split, sister chromatids migrate to opposite poles as daughter chromosomes), and Telophase (chromosomes decondense at poles, nuclear envelopes reassemble); (3) Cytokinesis: In animal cells, a contractile microfilament cleavage furrow pinches the cell into two; in plant cells, a rigid Cell Plate formed by Golgi phragmoplasts constructs a new middle lamella.',
    formulaLaTeX: '2n \\; (4\\text{C}) \\xrightarrow{\\text{Mitosis}} 2n \\; (2\\text{C}) \\; + \\; 2n \\; (2\\text{C}) \\quad (\\text{Equational Division})',
    formulaExplanation:
      'Mitosis maintains genetic stability by producing two genetically identical daughter cells with equal chromosome count (2n = 46 in humans).',
    variables: [
      { id: 'mitoticStageIndex', name: 'Mitotic Stage', symbol: 'M', unit: 'stage', min: 1, max: 4, step: 1, defaultValue: 2, description: '1=Prophase, 2=Metaphase, 3=Anaphase, 4=Telophase.' },
    ],
    prediction: {
      prompt: 'If a human somatic cell with 46 chromosomes (2n = 46) completes DNA replication in the S phase, how many chromosomes and chromatids are present during Metaphase?',
      scenario: 'Counting chromosomes vs chromatids at the metaphase plate.',
      choices: [
        { id: 'p1', text: '46 chromosomes, each consisting of 2 sister chromatids (total 92 chromatids).', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: '92 separate chromosomes.', isCorrect: false, misconceptionExplanation: 'Sister chromatids remain joined at a single centromere and count as one chromosome until anaphase.' },
        { id: 'p3', text: '23 chromosome pairs without chromatids.', isCorrect: false, misconceptionExplanation: 'S phase duplicates each chromosome into two sister chromatids.' },
      ],
      correctExplanation: 'During S phase, DNA content doubles (2C → 4C), but each replicated chromosome remains joined at its central centromere. Thus at metaphase, there are exactly 46 chromosomes, each composed of two sister chromatids held together at the centromere, totaling 92 chromatids.',
      relevantFormula: '46 \\text{ Chromosomes} \\times 2 \\text{ Chromatids} = 92 \\text{ Chromatids}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Chemotherapy Microtubule Spindle Poisons (Taxol & Vincristine)', description: 'Anti-cancer drugs freeze cancer cells in metaphase by disrupting spindle microtubules, halting uncontrolled mitotic proliferation.' },
      { title: 'Onion Root Tip Cytogenetics Labs', description: 'Aceto-carmine squash preparations of allium root meristems display chromosome metaphase spreads for karyotype analysis.' },
    ],
    simulationType: 'class11-biology',
  },

  // --- ENZYME KINETICS & CATALYSIS ---
  {
    id: 'ncert11-bio-enzyme-kinetics-michaelis-menten',
    title: 'Biomolecules: Enzyme Kinetics, Active Site & Inhibition',
    subject: 'biology',
    gradeLevel: 'Class 11',
    tagline: 'Lock-and-key induced fit, lowering activation energy, v = (V_max [S]) / (K_m + [S]), and competitive inhibitors',
    description:
      'Enzymes are biocatalysts composed of globular proteins that accelerate biological reactions by millions of times without being consumed: (1) Active Site: A specialized 3D cleft where substrate molecules bind via Induced-Fit conformational adaptation; (2) Energetics: Enzymes lower the activation energy (E_a) barrier by stabilizing the transition state complex, without altering overall free energy change ΔG or equilibrium constant K_eq; (3) Michaelis-Menten Kinetics: Reaction velocity v increases with substrate concentration [S] until all enzyme active sites are saturated at maximum velocity V_max: v = (V_max [S]) / (K_m + [S]), where K_m (Michaelis constant) is the substrate concentration at half-maximum velocity (V_max / 2), measuring enzyme-substrate binding affinity (smaller K_m = higher affinity); (4) Enzyme Inhibition: Competitive inhibitors (e.g. malonate competing with succinate for succinate dehydrogenase) bind active site reversibly, increasing K_m without changing V_max.',
    formulaLaTeX: 'v = \\frac{V_{\\max} [S]}{K_m + [S]} \\quad | \\quad \\text{When } [S] = K_m \\implies v = \\frac{V_{\\max}}{2}',
    formulaExplanation:
      'Competitive inhibitors increase apparent K_m because higher substrate concentration is required to displace the inhibitor; V_max remains reachable.',
    variables: [
      { id: 'substrateConcentrationMm', name: 'Substrate Conc [S]', symbol: '[S]', unit: 'mM', min: 1, max: 50, step: 5, defaultValue: 15, description: 'Concentration of substrate.' },
      { id: 'enzymeInhibitorPresent', name: 'Inhibitor Mode', symbol: 'I', unit: 'type', min: 0, max: 1, step: 1, defaultValue: 0, description: '0=Normal Kinetics, 1=Competitive Inhibitor Present.' },
    ],
    prediction: {
      prompt: 'How does a competitive inhibitor like malonate affect the kinetic parameters V_max and K_m of the enzyme succinate dehydrogenase?',
      scenario: 'Adding a structural analog of succinate that competes for the active site.',
      choices: [
        { id: 'p1', text: 'K_m increases (apparent affinity decreases), while V_max remains unchanged at high substrate concentrations.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Both V_max and K_m decrease.', isCorrect: false, misconceptionExplanation: 'Uncompetitive inhibitors reduce both; competitive inhibitors leave V_max intact.' },
        { id: 'p3', text: 'V_max decreases while K_m remains constant.', isCorrect: false, misconceptionExplanation: 'Non-competitive allosteric inhibitors lower V_max; competitive inhibitors do not.' },
      ],
      correctExplanation: 'Because the competitive inhibitor binds reversibly to the catalytic active site in place of substrate, it can be completely outcompeted by flooding the system with excess substrate [S]. Hence V_max remains reachable, but higher substrate concentration is needed to reach half-maximal velocity, shifting K_m upward.',
      relevantFormula: 'K_m^{\\text{apparent}} = K_m \\left(1 + \\frac{[I]}{K_i}\\right) > K_m, \\quad V_{\\max} = \\text{constant}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Statin Drugs for Cholesterol Reduction', description: 'Lipitor and simvastatin act as competitive inhibitors of HMG-CoA reductase, blocking hepatic cholesterol biosynthesis.' },
      { title: 'Sulfa Antibiotic Mechanism', description: 'Sulfanilamide competes with PABA for bacterial dihydropteroate synthase, halting bacterial folic acid synthesis without harming human cells.' },
    ],
    simulationType: 'class11-biology',
  },

  // --- PLANT PHYSIOLOGY: PHOTOSYNTHESIS Z-SCHEME ---
  {
    id: 'ncert11-bio-photosynthesis-light-reactions-z-scheme',
    title: 'Plant Physiology: Photophosphorylation Z-Scheme & Calvin Cycle',
    subject: 'biology',
    gradeLevel: 'Class 11',
    tagline: 'PS II (P680), photolysis of water, cytochrome b₆f, PS I (P700), ATP synthase chemiosmosis, and RuBisCO',
    description:
      'Photosynthesis in chloroplasts comprises light-dependent and light-independent stages: (1) Light Reactions in Thylakoid Membranes: Non-cyclic photophosphorylation proceeds through the Z-Scheme. Light strikes Photosystem II (P680 reaction center), exciting electrons transferred to primary acceptor pheophytin. The electron deficiency in PS II is replenished by Photolysis of Water: 2H₂O → 4H⁺ + 4e⁻ + O₂↑ in the oxygen-evolving complex. Electrons travel down an Electron Transport Chain (plastoquinone → cytochrome b₆f complex → plastocyanin) pumping protons into the thylakoid lumen; (2) Photosystem I (P700): Light re-excites electrons, passing through ferredoxin to NADP⁺ Reductase to produce NADPH; (3) Chemiosmotic ATP Synthesis: Proton gradient across thylakoid membrane drives F₀-F₁ ATP Synthase rotary catalysis, yielding ATP; (4) Calvin Cycle in Stroma: RuBisCO enzyme fixes atmospheric CO₂ onto RuBP (5C) → 3-PGA → G3P sugar → RuBP regeneration using ATP and NADPH.',
    formulaLaTeX: '2\\text{H}_2\\text{O} + 2\\text{NADP}^+ + 3\\text{ADP} + 3\\text{P}_i \\xrightarrow{h\\nu} \\text{O}_2 + 2\\text{NADPH} + 2\\text{H}^+ + 3\\text{ATP}',
    formulaExplanation:
      'Non-cyclic photophosphorylation produces both ATP and NADPH; cyclic photophosphorylation around PS I produces only ATP to satisfy metabolic stoichiometry.',
    variables: [
      { id: 'photonWavelengthNm', name: 'Light Wavelength (λ)', symbol: '\\lambda', unit: 'nm', min: 400, max: 700, step: 20, defaultValue: 680, description: 'Chlorophyll absorption wavelength.' },
    ],
    prediction: {
      prompt: 'During the light reactions of photosynthesis, where does the molecular oxygen (O₂) released into the atmosphere originate?',
      scenario: 'Tracking isotopic oxygen tracing in photosynthetic water splitting vs carbon dioxide fixation.',
      choices: [
        { id: 'p1', text: 'From the photolysis splitting of water (H₂O) molecules at the oxygen-evolving complex of Photosystem II.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'From the oxygen atoms of carbon dioxide (CO₂).', isCorrect: false, misconceptionExplanation: 'Cornelis van Niel and isotopic ¹⁸O experiments proved CO2 oxygen is incorporated into glucose.' },
        { id: 'p3', text: 'From the breakdown of glucose during glycolysis.', isCorrect: false, misconceptionExplanation: 'Glycolysis is a respiratory catabolic process, not the photosynthetic light reaction.' },
      ],
      correctExplanation: 'Ruben and Kamen used heavy oxygen isotope H₂¹⁸O to prove that all released O₂ gas originates from water molecules split by the water-oxidizing manganese cluster of Photosystem II (2 H₂O → 4 H⁺ + 4 e⁻ + O₂↑). The oxygen in CO₂ is incorporated into carbohydrate sugar molecules during the Calvin cycle.',
      relevantFormula: '2 \\text{H}_2{}^{18}\\text{O} + \\text{CO}_2 \\xrightarrow{h\\nu} (\\text{CH}_2\\text{O}) + \\text{H}_2\\text{O} + {}^{18}\\text{O}_2 \\uparrow',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Artificial Photosynthesis & Green Hydrogen', description: 'Photochemical water-splitting catalysts mimic PS II to generate clean hydrogen gas fuel using sunlight and water.' },
      { title: 'Global Carbon Sequestration & Reforestation', description: 'RuBisCO in terrestrial rainforests and oceanic phytoplankton sequesters over 100 billion tonnes of atmospheric carbon annually.' },
    ],
    simulationType: 'class11-biology',
  },
];
