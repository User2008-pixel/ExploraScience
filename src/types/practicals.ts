export type PracticalSubject = 'physics' | 'chemistry' | 'biology';
export type PracticalGrade = 'Class 11' | 'Class 12';

export interface PracticalObservationRow {
  id: string;
  trial: number;
  readings: Record<string, number | string>;
  calculatedResult: number;
}

export interface PracticalVivaQuestion {
  question: string;
  answer: string;
  scientificConcept: string;
}

export interface PracticalExperiment {
  id: string;
  title: string;
  subject: PracticalSubject;
  gradeLevel: PracticalGrade;
  curriculum: string; // e.g. 'CBSE / ISC / State Board / AP / IB'
  tagline: string;
  aim: string;
  apparatusRequired: string[];
  governingFormulaLaTeX: string;
  formulaDescription: string;
  leastCountOrConstantInfo?: string;
  procedureSteps: string[];
  precautions: string[];
  sourcesOfError: string[];
  vivaQuestions: PracticalVivaQuestion[];
  simulationType:
    | 'vernier-caliper'
    | 'screw-gauge'
    | 'simple-pendulum'
    | 'meter-bridge'
    | 'convex-lens'
    | 'prism-deviation'
    | 'potentiometer'
    | 'sonometer'
    | 'resonance-tube'
    | 'pn-junction'
    | 'titration-kmno4'
    | 'titration-mohr'
    | 'reaction-kinetics-thiosulfate'
    | 'salt-analysis'
    | 'food-tests'
    | 'mitosis-root-tip'
    | 'paper-chromatography';
}
