import { GradeLevel } from './auth';

export type Subject = 'physics' | 'chemistry' | 'biology';

export type DifficultyLevel = 'explorer' | 'investigator' | 'scientist';

export interface ConceptVariable {
  id: string;
  name: string;
  symbol: string; // KaTeX math symbol, e.g. "v_0", "\\theta", "g", "R", "T"
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  description: string;
}

export interface PredictionChoice {
  id: string;
  text: string;
  formulaReasoning?: string;
  isCorrect: boolean;
  misconceptionExplanation: string;
}

export interface PredictionQuestion {
  prompt: string;
  scenario: string;
  choices: PredictionChoice[];
  correctExplanation: string;
  relevantFormula: string; // KaTeX format
}

export interface ConceptItem {
  id: string;
  title: string;
  subject: Subject;
  gradeLevel: 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';
  tagline: string;
  description: string;
  formulaLaTeX: string; // Main formula in LaTeX
  formulaExplanation: string;
  variables: ConceptVariable[];
  prediction: PredictionQuestion;
  relatedConcepts: { id: string; name: string; subject: Subject }[];
  realWorldApplications: {
    title: string;
    description: string;
    icon?: string;
  }[];
  simulationType: string;
}

export type MistakeCategory =
  | 'conceptual_misunderstanding'
  | 'incorrect_prediction'
  | 'incorrect_variable_identification'
  | 'experimental_design_error'
  | 'graph_interpretation_error'
  | 'mathematical_error'
  | 'reasoning_error'
  | 'careless_error';

export interface MistakeRecord {
  id: string;
  date: string;
  caseOrConceptId: string;
  caseOrConceptTitle: string;
  category: MistakeCategory;
  description: string;
  correctiveInsight: string;
  isResolved?: boolean;
  resolvedDate?: string;
}

export interface DataMeasurement {
  id: string;
  trial: number;
  independentVal: number;
  dependentVal: number;
  controlledNotes?: string;
  timestamp: string;
}

export interface DetectiveCase {
  id: string;
  title: string;
  subject: Subject;
  difficulty: DifficultyLevel;
  gradeLevel?: GradeLevel;
  gradeLevels?: GradeLevel[];
  caseNumber: string;
  premise: string;
  mysteryQuestion: string;
  initialEvidence: string[];
  simulationType: string;
  availableVariables: {
    id: string;
    label: string;
    symbol: string;
    unit: string;
    min: number;
    max: number;
    step: number;
    defaultVal: number;
  }[];
  availableEquipment: string[];
  correctIndependentVar: string;
  correctDependentVar: string;
  scientificFormula: string;
  progressiveHints: string[];
  scientificExplanation: {
    summary: string;
    whyItHappens: string;
    commonMisconceptions: string;
    formalLaw: string;
  };
}

export interface CompletedInvestigation {
  id: string;
  caseId: string;
  caseTitle: string;
  date: string;
  hypothesis: string;
  independentVar: string;
  dependentVar: string;
  measurementsCount: number;
  conclusion: string;
  hintsUsed: number;
  understandingScore: number; // 0 - 100
  mistakes: MistakeCategory[];
}

export interface StudentProgress {
  exploredConceptIds: string[];
  masteredConceptIds: string[];
  completedInvestigations: CompletedInvestigation[];
  mistakesHistory: MistakeRecord[];
  streakDays: number;
  lastActiveDate: string;
  difficulty: DifficultyLevel;
  unlockedBadgeIds?: string[];
  scienceCredits: number;
  unlockedEquipmentIds?: string[];
  equippedEquipmentIds?: string[];
}

export type BadgeCategory = 'exploration' | 'investigation' | 'accuracy' | 'mastery' | 'streak';
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: BadgeCategory;
  tier: BadgeTier;
  iconName: string;
  xpPoints: number;
  conditionDescription: string;
  maxProgress: number;
  currentProgress: (progress: StudentProgress) => number;
  isUnlocked: (progress: StudentProgress) => boolean;
}
