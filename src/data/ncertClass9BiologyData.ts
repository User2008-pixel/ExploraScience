import { ConceptItem } from '../types/science';

export const NCERT_CLASS9_BIOLOGY_CONCEPTS: ConceptItem[] = [
  // =========================================================================
  // CHAPTER 5: THE FUNDAMENTAL UNIT OF LIFE (THE CELL)
  // =========================================================================
  {
    id: 'ncert9-bio-discovery-cell-theory',
    title: 'Discovery of the Cell & Modern Cell Theory',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'From Robert Hooke’s cork slices to Schleiden, Schwann, and Virchow’s cellular doctrine',
    description:
      'In 1665, Robert Hooke observed thin slices of dead cork under a primitive microscope, observing honeycomb-like compartments he termed "cells" (Latin for small rooms). In 1674, Antonie van Leeuwenhoek discovered free-living microorganisms in pond water with an improved microscope. Robert Brown discovered the cell nucleus in 1831. J.E. Purkinje coined "protoplasm" in 1839 for the living fluid substance. M.J. Schleiden (1838) and Theodor Schwann (1839) proposed the Cell Theory: all plants and animals are composed of cells, and the cell is the basic unit of life. Rudolf Virchow (1855) expanded it with "Omnis cellula-e-cellula": all cells arise from pre-existing cells.',
    formulaLaTeX: '\\text{Modern Cell Doctrine: } \\text{Organism} = \\sum_{i=1}^N \\text{Cells}_i \\quad \\& \\quad \\text{Parent Cell} \\xrightarrow{\\text{Division}} 2 \\text{ Daughter Cells}',
    formulaExplanation:
      'Living organisms range from single-celled unicellular microbes (Amoeba, Chlamydomonas, Paramecium, Bacteria) where a single cell performs all survival functions, to complex multicellular organisms with organized division of labour.',
    simulationType: 'bio-cell-explorer',
    variables: [
      {
        id: 'microscopeMagnification',
        name: 'Microscope Objective Magnification',
        symbol: 'M_{\\text{obj}}',
        unit: '×',
        min: 10,
        max: 1000,
        step: 50,
        defaultValue: 400,
        description: 'Compound optical microscope magnification (Eyepiece 10× × Objective 40× = 400×).',
      },
    ],
    prediction: {
      prompt: 'NCERT Historical Landmark Identification',
      scenario:
        'Which scientist modified and finalized the Cell Theory by establishing that new cells do not spontaneously generate from inorganic matter, but arise only by the division of pre-existing living cells ("Omnis cellula-e-cellula")?',
      choices: [
        {
          id: 'p1',
          text: 'Robert Hooke (1665)',
          isCorrect: false,
          misconceptionExplanation: 'Hooke observed dead empty cellulose cell walls of oak bark cork, not living dividing cells.',
        },
        {
          id: 'p2',
          text: 'Rudolf Virchow (1855)',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Robert Brown (1831)',
          isCorrect: false,
          misconceptionExplanation: 'Robert Brown discovered the spherical nucleus inside orchid plant cells, not the principle of cellular origin.',
        },
      ],
      correctExplanation:
        'Rudolf Virchow in 1855 refined the Schleiden-Schwann cell theory by publishing "Omnis cellula-e-cellula", meaning all living cells arise exclusively from the division of pre-existing living cells, decisively overthrowing the medieval myth of spontaneous generation.',
      relevantFormula: '\\text{Omnis cellula-e-cellula (Rudolf Virchow, 1855)}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-plasma-membrane-diffusion', name: 'Plasma Membrane & Diffusion', subject: 'biology' },
      { id: 'ncert9-bio-plant-vs-animal-cells', name: 'Plant vs Animal Cells', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Stem Cell Regenerative Medicine',
        description: 'Because all cells arise from pre-existing cells, pluripotent embryonic and adult stem cells can divide to replace damaged cardiac or neural tissues.',
      },
      {
        title: 'Onion Peel Cell Staining in School Labs',
        description: 'Peeling the epidermal layer of an onion bulb and staining with safranin reveals rectangular plant cells with distinct walls and peripheral nuclei.',
      },
      {
        title: 'Amoeba Pseudopodia Phagocytosis',
        description: 'A unicellular Amoeba uses its flexible plasma membrane to engulf food particles into food vacuoles, proving a single cell performs complete nutrition.',
      },
    ],
  },

  {
    id: 'ncert9-bio-plasma-membrane-diffusion',
    title: 'Plasma Membrane Structure & Passive Diffusion',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Fluid mosaic lipid bilayer, selective permeability, and gaseous transport of O₂ and CO₂',
    description:
      'The plasma membrane (cell membrane) is an extremely thin (~7 nm), flexible living boundary composed of a phospholipid bilayer with embedded functional proteins. It is "selectively permeable"—permitting entry and exit of essential nutrients while blocking harmful toxins. Small neutral molecules like Oxygen (O₂) and Carbon Dioxide (CO₂) cross spontaneously by diffusion from regions of high concentration to regions of low concentration without metabolic energy expenditure.',
    formulaLaTeX: 'J = -D \\frac{dC}{dx} \\quad (\\text{Fick’s First Law of Diffusion}) \\quad | \\quad \\Delta C = C_{\\text{intracellular}} - C_{\\text{extracellular}}',
    formulaExplanation:
      'When cellular respiration consumes O₂ and generates waste CO₂, intracellular CO₂ concentration exceeds extracellular levels (C_in > C_out). CO₂ diffuses out spontaneously across the lipid bilayer.',
    simulationType: 'bio-cell-explorer',
    variables: [
      {
        id: 'externalCo2Ppm',
        name: 'Extracellular CO₂ Concentration',
        symbol: 'C_{\\text{out}}',
        unit: 'ppm',
        min: 200,
        max: 1000,
        step: 50,
        defaultValue: 400,
        description: 'Lower external CO₂ drives rapid outbound diffusion of metabolic cellular waste.',
      },
      {
        id: 'intracellularO2Ppm',
        name: 'Intracellular O₂ Concentration',
        symbol: 'C_{\\text{in}}',
        unit: 'ppm',
        min: 50,
        max: 300,
        step: 25,
        defaultValue: 100,
        description: 'Continuous mitochondrial respiration depletes internal O₂, sustaining inbound diffusion.',
      },
    ],
    prediction: {
      prompt: 'NCERT Gaseous Exchange Across Cell Membrane',
      scenario:
        'During active cellular aerobic respiration, how does carbon dioxide (CO₂) exit the cell into the surrounding blood capillary, and how does oxygen (O₂) enter?',
      choices: [
        {
          id: 'p1',
          text: 'The cell pumps CO₂ out using ATP active transport motors and sucks O₂ in by negative pressure.',
          isCorrect: false,
          misconceptionExplanation: 'Non-polar gases cross lipid bilayers purely by passive diffusion; no ATP energy or mechanical suction is involved.',
        },
        {
          id: 'p2',
          text: 'By passive diffusion down concentration gradients: high internal CO₂ diffuses out, and high blood O₂ diffuses in.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Gases can only enter and exit plant cells, because animal cells have no permeable membrane.',
          isCorrect: false,
          misconceptionExplanation: 'All eukaryotic and prokaryotic cells possess selectively permeable plasma membranes capable of rapid gas diffusion.',
        },
      ],
      correctExplanation:
        'CO₂ is a cellular waste product whose concentration builds up inside the cell relative to blood. It diffuses out down its concentration gradient across the selectively permeable plasma membrane. Simultaneously, cellular respiration depletes intracellular O₂, causing dissolved O₂ in oxygenated blood to diffuse into the cell spontaneously.',
      relevantFormula: '\\text{Rate of Gas Diffusion } \\frac{dQ}{dt} \\propto (P_{\\text{alveoli/capillary}} - P_{\\text{cell}})',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-osmosis-tonicity-plasmolysis', name: 'Osmosis & Plasmolysis', subject: 'biology' },
      { id: 'ncert9-bio-discovery-cell-theory', name: 'Discovery of the Cell', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Alveolar Gas Exchange in Human Lungs',
        description: 'Oxygen diffuses passively across thin alveolar squamous epithelial cell membranes into red blood cell hemoglobin in 0.25 seconds.',
      },
      {
        title: 'Endocytosis in Amoeba Feeding',
        description: 'The flexibility of the phospholipid membrane allows Amoeba to engulf external food particles by membrane invagination (endocytosis).',
      },
      {
        title: 'Transdermal Nicotine and Pain Relief Patches',
        description: 'Lipophilic medicinal drugs diffuse slowly through lipid cell membranes of skin layers into systemic blood circulation.',
      },
    ],
  },

  {
    id: 'ncert9-bio-osmosis-tonicity-plasmolysis',
    title: 'Osmosis, Tonicity & Plasmolysis in Plant and Animal Cells',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Hypotonic swelling, isotonic equilibrium, hypertonic shrinkage, turgor pressure, and plasmolysis',
    description:
      'Osmosis is the spontaneous net movement of water molecules through a selectively permeable membrane from a region of higher water concentration (dilute/hypotonic solution) to lower water concentration (concentrated/hypertonic solution). In a hypotonic medium: animal cells swell and burst (lysis), while plant cells absorb water until turgor pressure against the cellulose cell wall stops entry. In a hypertonic medium: animal cells shrink (crenation), while plant cells lose water and their protoplast shrinks away from the cell wall in a phenomenon called Plasmolysis.',
    formulaLaTeX: '\\Psi_w = \\Psi_s + \\Psi_p \\quad | \\quad \\text{Water flows from high } \\Psi_w \\to \\text{low } \\Psi_w \\quad | \\quad \\text{Turgor: } P_{\\text{turgor}} = P_{\\text{wall}}',
    formulaExplanation:
      'Turgor pressure exerts outward hydraulic force against the rigid plant cell wall, giving herbaceous plants upright mechanical rigidity without woody skeletons.',
    simulationType: 'cell-osmosis-plasmolysis',
    variables: [
      {
        id: 'externalSoluteConcPercent',
        name: 'External Salt Concentration',
        symbol: 'C_{\\text{salt}}',
        unit: '%',
        min: 0.1,
        max: 5.0,
        step: 0.2,
        defaultValue: 0.9,
        description: '<0.9% = Hypotonic (swelling), 0.9% = Isotonic (equilibrium), >0.9% = Hypertonic (plasmolysis/shrinkage).',
      },
      {
        id: 'ambientTempC',
        name: 'Medium Temperature',
        symbol: 'T',
        unit: '°C',
        min: 5,
        max: 45,
        step: 5,
        defaultValue: 25,
        description: 'Higher temperature accelerates water molecule kinetic motion across aquaporin pores.',
      },
    ],
    prediction: {
      prompt: 'NCERT Plasmolysis in Rhoeo Leaf Peel Experiment',
      scenario:
        'A peel of purple Tradescantia (Rhoeo) leaf is mounted on a slide in a strong concentrated sugar solution and examined under a microscope. What happens to the colored cell contents?',
      choices: [
        {
          id: 'p1',
          text: 'The cells swell until they violently explode, scattering purple pigment across the slide.',
          isCorrect: false,
          misconceptionExplanation: 'Swelling occurs in hypotonic pure water, not in concentrated hypertonic sugar syrup.',
        },
        {
          id: 'p2',
          text: 'Water leaves the vacuole via exosmosis; the living protoplast shrinks away from the cell wall (Plasmolysis).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'The rigid cell wall shrinks into a tiny ball while the inner cytoplasm remains expanded.',
          isCorrect: false,
          misconceptionExplanation: 'The outer cellulose cell wall is rigid and retains its rectangular shape; only the flexible inner plasma membrane and protoplast shrink.',
        },
      ],
      correctExplanation:
        'Because the external sugar solution has a higher solute concentration (lower water potential) than the cell sap, water rushes out through the plasma membrane by exosmosis. As the central vacuole deflates, the living protoplast pulls away from the rigid cellulose cell wall—a classic demonstration of Plasmolysis. If mounted in plain water again, deplasmolysis restores cell turgor.',
      relevantFormula: '\\text{Exosmosis: } \\Psi_{w,\\text{internal}} > \\Psi_{w,\\text{external}} \\implies \\text{Water flows OUT}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-cell-wall-turgor', name: 'Plant Cell Wall & Rigidity', subject: 'biology' },
      { id: 'ncert9-bio-vacuoles-tonoplast', name: 'Vacuoles & Plant Cell Turgidity', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Preserving Pickles & Jams with Salt/Sugar',
        description: 'High salt in pickles and high sugar in fruit jams plasmolyses and dehydrates contaminating bacteria and fungi, killing them and preventing spoilage.',
      },
      {
        title: 'Swelling of Dry Raisins in Pure Water',
        description: 'Dry raisins placed in plain water swell up dramatically via endosmosis because the inner grape pulp is hypertonic to pure water.',
      },
      {
        title: 'Root Hair Water Absorption in Soil',
        description: 'Plant root hairs absorb water from moist soil via osmosis across their selectively permeable membranes into xylem vessels.',
      },
    ],
  },

  {
    id: 'ncert9-bio-cell-wall-turgor',
    title: 'Plant Cell Wall & Structural Mechanical Rigidity',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Cellulose architecture, resistance to osmotic bursting, and comparison with animal cells',
    description:
      'Plant cells, fungi (chitin), and bacteria possess a non-living, rigid outer layer outside the plasma membrane called the Cell Wall. In plants, it is composed of tough complex cellulose fibers. It provides structural tensile strength, maintains cell shape, and prevents plant cells from bursting (lysis) when absorbing water in very dilute (hypotonic) environments by exerting an equal opposing wall pressure against internal turgor pressure.',
    formulaLaTeX: 'P_{\\text{wall}} = P_{\\text{turgor}} \\implies \\Delta V_{\\text{cell}} \\approx 0 \\quad (\\text{Bursting prevented})',
    formulaExplanation:
      'When endosmosis creates immense internal hydrostatic pressure, the rigid cellulose wall exerts counter-pressure. Animal cells lack cell walls and burst readily in distilled water.',
    simulationType: 'plant-vs-animal-cells',
    variables: [
      {
        id: 'wallTensileStrengthMpa',
        name: 'Cellulose Tensile Strength',
        symbol: '\\sigma_{\\text{wall}}',
        unit: 'MPa',
        min: 10,
        max: 100,
        step: 5,
        defaultValue: 50,
        description: 'High mechanical strength resisting internal turgor pressure up to 2-3 MPa.',
      },
    ],
    prediction: {
      prompt: 'NCERT Hypotonic Medium: RBC vs Onion Epidermal Cell',
      scenario:
        'A human Red Blood Cell (RBC) and an Onion epidermal cell are both placed into separate beakers of pure distilled water. What happens after 15 minutes?',
      choices: [
        {
          id: 'p1',
          text: 'Both cells swell and burst violently due to water influx.',
          isCorrect: false,
          misconceptionExplanation: 'The plant cell has a tough cellulose cell wall that easily withstands internal swelling pressure without bursting.',
        },
        {
          id: 'p2',
          text: 'The RBC swells and bursts (hemolysis), while the onion cell swells, becomes fully turgid, and remains intact.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Both cells shrink because pure water draws solutes out.',
          isCorrect: false,
          misconceptionExplanation: 'Pure water is hypotonic, causing water to rush into the cells, not out.',
        },
      ],
      correctExplanation:
        'Water enters both cells by endosmosis. The RBC has only a delicate phospholipid membrane that ruptures under osmotic swelling (lysis/hemolysis). The onion cell has a tough cellulose cell wall that exerts an equal and opposite "Wall Pressure" against the internal turgor pressure, keeping the cell rigid and intact.',
      relevantFormula: '\\text{Wall Pressure } P_W = \\text{Turgor Pressure } P_T \\implies \\text{Plant Cell Survives}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-osmosis-tonicity-plasmolysis', name: 'Osmosis & Plasmolysis', subject: 'biology' },
      { id: 'ncert9-bio-plant-vs-animal-cells', name: 'Plant vs Animal Cells', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Wilting and Reviving of Salad Greens',
        description: 'Limp celery and lettuce crisp up when soaked in cold fresh water because water rushes into cells via endosmosis, restoring full cell wall turgor.',
      },
      {
        title: 'Cotton Fabrics & Paper Manufacturing',
        description: 'Cotton fibers are 90% pure cellulose cell walls harvested from Gossypium seeds, spun into textiles.',
      },
      {
        title: 'Wood as Structural Building Timber',
        description: 'Thick secondary cell walls impregnated with lignin in tree xylem provide load-bearing capacity for multi-story wooden architecture.',
      },
    ],
  },

  {
    id: 'ncert9-bio-nucleus-chromatin-dna',
    title: 'The Nucleus: Genetic Command Center & DNA Organization',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Nuclear envelope, nucleolus, chromatin threads, chromosomes, DNA double helix, and genes',
    description:
      'The nucleus is the master control organelle of the eukaryotic cell. It is enclosed by a double-layered Nuclear Envelope perforated by Nuclear Pores regulating molecular traffic (mRNA, proteins) between nucleoplasm and cytoplasm. Inside lies the Nucleolus (the site of ribosome assembly) and Chromatin—an intertwined network of thread-like structures composed of DNA (Deoxyribonucleic acid) and histone proteins. When a cell prepares to divide, chromatin condenses into rod-shaped Chromosomes. Functional segments of DNA are called Genes, encoding instructions for protein synthesis and hereditary inheritance.',
    formulaLaTeX: '\\text{Gene} \\xrightarrow{\\text{Transcription}} \\text{mRNA} \\xrightarrow{\\text{Translation}} \\text{Functional Protein / Enzyme}',
    formulaExplanation:
      'In prokaryotes (bacteria), a well-defined nuclear membrane is absent; the undefined nuclear region containing only bare nucleic acid is called a Nucleoid.',
    simulationType: 'cell-structure-organelles',
    variables: [
      {
        id: 'chromosomeCountHuman',
        name: 'Chromosome Pairs (Diploid 2n)',
        symbol: '2n',
        unit: 'chromosomes',
        min: 2,
        max: 46,
        step: 2,
        defaultValue: 46,
        description: 'Human diploid somatic cells carry 46 chromosomes (23 homologous pairs).',
      },
    ],
    prediction: {
      prompt: 'NCERT Prokaryote vs Eukaryote Nuclear Difference',
      scenario:
        'In bacterial cells, what is the poorly defined nuclear region called, which lacks a nuclear membrane and contains only naked circular DNA?',
      choices: [
        {
          id: 'p1',
          text: 'Nucleolus',
          isCorrect: false,
          misconceptionExplanation: 'The nucleolus is a sub-nuclear organelle inside eukaryotic nuclei responsible for making ribosomal RNA.',
        },
        {
          id: 'p2',
          text: 'Nucleoid',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Centrosome',
          isCorrect: false,
          misconceptionExplanation: 'Centrosomes organize microtubules during animal cell division and contain centrioles.',
        },
      ],
      correctExplanation:
        'Prokaryotic cells (like bacteria and blue-green algae) lack a nuclear membrane enclosing their genetic material. Their undefined nuclear region containing naked, unassociated DNA is termed a "Nucleoid". Eukaryotic cells possess a true, double-membraned nucleus with nuclear pores.',
      relevantFormula: '\\text{Prokaryote = Nucleoid (No membrane)} \\quad \\longleftrightarrow \\quad \\text{Eukaryote = True Nucleus (Double membrane)}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-cytoplasm-prokaryote-eukaryote', name: 'Prokaryotes vs Eukaryotes', subject: 'biology' },
      { id: 'ncert9-bio-cell-division-mitosis-meiosis', name: 'Cell Division: Mitosis & Meiosis', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'DNA Profiling & Forensics',
        description: 'Extracting nuclear DNA from hair follicles or blood stains allows forensic crime labs to match genetic profiles with 99.9999% certainty.',
      },
      {
        title: 'CRISPR Gene Editing in Agriculture',
        description: 'Molecular gene-scissors target specific nuclear gene sequences to breed drought-tolerant rice and pest-resistant wheat.',
      },
      {
        title: 'Cancer Biopsies & Nuclear Pleomorphism',
        description: 'Pathologists diagnose malignant tumor cells under light microscopes by observing enlarged, irregularly shaped nuclei with prominent nucleoli.',
      },
    ],
  },

  {
    id: 'ncert9-bio-cytoplasm-prokaryote-eukaryote',
    title: 'Cytoplasm & Prokaryotic vs Eukaryotic Organization',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Cytosol fluid matrix, presence/absence of membrane-bound organelles, size disparity',
    description:
      'The cytoplasm is the fluid content inside the plasma membrane surrounding the nucleus, consisting of the aqueous cytosol and specialized membrane-bound organelles. Organisms are classified into two broad evolutionary categories: (1) Prokaryotes (e.g. Bacteria): small (1–10 µm), lack nuclear membrane (nucleoid), single circular chromosome, lack membrane-bound organelles (no mitochondria, plastids, ER, Golgi); (2) Eukaryotes (e.g. Fungi, Plants, Animals): larger (10–100 µm), possess true nucleus with double membrane, multiple linear chromosomes, and membrane-bound compartmentalized organelles.',
    formulaLaTeX: '\\text{Volume Ratio: } \\frac{V_{\\text{eukaryote}}}{V_{\\text{prokaryote}}} \\approx \\left(\\frac{50\\,\\mu\\text{m}}{2\\,\\mu\\text{m}}\\right)^3 \\approx 10^3 \\text{ to } 10^4 \\text{ times larger}',
    formulaExplanation:
      'Because eukaryotic cells are thousands of times larger, membrane-bound organelles are essential to compartmentalize mutually incompatible biochemical reactions.',
    simulationType: 'cell-structure-organelles',
    variables: [
      {
        id: 'cellDiameterUm',
        name: 'Cell Diameter',
        symbol: 'D_{\\text{cell}}',
        unit: 'µm',
        min: 1,
        max: 100,
        step: 5,
        defaultValue: 30,
        description: '1-10 µm for prokaryotes; 10-100 µm for typical plant and animal eukaryotes.',
      },
    ],
    prediction: {
      prompt: 'NCERT Organelle Compartmentalization Inquiry',
      scenario:
        'Which organelle is found in BOTH prokaryotic bacteria and complex eukaryotic human cells?',
      choices: [
        {
          id: 'p1',
          text: 'Mitochondria for ATP production',
          isCorrect: false,
          misconceptionExplanation: 'Mitochondria are membrane-bound organelles completely absent in prokaryotes (bacteria perform respiration across their plasma membrane).',
        },
        {
          id: 'p2',
          text: 'Ribosomes (70S in bacteria, 80S in eukaryotic cytoplasm)',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Endoplasmic Reticulum for protein transport',
          isCorrect: false,
          misconceptionExplanation: 'ER is a membrane-bound organelle found exclusively in eukaryotic cells.',
        },
      ],
      correctExplanation:
        'Ribosomes are non-membrane-bound ribonucleoprotein particles essential for protein synthesis present in ALL living cells—both prokaryotes (smaller 70S ribosomes) and eukaryotes (80S ribosomes in cytoplasm, 70S in mitochondria/chloroplasts). Membrane-bound organelles like mitochondria, chloroplasts, Golgi, and ER are absent in prokaryotes.',
      relevantFormula: '\\text{All Living Cells contain: Plasma Membrane, Cytosol, DNA, and Ribosomes}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-nucleus-chromatin-dna', name: 'The Nucleus & DNA', subject: 'biology' },
      { id: 'ncert9-bio-endoplasmic-reticulum', name: 'Endoplasmic Reticulum', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Antibiotic Specificity (e.g. Streptomycin)',
        description: 'Antibiotics target bacterial 70S ribosomes or cell walls, killing pathogenic bacteria without harming human 80S eukaryotic ribosomes.',
      },
      {
        title: 'Probiotic Yogurt Cultures (Lactobacillus)',
        description: 'Unicellular prokaryotic lactic acid bacteria ferment lactose in milk into lactic acid, producing curds and maintaining human gut microbiota.',
      },
      {
        title: 'Bioremediation of Ocean Oil Spills',
        description: 'Genetically engineered prokaryotic bacteria digest petroleum hydrocarbon chains into harmless fatty acids and water.',
      },
    ],
  },

  {
    id: 'ncert9-bio-endoplasmic-reticulum',
    title: 'Endoplasmic Reticulum: RER, SER & Membrane Biogenesis',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Rough ER protein synthesis, Smooth ER lipid manufacture, detoxifying liver enzymes, and membrane creation',
    description:
      'The Endoplasmic Reticulum (ER) is an extensive network of membrane-bound tubes and flattened sheets extending from the outer nuclear envelope throughout the cytoplasm. It exists in two morphological types: (1) Rough Endoplasmic Reticulum (RER): studded with ribosomes on its outer surface, responsible for synthesizing secretory and membrane proteins; (2) Smooth Endoplasmic Reticulum (SER): lacks ribosomes, manufactures lipids, phospholipids, and steroid hormones. Membrane Biogenesis: proteins and lipids manufactured by RER and SER assemble together to synthesize new cellular membranes. SER in vertebrate liver cells also detoxifies poisons and drugs.',
    formulaLaTeX: '\\text{RER (Proteins)} + \\text{SER (Lipids)} \\xrightarrow{\\text{Assembly}} \\text{Plasma Membrane (Membrane Biogenesis)}',
    formulaExplanation:
      'Proteins synthesized by ribosomes attached to RER are packaged into transport vesicles and routed to the Golgi apparatus for sorting and dispatch.',
    simulationType: 'cell-structure-organelles',
    variables: [
      {
        id: 'ribosomeDensityPercent',
        name: 'Ribosome Surface Coverage on RER',
        symbol: '\\rho_{\\text{ribo}}',
        unit: '%',
        min: 10,
        max: 90,
        step: 10,
        defaultValue: 70,
        description: 'High ribosome density in secretory cells (pancreas secreting digestive enzymes).',
      },
    ],
    prediction: {
      prompt: 'NCERT Liver Detoxification & Organelle Function',
      scenario:
        'In vertebrate liver cells (hepatocytes), which specific organelle plays a crucial role in chemically detoxifying many poisonous toxins, alcohol, and pharmaceutical drugs?',
      choices: [
        {
          id: 'p1',
          text: 'Lysosomes',
          isCorrect: false,
          misconceptionExplanation: 'Lysosomes digest cellular debris with hydrolytic enzymes, but drug detoxification occurs via cytochrome enzymes in the SER.',
        },
        {
          id: 'p2',
          text: 'Smooth Endoplasmic Reticulum (SER)',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Chloroplasts',
          isCorrect: false,
          misconceptionExplanation: 'Chloroplasts perform photosynthesis in plants and are absent in animal liver cells.',
        },
      ],
      correctExplanation:
        'Smooth Endoplasmic Reticulum (SER) in liver cells contains cytochrome P450 oxidase enzymes that chemically modify hydrophobic toxins, drugs, and metabolic byproducts into water-soluble compounds that can be safely excreted by kidneys in urine.',
      relevantFormula: '\\text{Lipophilic Toxin} \\xrightarrow{\\text{Liver SER Cytochrome Enzymes}} \\text{Water-Soluble Metabolite for Excretion}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-golgi-apparatus', name: 'Golgi Apparatus', subject: 'biology' },
      { id: 'ncert9-bio-lysosomes-suicide-bags', name: 'Lysosomes', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Pancreatic Enzyme Secretion',
        description: 'Pancreatic acinar cells are packed with dense RER networks to synthesize grams of digestive enzymes (trypsin, amylase, lipase) daily.',
      },
      {
        title: 'Drug Tolerance in Medicine',
        description: 'Chronic consumption of sedatives triggers rapid proliferation of SER in liver cells, requiring progressively higher doses for identical therapeutic effect.',
      },
      {
        title: 'Repairing Ruptured Plasma Membranes',
        description: 'When cell membranes tear, ER vesicle traffic instantly deploys newly synthesized lipids and proteins to patch the lesion.',
      },
    ],
  },

  {
    id: 'ncert9-bio-golgi-apparatus',
    title: 'Golgi Apparatus: Packaging, Secretion & Lysosome Genesis',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Camillo Golgi’s cisternae stacks, post-translational packaging, dispatch, and primary lysosome formation',
    description:
      'First described by Camillo Golgi in 1898, the Golgi apparatus consists of a system of membrane-bound flattened sacs called cisternae arranged in parallel stacks, associated with secretory vesicles. Materials synthesized near the ER (proteins and lipids) are packaged and dispatched through the Golgi: vesicles enter the receiving cis face, undergo modification (complex sugars added to proteins forming glycoproteins), and bud off from the trans face into secretory granules or primary lysosomes.',
    formulaLaTeX: '\\text{ER Vesicles} \\xrightarrow{\\text{cis-Golgi}} \\text{Cisternae Modification} \\xrightarrow{\\text{trans-Golgi}} \\text{Secretory Vesicles} \\text{ or } \\text{Lysosomes}',
    formulaExplanation:
      'In plant cells, the Golgi apparatus is dispersed as separate, discrete subunits called Dictyosomes that synthesize cell plate pectin during cytokinesis.',
    simulationType: 'cell-structure-organelles',
    variables: [
      {
        id: 'cisternaeStackCount',
        name: 'Cisternae Stack Layers',
        symbol: 'N_{\\text{cist}}',
        unit: 'layers',
        min: 3,
        max: 12,
        step: 1,
        defaultValue: 6,
        description: 'Parallel membrane sacs modifying and sorting secretory proteins.',
      },
    ],
    prediction: {
      prompt: 'NCERT Organelle Interdependence Inquiry',
      scenario:
        'Which cellular organelle is directly involved in the formation of primary Lysosomes containing digestive hydrolytic enzymes?',
      choices: [
        {
          id: 'p1',
          text: 'Mitochondria',
          isCorrect: false,
          misconceptionExplanation: 'Mitochondria generate ATP; they do not form hydrolytic digestive vesicles.',
        },
        {
          id: 'p2',
          text: 'Golgi Apparatus',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Plastids',
          isCorrect: false,
          misconceptionExplanation: 'Plastids are plant organelles for photosynthesis and starch storage.',
        },
      ],
      correctExplanation:
        'Hydrolytic digestive enzymes are synthesized by ribosomes on the RER and transported to the Golgi apparatus. The Golgi concentrates, modifies, and packages these enzymes into membrane-bound vesicles that bud off from the trans-Golgi network as primary Lysosomes.',
      relevantFormula: '\\text{RER Enzymes} \\to \\text{Golgi Processing} \\to \\text{Lysosome Budding}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-lysosomes-suicide-bags', name: 'Lysosomes: Suicide Bags', subject: 'biology' },
      { id: 'ncert9-bio-endoplasmic-reticulum', name: 'Endoplasmic Reticulum', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Mucus Secretion in Intestinal Goblet Cells',
        description: 'Goblet cells have prominent Golgi apparatus to glycosylate mucin proteins, lubricating and shielding the digestive tract lining.',
      },
      {
        title: 'Salivary Gland Amylase Packaging',
        description: 'Human salivary glands use Golgi vesicles to package starch-digesting ptyalin enzyme for release upon food mastication.',
      },
      {
        title: 'Plant Cell Wall Pectin Synthesis',
        description: 'Plant dictyosomes package complex hemicellulose and pectin polysaccharides to construct the middle lamella during cell division.',
      },
    ],
  },

  {
    id: 'ncert9-bio-lysosomes-suicide-bags',
    title: 'Lysosomes: Cellular Waste Disposal & "Suicide Bags"',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Acid hydrolytic enzymes, autophagocytosis, waste removal, and programmed cell autolysis',
    description:
      'Lysosomes are membrane-bound digestive vesicles filled with powerful hydrolytic enzymes (manufactured by RER) capable of digesting all organic macromolecules (proteins, fats, polysaccharides, nucleic acids). They act as the cell’s waste disposal and recycling system by digesting worn-out organelles (autophagy) and engulfing foreign bacterial invaders (phagocytosis). "Suicide Bags": when a cell gets damaged beyond repair or infected, lysosomes rupture, releasing their digestive enzymes into the cytosol, which digest and autolyze the cell itself.',
    formulaLaTeX: '\\text{Lysosomal Hydrolysis: } \\text{Biopolymer} + \\text{H}_2\\text{O} \\xrightarrow{\\text{Acid Hydrolases (pH 4.8)}} \\text{Monomeric Nutrients}',
    formulaExplanation:
      'The single membrane maintains an internal acidic pH (~4.8) via ATP proton pumps, shielding the neutral cytoplasm (pH 7.2) from accidental enzyme digestion unless massive rupture occurs.',
    simulationType: 'cell-structure-organelles',
    variables: [
      {
        id: 'lysosomeIntraPh',
        name: 'Internal Lysosomal pH',
        symbol: '\\text{pH}_{\\text{lyso}}',
        unit: 'pH',
        min: 3.5,
        max: 6.5,
        step: 0.1,
        defaultValue: 4.8,
        description: 'Optimal acidic pH for ~50 acid hydrolases (proteases, lipases, nucleases).',
      },
    ],
    prediction: {
      prompt: 'NCERT "Suicide Bag" Moniker Inquiry',
      scenario:
        'Why are lysosomes commonly referred to as the "suicide bags" of the cell in biology?',
      choices: [
        {
          id: 'p1',
          text: 'Because they contain toxic cyanide crystals that poison nearby competitor cells.',
          isCorrect: false,
          misconceptionExplanation: 'Lysosomes contain digestive hydrolytic enzymes, not mineral poisons.',
        },
        {
          id: 'p2',
          text: 'Because if the cell is severely damaged or dies, lysosomes burst and their enzymes digest their own host cell.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Because they deliberately explode every 24 hours to force the cell to divide.',
          isCorrect: false,
          misconceptionExplanation: 'Lysosome rupture is a protective autolytic response to cellular damage or infection, not a daily clock mechanism.',
        },
      ],
      correctExplanation:
        'When cellular metabolism is fatally disrupted (e.g. physical trauma, extreme heat, viral infection), lysosomal membranes rupture. The released digestive hydrolytic enzymes break down cellular organelles and proteins, destroying the damaged cell in a process known as autolysis—hence earning the name "Suicide Bags".',
      relevantFormula: '\\text{Cellular Trauma} \\implies \\text{Lysosome Membrane Lysis} \\implies \\text{Autolytic Self-Digestion}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-golgi-apparatus', name: 'Golgi Apparatus', subject: 'biology' },
      { id: 'ncert9-bio-endoplasmic-reticulum', name: 'Endoplasmic Reticulum', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Tadpole Tail Resorption During Metamorphosis',
        description: 'As a tadpole transforms into an adult frog, lysosomal enzymes in tail cells systematically digest the tail tissues, recycling amino acids.',
      },
      {
        title: 'White Blood Cell Phagocytosis of Pathogens',
        description: 'Human macrophages engulf invading bacteria into phagosomes, which fuse with lysosomes to kill pathogens within minutes.',
      },
      {
        title: 'Tay-Sachs Disease',
        description: 'A genetic defect in a single lysosomal lipid-digesting enzyme (hexosaminidase A) causes toxic lipid accumulation in brain neurons.',
      },
    ],
  },

  {
    id: 'ncert9-bio-mitochondria-cellular-respiration',
    title: 'Mitochondria: The Powerhouses of the Cell & ATP Synthesis',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Double-membrane architecture, deeply folded cristae, semi-autonomous DNA, and ATP generation',
    description:
      'Known as the "Powerhouses of the Cell", mitochondria generate the cellular energy currency ATP (Adenosine Triphosphate) required for all metabolic chemical activities. Architecture: (1) Outer membrane is porous; (2) Inner membrane is deeply folded into finger-like projections called Cristae, vastly expanding surface area for ATP-generating electron transport enzymes; (3) Matrix contains enzymes for Krebs cycle. Semi-Autonomous Organelle: Mitochondria possess their own circular DNA and 70S ribosomes, enabling them to synthesize some of their own structural proteins and replicate independently by fission.',
    formulaLaTeX: '\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\xrightarrow{\\text{Mitochondria}} 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + 36\\text{--}38\\text{ ATP}',
    formulaExplanation:
      'ATP stores energy in high-energy terminal phosphoanhydride bonds: ATP + H₂O → ADP + P_i + 30.5 kJ/mol of usable cellular energy.',
    simulationType: 'cell-structure-organelles',
    variables: [
      {
        id: 'cristaeFoldingRatio',
        name: 'Inner Membrane Cristae Surface Area',
        symbol: 'A_{\\text{cristae}}',
        unit: '×',
        min: 2,
        max: 10,
        step: 1,
        defaultValue: 5,
        description: 'Folded cristae provide 5× greater area for ATP synthase complexes.',
      },
      {
        id: 'mitochondrialCountPerCell',
        name: 'Mitochondria Density in Cell',
        symbol: 'N_{\\text{mito}}',
        unit: 'organelles',
        min: 50,
        max: 2000,
        step: 50,
        defaultValue: 1000,
        description: 'Metabolically active cells (flight muscle, heart) have up to 2000 mitochondria.',
      },
    ],
    prediction: {
      prompt: 'NCERT Semi-Autonomous Organelle Inquiry',
      scenario:
        'Why are mitochondria (and plastids) referred to as "strange" or "semi-autonomous" organelles in NCERT biology?',
      choices: [
        {
          id: 'p1',
          text: 'Because they can survive outside the human body in pond water for weeks.',
          isCorrect: false,
          misconceptionExplanation: 'Mitochondria rely on nuclear-encoded genes for most enzymes and cannot survive independently in the environment.',
        },
        {
          id: 'p2',
          text: 'Because they possess their own circular DNA and ribosomes, allowing them to make their own proteins and divide independently.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Because they possess a cell wall made of chitin like fungi.',
          isCorrect: false,
          misconceptionExplanation: 'Mitochondria have double phospholipid membranes, not chitin cell walls.',
        },
      ],
      correctExplanation:
        'Mitochondria (and chloroplasts) are semi-autonomous because they possess their own circular DNA genomes and 70S ribosomes (supporting the Endosymbiotic Theory of evolution from ancestral aerobic bacteria). They synthesize some of their own respiratory proteins and replicate inside the cell by binary fission.',
      relevantFormula: '\\text{Mitochondria} \\implies \\text{Own Circular DNA} + \\text{70S Ribosomes} + \\text{Self-Fission}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-plastids-chloroplasts', name: 'Plastids: Chloroplasts', subject: 'biology' },
      { id: 'ncert9-bio-plasma-membrane-diffusion', name: 'Plasma Membrane & Diffusion', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Cardiac Muscle High Endurance',
        description: 'Human heart muscle cells dedicate over 40% of their cytoplasmic volume to dense mitochondria to sustain rhythmic contractions without fatigue.',
      },
      {
        title: 'Maternal Mitochondrial DNA Inheritance',
        description: 'Sperm mitochondria are destroyed upon fertilization, meaning all humans inherit mitochondrial DNA exclusively from their biological mothers.',
      },
      {
        title: 'Cyanide Poisoning Mechanism',
        description: 'Cyanide binds to cytochrome c oxidase in the mitochondrial cristae, halting ATP synthesis and causing fatal cellular suffocation within minutes.',
      },
    ],
  },

  {
    id: 'ncert9-bio-plastids-chloroplasts',
    title: 'Plastids: Chloroplasts, Chromoplasts & Leucoplasts',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Photosynthetic thylakoid grana, colorful fruit chromoplasts, and nutrient-storing leucoplasts',
    description:
      'Plastids are large double-membraned organelles found exclusively in plant cells and algae. Three major types: (1) Chloroplasts: contain green chlorophyll pigments, double membrane enclosing stroma fluid and stacked membrane sacs called thylakoids (grana); perform photosynthesis trapping sunlight to convert CO₂ and H₂O into glucose; (2) Chromoplasts: contain yellow, orange, and red carotenoid pigments, imparting bright colors to flowers and fruits to attract pollinating insects and seed-dispersing animals; (3) Leucoplasts: non-pigmented white plastids specialized for nutrient storage: Amyloplasts store starch (potato tubers), Elaioplasts store oils/lipids, and Aleuroplasts store proteins. Like mitochondria, plastids possess their own DNA and 70S ribosomes.',
    formulaLaTeX: '6\\text{CO}_2 + 12\\text{H}_2\\text{O} \\xrightarrow[\\text{Chloroplast}]{\\text{Light Energy}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 + 6\\text{H}_2\\text{O}',
    formulaExplanation:
      'Thylakoid membranes trap solar photons during light-dependent reactions, while the stroma matrix carries RuBisCO enzymes that fix CO₂ into carbohydrate sugars.',
    simulationType: 'plant-vs-animal-cells',
    variables: [
      {
        id: 'chlorophyllConcentrationMg',
        name: 'Chlorophyll Pigment Density',
        symbol: 'C_{\\text{chloro}}',
        unit: 'mg/g',
        min: 0.5,
        max: 4.0,
        step: 0.5,
        defaultValue: 2.5,
        description: 'Determines rate of radiant solar photon absorption.',
      },
      {
        id: 'lightIntensityLux',
        name: 'Incident Solar Light Intensity',
        symbol: 'I_{\\text{light}}',
        unit: 'kLux',
        min: 5,
        max: 80,
        step: 5,
        defaultValue: 35,
        description: 'Drives photochemical water splitting (photolysis) in thylakoids.',
      },
    ],
    prediction: {
      prompt: 'NCERT Plastid Functional Specialization Challenge',
      scenario:
        'A green raw tomato turns bright red as it ripens, while potato tubers growing underground are white. What plastid transformations explain these observations?',
      choices: [
        {
          id: 'p1',
          text: 'Chloroplasts in tomato disintegrate into vacuoles, while potatoes contain dead empty cells.',
          isCorrect: false,
          misconceptionExplanation: 'Ripening is an active metabolic conversion into chromoplasts, and potato cells are packed with living storage leucoplasts.',
        },
        {
          id: 'p2',
          text: 'In tomatoes, green chloroplasts convert into carotenoid-rich red chromoplasts; potato tubers contain starch-storing leucoplasts (amyloplasts).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Tomato cells absorb red dye from soil; potato cells lose their cell walls in darkness.',
          isCorrect: false,
          misconceptionExplanation: 'Plastid pigments are synthesized internally by genetic expression, not absorbed from external soil.',
        },
      ],
      correctExplanation:
        'As tomato fruits mature, chlorophyll breaks down and internal thylakoids reorganize into Chromoplasts synthesizing high concentrations of red lycopene carotenoid pigments. In underground potato tubers shielded from sunlight, Leucoplasts (specifically amyloplasts) synthesize and store dense starch grains.',
      relevantFormula: '\\text{Chloroplast (Green)} \\xrightarrow{\\text{Fruit Ripening}} \\text{Chromoplast (Red Lycopene)} \\quad | \\quad \\text{Leucoplast (Starch Storage)}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-mitochondria-cellular-respiration', name: 'Mitochondria & ATP', subject: 'biology' },
      { id: 'ncert9-bio-plant-vs-animal-cells', name: 'Plant vs Animal Cells', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Global Biosphere Oxygen Generation',
        description: 'Chloroplasts in terrestrial plants and marine phytoplankton produce over 99% of atmospheric oxygen sustaining aerobic life on Earth.',
      },
      {
        title: 'Agricultural Yield from Potato Tubers',
        description: 'Potato crop value depends on leucoplast starch density, feeding billions of people worldwide as a staple carbohydrate source.',
      },
      {
        title: 'Floral Pollinator Co-Evolution',
        description: 'Vibrant carotenoids in petal chromoplasts reflect specific light wavelengths visible to bees and hummingbirds, ensuring plant cross-pollination.',
      },
    ],
  },

  {
    id: 'ncert9-bio-vacuoles-tonoplast',
    title: 'Vacuoles, Tonoplast Membrane & Plant Cell Turgidity',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Large permanent central plant vacuole, tonoplast, osmoregulation, and Amoeba food vacuoles',
    description:
      'Vacuoles are membrane-bound storage sacs for solid or liquid contents. In animal cells, vacuoles are small, numerous, and temporary (or absent). In mature plant cells, a large permanent Central Vacuole occupies 50% to 90% of total cell volume. Enclosed by a selectively permeable membrane called the Tonoplast, it is filled with "cell sap" containing amino acids, sugars, mineral ions, organic acids, and proteins. It provides turgidity and rigidity to plant tissues, keeping herbaceous stems upright. In unicellular Amoeba, specialized Food Vacuoles digest engulfed prey, and Contractile Vacuoles expel excess water for osmoregulation.',
    formulaLaTeX: 'P_{\\text{turgor}} = \\Pi_{\\text{vacuole}} - \\Pi_{\\text{external}} \\quad | \\quad V_{\\text{vacuole}} \\sim 0.50\\text{--}0.90 \\times V_{\\text{plant cell}}',
    formulaExplanation:
      'Tonoplast active proton pumps concentrate solutes inside the vacuole sap, driving continuous osmotic water entry that maintains high internal turgor pressure.',
    simulationType: 'cell-osmosis-plasmolysis',
    variables: [
      {
        id: 'vacuoleVolumePercent',
        name: 'Central Vacuole Volume Fraction',
        symbol: '\\%_{\\text{vacuole}}',
        unit: '%',
        min: 30,
        max: 90,
        step: 5,
        defaultValue: 75,
        description: 'Large central sap reservoir pushing nucleus and cytoplasm to cell periphery.',
      },
    ],
    prediction: {
      prompt: 'NCERT Freshwater Amoeba Osmoregulation Inquiry',
      scenario:
        'What would happen to a freshwater Amoeba if its specialized Contractile Vacuole were poisoned or removed with a micropipette?',
      choices: [
        {
          id: 'p1',
          text: 'It would instantly starve because contractile vacuoles synthesize glucose.',
          isCorrect: false,
          misconceptionExplanation: 'Food vacuoles digest food; contractile vacuoles regulate water balance.',
        },
        {
          id: 'p2',
          text: 'Water would continuously enter by endosmosis, causing the Amoeba to swell and burst.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'It would shrink into a dehydrated cyst because it cannot absorb water.',
          isCorrect: false,
          misconceptionExplanation: 'Freshwater is hypotonic to amoeba cytoplasm, so water enters passively and continuously.',
        },
      ],
      correctExplanation:
        'Freshwater pond water is hypotonic to the Amoeba’s internal cytoplasm, so water continuously enters the unicellular organism by endosmosis. The contractile vacuole collects this excess water, migrates to the cell edge, and contracts to pump it outside. Without it, hydrostatic pressure builds until the membrane ruptures (lysis).',
      relevantFormula: '\\text{Osmotic Water Inflow } = \\text{Contractile Vacuole Pumping Rate}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-osmosis-tonicity-plasmolysis', name: 'Osmosis & Plasmolysis', subject: 'biology' },
      { id: 'ncert9-bio-cell-wall-turgor', name: 'Plant Cell Wall', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Crispness of Fresh Apples and Pears',
        description: 'The crunchy bite of ripe fruit comes from bursting turgid central vacuoles spraying sweet pressurized cell sap onto tastebuds.',
      },
      {
        title: 'Stomatal Guard Cell Aperture Control',
        description: 'Swelling of guard cell vacuoles bends thick inner cell walls, opening stomatal pores for photosynthetic gas exchange.',
      },
      {
        title: 'Pigment Storage in Beetroot and Flowers',
        description: 'Water-soluble anthocyanin and betalain pigments stored in central vacuoles produce deep purple beetroot juice and flower petal hues.',
      },
    ],
  },

  {
    id: 'ncert9-bio-plant-vs-animal-cells',
    title: 'Plant vs Animal Cells: Comparative Cytology',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Cell walls, plastids, large central vacuoles, centrosomes, and distinct shapes',
    description:
      'Plant and animal cells share common eukaryotic organelles (plasma membrane, nucleus, mitochondria, ER, Golgi, ribosomes, peroxisomes), but exhibit fundamental architectural distinctions: Plant cells possess an outer rigid cellulose Cell Wall, photosynthetic/storage Plastids (chloroplasts), a single enormous permanent Central Vacuole pushing the nucleus to the periphery, and plasmodesmata cytoplasmic bridges. Animal cells lack cell walls and plastids, possess only small temporary vacuoles, contain Centrosomes with Centrioles (organizing spindle fibers during cell division), and exhibit flexible, variable shapes.',
    formulaLaTeX: '\\text{Plant Specific: } [\\text{Cell Wall} + \\text{Plastids} + \\text{Central Vacuole}] \\quad \\longleftrightarrow \\quad \\text{Animal Specific: } [\\text{Centrioles/Centrosome}]',
    formulaExplanation:
      'Plants are sessile autotrophs requiring rigid mechanical walls and solar-trapping plastids; animals are motile heterotrophs requiring flexible membranes and centriole-directed mitotic motility.',
    simulationType: 'plant-vs-animal-cells',
    variables: [
      {
        id: 'cellRigidityScore',
        name: 'Structural Rigidity Index',
        symbol: 'R_{\\text{cell}}',
        unit: 'idx',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 9,
        description: 'High in plant cells (9/10 with cell wall); flexible in animal cells (2/10).',
      },
    ],
    prediction: {
      prompt: 'NCERT Microscopic Cell Identification Challenge',
      scenario:
        'A student views an unknown tissue cell under a compound light microscope. She observes: (1) A prominent rectangular boundary, (2) Green spherical granules, (3) A nucleus pushed to one side by a giant clear space, and (4) No centrioles. Is this an animal or plant cell?',
      choices: [
        {
          id: 'p1',
          text: 'Animal cell, because all living cells possess nuclei.',
          isCorrect: false,
          misconceptionExplanation: 'Animal cells lack cell walls and green chloroplasts, and usually have central nuclei.',
        },
        {
          id: 'p2',
          text: 'Plant cell, characterized by cellulose cell wall, chloroplasts, and a large central vacuole displacing the nucleus.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Bacterial cell, because bacteria are green.',
          isCorrect: false,
          misconceptionExplanation: 'Bacteria are prokaryotes lacking membrane-bound nuclei and large vacuoles.',
        },
      ],
      correctExplanation:
        'The combination of a rigid rectangular cellulose cell wall, green photosynthetic chloroplasts, and a giant central sap vacuole that displaces the nucleus to the peripheral cytoplasm definitively identifies a eukaryotic Plant Cell.',
      relevantFormula: '\\text{Plant Cell Diagnostics} = \\text{Cell Wall} + \\text{Chloroplasts} + \\text{Peripheral Nucleus (Central Vacuole)}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-plastids-chloroplasts', name: 'Plastids & Chloroplasts', subject: 'biology' },
      { id: 'ncert9-bio-cell-wall-turgor', name: 'Plant Cell Wall', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Forensic Fiber Distinction: Wool vs Cotton',
        description: 'Microscopic inspection distinguishes animal wool fibers (keratin protein without cell walls) from plant cotton fibers (cellulose cell wall tubes).',
      },
      {
        title: 'Selective Herbicides in Modern Agriculture',
        description: 'Weedicides targeting cellulose synthesis enzymes kill invasive broadleaf weeds while remaining non-toxic to grazing livestock and pets.',
      },
      {
        title: 'Cancer Chemotherapy Target (Centrosomes)',
        description: 'Taxane cancer drugs disrupt centriole spindle microtubule assembly in dividing animal tumor cells, arresting tumor proliferation.',
      },
    ],
  },

  {
    id: 'ncert9-bio-cell-division-mitosis-meiosis',
    title: 'Cell Division: Equational Mitosis vs Reductional Meiosis',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Mitosis for somatic growth/tissue repair vs Meiosis for haploid gamete formation',
    description:
      'New cells are formed in organisms to grow, replace injured/dead cells, and form gametes for reproduction: (1) Mitosis (Equational Division): Occurs in somatic body cells; a diploid mother cell (2n) divides once to produce two genetically identical diploid daughter cells (2n) with the same chromosome number, responsible for bodily growth, tissue regeneration, and wound repair; (2) Meiosis (Reductional Division): Occurs in reproductive germ cells (testes/ovaries); involves two consecutive divisions (Meiosis I and Meiosis II) yielding four non-identical haploid daughter cells (gametes: sperm/egg) with half the original chromosome count (n). During fertilization, gamete fusion restores the full diploid (2n) chromosome count in the zygote.',
    formulaLaTeX: '\\text{Mitosis: } 2n \\to 2 \\times 2n \\quad | \\quad \\text{Meiosis: } 2n \\xrightarrow{\\text{I}} 2 \\times n \\xrightarrow{\\text{II}} 4 \\times n \\quad | \\quad n_{\\text{sperm}} + n_{\\text{egg}} = 2n_{\\text{zygote}}',
    formulaExplanation:
      'If reproductive cells divided by mitosis instead of meiosis, the chromosome count would double every generation (46 → 92 → 184), resulting in non-viable offspring.',
    simulationType: 'cell-division-mitosis',
    variables: [
      {
        id: 'somaticDiploidNumber2n',
        name: 'Species Diploid Number (2n)',
        symbol: '2n',
        unit: 'chromosomes',
        min: 4,
        max: 46,
        step: 2,
        defaultValue: 46,
        description: 'Human diploid number = 46. Gametes produced by meiosis have n = 23.',
      },
    ],
    prediction: {
      prompt: 'NCERT Chromosome Counting Problem',
      scenario:
        'A human somatic skin cell with 46 chromosomes divides by mitosis to heal a cut. Simultaneously, an ovary germ cell divides by meiosis to form ova (eggs). How many chromosomes are in each daughter cell respectively?',
      choices: [
        {
          id: 'p1',
          text: 'Skin daughter cell: 23 chromosomes; Ovum: 46 chromosomes.',
          isCorrect: false,
          misconceptionExplanation: 'Mitosis conserves chromosome number (46), while meiosis halves it (23).',
        },
        {
          id: 'p2',
          text: 'Skin daughter cell: 46 chromosomes; Ovum: 23 chromosomes.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Both daughter cells have 46 chromosomes because all human cells are identical.',
          isCorrect: false,
          misconceptionExplanation: 'Gametes must be haploid (n = 23) so that fertilization creates a normal 46-chromosome diploid baby.',
        },
      ],
      correctExplanation:
        'Mitosis is an equational division where the replicated chromosomes separate equally: one 46-chromosome skin mother cell yields two daughter cells with 46 chromosomes each. Meiosis is a reductional division: one 46-chromosome germ cell undergoes two nuclear divisions to yield four haploid gametes with 23 chromosomes each.',
      relevantFormula: '\\text{Mitosis: } 2n(46) \\to 2n(46) \\quad | \\quad \\text{Meiosis: } 2n(46) \\to n(23)',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-nucleus-chromatin-dna', name: 'The Nucleus & Chromosomes', subject: 'biology' },
      { id: 'ncert9-bio-plant-meristematic-tissues', name: 'Plant Meristems', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Skin Wound Healing & Bone Fracture Mending',
        description: 'Fibroblasts and osteoblasts undergo rapid mitotic cell division to lay down new collagen matrix and bone callus, closing wounds.',
      },
      {
        title: 'In Vitro Fertilization (IVF) Genetics',
        description: 'Fertility doctors verify that human eggs and sperm possess exactly 23 haploid chromosomes before micro-injection to prevent genetic trisomy.',
      },
      {
        title: 'Plant Vegetative Cloning in Agriculture',
        description: 'Rose stem cuttings produce identical clones of parent bushes through continuous mitotic root and shoot cell divisions.',
      },
    ],
  },

  // =========================================================================
  // CHAPTER 6: TISSUES
  // =========================================================================
  {
    id: 'ncert9-bio-tissues-division-of-labour',
    title: 'Concept of Tissues & Cellular Division of Labour',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Specialization of cells with common origin and function for maximum physiological efficiency',
    description:
      'A tissue is a cluster of structurally similar cells with a common embryonic origin that work together to perform a specific physiological function. In multicellular organisms, division of labour ensures high efficiency: muscle cells contract to produce movement, nerve cells carry electrochemical impulses, blood transports oxygen and nutrients, and xylem conducts water in trees. Plants are stationary and require supportive structural tissues with dead lignified cells, whereas animals are motile and composed predominantly of living cells with uniform growth.',
    formulaLaTeX: '\\text{Cells} \\xrightarrow{\\text{Aggregation}} \\text{Tissue} \\xrightarrow{\\text{Coordination}} \\text{Organ} \\xrightarrow{\\text{Integration}} \\text{Organ System} \\to \\text{Organism}',
    formulaExplanation:
      'Unlike isolated unicellular organisms, organized tissues achieve synergy where collective functional capacity vastly exceeds that of uncoordinated cells.',
    simulationType: 'plant-tissues',
    variables: [
      {
        id: 'tissueEfficiencyMultiplier',
        name: 'Division of Labour Multiplier',
        symbol: '\\eta_{\\text{tissue}}',
        unit: '×',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 10,
        description: 'Specialization enhances cellular task efficiency up to tenfold.',
      },
    ],
    prediction: {
      prompt: 'NCERT Comparative Biology: Plant vs Animal Tissues',
      scenario:
        'Why do plant tissues contain a large proportion of dead supportive cells (such as wood sclerenchyma and cork), whereas most animal tissues consist of living cells?',
      choices: [
        {
          id: 'p1',
          text: 'Because plant roots absorb poison from soil that kills their internal cells.',
          isCorrect: false,
          misconceptionExplanation: 'Dead plant cells are deliberate structural adaptations, not accidental poisoning.',
        },
        {
          id: 'p2',
          text: 'Plants are stationary and need dead cells with thick walls for mechanical strength without consuming metabolic maintenance energy.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Animals cannot maintain living cells because animal cells lack nuclei.',
          isCorrect: false,
          misconceptionExplanation: 'Animal cells are eukaryotic living cells containing nuclei and mitochondria.',
        },
      ],
      correctExplanation:
        'Plants are stationary (fixed in one place) and must withstand wind, storms, and gravity upright. Dead lignified cells (like sclerenchyma fibers and xylem vessels) provide immense mechanical tensile strength and structural support while requiring zero metabolic maintenance energy or ATP expenditure.',
      relevantFormula: '\\text{Dead Plant Tissues} = \\text{Maximum Mechanical Strength} + \\text{Zero Metabolic Maintenance Cost}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-plant-meristematic-tissues', name: 'Plant Meristematic Tissues', subject: 'biology' },
      { id: 'ncert9-bio-animal-epithelial-tissues', name: 'Animal Epithelial Tissues', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Giant Redwood Trees Standing 100 Meters Tall',
        description: 'Massive dead heartwood tissues support thousands of tons of tree trunk mass against gale-force Pacific winds.',
      },
      {
        title: 'Tissue Engineering in Modern Medicine',
        description: 'Scientists seed human chondrocyte cartilage cells onto 3D polymer scaffolds to grow replacement human ears and knee meniscus tissues.',
      },
      {
        title: 'Jute and Flax Linen Textiles',
        description: 'Commercial ropes, burlap sacks, and linen garments are woven directly from bundles of dead plant sclerenchyma phloem fibers.',
      },
    ],
  },

  {
    id: 'ncert9-bio-plant-meristematic-tissues',
    title: 'Plant Meristematic Tissues: Apical, Intercalary & Lateral',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Active localized cell division, dense cytoplasm, thin cellulose walls, lack of vacuoles',
    description:
      'Growth in plants is localized to specific regions containing actively dividing cells called Meristematic Tissues. Cytological characteristics: very active cells with dense cytoplasm, thin cellulose cell walls, prominent nuclei, and lack of vacuoles (since vacuoles store sap and divide poorly). Three types: (1) Apical Meristem: located at the growing tips of stems and roots, increases the linear length of the plant (primary growth); (2) Intercalary Meristem: located at the base of leaves or internodes (on twigs/grasses), facilitates internode elongation; (3) Lateral Meristem (Cambium / Cork Cambium): located along the lateral perimeter of stems and roots, increases the girth and thickness of the plant axis (secondary growth).',
    formulaLaTeX: '\\Delta L_{\\text{axis}} \\propto \\text{Apical/Intercalary Meristem} \\quad | \\quad \\Delta \\text{Girth} (\\Delta D) \\propto \\text{Lateral Meristem (Cambium)}',
    formulaExplanation:
      'Once meristematic cells divide and differentiate, they lose the capacity to divide and mature into permanent tissues through the process of Differentiation.',
    simulationType: 'plant-tissues',
    variables: [
      {
        id: 'meristemMitoticRatePerDay',
        name: 'Mitotic Division Rate',
        symbol: 'R_{\\text{mitosis}}',
        unit: 'div/day',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 4,
        description: 'Rapid cell cycle generating hundreds of new cells per shoot apex daily.',
      },
    ],
    prediction: {
      prompt: 'NCERT Onion Root Tip Decapitation Experiment',
      scenario:
        'Two glass jars (A and B) are filled with water and onion bulbs are placed on top. On Day 4, the top 1 cm tip of the growing roots in Jar B is snipped off with scissors. What happens to root growth in Jar B over the next week?',
      choices: [
        {
          id: 'p1',
          text: 'The roots in Jar B immediately grow twice as fast to compensate for the cut.',
          isCorrect: false,
          misconceptionExplanation: 'Cutting the tip removes the apical meristem, eliminating the tissue responsible for elongation.',
        },
        {
          id: 'p2',
          text: 'The roots in Jar B stop growing completely in length because the root apical meristem was removed.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'The roots turn into leaves and begin photosynthesizing.',
          isCorrect: false,
          misconceptionExplanation: 'Root cells cannot spontaneously transdifferentiate into photosynthetic leaf organs.',
        },
      ],
      correctExplanation:
        'Root elongation occurs exclusively via active cell division in the Root Apical Meristem situated at the terminal root tip. When the 1 cm tip is excised, the meristematic tissue is removed. The remaining root cells are differentiated permanent cells incapable of division, halting further elongation.',
      relevantFormula: '\\text{Root Elongation Halts: } \\frac{dL}{dt} = 0 \\text{ upon Apical Meristem excision}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-simple-permanent-parenchyma', name: 'Simple Permanent Tissues', subject: 'biology' },
      { id: 'ncert9-bio-cell-division-mitosis-meiosis', name: 'Cell Division: Mitosis', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Pruning Tea Bushes and Hedges',
        description: 'Pruning removes the apical meristem (decapitating apical dominance), stimulating lateral dormant buds to branch into dense bushy foliage.',
      },
      {
        title: 'Lawn Grass Regeneration After Mowing',
        description: 'Lawnmowers shear grass leaf tips, but intercalary meristems at the internode base rapidly regenerate new grass blades within days.',
      },
      {
        title: 'Tree Trunk Growth Rings in Dendrochronology',
        description: 'Seasonal cycles of lateral vascular cambium activity lay down concentric annual growth rings, allowing scientists to date ancient tree logs.',
      },
    ],
  },

  {
    id: 'ncert9-bio-simple-permanent-parenchyma',
    title: 'Simple Permanent Plant Tissues: Parenchyma & Its Modifications',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Living unspecialized cells, thin walls, intercellular spaces, chlorenchyma and aerenchyma',
    description:
      'Simple permanent tissues consist of only one type of cell. Parenchyma is the most abundant fundamental plant tissue: living, oval/polygonal cells with thin cellulose walls, large central vacuoles, and prominent intercellular spaces between cells. Functions: food storage (starch, fats), packaging filler tissue, and metabolic support. Modifications: (1) Chlorenchyma: parenchyma containing chloroplasts found in green leaves and stems, performing photosynthesis; (2) Aerenchyma: parenchyma with large air cavities found in aquatic hydrophytes (lotus, hyacinth), providing buoyancy to float on water surfaces.',
    formulaLaTeX: '\\text{Parenchyma} \\xrightarrow{\\text{Chloroplasts}} \\text{Chlorenchyma (Photosynthesis)} \\quad | \\quad \\text{Parenchyma} \\xrightarrow{\\text{Air Cavities}} \\text{Aerenchyma (Buoyancy)}',
    formulaExplanation:
      'Because parenchyma cells remain living and unspecialized, they can dedifferentiate into secondary meristems to heal plant pruning wounds.',
    simulationType: 'plant-tissues',
    variables: [
      {
        id: 'intercellularAirVolumePercent',
        name: 'Aerenchyma Air Cavity Fraction',
        symbol: '\\%_{\\text{air}}',
        unit: '%',
        min: 10,
        max: 70,
        step: 5,
        defaultValue: 45,
        description: 'Large air channels in aquatic water hyacinth petioles enabling surface floatation.',
      },
    ],
    prediction: {
      prompt: 'NCERT Aquatic Plant Adaptation Inquiry',
      scenario:
        'Why do aquatic plants like Water Hyacinth (Eichhornia) and Hydrilla float effortlessly on pond water without sinking to the muddy bottom?',
      choices: [
        {
          id: 'p1',
          text: 'Because their cells are filled with hot helium gas.',
          isCorrect: false,
          misconceptionExplanation: 'Plants cannot generate helium; they store atmospheric air in cellular spaces.',
        },
        {
          id: 'p2',
          text: 'Their tissues contain specialized Aerenchyma with large interconnected air cavities that impart buoyant upthrust.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Because water repels their roots with electrostatic charges.',
          isCorrect: false,
          misconceptionExplanation: 'Floatation is governed by Archimedes’ principle of displaced fluid buoyancy.',
        },
      ],
      correctExplanation:
        'In aquatic hydrophytes, parenchyma tissue adapts into "Aerenchyma" featuring giant enclosed air pockets between cells. These air cavities lower the overall tissue density below that of liquid water (ρ_plant < ρ_water), providing buoyant upthrust so leaves float on the water surface to capture sunlight.',
      relevantFormula: 'F_{\\text{buoyant}} = \\rho_{\\text{water}} V_{\\text{displaced}} g > m_{\\text{plant}} g',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-collenchyma-mechanical-support', name: 'Collenchyma: Mechanical Flexibility', subject: 'biology' },
      { id: 'ncert9-bio-sclerenchyma-lignified-tissue', name: 'Sclerenchyma: Dead Supportive Tissue', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Fleshy Fruit Pulp and Root Storage',
        description: 'The edible sweet pulp of apples, mangoes, and starchy potato tubers consists almost entirely of living storage parenchyma tissue.',
      },
      {
        title: 'Lotus Petiole Air Canals',
        description: 'Transverse sections of sacred lotus stems reveal symmetric circular aerenchyma tubes transporting oxygen down to submerged mud roots.',
      },
      {
        title: 'Succulent Water Storage in Desert Cacti',
        description: 'Desert xerophytes pack mucilage-rich parenchyma cells in thick green stems to retain hundreds of liters of water during drought.',
      },
    ],
  },

  {
    id: 'ncert9-bio-collenchyma-mechanical-support',
    title: 'Collenchyma: Plant Flexibility & Mechanical Tensile Strength',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Living elongated cells, localized pectin corner thickenings, flexibility without breaking',
    description:
      'Collenchyma is a simple permanent tissue that provides mechanical flexibility and tensile elasticity to young aerial plant parts. Characteristics: living, elongated cells with irregularly thickened cellulose, hemicellulose, and pectin deposits at cell corners, with very little or no intercellular spaces. Function: enables easy mechanical bending of various parts of a plant (like leaf petioles, climbing tendrils, and young stems) in high winds without breaking, providing vital mechanical support to growing herbaceous organs.',
    formulaLaTeX: '\\sigma_{\\text{flexural}} \\propto \\text{Pectin-Cellulose Corner Thickenings} \\quad | \\quad \\text{Intercellular Space} \\approx 0',
    formulaExplanation:
      'Unlike sclerenchyma, collenchyma cells remain living with active cytoplasm, allowing them to stretch and elongate as young stems grow in height.',
    simulationType: 'plant-tissues',
    variables: [
      {
        id: 'pectinCornerThicknessUm',
        name: 'Pectin Corner Wall Thickness',
        symbol: 't_{\\text{pectin}}',
        unit: 'µm',
        min: 1,
        max: 8,
        step: 0.5,
        defaultValue: 4.5,
        description: 'Corner wall thickness providing high bending and tensile resistance.',
      },
    ],
    prediction: {
      prompt: 'NCERT Plant Bending Without Breaking Inquiry',
      scenario:
        'During a gusty summer thunderstorm, the long slender stalk (petiole) of a leaf and young climber tendrils bend violently in the wind yet do not snap. Which tissue is responsible?',
      choices: [
        {
          id: 'p1',
          text: 'Parenchyma, because it has thin soft walls.',
          isCorrect: false,
          misconceptionExplanation: 'Thin-walled parenchyma would rupture under severe bending stress.',
        },
        {
          id: 'p2',
          text: 'Collenchyma, which provides mechanical flexibility and elasticity due to thickened pectin corners.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Xylem vessels, which are hollow empty pipes.',
          isCorrect: false,
          misconceptionExplanation: 'Xylem provides rigid compressive support in wood, but petiole flexibility is mediated by sub-epidermal collenchyma.',
        },
      ],
      correctExplanation:
        'Collenchyma tissue is strategically situated in the hypodermis of leaf petioles and climbing tendrils. Its living elongated cells with localized pectin-cellulose corner thickenings provide remarkable mechanical elasticity, allowing herbaceous plant parts to bend dramatically under storm winds without breaking.',
      relevantFormula: '\\text{Mechanical Flexibility} = \\text{Living Collenchyma with Pectin Thickenings}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-simple-permanent-parenchyma', name: 'Parenchyma & Modifications', subject: 'biology' },
      { id: 'ncert9-bio-sclerenchyma-lignified-tissue', name: 'Sclerenchyma Tissue', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Celery Ribs and Strings',
        description: 'The crunchy, fibrous external ribs peeled from celery stalks are bundles of living collenchyma strands reinforcing the stem.',
      },
      {
        title: 'Pea and Grapevine Climbing Tendrils',
        description: 'Tendril tips coiling tightly around garden wire fences rely on flexible collenchyma cords to support climbing vine mass.',
      },
      {
        title: 'Sunflower Head Tracking the Sun',
        description: 'Heliotropic movement of blooming sunflower heads bending towards daily sunlight is cushioned by collenchyma tissue.',
      },
    ],
  },

  {
    id: 'ncert9-bio-sclerenchyma-lignified-tissue',
    title: 'Sclerenchyma: Dead Lignified Tissue for Rigidity & Protection',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Lignin cement, thick secondary walls, narrow lumen, sclerenchyma fibers and stone sclereids',
    description:
      'Sclerenchyma is the principal permanent tissue that makes plants hard, stiff, and tough. Characteristics: cells are dead at functional maturity, long, narrow, with heavily thickened secondary cell walls impregnated with Lignin (a complex rigid waterproof chemical cement). There are no intercellular spaces, and the internal cell cavity (lumen) is extremely narrow with pit canals. Two forms: (1) Sclerenchyma Fibers: long slender strands (e.g. husk of coconut, hemp, jute); (2) Sclereids (Stone Cells): irregular gritty cells found in walnut shells, almond hulls, and the gritty flesh of pear fruits.',
    formulaLaTeX: '\\text{Secondary Wall} = \\text{Cellulose Microfibrils} + \\text{Lignin Polymer Matrix} \\quad (\\text{Lumen} \\to 0, \\text{ Cell Dead})',
    formulaExplanation:
      'Lignin acts as nature’s reinforced concrete: cellulose microfibrils act like steel rebar, and lignin acts as the surrounding rigid stone matrix.',
    simulationType: 'plant-tissues',
    variables: [
      {
        id: 'ligninContentPercent',
        name: 'Lignin Deposition Fraction',
        symbol: '\\%_{\\text{lignin}}',
        unit: '%',
        min: 20,
        max: 80,
        step: 5,
        defaultValue: 60,
        description: 'High lignin content confers extreme hardness and pest resistance.',
      },
    ],
    prediction: {
      prompt: 'NCERT Husk of Coconut Tissue Identification',
      scenario:
        'The outer fibrous husk of a coconut (coir) is notoriously tough, dry, and difficult to pull apart. Which plant tissue constitutes the husk of a coconut?',
      choices: [
        {
          id: 'p1',
          text: 'Living Collenchyma with green chlorophyll.',
          isCorrect: false,
          misconceptionExplanation: 'Collenchyma is living and flexible, whereas coconut husk is composed of dead, extremely rigid fibers.',
        },
        {
          id: 'p2',
          text: 'Sclerenchyma fibers with thick, heavily lignified cell walls and dead protoplasts.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Aerenchyma with large air bubbles.',
          isCorrect: false,
          misconceptionExplanation: 'Aerenchyma is soft living tissue found in water plants, not fibrous nut coverings.',
        },
      ],
      correctExplanation:
        'The fibrous husk of a coconut (mesocarp) is made of elongated, dead Sclerenchyma fibers. The cell walls are heavily thickened with lignin polymer, leaving no internal cytoplasm or lumen. This provides the coconut seed with armor-like protection while floating across ocean saltwater for months.',
      relevantFormula: '\\text{Coconut Husk (Coir)} = \\text{Dead Sclerenchymatous Lignified Fibers}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-collenchyma-mechanical-support', name: 'Collenchyma Tissue', subject: 'biology' },
      { id: 'ncert9-bio-complex-tissue-xylem', name: 'Complex Tissue: Xylem', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Coir Doormats, Ropes & Mattresses',
        description: 'Coconut sclerenchyma fibers are harvested commercially for biodegradable marine ropes, erosion-control netting, and springy mattress padding.',
      },
      {
        title: 'Walnut & Pistachio Hard Shells',
        description: 'Cracking a walnut requires heavy force because the shell is an interlocking mosaic of dense sclereid stone cells.',
      },
      {
        title: 'Gritty Texture When Eating Pears',
        description: 'The distinctive crunchy grit in pear fruit flesh comes from clusters of microscopic sclereid stone cells with lignified walls.',
      },
    ],
  },

  {
    id: 'ncert9-bio-protective-tissue-stomata-cork',
    title: 'Protective Plant Tissues: Epidermis, Stomata & Suberized Cork',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Waxy cuticle, stomatal guard cells regulating transpiration, and protective dead cork with suberin',
    description:
      'Protective tissues shield plants against mechanical injury, pathogen invasion, and water desiccation: (1) Epidermis: outermost single continuous layer of cells without intercellular spaces, coated with a waxy, water-resistant Cuticle layer (secreted cutin). Desert xerophytes have a thick waxy cuticle to prevent desiccation; (2) Stomata: tiny microscopic pores on the leaf epidermis, enclosed by two kidney-shaped (dicots) or dumbbell-shaped (grasses) Guard Cells. Guard cells regulate stomatal opening for photosynthetic gaseous exchange (CO₂/O₂) and Transpiration (cooling and pulling sap up); (3) Cork / Phellem: in mature woody trees, peripheral secondary cambium forms dead, multi-layered cork cells impregnated with Suberin, a waxy chemical impermeable to water and gases.',
    formulaLaTeX: '\\text{Transpiration Pull } \\Delta P = \\frac{2 \\gamma \\cos\\theta}{r} \\quad | \\quad \\text{Cork Impermeability} \\propto \\text{Suberin Deposition}',
    formulaExplanation:
      'When guard cells absorb water by endosmosis, they swell and curve outwards, opening the stomatal aperture. When water is lost, they become flaccid and close.',
    simulationType: 'plant-tissues',
    variables: [
      {
        id: 'stomatalDensityPerMm2',
        name: 'Stomatal Density on Lower Leaf',
        symbol: 'D_{\\text{stomata}}',
        unit: 'pores/mm²',
        min: 50,
        max: 500,
        step: 25,
        defaultValue: 250,
        description: 'Typically higher on lower leaf epidermis to minimize direct solar evaporative loss.',
      },
      {
        id: 'corkLayerCount',
        name: 'Dead Cork Cell Layers',
        symbol: 'N_{\\text{cork}}',
        unit: 'layers',
        min: 5,
        max: 50,
        step: 5,
        defaultValue: 20,
        description: 'Multi-tiered dead bark layer protecting underlying phloem against pests.',
      },
    ],
    prediction: {
      prompt: 'NCERT Cork Suberin & Tree Bark Inquiry',
      scenario:
        'Why are wine bottle cork stoppers and the outer bark of mature trees completely impervious to gas leaks and liquid penetration?',
      choices: [
        {
          id: 'p1',
          text: 'Because cork cells are living and actively drink any liquid that touches them.',
          isCorrect: false,
          misconceptionExplanation: 'Cork cells are completely dead with no protoplasm or active metabolic transport.',
        },
        {
          id: 'p2',
          text: 'Because the walls of dead cork cells contain a waxy chemical substance called Suberin that makes them impermeable to water and gases.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Because trees coat their bark with molten plastic polymers.',
          isCorrect: false,
          misconceptionExplanation: 'Suberin is a natural biological lipid-polymer synthesized by the cork cambium, not artificial plastic.',
        },
      ],
      correctExplanation:
        'As trees mature, the secondary cork cambium produces layers of dead, compactly arranged cork cells without intercellular spaces. Their cell walls are heavily impregnated with Suberin—a waxy, hydrophobic chemical substance that renders bark waterproof, gas-tight, fire-retardant, and pest-resistant.',
      relevantFormula: '\\text{Cork Cell Wall} + \\text{Suberin} \\implies \\text{Zero Water & Gas Permeability}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-complex-tissue-xylem', name: 'Complex Tissue: Xylem', subject: 'biology' },
      { id: 'ncert9-bio-simple-permanent-parenchyma', name: 'Simple Permanent Tissues', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Commercial Wine Bottle Stoppers',
        description: 'Harvested from the bark of the Mediterranean Cork Oak (*Quercus suber*), suberized cork seals wine bottles without contaminating flavor.',
      },
      {
        title: 'Desert Cactus Cuticle Armor',
        description: 'Cacti have an ultra-thick waxy cuticle and sunken stomata that open only at night (CAM photosynthesis) to survive scorching desert droughts.',
      },
      {
        title: 'Transpiration Stream Cooling of Trees',
        description: 'Evaporative water loss through stomata cools leaf temperatures by up to 5°C on hot summer afternoons, preventing enzyme heat denaturation.',
      },
    ],
  },

  {
    id: 'ncert9-bio-complex-tissue-xylem',
    title: 'Complex Permanent Tissue: Xylem Conducting Elements',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Tracheids, vessels, xylem parenchyma, xylem fibres: unidirectional sap conduction',
    description:
      'Complex tissues are composed of more than one type of cell working together as a coordinated unit. Xylem (wood) is the water-conducting vascular tissue responsible for unidirectional transport of water and dissolved mineral ions from roots upward to leaves. Four constituent elements: (1) Tracheids: dead, elongated tubular cells with tapering ends and lignified walls with pits; (2) Vessels: long, continuous open-ended hollow tubes formed of vertical rows of cylindrical cells with dissolved end walls, enabling rapid bulk sap flow; (3) Xylem Parenchyma: the ONLY living element in xylem, stores starch/lipids and assists in sideways lateral water conduction; (4) Xylem Fibres: dead, heavily lignified supportive cells providing mechanical rigidity.',
    formulaLaTeX: 'J_v = -\\frac{\\pi r^4}{8 \\eta} \\frac{dP}{dx} \\quad (\\text{Poiseuille’s Law in Xylem Vessels}) \\quad | \\quad \\text{Conduction: Unidirectional (Roots } \\to \\text{ Leaves)}',
    formulaExplanation:
      'Continuous capillary columns of water are pulled upward through xylem vessels by negative hydrostatic suction generated by leaf stomatal transpiration (Transpiration Pull).',
    simulationType: 'plant-tissues',
    variables: [
      {
        id: 'vesselLumenRadiusUm',
        name: 'Xylem Vessel Radius (r)',
        symbol: 'r_{\\text{vessel}}',
        unit: 'µm',
        min: 15,
        max: 100,
        step: 5,
        defaultValue: 40,
        description: 'Volume flow rate scales with the 4th power of radius (r⁴).',
      },
      {
        id: 'transpirationPullAtm',
        name: 'Transpiration Pull Tension',
        symbol: '\\Delta P',
        unit: 'atm',
        min: 2,
        max: 30,
        step: 2,
        defaultValue: 15,
        description: 'Negative tension pulling continuous water columns up tall forest canopies.',
      },
    ],
    prediction: {
      prompt: 'NCERT Living vs Dead Xylem Element Identification',
      scenario:
        'Out of the four constituent cellular elements of xylem tissue (Tracheids, Vessels, Xylem Parenchyma, and Xylem Fibres), which is the ONLY living cell type?',
      choices: [
        {
          id: 'p1',
          text: 'Vessels, because they pump water continuously.',
          isCorrect: false,
          misconceptionExplanation: 'Vessels are hollow dead pipes without cytoplasm; water is pulled passively by transpiration.',
        },
        {
          id: 'p2',
          text: 'Xylem Parenchyma, which retains active cytoplasm, nucleus, and stores starch.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Tracheids, because they have tapered ends.',
          isCorrect: false,
          misconceptionExplanation: 'Tracheids lose their protoplast at maturity and are completely dead.',
        },
      ],
      correctExplanation:
        'In xylem tissue, Tracheids, Vessels, and Xylem Fibres are all dead elements with thick lignified walls. Xylem Parenchyma is the only living cell component, carrying living cytoplasm, nucleus, and starch reserves to maintain cell viability and assist in lateral ray conduction of water.',
      relevantFormula: '\\text{Xylem Cellular Status: } 3 \\text{ Dead (Tracheids, Vessels, Fibres)} + 1 \\text{ Living (Parenchyma)}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-complex-tissue-phloem', name: 'Complex Tissue: Phloem', subject: 'biology' },
      { id: 'ncert9-bio-protective-tissue-stomata-cork', name: 'Protective Plant Tissues', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Eosin Dye Staining in Carnation Stems',
        description: 'Placing a white carnation flower stem into red eosin dye shows petals turning red as dye climbs through xylem vessels in hours.',
      },
      {
        title: 'Wood Pulp for Paper Manufacturing',
        description: 'Lignified xylem tracheids and fibers harvested from pine trees are processed into cellulose pulp to make writing paper.',
      },
      {
        title: 'Sap Ascent in 100-Meter Sequoia Redwoods',
        description: 'Cohesion-tension theory in unbroken xylem vessel water columns overcomes gravity to lift hundreds of liters of water to treetop leaves daily.',
      },
    ],
  },

  {
    id: 'ncert9-bio-complex-tissue-phloem',
    title: 'Complex Permanent Tissue: Phloem Translocation Elements',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Sieve tubes, companion cells, phloem parenchyma, phloem fibres: bidirectional sucrose transport',
    description:
      'Phloem is the food-conducting vascular tissue that translocates organic nutrients (photosynthetic sucrose sugars, amino acids, hormones) bidirectionally from source leaves to storage sinks (roots, fruits, buds). Four constituent elements: (1) Sieve Tubes: tubular cells with perforated end walls called Sieve Plates; mature sieve cells have peripheral cytoplasm and large vacuole but lack a nucleus; (2) Companion Cells: specialized living parenchymatous cells with dense cytoplasm and large active nuclei connected to sieve tubes via plasmodesmata, providing metabolic control; (3) Phloem Parenchyma: living storage cells; (4) Phloem Fibres (Bast Fibres): the ONLY dead elements in phloem, providing mechanical tensile strength (e.g. commercial jute, flax, hemp). Unlike xylem, phloem transport is active (requires ATP energy) and bidirectional.',
    formulaLaTeX: '\\text{Translocation: } \\text{Source (Leaves)} \\underset{\\text{Bidirectional (Requires ATP)}}{\\overset{\\text{High Osmotic Pressure}}{\\rightleftharpoons}} \\text{Sink (Roots / Buds / Fruits)}',
    formulaExplanation:
      'ATP energy loads sucrose into sieve tubes, drawing water by osmosis and generating high hydrostatic pressure that pushes sap to lower-pressure sink regions (Münch Pressure Flow).',
    simulationType: 'plant-tissues',
    variables: [
      {
        id: 'sucroseConcentrationMmol',
        name: 'Phloem Sap Sucrose Concentration',
        symbol: 'C_{\\text{sucrose}}',
        unit: 'mmol/L',
        min: 100,
        max: 1000,
        step: 50,
        defaultValue: 600,
        description: 'Dense sugar syrup translocated through sieve tubes to feed growing tissues.',
      },
    ],
    prediction: {
      prompt: 'NCERT Xylem vs Phloem Directionality & Vitality Contrast',
      scenario:
        'Which pair correctly distinguishes the direction of transport and cellular vitality between Xylem and Phloem tissues?',
      choices: [
        {
          id: 'p1',
          text: 'Xylem is bidirectional with living vessels; Phloem is unidirectional with dead sieve tubes.',
          isCorrect: false,
          misconceptionExplanation: 'Xylem conduction is strictly unidirectional (upwards) and vessels are dead; phloem transport is bidirectional and sieve tubes are living.',
        },
        {
          id: 'p2',
          text: 'Xylem transport is strictly unidirectional (upward) with mostly dead elements; Phloem transport is bidirectional with mostly living elements.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Both xylem and phloem transport sap exclusively downward toward the soil.',
          isCorrect: false,
          misconceptionExplanation: 'Water climbs upward in xylem from roots; phloem sends food both downward to roots and upward to growing fruits/buds.',
        },
      ],
      correctExplanation:
        'Xylem conducts water and minerals unidirectionally from roots upward to shoots, composed of 3 dead elements and only 1 living (xylem parenchyma). Phloem translocates photosynthesized food bidirectionally according to plant demand, composed of 3 living elements (sieve tubes, companion cells, phloem parenchyma) and only 1 dead (phloem fibers).',
      relevantFormula: '\\text{Xylem = Unidirectional (Upward), 3 Dead : 1 Living} \\quad \\& \\quad \\text{Phloem = Bidirectional, 3 Living : 1 Dead}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-complex-tissue-xylem', name: 'Complex Tissue: Xylem', subject: 'biology' },
      { id: 'ncert9-bio-tissues-division-of-labour', name: 'Concept of Tissues', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Tree Bark Girdling / Ringing Experiment',
        description: 'Removing a complete ring of bark (containing phloem) causes sugar to accumulate above the cut, eventually starving and killing roots below.',
      },
      {
        title: 'Commercial Jute & Linen Fibers',
        description: 'Commercial jute and linen textiles are obtained by retting the dead phloem bast fibers of Corchorus and Linum stems.',
      },
      {
        title: 'Aphids Tapping Phloem Sap',
        description: 'Aphid insects insert needle-like stylets into individual sieve tubes, letting pressurized phloem sugar sap flow directly into their guts.',
      },
    ],
  },

  {
    id: 'ncert9-bio-animal-epithelial-tissues',
    title: 'Animal Epithelial Tissues: Protective Sheets & Coverings',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Simple squamous, stratified squamous skin, cuboidal tubules, ciliated columnar, and glandular epithelium',
    description:
      'Epithelial tissue is the protective covering and lining tissue of animal bodies, packed tightly with minimal extracellular matrix, resting on an acellular fibrous Basement Membrane. Five major classifications: (1) Simple Squamous: ultra-thin, flat, tile-like cells forming delicate diffusion boundaries (lung alveoli, blood vessel endothelia); (2) Stratified Squamous: multiple layers of flattened cells resisting wear, tear, and abrasion (skin epidermis); (3) Cuboidal: cube-like cells providing mechanical support and absorption/secretion (kidney tubules, salivary gland ducts); (4) Columnar: tall pillar-like cells facilitating absorption (stomach and intestinal linings); (5) Ciliated Columnar: columnar cells bearing hair-like cilia that beat rhythmically to move mucus forward (respiratory tract); (6) Glandular: epithelial cells folding inward to secrete chemicals (sweat, enzymes, milk).',
    formulaLaTeX: '\\text{Diffusion Flux } J \\propto \\frac{1}{\\Delta x_{\\text{squamous}}} \\quad | \\quad \\text{Abrasion Resistance} \\propto N_{\\text{stratified layers}}',
    formulaExplanation:
      'Lung alveoli have simple squamous epithelium (~0.2 µm thick) to maximize oxygen diffusion speed, while skin has 30 layers of stratified squamous cells to block friction and pathogens.',
    simulationType: 'animal-tissues',
    variables: [
      {
        id: 'epithelialLayerThicknessUm',
        name: 'Epithelium Thickness',
        symbol: '\\Delta x',
        unit: 'µm',
        min: 0.5,
        max: 50,
        step: 2,
        defaultValue: 1.0,
        description: 'Thin (0.5-2 µm) for alveolar diffusion; thick (20-50 µm) for stratified protective skin.',
      },
    ],
    prediction: {
      prompt: 'NCERT Epithelial Tissue Matching Challenge',
      scenario:
        'Which specific epithelial tissue lines the human respiratory tract (windpipe / trachea), beating its microscopic hair-like surface projections rhythmically to propel trapped dust and mucus toward the throat?',
      choices: [
        {
          id: 'p1',
          text: 'Stratified squamous keratinized epithelium',
          isCorrect: false,
          misconceptionExplanation: 'Stratified squamous epithelium forms skin to resist external abrasion; it has no hair-like cilia.',
        },
        {
          id: 'p2',
          text: 'Ciliated columnar epithelium',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Simple cuboidal epithelium',
          isCorrect: false,
          misconceptionExplanation: 'Cuboidal epithelium lines kidney nephron tubules for absorption, not the respiratory windpipe.',
        },
      ],
      correctExplanation:
        'The human respiratory tract is lined by Ciliated Columnar Epithelium. Its cells bear hundreds of microscopic hair-like Cilia on their outer apical surface. Synchronized rhythmic ciliary beating sweeps inhaled dust particles, bacteria, and trapped mucus upward out of the lungs toward the pharynx to be swallowed or coughed out.',
      relevantFormula: '\\text{Tracheal Mucociliary Escalator} = \\text{Ciliated Columnar Epithelium}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-animal-connective-tissues', name: 'Animal Connective Tissues', subject: 'biology' },
      { id: 'ncert9-bio-animal-muscular-tissues', name: 'Animal Muscular Tissues', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Smoker’s Cough and Ciliary Paralysis',
        description: 'Chemicals in tobacco smoke paralyze and destroy tracheal cilia, forcing smokers to cough forcefully to clear congested bronchial mucus.',
      },
      {
        title: 'Endoscopy of Stomach Lining',
        description: 'Gastroenterologists inspect the simple columnar epithelium of the gastric mucosa, which secretes protective alkaline mucus against digestive stomach acid.',
      },
      {
        title: 'Keratinized Stratified Skin Shield',
        description: 'Dead keratinized stratified squamous skin cells constantly shed and regenerate, preventing bacterial penetration into subcutaneous blood vessels.',
      },
    ],
  },

  {
    id: 'ncert9-bio-animal-connective-tissues',
    title: 'Animal Connective Tissues: Blood, Bone, Cartilage, Tendons & Ligaments',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Extracellular matrix, blood fluid plasma, rigid bone, flexible cartilage, tendons (muscle-to-bone), ligaments (bone-to-bone)',
    description:
      'Connective tissue connects, supports, binds, and cushions different organs, characterized by loosely spaced living cells embedded in an abundant intercellular Matrix (fluid, jelly-like, dense, or rigid). Classifications: (1) Blood (Fluid Connective Tissue): liquid plasma matrix containing suspended RBCs (erythrocytes, transport O₂), WBCs (leukocytes, immune defense), and Platelets (thrombocytes, blood clotting); (2) Bone: rigid, porous non-flexible framework of osteocyte cells embedded in a hard matrix of Calcium and Phosphorus compounds; (3) Cartilage: flexible tissue with widely spaced chondrocytes embedded in a solid matrix of proteins and sugars (ear pinna, nose tip, trachea rings, joints); (4) Ligaments: dense regular connective tissue connecting Bone to Bone, very elastic with high tensile strength; (5) Tendons: fibrous tissue connecting Muscle to Bone, great strength with limited flexibility; (6) Areolar: packaging and repair tissue beneath skin filling spaces between organs; (7) Adipose: fat-storing tissue packed with adipocytes under the skin and around kidneys, acting as a thermal insulator.',
    formulaLaTeX: '\\text{Ligament} = \\text{Bone-to-Bone (Elastic)} \\quad | \\quad \\text{Tendon} = \\text{Muscle-to-Bone (High Strength, Limited Elasticity)}',
    formulaExplanation:
      'Osteocytes inhabit concentric lacunae connected by canaliculi, secreting hydroxyapatite mineral crystals (Ca₁₀(PO₄)₆(OH)₂) that grant bones high compressive strength.',
    simulationType: 'animal-tissues',
    variables: [
      {
        id: 'matrixMineralizationPercent',
        name: 'Extracellular Matrix Mineralization',
        symbol: '\\%_{\\text{mineral}}',
        unit: '%',
        min: 0,
        max: 70,
        step: 5,
        defaultValue: 65,
        description: '0% in liquid blood plasma, ~10% in pliable cartilage, ~65% in rigid load-bearing bone.',
      },
    ],
    prediction: {
      prompt: 'NCERT Tendon vs Ligament Clinical Distinction',
      scenario:
        'An athlete twists his knee during a soccer match and sprains the connective band joining his femur thigh bone to his tibia shin bone. Which specific tissue was sprained?',
      choices: [
        {
          id: 'p1',
          text: 'Tendon, which joins bone to bone.',
          isCorrect: false,
          misconceptionExplanation: 'A tendon connects muscle to bone (such as the Achilles tendon). Ligaments connect bone to bone.',
        },
        {
          id: 'p2',
          text: 'Ligament, which is an elastic connective tissue connecting bone to bone.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Areolar tissue, which converts into fat cells under stress.',
          isCorrect: false,
          misconceptionExplanation: 'Joint stability is maintained by dense regular ligament bands, not subcutaneous areolar tissue.',
        },
      ],
      correctExplanation:
        'A Ligament is a specialized dense connective tissue that connects Bone to Bone across joints. It has high elasticity and considerable strength. Excessive twisting of joints stretches or tears these fibrous ligament cords, causing an acute joint sprain. Tendons, by contrast, connect Skeletal Muscle to Bone.',
      relevantFormula: '\\text{Sprain} = \\text{Ligament (Bone-to-Bone Injury)} \\quad | \\quad \\text{Strain} = \\text{Tendon/Muscle Injury}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-animal-muscular-tissues', name: 'Animal Muscular Tissues', subject: 'biology' },
      { id: 'ncert9-bio-animal-epithelial-tissues', name: 'Animal Epithelial Tissues', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Achilles Tendon Rupture in Athletes',
        description: 'The thickest tendon in the human body connects calf gastrocnemius muscles to the calcaneus heel bone, transmitting sprint propulsion force.',
      },
      {
        title: 'Blood Clotting & Hemophilia',
        description: 'When blood vessels tear, platelet cells in the plasma matrix aggregate and trigger fibrin mesh nets to halt life-threatening hemorrhage.',
      },
      {
        title: 'Adipose Tissue in Arctic Polar Bears',
        description: 'A 10 cm layer of subcutaneous blubber (adipose tissue) insulates polar bears against sub-zero Arctic temperatures while storing metabolic energy.',
      },
    ],
  },

  {
    id: 'ncert9-bio-animal-muscular-tissues',
    title: 'Animal Muscular Tissues: Striated, Smooth & Cardiac Muscles',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Voluntary skeletal multinucleated fibers, involuntary visceral smooth fibers, and rhythmic branched cardiac fibers',
    description:
      'Muscular tissue consists of elongated cells called Muscle Fibers containing specialized contractile proteins (actin and myosin) that contract and relax to generate bodily movement. Three distinct types: (1) Striated / Skeletal Muscle: voluntary, cylindrical, unbranched, multinucleated fibers attached to skeleton; show alternate light and dark transverse bands/striations; contract rapidly and fatigue easily; (2) Smooth / Unstriated Muscle: involuntary, spindle-shaped (tapered ends), uninucleated fibers without striations; found in internal visceral organs (alimentary canal peristalsis, blood vessels, iris of the eye, ureters); contract slowly without fatigue; (3) Cardiac Muscle: involuntary muscle found exclusively in the heart wall; cylindrical, branched, uninucleated fibers connected by intercalated discs; contract and relax rhythmically throughout life without ever fatiguing.',
    formulaLaTeX: '\\text{Contraction: } \\text{Actin} + \\text{Myosin} + \\text{ATP} + \\text{Ca}^{2+} \\xrightarrow{\\text{Cross-Bridge Cycling}} \\text{Tension} + \\text{Shortening}',
    formulaExplanation:
      'Intercalated discs in cardiac muscle contain low-resistance gap junctions that transmit electrical action potentials instantly across all heart fibers, enabling synchronized pumping.',
    simulationType: 'animal-tissues',
    variables: [
      {
        id: 'contractionRateBpm',
        name: 'Rhythmic Contraction Velocity',
        symbol: 'v_{\\text{contract}}',
        unit: 'beats/min',
        min: 40,
        max: 180,
        step: 5,
        defaultValue: 72,
        description: 'Cardiac pacemaker rate maintaining continuous blood circulation.',
      },
    ],
    prediction: {
      prompt: 'NCERT Muscle Classification Deduction',
      scenario:
        'A histologist observes muscle fibers under a microscope and notes: (1) The cells are cylindrical and branched, (2) Each cell has a single centrally located nucleus, (3) Cells are interconnected by dark intercalated discs, and (4) They show rhythmic contractions without fatigue. What muscle type is this?',
      choices: [
        {
          id: 'p1',
          text: 'Skeletal / Striated voluntary muscle of the biceps arm.',
          isCorrect: false,
          misconceptionExplanation: 'Skeletal muscle fibers are unbranched and multinucleated, and fatigue rapidly.',
        },
        {
          id: 'p2',
          text: 'Smooth muscle of the stomach intestinal wall.',
          isCorrect: false,
          misconceptionExplanation: 'Smooth muscle cells are spindle-shaped with tapered ends and lack striations or intercalated discs.',
        },
        {
          id: 'p3',
          text: 'Cardiac muscle of the human heart wall.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
      ],
      correctExplanation:
        'Cardiac muscle is unique to the heart: its fibers are cylindrical, branched, uninucleated, and feature specialized intercalated discs with gap junctions that allow electrical signals to spread across the entire myocardium for synchronized, fatigue-free lifetime pumping.',
      relevantFormula: '\\text{Cardiac Muscle} = \\text{Involuntary} + \\text{Branched} + \\text{Uninucleated} + \\text{Intercalated Discs} + \\text{Non-fatiguing}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-animal-connective-tissues', name: 'Animal Connective Tissues', subject: 'biology' },
      { id: 'ncert9-bio-nervous-tissue-neuron', name: 'Nervous Tissue & Neurons', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Peristalsis in the Digestive Esophagus',
        description: 'Involuntary smooth muscle sheets contract in sequential waves to push swallowed food boluses into the stomach even when standing upside down.',
      },
      {
        title: 'Lactic Acid Muscle Cramps After Sprinting',
        description: 'Skeletal muscle fibers undergoing anaerobic glycolysis accumulate lactic acid, causing painful temporary muscle fatigue.',
      },
      {
        title: 'Cardiac Defibrillators in Heart Attacks',
        description: 'Electrical shock pads reset chaotic uncoordinated cardiac muscle twitches (ventricular fibrillation), restoring rhythmic pacemaker contractions.',
      },
    ],
  },

  {
    id: 'ncert9-bio-nervous-tissue-neuron',
    title: 'Nervous Tissue: Structure & Function of a Multipolar Neuron',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Cyton/cell body, receptive dendrites, transmitting axon, myelin sheath, and synaptic neurotransmission',
    description:
      'Nervous tissue is highly specialized to receive stimuli and transmit electrochemical impulses rapidly throughout the body, constituting the Brain, Spinal Cord, and Peripheral Nerves. The structural and functional unit is the Neuron (nerve cell), which can reach over one meter in length. Neuron anatomy: (1) Cyton (Cell Body / Soma): contains a large central nucleus and granular cytoplasm with Nissl granules; (2) Dendrites: short, branching cytoplasmic projections that receive incoming stimuli; (3) Axon: single long, slender cylindrical process that conducts impulses away from the cell body toward target cells; (4) Myelin Sheath: insulating lipid wrapping punctuated by Nodes of Ranvier, accelerating impulse conduction; (5) Synapse: microscopic functional junction where neurotransmitter chemicals transmit signals from the axon terminal of one neuron to the dendrite of the next.',
    formulaLaTeX: 'v_{\\text{nerve}} \\propto d_{\\text{axon}} \\times \\text{Myelination} \\quad (\\text{Up to } 120\\text{ m/s via Saltatory Conduction})',
    formulaExplanation:
      'Myelinated axons permit nerve impulses to jump rapidly from one Node of Ranvier to the next (saltatory conduction), accelerating reaction times.',
    simulationType: 'animal-tissues',
    variables: [
      {
        id: 'axonLengthCm',
        name: 'Axon Length',
        symbol: 'L_{\\text{axon}}',
        unit: 'cm',
        min: 1,
        max: 100,
        step: 5,
        defaultValue: 60,
        description: 'Motor neurons extending from spinal cord to foot muscles can exceed 100 cm (1 meter).',
      },
      {
        id: 'conductionVelocityMs',
        name: 'Impulse Conduction Velocity',
        symbol: 'v_{\\text{impulse}}',
        unit: 'm/s',
        min: 1,
        max: 120,
        step: 5,
        defaultValue: 80,
        description: 'Saltatory action potential propagation across myelinated axon nodes.',
      },
    ],
    prediction: {
      prompt: 'NCERT Direction of Nerve Impulse Inquiry',
      scenario:
        'In which correct sequence does an electrical signal travel through the anatomical parts of an individual neuron?',
      choices: [
        {
          id: 'p1',
          text: 'Axon terminal → Axon → Cyton (cell body) → Dendrite.',
          isCorrect: false,
          misconceptionExplanation: 'This is backward; dendrites are the receiving antennas and axons are the transmitting output cables.',
        },
        {
          id: 'p2',
          text: 'Dendrite → Cyton (cell body) → Axon → Axon terminal (Synapse).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Myelin sheath → Nucleus → Dendrite → Axon.',
          isCorrect: false,
          misconceptionExplanation: 'The myelin sheath is an electrical insulator surrounding the axon, not a signal receptor.',
        },
      ],
      correctExplanation:
        'Incoming biological stimuli are captured by the branched receptive Dendrites, converge at the Cyton (cell body), initiate an action potential at the axon hillock, and propagate down the long insulated Axon to reach the Axon Terminals, releasing neurotransmitter molecules across the synaptic cleft.',
      relevantFormula: '\\text{Direction of Nerve Impulse: } \\text{Dendrite} \\longrightarrow \\text{Cyton} \\longrightarrow \\text{Axon} \\longrightarrow \\text{Synapse}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-animal-muscular-tissues', name: 'Animal Muscular Tissues', subject: 'biology' },
      { id: 'ncert9-bio-tissues-division-of-labour', name: 'Concept of Tissues', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Withdrawal Reflex from Touching Hot Utensils',
        description: 'Sensory skin receptors trigger impulses through sensory neurons to spinal cord interneurons, contracting arm muscles in under 50 milliseconds.',
      },
      {
        title: 'Multiple Sclerosis (Autoimmune Demyeleination)',
        description: 'Autoimmune destruction of insulating myelin sheaths on central nervous axons halts impulse conduction, causing muscular weakness and vision loss.',
      },
      {
        title: 'Local Dental Anesthesia (Novocaine)',
        description: 'Dentists inject sodium-channel blockers that halt nerve impulse firing along sensory facial axons, making tooth extractions completely painless.',
      },
    ],
  },

  // =========================================================================
  // CHAPTER 12: IMPROVEMENT IN FOOD RESOURCES
  // =========================================================================
  {
    id: 'ncert9-bio-crop-nutrient-management',
    title: 'Crop Nutrient Management: Macronutrients, Micronutrients, Manure & Fertilizers',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: '16 essential plant nutrients, soil humus, organic manure vs chemical NPK fertilizers',
    description:
      'Plants require 16 essential mineral nutrients: 3 from air/water (Carbon, Hydrogen, Oxygen); 6 Macronutrients required in large quantities from soil: Nitrogen (N), Phosphorus (P), Potassium (K), Calcium (Ca), Magnesium (Mg), Sulfur (S); 7 Micronutrients required in trace quantities: Iron (Fe), Manganese (Mn), Boron (B), Zinc (Zn), Copper (Cu), Molybdenum (Mo), Chlorine (Cl). Nutrient Replenishment: (1) Manure: prepared by decomposing animal excreta and plant waste; enriches soil with organic matter (Humus), improves soil water-holding capacity, and nurtures soil microbes; (2) Chemical Fertilizers: commercially manufactured inorganic mineral salts rich in N, P, and K; ensure high vegetative growth and rapid crop yields, but excessive use destroys soil structure, causes soil salinization, and triggers eutrophication in nearby water bodies.',
    formulaLaTeX: '\\text{16 Essential Nutrients} = [\\text{Air: C, O}] + [\\text{Water: H}] + [\\text{6 Macro: N, P, K, Ca, Mg, S}] + [\\text{7 Micro: Fe, Mn, B, Zn, Cu, Mo, Cl}]',
    formulaExplanation:
      'Excessive chemical nitrogen fertilizer runoff into rivers causes algal blooms that consume dissolved oxygen, suffocating aquatic fish populations (Eutrophication).',
    simulationType: 'food-resources-crops',
    variables: [
      {
        id: 'humusOrganicPercent',
        name: 'Soil Humus Fraction',
        symbol: '\\%_{\\text{humus}}',
        unit: '%',
        min: 1,
        max: 15,
        step: 1,
        defaultValue: 5,
        description: 'Organic compost humus increases water retention in sandy soils and aeration in clay.',
      },
      {
        id: 'npkDosageKgHa',
        name: 'NPK Fertilizer Application Rate',
        symbol: 'D_{\\text{NPK}}',
        unit: 'kg/ha',
        min: 20,
        max: 300,
        step: 20,
        defaultValue: 120,
        description: 'Optimal balanced fertilizer dosing maximizes grain yield without toxic runoff.',
      },
    ],
    prediction: {
      prompt: 'NCERT Manure vs Chemical Fertilizer Contrast',
      scenario:
        'A farmer repeatedly applies heavy chemical NPK fertilizers year after year without adding any organic compost or cow dung manure. What happens to the soil over a decade?',
      choices: [
        {
          id: 'p1',
          text: 'The soil turns into pure gold minerals and crop yield multiplies forever.',
          isCorrect: false,
          misconceptionExplanation: 'Chemical fertilizers provide mineral ions but zero organic matter, destroying soil fertility over time.',
        },
        {
          id: 'p2',
          text: 'The soil loses its organic humus, beneficial earthworms/microbes die out, and soil becomes compacted and salinized.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'The soil converts into sandy ocean water.',
          isCorrect: false,
          misconceptionExplanation: 'Soil degrades into infertile saline crusted dirt, not an ocean.',
        },
      ],
      correctExplanation:
        'Chemical fertilizers supply immediate inorganic ions (N, P, K) but zero organic matter (humus). Continuous heavy application without manure acidifies or salinizes the soil, kills beneficial nitrogen-fixing soil microorganisms and earthworms, degrades soil pore structure, and reduces long-term fertility.',
      relevantFormula: '\\text{Sustainable Soil Health} = \\text{Organic Manure (Humus & Microbes)} + \\text{Judicious Minimal Fertilizers}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-cropping-patterns-irrigation', name: 'Cropping Patterns & Irrigation', subject: 'biology' },
      { id: 'ncert9-bio-crop-protection-storage', name: 'Crop Protection Management', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Vermicomposting with Earthworms',
        description: 'Using red wigglers (*Eisenia fetida*) to degrade kitchen vegetable scraps produces premium vermicompost rich in plant growth hormones.',
      },
      {
        title: 'Organic Farming Certification',
        description: 'Zero-chemical agriculture uses biofertilizers (Rhizobium, Blue-green algae) and neem biopesticides to produce chemical-free healthy food.',
      },
      {
        title: 'Green Manure Cover Crops (Sunn Hemp)',
        description: 'Farmers sow fast-growing leguminous Sunn hemp or cluster bean and plow them back into the soil to enrich fields with natural nitrogen and humus.',
      },
    ],
  },

  {
    id: 'ncert9-bio-cropping-patterns-irrigation',
    title: 'Cropping Patterns & Irrigation Systems',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Mixed cropping, intercropping, crop rotation, and water-conserving drip irrigation',
    description:
      'Cropping patterns optimize harvest yields and mitigate total crop loss: (1) Mixed Cropping: growing two or more crops simultaneously on the same piece of land without definite row patterns (e.g. Wheat + Gram, or Groundnut + Sunflower); minimizes total failure risk if drought strikes; (2) Intercropping: growing two or more crops simultaneously in alternating row patterns with distinct nutrient requirements (e.g. Soybean + Maize, or Finger millet + Cowpea); prevents pests from spreading across the entire field and maximizes soil nutrient exploitation; (3) Crop Rotation: growing different crops on a piece of land in pre-planned succession; growing nitrogen-fixing legumes (pulses/gram) after cereal grains replenishes soil nitrogen naturally without chemical fertilizers. Irrigation methods: canal systems, tube wells, river lift systems, and modern water-saving Drip and Sprinkler irrigation.',
    formulaLaTeX: '\\text{Intercropping Advantage: } Y_{\\text{total}} > Y_{\\text{monoculture}} \\quad | \\quad \\text{LER (Land Equivalent Ratio)} = \\frac{Y_{A,\\text{inter}}}{Y_{A,\\text{mono}}} + \\frac{Y_{B,\\text{inter}}}{Y_{B,\\text{mono}}} > 1.0',
    formulaExplanation:
      'Leguminous crops harbor symbiotic *Rhizobium* bacteria in root nodules that fix inert atmospheric N₂ into bioavailable soil nitrates: N₂ + 8H⁺ + 8e⁻ + 16 ATP → 2NH₃ + H₂ + 16 ADP.',
    simulationType: 'food-resources-crops',
    variables: [
      {
        id: 'irrigationEfficiencyPercent',
        name: 'Drip Irrigation Water Efficiency',
        symbol: '\\eta_{\\text{drip}}',
        unit: '%',
        min: 30,
        max: 95,
        step: 5,
        defaultValue: 90,
        description: 'Drip lines deliver water directly to plant root zones with near-zero evaporation.',
      },
    ],
    prediction: {
      prompt: 'NCERT Crop Rotation Logic Inquiry',
      scenario:
        'Why do agronomists strongly advise farmers to cultivate a leguminous pulse crop (like pea, gram, or lentil) between two successive cereal crops (like wheat or rice)?',
      choices: [
        {
          id: 'p1',
          text: 'Because legumes secrete herbicides that poison all weeds in the field.',
          isCorrect: false,
          misconceptionExplanation: 'Legumes do not produce synthetic weed poisons.',
        },
        {
          id: 'p2',
          text: 'Because symbiotic Rhizobium bacteria in legume root nodules fix atmospheric nitrogen, naturally restoring depleted soil fertility.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Because cereal seeds will not germinate unless shaded by pea leaves.',
          isCorrect: false,
          misconceptionExplanation: 'Crop rotation is temporal succession in different seasons, not simultaneous shading.',
        },
      ],
      correctExplanation:
        'Cereal crops like wheat and rice heavily deplete soil nitrogen reserves. Legumes possess root nodules containing symbiotic *Rhizobium* bacteria capable of biological nitrogen fixation—converting atmospheric N₂ gas into mineral nitrates. When plowed or harvested, the soil nitrogen pool is replenished naturally without synthetic chemical fertilizers.',
      relevantFormula: '\\text{Crop Rotation: } \\text{Wheat (Cereal)} \\to \\text{Gram/Pea (Legume: } \\text{N}_2 \\text{ Fixation)} \\to \\text{Rice (Cereal)}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-crop-nutrient-management', name: 'Crop Nutrient Management', subject: 'biology' },
      { id: 'ncert9-bio-crop-protection-storage', name: 'Crop Protection Management', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Precision Drip Irrigation in Arid Israel',
        description: 'Underground micro-drip tubing delivers metered drops of water and dissolved nutrients directly to plant roots, greening desert crop fields with 70% less water.',
      },
      {
        title: 'Soybean-Corn Strip Intercropping',
        description: 'Alternating rows of nitrogen-fixing soybeans and deep-rooting corn maximize sunlight interception and naturally disrupt pest reproduction cycles.',
      },
      {
        title: 'Rainwater Harvesting Check Dams',
        description: 'Building watershed earthen check dams recharges groundwater tables, ensuring round-the-year tube well irrigation in rural villages.',
      },
    ],
  },

  {
    id: 'ncert9-bio-crop-protection-storage',
    title: 'Crop Protection Management: Weeds, Insect Pests & Post-Harvest Storage',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Weed eradication, insect borers/suckers, biological pest control, grain moisture control, and fumigation',
    description:
      'Field crops are threatened by biotic competitors: (1) Weeds: unwanted plants growing in fields (e.g. *Xanthium* / cocklebur, *Parthenium* / carrot grass, *Cyperus* / motha) that compete fiercely with crops for sunlight, water, and soil nutrients, drastically reducing yields; (2) Insect Pests: attack crops in three ways—cutting root/stem/leaf organs (caterpillars), sucking internal cell sap (aphids), or boring into stems and fruits (weevils/borers); (3) Plant Diseases: caused by fungi (rusts, smuts, blights), bacteria, and viruses transmitted via soil, air, and water. Post-Harvest Storage Losses: grain stored in silos suffers from Biotic factors (insects, rodents, fungi, mites) and Abiotic factors (inappropriate grain moisture > 9% and poor warehouse temperature), causing weight loss, poor germinability, and discoloration. Prevention requires thorough sun-drying before storage, hygienic airtight silos, and controlled chemical fumigation.',
    formulaLaTeX: '\\text{Safe Storage Moisture: } \\%_{\\text{moisture}} < 9\\% \\quad | \\quad \\text{Crop Loss Prevention} \\propto \\text{IPM (Integrated Pest Management)}',
    formulaExplanation:
      'Grains with high moisture content (> 14%) undergo rapid fungal mold growth and insect egg hatching, releasing metabolic heat and spoiling entire silos.',
    simulationType: 'food-resources-crops',
    variables: [
      {
        id: 'grainStorageMoisturePercent',
        name: 'Grain Storage Moisture Content',
        symbol: '\\%_{\\text{H2O}}',
        unit: '%',
        min: 5,
        max: 20,
        step: 1,
        defaultValue: 8,
        description: 'Sun-drying grains to <9% moisture prevents fungal rot and insect multiplication in silos.',
      },
    ],
    prediction: {
      prompt: 'NCERT Weed Competition Mechanism Challenge',
      scenario:
        'Why does the uncontrolled growth of weeds like Parthenium (gajar ghas) and Xanthium (gokhru) in a wheat field drastically cut harvest yields?',
      choices: [
        {
          id: 'p1',
          text: 'Weeds physically swallow wheat seeds whole.',
          isCorrect: false,
          misconceptionExplanation: 'Weeds are photosynthetic plants, not carnivorous organisms.',
        },
        {
          id: 'p2',
          text: 'Weeds compete aggressively for available soil nutrients, water, root space, and sunlight, starving the crop plants.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Weeds increase soil moisture to levels that cause wheat roots to turn into water lilies.',
          isCorrect: false,
          misconceptionExplanation: 'Weeds deplete soil moisture rapidly, worsening drought stress for crops.',
        },
      ],
      correctExplanation:
        'Weeds are hardy, fast-growing wild plants. They consume available soil nitrogen, phosphorus, and moisture, expand wide leaves that block sunlight from reaching crop plants, and occupy root zones, severely stunting crop vegetative growth and grain yield.',
      relevantFormula: '\\text{Crop Yield Loss } \\Delta Y \\propto \\text{Weed Biomass Density}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-crop-nutrient-management', name: 'Crop Nutrient Management', subject: 'biology' },
      { id: 'ncert9-bio-cropping-patterns-irrigation', name: 'Cropping Patterns & Irrigation', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Central Warehousing Corporation Grain Silos',
        description: 'Agricultural storage depots use mechanical aeration fans and aluminum phosphide fumigation to store millions of tons of wheat reserves for national food security.',
      },
      {
        title: 'Biological Control Using Ladybird Beetles',
        description: 'Releasing predatory ladybird beetles into organic mustard fields eliminates aphid pest infestations without spraying synthetic chemical insecticides.',
      },
      {
        title: 'Solarization of Nursery Seedbeds',
        description: 'Covering moist nursery soil with transparent polyethylene sheets during hot summer weeks pasteurizes the soil, killing dormant weed seeds and fungal spores.',
      },
    ],
  },

  {
    id: 'ncert9-bio-animal-husbandry-practices',
    title: 'Animal Husbandry: Cattle, Poultry, Pisciculture & Apiculture',
    subject: 'biology',
    gradeLevel: 'Class 9',
    tagline: 'Milch vs draught cattle, broilers/layers, composite fish culture, and Italian bee (Apis mellifera) honey farming',
    description:
      'Animal husbandry is the scientific management of farm animal livestock: (1) Cattle Farming (*Bos indicus* cows, *Bos bubalis* buffaloes): Milch animals produce milk; Draught animals perform agricultural labor (plowing, carting). Cross-breeding indigenous breeds (Red Sindhi, Sahiwal) with exotic foreign breeds (Jersey, Holstein-Friesian) combines high disease resistance with long lactation periods; (2) Poultry Farming: Layers are reared for egg production; Broilers are fed vitamin-rich mash for rapid meat production; (3) Fish Production (Pisciculture): Capture fishing from natural water bodies vs Culture fishery in inland ponds. Composite Fish Culture: farming 5-6 complementary non-competing species together: Catla (surface feeder), Rohu (middle column feeder), Mrigal and Common Carp (bottom feeders), Grass Carp (eats aquatic weeds); (4) Bee-Keeping (Apiculture): Italian bee (*Apis mellifera*) is favored for commercial honey production due to high honey collection capacity, gentle non-stinging demeanor, and prolific hive breeding.',
    formulaLaTeX: '\\text{Composite Fish Culture: } \\text{Catla (Surface)} + \\text{Rohu (Column)} + \\text{Mrigal (Bottom)} + \\text{Grass Carp (Weeds)} \\implies 100\\% \\text{ Food Utilization}',
    formulaExplanation:
      'Because each fish species occupies a distinct ecological niche and feeds at different water depths, there is zero food competition, multiplying total pond fish yield up to tenfold.',
    simulationType: 'food-resources-crops',
    variables: [
      {
        id: 'lactationPeriodDays',
        name: 'Cattle Lactation Duration',
        symbol: 't_{\\text{lactation}}',
        unit: 'days',
        min: 150,
        max: 365,
        step: 15,
        defaultValue: 300,
        description: 'Exotic cross-breeds sustain continuous daily milk production for over 300 days.',
      },
      {
        id: 'honeyYieldKgPerHive',
        name: 'Annual Honey Yield per Hive',
        symbol: 'Y_{\\text{honey}}',
        unit: 'kg/hive',
        min: 5,
        max: 40,
        step: 5,
        defaultValue: 25,
        description: 'Italian bee Apis mellifera produces up to 25-35 kg of pure honey per apiary box yearly.',
      },
    ],
    prediction: {
      prompt: 'NCERT Composite Fish Culture Ecological Niche Inquiry',
      scenario:
        'In a composite fish culture pond containing Catla, Rohu, and Mrigal, why do all three species thrive together with record harvest weights without fighting over food?',
      choices: [
        {
          id: 'p1',
          text: 'Because fish are fed sleeping pills so they do not see each other.',
          isCorrect: false,
          misconceptionExplanation: 'Fish farming utilizes natural ecological feeding niches, not chemical sedation.',
        },
        {
          id: 'p2',
          text: 'Because they feed at different water depths: Catla feeds at the surface, Rohu in the middle column, and Mrigal at the bottom.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Because Mrigal eats Catla, and Catla eats Rohu in a circular food chain.',
          isCorrect: false,
          misconceptionExplanation: 'All selected species are peaceful herbivores/detritivores; none are predatory carnivores.',
        },
      ],
      correctExplanation:
        'Composite fish farming selects species with non-overlapping feeding niches: Catla is a surface feeder, Rohu feeds in the middle water column, and Mrigal and Common Carp are bottom scavengers. Because they feed at different levels, there is zero inter-species food competition, and all pond resources are fully utilized.',
      relevantFormula: '\\text{Food Utilization} = \\text{Surface (Catla)} + \\text{Middle (Rohu)} + \\text{Bottom (Mrigal)} \\implies \\text{Zero Competition}',
    },
    relatedConcepts: [
      { id: 'ncert9-bio-crop-nutrient-management', name: 'Crop Nutrient Management', subject: 'biology' },
      { id: 'ncert9-bio-cropping-patterns-irrigation', name: 'Cropping Patterns & Irrigation', subject: 'biology' },
    ],
    realWorldApplications: [
      {
        title: 'Operation Flood (White Revolution in India)',
        description: 'Cooperative dairy farming (Amul) cross-bred hardy local cows with high-yielding breeds, transforming India into the world’s largest milk producer.',
      },
      {
        title: 'Blue Revolution Inland Aquaculture',
        description: 'Composite fish ponds in West Bengal and Andhra Pradesh produce freshwater carp yields exceeding 8,000 kg per hectare annually.',
      },
      {
        title: 'Commercial Apiaries in Mustard Fields',
        description: 'Placing Italian bee (*Apis mellifera*) apiary boxes in flowering mustard fields yields tons of golden honey while boosting crop seed set by 25% via cross-pollination.',
      },
    ],
  },
];
