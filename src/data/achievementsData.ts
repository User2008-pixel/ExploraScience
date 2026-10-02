import { AchievementBadge, StudentProgress, BadgeTier, BadgeCategory } from '../types/science';

export interface StudentRank {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  description: string;
  badgeIcon: string;
}

export const STUDENT_RANKS: StudentRank[] = [
  {
    level: 1,
    title: 'Lab Apprentice',
    minXP: 0,
    maxXP: 250,
    description: 'Beginning empirical inquiry and foundational experimental observation.',
    badgeIcon: 'Compass',
  },
  {
    level: 2,
    title: 'Junior Investigator',
    minXP: 250,
    maxXP: 600,
    description: 'Demonstrating skill in isolating single independent variables and recording data.',
    badgeIcon: 'Search',
  },
  {
    level: 3,
    title: 'Research Analyst',
    minXP: 600,
    maxXP: 1200,
    description: 'Proficient in theoretical prediction, KaTeX mathematical reasoning, and error diagnosis.',
    badgeIcon: 'Brain',
  },
  {
    level: 4,
    title: 'Lead Scientific Detective',
    minXP: 1200,
    maxXP: 2000,
    description: 'Solves complex forensic cases with minimal hints and flawless empirical rigor.',
    badgeIcon: 'ShieldAlert',
  },
  {
    level: 5,
    title: 'Nobel Laureate Scholar',
    minXP: 2000,
    maxXP: 5000,
    description: 'Master of physical, chemical, and biological laws with verified empirical intuition.',
    badgeIcon: 'Award',
  },
];

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  // --- EXPLORATION BADGES ---
  {
    id: 'first-discovery',
    title: 'First Discovery',
    description: 'Took your first step inside the interactive digital laboratory.',
    category: 'exploration',
    tier: 'bronze',
    iconName: 'Compass',
    xpPoints: 50,
    conditionDescription: 'Explore 1 scientific concept visualizer.',
    maxProgress: 1,
    currentProgress: (p: StudentProgress) => Math.min(1, p.exploredConceptIds.length),
    isUnlocked: (p: StudentProgress) => p.exploredConceptIds.length >= 1,
  },
  {
    id: 'curious-polymath',
    title: 'Curious Polymath',
    description: 'Explored concepts across Physics, Chemistry, and Biology.',
    category: 'exploration',
    tier: 'silver',
    iconName: 'Sparkles',
    xpPoints: 150,
    conditionDescription: 'Explore at least 3 distinct concepts.',
    maxProgress: 3,
    currentProgress: (p: StudentProgress) => Math.min(3, p.exploredConceptIds.length),
    isUnlocked: (p: StudentProgress) => p.exploredConceptIds.length >= 3,
  },
  {
    id: 'physics-pioneer',
    title: 'Newtonian Disciple',
    description: 'Delved deeply into mechanics, electromagnetism, and classical physics.',
    category: 'exploration',
    tier: 'silver',
    iconName: 'Zap',
    xpPoints: 150,
    conditionDescription: 'Explore at least 3 Physics concepts.',
    maxProgress: 3,
    currentProgress: (p: StudentProgress) => {
      const physicsIds = ['projectile-motion', 'newtons-laws', 'current-electricity', 'gravitation', 'ray-optics', 'simple-harmonic-motion', 'wave-optics', 'work-energy-power', 'electrostatics', 'thermodynamics-carnot', 'magnetism-lorentz'];
      return p.exploredConceptIds.filter((id) => physicsIds.includes(id)).length;
    },
    isUnlocked: (p: StudentProgress) => {
      const physicsIds = ['projectile-motion', 'newtons-laws', 'current-electricity', 'gravitation', 'ray-optics', 'simple-harmonic-motion', 'wave-optics', 'work-energy-power', 'electrostatics', 'thermodynamics-carnot', 'magnetism-lorentz'];
      return p.exploredConceptIds.filter((id) => physicsIds.includes(id)).length >= 3;
    },
  },
  {
    id: 'chem-architect',
    title: 'Molecular Architect',
    description: 'Investigated chemical bonding, reaction kinetics, and equilibria.',
    category: 'exploration',
    tier: 'silver',
    iconName: 'Beaker',
    xpPoints: 150,
    conditionDescription: 'Explore at least 3 Chemistry concepts.',
    maxProgress: 3,
    currentProgress: (p: StudentProgress) => {
      const chemIds = ['chemical-kinetics', 'electrochemical-cell', 'molecular-geometry', 'states-of-matter', 'chemical-equilibrium', 'atomic-structure', 'chemical-bonding', 'solutions-raoult', 'organic-mechanisms'];
      return p.exploredConceptIds.filter((id) => chemIds.includes(id)).length;
    },
    isUnlocked: (p: StudentProgress) => {
      const chemIds = ['chemical-kinetics', 'electrochemical-cell', 'molecular-geometry', 'states-of-matter', 'chemical-equilibrium', 'atomic-structure', 'chemical-bonding', 'solutions-raoult', 'organic-mechanisms'];
      return p.exploredConceptIds.filter((id) => chemIds.includes(id)).length >= 3;
    },
  },
  {
    id: 'bio-explorer',
    title: 'Life Systems Cartographer',
    description: 'Mapped genetic replication, cellular transport, and biological pathways.',
    category: 'exploration',
    tier: 'silver',
    iconName: 'Dna',
    xpPoints: 150,
    conditionDescription: 'Explore at least 3 Biology concepts.',
    maxProgress: 3,
    currentProgress: (p: StudentProgress) => {
      const bioIds = ['photosynthesis', 'dna-replication', 'enzyme-activity', 'human-circulation', 'genetics', 'cell-osmosis', 'cellular-respiration', 'nervous-system', 'ecology-trophic'];
      return p.exploredConceptIds.filter((id) => bioIds.includes(id)).length;
    },
    isUnlocked: (p: StudentProgress) => {
      const bioIds = ['photosynthesis', 'dna-replication', 'enzyme-activity', 'human-circulation', 'genetics', 'cell-osmosis', 'cellular-respiration', 'nervous-system', 'ecology-trophic'];
      return p.exploredConceptIds.filter((id) => bioIds.includes(id)).length >= 3;
    },
  },
  {
    id: 'grand-unification',
    title: 'Grand Unification',
    description: 'Extensive exploration across the natural sciences curriculum.',
    category: 'exploration',
    tier: 'gold',
    iconName: 'Globe',
    xpPoints: 350,
    conditionDescription: 'Explore at least 8 distinct scientific concepts.',
    maxProgress: 8,
    currentProgress: (p: StudentProgress) => Math.min(8, p.exploredConceptIds.length),
    isUnlocked: (p: StudentProgress) => p.exploredConceptIds.length >= 8,
  },
  {
    id: 'master-of-matter',
    title: 'Omniscient Scholar',
    description: 'Explored nearly the entire repository of interactive simulations.',
    category: 'exploration',
    tier: 'platinum',
    iconName: 'Trophy',
    xpPoints: 600,
    conditionDescription: 'Explore at least 15 concepts in the library.',
    maxProgress: 15,
    currentProgress: (p: StudentProgress) => Math.min(15, p.exploredConceptIds.length),
    isUnlocked: (p: StudentProgress) => p.exploredConceptIds.length >= 15,
  },

  // --- INVESTIGATION BADGES ---
  {
    id: 'first-case-solved',
    title: 'Forensic Debut',
    description: 'Successfully cracked your first Science Detective forensic case.',
    category: 'investigation',
    tier: 'bronze',
    iconName: 'ShieldAlert',
    xpPoints: 100,
    conditionDescription: 'Complete 1 Science Detective investigation.',
    maxProgress: 1,
    currentProgress: (p: StudentProgress) => Math.min(1, p.completedInvestigations.length),
    isUnlocked: (p: StudentProgress) => p.completedInvestigations.length >= 1,
  },
  {
    id: 'sharp-reasoner',
    title: 'Deductive Vanguard',
    description: 'Systematically solved multiple complex scientific mysteries.',
    category: 'investigation',
    tier: 'silver',
    iconName: 'Brain',
    xpPoints: 250,
    conditionDescription: 'Complete at least 3 Science Detective cases.',
    maxProgress: 3,
    currentProgress: (p: StudentProgress) => Math.min(3, p.completedInvestigations.length),
    isUnlocked: (p: StudentProgress) => p.completedInvestigations.length >= 3,
  },
  {
    id: 'autonomous-mind',
    title: 'Autonomous Investigator',
    description: 'Solved a forensic case completely unassisted without requesting hints.',
    category: 'investigation',
    tier: 'gold',
    iconName: 'Award',
    xpPoints: 300,
    conditionDescription: 'Complete any case using exactly 0 hints.',
    maxProgress: 1,
    currentProgress: (p: StudentProgress) => {
      const unassisted = p.completedInvestigations.filter((c) => c.hintsUsed === 0);
      return unassisted.length > 0 ? 1 : 0;
    },
    isUnlocked: (p: StudentProgress) => {
      return p.completedInvestigations.some((c) => c.hintsUsed === 0);
    },
  },
  {
    id: 'data-artisan',
    title: 'Empirical Purist',
    description: 'Maintained thorough data hygiene by recording multiple empirical trials.',
    category: 'investigation',
    tier: 'bronze',
    iconName: 'Activity',
    xpPoints: 75,
    conditionDescription: 'Record at least 4 trials in a single investigation.',
    maxProgress: 1,
    currentProgress: (p: StudentProgress) => {
      const rigorous = p.completedInvestigations.filter((c) => c.measurementsCount >= 4);
      return rigorous.length > 0 ? 1 : 0;
    },
    isUnlocked: (p: StudentProgress) => {
      return p.completedInvestigations.some((c) => c.measurementsCount >= 4);
    },
  },

  // --- SCIENTIFIC ACCURACY BADGES ---
  {
    id: 'hypothesis-perfection',
    title: 'Hypothesis Architect',
    description: 'Achieved an outstanding score on your empirical deduction rubric.',
    category: 'accuracy',
    tier: 'silver',
    iconName: 'CheckCircle2',
    xpPoints: 200,
    conditionDescription: 'Achieve 90%+ understanding score on any case.',
    maxProgress: 1,
    currentProgress: (p: StudentProgress) => {
      const highScores = p.completedInvestigations.filter((c) => c.understandingScore >= 90);
      return highScores.length > 0 ? 1 : 0;
    },
    isUnlocked: (p: StudentProgress) => {
      return p.completedInvestigations.some((c) => c.understandingScore >= 90);
    },
  },
  {
    id: 'pristine-rubric',
    title: 'Flawless Methodology',
    description: 'Executed an investigation without triggering any misconception flags.',
    category: 'accuracy',
    tier: 'gold',
    iconName: 'Target',
    xpPoints: 350,
    conditionDescription: 'Complete an investigation with 0 recorded mistakes.',
    maxProgress: 1,
    currentProgress: (p: StudentProgress) => {
      const clean = p.completedInvestigations.filter((c) => c.mistakes.length === 0);
      return clean.length > 0 ? 1 : 0;
    },
    isUnlocked: (p: StudentProgress) => {
      return p.completedInvestigations.some((c) => c.mistakes.length === 0);
    },
  },
  {
    id: 'rigorous-mind',
    title: 'Empirical Gold Standard',
    description: 'Maintained an average understanding score of 85%+ across solved cases.',
    category: 'accuracy',
    tier: 'platinum',
    iconName: 'Flame',
    xpPoints: 500,
    conditionDescription: 'Solve at least 2 cases with average score >= 85%.',
    maxProgress: 2,
    currentProgress: (p: StudentProgress) => {
      if (p.completedInvestigations.length < 2) return p.completedInvestigations.length;
      const avg = p.completedInvestigations.reduce((a, b) => a + b.understandingScore, 0) / p.completedInvestigations.length;
      return avg >= 85 ? 2 : 1;
    },
    isUnlocked: (p: StudentProgress) => {
      if (p.completedInvestigations.length < 2) return false;
      const avg = p.completedInvestigations.reduce((a, b) => a + b.understandingScore, 0) / p.completedInvestigations.length;
      return avg >= 85;
    },
  },

  // --- MASTERY & DISCIPLINE BADGES ---
  {
    id: 'streak-ignited',
    title: 'Laboratory Momentum',
    description: 'Maintained consecutive days of active scientific experimentation.',
    category: 'streak',
    tier: 'bronze',
    iconName: 'Zap',
    xpPoints: 100,
    conditionDescription: 'Maintain a 2-day investigation streak.',
    maxProgress: 2,
    currentProgress: (p: StudentProgress) => Math.min(2, p.streakDays),
    isUnlocked: (p: StudentProgress) => p.streakDays >= 2,
  },
  {
    id: 'streak-master',
    title: 'Relentless Inquiry',
    description: 'Sustained inquiry habit demonstrating unwavering dedication to science.',
    category: 'streak',
    tier: 'silver',
    iconName: 'Flame',
    xpPoints: 250,
    conditionDescription: 'Maintain a 5-day investigation streak.',
    maxProgress: 5,
    currentProgress: (p: StudentProgress) => Math.min(5, p.streakDays),
    isUnlocked: (p: StudentProgress) => p.streakDays >= 5,
  },
  {
    id: 'mistake-converter',
    title: 'Insight Alchemist',
    description: 'Transmuted conceptual missteps into solid empirical understanding.',
    category: 'mastery',
    tier: 'bronze',
    iconName: 'Lightbulb',
    xpPoints: 100,
    conditionDescription: 'Log or review at least 2 mistake records.',
    maxProgress: 2,
    currentProgress: (p: StudentProgress) => Math.min(2, p.mistakesHistory.length),
    isUnlocked: (p: StudentProgress) => p.mistakesHistory.length >= 2,
  },
  {
    id: 'scientist-rigor',
    title: 'Hardened Scientist',
    description: 'Conducted experiments under Scientist difficulty mode with tight tolerances.',
    category: 'mastery',
    tier: 'gold',
    iconName: 'Shield',
    xpPoints: 400,
    conditionDescription: 'Engage with the lab in Scientist difficulty mode.',
    maxProgress: 1,
    currentProgress: (p: StudentProgress) => (p.difficulty === 'scientist' ? 1 : 0),
    isUnlocked: (p: StudentProgress) => p.difficulty === 'scientist',
  },
];

// Helper calculations
export function calculateStudentXP(progress: StudentProgress): number {
  let xp = 0;
  // XP from completed investigations
  progress.completedInvestigations.forEach((inv) => {
    xp += Math.round(inv.understandingScore * 1.5);
    if (inv.hintsUsed === 0) xp += 50; // autonomy bonus
    if (inv.measurementsCount >= 4) xp += 25; // empirical diligence bonus
  });

  // XP from concept exploration
  xp += progress.exploredConceptIds.length * 40;

  // XP from mastered concepts
  xp += progress.masteredConceptIds.length * 80;

  // XP from streak
  xp += progress.streakDays * 20;

  // XP from unlocked badges
  ACHIEVEMENT_BADGES.forEach((badge) => {
    if (badge.isUnlocked(progress)) {
      xp += badge.xpPoints;
    }
  });

  return xp;
}

export function calculateStudentRank(totalXP: number): {
  currentRank: StudentRank;
  nextRank: StudentRank | null;
  progressPercent: number;
} {
  let currentRank = STUDENT_RANKS[0];
  let nextRank: StudentRank | null = STUDENT_RANKS[1];

  for (let i = 0; i < STUDENT_RANKS.length; i++) {
    const r = STUDENT_RANKS[i];
    if (totalXP >= r.minXP) {
      currentRank = r;
      nextRank = STUDENT_RANKS[i + 1] || null;
    }
  }

  if (!nextRank) {
    return { currentRank, nextRank: null, progressPercent: 100 };
  }

  const range = nextRank.minXP - currentRank.minXP;
  const earned = totalXP - currentRank.minXP;
  const progressPercent = Math.min(100, Math.max(0, Math.round((earned / range) * 100)));

  return { currentRank, nextRank, progressPercent };
}
