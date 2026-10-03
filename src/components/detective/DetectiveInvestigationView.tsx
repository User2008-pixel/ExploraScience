import React, { useState } from 'react';
import { DetectiveCase, DataMeasurement, MistakeCategory } from '../../types/science';
import { Formula } from '../common/Formula';
import { VariableSlider } from '../common/VariableSlider';
import { GraphViewer } from '../common/GraphViewer';
import { DetectiveSimCanvas } from './DetectiveSimCanvas';
import {
  Search,
  HelpCircle,
  Lightbulb,
  Sliders,
  Play,
  Table as TableIcon,
  LineChart,
  BrainCircuit,
  FileCheck,
  Award,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  PlusCircle,
  RefreshCw,
  Coins,
  Sparkles,
  Zap,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DetectiveInvestigationViewProps {
  detectiveCase: DetectiveCase;
  onBack: () => void;
  onCompleteInvestigation: (summary: {
    caseId: string;
    caseTitle: string;
    hypothesis: string;
    independentVar: string;
    dependentVar: string;
    measurementsCount: number;
    conclusion: string;
    hintsUsed: number;
    understandingScore: number;
    mistakes: MistakeCategory[];
  }) => void;
  scienceCredits?: number;
  onDeductCredits?: (amount: number, reason: string) => boolean;
}

const HINT_CREDIT_COST = 20;

const STEPS = [
  { id: 1, label: 'Observe', icon: Search },
  { id: 2, label: 'Question', icon: HelpCircle },
  { id: 3, label: 'Hypothesis', icon: Lightbulb },
  { id: 4, label: 'Design', icon: Sliders },
  { id: 5, label: 'Experiment', icon: Play },
  { id: 6, label: 'Data', icon: TableIcon },
  { id: 7, label: 'Visualise', icon: LineChart },
  { id: 8, label: 'Analyze', icon: BrainCircuit },
  { id: 9, label: 'Conclusion', icon: FileCheck },
  { id: 10, label: 'Scientific Explanation', icon: Award },
];

interface CaseMisconceptionGuidance {
  correctIndependentVar: string;
  variableRationales: Record<string, { isCorrect: boolean; explanation: string }>;
  correctRelationship: string;
  relationshipExplanation: string;
}

const CASE_GUIDANCE: Record<string, CaseMisconceptionGuidance> = {
  'case-two-spoons': {
    correctIndependentVar: 'materialThermalConductivity',
    variableRationales: {
      ambientTemp: {
        isCorrect: false,
        explanation: 'Misconception: Both spoons sit in the same 20°C room and have reached thermal equilibrium (Zeroth Law of Thermodynamics). Ambient temperature is identical for both spoons, so it cannot explain why one feels colder.',
      },
      contactTime: {
        isCorrect: false,
        explanation: 'Misconception: The sensation of chilling coldness is perceived immediately upon first contact. Contact time is a measurement parameter, not the distinguishing material property.',
      },
      skinTemp: {
        isCorrect: false,
        explanation: 'Misconception: Skin temperature (~34°C) is constant on both hands; it acts as the thermal reservoir, not the variable distinguishing the spoons.',
      },
      materialThermalConductivity: {
        isCorrect: true,
        explanation: 'Correct! Stainless steel has thermal conductivity k ≈ 16 W/m·K, which conducts heat away from 34°C fingertips over 100x faster than wood (k ≈ 0.15 W/m·K). Human thermoreceptors detect heat flux (dQ/dt), not static temperature.',
      },
    },
    correctRelationship: 'Directly Proportional (Linear)',
    relationshipExplanation: "Fourier's Law (dQ/dt = -k A ΔT/Δx) proves that heat flux is directly proportional (linear) to the thermal conductivity k of the material.",
  },
  'case-car-stopping': {
    correctIndependentVar: 'surfaceFriction',
    variableRationales: {
      vehicleMass: {
        isCorrect: false,
        explanation: 'Misconception: By the Work-Energy Theorem, kinetic friction force f = μ·m·g and kinetic energy = ½·m·v². Mass m cancels out on both sides (d = v² / (2μg))! Ideal stopping distance is independent of vehicle mass.',
      },
      initialVelocity: {
        isCorrect: false,
        explanation: 'Misconception: Both test runs occurred at the identical speed of 20 m/s. Initial speed was controlled and constant, not what varied between dry asphalt and wet ice.',
      },
      surfaceFriction: {
        isCorrect: true,
        explanation: 'Correct! Wet ice (μ ≈ 0.1) provides 8x less frictional traction than dry asphalt (μ ≈ 0.8), reducing the decelerating force and extending stopping distance from 25.5 m to 102 m.',
      },
    },
    correctRelationship: 'Inversely Proportional',
    relationshipExplanation: 'Stopping distance d = v₀² / (2 μ_k g). Friction coefficient μ_k appears in the denominator, meaning stopping distance is inversely proportional to friction: halving friction doubles stopping distance.',
  },
  'case-circuit-mystery': {
    correctIndependentVar: 'internalResistance',
    variableRationales: {
      supplyVoltage: {
        isCorrect: false,
        explanation: 'Misconception: The bench DC power supply dial was confirmed at 12V in all test configurations. Terminal voltage dropped because of parasitic internal resistance inside the power supply.',
      },
      bulbResistance: {
        isCorrect: false,
        explanation: 'Misconception: The halogen bulb is a standard 6.0 Ω unit and was tested on another bench working fine. The issue is external to the bulb.',
      },
      internalResistance: {
        isCorrect: true,
        explanation: 'Correct! Parasitic internal resistance (r_int ≈ 9 Ω) forms a voltage divider with the 6 Ω bulb, dropping terminal voltage from 12V down to 4.8V and starving the bulb of current.',
      },
    },
    correctRelationship: 'Inversely Proportional',
    relationshipExplanation: 'Terminal voltage V = E · R / (R + r_int). As internal resistance r_int increases, bulb voltage and operating current decrease inversely.',
  },
  'case-reaction-slowdown': {
    correctIndependentVar: 'catalystSurfaceArea',
    variableRationales: {
      temperatureK: {
        isCorrect: false,
        explanation: 'Misconception: Temperature was held constant at 25°C throughout the batch run. Thermal kinetic energy was stable.',
      },
      reactantConcentration: {
        isCorrect: false,
        explanation: 'Misconception: Starting reactant concentration was maintained at standard 1.0 M. Catalyst clumping was the root cause.',
      },
      catalystSurfaceArea: {
        isCorrect: true,
        explanation: 'Correct! Clumping pellets reduced exposed catalyst surface area by 75%. Heterogeneous catalysis requires accessible surface active sites for adsorption and activation.',
      },
    },
    correctRelationship: 'Directly Proportional (Linear)',
    relationshipExplanation: 'In heterogeneous surface catalysis, reaction rate is directly proportional to accessible catalyst active surface area.',
  },
  'case-plant-limiting-factor': {
    correctIndependentVar: 'co2Level',
    variableRationales: {
      co2Level: {
        isCorrect: true,
        explanation: "Correct! By Blackman's Law of Limiting Factors, increasing light beyond 800 μmol/m²·s produces zero extra photosynthesis because carbon dioxide concentration (380 ppm) is the deficient substrate limiting RuBisCO carboxylation.",
      },
      lightLevel: {
        isCorrect: false,
        explanation: "Misconception: Light intensity was already saturated at 1,200 μmol/m²·s. Adding more light cannot increase photosynthetic yield when CO₂ is the limiting substrate (Blackman's Law).",
      },
      ambientTemp: {
        isCorrect: false,
        explanation: 'Misconception: Ambient temperature was maintained at 22°C (optimal for C3 RuBisCO activity). Thermal conditions were stable, not deficient.',
      },
    },
    correctRelationship: 'Quadratic / Independent',
    relationshipExplanation: "Photosynthetic rate reaches a plateau and becomes independent of light intensity once light saturation is reached, limited strictly by CO₂ availability.",
  },
  'case-enzyme-inactivation': {
    correctIndependentVar: 'treatmentTemp',
    variableRationales: {
      reactionPH: {
        isCorrect: false,
        explanation: 'Misconception: The reaction buffer was strictly maintained at pH 7.0. Acidity was not the inactivating stressor.',
      },
      substrateAmount: {
        isCorrect: false,
        explanation: 'Misconception: Substrate was supplied in excess. The enzyme lost catalytic competence due to thermal denaturation.',
      },
      treatmentTemp: {
        isCorrect: true,
        explanation: 'Correct! Exceeding 45°C thermally disrupted hydrogen bonds and electrostatic linkages maintaining tertiary folding, permanently denaturing the catalytic active site.',
      },
    },
    correctRelationship: 'Quadratic / Independent',
    relationshipExplanation: 'Enzyme activity follows a bell-shaped thermal curve: rising with kinetic collisions up to ~37°C optimum, then plummeting irreversibly to zero due to thermal denaturation.',
  },
};

interface SubjectiveChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface CaseSubjectiveSolution {
  modelInquiry: string;
  inquiryChoices: SubjectiveChoice[];
  modelHypothesis: string;
  hypothesisChoices: SubjectiveChoice[];
  modelConclusion: string;
  conclusionChoices: SubjectiveChoice[];
}

const CASE_SUBJECTIVE_SOLUTIONS: Record<string, CaseSubjectiveSolution> = {
  'case-two-spoons': {
    modelInquiry: 'Does our thermal perception of coldness reflect lower material temperature or a higher rate of conductive heat transfer from fingertips?',
    inquiryChoices: [
      {
        id: 'inq_1',
        text: 'Does our thermal perception of coldness reflect lower material temperature or a higher rate of conductive heat transfer (dQ/dt) from fingertips?',
        isCorrect: true,
        explanation: "Scientifically Validated: Investigates whether human thermal receptors measure heat flux (conductive rate dQ/dt) rather than static equilibrium temperature under the Zeroth Law.",
      },
      {
        id: 'inq_2',
        text: 'Why does the metal spoon naturally stay at a lower thermometer temperature (e.g., 10°C) than the wooden spoon in ambient room air?',
        isCorrect: false,
        explanation: 'Scientific Misconception: Both spoons rested in the 20°C room for 14 hours. By the Zeroth Law of Thermodynamics, all inert objects reach identical ambient equilibrium temperature.',
      },
      {
        id: 'inq_3',
        text: 'How does the density and weight of the metal spoon attract cold air currents to its surface?',
        isCorrect: false,
        explanation: 'Scientific Misconception: Object density does not create cold air currents; sensory perception is determined by conductive heat transfer upon skin contact.',
      },
    ],
    modelHypothesis: 'If stainless steel has 100× higher thermal conductivity than birch wood, then heat drains rapidly from warm skin into the metal spoon even though both objects sit at an identical ambient 20°C in thermal equilibrium.',
    hypothesisChoices: [
      {
        id: 'hyp_1',
        text: 'If stainless steel has 100× higher thermal conductivity (k ≈ 16 W/m·K) than birch wood (k ≈ 0.15 W/m·K), then heat drains rapidly from warm skin into the metal spoon even though both spoons are at identical 20°C equilibrium.',
        isCorrect: true,
        explanation: "Scientifically Validated: Identifies the root physical parameter (thermal conductivity k) and explains the heat flux mechanism according to Fourier's Law.",
      },
      {
        id: 'hyp_2',
        text: 'If metal is an inherently cold element, then its internal temperature will always measure 5 to 10 degrees below surrounding air.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Materials do not possess inherent coldness; temperature reflects average molecular kinetic energy, which equilibrates with the room.',
      },
      {
        id: 'hyp_3',
        text: 'If human skin touches metal, the spoon generates a cold electrical current that numbs fingertip thermoreceptors.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Thermal nerve impulses are triggered by conductive thermal energy loss (dQ/dt), not electrical voltage.',
      },
    ],
    modelConclusion: 'Both spoons are at an identical 20°C in thermal equilibrium (Zeroth Law of Thermodynamics). The steel spoon feels colder because stainless steel has a thermal conductivity (k ≈ 16 W/m·K) over 100 times higher than birch wood (k ≈ 0.15 W/m·K), conducting heat away from 34°C fingertips far more rapidly. Human skin perceives heat flux (dQ/dt), not static temperature.',
    conclusionChoices: [
      {
        id: 'conc_1',
        text: 'Both spoons are at an identical 20°C in thermal equilibrium (Zeroth Law of Thermodynamics). The steel spoon feels colder because stainless steel has a thermal conductivity (k ≈ 16 W/m·K) over 100 times higher than birch wood (k ≈ 0.15 W/m·K), conducting heat away from 34°C fingertips far more rapidly. Human skin perceives heat flux (dQ/dt), not static temperature.',
        isCorrect: true,
        explanation: "Scientifically Validated: Accurately synthesizes empirical measurements, the Zeroth Law of Thermodynamics, and Fourier's Law of Conduction.",
      },
      {
        id: 'conc_2',
        text: 'The metal spoon is physically colder than the wooden spoon because thermometer readings fail to register metal temperature accurately.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Calibrated thermistors and IR cameras measure true thermodynamic temperature; both spoons measure exactly 20.0°C.',
      },
      {
        id: 'conc_3',
        text: 'Wood feels warmer because wooden cellulose molecules actively generate metabolic heat on the laboratory bench.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Dry birch wood is non-living matter and produces zero metabolic heat; it feels warmer because it acts as a thermal insulator.',
      },
    ],
  },
  'case-car-stopping': {
    modelInquiry: 'What fundamental physical factor dictates emergency stopping distance, and why does vehicle mass cancel out of the braking equation?',
    inquiryChoices: [
      {
        id: 'inq_1',
        text: 'What fundamental physical factor dictates emergency stopping distance, and why does vehicle mass cancel out of the braking equation?',
        isCorrect: true,
        explanation: "Scientifically Validated: Evaluates the Work-Energy Theorem (W = ΔK) and examines how friction coefficient μ_k and speed v₀ determine stopping distance.",
      },
      {
        id: 'inq_2',
        text: 'Why do heavy vehicles take four times as long to stop because of their massive kinetic momentum?',
        isCorrect: false,
        explanation: 'Scientific Misconception: While heavier mass has more momentum, it also produces proportionally greater normal force and braking friction (f = μ·m·g), so mass cancels out.',
      },
      {
        id: 'inq_3',
        text: 'How does vehicle exterior color and paint finish influence low-speed braking distance on ice?',
        isCorrect: false,
        explanation: 'Scientific Misconception: Paint finish has zero physical interaction with tire-surface contact mechanics.',
      },
    ],
    modelHypothesis: 'If kinetic friction work dissipates vehicle kinetic energy (W = ΔK), then stopping distance is inversely proportional to road surface friction (d = v₀² / 2μg) and independent of vehicle mass.',
    hypothesisChoices: [
      {
        id: 'hyp_1',
        text: 'If kinetic friction work dissipates vehicle kinetic energy (W = ΔK), then stopping distance is inversely proportional to road surface friction (d = v₀² / 2μg) and independent of vehicle mass.',
        isCorrect: true,
        explanation: 'Scientifically Validated: Correctly applies the Work-Energy Theorem, isolating friction μ_k as the governing variable and showing mass cancellation.',
      },
      {
        id: 'hyp_2',
        text: 'If vehicle mass is doubled from 1,200 kg to 2,400 kg, then stopping distance on ice will automatically double due to momentum.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Doubling mass doubles normal force, doubling available braking traction; ideal stopping distance is completely independent of mass.',
      },
      {
        id: 'hyp_3',
        text: 'If initial velocity is doubled, stopping distance will only increase by 2× linearly.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Kinetic energy scales with velocity squared (v₀²); doubling speed quadruples (4×) braking distance!',
      },
    ],
    modelConclusion: 'By the Work-Energy Theorem (W = ΔK), friction force f_k = μ_k·m·g does work over distance d to dissipate kinetic energy ½·m·v₀². Mass m cancels out on both sides, yielding d = v₀² / (2 μ_k g). Stopping distance is inversely proportional to friction coefficient μ_k. Wet ice (μ ≈ 0.1) provides 8× less traction than dry asphalt (μ ≈ 0.8), extending stopping distance from 25.5 m to 102 m regardless of vehicle mass.',
    conclusionChoices: [
      {
        id: 'conc_1',
        text: 'By the Work-Energy Theorem (W = ΔK), friction force f_k = μ_k·m·g does work over distance d to dissipate kinetic energy ½·m·v₀². Mass m cancels out on both sides, yielding d = v₀² / (2 μ_k g). Stopping distance is inversely proportional to friction coefficient μ_k. Wet ice (μ ≈ 0.1) provides 8× less traction than dry asphalt (μ ≈ 0.8), extending stopping distance from 25.5 m to 102 m regardless of vehicle mass.',
        isCorrect: true,
        explanation: 'Scientifically Validated: Synthesizes friction work dissipation, mass invariance, and the empirical 4× skid distance on ice.',
      },
      {
        id: 'conc_2',
        text: 'Vehicle mass was the primary reason the car skidded on ice, and reducing mass by half would have stopped the car instantly.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Normal force scales with mass, so reducing vehicle mass reduces braking force by the identical ratio.',
      },
      {
        id: 'conc_3',
        text: 'Stopping distance is independent of road friction; the car skidded because the brakes overheated on the ice.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Wet ice reduces the tire-road friction coefficient from ~0.8 down to ~0.1, which is the direct cause of the 102 m stopping distance.',
      },
    ],
  },
  'case-circuit-mystery': {
    modelInquiry: 'Why does a 12V halogen bulb receive only 4.8V and burn with a dim reddish glow when connected to the DC power supply?',
    inquiryChoices: [
      {
        id: 'inq_1',
        text: 'Why does a 12V halogen bulb receive only 4.8V and burn with a dim reddish glow when connected to the DC power supply?',
        isCorrect: true,
        explanation: "Scientifically Validated: Targets the terminal voltage drop and the internal impedance of the DC power supply under load.",
      },
      {
        id: 'inq_2',
        text: 'Why did the halogen bulb create negative electrical charge and consume 7.2V of voltage internally?',
        isCorrect: false,
        explanation: 'Scientific Misconception: Passive electrical loads cannot create negative voltage; the voltage loss occurs across internal source resistance.',
      },
      {
        id: 'inq_3',
        text: 'Why does DC electricity turn into magnetic waves before reaching the lamp?',
        isCorrect: false,
        explanation: 'Scientific Misconception: Steady DC current in a resistive circuit produces a static magnetic field, not electromagnetic radiation loss.',
      },
    ],
    modelHypothesis: 'If the bench DC power supply has parasitic internal resistance (r_int ≈ 9 Ω), then an internal voltage divider drops terminal voltage down to 4.8V under current draw (V = E - I·r).',
    hypothesisChoices: [
      {
        id: 'hyp_1',
        text: 'If the bench DC power supply has parasitic internal resistance (r_int ≈ 9 Ω), then an internal voltage divider drops terminal voltage down to 4.8V under current draw (V = E - I·r).',
        isCorrect: true,
        explanation: "Scientifically Validated: Applies Kirchhoff's Voltage Law to predict terminal voltage sag V = E - I·r across an internal series impedance.",
      },
      {
        id: 'hyp_2',
        text: 'If the halogen bulb resistance is 6.0 Ω, then it is defective and cannot accept 12V under any circuit configuration.',
        isCorrect: false,
        explanation: 'Scientific Misconception: The bulb was independently tested on an ideal power supply and operated normally; the resistance fault is internal to the supply.',
      },
      {
        id: 'hyp_3',
        text: 'If circuit current exceeds 0.5A, charge carriers evaporate from copper wire leads before reaching the lamp.',
        isCorrect: false,
        explanation: "Scientific Misconception: Electric charge is strictly conserved by Kirchhoff's Current Law; electrons do not evaporate from conductors.",
      },
    ],
    modelConclusion: "The bulb failed to burn at rated 24W brightness because the power supply circuit has a high internal series resistance (r_int = 9.0 Ω). By Kirchhoff's loop rule (E = I·R_bulb + I·r_int), the 9 Ω internal resistance and 6 Ω bulb form a voltage divider. Terminal voltage collapsed to 4.8V and current dropped to 0.8A, slashing power dissipation from 24W down to 3.8W (an 84% reduction in optical output).",
    conclusionChoices: [
      {
        id: 'conc_1',
        text: "The bulb failed to burn at rated 24W brightness because the power supply circuit has a high internal series resistance (r_int = 9.0 Ω). By Kirchhoff's loop rule (E = I·R_bulb + I·r_int), the 9 Ω internal resistance and 6 Ω bulb form a voltage divider. Terminal voltage collapsed to 4.8V and current dropped to 0.8A, slashing power dissipation from 24W down to 3.8W (an 84% reduction in optical output).",
        isCorrect: true,
        explanation: 'Scientifically Validated: Rigorously calculates voltage divider division, current drop, and the resultant 84% reduction in power (P = I²R).',
      },
      {
        id: 'conc_2',
        text: 'The power supply was completely empty of electrical charge and delivered zero volts at all times.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Open-circuit electromotive force measured 12.0V; voltage collapsed only when current flowed through the internal resistance.',
      },
      {
        id: 'conc_3',
        text: 'Halogen gas inside the glass envelope neutralized electrical voltage and stopped the current.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Halogen gas chemically redeposits evaporated tungsten onto the filament; it does not alter electrical resistance.',
      },
    ],
  },
  'case-reaction-slowdown': {
    modelInquiry: 'Why did hydrogen peroxide decomposition rate collapse by 80% when chemical analysis showed 75% of H₂O₂ reactant was still unreacted?',
    inquiryChoices: [
      {
        id: 'inq_1',
        text: 'Why did hydrogen peroxide decomposition rate collapse by 80% when chemical analysis showed 75% of H₂O₂ reactant was still unreacted?',
        isCorrect: true,
        explanation: 'Scientifically Validated: Investigates heterogeneous surface kinetics and active site accessibility in catalyzed decomposition.',
      },
      {
        id: 'inq_2',
        text: 'Why did 75% of hydrogen peroxide molecules decide to stop colliding because of boredom?',
        isCorrect: false,
        explanation: 'Scientific Misconception: Chemical kinetics depends on physical collision frequency and activation energy, not molecular volition.',
      },
      {
        id: 'inq_3',
        text: 'Why does hydrogen peroxide turn into solid ice when exposed to manganese dioxide?',
        isCorrect: false,
        explanation: 'Scientific Misconception: Decomposition of H₂O₂ is exothermic and produces liquid water and oxygen gas; no freezing occurs.',
      },
    ],
    modelHypothesis: 'If the heterogeneous MnO₂ catalyst aggregates into coarse clumps, then exposed active surface area plummets, slashing effective molecular collisions and reaction velocity.',
    hypothesisChoices: [
      {
        id: 'hyp_1',
        text: 'If the heterogeneous MnO₂ catalyst aggregates into coarse clumps, then exposed active surface area plummets, slashing effective molecular collisions and reaction velocity.',
        isCorrect: true,
        explanation: 'Scientifically Validated: Identifies catalyst surface area as the limiting factor in heterogeneous surface reactions.',
      },
      {
        id: 'hyp_2',
        text: 'If H₂O₂ decomposes to 25%, the reaction automatically hits an irreversible chemical barrier and stops forever.',
        isCorrect: false,
        explanation: 'Scientific Misconception: H₂O₂ decomposition is thermodynamically favored (ΔG < 0) and proceeds to completion if active catalytic sites are available.',
      },
      {
        id: 'hyp_3',
        text: 'If manganese dioxide is used, it is completely consumed as a chemical reactant within 3 minutes.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Catalysts participate in transition states without being consumed; MnO₂ mass remains constant after reaction.',
      },
    ],
    modelConclusion: 'The reaction rate collapsed because the heterogeneous manganese dioxide (MnO₂) catalyst aggregated into coarse clumps, reducing exposed active surface area by 75%. Heterogeneous catalysis requires reactant molecules to adsorb onto accessible active surface sites (Rate = k·A_surf·[H₂O₂]). Reactant abundance cannot sustain the rate when catalyst surface area is severely diminished.',
    conclusionChoices: [
      {
        id: 'conc_1',
        text: 'The reaction rate collapsed because the heterogeneous manganese dioxide (MnO₂) catalyst aggregated into coarse clumps, reducing exposed active surface area by 75%. Heterogeneous catalysis requires reactant molecules to adsorb onto accessible active surface sites (Rate = k·A_surf·[H₂O₂]). Reactant abundance cannot sustain the rate when catalyst surface area is severely diminished.',
        isCorrect: true,
        explanation: 'Scientifically Validated: Correctly connects heterogeneous active site adsorption with overall reaction rate kinetics.',
      },
      {
        id: 'conc_2',
        text: 'The reaction stopped because hydrogen peroxide spontaneously transformed into toxic mercury vapor.',
        isCorrect: false,
        explanation: 'Scientific Misconception: H₂O₂ contains only hydrogen and oxygen; it decomposes into non-toxic water (H₂O) and oxygen (O₂).',
      },
      {
        id: 'conc_3',
        text: 'Heterogeneous catalysts only operate for 60 seconds before permanently losing their electrical charge.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Catalysts cycle indefinitely unless chemically poisoned; clumping physically buries active sites without destroying them.',
      },
    ],
  },
  'case-plant-limiting-factor': {
    modelInquiry: 'Why did quadrupling lighting power from 300 to 1,200 μmol/m²·s produce zero extra spinach biomass growth?',
    inquiryChoices: [
      {
        id: 'inq_1',
        text: 'Why did quadrupling lighting power from 300 to 1,200 μmol/m²·s produce zero extra spinach biomass growth?',
        isCorrect: true,
        explanation: "Scientifically Validated: Targets photosynthetic saturation and Blackman's Law of Limiting Factors in crop physiology.",
      },
      {
        id: 'inq_2',
        text: 'Why do spinach plants hate artificial light and close their stomata in protest?',
        isCorrect: false,
        explanation: 'Scientific Misconception: Plant biochemical pathways respond to light saturation and substrate availability, not psychological resistance.',
      },
      {
        id: 'inq_3',
        text: 'Why does green chlorophyll absorb all light wavelengths and destroy surplus photons?',
        isCorrect: false,
        explanation: 'Scientific Misconception: Chlorophyll reflects green light and absorbs red and blue; excess photons are dissipated as heat and non-photochemical quenching.',
      },
    ],
    modelHypothesis: "If carbon dioxide concentration is low (320 ppm), then photosynthetic yield reaches a plateau limited strictly by CO₂ availability according to Blackman's Law.",
    hypothesisChoices: [
      {
        id: 'hyp_1',
        text: "If carbon dioxide concentration is low (320 ppm), then photosynthetic yield reaches a plateau limited strictly by CO₂ availability according to Blackman's Law.",
        isCorrect: true,
        explanation: "Scientifically Validated: Applies Blackman's Law to predict that the dark reaction (Calvin cycle) cannot utilize excess ATP/NADPH without substrate CO₂.",
      },
      {
        id: 'hyp_2',
        text: 'If photon flux exceeds 300 μmol/m²·s, spinach chloroplasts evaporate into the atmosphere.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Chloroplasts are membrane-bound cellular organelles that remain intact during photoinhibition.',
      },
      {
        id: 'hyp_3',
        text: 'If light intensity is increased, photosynthetic biomass must increase towards infinity without any biological ceiling.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Multi-step biochemical pathways always reach a saturation asymptote governed by the slowest enzymatic reaction.',
      },
    ],
    modelConclusion: "According to Blackman's Law of Limiting Factors (1905), the rate of a multi-step physiological process is governed by the factor in shortest supply. In the enclosed greenhouse, CO₂ was depleted to 320 ppm. While the light reactions generated ample ATP and NADPH, the Calvin cycle enzyme RuBisCO lacked carbon substrate to fix into sugars. Increasing light beyond light saturation yielded a flat growth rate of 1.4 g/day until CO₂ was elevated.",
    conclusionChoices: [
      {
        id: 'conc_1',
        text: "According to Blackman's Law of Limiting Factors (1905), the rate of a multi-step physiological process is governed by the factor in shortest supply. In the enclosed greenhouse, CO₂ was depleted to 320 ppm. While the light reactions generated ample ATP and NADPH, the Calvin cycle enzyme RuBisCO lacked carbon substrate to fix into sugars. Increasing light beyond light saturation yielded a flat growth rate of 1.4 g/day until CO₂ was elevated.",
        isCorrect: true,
        explanation: 'Scientifically Validated: Elegantly balances the light reactions with RuBisCO carbon fixation kinetics and Blackman’s Principle.',
      },
      {
        id: 'conc_2',
        text: 'Spinach growth stopped because plants only grow in outdoor soil, never in controlled hydroponic benches.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Hydroponics yields superior growth rates when atmospheric CO₂ is balanced with lighting.',
      },
      {
        id: 'conc_3',
        text: 'Light energy is not used in photosynthesis; plants synthesize sugars exclusively from liquid root water.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Photons are essential to split water and drive photophosphorylation; CO₂ provides carbon atoms for carbohydrates.',
      },
    ],
  },
  'case-enzyme-inactivation': {
    modelInquiry: 'Why did human salivary amylase fail to digest starch after being heated to 80°C and then cooled back to its optimal 37°C temperature?',
    inquiryChoices: [
      {
        id: 'inq_1',
        text: 'Why did human salivary amylase fail to digest starch after being heated to 80°C and then cooled back to its optimal 37°C temperature?',
        isCorrect: true,
        explanation: 'Scientifically Validated: Investigates irreversible thermal denaturation of enzyme tertiary conformation.',
      },
      {
        id: 'inq_2',
        text: 'Why does saliva transform into hydrochloric acid when warmed above normal body temperature?',
        isCorrect: false,
        explanation: 'Scientific Misconception: Thermal energy unfolds polypeptide chains; it does not convert saliva into mineral acid.',
      },
      {
        id: 'inq_3',
        text: 'Why do starch molecules build impenetrable barriers that prevent enzymes from touching them at 37°C?',
        isCorrect: false,
        explanation: 'Scientific Misconception: Starch remains chemically accessible; the failure is caused by the destruction of the enzyme catalytic pocket.',
      },
    ],
    modelHypothesis: 'If thermal exposure to 80°C denatures the enzyme tertiary conformation, then the catalytic active site is irreversibly destroyed and cannot refold upon cooling to 37°C.',
    hypothesisChoices: [
      {
        id: 'hyp_1',
        text: 'If thermal exposure to 80°C denatures the enzyme tertiary conformation, then the catalytic active site is irreversibly destroyed and cannot refold upon cooling to 37°C.',
        isCorrect: true,
        explanation: 'Scientifically Validated: Formulates the structural unfolding of the active site caused by disrupting non-covalent bonding.',
      },
      {
        id: 'hyp_2',
        text: 'If an enzyme is cooled back down to 37°C, its folded protein shape always snaps back like a spring.',
        isCorrect: false,
        explanation: 'Scientific Misconception: High temperature causes irreversible denaturation and cross-linked coagulation in complex globular enzymes.',
      },
      {
        id: 'hyp_3',
        text: 'If salivary amylase is heated to 80°C, the carbon atoms disintegrate into pure nuclear radiation.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Biological thermal denaturation disrupts weak hydrogen and ionic bonds (10-50 kJ/mol); atomic nuclei remain unaffected.',
      },
    ],
    modelConclusion: "Heating salivary amylase to 80°C supplied kinetic energy exceeding the activation energy for protein denaturation, breaking the weak hydrogen bonds, ionic salt bridges, and hydrophobic interactions stabilizing the enzyme's 3D tertiary structure. The polypeptide unfolded and coagulated irreversibly, permanently destroying the catalytic active site. Cooling back to 37°C could not restore the native folding, leaving starch 100% intact (blue-black iodine test).",
    conclusionChoices: [
      {
        id: 'conc_1',
        text: "Heating salivary amylase to 80°C supplied kinetic energy exceeding the activation energy for protein denaturation, breaking the weak hydrogen bonds, ionic salt bridges, and hydrophobic interactions stabilizing the enzyme's 3D tertiary structure. The polypeptide unfolded and coagulated irreversibly, permanently destroying the catalytic active site. Cooling back to 37°C could not restore the native folding, leaving starch 100% intact (blue-black iodine test).",
        isCorrect: true,
        explanation: 'Scientifically Validated: Fully details the thermodynamic disruption of non-covalent tertiary bonds and irreversible active site destruction.',
      },
      {
        id: 'conc_2',
        text: 'Amylase became supercharged by the 80°C heat and consumed the test tube glass instead of the starch substrate.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Amylase enzymes specifically catalyze the hydrolysis of α-1,4-glucosidic bonds in starch, not borosilicate glass.',
      },
      {
        id: 'conc_3',
        text: 'Enzymes are inorganic minerals that melt into water and evaporate at 60°C.',
        isCorrect: false,
        explanation: 'Scientific Misconception: Enzymes are macromolecular proteins made of amino acid sequences synthesized by living cells.',
      },
    ],
  },
};

export const DetectiveInvestigationView: React.FC<DetectiveInvestigationViewProps> = ({
  detectiveCase,
  onBack,
  onCompleteInvestigation,
  scienceCredits = 0,
  onDeductCredits,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Solutions and guidance data
  const guidance = CASE_GUIDANCE[detectiveCase.id];
  const solutions = CASE_SUBJECTIVE_SOLUTIONS[detectiveCase.id];

  // Step 2 & 3 state (Subjective Questions with Structured Verification)
  const [selectedInquiryId, setSelectedInquiryId] = useState<string>('');
  const [studentQuestion, setStudentQuestion] = useState(detectiveCase.mysteryQuestion);
  const [selectedHypothesisId, setSelectedHypothesisId] = useState<string>('');
  const [studentHypothesis, setStudentHypothesis] = useState('');

  // Step 4 state (Design)
  const [selectedIndepVar, setSelectedIndepVar] = useState(detectiveCase.availableVariables[0]?.id || '');
  const [selectedDepVar, setSelectedDepVar] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([detectiveCase.availableEquipment[0] || '']);
  const [trialsCount, setTrialsCount] = useState(3);

  // Step 5 state (Experiment)
  const [varValues, setVarValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    detectiveCase.availableVariables.forEach((v) => {
      init[v.id] = v.defaultVal;
    });
    return init;
  });

  // Step 6 & 7 state (Data collection)
  const [measurements, setMeasurements] = useState<DataMeasurement[]>([]);

  // Step 8 state (Analysis)
  const [analysisRelationship, setAnalysisRelationship] = useState('');
  const [hypothesisConfirmed, setHypothesisConfirmed] = useState<boolean | null>(null);

  // Step 9 state (Conclusion)
  const [selectedConclusionId, setSelectedConclusionId] = useState<string>('');
  const [studentConclusion, setStudentConclusion] = useState('');

  // Hints system state
  const [hintLevel, setHintLevel] = useState(0);
  const [hintCreditError, setHintCreditError] = useState<string | null>(null);

  // Mistakes tracker
  const [mistakesList, setMistakesList] = useState<MistakeCategory[]>([]);
  const [stepErrorToast, setStepErrorToast] = useState<string | null>(null);

  // Validation status
  const isIndepVarCorrect = selectedIndepVar === detectiveCase.correctIndependentVar;
  const correctRelationship = guidance?.correctRelationship || 'Directly Proportional (Linear)';
  const isRelationshipCorrect = analysisRelationship === correctRelationship;

  const isInquiryCorrect = solutions
    ? solutions.inquiryChoices.find((c) => c.id === selectedInquiryId)?.isCorrect ?? false
    : studentQuestion.trim().length >= 8;

  const isHypothesisCorrect = solutions
    ? solutions.hypothesisChoices.find((c) => c.id === selectedHypothesisId)?.isCorrect ?? false
    : studentHypothesis.trim().length >= 15;

  const isConclusionCorrect = solutions
    ? solutions.conclusionChoices.find((c) => c.id === selectedConclusionId)?.isCorrect ?? false
    : studentConclusion.trim().length >= 15;

  const handleAutoFillVerifiedResponses = () => {
    if (!solutions) return;
    const correctInq = solutions.inquiryChoices.find((c) => c.isCorrect);
    const correctHyp = solutions.hypothesisChoices.find((c) => c.isCorrect);
    const correctConc = solutions.conclusionChoices.find((c) => c.isCorrect);

    if (correctInq) {
      setSelectedInquiryId(correctInq.id);
      setStudentQuestion(correctInq.text);
    }
    if (correctHyp) {
      setSelectedHypothesisId(correctHyp.id);
      setStudentHypothesis(correctHyp.text);
    }
    setSelectedIndepVar(detectiveCase.correctIndependentVar);
    setAnalysisRelationship(guidance?.correctRelationship || 'Directly Proportional (Linear)');
    setHypothesisConfirmed(true);
    if (correctConc) {
      setSelectedConclusionId(correctConc.id);
      setStudentConclusion(correctConc.text);
    }

    if (measurements.length < 3) {
      const v1 = calculateOutput(varValues);
      const indep = varValues[detectiveCase.correctIndependentVar] ?? 10;
      setMeasurements([
        {
          id: Math.random().toString(36).substring(2, 9),
          trial: 1,
          independentVal: indep,
          dependentVal: v1,
          controlledNotes: 'Controlled fair test parameters calibrated.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        {
          id: Math.random().toString(36).substring(2, 9),
          trial: 2,
          independentVal: Number((indep * 1.5).toFixed(1)),
          dependentVal: Number((v1 * 1.45).toFixed(2)),
          controlledNotes: 'Controlled fair test parameters calibrated.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
        {
          id: Math.random().toString(36).substring(2, 9),
          trial: 3,
          independentVal: Number((indep * 2.0).toFixed(1)),
          dependentVal: Number((v1 * 1.95).toFixed(2)),
          controlledNotes: 'Controlled fair test parameters calibrated.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        },
      ]);
    }
    setStepErrorToast(null);
    setCurrentStep(10);
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}
  };

  const getStepValidation = (step: number): { isValid: boolean; message?: string } => {
    if (step === 2) {
      if (!selectedInquiryId) {
        return { isValid: false, message: 'Mandatory: You must select the scientific inquiry question to proceed.' };
      }
      if (!isInquiryCorrect) {
        const choice = solutions?.inquiryChoices.find((c) => c.id === selectedInquiryId);
        return {
          isValid: false,
          message: choice ? choice.explanation : 'Incorrect Inquiry: The selected question contains a conceptual misconception. You must select the scientifically correct inquiry to proceed.',
        };
      }
    }
    if (step === 3) {
      if (!selectedHypothesisId) {
        return { isValid: false, message: 'Mandatory: You must select a testable scientific hypothesis to proceed.' };
      }
      if (!isHypothesisCorrect) {
        const choice = solutions?.hypothesisChoices.find((c) => c.id === selectedHypothesisId);
        return {
          isValid: false,
          message: choice ? choice.explanation : 'Incorrect Hypothesis: The chosen hypothesis contains a misconception. You must choose the testable hypothesis grounded in physical laws to proceed.',
        };
      }
    }
    if (step === 4) {
      if (!selectedIndepVar) {
        return { isValid: false, message: 'Mandatory: You must select an independent variable to test.' };
      }
      if (!isIndepVarCorrect) {
        const varInfo = guidance?.variableRationales[selectedIndepVar];
        return {
          isValid: false,
          message: varInfo ? varInfo.explanation : 'Incorrect variable: You must identify the root physical factor causing the anomaly.',
        };
      }
    }
    if (step === 5) {
      if (measurements.length < 3) {
        return {
          isValid: false,
          message: `Empirical Requirement: Collect at least 3 measurement trials (currently: ${measurements.length}/3) by varying sliders and clicking "Log Measurement to Data Table".`,
        };
      }
    }
    if (step === 8) {
      if (!analysisRelationship) {
        return { isValid: false, message: 'Mandatory: Select the observed mathematical trend (Q1) to proceed.' };
      }
      if (!isRelationshipCorrect) {
        return {
          isValid: false,
          message: `Incorrect Relationship Deduction: ${guidance?.relationshipExplanation || 'The chosen relationship does not match physical laws.'} Please select the scientifically correct relationship.`,
        };
      }
      if (hypothesisConfirmed === null) {
        return { isValid: false, message: 'Mandatory: Answer Q2 whether your empirical measurements support your Step 3 hypothesis.' };
      }
    }
    if (step === 9) {
      if (!selectedConclusionId) {
        return { isValid: false, message: 'Mandatory: You must select the scientific conclusion to proceed.' };
      }
      if (!isConclusionCorrect) {
        const choice = solutions?.conclusionChoices.find((c) => c.id === selectedConclusionId);
        return {
          isValid: false,
          message: choice ? choice.explanation : 'Incorrect Scientific Conclusion: The chosen conclusion contradicts empirical data or scientific laws. Select the verified conclusion to proceed.',
        };
      }
    }
    return { isValid: true };
  };

  const currentValidation = getStepValidation(currentStep);

  // Overall completion verification checks
  const checkStep2 = isInquiryCorrect;
  const checkStep3 = isHypothesisCorrect;
  const checkStep4 = isIndepVarCorrect;
  const checkStep5 = measurements.length >= 3;
  const checkStep8Rel = isRelationshipCorrect;
  const checkStep8Hyp = hypothesisConfirmed !== null;
  const checkStep9 = isConclusionCorrect;

  const isAllRequirementsComplete =
    checkStep2 &&
    checkStep3 &&
    checkStep4 &&
    checkStep5 &&
    checkStep8Rel &&
    checkStep8Hyp &&
    checkStep9;

  // Safe timeline step click handler
  const handleStepClick = (targetStep: number) => {
    if (targetStep <= currentStep) {
      setCurrentStep(targetStep);
      setStepErrorToast(null);
      return;
    }
    for (let s = 1; s < targetStep; s++) {
      const val = getStepValidation(s);
      if (!val.isValid) {
        setCurrentStep(s);
        setStepErrorToast(`Step ${s} is mandatory: ${val.message}`);
        return;
      }
    }
    setCurrentStep(targetStep);
    setStepErrorToast(null);
  };

  // Calculate live dependent variable output for virtual experiment
  const calculateOutput = (vals: Record<string, number>): number => {
    if (detectiveCase.id === 'case-two-spoons') {
      const k = vals.materialThermalConductivity ?? 16;
      const t_room = vals.ambientTemp ?? 20;
      const t_skin = vals.skinTemp ?? 34;
      // Heat flux = k * (t_skin - t_room) / dx
      return Number((k * (t_skin - t_room) * 0.15).toFixed(2));
    }
    if (detectiveCase.id === 'case-car-stopping') {
      const v0 = vals.initialVelocity ?? 20;
      const mu = vals.surfaceFriction ?? 0.8;
      const g = 9.8;
      // d = v0^2 / (2 * mu * g)
      return Number(((v0 * v0) / (2 * mu * g)).toFixed(2));
    }
    if (detectiveCase.id === 'case-circuit-mystery') {
      const emf = vals.supplyVoltage ?? 12;
      const r_int = vals.internalResistance ?? 9;
      const r_bulb = vals.bulbResistance ?? 6;
      const I = emf / (r_bulb + r_int);
      return Number((I * r_bulb).toFixed(2));
    }
    // Generic
    return Number((Object.values(vals)[0] * 1.5).toFixed(2));
  };

  const currentDepVal = calculateOutput(varValues);

  const handleRecordMeasurement = () => {
    const indepVal = varValues[selectedIndepVar] ?? 0;
    const newMeasurement: DataMeasurement = {
      id: Math.random().toString(36).substring(2, 9),
      trial: measurements.length + 1,
      independentVal: indepVal,
      dependentVal: currentDepVal,
      controlledNotes: `Params: ${Object.entries(varValues)
        .filter(([k]) => k !== selectedIndepVar)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ')}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setMeasurements((prev) => [...prev, newMeasurement]);
  };

  const handleShowNextHint = () => {
    if (hintLevel >= detectiveCase.progressiveHints.length) return;

    if (scienceCredits < HINT_CREDIT_COST) {
      setHintCreditError(
        `Insufficient Science Credits! Unlocking Hint #${hintLevel + 1} requires ${HINT_CREDIT_COST} ⚛️ credits. You currently have ${scienceCredits} ⚛️ credits. Earn more credits by exploring concepts, running simulations, or mastering practical labs.`
      );
      return;
    }

    if (onDeductCredits) {
      const ok = onDeductCredits(
        HINT_CREDIT_COST,
        `Unlocked Hint #${hintLevel + 1} for ${detectiveCase.title}`
      );
      if (!ok) {
        setHintCreditError(
          `Insufficient Science Credits! Unlocking Hint #${hintLevel + 1} requires ${HINT_CREDIT_COST} ⚛️ credits.`
        );
        return;
      }
    }

    setHintCreditError(null);
    setHintLevel((prev) => prev + 1);
  };

  const handleNextStep = () => {
    const val = getStepValidation(currentStep);
    if (!val.isValid) {
      setStepErrorToast(val.message || `Step ${currentStep} must be completed correctly to proceed.`);
      return;
    }
    setStepErrorToast(null);
    setCurrentStep((prev) => Math.min(10, prev + 1));
  };

  const handleFinish = () => {
    // Mandate that all steps 2 to 9 are completely filled and scientifically verified!
    for (let s = 1; s <= 9; s++) {
      const val = getStepValidation(s);
      if (!val.isValid) {
        setCurrentStep(s);
        setStepErrorToast(`Mandatory Requirement: Step ${s} is incomplete or incorrect. ${val.message}`);
        return;
      }
    }

    // Score calculation
    let score = 100;
    const detectedMistakes: MistakeCategory[] = [];

    // Deduct for excess hints
    score -= hintLevel * 8;

    score = Math.max(60, score);
    setMistakesList(detectedMistakes);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    onCompleteInvestigation({
      caseId: detectiveCase.id,
      caseTitle: detectiveCase.title,
      hypothesis: studentHypothesis.trim(),
      independentVar: selectedIndepVar,
      dependentVar: selectedDepVar || detectiveCase.correctDependentVar,
      measurementsCount: measurements.length,
      conclusion: studentConclusion.trim(),
      hintsUsed: hintLevel,
      understandingScore: score,
      mistakes: detectedMistakes,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Investigation Header */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded text-xs font-mono font-semibold">
              {detectiveCase.caseNumber}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-wider capitalize">
              {detectiveCase.subject} • {detectiveCase.difficulty} Level
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{detectiveCase.title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {solutions && (
            <button
              type="button"
              onClick={handleAutoFillVerifiedResponses}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500/30 hover:to-emerald-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition shadow-sm"
              title="Auto-fill and validate scientifically verified answers for all investigation steps and view the final resolution."
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Solve Mystery with Verified Solution</span>
            </button>
          )}
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
          >
            Exit Case
          </button>
        </div>
      </div>

      {/* 10-Step Investigation Timeline */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-3 shadow-md overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] px-2">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isCurrent = currentStep === s.id;
            const isCompleted = currentStep > s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  if (s.id <= currentStep) {
                    setCurrentStep(s.id);
                    setStepErrorToast(null);
                    return;
                  }
                  for (let stepToCheck = 1; stepToCheck < s.id; stepToCheck++) {
                    const val = getStepValidation(stepToCheck);
                    if (!val.isValid) {
                      setCurrentStep(stepToCheck);
                      setStepErrorToast(`Mandatory Step Requirement: Step ${stepToCheck} is incomplete or incorrect. ${val.message}`);
                      return;
                    }
                  }
                  setCurrentStep(s.id);
                  setStepErrorToast(null);
                }}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition ${
                  isCurrent
                    ? 'text-cyan-400 font-bold'
                    : isCompleted
                    ? 'text-emerald-400'
                    : 'text-slate-500 hover:text-slate-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition ${
                    isCurrent
                      ? 'border-cyan-400 bg-cyan-950/80 shadow-md shadow-cyan-500/20'
                      : isCompleted
                      ? 'border-emerald-500 bg-emerald-950/60'
                      : 'border-slate-800 bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[11px] whitespace-nowrap">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Investigation Stage Workspace */}
      <div className="bg-[#131E36] rounded-2xl border border-slate-800 p-6 shadow-xl min-h-[460px]">
        {/* Step 1: OBSERVE */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-cyan-400">
              <Search className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Step 1: Observe the Phenomenon</h2>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">Case Incident File</h3>
              <p className="text-slate-200 text-sm leading-relaxed">{detectiveCase.premise}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Initial Available Evidence</h4>
              <ul className="space-y-2">
                {detectiveCase.initialEvidence.map((ev, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-mono shrink-0">
                      {idx + 1}
                    </span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            <DetectiveSimCanvas
              simulationType={detectiveCase.simulationType}
              variableValues={varValues}
              activeEquipment={selectedEquipment}
            />
          </div>
        )}

        {/* Step 2: QUESTION */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <HelpCircle className="w-5 h-5" />
                <h2 className="text-lg font-bold text-white">Step 2: Formulate the Scientific Inquiry</h2>
              </div>
              {solutions && (
                <button
                  type="button"
                  onClick={() => {
                    const correct = solutions.inquiryChoices.find((c) => c.isCorrect);
                    if (correct) {
                      setSelectedInquiryId(correct.id);
                      setStudentQuestion(correct.text);
                      setStepErrorToast(null);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Solve Inquiry</span>
                </button>
              )}
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              A scientific detective must identify the exact mystery to solve. Choose the inquiry formulation that scientifically targets the underlying physical mechanism:
            </p>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-cyan-800/60">
              <div className="text-xs text-cyan-400 font-semibold uppercase mb-1">Core Mystery Inquiry</div>
              <p className="text-base text-white font-medium italic">"{detectiveCase.mysteryQuestion}"</p>
            </div>

            {/* Structured Inquiry Choices */}
            {solutions && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Select Scientific Inquiry Formulation (Mandatory):
                  </span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                    isInquiryCorrect
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : selectedInquiryId
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isInquiryCorrect ? '✓ Verified Inquiry' : selectedInquiryId ? 'Misconception' : 'Required'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {solutions.inquiryChoices.map((choice) => {
                    const isSelected = selectedInquiryId === choice.id;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => {
                          setSelectedInquiryId(choice.id);
                          setStudentQuestion(choice.text);
                          if (choice.isCorrect) {
                            setStepErrorToast(null);
                          } else {
                            setStepErrorToast(choice.explanation);
                          }
                        }}
                        className={`text-left p-3.5 rounded-xl border transition relative ${
                          isSelected
                            ? choice.isCorrect
                              ? 'border-emerald-500 bg-emerald-950/70 text-white shadow-md shadow-emerald-500/10'
                              : 'border-amber-500 bg-amber-950/70 text-white shadow-md shadow-amber-500/10'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              isSelected
                                ? choice.isCorrect
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isSelected ? (choice.isCorrect ? '✓' : '!') : '○'}
                          </span>
                          <span className="text-xs leading-relaxed">{choice.text}</span>
                        </div>

                        {isSelected && (
                          <div
                            className={`mt-2.5 pt-2.5 border-t text-[11px] leading-relaxed ${
                              choice.isCorrect
                                ? 'border-emerald-800/80 text-emerald-200'
                                : 'border-amber-800/80 text-amber-200'
                            }`}
                          >
                            <span className="font-bold block mb-0.5">
                              {choice.isCorrect ? '✓ Scientific Physical Foundation:' : '⚠️ Misconception Explanation:'}
                            </span>
                            {choice.explanation}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Optional Personal Notes Textarea */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase">
                Student Inquiry Record & Hypothesis Notes:
              </label>
              <textarea
                value={studentQuestion}
                onChange={(e) => {
                  setStudentQuestion(e.target.value);
                  if (stepErrorToast) setStepErrorToast(null);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 h-20 resize-none font-mono"
                placeholder="The selected scientific inquiry will be recorded in your lab notebook..."
              />
            </div>
          </div>
        )}

        {/* Step 3: HYPOTHESIS */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Lightbulb className="w-5 h-5" />
                <h2 className="text-lg font-bold text-white">Step 3: Propose a Testable Hypothesis</h2>
              </div>
              {solutions && (
                <button
                  type="button"
                  onClick={() => {
                    const correct = solutions.hypothesisChoices.find((c) => c.isCorrect);
                    if (correct) {
                      setSelectedHypothesisId(correct.id);
                      setStudentHypothesis(correct.text);
                      setStepErrorToast(null);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Solve Hypothesis</span>
                </button>
              )}
            </div>

            <p className="text-sm text-slate-300">
              State a testable proposition. A sound scientific hypothesis identifies the independent variable and causal mechanism:
              <span className="font-mono text-cyan-300 ml-1">"If [variable] changes, then [effect] will... because..."</span>
            </p>

            {/* Structured Hypothesis Choices */}
            {solutions && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Select Testable Hypothesis (Mandatory):
                  </span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                    isHypothesisCorrect
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : selectedHypothesisId
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isHypothesisCorrect ? '✓ Validated Hypothesis' : selectedHypothesisId ? 'Misconception' : 'Required'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {solutions.hypothesisChoices.map((choice) => {
                    const isSelected = selectedHypothesisId === choice.id;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => {
                          setSelectedHypothesisId(choice.id);
                          setStudentHypothesis(choice.text);
                          if (choice.isCorrect) {
                            setStepErrorToast(null);
                          } else {
                            setStepErrorToast(choice.explanation);
                          }
                        }}
                        className={`text-left p-3.5 rounded-xl border transition relative ${
                          isSelected
                            ? choice.isCorrect
                              ? 'border-emerald-500 bg-emerald-950/70 text-white shadow-md shadow-emerald-500/10'
                              : 'border-amber-500 bg-amber-950/70 text-white shadow-md shadow-amber-500/10'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              isSelected
                                ? choice.isCorrect
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isSelected ? (choice.isCorrect ? '✓' : '!') : '○'}
                          </span>
                          <span className="text-xs leading-relaxed">{choice.text}</span>
                        </div>

                        {isSelected && (
                          <div
                            className={`mt-2.5 pt-2.5 border-t text-[11px] leading-relaxed ${
                              choice.isCorrect
                                ? 'border-emerald-800/80 text-emerald-200'
                                : 'border-amber-800/80 text-amber-200'
                            }`}
                          >
                            <span className="font-bold block mb-0.5">
                              {choice.isCorrect ? '✓ Scientific Physical Foundation:' : '⚠️ Misconception Explanation:'}
                            </span>
                            {choice.explanation}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Optional Personal Notes Textarea */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase">
                Student Hypothesis Formulation Record:
              </label>
              <textarea
                value={studentHypothesis}
                onChange={(e) => {
                  setStudentHypothesis(e.target.value);
                  if (stepErrorToast) setStepErrorToast(null);
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 h-24 resize-none font-mono"
                placeholder="The selected testable hypothesis will be recorded in your lab notebook..."
              />
            </div>
          </div>
        )}

        {/* Step 4: DESIGN AN EXPERIMENT */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-cyan-400">
              <Sliders className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Step 4: Design the Controlled Experiment</h2>
            </div>
            <p className="text-sm text-slate-300">
              Select which variable you will deliberately change (Independent), which variable you will observe/measure (Dependent), and which instruments you require.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Independent Variable */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wide">
                    Independent Variable (You Change)
                  </label>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${isIndepVarCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                    {isIndepVarCorrect ? '✓ Correct Variable' : 'Must Be Correct'}
                  </span>
                </div>
                <select
                  value={selectedIndepVar}
                  onChange={(e) => {
                    setSelectedIndepVar(e.target.value);
                    if (stepErrorToast) setStepErrorToast(null);
                  }}
                  className={`w-full bg-slate-950 border rounded-lg p-2.5 text-sm text-white focus:outline-none ${isIndepVarCorrect ? 'border-emerald-500/60' : 'border-amber-500/60'}`}
                >
                  {detectiveCase.availableVariables.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} ({v.unit})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 block">
                  Only 1 independent variable must be altered at a time (Fair Test Rule).
                </span>
              </div>

              {/* Dependent Variable */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wide">
                  Dependent Variable (You Measure)
                </label>
                <input
                  type="text"
                  value={selectedDepVar || detectiveCase.correctDependentVar}
                  onChange={(e) => setSelectedDepVar(e.target.value)}
                  placeholder="e.g., Heat Transfer Flux / Stopping Distance"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Diagnostic Misconception Feedback for Step 4 Variable Selection */}
            {selectedIndepVar && !isIndepVarCorrect && (
              <div className="bg-amber-950/70 border border-amber-500/60 rounded-xl p-4 space-y-2 shadow-lg animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Misconception Identified in Variable Choice</span>
                </div>
                <p className="text-xs text-amber-200 leading-relaxed">
                  {guidance?.variableRationales[selectedIndepVar]?.explanation ||
                    'This variable is not the physical parameter distinguishing the anomalous condition.'}
                </p>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-amber-900/50 space-y-1">
                  <span className="text-xs font-bold text-emerald-400 block">Scientific Guidance:</span>
                  <p className="text-xs text-slate-300">
                    Carefully review the evidence. One parameter was falsely assumed to be the cause, but was actually held constant or balanced out. Select the physical parameter that directly governs the effect according to fundamental laws.
                  </p>
                </div>
                <p className="text-[11px] text-rose-300 font-bold">
                  ⚠️ Mandatory: You must select the scientifically correct independent variable before you can proceed.
                </p>
              </div>
            )}

            {selectedIndepVar && isIndepVarCorrect && (
              <div className="bg-emerald-950/60 border border-emerald-500/60 rounded-xl p-4 space-y-1.5 shadow-lg">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Scientifically Validated Root Variable</span>
                </div>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  {guidance?.variableRationales[selectedIndepVar]?.explanation}
                </p>
              </div>
            )}

            {/* Equipment Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-400 uppercase">
                Select Scientific Equipment to Deploy:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {detectiveCase.availableEquipment.map((eq) => {
                  const isChecked = selectedEquipment.includes(eq);
                  return (
                    <button
                      key={eq}
                      type="button"
                      onClick={() => {
                        if (isChecked) {
                          setSelectedEquipment(selectedEquipment.filter((x) => x !== eq));
                        } else {
                          setSelectedEquipment([...selectedEquipment, eq]);
                        }
                      }}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-xs text-left transition ${
                        isChecked
                          ? 'border-cyan-500 bg-cyan-950/60 text-cyan-200'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <CheckCircle className={`w-4 h-4 ${isChecked ? 'text-cyan-400' : 'text-slate-600'}`} />
                      <span>{eq}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: EXPERIMENT (Virtual Lab Manipulation) */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Play className="w-5 h-5" />
                <h2 className="text-lg font-bold text-white">Step 5: Run the Virtual Experiment</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>{scienceCredits} ⚛️ Credits</span>
                </span>
                <span className="text-xs bg-slate-900 px-3 py-1 rounded-full border border-slate-700 text-slate-300 font-mono">
                  {measurements.length} Trials Logged
                </span>
              </div>
            </div>

            <DetectiveSimCanvas
              simulationType={detectiveCase.simulationType}
              variableValues={varValues}
              activeEquipment={selectedEquipment}
            />

            {/* Sliders for Available Variables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {detectiveCase.availableVariables.map((v) => (
                <VariableSlider
                  key={v.id}
                  name={v.label}
                  symbol={v.symbol}
                  unit={v.unit}
                  min={v.min}
                  max={v.max}
                  step={v.step}
                  value={varValues[v.id] ?? v.defaultVal}
                  onChange={(val) => setVarValues((prev) => ({ ...prev, [v.id]: val }))}
                  accentColor={v.id === selectedIndepVar ? 'text-cyan-400 font-bold' : 'text-slate-300'}
                />
              ))}
            </div>

            <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <div className="text-xs font-mono">
                <span className="text-slate-500">Live Calculated Dependent Reading: </span>
                <span className="text-emerald-400 font-bold text-sm ml-1">{currentDepVal}</span>
              </div>
              <button
                type="button"
                onClick={handleRecordMeasurement}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition"
              >
                <PlusCircle className="w-4 h-4" />
                Log Measurement to Data Table
              </button>
            </div>
          </div>
        )}

        {/* Step 6: COLLECT DATA */}
        {currentStep === 6 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400">
                <TableIcon className="w-5 h-5" />
                <h2 className="text-lg font-bold text-white">Step 6: Empirical Data Table</h2>
              </div>
              <button
                onClick={() => setMeasurements([])}
                className="flex items-center gap-1 text-xs text-rose-400 hover:underline"
              >
                <RefreshCw className="w-3 h-3" /> Clear Data
              </button>
            </div>

            {measurements.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-dashed border-slate-800 text-slate-400">
                No measurements logged yet. Return to Step 5 (Experiment) and click "Log Measurement" across varied values.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-sm font-mono">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Trial #</th>
                      <th className="p-3">Independent ({selectedIndepVar})</th>
                      <th className="p-3">Observed Dependent</th>
                      <th className="p-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950">
                    {measurements.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-900/50">
                        <td className="p-3 text-slate-400">{m.trial}</td>
                        <td className="p-3 text-cyan-300 font-bold">{m.independentVal}</td>
                        <td className="p-3 text-emerald-400 font-bold">{m.dependentVal}</td>
                        <td className="p-3 text-slate-500 text-xs">{m.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Step 7: VISUALISE DATA */}
        {currentStep === 7 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-cyan-400">
              <LineChart className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Step 7: Visualise Data Trends & Curves</h2>
            </div>
            <p className="text-sm text-slate-300">
              Examining empirical data points plotted against theoretical models reveals relationships (linear, quadratic, exponential, or plateau).
            </p>

            <GraphViewer
              title="Empirical Trials Plot"
              xLabel={selectedIndepVar}
              yLabel="Dependent Output"
              xUnit=""
              yUnit=""
              xDomain={[0, Math.max(10, ...measurements.map((m) => m.independentVal * 1.2))]}
              yDomain={[0, Math.max(10, ...measurements.map((m) => m.dependentVal * 1.2))]}
              dataPoints={measurements.map((m) => ({ x: m.independentVal, y: m.dependentVal }))}
              height={220}
              pointsColor="#10b981"
            />
          </div>
        )}

        {/* Step 8: ANALYZE */}
        {currentStep === 8 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-cyan-400">
              <BrainCircuit className="w-5 h-5" />
              <h2 className="text-lg font-bold text-white">Step 8: Scientific Data Analysis</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-400 uppercase">
                    Q1: What relationship do you observe?
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${isRelationshipCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                    {isRelationshipCorrect ? '✓ Correct Relationship' : 'Must Be Correct'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {['Directly Proportional (Linear)', 'Inversely Proportional', 'Quadratic / Independent'].map((rel) => (
                    <button
                      key={rel}
                      onClick={() => {
                        setAnalysisRelationship(rel);
                        if (stepErrorToast) setStepErrorToast(null);
                      }}
                      className={`p-3 rounded-lg border text-xs text-left transition ${
                        analysisRelationship === rel
                          ? isRelationshipCorrect
                            ? 'border-emerald-400 bg-emerald-950/80 text-white font-bold'
                            : 'border-amber-400 bg-amber-950/80 text-white font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {rel}
                    </button>
                  ))}
                </div>

                {/* Inline misconception feedback for Q1 */}
                {analysisRelationship && !isRelationshipCorrect && (
                  <div className="bg-amber-950/70 border border-amber-500/60 rounded-xl p-3.5 space-y-2 mt-2 animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Misconception in Relationship Deduction</span>
                    </div>
                    <p className="text-xs text-amber-200 leading-relaxed">
                      You chose <span className="font-bold text-white">"{analysisRelationship}"</span>, which does not match the empirical measurements or theoretical law.
                    </p>
                    <div className="bg-slate-950/80 p-2.5 rounded-lg border border-amber-900/50">
                      <span className="text-[11px] font-bold text-emerald-400 block mb-0.5">Scientific Physical Model:</span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {guidance?.relationshipExplanation || 'Review the slope and data points in your Step 7 graph to observe the true mathematical behavior.'}
                      </p>
                    </div>
                    <p className="text-[11px] text-rose-300 font-bold">
                      ⚠️ Mandatory: You must select the scientifically correct relationship to advance.
                    </p>
                  </div>
                )}

                {analysisRelationship && isRelationshipCorrect && (
                  <div className="bg-emerald-950/60 border border-emerald-500/60 rounded-xl p-3 text-xs text-emerald-200 flex items-start gap-2 mt-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-300">Scientifically Validated Deduction: </span>
                      <span>{guidance?.relationshipExplanation}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400 uppercase">
                    Q2: Does your empirical data support your Step 3 hypothesis?
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${hypothesisConfirmed !== null ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                    {hypothesisConfirmed !== null ? '✓ Answered' : 'Mandatory Selection'}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setHypothesisConfirmed(true);
                      if (stepErrorToast) setStepErrorToast(null);
                    }}
                    className={`px-4 py-2 rounded-lg border text-xs font-semibold transition ${
                      hypothesisConfirmed === true ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400' : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Yes, Fully Supported
                  </button>
                  <button
                    onClick={() => {
                      setHypothesisConfirmed(false);
                      if (stepErrorToast) setStepErrorToast(null);
                    }}
                    className={`px-4 py-2 rounded-lg border text-xs font-semibold transition ${
                      hypothesisConfirmed === false ? 'bg-rose-500 text-white font-bold border-rose-400' : 'border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    No, Refuted / Inconclusive
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 9: CONCLUSION */}
        {currentStep === 9 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <FileCheck className="w-5 h-5" />
                <h2 className="text-lg font-bold text-white">Step 9: Draw Scientific Conclusion</h2>
              </div>
              {solutions && (
                <button
                  type="button"
                  onClick={() => {
                    const correct = solutions.conclusionChoices.find((c) => c.isCorrect);
                    if (correct) {
                      setSelectedConclusionId(correct.id);
                      setStudentConclusion(correct.text);
                      setStepErrorToast(null);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-Solve Conclusion</span>
                </button>
              )}
            </div>

            <p className="text-sm text-slate-300">
              Synthesize your claim, empirical evidence, and reasoning into a concise scientific statement. Choose the conclusion formulation that correctly addresses the physical laws:
            </p>

            {/* Model Verified Conclusion Helper */}
            {solutions && (
              <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-cyan-950/60 p-4 rounded-xl border border-emerald-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Scientifically Verified Model Conclusion:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const correct = solutions.conclusionChoices.find((c) => c.isCorrect);
                      if (correct) {
                        setSelectedConclusionId(correct.id);
                        setStudentConclusion(correct.text);
                        setStepErrorToast(null);
                      } else {
                        setStudentConclusion(solutions.modelConclusion);
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition flex items-center gap-1 shadow-sm"
                  >
                    <span>Insert Model Conclusion</span>
                  </button>
                </div>
                <p className="text-xs text-slate-200 italic leading-relaxed">
                  "{solutions.modelConclusion}"
                </p>
              </div>
            )}

            {/* Structured Conclusion Choices */}
            {solutions && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Select Scientific Conclusion (Mandatory):
                  </span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                    isConclusionCorrect
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : selectedConclusionId
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isConclusionCorrect ? '✓ Validated Conclusion' : selectedConclusionId ? 'Misconception' : 'Required'}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {solutions.conclusionChoices.map((choice) => {
                    const isSelected = selectedConclusionId === choice.id;
                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => {
                          setSelectedConclusionId(choice.id);
                          setStudentConclusion(choice.text);
                          if (choice.isCorrect) {
                            setStepErrorToast(null);
                          } else {
                            setStepErrorToast(choice.explanation);
                          }
                        }}
                        className={`text-left p-3.5 rounded-xl border transition relative ${
                          isSelected
                            ? choice.isCorrect
                              ? 'border-emerald-500 bg-emerald-950/70 text-white shadow-md shadow-emerald-500/10'
                              : 'border-amber-500 bg-amber-950/70 text-white shadow-md shadow-amber-500/10'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              isSelected
                                ? choice.isCorrect
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-amber-500 text-slate-950'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {isSelected ? (choice.isCorrect ? '✓' : '!') : '○'}
                          </span>
                          <span className="text-xs leading-relaxed">{choice.text}</span>
                        </div>

                        {isSelected && (
                          <div
                            className={`mt-2.5 pt-2.5 border-t text-[11px] leading-relaxed ${
                              choice.isCorrect
                                ? 'border-emerald-800/80 text-emerald-200'
                                : 'border-amber-800/80 text-amber-200'
                            }`}
                          >
                            <span className="font-bold block mb-0.5">
                              {choice.isCorrect ? '✓ Scientific Physical Synthesis:' : '⚠️ Misconception Explanation:'}
                            </span>
                            {choice.explanation}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase">
                  Your Scientific Conclusion Notebook Record:
                </label>
                <span className={`text-[11px] font-mono ${isConclusionCorrect ? 'text-emerald-400 font-bold' : 'text-amber-400'}`}>
                  {isConclusionCorrect ? '✓ Verified by Scientific Laws' : 'Must match verified physical resolution'}
                </span>
              </div>
              <textarea
                value={studentConclusion}
                onChange={(e) => {
                  setStudentConclusion(e.target.value);
                  if (stepErrorToast) setStepErrorToast(null);
                }}
                placeholder="Based on the experimental evidence gathered, the root variable resolves the anomaly because..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 h-28 resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 10: SCIENTIFIC EXPLANATION */}
        {currentStep === 10 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400">
                <Award className="w-5 h-5" />
                <h2 className="text-lg font-bold text-white">Step 10: Scientific Explanation & Resolution</h2>
              </div>
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-full font-bold">
                Case Solved
              </span>
            </div>

            {/* Formula resolution with KaTeX */}
            <div className="bg-slate-900/90 p-4 rounded-xl border border-cyan-800/80">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">
                Governing Fundamental Law & Formula
              </span>
              <Formula tex={detectiveCase.scientificFormula} className="text-center py-2" />
            </div>

            <div className="space-y-3">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">
                  1. The True Phenomenon Explained
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {detectiveCase.scientificExplanation.summary}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
                  2. Microscopic Mechanism (Why It Happens)
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {detectiveCase.scientificExplanation.whyItHappens}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
                  3. Common Student Misconception
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {detectiveCase.scientificExplanation.commonMisconceptions}
                </p>
              </div>
            </div>

            {/* Complete Case Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition"
              >
                Log Investigation to My Progress
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progressive Socratic Hint Drawer */}
      {/* Progressive Socratic Hints Section (Unlocked with Science Credits) */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-4 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Progressive Socratic Hints ({hintLevel} of {detectiveCase.progressiveHints.length} Unlocked)
            </h4>
            <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              {HINT_CREDIT_COST} ⚛️ Credits / Hint
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono text-slate-400">
              Balance: <span className="text-amber-300 font-bold">{scienceCredits} ⚛️</span>
            </span>

            {hintLevel < detectiveCase.progressiveHints.length && (
              <button
                type="button"
                onClick={handleShowNextHint}
                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm ${
                  scienceCredits >= HINT_CREDIT_COST
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-amber-500/20'
                    : 'bg-slate-800 text-amber-400/80 hover:bg-slate-700 border border-amber-500/30'
                }`}
                title={`Unlock progressive Socratic hint #${hintLevel + 1} using ${HINT_CREDIT_COST} Science Credits`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Unlock Hint #{hintLevel + 1} ({HINT_CREDIT_COST} ⚛️)
                </span>
              </button>
            )}
          </div>
        </div>

        {hintCreditError && (
          <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-amber-300 block mb-0.5">Need More Science Credits</span>
              <p className="leading-relaxed">{hintCreditError}</p>
            </div>
            <button
              type="button"
              onClick={() => setHintCreditError(null)}
              className="text-amber-400 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {hintLevel === 0 ? (
          <p className="text-xs text-slate-400 italic">
            Need guidance? Spend <strong>{HINT_CREDIT_COST} Science Credits</strong> to unlock progressive Socratic hints grounded in governing physical laws.
          </p>
        ) : (
          <div className="space-y-2">
            {detectiveCase.progressiveHints.slice(0, hintLevel).map((h, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-slate-900/90 p-3 rounded-xl border border-amber-900/40 text-xs text-amber-200">
                <span className="font-bold text-amber-400 shrink-0 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-mono">
                  Hint {idx + 1}
                </span>
                <span className="leading-relaxed">{h}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Error alert toast before step navigation if validation fails */}
      {stepErrorToast && (
        <div className="p-4 rounded-xl bg-rose-950/90 border border-rose-500/80 text-rose-200 text-xs flex items-start gap-3 shadow-lg animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-rose-300 block">Requirement Not Met</span>
            <p className="leading-relaxed">{stepErrorToast}</p>
          </div>
        </div>
      )}

      {/* Step Navigation Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => {
            setCurrentStep((prev) => Math.max(1, prev - 1));
            setStepErrorToast(null);
          }}
          disabled={currentStep === 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-medium text-slate-300 transition"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Step
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Step {currentStep} of 10
        </span>

        {currentStep < 10 ? (
          <button
            onClick={handleNextStep}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-slate-950 shadow-md transition"
          >
            Next Step <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 shadow-md transition"
          >
            Complete Investigation
          </button>
        )}
      </div>
    </div>
  );
};
