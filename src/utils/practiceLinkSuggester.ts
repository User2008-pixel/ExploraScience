import { ConceptItem } from '../types/science';

export interface PracticeLinkSuggestion {
  id: string;
  type: 'detective' | 'practical';
  targetId: string;
  title: string;
  categoryBadge: string;
  subject: 'physics' | 'chemistry' | 'biology';
  gradeLevel: string;
  whyPractice: string;
  keySkill: string;
  actionText: string;
}

export function getPracticeLinksForConcept(concept: ConceptItem): PracticeLinkSuggestion[] {
  const cText = `${concept.id} ${concept.title} ${concept.tagline} ${concept.description} ${concept.subject}`.toLowerCase();

  // 1. OPTICS & LIGHT (Reflection, Refraction, Mirrors, Lenses, Prisms, Eyes)
  if (
    cText.includes('optic') ||
    cText.includes('lens') ||
    cText.includes('mirror') ||
    cText.includes('refract') ||
    cText.includes('reflect') ||
    cText.includes('prism') ||
    cText.includes('light') ||
    cText.includes('dispersion') ||
    cText.includes('eye') ||
    cText.includes('telescope') ||
    cText.includes('microscope')
  ) {
    return [
      {
        id: 'optics-prac-1',
        type: 'practical',
        targetId: 'exp-convex-lens',
        title: 'Optical Bench: Convex Lens Focal Length (u-v Method)',
        categoryBadge: 'Lab Practical • Class 12 Physics',
        subject: 'physics',
        gradeLevel: 'Class 12',
        whyPractice:
          'Directly apply thin lens formulas (1/f = 1/v - 1/u) to real-world optical pin alignment and parallax removal.',
        keySkill: 'Focal length determination & 1/u vs 1/v graph plotting',
        actionText: 'Open Lab Practical',
      },
      {
        id: 'optics-prac-2',
        type: 'practical',
        targetId: 'exp-prism-deviation',
        title: 'Glass Prism: Angle of Minimum Deviation & Refractive Index',
        categoryBadge: 'Lab Practical • Class 12 Physics',
        subject: 'physics',
        gradeLevel: 'Class 12',
        whyPractice:
          'Measure i vs δ curves experimentally using optical pins to determine the exact refractive index μ of crown glass.',
        keySkill: 'Snell’s Law & minimum deviation angle (δm)',
        actionText: 'Open Lab Practical',
      },
      {
        id: 'optics-case-1',
        type: 'detective',
        targetId: 'case-two-spoons',
        title: 'The Mystery of the Two Spoons',
        categoryBadge: 'Forensic Case • +100-150 ⚛️',
        subject: 'physics',
        gradeLevel: 'Class 9/11',
        whyPractice:
          'Investigate how surface curvature and material reflection properties mislead human observers in forensic evidence.',
        keySkill: 'Empirical measurement vs sensory perception',
        actionText: 'Launch Investigation Case',
      },
    ];
  }

  // 2. ELECTRICITY & CIRCUITS (Current, Ohm's law, Resistance, Potentiometer, Motor, Magnetism, Diode)
  if (
    cText.includes('ohm') ||
    cText.includes('circuit') ||
    cText.includes('resist') ||
    cText.includes('current') ||
    cText.includes('voltage') ||
    cText.includes('potentiometer') ||
    cText.includes('magnetic') ||
    cText.includes('induction') ||
    cText.includes('semiconductor') ||
    cText.includes('diode') ||
    cText.includes('capacit')
  ) {
    return [
      {
        id: 'elec-case-1',
        type: 'detective',
        targetId: 'case-circuit-mystery',
        title: 'The Circuit Mystery: The Dim Bulb',
        categoryBadge: 'Forensic Case • +100-150 ⚛️',
        subject: 'physics',
        gradeLevel: 'Class 10/12',
        whyPractice:
          'Use Ohm’s Law and Kirchhoff’s rules to deduce whether a malfunctioning lab circuit suffers from voltage drop or hidden internal resistance.',
        keySkill: 'Circuit fault diagnosis & multimeter analysis',
        actionText: 'Launch Investigation Case',
      },
      {
        id: 'elec-prac-1',
        type: 'practical',
        targetId: 'exp-meter-bridge',
        title: 'Meter Bridge (Wheatstone): Resistance & Resistivity',
        categoryBadge: 'Lab Practical • Class 12 Physics',
        subject: 'physics',
        gradeLevel: 'Class 12',
        whyPractice:
          'Utilize null deflection on a 1-meter resistance wire to calculate unknown wire resistance and specific resistivity ρ.',
        keySkill: 'Wheatstone bridge balance ratio: P/Q = R/S',
        actionText: 'Open Lab Practical',
      },
      {
        id: 'elec-prac-2',
        type: 'practical',
        targetId: 'exp-potentiometer-internal-resistance',
        title: 'Potentiometer: Internal Resistance of a Primary Cell',
        categoryBadge: 'Lab Practical • Class 12 Physics',
        subject: 'physics',
        gradeLevel: 'Class 12',
        whyPractice:
          'Measure balancing lengths l₁ and l₂ without drawing current to determine cell internal resistance r = R(l₁/l₂ - 1).',
        keySkill: 'Zero current drawing null-point voltage measurement',
        actionText: 'Open Lab Practical',
      },
    ];
  }

  // 3. MECHANICS, MOTION & KINEMATICS (Projectile, Newton, Force, Friction, Gravitation, Work, Energy, Pendulum)
  if (
    cText.includes('projectile') ||
    cText.includes('newton') ||
    cText.includes('motion') ||
    cText.includes('friction') ||
    cText.includes('gravity') ||
    cText.includes('gravitat') ||
    cText.includes('kinetic') ||
    cText.includes('momentum') ||
    cText.includes('work') ||
    cText.includes('energy') ||
    cText.includes('pendulum') ||
    cText.includes('caliper') ||
    cText.includes('screw')
  ) {
    return [
      {
        id: 'mech-case-1',
        type: 'detective',
        targetId: 'case-car-stopping',
        title: 'Why Did the Car Stop?',
        categoryBadge: 'Forensic Case • +100-150 ⚛️',
        subject: 'physics',
        gradeLevel: 'Class 11 Physics',
        whyPractice:
          'Analyze vehicle skid marks, kinetic friction coefficient, and deceleration to reconstruct an accident scene.',
        keySkill: 'Work-Energy theorem (W = ΔK) & friction calculations',
        actionText: 'Launch Investigation Case',
      },
      {
        id: 'mech-prac-1',
        type: 'practical',
        targetId: 'exp-simple-pendulum',
        title: 'Simple Pendulum: g Determination & L vs T² Graph',
        categoryBadge: 'Lab Practical • Class 11 Physics',
        subject: 'physics',
        gradeLevel: 'Class 11',
        whyPractice:
          'Record oscillatory periods T for various string lengths L to verify T = 2π√(L/g) and plot straight-line slope.',
        keySkill: 'Experimental error minimization & L-T² graph slope',
        actionText: 'Open Lab Practical',
      },
      {
        id: 'mech-prac-2',
        type: 'practical',
        targetId: 'exp-vernier-caliper',
        title: 'Vernier Calipers: Internal/External Dimensions & Volume',
        categoryBadge: 'Lab Practical • Class 11 Physics',
        subject: 'physics',
        gradeLevel: 'Class 11',
        whyPractice:
          'Master least count (0.01 cm) and zero-error corrections to accurately measure cylinder diameter and depth.',
        keySkill: 'Precision physical metrology and zero-error calibration',
        actionText: 'Open Lab Practical',
      },
    ];
  }

  // 4. CHEMICAL KINETICS, EQUILIBRIUM & REACTION RATES
  if (
    cText.includes('kinetic') ||
    cText.includes('rate') ||
    cText.includes('equilibrium') ||
    cText.includes('chatelier') ||
    cText.includes('catalyst') ||
    cText.includes('arrhenius') ||
    cText.includes('collision') ||
    cText.includes('activation')
  ) {
    return [
      {
        id: 'chem-case-1',
        type: 'detective',
        targetId: 'case-reaction-slowdown',
        title: 'Why Did the Reaction Slow Down?',
        categoryBadge: 'Forensic Case • +100-150 ⚛️',
        subject: 'chemistry',
        gradeLevel: 'Class 10/12',
        whyPractice:
          'Identify whether reactant exhaustion, temperature drop, or surface passivation caused an unexpected chemical stoppage.',
        keySkill: 'Collision theory & limiting reagent diagnostic',
        actionText: 'Launch Investigation Case',
      },
      {
        id: 'chem-prac-1',
        type: 'practical',
        targetId: 'exp-reaction-kinetics-thiosulfate',
        title: 'Reaction Kinetics: Sodium Thiosulfate & HCl (Cross Mark)',
        categoryBadge: 'Lab Practical • Class 12 Chemistry',
        subject: 'chemistry',
        gradeLevel: 'Class 12',
        whyPractice:
          'Observe colloidal sulfur precipitation timing to plot 1/t against concentration and temperature.',
        keySkill: 'Reaction order determination via optical cross disappearance',
        actionText: 'Open Lab Practical',
      },
      {
        id: 'chem-prac-2',
        type: 'practical',
        targetId: 'exp-titration-kmno4',
        title: 'Volumetric Redox Titration: KMnO₄ vs Oxalic Acid',
        categoryBadge: 'Lab Practical • Class 11/12 Chemistry',
        subject: 'chemistry',
        gradeLevel: 'Class 11/12',
        whyPractice:
          'Practice burette drop-wise addition and self-indicating permanganate endpoint detection.',
        keySkill: 'Redox stoichiometry: 2 KMnO₄ + 5 H₂C₂O₄',
        actionText: 'Open Lab Practical',
      },
    ];
  }

  // 5. ACIDS, BASES, METALS, SALTS, ELECTROCHEMISTRY & SOLUTIONS
  if (
    cText.includes('acid') ||
    cText.includes('base') ||
    cText.includes('ph') ||
    cText.includes('salt') ||
    cText.includes('titrat') ||
    cText.includes('metal') ||
    cText.includes('solution') ||
    cText.includes('colligative') ||
    cText.includes('electrochem') ||
    cText.includes('nernst') ||
    cText.includes('bonding')
  ) {
    return [
      {
        id: 'acid-prac-1',
        type: 'practical',
        targetId: 'exp-titration-kmno4',
        title: 'Volumetric Redox Titration: KMnO₄ vs Oxalic Acid',
        categoryBadge: 'Lab Practical • Class 11/12 Chemistry',
        subject: 'chemistry',
        gradeLevel: 'Class 11/12',
        whyPractice:
          'Determine the exact molarity and strength of an unknown oxidant solution using standard primary oxalic acid.',
        keySkill: 'Quantitative volumetric analysis & concordant burette readings',
        actionText: 'Open Lab Practical',
      },
      {
        id: 'acid-prac-2',
        type: 'practical',
        targetId: 'exp-salt-analysis',
        title: 'Qualitative Inorganic Salt Analysis: Cation & Anion Tests',
        categoryBadge: 'Lab Practical • Class 11/12 Chemistry',
        subject: 'chemistry',
        gradeLevel: 'Class 11/12',
        whyPractice:
          'Identify unknown basic and acidic radicals using flame tests, wet precipitation, and confirmatory gas evolution.',
        keySkill: 'Systematic qualitative chemical cation/anion elimination',
        actionText: 'Open Lab Practical',
      },
      {
        id: 'acid-case-1',
        type: 'detective',
        targetId: 'case-reaction-slowdown',
        title: 'Why Did the Reaction Slow Down?',
        categoryBadge: 'Forensic Case • +100-150 ⚛️',
        subject: 'chemistry',
        gradeLevel: 'Class 10/12',
        whyPractice:
          'Investigate how pH and acid concentration changes dramatically alter chemical reaction kinetics.',
        keySkill: 'Chemical forensic evidence diagnosis',
        actionText: 'Launch Investigation Case',
      },
    ];
  }

  // 6. PLANT PHYSIOLOGY, PHOTOSYNTHESIS, STOMATA & CHROMATOGRAPHY
  if (
    cText.includes('photo') ||
    cText.includes('plant') ||
    cText.includes('stomata') ||
    cText.includes('leaf') ||
    cText.includes('chloroplast') ||
    cText.includes('chromatograph') ||
    cText.includes('pigment')
  ) {
    return [
      {
        id: 'bio-case-1',
        type: 'detective',
        targetId: 'case-plant-limiting-factor',
        title: 'Why Did the Plant Stop Growing?',
        categoryBadge: 'Forensic Case • +100-150 ⚛️',
        subject: 'biology',
        gradeLevel: 'Class 10/11 Biology',
        whyPractice:
          'Apply Blackman’s Law of Limiting Factors to identify whether light, CO₂, or water deficiency is retarding photosynthesis.',
        keySkill: 'Botanical diagnostic & limiting factor identification',
        actionText: 'Launch Investigation Case',
      },
      {
        id: 'bio-prac-1',
        type: 'practical',
        targetId: 'exp-paper-chromatography',
        title: 'Paper Chromatography: Separation of Plant Pigments',
        categoryBadge: 'Lab Practical • Class 11 Biology',
        subject: 'biology',
        gradeLevel: 'Class 11',
        whyPractice:
          'Isolate chlorophyll a, chlorophyll b, xanthophyll, and carotene from spinach extract and calculate their exact Rf values.',
        keySkill: 'Chromatographic separation & retention factor (Rf)',
        actionText: 'Open Lab Practical',
      },
      {
        id: 'bio-prac-2',
        type: 'practical',
        targetId: 'exp-food-tests',
        title: 'Biochemical Testing: Carbohydrates, Proteins & Lipids',
        categoryBadge: 'Lab Practical • Class 11 Biology',
        subject: 'biology',
        gradeLevel: 'Class 11',
        whyPractice:
          'Detect the end-products of photosynthesis (starch and sugars) using iodine and Benedict’s quantitative tests.',
        keySkill: 'Macromolecular qualitative identification',
        actionText: 'Open Lab Practical',
      },
    ];
  }

  // 7. CELL BIOLOGY, MITOSIS, GENETICS & BIOCHEMISTRY
  if (
    cText.includes('cell') ||
    cText.includes('mitosis') ||
    cText.includes('division') ||
    cText.includes('chromosome') ||
    cText.includes('dna') ||
    cText.includes('enzyme') ||
    cText.includes('mendel') ||
    cText.includes('heredity') ||
    cText.includes('punnett') ||
    cText.includes('protein') ||
    cText.includes('biomolecule') ||
    cText.includes('food') ||
    cText.includes('nutrient') ||
    cText.includes('amylase')
  ) {
    return [
      {
        id: 'bio-case-2',
        type: 'detective',
        targetId: 'case-enzyme-inactivation',
        title: 'The Enzyme Mystery: Inactive Salivary Amylase',
        categoryBadge: 'Forensic Case • +100-150 ⚛️',
        subject: 'biology',
        gradeLevel: 'Class 10/11 Biology',
        whyPractice:
          'Determine how denaturation from extreme pH or boiling renders digestive enzymes incapable of hydrolyzing starch substrates.',
        keySkill: 'Enzyme active site conformation & pH denaturation',
        actionText: 'Launch Investigation Case',
      },
      {
        id: 'bio-prac-3',
        type: 'practical',
        targetId: 'exp-mitosis-root-tip',
        title: 'Cell Biology: Mitosis Stages in Onion Root Tip',
        categoryBadge: 'Lab Practical • Class 12 Biology',
        subject: 'biology',
        gradeLevel: 'Class 12',
        whyPractice:
          'Prepare and focus on acetocarmine-stained squash slides to identify prophase, metaphase, anaphase, and calculate the Mitotic Index.',
        keySkill: 'High-power cytological microscopy & mitotic index calculation',
        actionText: 'Open Lab Practical',
      },
      {
        id: 'bio-prac-4',
        type: 'practical',
        targetId: 'exp-food-tests',
        title: 'Biochemical Testing: Carbohydrates, Proteins & Lipids',
        categoryBadge: 'Lab Practical • Class 11 Biology',
        subject: 'biology',
        gradeLevel: 'Class 11',
        whyPractice:
          'Perform Biuret peptide bond tests, Iodine starch reactions, and Benedict’s cuprous reduction in a test-tube rack.',
        keySkill: 'Colorimetric biochemical assays',
        actionText: 'Open Lab Practical',
      },
    ];
  }

  // 8. DEFAULT / GENERAL FALLBACK
  return [
    {
      id: 'gen-case-1',
      type: 'detective',
      targetId: 'case-two-spoons',
      title: 'The Mystery of the Two Spoons',
      categoryBadge: 'Forensic Case • +100-150 ⚛️',
      subject: 'physics',
      gradeLevel: 'Class 9/11',
      whyPractice:
        'Connect scientific heat transfer theory to empirical sensor measurements in a forensic mystery.',
      keySkill: 'Scientific deduction and hypothesis testing',
      actionText: 'Launch Investigation Case',
    },
    {
      id: 'gen-prac-1',
      type: 'practical',
      targetId: 'exp-vernier-caliper',
      title: 'Vernier Calipers: Internal/External Dimensions & Volume',
      categoryBadge: 'Lab Practical • Class 11 Physics',
      subject: 'physics',
      gradeLevel: 'Class 11',
      whyPractice:
        'Master the fundamental laboratory measurement tool for measuring lengths, diameters, and internal depths.',
      keySkill: 'Precision physical metrology and zero error',
      actionText: 'Open Lab Practical',
    },
    {
      id: 'gen-prac-2',
      type: 'practical',
      targetId: 'exp-titration-kmno4',
      title: 'Volumetric Redox Titration: KMnO₄ vs Oxalic Acid',
      categoryBadge: 'Lab Practical • Class 11/12 Chemistry',
      subject: 'chemistry',
      gradeLevel: 'Class 11/12',
      whyPractice:
        'Develop core quantitative lab proficiency in volumetric analysis and titration technique.',
      keySkill: 'Volumetric solution handling & stoichiometry',
      actionText: 'Open Lab Practical',
    },
  ];
}
