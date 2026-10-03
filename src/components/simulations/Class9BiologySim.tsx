import React, { useState, useEffect } from 'react';
import {
  Dna,
  Microscope,
  Droplets,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  ZoomIn,
  Play,
  RotateCcw,
  Zap,
  Wheat,
  Fish,
  Sun,
  ShieldCheck,
  Bug,
  Sprout,
  Activity,
} from 'lucide-react';

interface Class9BiologySimProps {
  simulationType?: string;
  conceptId?: string;
  variables?: Record<string, number>;
}

type BioMode =
  | 'cell-discovery'
  | 'plasma-membrane'
  | 'cell-explorer'
  | 'prokaryote-vs-eukaryote'
  | 'cell-wall-turgor'
  | 'plant-vs-animal'
  | 'osmosis-plasmolysis'
  | 'plant-tissues'
  | 'animal-tissues'
  | 'mitosis'
  | 'food-crop-nutrients'
  | 'food-cropping-patterns'
  | 'food-crop-protection'
  | 'food-animal-husbandry';

export const Class9BiologySim: React.FC<Class9BiologySimProps> = ({
  simulationType = 'bio-cell-explorer',
  conceptId = '',
  variables = {},
}) => {
  const getInitialMode = (): BioMode => {
    // Exact mapping for all 30 NCERT Class 9 Biology concepts
    if (conceptId === 'ncert9-bio-discovery-cell-theory' || conceptId.includes('discovery') || conceptId.includes('cell-theory')) return 'cell-discovery';
    if (conceptId === 'ncert9-bio-plasma-membrane-diffusion' || conceptId.includes('plasma-membrane') || conceptId.includes('diffusion')) return 'plasma-membrane';
    if (conceptId === 'ncert9-bio-osmosis-tonicity-plasmolysis' || conceptId.includes('osmosis') || conceptId.includes('plasmolysis')) return 'osmosis-plasmolysis';
    if (conceptId === 'ncert9-bio-cell-wall-turgor' || conceptId.includes('cell-wall') || conceptId.includes('turgor')) return 'cell-wall-turgor';
    if (conceptId === 'ncert9-bio-cytoplasm-prokaryote-eukaryote' || conceptId.includes('prokaryote') || conceptId.includes('eukaryote')) return 'prokaryote-vs-eukaryote';
    if (conceptId === 'ncert9-bio-plant-vs-animal-cells' || conceptId.includes('plant-vs-animal')) return 'plant-vs-animal';
    if (conceptId === 'ncert9-bio-cell-division-mitosis-meiosis' || conceptId.includes('mitosis') || conceptId.includes('meiosis') || conceptId.includes('division')) return 'mitosis';
    
    // Plant tissues
    if (
      conceptId.includes('meristem') ||
      conceptId.includes('parenchyma') ||
      conceptId.includes('collenchyma') ||
      conceptId.includes('sclerenchyma') ||
      conceptId.includes('stomata') ||
      conceptId.includes('xylem') ||
      conceptId.includes('phloem') ||
      conceptId.includes('plant-tissue') ||
      conceptId.includes('division-of-labour')
    ) return 'plant-tissues';

    // Animal tissues
    if (
      conceptId.includes('epithelial') ||
      conceptId.includes('connective') ||
      conceptId.includes('muscular') ||
      conceptId.includes('nervous') ||
      conceptId.includes('neuron') ||
      conceptId.includes('animal-tissue')
    ) return 'animal-tissues';

    // Improvement in Food Resources
    if (conceptId === 'ncert9-bio-crop-nutrient-management' || conceptId.includes('nutrient') || conceptId.includes('manure') || conceptId.includes('fertilizer')) return 'food-crop-nutrients';
    if (conceptId === 'ncert9-bio-cropping-patterns-irrigation' || conceptId.includes('cropping-pattern') || conceptId.includes('irrigation')) return 'food-cropping-patterns';
    if (conceptId === 'ncert9-bio-crop-protection-storage' || conceptId.includes('crop-protection') || conceptId.includes('pest') || conceptId.includes('storage')) return 'food-crop-protection';
    if (conceptId === 'ncert9-bio-animal-husbandry-practices' || conceptId.includes('husbandry') || conceptId.includes('fish') || conceptId.includes('cattle') || conceptId.includes('apiculture')) return 'food-animal-husbandry';

    // Simulation type fallbacks
    if (simulationType.includes('discovery')) return 'cell-discovery';
    if (simulationType.includes('plasma-membrane')) return 'plasma-membrane';
    if (simulationType.includes('wall-turgor')) return 'cell-wall-turgor';
    if (simulationType.includes('prokaryote')) return 'prokaryote-vs-eukaryote';
    if (simulationType.includes('plant-vs-animal')) return 'plant-vs-animal';
    if (simulationType.includes('osmosis') || simulationType.includes('plasmolysis')) return 'osmosis-plasmolysis';
    if (simulationType.includes('plant-tissues')) return 'plant-tissues';
    if (simulationType.includes('animal-tissues')) return 'animal-tissues';
    if (simulationType.includes('mitosis')) return 'mitosis';
    if (simulationType.includes('food-resources') || simulationType.includes('crop')) return 'food-crop-nutrients';

    return 'cell-explorer';
  };

  const [activeMode, setActiveMode] = useState<BioMode>(getInitialMode());
  const isExploringTopic = Boolean(conceptId);

  useEffect(() => {
    setActiveMode(getInitialMode());
  }, [simulationType, conceptId]);

  // ----------------------------------------------------------------------
  // MODE 1: HISTORICAL CELL DISCOVERY & CELL THEORY
  // ----------------------------------------------------------------------
  const [selectedScientist, setSelectedScientist] = useState<'hooke' | 'leeuwenhoek' | 'virchow'>('hooke');
  const [microscopeMagnification, setMicroscopeMagnification] = useState<number>(40);

  // ----------------------------------------------------------------------
  // MODE 2: FLUID MOSAIC PLASMA MEMBRANE & SELECTIVE DIFFUSION
  // ----------------------------------------------------------------------
  const [extracellularCo2, setExtracellularCo2] = useState<number>(variables.extracellularCo2Concentration ?? 20);
  const [intracellularCo2, setIntracellularCo2] = useState<number>(variables.intracellularCo2Concentration ?? 70);
  const [membraneLipidFluidity, setMembraneLipidFluidity] = useState<number>(85);

  // ----------------------------------------------------------------------
  // MODE 3: PROKARYOTIC VS EUKARYOTIC COMPARISON
  // ----------------------------------------------------------------------
  const [prokaryoteEukaryoteView, setProkaryoteEukaryoteView] = useState<'comparison' | 'bacteria' | 'eukaryote'>('comparison');

  // ----------------------------------------------------------------------
  // MODE 4: PLANT CELL WALL & TURGOR MECHANICS
  // ----------------------------------------------------------------------
  const [cellWallTurgorPressure, setCellWallTurgorPressure] = useState<number>(variables.turgorPressureAtm ?? 8);
  const [cellSurroundingType, setCellSurroundingType] = useState<'hypotonic' | 'isotonic' | 'hypertonic'>('hypotonic');

  // ----------------------------------------------------------------------
  // MODE 5: CELL EXPLORER & ORGANELLES
  // ----------------------------------------------------------------------
  const [cellType, setCellType] = useState<'animal' | 'plant'>('plant');
  const [selectedOrganelle, setSelectedOrganelle] = useState<string>(() => {
    if (conceptId.includes('nucleus')) return 'nucleus';
    if (conceptId.includes('mitochondria')) return 'mitochondria';
    if (conceptId.includes('plastids') || conceptId.includes('chloroplast')) return 'chloroplast';
    if (conceptId.includes('endoplasmic')) return 'er';
    if (conceptId.includes('golgi')) return 'golgi';
    if (conceptId.includes('lysosome')) return 'lysosome';
    if (conceptId.includes('vacuole')) return 'vacuole';
    return 'nucleus';
  });

  const ORGANELLES_INFO: Record<string, {
    title: string;
    alias: string;
    description: string;
    structure: string;
    function: string;
    foundIn: string;
  }> = {
    nucleus: {
      title: 'The Nucleus',
      alias: 'Control Center / Brain of the Cell',
      description: 'Double-membraned organelle carrying chromatin network composed of DNA (deoxyribonucleic acid) and histone proteins.',
      structure: 'Nuclear envelope with nuclear pores, nucleoplasm, nucleolus (ribosome assembly), and chromatin fibers.',
      function: 'Directs all cellular metabolic functions, protein synthesis, and carries hereditary genes transmitted across cell divisions.',
      foundIn: 'Both Animal and Plant eukaryotic cells (Absent as true nucleus in prokaryotes).',
    },
    mitochondria: {
      title: 'Mitochondria',
      alias: 'Powerhouse of the Cell',
      description: 'Double-membraned semi-autonomous organelle responsible for aerobic cellular respiration and ATP generation.',
      structure: 'Smooth outer membrane; deeply folded inner membrane forming cristae (increasing surface area for ATP synthase enzymes); matrix containing own circular DNA and 70S ribosomes.',
      function: 'Oxidizes pyruvate to release cellular energy trapped in ATP (Adenosine Triphosphate) molecules.',
      foundIn: 'Both Animal and Plant cells.',
    },
    chloroplast: {
      title: 'Plastid: Chloroplast',
      alias: 'Kitchen of the Plant Cell',
      description: 'Double-membraned green plastid containing photosynthetic chlorophyll pigments, trapping solar radiant energy.',
      structure: 'Outer and inner membrane, stroma (fluid matrix), and stacked thylakoid discs organized into grana. Has own DNA and ribosomes.',
      function: 'Performs photosynthesis converting atmospheric CO₂ and water into glucose carbohydrates and oxygen gas.',
      foundIn: 'Plant cells and photosynthetic algae only (Absent in animal cells).',
    },
    er: {
      title: 'Endoplasmic Reticulum (ER)',
      alias: 'Cellular Highway & Membrane Factory',
      description: 'Vast interconnected network of tubular and flattened cisternae membranes extending from the outer nuclear envelope.',
      structure: 'Rough ER (RER studded with ribosomes) and Smooth ER (SER without ribosomes).',
      function: 'RER synthesizes and exports proteins; SER manufactures lipids/phospholipids for membrane biogenesis and detoxifies poisons in liver cells.',
      foundIn: 'Both Animal and Plant cells.',
    },
    golgi: {
      title: 'Golgi Apparatus',
      alias: 'Cellular Packaging & Dispatch Center',
      description: 'Discovered by Camillo Golgi; consists of parallel membrane-bound flattened sacs called cisternae with distinct cis and trans faces.',
      structure: 'System of stacked cisternae, secretory vesicles, and budding transport vacuoles.',
      function: 'Modifies, sorts, packages, and routes proteins and complex sugars synthesized by ER; produces primary lysosomes.',
      foundIn: 'Both Animal and Plant cells (diffuse units in plants called dictyosomes).',
    },
    lysosome: {
      title: 'Lysosomes',
      alias: 'Suicide Bags / Waste Disposal System',
      description: 'Membrane-bound digestive vesicles filled with powerful hydrolytic digestive enzymes manufactured by RER.',
      structure: 'Single spherical lipid membrane packaging acid hydrolases (~40 types of digestive enzymes).',
      function: 'Digests foreign bacteria, viruses, and worn-out old organelles. In cellular injury, lysosomes burst and their enzymes digest their own cell (autolysis).',
      foundIn: 'Prominent in Animal cells (rare/functional equivalents in plant vacuoles).',
    },
    vacuole: {
      title: 'Central Vacuole',
      alias: 'Cellular Storage & Turgidity Tank',
      description: 'Large fluid-filled membrane sac occupying 50% to 90% of a mature plant cell volume.',
      structure: 'Surrounded by a selectively permeable membrane called the tonoplast, filled with cell sap (amino acids, sugars, organic acids, salts).',
      function: 'Provides mechanical turgidity and rigidity to plant cells; stores metabolic by-products; in Amoeba, contractile vacuoles expel excess water.',
      foundIn: 'Huge central vacuole in Plant cells; small temporary vacuoles in Animal cells.',
    },
    cellwall: {
      title: 'Cell Wall',
      alias: 'Rigid Protective Outer Shield',
      description: 'Non-living, rigid outermost boundary located outside the plasma membrane in plant cells.',
      structure: 'Composed of tough cellulose microfibril polymer networks embedded in hemicellulose and pectin.',
      function: 'Provides mechanical strength, structural shape, and prevents bursting (lysis) in dilute hypotonic surroundings by exerting counter-turgor pressure.',
      foundIn: 'Plant cells and fungi only (Completely absent in animal cells).',
    },
  };

  const currentOrg = ORGANELLES_INFO[selectedOrganelle] || ORGANELLES_INFO.nucleus;

  // ----------------------------------------------------------------------
  // MODE 6: OSMOSIS & PLASMOLYSIS CHAMBER
  // ----------------------------------------------------------------------
  const [tonicity, setTonicity] = useState<'hypotonic' | 'isotonic' | 'hypertonic'>('hypotonic');
  const [osmosisCellKind, setOsmosisCellKind] = useState<'plant' | 'rbc'>('plant');

  // ----------------------------------------------------------------------
  // MODE 7: PLANT TISSUES SLIDES
  // ----------------------------------------------------------------------
  const [plantTissueSlide, setPlantTissueSlide] = useState<'meristem' | 'parenchyma' | 'collenchyma' | 'sclerenchyma' | 'stomata' | 'xylem_phloem'>(() => {
    if (conceptId.includes('meristem')) return 'meristem';
    if (conceptId.includes('parenchyma')) return 'parenchyma';
    if (conceptId.includes('collenchyma')) return 'collenchyma';
    if (conceptId.includes('sclerenchyma')) return 'sclerenchyma';
    if (conceptId.includes('xylem') || conceptId.includes('phloem')) return 'xylem_phloem';
    return 'stomata';
  });
  const [stomataOpen, setStomataOpen] = useState(true);

  // ----------------------------------------------------------------------
  // MODE 8: ANIMAL TISSUES SLIDES
  // ----------------------------------------------------------------------
  const [animalTissueSlide, setAnimalTissueSlide] = useState<'epithelial' | 'blood' | 'bone' | 'muscle' | 'neuron'>(() => {
    if (conceptId.includes('epithelial')) return 'epithelial';
    if (conceptId.includes('connective') || conceptId.includes('blood') || conceptId.includes('bone')) return 'bone';
    if (conceptId.includes('muscle')) return 'muscle';
    return 'neuron';
  });
  const [neuronImpulseActive, setNeuronImpulseActive] = useState(true);

  // ----------------------------------------------------------------------
  // MODE 9: MITOSIS CELL DIVISION
  // ----------------------------------------------------------------------
  const MITOSIS_STAGES = [
    {
      id: 'interphase',
      name: '1. Interphase',
      desc: 'Cell growth, protein synthesis, and exact replication of nuclear DNA. Chromosomes are uncoiled as delicate chromatin threads.',
    },
    {
      id: 'prophase',
      name: '2. Prophase',
      desc: 'Chromatin condenses into thick visible chromosomes with paired sister chromatids joined at centromeres. Nuclear membrane and nucleolus dissolve.',
    },
    {
      id: 'metaphase',
      name: '3. Metaphase',
      desc: 'Chromosomes align along the central equatorial plane (metaphase plate). Spindle fibers attach to kinetochores of each centromere.',
    },
    {
      id: 'anaphase',
      name: '4. Anaphase',
      desc: 'Centromeres split! Spindle fibers contract, pulling sister chromatids apart towards opposite spindle poles as daughter chromosomes.',
    },
    {
      id: 'telophase',
      name: '5. Telophase & Cytokinesis',
      desc: 'Chromosomes reach poles and decondense. Two new nuclear envelopes reform. Cytoplasm divides into two identical diploid daughter cells.',
    },
  ];
  const [mitosisStageIdx, setMitosisStageIdx] = useState(2);
  const currentMitosis = MITOSIS_STAGES[mitosisStageIdx];

  // ----------------------------------------------------------------------
  // MODE 10: CROP NUTRIENT MANAGEMENT & DEFICIENCY SIMULATOR
  // ----------------------------------------------------------------------
  const [nitrogenLevel, setNitrogenLevel] = useState<number>(variables.nitrogenPpm ?? 75);
  const [phosphorusLevel, setPhosphorusLevel] = useState<number>(variables.phosphorusPpm ?? 80);
  const [potassiumLevel, setPotassiumLevel] = useState<number>(variables.potassiumPpm ?? 85);
  const [fertilizerType, setFertilizerType] = useState<'organic_manure' | 'chemical_npk'>('organic_manure');

  // ----------------------------------------------------------------------
  // MODE 11: CROPPING PATTERNS & IRRIGATION
  // ----------------------------------------------------------------------
  const [croppingPattern, setCroppingPattern] = useState<'monoculture' | 'mixed' | 'intercropping' | 'rotation'>('intercropping');
  const [irrigationType, setIrrigationType] = useState<'drip' | 'sprinkler' | 'canal'>('drip');

  // ----------------------------------------------------------------------
  // MODE 12: CROP PROTECTION & STORAGE MANAGEMENT
  // ----------------------------------------------------------------------
  const [activeThreat, setActiveThreat] = useState<'weeds' | 'insect_pests' | 'storage_spoilage'>('weeds');
  const [controlMethod, setControlMethod] = useState<'mechanical_ipm' | 'excessive_chemical'>('mechanical_ipm');
  const [grainMoisturePercent, setGrainMoisturePercent] = useState<number>(variables.grainMoisturePercent ?? 8.5);

  // ----------------------------------------------------------------------
  // MODE 13: ANIMAL HUSBANDRY & COMPOSITE FISH CULTURE
  // ----------------------------------------------------------------------
  const [husbandryBranch, setHusbandryBranch] = useState<'composite_fish' | 'cattle' | 'poultry' | 'apiculture'>('composite_fish');
  const [highlightedPondZone, setHighlightedPondZone] = useState<'surface' | 'middle' | 'bottom' | 'all'>('all');

  return (
    <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-6">
      {/* Header Banner - Only show mode switcher tabs if NOT exploring a specific topic */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Dna className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            NCERT Class 9 Biology Interactive Visual Lab
          </h3>
        </div>

        {/* Unrelated tabs switcher is hidden while exploring a particular topic to remove distracting extras */}
        {!isExploringTopic && (
          <div className="flex flex-wrap items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveMode('cell-discovery')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeMode === 'cell-discovery' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cell Discovery
            </button>
            <button
              onClick={() => setActiveMode('plasma-membrane')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeMode === 'plasma-membrane' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Plasma Membrane
            </button>
            <button
              onClick={() => setActiveMode('cell-explorer')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeMode === 'cell-explorer' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Organelles
            </button>
            <button
              onClick={() => setActiveMode('osmosis-plasmolysis')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeMode === 'osmosis-plasmolysis' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Osmosis
            </button>
            <button
              onClick={() => setActiveMode('plant-tissues')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeMode === 'plant-tissues' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Plant Tissues
            </button>
            <button
              onClick={() => setActiveMode('animal-tissues')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeMode === 'animal-tissues' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Animal Tissues
            </button>
            <button
              onClick={() => setActiveMode('mitosis')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeMode === 'mitosis' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mitosis
            </button>
            <button
              onClick={() => setActiveMode('food-crop-nutrients')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                activeMode === 'food-crop-nutrients' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Crop Nutrients
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODE 1: HISTORICAL CELL DISCOVERY & CELL THEORY */}
      {/* ============================================================== */}
      {activeMode === 'cell-discovery' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-300 font-mono font-bold uppercase flex items-center gap-1.5">
              <Microscope className="w-4 h-4 text-emerald-400" />
              Microscopic Specimen Mount:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { id: 'hooke', label: '1. Robert Hooke (1665) — Cork Slices', year: '1665' },
                { id: 'leeuwenhoek', label: '2. Leeuwenhoek (1674) — Living Pond Microbes', year: '1674' },
                { id: 'virchow', label: '3. Rudolf Virchow (1855) — Dividing Cells', year: '1855' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScientist(s.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                    selectedScientist === s.id
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Circular Microscope Eyepiece Viewport */}
            <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[320px]">
              <div className="relative w-64 h-64 rounded-full border-4 border-slate-700 bg-slate-950 overflow-hidden shadow-2xl flex items-center justify-center ring-8 ring-slate-900">
                {/* Microscope crosshairs */}
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-400"></div>
                </div>

                {/* Hooke's 1665 Dead Cork Cell Honeycombs */}
                {selectedScientist === 'hooke' && (
                  <svg viewBox="0 0 200 200" className="w-full h-full animate-in fade-in duration-300">
                    <rect width="200" height="200" fill="#1c1917" />
                    {/* Honeycomb lattice of dead empty cell walls */}
                    {[0, 30, 60, 90, 120, 150, 180].map((y) =>
                      [0, 30, 60, 90, 120, 150, 180].map((x) => (
                        <rect
                          key={`${x}-${y}`}
                          x={x + (y % 60 === 0 ? 0 : 15)}
                          y={y}
                          width="26"
                          height="26"
                          rx="4"
                          fill="#292524"
                          stroke="#78716c"
                          strokeWidth="2.5"
                        />
                      ))
                    )}
                    <text x="100" y="105" textAnchor="middle" fill="#d6d3d1" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      Dead Cork "Cellulae"
                    </text>
                  </svg>
                )}

                {/* Leeuwenhoek's 1674 Living Pond Water Microorganisms */}
                {selectedScientist === 'leeuwenhoek' && (
                  <svg viewBox="0 0 200 200" className="w-full h-full animate-in fade-in duration-300">
                    <radialGradient id="pondGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#064e3b" />
                      <stop offset="100%" stopColor="#022c22" />
                    </radialGradient>
                    <rect width="200" height="200" fill="url(#pondGlow)" />
                    {/* Swimming Amoeba/Protozoa */}
                    <path
                      d="M 60,70 Q 80,45 110,60 T 140,90 T 120,130 T 70,120 Z"
                      fill="#10b98166"
                      stroke="#34d399"
                      strokeWidth="2"
                    />
                    <circle cx="95" cy="85" r="8" fill="#f59e0b" opacity="0.8" />
                    {/* Spirilla and flagellates */}
                    <path d="M 40,150 Q 55,130 70,150 T 100,150" fill="none" stroke="#6ee7b7" strokeWidth="2.5" strokeDasharray="3 3" />
                    <circle cx="150" cy="50" r="5" fill="#38bdf8" />
                    <line x1="150" y1="50" x2="170" y2="35" stroke="#38bdf8" strokeWidth="1.5" />
                    <text x="100" y="180" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontFamily="monospace">
                      Living Animalcules (Pond Water)
                    </text>
                  </svg>
                )}

                {/* Virchow's 1855 Dividing Cells */}
                {selectedScientist === 'virchow' && (
                  <svg viewBox="0 0 200 200" className="w-full h-full animate-in fade-in duration-300">
                    <rect width="200" height="200" fill="#0f172a" />
                    {/* Dividing daughter cells */}
                    <ellipse cx="75" cy="100" rx="35" ry="42" fill="#04785733" stroke="#10b981" strokeWidth="2" />
                    <circle cx="75" cy="100" r="9" fill="#f59e0b" />
                    <ellipse cx="125" cy="100" rx="35" ry="42" fill="#04785733" stroke="#10b981" strokeWidth="2" />
                    <circle cx="125" cy="100" r="9" fill="#f59e0b" />
                    {/* Cleavage furrow */}
                    <line x1="100" y1="58" x2="100" y2="142" stroke="#34d399" strokeWidth="1.5" strokeDasharray="2 2" />
                    <text x="100" y="170" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      "Omnis cellula-e cellula"
                    </text>
                  </svg>
                )}
              </div>

              {/* Magnification Controls */}
              <div className="flex items-center gap-3 mt-4 text-xs font-mono text-slate-400">
                <span>Magnification:</span>
                {[10, 40, 100].map((mag) => (
                  <button
                    key={mag}
                    onClick={() => setMicroscopeMagnification(mag)}
                    className={`px-2 py-0.5 rounded border transition ${
                      microscopeMagnification === mag
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    {mag}×
                  </button>
                ))}
              </div>
            </div>

            {/* Scientific Timeline Commentary */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
              {selectedScientist === 'hooke' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                      1665 AD
                    </span>
                    <h4 className="font-bold text-white text-sm">Robert Hooke's "Micrographia"</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Hooke examined thin slices of tree bottle cork using a primitive self-designed compound microscope. He observed compartmentalized honeycomb chambers surrounded by thick walls and coined the Latin term <strong className="text-amber-300 font-mono">"cellulae"</strong> (little rooms). Hooke observed dead cellulose boundaries of cork tree bark.
                  </p>
                </>
              )}

              {selectedScientist === 'leeuwenhoek' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                      1674 AD
                    </span>
                    <h4 className="font-bold text-white text-sm">Anton van Leeuwenhoek Discovers Living Cells</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Using single, highly polished biconvex glass beads achieving up to 275× magnification, Leeuwenhoek observed pond water droplets and discovered the first free-living living organisms (bacteria, Spirogyra algae, and protozoa), which he termed <strong className="text-emerald-300 font-mono">"animalcules"</strong>.
                  </p>
                </>
              )}

              {selectedScientist === 'virchow' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                      1855 AD
                    </span>
                    <h4 className="font-bold text-white text-sm">Virchow Completes Modern Cell Theory</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Schleiden (1838, botanist) and Schwann (1839, zoologist) proposed that all plants and animals are composed of cells. Rudolf Virchow (1855) completed the theory with the universal doctrine: <strong className="text-cyan-300 font-mono">"Omnis cellula-e cellula"</strong> — new living cells arise only through the binary division of pre-existing cells, disproving spontaneous generation.
                  </p>
                </>
              )}

              {/* 3 Pillars of Modern Cell Theory Summary Card */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-[11px]">
                <span className="text-xs font-bold text-emerald-400 block font-mono">3 Postulates of Cell Theory:</span>
                <p className="text-slate-300">1. All living organisms consist of one or more living cells.</p>
                <p className="text-slate-300">2. The cell is the structural and functional unit of all living organisms.</p>
                <p className="text-slate-300">3. All cells arise from pre-existing cells via cellular division.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 2: PLASMA MEMBRANE FLUID MOSAIC & SELECTIVE DIFFUSION */}
      {/* ============================================================== */}
      {activeMode === 'plasma-membrane' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Fluid Mosaic Phospholipid Bilayer Cross-Section */}
            <div className="lg:col-span-7 bg-[#050b14] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[320px]">
              <div className="w-full flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="text-cyan-400 font-bold">Extracellular Fluid (Outside Cell)</span>
                <span className="text-slate-400">Diffusion Gradient: {intracellularCo2 > extracellularCo2 ? 'Efflux (Outward)' : 'Influx (Inward)'}</span>
              </div>

              <svg viewBox="0 0 320 200" className="w-full h-56">
                {/* Extracellular region */}
                <rect x="0" y="0" width="320" height="60" fill="#0284c715" />

                {/* Upper Leaflet: Hydrophilic Polar Heads (Phosphates) */}
                {[15, 35, 55, 75, 95, 115, 185, 205, 225, 245, 265, 285, 305].map((x) => (
                  <g key={`top-${x}`}>
                    <circle cx={x} cy="65" r="7" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                    {/* Wavy Hydrophobic Fatty Acid Tails */}
                    <path d={`M ${x - 2},72 Q ${x - 5},85 ${x - 2},95`} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                    <path d={`M ${x + 2},72 Q ${x + 5},85 ${x + 2},95`} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  </g>
                ))}

                {/* Intrinsic Transmembrane Transport Protein Channel */}
                <path
                  d="M 130,55 C 130,80 140,100 130,145 L 170,145 C 160,100 170,80 170,55 Z"
                  fill="#8b5cf6"
                  stroke="#a78bfa"
                  strokeWidth="2"
                />
                <text x="150" y="105" textAnchor="middle" fill="#ede9fe" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  Channel
                </text>

                {/* Lower Leaflet: Hydrophilic Polar Heads */}
                {[15, 35, 55, 75, 95, 115, 185, 205, 225, 245, 265, 285, 305].map((x) => (
                  <g key={`bot-${x}`}>
                    <circle cx={x} cy="135" r="7" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
                    {/* Wavy Hydrophobic Tails pointing upward */}
                    <path d={`M ${x - 2},128 Q ${x - 5},115 ${x - 2},105`} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                    <path d={`M ${x + 2},128 Q ${x + 5},115 ${x + 2},105`} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                  </g>
                ))}

                {/* Intracellular Cytosol region */}
                <rect x="0" y="140" width="320" height="60" fill="#10b98115" />

                {/* Animated Dissolved Gas Particles (CO2 / O2) moving down gradient */}
                {intracellularCo2 > extracellularCo2 ? (
                  /* Net upward efflux from high inside to low outside */
                  <g>
                    <line x1="80" y1="160" x2="80" y2="40" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrow)" />
                    <line x1="240" y1="160" x2="240" y2="40" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
                    <circle cx="80" cy="50" r="4" fill="#fb7185" />
                    <circle cx="240" cy="50" r="4" fill="#fb7185" />
                    <text x="150" y="25" textAnchor="middle" fill="#f43f5e" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      Net Spontaneous Efflux (High to Low [CO₂])
                    </text>
                  </g>
                ) : (
                  /* Net downward influx */
                  <g>
                    <line x1="80" y1="40" x2="80" y2="160" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
                    <line x1="240" y1="40" x2="240" y2="160" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="150" y="175" textAnchor="middle" fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      Net Spontaneous Influx (High to Low [O₂])
                    </text>
                  </g>
                )}
              </svg>

              <div className="w-full flex items-center justify-between text-[11px] font-mono text-emerald-400 mt-2">
                <span>Cytoplasm / Cytosol (Inside Cell)</span>
                <span>ATP Consumption: 0 J (Passive Diffusion)</span>
              </div>
            </div>

            {/* Interactive Sliders & Scientific Principles */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-cyan-400 font-mono text-sm uppercase">
                Fick's Diffusion Gradient Controls
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Intracellular [CO₂] (Cell Respiration Waste):</span>
                    <span className="text-rose-400 font-mono font-bold">{intracellularCo2} mmol/L</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={intracellularCo2}
                    onChange={(e) => setIntracellularCo2(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Extracellular [CO₂] (Surrounding Capillary):</span>
                    <span className="text-sky-400 font-mono font-bold">{extracellularCo2} mmol/L</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={extracellularCo2}
                    onChange={(e) => setExtracellularCo2(Number(e.target.value))}
                    className="w-full accent-sky-500"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <span className="text-amber-400 font-bold block font-mono">Singer & Nicolson Fluid Mosaic Model:</span>
                <p>
                  Membrane consists of a fluid phospholipid bilayer with hydrophilic phosphate heads pointing outward into aqueous solutions and hydrophobic fatty acid tails sequestered inside. Small non-polar molecules (O₂, CO₂) diffuse directly across the lipid bilayer spontaneously down their concentration gradient without cellular energy expenditure.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 3: PROKARYOTE VS EUKARYOTE COMPARATIVE CYTOLOGY */}
      {/* ============================================================== */}
      {activeMode === 'prokaryote-vs-eukaryote' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prokaryotic Bacterial Cell */}
            <div className="bg-[#050e18] rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Prokaryotic Cell (Bacterium)
                </span>
                <span className="text-xs text-slate-400 font-mono">Size: 1 – 10 μm</span>
              </div>

              <div className="h-44 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-3">
                <svg viewBox="0 0 200 120" className="w-full h-full">
                  {/* Capsule & Cell Wall */}
                  <rect x="25" y="25" width="130" height="70" rx="35" fill="#f59e0b15" stroke="#f59e0b" strokeWidth="2.5" />
                  {/* Plasma Membrane */}
                  <rect x="32" y="32" width="116" height="56" rx="28" fill="#10b98115" stroke="#10b981" strokeWidth="1.5" />
                  {/* Naked circular DNA / Nucleoid */}
                  <path
                    d="M 60,60 Q 80,45 100,60 T 120,60 T 80,75 Z"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="2.5"
                    strokeDasharray="2 2"
                  />
                  <text x="90" y="58" textAnchor="middle" fill="#ec4899" fontSize="8" fontFamily="monospace" fontWeight="bold">
                    Nucleoid
                  </text>
                  {/* 70S Ribosomes */}
                  {[45, 60, 115, 130, 85].map((x, i) => (
                    <circle key={i} cx={x} cy={45 + (i % 3) * 12} r="2" fill="#38bdf8" />
                  ))}
                  {/* Locomotory Flagellum */}
                  <path d="M 25,60 C 10,40 5,80 -15,50" fill="none" stroke="#f59e0b" strokeWidth="2" />
                </svg>
              </div>

              <ul className="text-xs text-slate-300 space-y-1 font-mono">
                <li className="text-amber-400">✗ No nuclear envelope (undefined Nucleoid)</li>
                <li className="text-amber-400">✗ No membrane-bound organelles (No ER, Golgi, Mitochondria)</li>
                <li className="text-slate-300">✓ Single circular chromosome; smaller 70S ribosomes</li>
                <li className="text-slate-300">✓ Peptidoglycan cell wall; division by binary fission</li>
              </ul>
            </div>

            {/* Eukaryotic Cell (Plant / Animal) */}
            <div className="bg-[#050e18] rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Eukaryotic Cell (Plant / Animal)
                </span>
                <span className="text-xs text-slate-400 font-mono">Size: 10 – 100 μm</span>
              </div>

              <div className="h-44 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center p-3">
                <svg viewBox="0 0 200 120" className="w-full h-full">
                  {/* Outer membrane */}
                  <rect x="20" y="15" width="160" height="90" rx="15" fill="#04785715" stroke="#10b981" strokeWidth="2.5" />
                  {/* True double-membraned nucleus */}
                  <circle cx="100" cy="60" r="22" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
                  <circle cx="100" cy="60" r="7" fill="#fbbf24" />
                  <text x="100" y="80" textAnchor="middle" fill="#c7d2fe" fontSize="7" fontFamily="monospace">
                    True Nucleus
                  </text>
                  {/* Mitochondria with cristae */}
                  <ellipse cx="45" cy="40" rx="14" ry="8" fill="#7f1d1d" stroke="#f87171" strokeWidth="1" />
                  {/* Vacuole */}
                  <ellipse cx="155" cy="60" rx="14" ry="22" fill="#0284c733" stroke="#38bdf8" strokeWidth="1" />
                  {/* 80S Ribosomes */}
                  {[65, 80, 130, 140].map((x, i) => (
                    <circle key={i} cx={x} cy={35 + (i % 2) * 45} r="2.5" fill="#38bdf8" />
                  ))}
                </svg>
              </div>

              <ul className="text-xs text-slate-300 space-y-1 font-mono">
                <li className="text-emerald-400">✓ Double-membraned Nucleus with nuclear pores & nucleolus</li>
                <li className="text-emerald-400">✓ Membrane-bound organelles (Mitochondria, ER, Golgi, Plastids)</li>
                <li className="text-slate-300">✓ Multiple linear chromosomes with histone proteins</li>
                <li className="text-slate-300">✓ Larger 80S ribosomes; division by Mitosis or Meiosis</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 4: PLANT CELL WALL & TURGOR MECHANICS */}
      {/* ============================================================== */}
      {activeMode === 'cell-wall-turgor' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 bg-[#050e18] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[300px]">
              <svg viewBox="0 0 240 200" className="w-64 h-56">
                {/* Rigid Cellulose Outer Cell Wall */}
                <rect x="25" y="20" width="190" height="160" rx="15" fill="#064e3b22" stroke="#10b981" strokeWidth="6" />
                <rect x="31" y="26" width="178" height="148" rx="10" fill="#064e3b11" stroke="#34d399" strokeWidth="2" strokeDasharray="3 3" />

                {/* Plasma Membrane & Cytoplasm */}
                <rect x="36" y="31" width="168" height="138" rx="8" fill="#04785722" stroke="#22c55e" strokeWidth="1.5" />

                {/* Swollen Turgid Central Vacuole exerting outward pressure */}
                <ellipse cx="120" cy="100" rx="60" ry="48" fill="#0284c744" stroke="#38bdf8" strokeWidth="2" />
                <text x="120" y="105" textAnchor="middle" fill="#bae6fd" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  Cell Sap Vacuole
                </text>

                {/* Pressure Force Vectors: Turgor Pressure (T) Outward vs Wall Pressure (W) Inward */}
                <g>
                  {/* Outward Turgor Pressure Arrows (T) */}
                  <line x1="120" y1="52" x2="120" y2="35" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />
                  <line x1="120" y1="148" x2="120" y2="165" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="60" y1="100" x2="40" y2="100" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="180" y1="100" x2="200" y2="100" stroke="#38bdf8" strokeWidth="2" />
                  {/* Inward Wall Pressure Arrows (W) */}
                  <line x1="120" y1="22" x2="120" y2="32" stroke="#10b981" strokeWidth="2" />
                  <line x1="120" y1="178" x2="120" y2="168" stroke="#10b981" strokeWidth="2" />
                </g>
              </svg>

              <div className="flex items-center justify-between w-full text-xs font-mono text-slate-300 mt-2">
                <span className="text-cyan-400">Turgor Pressure T: +{cellWallTurgorPressure} atm</span>
                <span className="text-emerald-400">Wall Pressure W = T (Equilibrium)</span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">
                Plant Structural Mechanical Rigidity
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unlike animal cells which burst (lyse) in dilute hypotonic water due to osmotic influx, plant cells are shielded by an outer non-living cell wall composed of cellulose microfibril bundles.
              </p>
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Turgor vs Wall Law:</span>
                  <span className="font-mono text-cyan-300 font-bold">W = T</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  As water enters by endosmosis, the swollen cytoplasm exerts outward <strong className="text-cyan-400">Turgor Pressure (T)</strong>. The rigid cellulose wall pushes back with equal <strong className="text-emerald-400">Wall Pressure (W)</strong>, maintaining plant turgidity without cell rupture.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 5: CELL ORGANELLES EXPLORER */}
      {/* ============================================================== */}
      {activeMode === 'cell-explorer' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-300 font-mono font-bold uppercase">
              Select Cell Organelle:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {Object.keys(ORGANELLES_INFO).map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedOrganelle(k)}
                  className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition ${
                    selectedOrganelle === k
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 bg-[#050e18] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[300px]">
              {selectedOrganelle === 'nucleus' && (
                <svg viewBox="0 0 200 200" className="w-56 h-56">
                  <circle cx="100" cy="100" r="75" fill="#1e1b4b" stroke="#6366f1" strokeWidth="4" />
                  <circle cx="100" cy="100" r="24" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                  <path d="M 65,90 Q 75,70 90,85 T 120,80 T 140,110" fill="none" stroke="#c084fc" strokeWidth="2" />
                  <path d="M 70,120 Q 90,140 110,125 T 135,120" fill="none" stroke="#c084fc" strokeWidth="2" />
                  <text x="100" y="105" textAnchor="middle" fill="#0f172a" fontSize="8" fontWeight="bold">Nucleolus</text>
                </svg>
              )}

              {selectedOrganelle === 'mitochondria' && (
                <svg viewBox="0 0 200 200" className="w-56 h-56">
                  <rect x="25" y="55" width="150" height="90" rx="45" fill="#450a0a" stroke="#ef4444" strokeWidth="3" />
                  <path d="M 45,100 C 60,70 70,130 90,100 C 110,70 120,130 140,100 C 150,75 160,110 165,100" fill="none" stroke="#fca5a5" strokeWidth="3.5" />
                  <text x="100" y="170" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="monospace">Cristae ATP Synthesizers</text>
                </svg>
              )}

              {selectedOrganelle === 'chloroplast' && (
                <svg viewBox="0 0 200 200" className="w-56 h-56">
                  <ellipse cx="100" cy="100" rx="80" ry="55" fill="#064e3b" stroke="#10b981" strokeWidth="3" />
                  {[55, 85, 115, 145].map((x, i) => (
                    <g key={i}>
                      <ellipse cx={x} cy="90" rx="8" ry="4" fill="#34d399" />
                      <ellipse cx={x} cy="100" rx="8" ry="4" fill="#34d399" />
                      <ellipse cx={x} cy="110" rx="8" ry="4" fill="#34d399" />
                      <line x1={x} y1="90" x2={x} y2="110" stroke="#059669" strokeWidth="2" />
                    </g>
                  ))}
                  <text x="100" y="175" textAnchor="middle" fill="#6ee7b7" fontSize="10" fontFamily="monospace">Thylakoid Grana Discs</text>
                </svg>
              )}

              {selectedOrganelle !== 'nucleus' && selectedOrganelle !== 'mitochondria' && selectedOrganelle !== 'chloroplast' && (
                <div className="p-8 text-center text-slate-300 font-mono">
                  <Sparkles className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <span className="text-lg font-bold text-white block capitalize">{selectedOrganelle}</span>
                  <p className="text-xs text-slate-400 mt-1">{currentOrg.alias}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
              <div>
                <h4 className="font-bold text-emerald-400 font-mono text-base">{currentOrg.title}</h4>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">{currentOrg.alias}</p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{currentOrg.description}</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-400 font-mono text-[11px] uppercase block">Structure:</span>
                  <span className="text-slate-200">{currentOrg.structure}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-mono text-[11px] uppercase block">Primary Function:</span>
                  <span className="text-cyan-300 font-semibold">{currentOrg.function}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 6: OSMOSIS & PLASMOLYSIS */}
      {/* ============================================================== */}
      {activeMode === 'osmosis-plasmolysis' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase">
              External Solution Tonicity:
            </span>
            <div className="flex gap-2 text-xs">
              {(['hypotonic', 'isotonic', 'hypertonic'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTonicity(t)}
                  className={`px-3 py-1.5 rounded-xl font-mono font-bold capitalize transition ${
                    tonicity === t
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 bg-[#050e18] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[280px]">
              <div className="w-56 h-56 rounded-2xl border-2 border-slate-700 bg-slate-950 relative flex items-center justify-center p-4 overflow-hidden">
                {/* Solution Background Tint */}
                <div
                  className={`absolute inset-0 transition-colors duration-500 ${
                    tonicity === 'hypotonic'
                      ? 'bg-sky-500/10'
                      : tonicity === 'hypertonic'
                      ? 'bg-amber-500/15'
                      : 'bg-emerald-500/10'
                  }`}
                />

                {/* Plant Cell Wall */}
                <div className="w-44 h-44 rounded-xl border-4 border-emerald-600 bg-emerald-950/20 relative flex items-center justify-center transition-all duration-500">
                  {/* Shrunken or Swollen Protoplast */}
                  <div
                    className={`rounded-lg bg-emerald-700/60 border-2 border-emerald-400 transition-all duration-700 flex items-center justify-center ${
                      tonicity === 'hypotonic'
                        ? 'w-40 h-40'
                        : tonicity === 'hypertonic'
                        ? 'w-20 h-20 shadow-inner'
                        : 'w-32 h-32'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-emerald-200 font-bold">
                      {tonicity === 'hypertonic' ? 'Plasmolyzed' : tonicity === 'hypotonic' ? 'Turgid' : 'Flaccid'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400 mt-3">
                <span>Medium: {tonicity === 'hypotonic' ? 'Pure Water (Low Solute)' : tonicity === 'hypertonic' ? 'Concentrated Salt/Sugar Solution' : 'Isotonic Solution'}</span>
                <span>Water Flux: {tonicity === 'hypotonic' ? 'Endosmosis' : tonicity === 'hypertonic' ? 'Exosmosis' : 'Equilibrium'}</span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">
                {tonicity === 'hypotonic' && 'Endosmosis & Maximum Turgidity'}
                {tonicity === 'isotonic' && 'Equilibrium: Flaccid State'}
                {tonicity === 'hypertonic' && 'Plasmolysis: Shrinkage Away from Wall'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tonicity === 'hypotonic' &&
                  'External medium has higher water concentration (dilute). Water enters by endosmosis; vacuole expands until turgor pressure equals wall pressure.'}
                {tonicity === 'isotonic' &&
                  'Concentration of solute is identical inside and outside. Net movement of water is exactly zero; cell volume stays constant.'}
                {tonicity === 'hypertonic' &&
                  'External medium has lower water concentration (hypertonic salt/sugar). Water leaves the cell by exosmosis; living protoplast shrinks away from the rigid cell wall (Plasmolysis).'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 7: PLANT TISSUES & STOMATA */}
      {/* ============================================================== */}
      {activeMode === 'plant-tissues' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase">
              Microscope Slide Mount:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { id: 'stomata', label: '1. Epidermis & Stomata' },
                { id: 'meristem', label: '2. Meristematic (Apical/Cambium)' },
                { id: 'parenchyma', label: '3. Parenchyma (Storage)' },
                { id: 'collenchyma', label: '4. Collenchyma (Flexible)' },
                { id: 'sclerenchyma', label: '5. Sclerenchyma (Lignified)' },
                { id: 'xylem_phloem', label: '6. Xylem & Phloem Bundles' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setPlantTissueSlide(s.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                    plantTissueSlide === s.id
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {plantTissueSlide === 'stomata' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 bg-[#070e17] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[280px]">
                <svg viewBox="0 0 240 200" className="w-64 h-52">
                  <path
                    d={stomataOpen ? 'M 85,60 C 65,90 65,130 85,160 C 105,140 105,80 85,60 Z' : 'M 98,60 C 80,90 80,130 98,160 C 105,140 105,80 98,60 Z'}
                    fill="#15803d"
                    stroke="#4ade80"
                    strokeWidth="2"
                  />
                  <path
                    d={stomataOpen ? 'M 155,60 C 175,90 175,130 155,160 C 135,140 135,80 155,60 Z' : 'M 142,60 C 160,90 160,130 142,160 C 135,140 135,80 142,60 Z'}
                    fill="#15803d"
                    stroke="#4ade80"
                    strokeWidth="2"
                  />
                  {stomataOpen ? (
                    <ellipse cx="120" cy="110" rx="14" ry="32" fill="#022c22" stroke="#22c55e" strokeWidth="1.5" />
                  ) : (
                    <line x1="120" y1="75" x2="120" y2="145" stroke="#22c55e" strokeWidth="2" />
                  )}
                  <circle cx={stomataOpen ? 75 : 88} cy="110" r="5" fill="#f59e0b" />
                  <circle cx={stomataOpen ? 165 : 152} cy="110" r="5" fill="#f59e0b" />
                </svg>

                <button
                  onClick={() => setStomataOpen(!stomataOpen)}
                  className="mt-3 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
                >
                  {stomataOpen ? 'Close Stomatal Pore (Flaccid Guard Cells)' : 'Open Stomatal Pore (Turgid Guard Cells)'}
                </button>
              </div>

              <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
                <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Epidermal Stomatal Apparatus</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Stomata are microscopic pores in leaf epidermis enclosed by two kidney-shaped guard cells. When water flows into guard cells, they swell, curve outward, and open the stomatal aperture for gas exchange (CO₂ intake, O₂ release) and transpiration water pull.
                </p>
              </div>
            </div>
          )}

          {plantTissueSlide !== 'stomata' && (
            <div className="bg-[#050e18] p-6 rounded-2xl border border-slate-800 text-center space-y-2">
              <span className="text-sm font-bold text-emerald-400 uppercase font-mono">
                {plantTissueSlide.toUpperCase()} TISSUE ARCHITECTURE
              </span>
              <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                {plantTissueSlide === 'meristem' && 'Dividing cells at shoot & root tips (Apical) for length elongation, and Lateral cambium for stem girth thickening.'}
                {plantTissueSlide === 'parenchyma' && 'Unspecialized thin-walled living cells with large intercellular spaces for photosynthesis (chlorenchyma), aquatic buoyancy (aerenchyma), and starch nutrient storage.'}
                {plantTissueSlide === 'collenchyma' && 'Living elongated cells with localized pectin corner thickenings providing flexible mechanical tensile support to tendrils without breaking.'}
                {plantTissueSlide === 'sclerenchyma' && 'Dead cells with uniformly lignified thick secondary walls (husk of coconut, walnut shells) providing rigid protection.'}
                {plantTissueSlide === 'xylem_phloem' && 'Vascular bundles: Xylem conducts unidirectional water/minerals through tracheids & vessels; Phloem translocates bidirectional organic food via perforated sieve tubes & companion cells.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 8: ANIMAL TISSUES & NEURON */}
      {/* ============================================================== */}
      {activeMode === 'animal-tissues' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase">
              Animal Tissue Slide:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { id: 'neuron', label: '1. Nervous Tissue (Multipolar Neuron)' },
                { id: 'epithelial', label: '2. Epithelial Tissue (Squamous/Cuboidal)' },
                { id: 'muscle', label: '3. Muscular (Striated/Smooth/Cardiac)' },
                { id: 'bone', label: '4. Connective Tissue (Bone & Blood)' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setAnimalTissueSlide(s.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                    animalTissueSlide === s.id
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {animalTissueSlide === 'neuron' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 bg-[#070e17] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[280px]">
                <svg viewBox="0 0 300 160" className="w-full h-44">
                  {/* Cyton / Cell Body */}
                  <polygon points="50,80 30,50 15,65 30,85 10,105 30,115 50,95" fill="#4338ca" stroke="#6366f1" strokeWidth="2" />
                  <circle cx="35" cy="85" r="9" fill="#f59e0b" />
                  {/* Axon */}
                  <line x1="50" y1="85" x2="250" y2="85" stroke="#818cf8" strokeWidth="4" />
                  {/* Myelin Sheaths */}
                  {[70, 115, 160, 205].map((x) => (
                    <rect key={x} x={x} y="75" width="35" height="20" rx="6" fill="#047857" stroke="#34d399" strokeWidth="1.5" />
                  ))}
                  {/* Nerve Endings */}
                  <line x1="250" y1="85" x2="280" y2="60" stroke="#818cf8" strokeWidth="2" />
                  <line x1="250" y1="85" x2="285" y2="85" stroke="#818cf8" strokeWidth="2" />
                  <line x1="250" y1="85" x2="280" y2="110" stroke="#818cf8" strokeWidth="2" />
                </svg>
                <span className="text-xs font-mono text-cyan-400 mt-2">Dendrites → Cyton (Soma) → Axon → Synaptic Terminals</span>
              </div>

              <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
                <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Multipolar Neuron Impulses</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Neurons are specialized for electrochemical stimulus conduction. Dendrites receive incoming stimuli, cyton contains nucleus and metabolic machinery, and the myelinated axon conducts electrical action potentials at high velocity (up to 120 m/s) via saltatory conduction across Nodes of Ranvier.
                </p>
              </div>
            </div>
          )}

          {animalTissueSlide !== 'neuron' && (
            <div className="bg-[#050e18] p-6 rounded-2xl border border-slate-800 text-center space-y-2">
              <span className="text-sm font-bold text-emerald-400 uppercase font-mono">
                {animalTissueSlide.toUpperCase()} TISSUE PROFILE
              </span>
              <p className="text-xs text-slate-300 max-w-xl mx-auto leading-relaxed">
                {animalTissueSlide === 'epithelial' && 'Protective sheets resting on a basement membrane: Simple Squamous (lung alveoli), Stratified Squamous (skin epidermis), Cuboidal (kidney tubules), and Ciliated Columnar (respiratory tract).'}
                {animalTissueSlide === 'muscle' && 'Contractile tissue with actin/myosin fibers: Striated (voluntary, multinucleated, skeletal), Smooth (involuntary, spindle-shaped, iris/gut), and Cardiac (involuntary, branched, intercalated discs).'}
                {animalTissueSlide === 'bone' && 'Connective matrices: Bone (rigid calcium-phosphate matrix with osteocytes in concentric Haversian canals) and Blood (fluid plasma carrying erythrocytes, leukocytes, and thrombocytes).'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 9: MITOSIS CELL DIVISION */}
      {/* ============================================================== */}
      {activeMode === 'mitosis' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase">
              Mitosis Step-by-Step Phase Viewer:
            </span>
            <div className="flex gap-1.5">
              {MITOSIS_STAGES.map((stg, idx) => (
                <button
                  key={stg.id}
                  onClick={() => setMitosisStageIdx(idx)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition ${
                    mitosisStageIdx === idx
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {stg.name.split('.')[1]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 bg-[#070e17] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[300px]">
              <svg viewBox="0 0 260 200" className="w-64 h-52">
                <ellipse cx="130" cy="100" rx="95" ry="75" fill="#04785722" stroke="#10b981" strokeWidth="3" />
                <circle cx="50" cy="100" r="6" fill="#f59e0b" />
                <circle cx="210" cy="100" r="6" fill="#f59e0b" />
                {/* Metaphase alignment along equatorial line */}
                {mitosisStageIdx === 2 && (
                  <g>
                    <line x1="130" y1="40" x2="130" y2="160" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
                    {[65, 85, 115, 135].map((y, i) => (
                      <g key={i} transform={`translate(130, ${y})`}>
                        <line x1="-8" y1="-8" x2="8" y2="8" stroke="#a855f7" strokeWidth="3" />
                        <line x1="-8" y1="8" x2="8" y2="-8" stroke="#a855f7" strokeWidth="3" />
                        <circle cx="0" cy="0" r="2.5" fill="#facc15" />
                      </g>
                    ))}
                  </g>
                )}
                {/* Anaphase sister chromatids pulling to poles */}
                {mitosisStageIdx === 3 && (
                  <g>
                    {[65, 85, 115, 135].map((y, i) => (
                      <g key={i}>
                        <path d={`M 95,${y - 6} L 85,${y} L 95,${y + 6}`} fill="none" stroke="#a855f7" strokeWidth="2.5" />
                        <path d={`M 165,${y - 6} L 175,${y} L 165,${y + 6}`} fill="none" stroke="#a855f7" strokeWidth="2.5" />
                      </g>
                    ))}
                  </g>
                )}
              </svg>
            </div>

            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">{currentMitosis.name}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{currentMitosis.desc}</p>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400">
                <span className="text-cyan-400 font-bold block mb-1">Equational Division:</span>
                Mother cell (2n = diploid) divides into two genetically identical daughter cells (2n = diploid) for organism growth, tissue repair, and wound healing.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 10: CROP NUTRIENT MANAGEMENT (NPK & LEAF DEFICIENCY) */}
      {/* ============================================================== */}
      {activeMode === 'food-crop-nutrients' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Interactive Leaf Symptom Simulator */}
            <div className="lg:col-span-7 bg-[#050e18] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[300px]">
              <svg viewBox="0 0 200 240" className="w-56 h-64">
                {/* Stem */}
                <path d="M 100,220 Q 95,150 100,20" fill="none" stroke="#15803d" strokeWidth="6" />
                {/* Leaf Blade with dynamic color depending on N-P-K */}
                <path
                  d="M 100,30 Q 30,100 80,180 Q 98,190 100,190 Q 102,190 120,180 Q 170,100 100,30 Z"
                  fill={
                    nitrogenLevel < 35
                      ? '#fef08a' // Yellow chlorosis from low nitrogen
                      : phosphorusLevel < 35
                      ? '#701a75' // Purple discoloration from low phosphorus
                      : potassiumLevel < 35
                      ? '#b45309' // Brown scorching from low potassium
                      : '#15803d' // Healthy vibrant green
                  }
                  stroke="#166534"
                  strokeWidth="2.5"
                  className="transition-colors duration-500"
                />
                {/* Leaf Veins */}
                <path d="M 100,40 Q 98,120 100,185" fill="none" stroke="#22c55e" strokeWidth="2.5" opacity="0.6" />
                <path d="M 100,80 Q 70,70 50,85" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
                <path d="M 100,80 Q 130,70 150,85" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
                <path d="M 100,120 Q 75,110 65,130" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
                <path d="M 100,120 Q 125,110 135,130" fill="none" stroke="#22c55e" strokeWidth="1.5" opacity="0.6" />
              </svg>

              <div className="text-center mt-2 font-mono text-xs">
                <span className="text-white font-bold block">
                  Leaf Status:{' '}
                  {nitrogenLevel < 35
                    ? '⚠️ Severe Chlorosis (Nitrogen Deficiency)'
                    : phosphorusLevel < 35
                    ? '⚠️ Purple Stunting (Phosphorus Deficiency)'
                    : potassiumLevel < 35
                    ? '⚠️ Marginal Scorch / Necrosis (Potassium Deficiency)'
                    : '✅ Healthy Dark Green (Optimal N-P-K)'}
                </span>
              </div>
            </div>

            {/* Sliders & Manure vs Fertilizer */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 font-sans">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">16 Essential Plant Nutrients</h4>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Nitrogen (N) [Vegetative Growth]:</span>
                    <span className="text-amber-400 font-mono font-bold">{nitrogenLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={nitrogenLevel}
                    onChange={(e) => setNitrogenLevel(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Phosphorus (P) [Root & Seed]:</span>
                    <span className="text-purple-400 font-mono font-bold">{phosphorusLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={phosphorusLevel}
                    onChange={(e) => setPhosphorusLevel(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-300">Potassium (K) [Enzymes & Stomata]:</span>
                    <span className="text-orange-400 font-mono font-bold">{potassiumLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={potassiumLevel}
                    onChange={(e) => setPotassiumLevel(Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300">
                <span className="text-emerald-400 font-bold block font-mono">Macronutrients vs Micronutrients:</span>
                <p>• 6 Macronutrients (Large amounts): N, P, K, Ca, Mg, S.</p>
                <p>• 7 Micronutrients (Trace amounts): Fe, Mn, B, Zn, Cu, Mo, Cl.</p>
                <p className="text-[11px] text-slate-400 italic">Organic manure supplies humus and soil crumb aeration, whereas chemical fertilizers supply rapid NPK but risk long-term soil acidification.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 11: CROPPING PATTERNS & IRRIGATION */}
      {/* ============================================================== */}
      {activeMode === 'food-cropping-patterns' && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono font-bold uppercase">
              Field Layout Pattern:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {[
                { id: 'intercropping', label: '1. Intercropping (1:2 Alternate Rows)' },
                { id: 'mixed', label: '2. Mixed Cropping (Wheat + Gram)' },
                { id: 'rotation', label: '3. Crop Rotation (Cereal + Pulse)' },
                { id: 'monoculture', label: '4. Monocropping' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setCroppingPattern(p.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                    croppingPattern === p.id
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Farm Plot */}
            <div className="lg:col-span-7 bg-[#050e18] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[280px]">
              <div className="w-full max-w-md h-52 bg-amber-950/30 rounded-2xl border-2 border-amber-900/80 p-4 grid grid-cols-6 gap-2">
                {Array.from({ length: 24 }).map((_, idx) => {
                  const col = idx % 6;
                  let cropEmoji = '🌾'; // Wheat
                  let cropColor = 'text-amber-300';
                  if (croppingPattern === 'intercropping') {
                    // 1 row maize : 2 rows soyabean
                    cropEmoji = col % 3 === 0 ? '🌽' : '🌱';
                    cropColor = col % 3 === 0 ? 'text-yellow-400' : 'text-emerald-400';
                  } else if (croppingPattern === 'mixed') {
                    cropEmoji = idx % 2 === 0 ? '🌾' : '🫘';
                    cropColor = idx % 2 === 0 ? 'text-amber-300' : 'text-orange-400';
                  } else if (croppingPattern === 'rotation') {
                    cropEmoji = '🌱'; // Legumes fixing N2
                    cropColor = 'text-emerald-400';
                  }
                  return (
                    <div
                      key={idx}
                      className="bg-amber-950/60 rounded-xl border border-amber-800/40 flex items-center justify-center text-xl shadow-inner"
                    >
                      <span className={cropColor}>{cropEmoji}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400 mt-3">
                <span className="text-emerald-400 font-bold">
                  {croppingPattern === 'intercropping' && 'Soyabean + Maize (Specific 1:2 Row Pattern)'}
                  {croppingPattern === 'mixed' && 'Wheat + Mustard/Gram (Mixed Random Seeds)'}
                  {croppingPattern === 'rotation' && 'Rhizobium Legume Pulse Crop Replenishing Soil N₂'}
                  {croppingPattern === 'monoculture' && 'Single Continuous Crop (High Pest Risk)'}
                </span>
                <span>Irrigation: Drip Root Delivery</span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Optimized Crop Harvesting</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {croppingPattern === 'intercropping' &&
                  'Growing two or more crops simultaneously in definite row patterns (e.g. 1 row maize : 2 rows soyabean). Nutrients are extracted from different soil horizons, maximizing sunlight and stopping pests from spreading to all plants.'}
                {croppingPattern === 'mixed' &&
                  'Growing two or more crops simultaneously on the same piece of land without definite row patterns (e.g. wheat + gram, wheat + mustard, groundnut + sunflower). Provides insurance against total crop loss caused by adverse weather.'}
                {croppingPattern === 'rotation' &&
                  'Growing different crops sequentially on pre-planned pieces of land. Cereals alternate with leguminous pulses whose symbiotic Rhizobium root nodules fix free atmospheric nitrogen, naturally restoring soil fertility.'}
                {croppingPattern === 'monoculture' &&
                  'Growing a single crop year after year depletes specific nutrients and makes the entire farm vulnerable to catastrophic single-species pest outbreaks.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 12: CROP PROTECTION & STORAGE MANAGEMENT */}
      {/* ============================================================== */}
      {activeMode === 'food-crop-protection' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 bg-[#050e18] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[280px]">
              <div className="w-full max-w-sm bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Grain Moisture Content:</span>
                  <span className={`font-bold ${grainMoisturePercent <= 9 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {grainMoisturePercent}% {grainMoisturePercent <= 9 ? '(Safe Storage)' : '(Spoilage Risk!)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="18"
                  step="0.5"
                  value={grainMoisturePercent}
                  onChange={(e) => setGrainMoisturePercent(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 text-xs text-slate-300 space-y-2">
                  <span className="text-amber-400 font-bold block font-mono">Post-Harvest Grain Protection:</span>
                  <p>
                    Grains must be sundried to below <strong className="text-emerald-400">9% moisture</strong> before sealed storage. High moisture (&gt;14%) stimulates fungal growth (Aspergillus), enzyme breakdown, and grain weevil (Sitophilus oryzae) breeding, destroying germination capacity.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">Biotic & Abiotic Crop Threats</h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-rose-400 font-bold block font-mono">1. Weeds (Unwanted Competitors):</span>
                  <p className="mt-0.5 text-slate-400">Xanthium (gokhroo), Parthenium (carrot grass), Cyperus (motha) steal nutrients, water, and sunlight, reducing yield by 30-50%.</p>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-amber-400 font-bold block font-mono">2. Insect Pests:</span>
                  <p className="mt-0.5 text-slate-400">Chewing insects cut root/stem/leaf, sucking insects pierce and drain sap, internal borers bore into fruit and stems.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODE 13: ANIMAL HUSBANDRY & COMPOSITE FISH CULTURE */}
      {/* ============================================================== */}
      {activeMode === 'food-animal-husbandry' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Cross-Section of Composite Fish Culture Pond */}
            <div className="lg:col-span-7 bg-[#050e18] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-full h-56 rounded-2xl border-2 border-cyan-800 bg-gradient-to-b from-sky-900/40 via-blue-950/60 to-slate-950 relative overflow-hidden p-3 flex flex-col justify-between">
                {/* Surface Zone */}
                <div className="border-b border-sky-500/30 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🐟</span>
                    <span className="text-xs font-mono font-bold text-sky-300">Catla — Surface Feeder (Zooplankton)</span>
                  </div>
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">Top Layer</span>
                </div>

                {/* Middle Column Zone */}
                <div className="border-b border-cyan-500/30 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🐠</span>
                    <span className="text-xs font-mono font-bold text-cyan-300">Rohu — Middle Column Feeder (Algae/Plants)</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">Mid Water</span>
                </div>

                {/* Bottom Benthic Zone */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🐡</span>
                    <span className="text-xs font-mono font-bold text-amber-300">Mrigal & Common Carp — Bottom Feeders (Detritus)</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">Benthic Mud</span>
                </div>
              </div>

              <div className="flex items-center justify-between w-full text-xs font-mono text-emerald-400 mt-3">
                <span>Food Competition: 0% (Ecological Niche Stratification)</span>
                <span>Pond Yield: Maximum (100% Resource Exploitation)</span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 font-sans">
              <h4 className="font-bold text-emerald-400 font-mono text-sm uppercase">NCERT Composite Fish Culture</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                In composite fish culture, a combination of five or six fish species is selected in a single fish pond. They possess completely different food habits and feed at different water depths so that they do not compete for food.
              </p>
              <ul className="text-xs text-slate-300 space-y-1 font-mono">
                <li>• <strong className="text-sky-400">Catla:</strong> Surface feeder.</li>
                <li>• <strong className="text-cyan-400">Rohu:</strong> Middle-zone column feeder.</li>
                <li>• <strong className="text-amber-400">Mrigal & Common Carp:</strong> Bottom benthic feeders.</li>
                <li>• <strong className="text-emerald-400">Grass Carp:</strong> Consumes aquatic weed growth.</li>
              </ul>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                Also includes <strong className="text-amber-300">Apiculture</strong> with Italian bee (<em className="italic">Apis mellifera</em>) for high commercial honey yield and docile temperament.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
