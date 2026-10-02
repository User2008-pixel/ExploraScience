export type EquipmentCategory =
  | 'sensors'
  | 'optics'
  | 'measurement'
  | 'computational'
  | 'specialized'
  | 'perks'
  | 'academics'
  | 'credentials';

export interface LabEquipmentItem {
  id: string;
  name: string;
  category: EquipmentCategory;
  cost: number;
  iconName: string; // Lucide icon key
  tagline: string;
  description: string;
  perkDescription: string;
  compatibleSims: string[]; // simulationTypes e.g. ['thermal-conduction', 'projectile-motion', 'all']
  tier: 'Standard' | 'Advanced' | 'Master' | 'Prototype';
  unlockedByDefault?: boolean;
}
