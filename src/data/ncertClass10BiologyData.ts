import { ConceptItem } from '../types/science';

export const NCERT_CLASS10_BIOLOGY_CONCEPTS: ConceptItem[] = [
  // --- LIFE PROCESSES: NUTRITION & STOMATA ---
  {
    id: 'ncert10-bio-photosynthesis-stomata-regulation',
    title: 'Photosynthesis, Chloroplasts & Stomatal Guard Cell Regulation',
    subject: 'biology',
    gradeLevel: 'Class 10',
    tagline: '6CO₂ + 6H₂O + sunlight → C₆H₁₂O₆ + 6O₂; guard cell turgor swelling and transpiration',
    description:
      'Photosynthesis is the autotrophic process by which green plants synthesize carbohydrates (glucose) from carbon dioxide and water using solar photon energy absorbed by chlorophyll pigments: (1) Absorption of light energy by chlorophyll; (2) Conversion of light energy into chemical energy and photolysis of water into hydrogen and oxygen (2H₂O → 4H⁺ + 4e⁻ + O₂↑); (3) Reduction of carbon dioxide into carbohydrates. Stomata: Microscopic pores present on epidermis of leaves for gas exchange (CO₂ uptake and O₂ release) and transpiration. Each stomatal pore is flanked by two kidney-shaped Guard Cells: When water flows into guard cells, they become turgid, swelling outward due to thicker inner cell walls, opening the stoma; when guard cells lose water, they become flaccid and shrink, closing the stomatal pore to prevent excessive dehydration.',
    formulaLaTeX: '6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow[\\text{chlorophyll}]{\\text{sunlight}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\uparrow',
    formulaExplanation:
      'Turgor pressure regulated by potassium (K⁺) ion pumping governs the reversible opening and closing of the stomatal aperture.',
    variables: [
      { id: 'lightIntensityLux', name: 'Light Intensity (I)', symbol: 'I', unit: 'klux', min: 10, max: 100, step: 10, defaultValue: 50, description: 'Sunlight illumination level.' },
      { id: 'guardCellTurgidity', name: 'Guard Cell Turgor', symbol: 'T', unit: '%', min: 10, max: 100, step: 10, defaultValue: 80, description: 'Water fullness of stomatal guard cells.' },
    ],
    prediction: {
      prompt: 'What causes the stomatal pore on a plant leaf to open in response to morning sunlight?',
      scenario: 'Leaf illuminated by morning daylight triggers potassium (K⁺) uptake into guard cells.',
      choices: [
        { id: 'p1', text: 'Water flows into the guard cells by osmosis, causing them to swell into curved crescent shapes and open the pore.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Guard cells shrink and lose water to pull the pore open.', isCorrect: false, misconceptionExplanation: 'Shrinking (flaccidity) closes the stomatal pore.' },
        { id: 'p3', text: 'Stomata open through mechanical muscular contractions.', isCorrect: false, misconceptionExplanation: 'Plants do not have muscles; stomatal mechanics rely purely on hydrostatic turgor pressure.' },
      ],
      correctExplanation: 'Light triggers active uptake of potassium (K⁺) ions into guard cells, lowering their osmotic water potential. Water rushes in from surrounding epidermal cells by osmosis. The guard cells become turgid; because their inner cell walls facing the pore are thicker and less elastic than the thin outer walls, they bow outward, opening the stomatal aperture.',
      relevantFormula: '\\text{K}^+ \\text{ influx} \\implies \\text{Endosmosis} \\implies \\text{Turgid guard cells} \\implies \\text{Stoma opens}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'CAM Photosynthesis in Desert Cacti', description: 'Desert succulents keep stomata closed during blistering daytime heat to conserve water, opening them only at night to take up CO₂ and store it as malic acid.' },
      { title: 'Crop Drought-Stress Sensing', description: 'Thermal infrared satellite cameras detect leaf temperature spikes caused by stomatal closure during agricultural drought.' },
    ],
    simulationType: 'class10-biology',
  },

  // --- LIFE PROCESSES: DOUBLE CIRCULATION & HEART ---
  {
    id: 'ncert10-bio-human-double-circulation-heart',
    title: 'Human Circulatory System & Double Circulation Dynamics',
    subject: 'biology',
    gradeLevel: 'Class 10',
    tagline: '4-chambered heart (RA, RV, LA, LV), pulmonary & systemic circuits, tricuspid/bicuspid valves',
    description:
      'Human circulation is a Double Circulation system where blood passes through the heart twice during each complete circuit of the body: (1) Pulmonary Circulation: Deoxygenated blood from body tissues enters Right Atrium via superior and inferior vena cava → passes through tricuspid valve into Right Ventricle → pumped via pulmonary artery to Lungs for oxygenation and CO₂ expulsion; (2) Systemic Circulation: Oxygenated blood returns from lungs via pulmonary veins into Left Atrium → passes through bicuspid (mitral) valve into thick muscular Left Ventricle → pumped under high hydrostatic pressure (~120 mmHg) through Aorta to all peripheral tissues; (3) Valves: Atrioventricular (AV) and semilunar valves prevent backflow; (4) Septum: Complete muscular partition completely isolates oxygenated and deoxygenated blood, ensuring high energy efficiency for warm-blooded endothermy.',
    formulaLaTeX: '\\text{Stroke Volume } (70\\text{ mL}) \\times \\text{Heart Rate } (72\\text{ bpm}) = \\text{Cardiac Output } (\\approx 5.0\\text{ L/min})',
    formulaExplanation:
      'Separation of left and right heart chambers prevents mixing of oxygen-rich and oxygen-poor blood, maximizing oxygen delivery to tissues.',
    variables: [
      { id: 'heartRateBpm', name: 'Heart Rate (HR)', symbol: 'HR', unit: 'bpm', min: 50, max: 150, step: 5, defaultValue: 72, description: 'Cardiac contractions per minute.' },
    ],
    prediction: {
      prompt: 'Why is the muscular wall of the left ventricle significantly thicker than that of the right ventricle in the human heart?',
      scenario: 'Comparing the myocardium thickness of the four heart chambers.',
      choices: [
        { id: 'p1', text: 'Left ventricle must generate much higher pressure to pump blood throughout the entire body (systemic circuit), whereas right ventricle pumps only to nearby lungs.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Left ventricle contains deoxygenated blood which is heavier.', isCorrect: false, misconceptionExplanation: 'Left ventricle contains oxygenated blood; densities are identical.' },
        { id: 'p3', text: 'Right ventricle pumps blood at higher pressure to protect delicate alveoli.', isCorrect: false, misconceptionExplanation: 'Pulmonary circuit is a low-pressure system (~25/10 mmHg) to avoid pulmonary edema.' },
      ],
      correctExplanation: 'The right ventricle pumps blood through the short, low-resistance pulmonary circuit to the lungs (pulmonary artery pressure ~25/10 mmHg). The left ventricle must overcome high systemic vascular resistance to pump blood through the aorta to all organs from head to toes (~120/80 mmHg), requiring a myocardium wall three times thicker.',
      relevantFormula: 'P_{\\text{systemic}} (120\\text{ mmHg}) \\gg P_{\\text{pulmonary}} (25\\text{ mmHg})',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Hypertension & Sphygmomanometer Blood Pressure Readings', description: 'Measuring standard brachial artery systolic (~120 mmHg) and diastolic (~80 mmHg) pressures screens for cardiovascular risks.' },
      { title: 'Artificial Heart Valve Replacements', description: 'Mechanical pyrolytic carbon or bovine pericardial prosthetic valves restore unidirectional blood flow for patients with damaged aortic valves.' },
    ],
    simulationType: 'class10-biology',
  },

  // --- LIFE PROCESSES: NEPHRON EXCRETION ---
  {
    id: 'ncert10-bio-human-excretion-nephron-filtration',
    title: 'Excretory System: Nephron Ultrafiltration & Selective Reabsorption',
    subject: 'biology',
    gradeLevel: 'Class 10',
    tagline: 'Glomerular ultrafiltration, Bowman’s capsule, Loop of Henle, selective reabsorption, and urine',
    description:
      'The functional structural unit of the kidney is the Nephron (~1 million per kidney). Urine formation proceeds through three sequential stages: (1) Glomerular Ultrafiltration: High hydrostatic pressure in the afferent arteriole forces liquid and small solutes from the glomerulus capillary knot across the podocyte filtration slits into Bowman’s Capsule, forming ~180 Liters of primary filtrate daily (water, urea, uric acid, glucose, amino acids, salts; blood cells and large proteins are retained); (2) Selective Tubular Reabsorption: As filtrate moves along the Proximal Convoluted Tubule (PCT), Loop of Henle, and Distal Convoluted Tubule (DCT), essential substances (100% of glucose and amino acids, 80% of salts and water) are actively and passively reabsorbed back into peritubular capillaries; (3) Tubular Secretion: Excess K⁺ and H⁺ ions are secreted into the Collecting Duct, yielding ~1.5 Liters of concentrated hypertonic Urine daily.',
    formulaLaTeX: '\\text{Daily Glomerular Filtrate: } 180\\text{ L} \\implies \\text{Reabsorbed: } 99\\% \\implies \\text{Excreted Urine: } 1.5\\text{ L}',
    formulaExplanation:
      'Over 99% of the primary filtrate is reclaimed back into systemic circulation by selective tubular reabsorption.',
    variables: [
      { id: 'waterHydrationLevel', name: 'Body Hydration', symbol: 'H', unit: '%', min: 40, max: 100, step: 10, defaultValue: 75, description: 'Hydration state governing ADH hormone release.' },
    ],
    prediction: {
      prompt: 'If primary glomerular filtrate produced by human kidneys is ~180 Liters per day, why is daily urine excretion only ~1.5 Liters?',
      scenario: 'Tracing the volume reduction of primary renal filtrate along the nephron.',
      choices: [
        { id: 'p1', text: 'More than 99% of the filtrate water and essential solutes are selectively reabsorbed by the nephron tubules back into blood capillaries.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'The remaining 178.5 Liters evaporates through lung respiration.', isCorrect: false, misconceptionExplanation: 'Respiratory water loss is only ~400 mL/day.' },
        { id: 'p3', text: 'Kidneys hold the extra fluid in the bladder for several weeks.', isCorrect: false, misconceptionExplanation: 'The urinary bladder has a maximum capacity of only ~500–700 mL.' },
      ],
      correctExplanation: 'As the 180 L of primary filtrate flows through the proximal tubule, Loop of Henle, and collecting duct, specialized transport proteins and osmotic gradients reabsorb ~178.5 Liters of water, together with all essential glucose, amino acids, and vital electrolytes, leaving only waste urea, uric acid, and excess salts in 1.5 L of urine.',
      relevantFormula: 'V_{\\text{urine}} = V_{\\text{filtrate}} - V_{\\text{reabsorbed}} = 180\\text{ L} - 178.5\\text{ L} = 1.5\\text{ L}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Hemodialysis Artificial Kidney Machines', description: 'Patients with renal failure pump blood through cellophane dialyzer tubes bathed in isotonic dialyzing fluid to remove toxic urea by diffusion.' },
      { title: 'Antidiuretic Hormone (ADH / Vasopressin) Action', description: 'During dehydration, the pituitary gland secretes ADH, inserting aquaporin water channels into collecting ducts to conserve water, producing dark concentrated urine.' },
    ],
    simulationType: 'class10-biology',
  },

  // --- CONTROL & COORDINATION: NEURON & REFLEX ARC ---
  {
    id: 'ncert10-bio-neuron-synapse-reflex-arc',
    title: 'Control & Coordination: Neuron Structure, Synapse & Reflex Arc',
    subject: 'biology',
    gradeLevel: 'Class 10',
    tagline: 'Cyton soma, dendrites, axon, neurotransmitter synapse, and involuntary spinal reflex arc',
    description:
      'The nervous system coordinates rapid responses through electrical impulses along specialized Neurons: (1) Neuron Structure: Dendrites receive incoming stimuli → Cell Body (Cyton) integrates signals → Axon propagates electrical action potential impulse insulated by myelin sheath → Axon Terminals; (2) Chemical Synapse: Microscopic gap between terminal of one neuron and dendrite of the next. Electrical impulse triggers release of chemical Neurotransmitters (e.g. acetylcholine) from synaptic vesicles, which diffuse across the synaptic cleft and bind receptors on the post-synaptic dendrite, generating a new electrical impulse; (3) Reflex Arc: Rapid, automatic, involuntary response to a dangerous stimulus routed through the spinal cord without conscious brain deliberation: Receptor (pain/heat sensor in skin) → Sensory Neuron (afferent) → Relay Interneuron in spinal cord → Motor Neuron (efferent) → Effector (muscle contracting to pull hand away from hot pan in milliseconds).',
    formulaLaTeX: '\\text{Stimulus} \\to \\text{Receptor} \\xrightarrow{\\text{Sensory}} \\text{Spinal Cord (Relay)} \\xrightarrow{\\text{Motor}} \\text{Effector (Muscle)} \\to \\text{Response}',
    formulaExplanation:
      'Reflex arcs evolved because conscious cortical processing in the brain is too slow to prevent severe tissue burn or mechanical injury.',
    variables: [
      { id: 'nerveConductionVelocity', name: 'Myelination Velocity', symbol: 'v', unit: 'm/s', min: 10, max: 120, step: 10, defaultValue: 80, description: 'Speed of saltatory action potential conduction.' },
    ],
    prediction: {
      prompt: 'When you accidentally touch a red-hot iron pan, your hand pulls back instantly before you consciously feel pain. Why?',
      scenario: 'Analyzing the neural pathway of the withdrawal reflex.',
      choices: [
        { id: 'p1', text: 'The reflex arc is processed immediately at the spinal cord level, triggering motor withdrawal before sensory signals reach the cerebral cortex for pain perception.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Muscles have their own heat sensors that contract without any nerves.', isCorrect: false, misconceptionExplanation: 'Muscles cannot contract without nerve impulses from motor neurons.' },
        { id: 'p3', text: 'The electrical signal bypasses the spinal cord completely.', isCorrect: false, misconceptionExplanation: 'The sensory neuron synapses directly with interneurons inside the grey matter of the spinal cord.' },
      ],
      correctExplanation: 'The reflex arc pathway forms a short loop through the spinal cord: heat receptor → sensory neuron → spinal relay neuron → motor neuron → biceps muscle contraction. While the impulse also travels up the spinal cord to the brain, the motor withdrawal command executes first at the spinal level to minimize burn damage.',
      relevantFormula: 't_{\\text{reflex}} \\approx 30\\text{ ms} \\ll t_{\\text{conscious perception}} \\approx 250\\text{ ms}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Patellar Knee-Jerk Neurological Exam', description: 'Physicians tap the patellar tendon to test integrity of the L2–L4 spinal segments and sensory/motor nerve pathways.' },
      { title: 'General Anesthetic Synaptic Blockers', description: 'Clinical anesthetics block voltage-gated sodium channels and GABA receptor synapses, temporarily halting conscious nerve transmission.' },
    ],
    simulationType: 'class10-biology',
  },

  // --- HEREDITY & MENDELIAN GENETICS ---
  {
    id: 'ncert10-bio-mendelian-genetics-punnett-square',
    title: 'Heredity: Mendel’s Laws of Inheritance & Punnett Square Ratios',
    subject: 'biology',
    gradeLevel: 'Class 10',
    tagline: 'Monohybrid 3:1 phenotypic (1:2:1 genotypic), Dihybrid 9:3:3:1, and XY sex determination',
    description:
      'Gregor Johann Mendel discovered the fundamental laws of inheritance using garden pea plants (Pisum sativum): (1) Law of Segregation (Monohybrid Cross): When pure-breeding tall (TT) and dwarf (tt) peas cross, the F₁ generation is 100% tall (heterozygous Tt, showing the Dominant trait). When F₁ self-pollinates (Tt × Tt), the F₂ generation produces a Phenotypic Ratio of 3 Tall : 1 Dwarf and a Genotypic Ratio of 1 TT : 2 Tt : 1 tt; (2) Law of Independent Assortment (Dihybrid Cross): When two pairs of contrasting characters are crossed (Round Yellow RRYY × Wrinkled Green rryy), alleles for round/wrinkled sort independently from yellow/green, yielding an F₂ phenotypic ratio of 9 Round Yellow : 3 Round Green : 3 Wrinkled Yellow : 1 Wrinkled Green; (3) Sex Determination in Humans: Females possess XX chromosomes (produce only X ova); males possess XY chromosomes (produce 50% X sperm and 50% Y sperm). Fertilization by Y sperm results in male (XY); fertilization by X sperm results in female (XX). The male sperm determines child sex with strictly 50:50 statistical probability.',
    formulaLaTeX: '\\text{Monohybrid F}_2 = 3:1 \\quad | \\quad \\text{Dihybrid F}_2 = 9:3:3:1 \\quad | \\quad \\text{Sex: } \\text{XX} (\\text{F}) \\; : \\; \\text{XY} (\\text{M}) = 1:1',
    formulaExplanation:
      'Alleles segregate during gamete meiosis so each gamete carries only one allele of each gene pair.',
    variables: [
      { id: 'f1SampleCount', name: 'Offspring Sample (N)', symbol: 'N', unit: 'plants', min: 100, max: 1000, step: 100, defaultValue: 400, description: 'Number of F2 progeny simulated.' },
    ],
    prediction: {
      prompt: 'In humans, what biological factor strictly determines whether a fertilized zygote develops into a male or female child?',
      scenario: 'Human gamete fertilization between maternal egg (22+X) and paternal sperm.',
      choices: [
        { id: 'p1', text: 'The father’s fertilizing sperm carrying either an X chromosome (female XX) or a Y chromosome (male XY).', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'The mother’s egg chromosome type.', isCorrect: false, misconceptionExplanation: 'Maternal eggs are homogametic; all human ova carry only an X chromosome.' },
        { id: 'p3', text: 'Environmental womb temperature during the first trimester.', isCorrect: false, misconceptionExplanation: 'Temperature-dependent sex determination occurs in reptiles (turtles/crocodiles), not in mammals.' },
      ],
      correctExplanation: 'Human females have homomorphic XX sex chromosomes; all maternal ova carry a 22+X karyotype. Human males have heteromorphic XY sex chromosomes, producing 50% X-bearing sperm and 50% Y-bearing sperm. If an X-sperm fertilizes the egg, the child is female (46,XX); if a Y-sperm fertilizes, the child is male (46,XY).',
      relevantFormula: '\\text{Paternal Sperm: } 50\\% \\text{ X } + 50\\% \\text{ Y } \\implies P(\\text{Boy}) = P(\\text{Girl}) = 0.50',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Genetic Counseling for Hemophilia & Sickle Cell', description: 'Punnett square pedigrees compute recurrence risks for autosomal and X-linked recessive genetic disorders in carrier couples.' },
      { title: 'Agricultural Hybrid Crop Breeding', description: 'Selective hybridization exploits hybrid vigor (heterosis) by crossing pure inbred lines to maximize grain yields and disease resistance.' },
    ],
    simulationType: 'class10-biology',
  },
];
