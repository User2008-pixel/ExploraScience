export type GradeLevel =
  | 'Class 9'
  | 'Class 10'
  | 'Class 11'
  | 'Class 12';

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar: string; // Emoji avatar icon
  grade: GradeLevel;
  roleTitle: string; // e.g. "Junior Lab Researcher", "Quantum Detective", "Chief Scientist"
  isGuest: boolean;
  joinedDate: string;
  customNotes?: string;
}

export const AVATAR_OPTIONS = [
  { emoji: '🧪', label: 'Chemist', role: 'Analytical Chemist' },
  { emoji: '⚛️', label: 'Physicist', role: 'Theoretical Physicist' },
  { emoji: '🧬', label: 'Biologist', role: 'Molecular Biologist' },
  { emoji: '🚀', label: 'Astronaut', role: 'Astrophysicist' },
  { emoji: '🔭', label: 'Astronomer', role: 'Cosmology Explorer' },
  { emoji: '🤖', label: 'Roboticist', role: 'Robotics Engineer' },
  { emoji: '⚡', label: 'Electrician', role: 'Circuit & Power Specialist' },
  { emoji: '🧠', label: 'Neuroscientist', role: 'Cognitive Researcher' },
  { emoji: '🔍', label: 'Detective', role: 'Science Detective' },
];

export const GRADE_OPTIONS: GradeLevel[] = [
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];
