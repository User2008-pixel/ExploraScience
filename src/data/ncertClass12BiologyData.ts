import { ConceptItem } from '../types/science';

export const NCERT_CLASS12_BIOLOGY_CONCEPTS: ConceptItem[] = [
  // --- HUMAN REPRODUCTION & MENSTRUAL CYCLE ---
  {
    id: 'ncert12-bio-human-reproduction-menstrual-cycle',
    title: 'Human Reproduction: Ovarian Cycle & Menstrual Hormonal Feedback',
    subject: 'biology',
    gradeLevel: 'Class 12',
    tagline: 'FSH follicle growth, LH surge day 14 ovulation, corpus luteum progesterone, and endometrial shedding',
    description:
      'The human female menstrual cycle (~28 days) coordinates gametogenesis and uterine preparation for pregnancy through pituitary and ovarian hormones: (1) Menstrual Phase (Days 1–5): Breakdown and shedding of the vascularized endometrial lining due to progesterone withdrawal; (2) Follicular / Proliferative Phase (Days 6–13): Pituitary Follicle Stimulating Hormone (FSH) stimulates primary follicle growth into a mature Graafian Follicle; growing follicular cells secrete Estrogen, which thickens the endometrium; (3) Ovulatory Phase (Day 14): Peak estrogen triggers positive feedback causing rapid Pituitary Luteinizing Hormone (LH) Surge: High LH induces rupture of Graafian follicle and release of secondary oocyte (Ovulation); (4) Luteal / Secretory Phase (Days 15–28): Ruptured follicle transforms into the glandular Corpus Luteum, secreting massive amounts of Progesterone to maintain secretory endometrium for implantation. If fertilization does not occur, corpus luteum degenerates into corpus albicans, progesterone crashes, and menstruation begins anew.',
    formulaLaTeX: '\\text{Estrogen Peak} \\xrightarrow{\\text{Positive Feedback}} \\text{LH Surge (Day 14)} \\implies \\text{Ovulation of Secondary Oocyte}',
    formulaExplanation:
      'Progesterone is essential for pregnancy maintenance. In absence of hCG from a blastocyst, the corpus luteum undergoes luteolysis.',
    variables: [
      { id: 'menstrualCycleDay', name: 'Cycle Day', symbol: 'Day', unit: 'days', min: 1, max: 28, step: 1, defaultValue: 14, description: 'Day of 28-day menstrual cycle (Day 14 = Ovulation).' },
    ],
    prediction: {
      prompt: 'What physiological hormonal event triggers the rupture of the Graafian follicle and ovulation on day 14 of the menstrual cycle?',
      scenario: 'Monitoring pituitary gonadotropin levels midway through the female cycle.',
      choices: [
        { id: 'p1', text: 'A rapid, massive surge in Luteinizing Hormone (LH surge) from the anterior pituitary gland.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'A sudden crash in estrogen levels to zero.', isCorrect: false, misconceptionExplanation: 'High estrogen levels trigger the positive feedback surge of LH.' },
        { id: 'p3', text: 'High progesterone secretion from the corpus luteum.', isCorrect: false, misconceptionExplanation: 'The corpus luteum forms after ovulation, not before.' },
      ],
      correctExplanation: 'Midway through the cycle (~day 14), high sustained estrogen from the mature Graafian follicle exerts positive feedback on the pituitary, producing a massive surge in LH (LH surge). This causes follicular enzymatic thinning, swelling, and explosive rupture, releasing the secondary oocyte into the fallopian tube.',
      relevantFormula: '\\text{LH Surge} = \\text{Maximum Gonadotropin Peak on Day 14}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Oral Contraceptive Birth Control Pills', description: 'Synthetic progesterone-estrogen combinations suppress pituitary FSH and LH secretion, preventing the LH surge and inhibiting ovulation.' },
      { title: 'In Vitro Fertilization (IVF) Oocyte Retrieval', description: 'Human chorionic gonadotropin (hCG) injections mimic the LH surge to trigger final oocyte maturation for ultrasound-guided follicle aspiration.' },
    ],
    simulationType: 'class12-biology',
  },

  // --- MOLECULAR GENETICS: DNA REPLICATION FORK ---
  {
    id: 'ncert12-bio-dna-replication-fork-architecture',
    title: 'Molecular Basis of Inheritance: Semi-Conservative DNA Replication Fork',
    subject: 'biology',
    gradeLevel: 'Class 12',
    tagline: 'Helicase, topoisomerase, leading strand 5’→3’, lagging strand Okazaki fragments & DNA ligase',
    description:
      'Meselson and Stahl proved that DNA replication is Semi-Conservative: each daughter duplex contains one conserved parental template strand and one newly synthesized strand: (1) Initiation: DNA Helicase unwinds the double helix at origin of replication, forming a Y-shaped Replication Fork; Single-Strand DNA-Binding Proteins (SSBs) stabilize open strands, while Topoisomerase (DNA Gyrase) relieves supercoiling tension; (2) Leading Strand: DNA Polymerase III synthesizes DNA continuously in the 5’ → 3’ direction toward the progressing fork, following a single RNA primer synthesized by Primase; (3) Lagging Strand: DNA Polymerase can only synthesize in 5’ → 3’ direction; because the opposite template runs 5’ → 3’ toward the fork, synthesis proceeds discontinuously away from the fork in short Okazaki Fragments (~1000–2000 nucleotides in prokaryotes); (4) Completion: DNA Polymerase I removes RNA primers via 5’→3’ exonuclease activity and fills gaps with DNA; DNA Ligase seals the phosphodiester nicks.',
    formulaLaTeX: '\\text{Continuous Leading Strand (5\'}\\to\\text{3\')} \\quad | \\quad \\text{Discontinuous Okazaki Lagging Strand (5\'}\\to\\text{3\')}',
    formulaExplanation:
      'All known DNA polymerases require a free 3’-OH group to extend a nucleotide chain; synthesis can proceed strictly in the 5’ to 3’ direction.',
    variables: [
      { id: 'replicationForkSpeed', name: 'Replication Rate', symbol: 'v', unit: 'nt/s', min: 100, max: 1000, step: 100, defaultValue: 500, description: 'Nucleotides polymerized per second.' },
    ],
    prediction: {
      prompt: 'Why is the lagging strand of DNA synthesized in short discontinuous Okazaki fragments rather than as a continuous strand?',
      scenario: 'Analyzing the enzymatic mechanism and directional constraints of DNA Polymerase.',
      choices: [
        { id: 'p1', text: 'DNA Polymerase can synthesize nucleotides strictly in the 5’ → 3’ direction, forcing synthesis on the anti-parallel lagging strand to point away from the advancing fork.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'The lagging strand template lacks adenine and thymine bases.', isCorrect: false, misconceptionExplanation: 'Base composition is balanced across both strands.' },
        { id: 'p3', text: 'Helicase breaks the lagging strand into pieces as it unwinds.', isCorrect: false, misconceptionExplanation: 'Helicase separates hydrogen bonds between complementary strands without breaking phosphodiester backbones.' },
      ],
      correctExplanation: 'The two strands of the DNA double helix are antiparallel (one 5’→3’, the other 3’→5’). DNA Polymerase catalytic active sites can only add new dNTPs to the free 3’-hydroxyl group of an existing strand (strict 5’→3’ polymerization). As the fork opens in the 3’→5’ direction of the lagging template, synthesis must proceed backwards away from the fork in repeated discontinuous Okazaki segments.',
      relevantFormula: '\\text{Direction of Polymerization: strictly 5\'} \\to \\text{3\'}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Polymerase Chain Reaction (PCR)', description: 'Taq polymerase utilizes oligonucleotide primers to amplify targeted DNA regions millions of times in thermal cycling forensic labs.' },
      { title: 'Antiviral Nucleoside Analogs (Acyclovir & AZT)', description: 'Chain terminators lacking a 3’-OH group block viral DNA polymerase extension, halting HIV and Herpes simplex replication.' },
    ],
    simulationType: 'class12-biology',
  },

  // --- GENE REGULATION: LAC OPERON ---
  {
    id: 'ncert12-bio-lac-operon-gene-regulation',
    title: 'Gene Expression & The Jacob-Monod Lac Operon Model',
    subject: 'biology',
    gradeLevel: 'Class 12',
    tagline: 'Polycistronic promoter (P), operator (O), repressor protein (i), and lacZ, lacY, lacA structural genes',
    description:
      'Elucidated by François Jacob and Jacques Monod in 1961 in E. coli, the Lac Operon is a genetic regulatory unit governing lactose metabolism: (1) Architecture: Regulatory gene (i gene) synthesizes constitutive Lac Repressor protein; Promoter (P) binds RNA Polymerase; Operator (O) acts as a switch; Structural genes: lacZ (codes for β-galactosidase, hydrolyzing lactose into glucose + galactose), lacY (permease, increasing cell permeability to lactose), and lacA (transacetylase); (2) Repressed State (Absence of Inducer): Active repressor tetramer binds tightly to the operator (O), physically blocking RNA Polymerase from transcribing structural genes (negative control, operon switched OFF); (3) Induced State (Presence of Lactose): A tiny amount of lactose entering the cell is converted to allolactose (Inducer). Allolactose binds the repressor protein, causing an allosteric conformational shift that inactivates it. The repressor detaches from the operator, allowing RNA Polymerase to transcribe polycistronic lac mRNA, synthesizing metabolic enzymes.',
    formulaLaTeX: '\\text{Repressor} + \\text{Allolactose (Inducer)} \\rightleftharpoons \\text{Inactive Complex} \\implies \\text{Transcription of } lacZ, lacY, lacA',
    formulaExplanation:
      'The lac operon is an inducible catabolic operon: enzymes are synthesized only when their substrate (lactose) is present and preferable glucose is absent.',
    variables: [
      { id: 'lactoseInducerLevel', name: 'Lactose Present', symbol: 'Lac', unit: 'state', min: 0, max: 1, step: 1, defaultValue: 1, description: '0=No Lactose (Operon OFF), 1=Lactose Present (Operon ON).' },
    ],
    prediction: {
      prompt: 'What happens to the lac operon when an E. coli bacterium is grown in a culture medium with lactose but without glucose?',
      scenario: 'Bacterium encounters lactose as sole carbon and energy source.',
      choices: [
        { id: 'p1', text: 'Allolactose binds and inactivates the repressor protein, freeing the operator and allowing high transcription of lacZ, lacY, and lacA.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'The repressor binds the promoter and halts all transcription.', isCorrect: false, misconceptionExplanation: 'Repressor binds the operator, not promoter; in presence of lactose it detaches.' },
        { id: 'p3', text: 'The structural genes mutate into non-functional sequences.', isCorrect: false, misconceptionExplanation: 'Gene regulation modulates expression rate without altering DNA sequence.' },
      ],
      correctExplanation: 'Lactose entering the cell provides allolactose, which acts as an inducer by binding to the lac repressor. This conformational change prevents the repressor from binding the operator region. With the operator clear, RNA Polymerase transcribes the structural genes, producing β-galactosidase, permease, and transacetylase to digest lactose.',
      relevantFormula: '\\text{Inducer Present} \\implies \\text{Operator Unblocked} \\implies \\text{Enzyme Synthesis ON}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Recombinant Protein Expression in Biotech (IPTG Induction)', description: 'Biotechnology production of human recombinant insulin in E. coli uses the non-hydrolyzable lactose analog IPTG to switch on high-level therapeutic protein synthesis.' },
      { title: 'Blue-White Colony Screening for Recombinant Plasmids', description: 'Disruption of the lacZ gene by inserted foreign DNA prevents functional β-galactosidase production, producing white recombinant colonies on X-gal plates.' },
    ],
    simulationType: 'class12-biology',
  },

  // --- BIOTECHNOLOGY: GEL ELECTROPHORESIS ---
  {
    id: 'ncert12-bio-biotechnology-gel-electrophoresis',
    title: 'Biotechnology: Agarose Gel Electrophoresis & Restriction Digestion',
    subject: 'biology',
    gradeLevel: 'Class 12',
    tagline: 'Negatively charged DNA migration toward anode (+) separated by molecular size in agarose mesh',
    description:
      'Agarose Gel Electrophoresis is the standard molecular technique used to separate restriction-digested DNA fragments according to size: (1) Charge Principle: DNA is polyanionic due to negatively charged phosphate groups (PO₄³⁻) in its sugar-phosphate backbone (constant charge-to-mass ratio). Under an applied electric field, DNA fragments migrate toward the positive electrode (Anode +); (2) Molecular Sieving: The porous polysaccharide 3D agarose matrix acts as a molecular sieve. Smaller DNA fragments experience lower frictional drag and migrate faster and farther down the gel, while larger fragments are hindered and remain closer to the wells near the cathode (-); (3) Visualization: DNA bands cannot be seen in daylight; staining with Ethidium Bromide (EtBr) intercalating dye and illumination under Ultraviolet (UV) light excites bright orange fluorescent bands; (4) Elution: Desired bands are excised and purified for gene cloning vectors.',
    formulaLaTeX: '\\text{Migration Distance } d \\propto \\frac{1}{\\log_{10}(\\text{Base Pairs})} \\quad | \\quad \\text{DNA moves from } (-) \\to (+)',
    formulaExplanation:
      'Logarithm of molecular size in base pairs is inversely proportional to migration distance through the agarose gel.',
    variables: [
      { id: 'agarosePercentage', name: 'Agarose Gel %', symbol: '\\%\\text{Gel}', unit: '%', min: 0.5, max: 2.0, step: 0.5, defaultValue: 1.0, description: 'Agarose concentration (higher % gives tighter pores for small fragments).' },
    ],
    prediction: {
      prompt: 'During agarose gel electrophoresis of DNA, toward which electrode do DNA fragments migrate, and which fragments travel the farthest distance?',
      scenario: 'Applying 100 V electric field to DNA loaded in submerged agarose gel.',
      choices: [
        { id: 'p1', text: 'Migrate toward the positive anode (+); smaller DNA fragments travel the farthest distance.', isCorrect: true, misconceptionExplanation: '' },
        { id: 'p2', text: 'Migrate toward the negative cathode (-); larger DNA fragments travel the farthest.', isCorrect: false, misconceptionExplanation: 'DNA is negatively charged and repelled by the cathode; larger fragments migrate slower.' },
        { id: 'p3', text: 'Migrate toward the positive anode (+); larger DNA fragments travel the farthest.', isCorrect: false, misconceptionExplanation: 'Larger fragments encounter more resistance in the gel pores and stay near the top.' },
      ],
      correctExplanation: 'Because DNA has a uniform negative charge from its phosphate backbone, it is attracted toward the positive electrode (anode). The porous agarose mesh retards larger molecules more than smaller ones. Consequently, smaller DNA fragments weave through the matrix faster, traveling the greatest distance from the wells.',
      relevantFormula: 'v_{\\text{migration}} \\propto \\frac{q}{f_{\\text{friction}}} \\implies \\text{Smaller fragments travel farthest toward Anode (+)}',
    },
    relatedConcepts: [],
    realWorldApplications: [
      { title: 'Forensic DNA Fingerprinting (VNTR Analysis)', description: 'Criminal investigations and paternity testing compare Short Tandem Repeat (STR) electrophoresis band profiles to identify suspects with 99.999% statistical certainty.' },
      { title: 'mRNA Vaccine Quality Control', description: 'Capillary gel electrophoresis verifies exact size integrity and purity of synthetic mRNA transcripts before lipid encapsulation in COVID-19 vaccines.' },
    ],
    simulationType: 'class12-biology',
  },
];
