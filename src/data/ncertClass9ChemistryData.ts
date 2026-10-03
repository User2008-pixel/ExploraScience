import { ConceptItem } from '../types/science';

export const NCERT_CLASS9_CHEMISTRY_CONCEPTS: ConceptItem[] = [
  // =========================================================================
  // CHAPTER 1: MATTER IN OUR SURROUNDINGS
  // =========================================================================
  {
    id: 'ncert9-chem-particulate-nature-matter',
    title: 'Physical Nature & Particulate Characteristics of Matter',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Particles of matter have spaces between them, move constantly, and attract each other',
    description:
      'All matter is particulate rather than continuous. Particles possess kinetic energy that increases with temperature, causing intermixing of different particles on their own known as diffusion. The attractive intermolecular forces vary: strongest in solids, moderate in liquids, and weakest in gases.',
    formulaLaTeX: 'KE = \\frac{1}{2} m v^2 \\propto T \\quad \\text{and} \\quad \\text{Rate of Diffusion} \\propto \\sqrt{\\frac{T}{M}}',
    formulaExplanation:
      'As temperature T rises, average kinetic energy of particles increases, causing particles to move faster and diffuse rapidly into the intermolecular spaces of other substances (such as potassium permanganate crystals dispersing in water).',
    simulationType: 'matter-surroundings',
    variables: [
      {
        id: 'temperatureC',
        name: 'Kinetic Temperature',
        symbol: 'T',
        unit: '°C',
        min: -20,
        max: 120,
        step: 5,
        defaultValue: 25,
        description: 'Governs the average velocity and vibration of constituent matter particles.',
      },
      {
        id: 'particleSpacing',
        name: 'Intermolecular Space',
        symbol: 'd_{\\text{space}}',
        unit: 'nm',
        min: 0.1,
        max: 5.0,
        step: 0.1,
        defaultValue: 0.4,
        description: 'Average spacing between adjacent particles in the matrix.',
      },
    ],
    prediction: {
      prompt: 'NCERT Matter Diffusion Inquiry: Incense Stick & Potassium Permanganate',
      scenario:
        'Why does the smell of hot sizzling food or lit incense reach you several meters away in seconds, while the smell of cold food requires you to go close?',
      choices: [
        {
          id: 'p1',
          text: 'Higher temperature gives vapor particles greater kinetic energy, so diffusion through air particles occurs much faster.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p2',
          text: 'Cold food does not contain any particles of matter until it is heated by a flame.',
          isCorrect: false,
          misconceptionExplanation: 'All matter is composed of particles regardless of temperature. At lower temperatures, particles possess less kinetic energy and diffuse very slowly.',
        },
        {
          id: 'p3',
          text: 'Air molecules only attract hot particles while completely repelling cold particles.',
          isCorrect: false,
          misconceptionExplanation: 'Air molecules interact through universal physical collisions, not selective thermal repulsion.',
        },
      ],
      correctExplanation:
        'At higher temperatures, particles possess higher kinetic energy (KE ∝ T) and move with high speeds. Intermolecular collisions and diffusion between air particles happen rapidly, allowing volatile aroma molecules to reach our olfactory receptors meters away.',
      relevantFormula: 'v_{\\text{rms}} = \\sqrt{\\frac{3k_B T}{m}}',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-states-of-matter', name: 'States of Matter: Solid, Liquid, Gas', subject: 'chemistry' },
      { id: 'ncert9-chem-change-of-state-latent-heat', name: 'Thermal Change of State & Latent Heat', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Dissolving Sugar or Salt in Water',
        description: 'Sugar particles occupy the empty spaces between water molecules without increasing total liquid volume significantly.',
      },
      {
        title: 'Aquatic Life Breathing Dissolved Gases',
        description: 'Atmospheric oxygen and carbon dioxide diffuse continuously across water surfaces, sustaining fish and aquatic plants.',
      },
      {
        title: 'Potassium Permanganate Dispersion',
        description: 'Just 2-3 tiny crystals of KMnO₄ can impart a rich purple color to over 1000 liters of water through continuous particulate division.',
      },
    ],
  },

  {
    id: 'ncert9-chem-states-of-matter',
    title: 'States of Matter: Solid, Liquid & Gas',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Comparative analysis of rigidity, compressibility, fluid volume, and kinetic motion',
    description:
      'Solids possess fixed shape, distinct boundaries, and fixed volume due to strong intermolecular cohesion. Liquids have fixed volume but no fixed shape, taking the shape of the container (fluidity). Gases have neither fixed shape nor fixed volume, exhibiting maximum compressibility and filling their container completely.',
    formulaLaTeX: '\\text{Solids: } F_{\\text{attract}} \\gg KE \\quad | \\quad \\text{Liquids: } F_{\\text{attract}} \\approx KE \\quad | \\quad \\text{Gases: } KE \\gg F_{\\text{attract}}',
    formulaExplanation:
      'The physical state is determined by the competition between cohesive intermolecular attraction holding particles together and thermal kinetic energy causing random translational displacement.',
    simulationType: 'matter-surroundings',
    variables: [
      {
        id: 'temperatureC',
        name: 'System Temperature',
        symbol: 'T',
        unit: '°C',
        min: -50,
        max: 150,
        step: 5,
        defaultValue: 20,
        description: 'Determines whether substance exists as solid crystal, viscous liquid, or free gas.',
      },
      {
        id: 'pressureAtm',
        name: 'Chamber Pressure',
        symbol: 'P',
        unit: 'atm',
        min: 0.5,
        max: 5.0,
        step: 0.5,
        defaultValue: 1.0,
        description: 'External force compressing the fluid molecules together.',
      },
    ],
    prediction: {
      prompt: 'NCERT Syringe Compressibility Experiment',
      scenario:
        'Three identical sealed 100 mL syringes are filled respectively with: (1) Chalk powder (solid), (2) Water (liquid), and (3) Air (gas). When pistons are pushed with equal thumb force, what happens?',
      choices: [
        {
          id: 'p1',
          text: 'All three compress by the exact same distance because syringe volume is 100 mL.',
          isCorrect: false,
          misconceptionExplanation: 'Particles in solids and liquids already touch with minimal intermolecular gaps, making them virtually incompressible compared to gases.',
        },
        {
          id: 'p2',
          text: 'The air syringe compresses significantly, while chalk and water show almost zero noticeable compression.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Water compresses more than air because liquid water molecules are soft and flexible.',
          isCorrect: false,
          misconceptionExplanation: 'Water molecules are packed tightly in the liquid phase; hydraulic brake fluids rely directly on the incompressibility of liquids.',
        },
      ],
      correctExplanation:
        'Gases have immense intermolecular spaces between particles compared to their particle size. Applying pressure easily forces gaseous molecules closer together, explaining how high volumes of LPG (Liquefied Petroleum Gas) and CNG (Compressed Natural Gas) can be stored in portable cylinders.',
      relevantFormula: 'P V = n R T \\implies \\Delta V_{\\text{gas}} \\gg \\Delta V_{\\text{liquid}}',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-particulate-nature-matter', name: 'Particulate Nature of Matter', subject: 'chemistry' },
      { id: 'ncert9-chem-sublimation-pressure', name: 'Sublimation & Effect of Pressure', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'CNG & LPG Fuel Cylinders',
        description: 'High compressibility allows hundreds of liters of methane or butane gas to be compressed into compact steel cylinders for transport.',
      },
      {
        title: 'Hydraulic Automobile Brakes',
        description: 'Because liquids are practically incompressible, pressure applied to the brake pedal transmits instantaneously to all wheel calipers.',
      },
      {
        title: 'Hospital Oxygen Cylinders',
        description: 'Compressed medical oxygen gas provides life-saving respiratory support in intensive care units and ambulances.',
      },
    ],
  },

  {
    id: 'ncert9-chem-change-of-state-latent-heat',
    title: 'Thermal Change of State & Latent Heat',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Latent heat of fusion and vaporization: why temperature remains constant during phase change',
    description:
      'When ice melts or water boils, heat energy is continuously absorbed, yet a thermometer shows no rise in temperature until the entire phase transition is complete. This hidden heat—the latent heat of fusion (3.34 × 10⁵ J/kg for ice) and latent heat of vaporization (2.26 × 10⁶ J/kg for steam)—is consumed entirely to overcome intermolecular attractive bonds.',
    formulaLaTeX: 'Q = m L_f \\quad (\\text{Melting at } 0^\\circ\\text{C}) \\quad | \\quad Q = m L_v \\quad (\\text{Boiling at } 100^\\circ\\text{C})',
    formulaExplanation:
      'During phase transitions, heat energy does not increase average molecular kinetic energy (temperature), but instead increases potential energy by breaking crystalline lattice or liquid cohesive bonds.',
    simulationType: 'matter-surroundings',
    variables: [
      {
        id: 'heatInputJoules',
        name: 'Heat Supplied',
        symbol: 'Q',
        unit: 'kJ',
        min: 0,
        max: 500,
        step: 10,
        defaultValue: 150,
        description: 'Thermal energy transferred into the substance sample.',
      },
      {
        id: 'sampleMassGrams',
        name: 'Ice/Water Mass',
        symbol: 'm',
        unit: 'g',
        min: 10,
        max: 200,
        step: 10,
        defaultValue: 50,
        description: 'Mass of the changing sample.',
      },
    ],
    prediction: {
      prompt: 'NCERT Steam vs Boiling Water Thermal Burn Paradox',
      scenario:
        'Which causes more severe thermal burns at 100°C (373 K): boiling liquid water or gaseous steam?',
      choices: [
        {
          id: 'p1',
          text: 'Boiling water, because liquid is denser and wets the skin more thoroughly.',
          isCorrect: false,
          misconceptionExplanation: 'Even though boiling water is dense, steam carries an enormous additional reservoir of hidden latent heat of vaporization that releases upon condensing.',
        },
        {
          id: 'p2',
          text: 'Steam at 100°C causes significantly more severe burns because it releases an additional 2260 kJ/kg of latent heat upon condensing on skin.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Both produce identical burn severity because both are at exactly 100°C.',
          isCorrect: false,
          misconceptionExplanation: 'Temperature measures average kinetic energy, but heat transfer during contact includes latent heat of phase transition: Q_steam = m·L_v + m·c·ΔT.',
        },
      ],
      correctExplanation:
        'Particles in steam at 373 K have absorbed 2.26 × 10⁶ Joules per kilogram of latent heat of vaporization during the transition from liquid to gas. When steam touches cooler skin, it instantly condenses back into liquid water, releasing this huge quantity of latent heat directly into epidermal tissues.',
      relevantFormula: 'Q_{\\text{steam burn}} = m L_v + m c \\Delta T \\gg Q_{\\text{water burn}} = m c \\Delta T',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-evaporation-cooling', name: 'Evaporation Dynamics & Cooling', subject: 'chemistry' },
      { id: 'ncert9-chem-states-of-matter', name: 'States of Matter', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Ice at 273 K Cools Drinks Better than Water at 273 K',
        description: 'To melt, each gram of ice absorbs 334 Joules of latent heat from the drink, cooling it far more effectively than water at the same temperature.',
      },
      {
        title: 'Food Steaming in Pressure Cookers',
        description: 'Condensed steam delivers concentrated latent heat deep into vegetables and rice, cooking them faster and preserving nutrients.',
      },
      {
        title: 'Autoclave Sterilization in Hospitals',
        description: 'Pressurized steam at 121°C rapidly transfers latent heat to destroy all bacterial endospores on surgical instruments.',
      },
    ],
  },

  {
    id: 'ncert9-chem-sublimation-pressure',
    title: 'Sublimation, Deposition & Effect of Pressure',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Direct solid-to-gas phase transitions and the liquefaction of gases under high pressure',
    description:
      'Sublimation is the direct transition from solid to gaseous state without passing through the liquid phase upon heating (e.g., Ammonium chloride, Camphor, Naphthalene, Iodine). Deposition is the direct gaseous-to-solid transition. Applying high pressure and lowering temperature can compress gas particles close enough to liquefy gases, or freeze carbon dioxide into "Dry Ice" (solid CO₂).',
    formulaLaTeX: '\\text{Solid} \\xrightleftharpoons[\\text{Deposition}]{\\text{Sublimation}} \\text{Gas} \\quad | \\quad P_{\\text{triple pt}} > 1 \\text{ atm (for Dry Ice)}',
    formulaExplanation:
      'When 1 atm pressure is applied, solid CO₂ sublimes directly into gas at -78.5°C without wetting surfaces, hence named dry ice. Lowering pressure from 1 atm allows liquefied gases to expand and vaporize instantly.',
    simulationType: 'matter-surroundings',
    variables: [
      {
        id: 'temperatureC',
        name: 'Heating Temperature',
        symbol: 'T',
        unit: '°C',
        min: 20,
        max: 380,
        step: 10,
        defaultValue: 80,
        description: 'Temperature applied to camphor or ammonium chloride in inverted funnel setup.',
      },
      {
        id: 'pressureAtm',
        name: 'Applied Gas Pressure',
        symbol: 'P',
        unit: 'atm',
        min: 1,
        max: 60,
        step: 5,
        defaultValue: 1,
        description: 'Pressure used to compress gas into liquid phase.',
      },
    ],
    prediction: {
      prompt: 'NCERT Dry Ice Decompression Inquiry',
      scenario:
        'Solid carbon dioxide (dry ice) is stored under high pressure. If the container pressure is reduced to 1 atmosphere without changing room temperature, what happens?',
      choices: [
        {
          id: 'p1',
          text: 'It melts into liquid carbon dioxide, forming a cold carbonated puddle.',
          isCorrect: false,
          misconceptionExplanation: 'Carbon dioxide cannot exist as a liquid at pressures below 5.11 atmospheres (its triple point pressure). At 1 atm, it goes straight to gas.',
        },
        {
          id: 'p2',
          text: 'It sublimes directly into gaseous carbon dioxide without leaving any liquid residue.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'It decomposes into black carbon soot and oxygen gas.',
          isCorrect: false,
          misconceptionExplanation: 'Phase change is a physical change; the molecular covalent bonds of CO₂ remain completely intact.',
        },
      ],
      correctExplanation:
        'Solid CO₂ sublimes directly into gaseous state at 1 atmosphere of pressure because its triple point lies well above atmospheric pressure (5.11 atm at -56.6°C). Because it transforms into gas without forming a wet liquid film, it is popularly called "Dry Ice".',
      relevantFormula: '\\text{CO}_2(s) \\xrightarrow{1\\text{ atm, } > -78.5^\\circ\\text{C}} \\text{CO}_2(g)',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-change-of-state-latent-heat', name: 'Thermal Change of State', subject: 'chemistry' },
      { id: 'ncert9-chem-states-of-matter', name: 'States of Matter', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Naphthalene Balls in Wardrobes',
        description: 'Mothballs disappear completely over months without leaving stains because naphthalene sublimes slowly into insect-repelling vapors.',
      },
      {
        title: 'Preserving Vaccines with Dry Ice',
        description: 'Solid CO₂ maintains temperatures of -78.5°C without producing water drainage, essential for shipping mRNA vaccines globally.',
      },
      {
        title: 'Purification of Camphor & Ammonium Chloride',
        description: 'Sublimation in an inverted funnel with cotton plug separates volatile NH₄Cl from non-volatile sand and salt impurities.',
      },
    ],
  },

  {
    id: 'ncert9-chem-evaporation-cooling',
    title: 'Evaporation Dynamics & Factors Affecting Evaporative Cooling',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Surface phenomenon of vaporization below boiling point and how it produces cooling',
    description:
      'Evaporation is a surface phenomenon where energetic surface liquid molecules overcome attractive intermolecular bonds and escape into the vapor phase below the boiling point. The rate increases with greater surface area, higher temperature, higher wind speed, and lower air humidity. As energetic particles leave, the average kinetic energy of remaining liquid drops, causing evaporative cooling.',
    formulaLaTeX: '\\text{Rate} \\propto \\frac{\\text{Surface Area} \\times T \\times \\text{Wind Speed}}{\\text{Humidity}} \\quad | \\quad \\Delta T_{\\text{cooling}} \\propto \\frac{Q_{\\text{absorbed}}}{m c}',
    formulaExplanation:
      'Molecules at the liquid surface absorb latent heat of vaporization from their immediate surroundings to break intermolecular attractions, thereby drawing thermal energy away and cooling the surrounding medium.',
    simulationType: 'matter-surroundings',
    variables: [
      {
        id: 'surfaceAreaCm2',
        name: 'Surface Area',
        symbol: 'A',
        unit: 'cm²',
        min: 10,
        max: 500,
        step: 25,
        defaultValue: 100,
        description: 'Area exposed to air (e.g. saucer vs tea cup).',
      },
      {
        id: 'ambientHumidityPercent',
        name: 'Relative Humidity',
        symbol: 'RH',
        unit: '%',
        min: 10,
        max: 95,
        step: 5,
        defaultValue: 40,
        description: 'Amount of water vapor already present in surrounding air.',
      },
      {
        id: 'windSpeedKmh',
        name: 'Wind Velocity',
        symbol: 'v_{\\text{wind}}',
        unit: 'km/h',
        min: 0,
        max: 40,
        step: 5,
        defaultValue: 15,
        description: 'Air currents removing saturated vapor boundary layers.',
      },
    ],
    prediction: {
      prompt: 'NCERT Earthen Pot (Matka) & Desert Cooler Inquiry',
      scenario:
        'Why does water kept in an earthen pot (matka) become pleasantly cool during hot dry summer months, but cools far less on a humid rainy monsoon day?',
      choices: [
        {
          id: 'p1',
          text: 'Clay contains cooling chemicals that deactivate when it rains.',
          isCorrect: false,
          misconceptionExplanation: 'Clay pots cool purely through physics (evaporative cooling of water seeping through microscopic pores), not chemical reactions.',
        },
        {
          id: 'p2',
          text: 'Low summer humidity accelerates water evaporation through porous pot walls, drawing latent heat from the remaining water.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Rainwater physically penetrates into the pot and heats up the water.',
          isCorrect: false,
          misconceptionExplanation: 'High atmospheric humidity saturates the air, reducing the evaporation rate and thus curtailing evaporative cooling.',
        },
      ],
      correctExplanation:
        'An earthen pot has millions of tiny microscopic pores through which water continuously seeps out. In hot, dry weather, low air humidity and high temperature cause this surface water to evaporate rapidly. To convert into vapor, it absorbs the latent heat of vaporization from the pot and remaining water, dropping its temperature.',
      relevantFormula: 'Q = m_{\\text{evap}} L_v = m_{\\text{water}} c \\Delta T',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-change-of-state-latent-heat', name: 'Thermal Change of State & Latent Heat', subject: 'chemistry' },
      { id: 'ncert9-chem-states-of-matter', name: 'States of Matter', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Desert Air Coolers in Dry Climates',
        description: 'Desert coolers spray water over straw pads. Dry warm outdoor air drawn through the wet pads causes rapid evaporation, dropping ambient room temperature by 8°C–12°C.',
      },
      {
        title: 'Wearing Cotton Clothes in Summer',
        description: 'Cotton is a great water absorber. It wicks body sweat to the outer surface exposed to air, facilitating fast evaporation and keeping skin cool.',
      },
      {
        title: 'Acetone/Nail Polish Remover on Palms',
        description: 'Pouring volatile acetone or alcohol onto your palm absorbs body latent heat immediately, creating an instant cooling sensation.',
      },
    ],
  },

  // =========================================================================
  // CHAPTER 2: IS MATTER AROUND US PURE?
  // =========================================================================
  {
    id: 'ncert9-chem-mixtures-homogeneous-heterogeneous',
    title: 'Pure Substances vs Mixtures: Homogeneous & Heterogeneous',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Distinguishing pure elements/compounds from variable physical combinations',
    description:
      'A pure substance consists of a single type of particle with fixed composition and sharp physical constants. A mixture contains two or more pure substances physically mixed in any ratio without chemical bonding. Homogeneous mixtures have uniform composition throughout (e.g. sugar syrup, brass alloy), while heterogeneous mixtures have physically distinct parts (e.g. iron filings and sulfur, oil and water).',
    formulaLaTeX: '\\text{Mixture} = \\sum_{i=1}^n \\text{Component}_i \\quad (\\text{Variable proportions, separable by physical means})',
    formulaExplanation:
      'Unlike compounds which require chemical reactions to form or break, mixture components retain their individual physical properties and can be separated using physical techniques like filtration, magnetism, or distillation.',
    simulationType: 'solutions-colloids',
    variables: [
      {
        id: 'componentRatio',
        name: 'Solute-to-Solvent Ratio',
        symbol: 'R_{\\text{mix}}',
        unit: '%',
        min: 5,
        max: 50,
        step: 5,
        defaultValue: 20,
        description: 'Proportion of blended components in the mixture matrix.',
      },
      {
        id: 'particleDispersionSize',
        name: 'Particle Dispersion Size',
        symbol: 'r_p',
        unit: 'nm',
        min: 0.5,
        max: 500,
        step: 5,
        defaultValue: 1.0,
        description: 'Size scale determining optical homogeneity vs phase boundaries.',
      },
    ],
    prediction: {
      prompt: 'NCERT Iron Filings + Sulfur Powder: Mixture vs Compound',
      scenario:
        'When iron filings and sulfur powder are mixed in a mortar, a bar magnet pulls out the iron. If the mixture is heated strongly until it glows red, cooled, and crushed, does the magnet still attract the iron?',
      choices: [
        {
          id: 'p1',
          text: 'Yes, because iron atoms are permanently magnetic in all chemical states.',
          isCorrect: false,
          misconceptionExplanation: 'In the compound Iron(II) Sulfide (FeS), iron loses its elemental ferromagnetism because electrons have formed chemical bonds with sulfur.',
        },
        {
          id: 'p2',
          text: 'No, because a chemical reaction created a new compound, Iron(II) Sulfide (FeS), which is non-magnetic.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Yes, but only if sulfur is removed by washing with carbon disulfide solvent first.',
          isCorrect: false,
          misconceptionExplanation: 'CS₂ only dissolves uncombined elemental sulfur from a mixture; it cannot dissolve chemically bonded sulfur in FeS.',
        },
      ],
      correctExplanation:
        'Heating supplies activation energy for a chemical reaction: Fe(s) + S(s) → FeS(s). The product is a pure compound with entirely new chemical and physical properties: it is a black non-magnetic solid that releases rotten-egg smelling H₂S gas upon adding dilute sulfuric acid.',
      relevantFormula: '\\text{Fe}(s) + \\text{S}(s) \\xrightarrow{\\Delta} \\text{FeS}(s)',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-elements-compounds', name: 'Elements vs Compounds', subject: 'chemistry' },
      { id: 'ncert9-chem-solutions-concentration', name: 'Solutions & Concentration', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Brass (Copper + Zinc Alloy)',
        description: 'Brass is a homogeneous solid solution of ~70% Copper and ~30% Zinc that cannot be separated by physical filtration, yet classified as a mixture because its ratio can vary.',
      },
      {
        title: 'Air as a Gaseous Mixture',
        description: 'Air is a homogeneous mixture of 78% Nitrogen, 21% Oxygen, Argon, CO₂, and trace gases that can be separated by fractional distillation.',
      },
      {
        title: 'Gunpowder (Black Powder)',
        description: 'A heterogeneous mixture of potassium nitrate (75%), charcoal (15%), and sulfur (10%) that burns violently when ignited.',
      },
    ],
  },

  {
    id: 'ncert9-chem-solutions-concentration',
    title: 'Solutions, Solubility & Concentration Calculations',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Mass-by-mass and mass-by-volume percentages, saturated vs unsaturated solutions',
    description:
      'A true solution is a homogeneous mixture of solute particles (< 1 nm) dissolved in a solvent. Solubility is the maximum amount of solute that dissolves in 100 g of solvent at a specific temperature. A solution that cannot dissolve any more solute at that temperature is saturated. Heating increases the solubility of most solid solutes.',
    formulaLaTeX: '\\text{Mass } \\% = \\frac{\\text{Mass of Solute}}{\\text{Mass of Solution}} \\times 100 \\quad | \\quad \\text{Mass/Vol } \\% = \\frac{\\text{Mass of Solute}}{\\text{Volume of Solution}} \\times 100',
    formulaExplanation:
      'Mass of solution equals the sum of solute mass and solvent mass: Mass of Solution = Mass of Solute + Mass of Solvent.',
    simulationType: 'solutions-colloids',
    variables: [
      {
        id: 'soluteMassGrams',
        name: 'Solute Mass (e.g. Salt)',
        symbol: 'm_{\\text{solute}}',
        unit: 'g',
        min: 5,
        max: 80,
        step: 5,
        defaultValue: 36,
        description: 'Quantity of solid solute added to the beaker.',
      },
      {
        id: 'solventMassGrams',
        name: 'Solvent Mass (Water)',
        symbol: 'm_{\\text{solvent}}',
        unit: 'g',
        min: 50,
        max: 300,
        step: 25,
        defaultValue: 100,
        description: 'Mass of water solvent (density = 1.0 g/mL).',
      },
      {
        id: 'temperatureC',
        name: 'Solution Temperature',
        symbol: 'T',
        unit: '°C',
        min: 10,
        max: 90,
        step: 5,
        defaultValue: 25,
        description: 'Higher temperature increases intermolecular cavities, boosting solubility limit.',
      },
    ],
    prediction: {
      prompt: 'NCERT Exemplar Concentration Numerical',
      scenario:
        'A solution is prepared by dissolving 40 g of common salt (NaCl) in 320 g of water. What is the mass percentage concentration of this salt solution?',
      choices: [
        {
          id: 'p1',
          text: '12.5% (calculated as 40 ÷ 320 × 100)',
          isCorrect: false,
          misconceptionExplanation: 'A common mistake is dividing by solvent mass instead of total solution mass (solute + solvent = 360 g).',
        },
        {
          id: 'p2',
          text: '11.11% (calculated as 40 ÷ 360 × 100)',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: '40%, because 40 g of salt was added.',
          isCorrect: false,
          misconceptionExplanation: 'Percentage represents proportion of solute relative to total solution mass.',
        },
      ],
      correctExplanation:
        'Total mass of solution = Mass of solute (40 g) + Mass of solvent (320 g) = 360 g. Mass percentage = (40 / 360) × 100 = 11.11%.',
      relevantFormula: '\\text{Mass } \\% = \\frac{40}{40 + 320} \\times 100 = 11.11\\%',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-suspensions-colloids-tyndall', name: 'Suspensions, Colloids & Tyndall Effect', subject: 'chemistry' },
      { id: 'ncert9-chem-mixtures-homogeneous-heterogeneous', name: 'Pure Substances vs Mixtures', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Oral Rehydration Salts (ORS)',
        description: 'Accurate electrolyte concentration (glucose 13.5 g/L, NaCl 2.6 g/L) prevents cellular dehydration during gastrointestinal illness.',
      },
      {
        title: 'Intravenous Normal Saline (0.9% w/v NaCl)',
        description: 'Hospital IV drip bags must be strictly isotonic to red blood cells (0.9% mass/volume) to prevent cell swelling or shrinkage.',
      },
      {
        title: 'Crystallization from Saturated Sugar Syrup',
        description: 'Cooling a hot saturated sugar solution causes excess dissolved sucrose to precipitate as rock candy crystals.',
      },
    ],
  },

  {
    id: 'ncert9-chem-suspensions-colloids-tyndall',
    title: 'Suspensions, Colloids & The Tyndall Effect',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Light scattering, particle size spectrum, and colloidal stability vs gravity settling',
    description:
      'Matter mixtures span a particle size hierarchy: True solutions (< 1 nm, homogeneous, do not scatter light), Colloids (1 nm – 1000 nm, heterogeneous appearance of homogeneity, scatter light via Tyndall effect, stable without settling), and Suspensions (> 1000 nm, heterogeneous, cloudy, particles settle under gravity, scatter light until settled).',
    formulaLaTeX: 'I_{\\text{scattered}} \\propto \\frac{d^6}{\\lambda^4} \\quad (\\text{Tyndall / Rayleigh Scattering})',
    formulaExplanation:
      'Colloidal particles are large enough to reflect and scatter visible light photons in all directions, illuminating the path of a laser beam through milk, fog, or starch solution.',
    simulationType: 'solutions-colloids',
    variables: [
      {
        id: 'laserWavelengthNm',
        name: 'Laser Beam Wavelength',
        symbol: '\\lambda',
        unit: 'nm',
        min: 400,
        max: 700,
        step: 50,
        defaultValue: 532,
        description: 'Green laser (532 nm) scatters prominently through colloidal milk or gelatin.',
      },
      {
        id: 'dispersionParticleSizeNm',
        name: 'Dispersed Phase Particle Size',
        symbol: 'd_{\\text{particle}}',
        unit: 'nm',
        min: 0.5,
        max: 2000,
        step: 10,
        defaultValue: 50,
        description: '<1 nm = True Solution, 1-1000 nm = Colloid (Tyndall active), >1000 nm = Suspension.',
      },
    ],
    prediction: {
      prompt: 'NCERT Tyndall Effect Identification Challenge',
      scenario:
        'A student shines a narrow laser pointer through two transparent beakers: Beaker A contains Copper Sulfate solution, Beaker B contains Milk diluted with water. In which beaker is the beam path visible?',
      choices: [
        {
          id: 'p1',
          text: 'Beaker A only, because copper sulfate has a vibrant blue color.',
          isCorrect: false,
          misconceptionExplanation: 'Copper sulfate forms a true solution (particle size < 1 nm). Color does not scatter light; photons pass through undisturbed without path illumination.',
        },
        {
          id: 'p2',
          text: 'Beaker B only, because colloidal fat and protein droplets scatter the laser light (Tyndall Effect).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'In both beakers equally, because lasers always illuminate their paths in any transparent liquid.',
          isCorrect: false,
          misconceptionExplanation: 'A laser beam path is completely invisible in pure water and true solutions because particles are too small to scatter light.',
        },
      ],
      correctExplanation:
        'Diluted milk is a colloidal emulsion containing fat and protein globules with diameters between 1 nm and 1000 nm. These particles scatter visible light in all directions (Tyndall Effect), making the laser beam track visible. In copper sulfate solution, ions are sub-nanometer and do not scatter visible light.',
      relevantFormula: '\\text{Tyndall scattering requires particle diameter } d \\sim \\lambda_{\\text{light}} \\approx 400\\text{--}700\\text{ nm}',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-solutions-concentration', name: 'Solutions & Concentration', subject: 'chemistry' },
      { id: 'ncert9-chem-mixtures-homogeneous-heterogeneous', name: 'Pure Substances vs Mixtures', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Sunlight Beams Streaming Through Forest Canopies',
        description: 'Microscopic mist droplets dispersed in forest air scatter sunlight, making brilliant sunbeam shafts visible.',
      },
      {
        title: 'Automobile Headlights in Dense Fog',
        description: 'Colloidal water droplets suspended in cold air scatter car headlight beams, creating a blinding glare.',
      },
      {
        title: 'Smoke in Cinema Projection Theaters',
        description: 'Colloidal dust and smoke particles scatter projector light beams, illuminating the cone of light reaching the screen.',
      },
    ],
  },

  {
    id: 'ncert9-chem-separation-techniques',
    title: 'Separation of Mixture Components',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Centrifugation, chromatography, simple & fractional distillation, and crystallization',
    description:
      'Different physical properties (particle density, boiling points, solubility, volatility) enable the isolation of pure components: Centrifugation spins denser particles to the bottom (blood testing, dairy cream separation); Chromatography separates dissolved dyes by differential adsorption; Simple Distillation separates liquids with boiling points differing by > 25 K; Fractional Distillation uses fractionating columns for closer boiling points (liquid air, crude petroleum); Crystallization purifies solids without thermal decomposition.',
    formulaLaTeX: '\\Delta T_b = |T_{b1} - T_{b2}| > 25\\text{ K (Simple Distillation)} \\quad | \\quad R_f = \\frac{\\text{Distance travelled by solute}}{\\text{Distance travelled by solvent}}',
    formulaExplanation:
      'In paper chromatography, each dye component travels at a unique migration speed based on its relative solubility in the mobile solvent phase versus affinity for the stationary cellulose paper.',
    simulationType: 'solutions-colloids',
    variables: [
      {
        id: 'boilingPointDeltaK',
        name: 'Boiling Point Difference',
        symbol: '\\Delta T_b',
        unit: 'K',
        min: 5,
        max: 80,
        step: 5,
        defaultValue: 30,
        description: '< 25 K requires fractional column packing beads; > 25 K works with simple distillation.',
      },
      {
        id: 'centrifugeSpeedRpm',
        name: 'Centrifuge Rotation Speed',
        symbol: '\\omega',
        unit: 'rpm',
        min: 500,
        max: 10000,
        step: 500,
        defaultValue: 3500,
        description: 'Centrifugal acceleration forcing dense cream/RBCs to the tube bottom.',
      },
    ],
    prediction: {
      prompt: 'NCERT Fractionating Column Function Inquiry',
      scenario:
        'Why does a fractional distillation apparatus contain glass beads inside the fractionating column between the distillation flask and the condenser?',
      choices: [
        {
          id: 'p1',
          text: 'The glass beads react chemically with the lower-boiling liquid to neutralize it.',
          isCorrect: false,
          misconceptionExplanation: 'Glass beads are chemically inert; distillation is a purely physical separation based on vaporization and condensation.',
        },
        {
          id: 'p2',
          text: 'They provide a large surface area for repeated cycles of condensation and re-vaporization of ascending vapors.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'They prevent boiling liquid from ever reaching the condenser tube.',
          isCorrect: false,
          misconceptionExplanation: 'Vapors pass freely through the bead spaces; the beads cool and condense the higher-boiling component, sending it back down.',
        },
      ],
      correctExplanation:
        'The glass beads provide a large surface area for vapors to cool, condense, and re-evaporate repeatedly. The ascending vapor becomes progressively enriched in the more volatile (lower boiling point) component, allowing clean separation even when boiling points differ by less than 25 K (e.g. acetone 56°C and water 100°C, or ethanol 78°C and water).',
      relevantFormula: '\\text{Number of theoretical plates } N \\propto \\text{Column surface area and bead packing density}',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-mixtures-homogeneous-heterogeneous', name: 'Homogeneous vs Heterogeneous Mixtures', subject: 'chemistry' },
      { id: 'ncert9-chem-solutions-concentration', name: 'Solutions & Concentration', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Separating Gases from Liquid Air',
        description: 'Air is liquefied under high pressure and low temperature, then warmed in a fractional distillation column to separate Nitrogen (b.p. -196°C), Argon (-186°C), and Oxygen (-183°C).',
      },
      {
        title: 'Forensic Ink & Drug Chromatography',
        description: 'Black ink dots separated on chromatographic paper reveal the distinct colored pigments used by pen manufacturers.',
      },
      {
        title: 'Dairy Cream Separation via Centrifugation',
        description: 'Centrifuges spin raw milk rapidly: lighter fat cream rises to the center and is skimmed off, yielding toned milk.',
      },
    ],
  },

  {
    id: 'ncert9-chem-physical-chemical-changes',
    title: 'Physical vs Chemical Changes & Chemical Identity',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Reversibility, molecular rearrangement, and conservation of atomic identity',
    description:
      'A physical change alters physical properties (state, size, shape, appearance) without changing chemical composition or forming new substances (e.g. melting wax, tearing paper, dissolving salt). A chemical change (chemical reaction) rearranges atoms into new substances with different chemical properties, accompanied by energy absorption/release, gas evolution, color change, or precipitate formation (e.g. rusting of iron, burning candle wax).',
    formulaLaTeX: '\\text{Reactants} \\xrightarrow{\\Delta / \\text{Catalyst}} \\text{Products} \\quad (\\Delta H \\ne 0, \\text{ new chemical bonds formed})',
    formulaExplanation:
      'In a physical change, molecular identity is conserved: H₂O(s) ⇌ H₂O(l) ⇌ H₂O(g). In a chemical change, intramolecular bonds break and reform: 2H₂O(l) → 2H₂(g) + O₂(g).',
    simulationType: 'chem-reactions-conservation',
    variables: [
      {
        id: 'reactionEnergyKj',
        name: 'Enthalpy Energy Exchange',
        symbol: '\\Delta H',
        unit: 'kJ/mol',
        min: -500,
        max: 500,
        step: 25,
        defaultValue: -120,
        description: 'Negative for exothermic release (combustion), positive for endothermic absorption.',
      },
    ],
    prediction: {
      prompt: 'NCERT Classic Candle Burning Paradox',
      scenario:
        'When a wax candle burns, is the process classified as a physical change or a chemical change?',
      choices: [
        {
          id: 'p1',
          text: 'Purely a physical change, because molten wax hardens again upon cooling.',
          isCorrect: false,
          misconceptionExplanation: 'While melting wax is indeed physical, the vaporized wax entering the flame chemically combusts with oxygen to produce CO₂ and H₂O.',
        },
        {
          id: 'p2',
          text: 'Purely a chemical change, because heat and light are produced.',
          isCorrect: false,
          misconceptionExplanation: 'Solid wax melting at the base of the wick is a physical change happening simultaneously.',
        },
        {
          id: 'p3',
          text: 'Both physical and chemical changes take place simultaneously.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
      ],
      correctExplanation:
        'Candle burning involves both: (1) Melting of solid wax into liquid wax and vaporizing at the wick is a Physical Change (reversible). (2) Combustion of wax vapor with atmospheric oxygen: Hydrocarbon + O₂ → CO₂ + H₂O + Heat + Light is an irreversible Chemical Change.',
      relevantFormula: '\\text{C}_{25}\\text{H}_{52}(s) \\xrightarrow{\\text{heat}} \\text{C}_{25}\\text{H}_{52}(l) \\quad \\& \\quad \\text{C}_{25}\\text{H}_{52} + 38\\text{O}_2 \\to 25\\text{CO}_2 + 26\\text{H}_2\\text{O}',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-elements-compounds', name: 'Elements vs Compounds', subject: 'chemistry' },
      { id: 'ncert9-chem-law-conservation-mass', name: 'Law of Conservation of Mass', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Rusting of Iron Bridges',
        description: 'Iron metal reacts with atmospheric moisture and oxygen to form hydrated iron(III) oxide (rust), an irreversible chemical degradation.',
      },
      {
        title: 'Cooking of Food',
        description: 'Heating egg albumin or baking dough irreversibly denatures proteins and caramelizes sugars, creating entirely new palatable chemical compounds.',
      },
      {
        title: 'Ripening of Fruit',
        description: 'Ethylene hormone production chemically converts sour starches into fructose sugars and alters chlorophyll pigments.',
      },
    ],
  },

  {
    id: 'ncert9-chem-elements-compounds',
    title: 'Elements, Compounds & Chemical Purity',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Metals, non-metals, metalloids and compounds with fixed chemical stoichiometry',
    description:
      'Antoine Lavoisier defined an element as a basic form of matter that cannot be broken down into simpler substances by chemical reactions (classified into metals, non-metals, and metalloids like silicon and boron). A compound is composed of two or more elements chemically combined in a fixed proportion by mass. The properties of a compound are entirely different from its constituent elements.',
    formulaLaTeX: '\\text{Water: } \\text{H}_2\\text{O} \\implies m_H : m_O = 2(1) : 16 = 1 : 8 \\text{ by mass, invariant globally}',
    formulaExplanation:
      'Hydrogen is a combustible gas and oxygen supports combustion, yet their chemical compound water (H₂O) extinguishes fire—proving that compound properties differ drastically from element properties.',
    simulationType: 'solutions-colloids',
    variables: [
      {
        id: 'metalMalleabilityScore',
        name: 'Metallic Character',
        symbol: 'M_{\\text{char}}',
        unit: 'idx',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 8,
        description: 'High malleability, ductility, sonorous acoustics, electrical conductivity.',
      },
    ],
    prediction: {
      prompt: 'NCERT Element vs Compound Property Contrast',
      scenario:
        'Sodium (Na) is an explosive, violently reactive soft metal, and Chlorine (Cl₂) is a suffocating toxic yellow gas. When reacted together, they form Sodium Chloride (NaCl). Can you eat NaCl?',
      choices: [
        {
          id: 'p1',
          text: 'No, because it still contains poisonous chlorine atoms and dangerous sodium.',
          isCorrect: false,
          misconceptionExplanation: 'A compound possesses completely new physical and chemical properties distinct from its constituent elements.',
        },
        {
          id: 'p2',
          text: 'Yes, because NaCl is harmless table salt, essential for human biological fluid balance and nerve impulses.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Only if it is dissolved in milk to neutralize the toxic chlorine gas.',
          isCorrect: false,
          misconceptionExplanation: 'Chlorine exists in NaCl as stable chloride (Cl⁻) ions, not elemental toxic Cl₂ gas molecules.',
        },
      ],
      correctExplanation:
        'When sodium transfers its valence electron to chlorine, stable ions (Na⁺ and Cl⁻) form an ionic crystal lattice. The resulting compound, table salt (NaCl), has completely new biological and chemical properties unrelated to reactive metallic sodium or poisonous chlorine gas.',
      relevantFormula: '2\\text{Na}(s) + \\text{Cl}_2(g) \\to 2\\text{NaCl}(s) \\quad (\\Delta H = -822\\text{ kJ/mol})',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-mixtures-homogeneous-heterogeneous', name: 'Mixtures vs Pure Substances', subject: 'chemistry' },
      { id: 'ncert9-chem-chemical-formula-crisscross', name: 'Writing Chemical Formulae', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Copper Wiring in Electrical Grids',
        description: 'Metals possess free conduction electrons, making copper and aluminium ideal high-efficiency electrical conductors.',
      },
      {
        title: 'Silicon Metalloids in Computer Microprocessors',
        description: 'Metalloids like silicon and germanium have intermediate electrical conductivity, enabling modern semiconductor transistors.',
      },
      {
        title: 'Liquid Mercury in Medical Thermometers',
        description: 'Mercury is the only elemental metal that remains liquid at room temperature, expanding uniformly when heated.',
      },
    ],
  },

  // =========================================================================
  // CHAPTER 3: ATOMS AND MOLECULES
  // =========================================================================
  {
    id: 'ncert9-chem-law-conservation-mass',
    title: 'Law of Conservation of Mass in Chemical Reactions',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Mass can neither be created nor destroyed in a chemical reaction: Total mass of reactants = Total mass of products',
    description:
      'Formulated by Antoine Lavoisier in 1789, the Law of Conservation of Mass states that in any chemical reaction occurring in a closed system, the total mass of the products equals the total mass of the reactants. No atoms are created or destroyed; chemical reactions merely reorganize atomic bonds.',
    formulaLaTeX: '\\sum m_{\\text{reactants}} = \\sum m_{\\text{products}} \\implies m(\\text{BaCl}_2) + m(\\text{Na}_2\\text{SO}_4) = m(\\text{BaSO}_4) + m(2\\text{NaCl})',
    formulaExplanation:
      'When an aqueous solution of Barium Chloride is mixed with Sodium Sulfate in a sealed conical flask, an insoluble white precipitate of Barium Sulfate forms, but the mass balance reading remains identical before and after reaction.',
    simulationType: 'chem-reactions-conservation',
    variables: [
      {
        id: 'reactant1Mass',
        name: 'BaCl₂ Solution Mass',
        symbol: 'm_1',
        unit: 'g',
        min: 10,
        max: 50,
        step: 2,
        defaultValue: 20.82,
        description: 'Mass of Barium Chloride solution in ignition tube.',
      },
      {
        id: 'reactant2Mass',
        name: 'Na₂SO₄ Solution Mass',
        symbol: 'm_2',
        unit: 'g',
        min: 10,
        max: 50,
        step: 2,
        defaultValue: 14.20,
        description: 'Mass of Sodium Sulfate solution in conical flask.',
      },
    ],
    prediction: {
      prompt: 'NCERT Lavoisier Flask Experiment Inquiry',
      scenario:
        'A conical flask with Barium Chloride solution has a small ignition tube inside containing Sodium Sulfate solution, sealed tight with a rubber cork. The scale reads 300.25 g. The flask is tilted to mix both solutions. A white precipitate forms. What is the new reading on the scale?',
      choices: [
        {
          id: 'p1',
          text: 'Less than 300.25 g, because heat energy escaped during precipitation.',
          isCorrect: false,
          misconceptionExplanation: 'Mass conservation holds strictly; mass-energy equivalent losses in chemical reactions are undetectable on chemical balances.',
        },
        {
          id: 'p2',
          text: 'Exactly 300.25 g, because matter was neither created nor destroyed in the closed system.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Greater than 300.25 g, because a heavy solid precipitate appeared from clear liquids.',
          isCorrect: false,
          misconceptionExplanation: 'The precipitate formed from ions already present in the liquid; no new matter entered the sealed flask.',
        },
      ],
      correctExplanation:
        'According to the Law of Conservation of Mass, the total number and mass of every element (Ba, Cl, Na, S, O) remains identical before and after reaction. The chemical bonds reorganized into BaSO₄ precipitate and dissolved NaCl, but total mass on the balance remains 300.25 g.',
      relevantFormula: '\\text{BaCl}_2(aq) + \\text{Na}_2\\text{SO}_4(aq) \\to \\text{BaSO}_4(s)\\downarrow + 2\\text{NaCl}(aq)',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-law-constant-proportions', name: 'Law of Constant Proportions', subject: 'chemistry' },
      { id: 'ncert9-chem-dalton-atomic-theory', name: "Dalton's Atomic Theory", subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Stoichiometry in Industrial Chemical Manufacturing',
        description: 'Pharmaceutical factories calculate exact reactant feed quantities using mass conservation, ensuring zero wasted chemicals and 100% atom economy.',
      },
      {
        title: 'Rocket Fuel Combustion Ratios',
        description: 'Space engineers calculate liquid hydrogen and oxygen propellant mass to match exhaust gas mass (H₂O) and velocity for optimal thrust.',
      },
      {
        title: 'Closed Ecological Life Support in ISS',
        description: 'The International Space Station recycles 98% of human moisture and exhaled CO₂ into drinking water and breathable oxygen based on mass conservation.',
      },
    ],
  },

  {
    id: 'ncert9-chem-law-constant-proportions',
    title: 'Law of Constant / Definite Proportions',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'In a chemical substance, elements are always present in definite proportions by mass (Proust’s Law)',
    description:
      'Stated by Joseph Proust in 1799: In any pure chemical compound, the constituent elements are always combined in a fixed and constant proportion by mass, regardless of the source or method of preparation. For example, in pure water (H₂O), the mass ratio of Hydrogen to Oxygen is always 1 : 8. Decomposing 9 g of water yields exactly 1 g of Hydrogen and 8 g of Oxygen.',
    formulaLaTeX: '\\frac{m_{\\text{element A}}}{m_{\\text{element B}}} = \\text{Constant} \\quad \\implies \\quad \\text{Water } \\frac{m_H}{m_O} = \\frac{2(1.008)}{16.00} = \\frac{1}{8} \\quad | \\quad \\text{Ammonia } \\frac{m_N}{m_H} = \\frac{14}{3}',
    formulaExplanation:
      'Whether water is sampled from tap water, rainfall, melted Antarctic glaciers, or synthesized in a laboratory, 9 grams of water will consistently decompose into 1 g of H₂ and 8 g of O₂.',
    simulationType: 'chem-reactions-conservation',
    variables: [
      {
        id: 'sampleWaterMassGrams',
        name: 'Water Sample Mass',
        symbol: 'm_{\\text{water}}',
        unit: 'g',
        min: 9,
        max: 180,
        step: 9,
        defaultValue: 36,
        description: 'Decomposes into Hydrogen (1/9th) and Oxygen (8/9ths).',
      },
    ],
    prediction: {
      prompt: 'NCERT Carbon Dioxide Synthesis Stoichiometry Challenge',
      scenario:
        'When 3.0 g of carbon is burnt in 8.0 g of oxygen, 11.0 g of carbon dioxide is produced. What mass of carbon dioxide will be formed if 3.0 g of carbon is burnt in 50.0 g of oxygen?',
      choices: [
        {
          id: 'p1',
          text: '53.0 g of carbon dioxide, because all 3.0 g of C and all 50.0 g of O will combine.',
          isCorrect: false,
          misconceptionExplanation: 'Elements combine in fixed mass ratios (3:8 for CO₂). Excess oxygen cannot react without additional carbon.',
        },
        {
          id: 'p2',
          text: '11.0 g of carbon dioxide, and 42.0 g of unreacted oxygen gas will remain behind.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: '22.0 g of carbon dioxide, because oxygen is in huge excess.',
          isCorrect: false,
          misconceptionExplanation: 'Carbon is the limiting reactant; 3.0 g of carbon can only consume exactly 8.0 g of oxygen according to Proust’s Law.',
        },
      ],
      correctExplanation:
        'According to the Law of Constant Proportions, Carbon and Oxygen combine in a strict 3 : 8 mass ratio to form CO₂ (atomic masses: C = 12, O = 16 × 2 = 32; 12 : 32 simplifies to 3 : 8). Therefore, 3.0 g of carbon can react with only 8.0 g of oxygen, producing exactly 11.0 g of CO₂. The remaining 42.0 g of oxygen remains unreacted.',
      relevantFormula: 'm_{\\text{product}} = 3.0\\text{ g (C)} + 8.0\\text{ g (O)} = 11.0\\text{ g (CO}_2\\text{)} \\quad | \\quad \\text{Excess } \\text{O}_2 = 50.0 - 8.0 = 42.0\\text{ g}',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-law-conservation-mass', name: 'Law of Conservation of Mass', subject: 'chemistry' },
      { id: 'ncert9-chem-dalton-atomic-theory', name: "Dalton's Atomic Theory", subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Verifying Purity of Pharmaceutical Drugs',
        description: 'Analytical labs measure the mass percentages of C, H, N, and O in synthesized paracetamol to verify chemical identity against constant proportion benchmarks.',
      },
      {
        title: 'Haber Process for Ammonia Production',
        description: 'Nitrogen and Hydrogen react in strict 14 : 3 mass ratio (N₂ + 3H₂ → 2NH₃) to manufacture synthetic agricultural fertilizers.',
      },
      {
        title: 'Atmospheric CO₂ Measurement in Paleoclimatology',
        description: 'Trapped ancient ice core gas bubbles exhibit the exact same 3:8 C-to-O mass ratio as modern carbon dioxide.',
      },
    ],
  },

  {
    id: 'ncert9-chem-dalton-atomic-theory',
    title: "Dalton's Atomic Theory & Modern Atomic Symbols",
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Postulates explaining chemical laws, atomic mass unit (u), and IUPAC nomenclature',
    description:
      'In 1808, John Dalton provided the scientific basis for chemical combination: (1) All matter consists of tiny indivisible particles called atoms; (2) Atoms of a given element are identical in mass and chemical properties; (3) Atoms of different elements have different masses; (4) Atoms combine in simple whole-number ratios to form compounds; (5) Atoms cannot be created or destroyed. J.J. Berzelius introduced symbols derived from one or two letters of element names (including Latin roots: Na from Natrium, Fe from Ferrum, Au from Aurum).',
    formulaLaTeX: '1\\text{ u (Unified Atomic Mass)} = \\frac{1}{12} \\times \\text{Mass of one Carbon-12 atom} \\approx 1.6605 \\times 10^{-27}\\text{ kg}',
    formulaExplanation:
      'Atomic masses are measured relative to the standard Carbon-12 isotope assigned an exact mass of 12 unified atomic mass units (u).',
    simulationType: 'atoms-molecules-formula',
    variables: [
      {
        id: 'relativeAtomicMass',
        name: 'Relative Atomic Mass (u)',
        symbol: 'A_r',
        unit: 'u',
        min: 1,
        max: 56,
        step: 1,
        defaultValue: 12,
        description: 'H = 1, C = 12, N = 14, O = 16, Na = 23, S = 32, Fe = 56.',
      },
    ],
    prediction: {
      prompt: 'NCERT Dalton Theory Postulate Deduction',
      scenario:
        'Which specific postulate of Dalton’s Atomic Theory directly provides the theoretical explanation for the Law of Conservation of Mass?',
      choices: [
        {
          id: 'p1',
          text: 'Atoms of different elements have different masses and chemical affinities.',
          isCorrect: false,
          misconceptionExplanation: 'This explains diversity among elements, not why total mass remains conserved.',
        },
        {
          id: 'p2',
          text: 'Atoms are indivisible particles that can neither be created nor destroyed in a chemical reaction.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Atoms combine in ratios of small whole numbers to form chemical compounds.',
          isCorrect: false,
          misconceptionExplanation: 'This explains the Law of Constant/Multiple Proportions, not mass conservation.',
        },
      ],
      correctExplanation:
        'Dalton postulated that "atoms are indivisible particles, which cannot be created or destroyed in a chemical reaction." Since the total number and identity of atoms in the reactants must precisely equal the total number and identity of atoms in the products, total mass is conserved.',
      relevantFormula: '\\text{Number of Atoms (Reactants)} = \\text{Number of Atoms (Products)} \\implies \\sum m_R = \\sum m_P',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-law-conservation-mass', name: 'Law of Conservation of Mass', subject: 'chemistry' },
      { id: 'ncert9-chem-molecules-elements-compounds', name: 'Molecules of Elements and Compounds', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'IUPAC Universal Chemical Symbols',
        description: 'Standardized 1-2 letter symbols (H, He, Na, Fe, Ag, Au) enable scientists globally to communicate formulas unambiguously regardless of spoken language.',
      },
      {
        title: 'Standardizing Unified Atomic Mass (u)',
        description: 'Defining 1 u as 1/12th the mass of Carbon-12 provides the universal foundation for all mass spectrometry and pharmaceutical dosage formulations.',
      },
      {
        title: 'Nanotechnology & Atomic Force Microscopy',
        description: 'Modern scanning tunneling microscopes (STM) can image individual atoms on surfaces, fulfilling Dalton’s vision of discrete atomic particles.',
      },
    ],
  },

  {
    id: 'ncert9-chem-molecules-elements-compounds',
    title: 'Molecules of Elements, Compounds & Atomicity',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Monoatomic, diatomic, tetraatomic, and polyatomic molecules of elements and compounds',
    description:
      'A molecule is the smallest particle of an element or compound capable of independent existence and showing all properties of that substance. Atomicity is the number of atoms constituting a molecule: Monoatomic (He, Ne, Ar), Diatomic (H₂, O₂, N₂, Cl₂), Triatomic (O₃ Ozone), Tetra-atomic (P₄ Phosphorus), and Polyatomic (S₈ Sulfur). Molecules of compounds contain atoms of two or more different elements chemically bonded.',
    formulaLaTeX: '\\text{Atomicity} = \\frac{\\text{Molecular Mass}}{\\text{Atomic Mass}} \\quad | \\quad \\text{Ozone: } \\text{O}_3 (3) \\quad | \\quad \\text{Phosphorus: } \\text{P}_4 (4) \\quad | \\quad \\text{Sulfur: } \\text{S}_8 (8)',
    formulaExplanation:
      'Sulfur exists at room temperature as puckered crown-shaped S₈ molecules (atomicity = 8), while noble gases like Argon exist as single unbonded atoms (atomicity = 1).',
    simulationType: 'atoms-molecules-formula',
    variables: [
      {
        id: 'atomicityCount',
        name: 'Molecular Atomicity',
        symbol: 'n_{\\text{atoms}}',
        unit: 'atoms',
        min: 1,
        max: 8,
        step: 1,
        defaultValue: 2,
        description: 'Number of constituent atoms bonded in the stable molecule.',
      },
    ],
    prediction: {
      prompt: 'NCERT Atomicity Classification Challenge',
      scenario:
        'Match the molecular formula of elemental yellow sulfur (S₈) and white phosphorus (P₄) to their correct scientific atomicity designations:',
      choices: [
        {
          id: 'p1',
          text: 'Both are diatomic because both are non-metals like oxygen.',
          isCorrect: false,
          misconceptionExplanation: 'Oxygen is diatomic (O₂), but phosphorus forms 4-atom tetrahedra (P₄) and sulfur forms 8-atom rings (S₈).',
        },
        {
          id: 'p2',
          text: 'Phosphorus is tetra-atomic (4) and Sulfur is polyatomic / octa-atomic (8).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Both are monoatomic because they are pure elements.',
          isCorrect: false,
          misconceptionExplanation: 'Only noble gases (He, Ne, Ar, Kr) exist as stable monoatomic species under standard conditions.',
        },
      ],
      correctExplanation:
        'Phosphorus atoms bond into tetrahedral P₄ units (atomicity = 4, tetra-atomic), while sulfur atoms form eight-membered puckered crown rings S₈ (atomicity = 8, polyatomic).',
      relevantFormula: '\\text{Atomicity of P}_4 = 4 \\quad \\& \\quad \\text{Atomicity of S}_8 = 8',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-dalton-atomic-theory', name: "Dalton's Atomic Theory", subject: 'chemistry' },
      { id: 'ncert9-chem-ions-polyatomic', name: 'Ions & Polyatomic Radicals', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Stratospheric Ozone Layer (O₃)',
        description: 'Triatomic oxygen (O₃, atomicity = 3) absorbs dangerous solar UV-B radiation in the stratosphere, protecting terrestrial biosphere DNA.',
      },
      {
        title: 'Inert Argon Gas in Incandescent Lightbulbs',
        description: 'Monoatomic argon (Ar, atomicity = 1) is chemically unreactive, preventing tungsten filaments from burning out at 2500°C.',
      },
      {
        title: 'White Phosphorus in Safety Matches',
        description: 'Tetra-atomic P₄ allotropes convert to red phosphorus on matchbox striking surfaces to initiate combustion reliably.',
      },
    ],
  },

  {
    id: 'ncert9-chem-ions-polyatomic',
    title: 'Ions: Cations, Anions & Polyatomic Radicals',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Positively and negatively charged atomic species, polyatomic ion charges',
    description:
      'An ion is a charged atom or group of atoms. Metals lose electrons to form positively charged cations (Na⁺, Mg²⁺, Al³⁺), while non-metals gain electrons to form negatively charged anions (Cl⁻, O²⁻, N³⁻). A polyatomic ion is a cluster of chemically bonded atoms that carries an overall net electrical charge (e.g. Ammonium NH₄⁺, Hydroxide OH⁻, Nitrate NO₃⁻, Carbonate CO₃²⁻, Sulfate SO₄²⁻, Phosphate PO₄³⁻).',
    formulaLaTeX: '\\text{Net Charge} = \\sum p^+ - \\sum e^- \\quad | \\quad \\text{Cations: } \\text{Charge} > 0 \\quad | \\quad \\text{Anions: } \\text{Charge} < 0',
    formulaExplanation:
      'In a sulfate ion (SO₄²⁻), one sulfur and four oxygen atoms share covalent bonds, with two extra electrons yielding a stable 2- unit electrical charge.',
    simulationType: 'atoms-molecules-formula',
    variables: [
      {
        id: 'ionicValencyMagnitude',
        name: 'Ionic Charge Magnitude',
        symbol: '|z|',
        unit: 'e',
        min: 1,
        max: 3,
        step: 1,
        defaultValue: 2,
        description: 'Monovalent (1), Divalent (2), or Trivalent (3).',
      },
    ],
    prediction: {
      prompt: 'NCERT Polyatomic Ion Charge Identification',
      scenario:
        'Which of the following contains a polyatomic cation and a polyatomic anion combined into an ionic salt?',
      choices: [
        {
          id: 'p1',
          text: 'Sodium Chloride (NaCl)',
          isCorrect: false,
          misconceptionExplanation: 'Na⁺ and Cl⁻ are both monoatomic simple ions, not polyatomic clusters.',
        },
        {
          id: 'p2',
          text: 'Ammonium Sulfate ((NH₄)₂SO₄)',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Calcium Oxide (CaO)',
          isCorrect: false,
          misconceptionExplanation: 'Ca²⁺ and O²⁻ are both monoatomic ions.',
        },
      ],
      correctExplanation:
        'Ammonium (NH₄⁺) is a polyatomic cation containing 1 nitrogen and 4 hydrogen atoms carrying a net +1 charge. Sulfate (SO₄²⁻) is a polyatomic anion containing 1 sulfur and 4 oxygen atoms with a net -2 charge. Two NH₄⁺ ions neutralize one SO₄²⁻ ion to form ammonium sulfate ((NH₄)₂SO₄).',
      relevantFormula: '2\\text{NH}_4^+ + \\text{SO}_4^{2-} \\to (\\text{NH}_4)_2\\text{SO}_4',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-chemical-formula-crisscross', name: 'Writing Chemical Formulae', subject: 'chemistry' },
      { id: 'ncert9-chem-molecules-elements-compounds', name: 'Molecules of Compounds', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Agricultural Ammonium Nitrate Fertilizer',
        description: 'Ammonium nitrate (NH₄NO₃) combines polyatomic ammonium and nitrate ions to deliver dense nitrogen to crop root systems.',
      },
      {
        title: 'Baking Soda in Kitchens (NaHCO₃)',
        description: 'Sodium bicarbonate contains monoatomic Na⁺ and polyatomic bicarbonate HCO₃⁻, releasing CO₂ bubbles during baking.',
      },
      {
        title: 'Bone and Tooth Enamel Mineral (Hydroxylapatite)',
        description: 'Composed of calcium cations (Ca²⁺) and polyatomic phosphate (PO₄³⁻) and hydroxide (OH⁻) ions forming robust bone matrices.',
      },
    ],
  },

  {
    id: 'ncert9-chem-chemical-formula-crisscross',
    title: 'Writing Chemical Formulae & The Criss-Cross Valency Rule',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Combining power of elements, crossover of valence charges, parenthetical notation for polyatomic radicals',
    description:
      'The chemical formula of a compound represents its constituent elements and the whole-number ratios of their atoms. Using the criss-cross rule: write symbols of cation and anion side-by-side with valencies underneath, cross over the valencies to become subscripts, simplify to smallest whole numbers, and enclose polyatomic ions in parentheses if subscript > 1 (e.g. Al³⁺ and O²⁻ cross to Al₂O₃; Ca²⁺ and OH⁻ cross to Ca(OH)₂; Mg²⁺ and Cl⁻ cross to MgCl₂).',
    formulaLaTeX: '\\text{A}^{x+} + \\text{B}^{y-} \\xrightarrow{\\text{Criss-Cross}} \\text{A}_y \\text{B}_x \\quad | \\quad \\text{Example: } \\text{Al}^{3+} + \\text{O}^{2-} \\to \\text{Al}_2\\text{O}_3',
    formulaExplanation:
      'The net electrical charge of any neutral compound must equal zero: for Al₂O₃, 2(+3) + 3(-2) = +6 - 6 = 0.',
    simulationType: 'atoms-molecules-formula',
    variables: [
      {
        id: 'cationValency',
        name: 'Cation Valency',
        symbol: 'v_{\\text{cat}}',
        unit: '+',
        min: 1,
        max: 3,
        step: 1,
        defaultValue: 3,
        description: 'Na⁺(1), Ca²⁺(2), Al³⁺(3).',
      },
      {
        id: 'anionValency',
        name: 'Anion Valency',
        symbol: 'v_{\\text{an}}',
        unit: '-',
        min: 1,
        max: 3,
        step: 1,
        defaultValue: 2,
        description: 'Cl⁻(1), O²⁻(2), N³⁻(3).',
      },
    ],
    prediction: {
      prompt: 'NCERT Formula Formulation: Aluminium Sulfate',
      scenario:
        'What is the correct chemical formula for Aluminium Sulfate, composed of Aluminium ions (Al³⁺) and Sulfate ions (SO₄²⁻)?',
      choices: [
        {
          id: 'p1',
          text: 'AlSO₄, because one aluminium balances one sulfate.',
          isCorrect: false,
          misconceptionExplanation: 'Al³⁺ (+3) and SO₄²⁻ (-2) do not sum to zero: +3 - 2 = +1 (not neutral).',
        },
        {
          id: 'p2',
          text: 'Al₂(SO₄)₃, with parentheses enclosing the polyatomic sulfate ion.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Al₂SO₄₃, without parentheses.',
          isCorrect: false,
          misconceptionExplanation: 'Without brackets, Al₂SO₄₃ reads as 43 oxygen atoms; brackets (SO₄)₃ are mandatory to multiply the entire sulfate radical.',
        },
      ],
      correctExplanation:
        'Cross over the valency magnitudes: 2 goes to Aluminium (Al₂), and 3 goes to the Sulfate ion. Because sulfate is a polyatomic ion, it must be enclosed in parentheses before applying the subscript 3: Al₂(SO₄)₃. Check electrical neutrality: 2(+3) + 3(-2) = +6 - 6 = 0.',
      relevantFormula: '2\\text{Al}^{3+} + 3\\text{SO}_4^{2-} \\to \\text{Al}_2(\\text{SO}_4)_3',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-ions-polyatomic', name: 'Ions & Polyatomic Radicals', subject: 'chemistry' },
      { id: 'ncert9-chem-molecular-mass-formula-unit', name: 'Molecular Mass Calculations', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Alum (Aluminium Sulfate) Water Clarification',
        description: 'Al₂(SO₄)₃ coagulates colloidal mud particles in municipal water treatment plants, clarifying drinking water.',
      },
      {
        title: 'Slaked Lime (Calcium Hydroxide) in Mortar',
        description: 'Ca(OH)₂ whitewashing reacts with atmospheric CO₂ over days to form a hard, lustrous calcium carbonate coating.',
      },
      {
        title: 'Antacid Tablets (Magnesium Hydroxide)',
        description: 'Mg(OH)₂ (Milk of Magnesia) neutralizes excess stomach hydrochloric acid: Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O.',
      },
    ],
  },

  {
    id: 'ncert9-chem-molecular-mass-formula-unit',
    title: 'Molecular Mass & Formula Unit Mass Calculations',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Sum of atomic masses of all atoms in a molecule or ionic formula unit',
    description:
      'The molecular mass of a substance is the sum of the atomic masses of all the atoms in a molecule, expressed in unified atomic mass units (u). For ionic substances where discrete molecules do not exist (such as NaCl, CaCl₂), the term "Formula Unit Mass" is used instead, calculated identically from the chemical formula.',
    formulaLaTeX: 'M = \\sum_{i=1}^k n_i \\cdot A_i \\quad | \\quad M(\\text{HNO}_3) = 1(1) + 1(14) + 3(16) = 63\\text{ u}',
    formulaExplanation:
      'For water (H₂O): 2 × 1 u (H) + 1 × 16 u (O) = 18 u. For Glucose (C₆H₁₂O₆): 6(12) + 12(1) + 6(16) = 72 + 12 + 96 = 180 u.',
    simulationType: 'atoms-molecules-formula',
    variables: [
      {
        id: 'carbonAtomCount',
        name: 'Carbon Atoms',
        symbol: 'n_C',
        unit: 'atoms',
        min: 1,
        max: 6,
        step: 1,
        defaultValue: 2,
        description: 'Atomic mass = 12 u each.',
      },
      {
        id: 'hydrogenAtomCount',
        name: 'Hydrogen Atoms',
        symbol: 'n_H',
        unit: 'atoms',
        min: 2,
        max: 12,
        step: 1,
        defaultValue: 6,
        description: 'Atomic mass = 1 u each.',
      },
      {
        id: 'oxygenAtomCount',
        name: 'Oxygen Atoms',
        symbol: 'n_O',
        unit: 'atoms',
        min: 0,
        max: 6,
        step: 1,
        defaultValue: 1,
        description: 'Atomic mass = 16 u each (e.g. C₂H₆O Ethanol = 46 u).',
      },
    ],
    prediction: {
      prompt: 'NCERT Formula Unit Mass Calculation: Calcium Chloride',
      scenario:
        'Calculate the formula unit mass of Calcium Chloride (CaCl₂). Given: atomic mass of Ca = 40 u, atomic mass of Cl = 35.5 u.',
      choices: [
        {
          id: 'p1',
          text: '75.5 u (calculated as 40 + 35.5)',
          isCorrect: false,
          misconceptionExplanation: 'CaCl₂ has two chlorine atoms, so the chlorine mass must be multiplied by 2.',
        },
        {
          id: 'p2',
          text: '111 u (calculated as 40 + 2 × 35.5)',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: '151 u (calculated as 2 × 40 + 2 × 35.5)',
          isCorrect: false,
          misconceptionExplanation: 'There is only one calcium atom in the formula unit CaCl₂.',
        },
      ],
      correctExplanation:
        'Formula unit mass of CaCl₂ = (1 × atomic mass of Ca) + (2 × atomic mass of Cl) = (1 × 40 u) + (2 × 35.5 u) = 40 u + 71 u = 111 u.',
      relevantFormula: 'M(\\text{CaCl}_2) = 40 + 2(35.5) = 111\\text{ u}',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-chemical-formula-crisscross', name: 'Writing Chemical Formulae', subject: 'chemistry' },
      { id: 'ncert9-chem-dalton-atomic-theory', name: "Dalton's Atomic Theory", subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Road De-icing with Calcium Chloride',
        description: 'CaCl₂ (formula mass 111 u) dissolves exothermically in snow and depresses freezing point to -25°C, clearing winter roads.',
      },
      {
        title: 'Pharmaceutical Pill Active Ingredient Dosing',
        description: 'Chemists calculate precise active drug molecule weights (e.g. Aspirin C₉H₈O₄ = 180 u) to ensure exact milligram patient dosing.',
      },
      {
        title: 'Photosynthesis Sugar Output Mass Balance',
        description: 'Biochemists track glucose synthesis (C₆H₁₂O₆ = 180 u) from atmospheric CO₂ (44 u) and water (18 u) in green plant leaves.',
      },
    ],
  },

  // =========================================================================
  // CHAPTER 4: STRUCTURE OF THE ATOM
  // =========================================================================
  {
    id: 'ncert9-chem-discovery-subatomic-particles',
    title: 'Discovery of Subatomic Particles: Electrons, Protons & Neutrons',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Cathode rays (J.J. Thomson), Canal/Anode rays (E. Goldstein), and Neutrons (J. Chadwick)',
    description:
      'Contrary to Dalton’s indivisible atom, experiments revealed subatomic constituents: (1) J.J. Thomson (1897) discovered negatively charged electrons (e⁻, charge -1, negligible mass ~1/2000 u) in cathode ray discharge tubes; (2) E. Goldstein (1886) discovered canal rays (positive ions) leading to the discovery of protons (p⁺, charge +1, mass ~1 u); (3) J. Chadwick (1932) discovered neutral particles called neutrons (n⁰, charge 0, mass ~1 u) in the nucleus.',
    formulaLaTeX: 'm_p \\approx m_n \\approx 1836 \\cdot m_e \\quad | \\quad q_e = -1.602 \\times 10^{-19}\\text{ C}, \\quad q_p = +1.602 \\times 10^{-19}\\text{ C}',
    formulaExplanation:
      'Because an atom is electrically neutral, the total positive charge of protons in the nucleus precisely equals the total negative charge of orbiting electrons: Z(q_p) + Z(q_e) = 0.',
    simulationType: 'structure-of-atom',
    variables: [
      {
        id: 'protonCountZ',
        name: 'Protons in Nucleus',
        symbol: 'Z',
        unit: 'protons',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 6,
        description: 'Defines chemical element identity (Carbon Z = 6).',
      },
      {
        id: 'neutronCountN',
        name: 'Neutrons in Nucleus',
        symbol: 'N',
        unit: 'neutrons',
        min: 0,
        max: 24,
        step: 1,
        defaultValue: 6,
        description: 'Neutral nuclear particles providing nuclear strong force binding.',
      },
    ],
    prediction: {
      prompt: 'NCERT Canal Ray Discovery Inquiry',
      scenario:
        'In a discharge tube with a perforated cathode, what are "Canal Rays" discovered by Eugen Goldstein in 1886?',
      choices: [
        {
          id: 'p1',
          text: 'Beams of high-speed negative electrons traveling from cathode to anode.',
          isCorrect: false,
          misconceptionExplanation: 'Those are cathode rays discovered by Thomson, which travel towards the positive anode.',
        },
        {
          id: 'p2',
          text: 'Beams of positively charged gaseous ions passing through cathode perforations in the opposite direction.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Neutron rays that produce neutral radiation unaffected by electric fields.',
          isCorrect: false,
          misconceptionExplanation: 'Neutrons have zero charge and were discovered much later by Chadwick in 1932.',
        },
      ],
      correctExplanation:
        'Canal rays (or anode rays) are streams of positively charged ions formed when high-voltage electricity ionizes residual gas in the discharge tube. They travel towards the perforated cathode, pass through its canals/holes, and glow against the glass wall.',
      relevantFormula: '\\text{Gas Atom} + e_{\\text{cathode ray}}^- \\to \\text{Positive Ion}^+ + 2e^-',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-thomson-atomic-model', name: "Thomson's Atomic Model", subject: 'chemistry' },
      { id: 'ncert9-chem-rutherford-scattering', name: "Rutherford's Scattering Experiment", subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Cathode Ray Tube (CRT) Televisions',
        description: 'Steered electron beams striking phosphor screens formed television and radar displays for nearly a century.',
      },
      {
        title: 'Smoke Detectors using Alpha/Ionization Chambers',
        description: 'Smoke particles neutralize ionized air channels created by subatomic particles, triggering life-saving fire alarms.',
      },
      {
        title: 'Mass Spectrometry in Forensics',
        description: 'Positive ions accelerated through magnetic fields separate by mass-to-charge ratio (m/z) to identify unknown crime-scene poisons.',
      },
    ],
  },

  {
    id: 'ncert9-chem-thomson-atomic-model',
    title: "Thomson's Plum Pudding / Watermelon Atomic Model",
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Uniform sphere of positive charge with embedded negative electrons, and its limitations',
    description:
      'Proposed by J.J. Thomson in 1904: An atom consists of a positively charged sphere with electrons embedded in it, like dry fruits in a Christmas plum pudding or black seeds in a red watermelon. The negative and positive charges are equal in magnitude, making the atom electrically neutral overall. Limitation: It failed to explain the large-angle deflections observed in Rutherford’s alpha-particle scattering experiments.',
    formulaLaTeX: 'Q_{\\text{sphere}} = +Z e, \\quad \\sum q_{\\text{electrons}} = -Z e \\implies Q_{\\text{net}} = 0',
    formulaExplanation:
      'Thomson assumed positive mass was spread diffusely across the entire 10⁻¹⁰ m atomic diameter, which could never generate an electric field strong enough to bounce back a heavy alpha particle.',
    simulationType: 'structure-of-atom',
    variables: [
      {
        id: 'embeddedElectrons',
        name: 'Embedded Electrons',
        symbol: 'n_e',
        unit: 'electrons',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 6,
        description: 'Number of negative seeds embedded in the positive spherical pulp.',
      },
    ],
    prediction: {
      prompt: 'NCERT Model Contrast: Why Thomson’s Model Failed',
      scenario:
        'If Thomson’s model of diffuse positive charge were correct, what should have happened when heavy, high-speed alpha particles were shot at a thin gold foil?',
      choices: [
        {
          id: 'p1',
          text: 'Nearly all alpha particles should have bounced straight back towards the source.',
          isCorrect: false,
          misconceptionExplanation: 'A diffuse, spread-out positive sphere has very weak electric field strength and cannot exert the immense repulsive force needed to bounce an alpha particle back.',
        },
        {
          id: 'p2',
          text: 'All alpha particles should have passed straight through with only tiny, negligible deflections (less than a fraction of a degree).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'The alpha particles should have been absorbed, turning the gold foil into radioactive lead.',
          isCorrect: false,
          misconceptionExplanation: 'Non-relativistic alpha particles at ~10⁷ m/s scatter electrostatically rather than undergoing nuclear transmutation.',
        },
      ],
      correctExplanation:
        'Because positive charge and mass were assumed to be evenly spread across the whole volume of the atom, the electric field within the atom would be very weak. Thomson expected alpha particles (mass = 4 u) to punch straight through with negligible deflections. When Rutherford saw 1 in 12,000 bounce backwards (> 90°), Thomson’s model was disproven.',
      relevantFormula: 'F_{\\text{coulomb}} = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q_\\alpha Q_{\\text{diffuse}}}{r^2} \\ll F_{\\text{nucleus}}',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-discovery-subatomic-particles', name: 'Discovery of Subatomic Particles', subject: 'chemistry' },
      { id: 'ncert9-chem-rutherford-scattering', name: "Rutherford's Scattering Experiment", subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Historical Milestone in Atomic Physics',
        description: 'Thomson’s model was the first scientific attempt to incorporate the newly discovered electron into atomic architecture.',
      },
      {
        title: 'Concept of Electrical Neutrality',
        description: 'Established the enduring truth that neutral atoms possess exactly equal quantities of positive and negative charge.',
      },
      {
        title: 'Teaching the Scientific Method',
        description: 'Demonstrates how scientific models are proposed, rigorously tested by experiments, and revised when conflicting evidence arises.',
      },
    ],
  },

  {
    id: 'ncert9-chem-rutherford-scattering',
    title: "Rutherford's Alpha-Particle Scattering Experiment & Nuclear Model",
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Gold foil experiment, discovery of the atomic nucleus, and planetary model drawbacks',
    description:
      'Ernest Rutherford (1911) bombarded an ultra-thin gold foil (~1000 atoms thick) with high-energy alpha particles (He²⁺). Observations: (1) Most alpha particles passed straight through undeflected (atom is mostly empty space); (2) A small fraction were deflected by small angles; (3) About 1 in 12,000 rebounded by > 90°. Conclusions: Positive charge and nearly all atomic mass is concentrated in a tiny, dense core called the nucleus (radius ~10⁻¹⁵ m, 100,000 times smaller than the atom ~10⁻¹⁰ m). Major drawback: Classical electrodynamics dictates accelerating electrons must radiate energy, spiral into the nucleus, and collapse the atom in 10⁻⁸ s.',
    formulaLaTeX: 'N(\\theta) \\propto \\frac{1}{\\sin^4(\\theta / 2)} \\quad | \\quad r_{\\text{nucleus}} \\sim 10^{-15}\\text{ m} \\ll r_{\\text{atom}} \\sim 10^{-10}\\text{ m}',
    formulaExplanation:
      'The number of alpha particles deflected at angle θ drops sharply as angle increases according to the Rutherford Scattering formula.',
    simulationType: 'rutherford-scattering',
    variables: [
      {
        id: 'goldFoilThicknessNm',
        name: 'Gold Foil Thickness',
        symbol: 't_{\\text{foil}}',
        unit: 'nm',
        min: 50,
        max: 500,
        step: 50,
        defaultValue: 100,
        description: 'Ultra-thin gold sheet allowing alpha particles to undergo single scattering collisions.',
      },
      {
        id: 'alphaKineticEnergyMev',
        name: 'Alpha Particle Energy',
        symbol: 'E_k',
        unit: 'MeV',
        min: 3,
        max: 9,
        step: 0.5,
        defaultValue: 5.5,
        description: 'Energy from Bismuth/Radium radioactive decay source.',
      },
    ],
    prediction: {
      prompt: 'NCERT Famous Rutherford "Artillery Shell" Quote',
      scenario:
        'Rutherford famously exclaimed: "It was quite the most incredible event that has ever happened to me in my life. It was almost as incredible as if you fired a 15-inch shell at a piece of tissue paper and it came back and hit you." What caused the alpha particles to rebound?',
      choices: [
        {
          id: 'p1',
          text: 'Direct collision with dense clouds of electrons orbiting the gold atoms.',
          isCorrect: false,
          misconceptionExplanation: 'Electrons are ~7300 times lighter than alpha particles; an alpha particle would sweep through electrons like a cannonball through dust.',
        },
        {
          id: 'p2',
          text: 'Immense electrostatic repulsion from the tiny, highly concentrated positive charge of the heavy gold nucleus.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Magnetic repulsion from magnetic poles inside gold nuclei.',
          isCorrect: false,
          misconceptionExplanation: 'The deflection is purely electrostatic Coulomb repulsion between the +2e alpha particle and the +79e gold nucleus.',
        },
      ],
      correctExplanation:
        'Gold has a heavy nucleus with 79 protons concentrated within a tiny radius (~10⁻¹⁵ m). When a positively charged alpha particle (+2e) makes a near-head-on approach, the inverse-square Coulomb repulsion force spikes to enormous values, decelerating the alpha particle to a stop and repelling it backwards.',
      relevantFormula: 'F = \\frac{1}{4\\pi\\varepsilon_0} \\frac{(2e)(Ze)}{r^2} \\quad \\implies \\text{Distance of closest approach } d = \\frac{4kZe^2}{m v^2}',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-thomson-atomic-model', name: "Thomson's Atomic Model", subject: 'chemistry' },
      { id: 'ncert9-chem-bohr-atomic-model', name: "Bohr's Atomic Model", subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Rutherford Backscattering Spectrometry (RBS)',
        description: 'Materials scientists shoot alpha particles at silicon wafers to analyze the composition and thickness of nanometer thin-film coatings.',
      },
      {
        title: 'Discovery of the Atomic Nucleus',
        description: 'Proved that 99.95% of all physical matter around us is empty space between atomic nuclei and outer electron clouds.',
      },
      {
        title: 'Particle Accelerators (CERN LHC)',
        description: 'Direct descendant of scattering experiments: colliding subatomic particles at high energies to probe internal quark structures.',
      },
    ],
  },

  {
    id: 'ncert9-chem-bohr-atomic-model',
    title: "Bohr's Quantum Model of the Atom & Energy Levels",
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Discrete non-radiating orbits, K, L, M, N electron energy shells',
    description:
      'In 1913, Niels Bohr resolved the instability of Rutherford’s model by proposing: (1) Only certain special non-radiating orbits known as "discrete orbits" or energy levels are permitted for electrons; (2) While revolving in these discrete orbits, electrons do NOT radiate energy; (3) Energy shells are represented by integers n = 1, 2, 3, 4... or letters K, L, M, N...; (4) Radiation is emitted or absorbed only when an electron jumps from one energy level to another: ΔE = hν = E₂ - E₁.',
    formulaLaTeX: 'E_n = -\\frac{13.6}{n^2} \\text{ eV} \\quad | \\quad \\Delta E = E_2 - E_1 = h \\nu = \\frac{h c}{\\lambda} \\quad | \\quad n = 1(K), 2(L), 3(M), 4(N)',
    formulaExplanation:
      'Because energy orbits are quantized, an electron cannot spiral into the nucleus; it remains in its ground state (n = 1) indefinitely without losing energy, ensuring atomic stability.',
    simulationType: 'bohr-model',
    variables: [
      {
        id: 'shellIndexN',
        name: 'Principal Quantum Shell (n)',
        symbol: 'n',
        unit: 'shell',
        min: 1,
        max: 4,
        step: 1,
        defaultValue: 2,
        description: '1 = K shell, 2 = L shell, 3 = M shell, 4 = N shell.',
      },
      {
        id: 'targetAtomicNumberZ',
        name: 'Nuclear Charge (Z)',
        symbol: 'Z',
        unit: 'protons',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 11,
        description: 'Atomic number of element (Na = 11, Ca = 20).',
      },
    ],
    prediction: {
      prompt: 'NCERT Atomic Stability Inquiry',
      scenario:
        'Why does an electron revolving around the nucleus in a Bohr orbit not radiate energy and collapse into the nucleus, as classical physics predicted?',
      choices: [
        {
          id: 'p1',
          text: 'Because centrifugal force completely cancels out all electromagnetic forces.',
          isCorrect: false,
          misconceptionExplanation: 'Centrifugal force balances gravity or electrostatic attraction for orbital motion, but classical physics requires any accelerating charge to continuously radiate electromagnetic waves.',
        },
        {
          id: 'p2',
          text: 'Because electrons exist in stationary quantum orbits where radiation is prohibited unless jumping between discrete levels.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Because the nucleus repels the electron with an equal magnetic force.',
          isCorrect: false,
          misconceptionExplanation: 'The nucleus and electron have opposite electrical charges and attract each other strongly.',
        },
      ],
      correctExplanation:
        'Bohr postulated that angular momentum is quantized (L = n·h / 2π). Electrons occupy stable "stationary states" with discrete energy values. An electron cannot lose energy continuously; it can only transition by quantum jumps, making the ground state atom indefinitely stable.',
      relevantFormula: 'L = m v r = n \\frac{h}{2\\pi} \\quad (n = 1, 2, 3...)',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-rutherford-scattering', name: "Rutherford's Scattering Experiment", subject: 'chemistry' },
      { id: 'ncert9-chem-bohr-bury-valency', name: 'Bohr-Bury Scheme & Valency', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Fireworks & Atomic Emission Colors',
        description: 'Excited electrons jumping down Bohr shells emit characteristic colors: Sodium yields bright yellow (589 nm), Strontium red, and Copper blue-green.',
      },
      {
        title: 'Neon Signs & Fluorescent Tube Lights',
        description: 'Electrical discharge excites gas electrons into higher shells; dropping back emits brilliant visible light without high thermal heat.',
      },
      {
        title: 'Laser Technology in Eye Surgery',
        description: 'Stimulated emission between discrete quantum energy levels produces coherent laser beams used in LASIK vision correction.',
      },
    ],
  },

  {
    id: 'ncert9-chem-bohr-bury-valency',
    title: 'Bohr-Bury Electron Distribution Scheme & Valency',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: '2n² rule, octet rule, valence electrons, and valency of first 20 elements',
    description:
      'The Bohr-Bury rules govern atomic electron configuration: (1) Maximum capacity of any shell n is given by 2n²: K shell (n=1) = 2, L shell (n=2) = 8, M shell (n=3) = 18, N shell (n=4) = 32; (2) The outermost valence shell cannot accommodate more than 8 electrons (Octet Rule); (3) Electrons do not enter a new shell until inner shells are filled (stepwise filling). Valency is the combining capacity of an atom: for 1-4 valence electrons, Valency = Valence electrons; for 5-8 valence electrons, Valency = 8 - Valence electrons.',
    formulaLaTeX: '\\text{Max Capacity} = 2n^2 \\quad | \\quad \\text{Valency} = v \\quad (v \\le 4) \\quad \\text{or} \\quad 8 - v \\quad (v > 4)',
    formulaExplanation:
      'For Oxygen (Z=8): configuration is 2, 6. Valence electrons = 6, so Valency = 8 - 6 = 2. For Sodium (Z=11): configuration is 2, 8, 1. Valency = 1.',
    simulationType: 'bohr-model',
    variables: [
      {
        id: 'atomicNumberZ',
        name: 'Atomic Number (Z)',
        symbol: 'Z',
        unit: 'protons',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 17,
        description: '1 (Hydrogen) to 20 (Calcium). (Chlorine Z = 17: 2, 8, 7).',
      },
    ],
    prediction: {
      prompt: 'NCERT Valency Deduction: Nitrogen vs Neon',
      scenario:
        'Nitrogen has atomic number Z = 7 and Neon has atomic number Z = 10. What are their respective valencies?',
      choices: [
        {
          id: 'p1',
          text: 'Nitrogen has valency 5 and Neon has valency 8.',
          isCorrect: false,
          misconceptionExplanation: '5 and 8 are the counts of valence electrons in their outermost shells, not their valency (combining capacity).',
        },
        {
          id: 'p2',
          text: 'Nitrogen has valency 3 (needs 3 electrons to complete octet) and Neon has valency 0 (octet already full).',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Both have valency 1 because they are gases.',
          isCorrect: false,
          misconceptionExplanation: 'Physical state does not dictate chemical valency; electronic shell configuration does.',
        },
      ],
      correctExplanation:
        'Nitrogen (Z = 7) has electron configuration (2, 5). With 5 valence electrons, it gains or shares 3 electrons to attain a stable octet: Valency = 8 - 5 = 3. Neon (Z = 10) has configuration (2, 8); its valence shell is completely filled with an octet, so it has zero combining capacity: Valency = 0.',
      relevantFormula: '\\text{Valency of N} = 8 - 5 = 3 \\quad | \\quad \\text{Valency of Ne} = 8 - 8 = 0',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-bohr-atomic-model', name: "Bohr's Atomic Model", subject: 'chemistry' },
      { id: 'ncert9-chem-chemical-formula-crisscross', name: 'Writing Chemical Formulae', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Chemical Inertness of Argon & Helium',
        description: 'Helium (duplet 2) and Argon (octet 2, 8, 8) have valency 0, making them ideal non-reactive shield gases in arc welding.',
      },
      {
        title: 'Carbon’s Tetravalency & Organic Chemistry',
        description: 'Carbon (Z=6, 2, 4) has valency 4, enabling it to form 4 covalent bonds and millions of complex organic chains and life-sustaining biomolecules.',
      },
      {
        title: 'Reactivity of Alkali Metals (Na, K)',
        description: 'Sodium (2, 8, 1) and Potassium (2, 8, 8, 1) easily lose their single outermost valence electron, reacting vigorously with water.',
      },
    ],
  },

  {
    id: 'ncert9-chem-atomic-number-mass-number',
    title: 'Atomic Number (Z), Mass Number (A) & Nuclear Notation',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Standard notation, proton count, neutron calculation, and nuclear composition',
    description:
      'Atomic number (Z) is the total number of protons in the nucleus of an atom, defining its elemental identity. Mass number (A) is the total number of nucleons (protons + neutrons) in the nucleus. In standard chemical notation, an element X is represented as ^A_Z X. The number of neutrons is calculated as N = A - Z.',
    formulaLaTeX: 'A = Z + N \\quad \\implies \\quad N = A - Z \\quad | \\quad \\text{Notation: } ^{A}_{Z}\\text{X} \\quad (\\text{e.g. } ^{14}_{\\ 7}\\text{N}, \\ ^{23}_{11}\\text{Na}, \\ ^{56}_{26}\\text{Fe})',
    formulaExplanation:
      'For Sodium (²³₁₁Na): Atomic number Z = 11 (11 protons, 11 electrons), Mass number A = 23, so Neutrons N = 23 - 11 = 12 neutrons.',
    simulationType: 'structure-of-atom',
    variables: [
      {
        id: 'massNumberA',
        name: 'Mass Number (A)',
        symbol: 'A',
        unit: 'nucleons',
        min: 1,
        max: 40,
        step: 1,
        defaultValue: 23,
        description: 'Total protons plus neutrons in nucleus.',
      },
      {
        id: 'atomicNumberZ',
        name: 'Atomic Number (Z)',
        symbol: 'Z',
        unit: 'protons',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 11,
        description: 'Number of nuclear protons (defines element).',
      },
    ],
    prediction: {
      prompt: 'NCERT Nuclear Arithmetic Problem',
      scenario:
        'An atom of an element is represented as ³⁷₁₇Cl. What are the numbers of protons, neutrons, and electrons in this neutral atom?',
      choices: [
        {
          id: 'p1',
          text: '17 protons, 17 neutrons, and 17 electrons.',
          isCorrect: false,
          misconceptionExplanation: 'If neutrons were 17, mass number would be 17 + 17 = 34, not 37.',
        },
        {
          id: 'p2',
          text: '17 protons, 20 neutrons, and 17 electrons.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: '37 protons, 17 neutrons, and 20 electrons.',
          isCorrect: false,
          misconceptionExplanation: '37 is the mass number A (protons + neutrons), not the proton count.',
        },
      ],
      correctExplanation:
        'In the notation ³⁷₁₇Cl: Atomic number Z = 17, so there are 17 protons. Because the atom is neutral, it has 17 electrons. Mass number A = 37, so Neutrons N = A - Z = 37 - 17 = 20 neutrons.',
      relevantFormula: 'N = A - Z = 37 - 17 = 20 \\text{ neutrons}',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-discovery-subatomic-particles', name: 'Discovery of Subatomic Particles', subject: 'chemistry' },
      { id: 'ncert9-chem-isotopes-isobars', name: 'Isotopes & Isobars', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Nuclear Reactor Fuel Identification',
        description: 'Fissile Uranium-235 (²³⁵₉₂U with 143 neutrons) sustains chain reactions, unlike non-fissile Uranium-238 (²³⁸₉₂U with 146 neutrons).',
      },
      {
        title: 'Periodic Table Atomic Organization',
        description: 'Henry Moseley reorganized the periodic table by atomic number (Z) rather than atomic weight, resolving historical positioning anomalies.',
      },
      {
        title: 'Positron Emission Tomography (PET Scans)',
        description: 'Medical imaging detects gamma rays from decaying Fluorine-18 (¹⁸₉F, 9 protons, 9 neutrons) to map brain tumors.',
      },
    ],
  },

  {
    id: 'ncert9-chem-isotopes-isobars',
    title: 'Isotopes, Fractional Atomic Masses & Isobars',
    subject: 'chemistry',
    gradeLevel: 'Class 9',
    tagline: 'Protium/Deuterium/Tritium, Chlorine-35.5 average mass, medicine/reactor isotope applications, and isobars',
    description:
      'Isotopes are atoms of the SAME element having the same atomic number (Z) but different mass numbers (A) due to different neutron counts (e.g. Hydrogen has Protium ¹₁H, Deuterium ²₁H, Tritium ³₁H; Carbon has ¹²₆C and ¹⁴₆C). Chemical properties of isotopes are identical because they have identical electron configurations, but physical properties differ. Fractional atomic mass arises from natural isotope abundances: Chlorine occurs as 75% ³⁵Cl and 25% ³⁷Cl, giving an average mass of 35.5 u. Isobars are atoms of DIFFERENT elements with the same mass number (A) but different atomic numbers (Z) (e.g. ⁴⁰₁₈Ar and ⁴⁰₂₀Ca).',
    formulaLaTeX: 'A_{\\text{avg}} = \\sum (A_i \\times \\%_i) \\quad | \\quad A_{\\text{avg}}(\\text{Cl}) = \\left(35 \\times \\frac{75}{100}\\right) + \\left(37 \\times \\frac{25}{100}\\right) = 35.5\\text{ u}',
    formulaExplanation:
      'Isotopes have equal protons and electrons (same chemistry), differing only in neutron count. Applications include Cobalt-60 in cancer radiation therapy, Iodine-131 in goitre treatment, and Uranium-235 in nuclear power.',
    simulationType: 'structure-of-atom',
    variables: [
      {
        id: 'isotope35FractionPercent',
        name: 'Chlorine-35 Abundance',
        symbol: '\\%_{35}',
        unit: '%',
        min: 50,
        max: 90,
        step: 5,
        defaultValue: 75,
        description: 'Natural terrestrial abundance percentage of ³⁵Cl.',
      },
    ],
    prediction: {
      prompt: 'NCERT Fractional Atomic Mass Calculation',
      scenario:
        'Why is the atomic mass of chlorine listed on the periodic table as a fractional value (35.5 u), even though protons and neutrons are indivisible whole particles?',
      choices: [
        {
          id: 'p1',
          text: 'Because half a neutron is stuck inside every chlorine nucleus.',
          isCorrect: false,
          misconceptionExplanation: 'Neutrons are whole subatomic particles; fractional particles do not exist in stable atomic nuclei.',
        },
        {
          id: 'p2',
          text: 'Because 35.5 u is the weighted average atomic mass of naturally occurring Chlorine-35 (75%) and Chlorine-37 (25%) isotopes.',
          isCorrect: true,
          misconceptionExplanation: '',
        },
        {
          id: 'p3',
          text: 'Because electrons add exactly 0.5 u to the nuclear mass.',
          isCorrect: false,
          misconceptionExplanation: 'Electrons have negligible mass (~1/2000 u); 17 electrons contribute less than 0.009 u.',
        },
      ],
      correctExplanation:
        'Chlorine exists in nature in two isotopic forms: ³⁵₁₇Cl (accounting for ~75% of chlorine atoms) and ³⁷₁₇Cl (accounting for ~25%). The average atomic mass is calculated as: (35 × 3/4) + (37 × 1/4) = 105/4 + 37/4 = 142/4 = 35.5 u.',
      relevantFormula: 'A_{\\text{avg}} = \\left(35 \\times \\frac{3}{4}\\right) + \\left(37 \\times \\frac{1}{4}\\right) = 26.25 + 9.25 = 35.5\\text{ u}',
    },
    relatedConcepts: [
      { id: 'ncert9-chem-atomic-number-mass-number', name: 'Atomic Number & Mass Number', subject: 'chemistry' },
      { id: 'ncert9-chem-discovery-subatomic-particles', name: 'Discovery of Subatomic Particles', subject: 'chemistry' },
    ],
    realWorldApplications: [
      {
        title: 'Cobalt-60 in Cancer Radiotherapy',
        description: 'An isotope of cobalt (⁶⁰₂₇Co) emits penetrating gamma rays used in hospital oncology departments to destroy malignant tumor cells.',
      },
      {
        title: 'Carbon-14 Dating of Archaeological Artifacts',
        description: 'Radioactive decay of Carbon-14 (half-life 5730 years) allows historians to accurately date ancient Egyptian mummies and wooden relics.',
      },
      {
        title: 'Iodine-131 in Thyroid Goitre Treatment',
        description: 'Thyroid glands preferentially absorb iodine; controlled radioactive ¹³¹I treats thyroid cancer and hyperthyroidism.',
      },
    ],
  },
];
