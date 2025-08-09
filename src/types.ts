export enum WeaponType {
  Fire = 'fire',
  Laser = 'laser',
  Poison = 'poison',
}

export enum ArmType {
  Claws = 'claws',
  Club = 'club',
  Tentacles = 'tentacles',
}

export enum LegType {
  Biped = 'biped',
  Quad = 'quad',
  Treads = 'treads',
}

export enum Difficulty {
  Easy = 'easy',
  Normal = 'normal',
  Hard = 'hard',
}

export const ARM_OPTIONS = [
  { value: ArmType.Claws, label: 'Claws' },
  { value: ArmType.Club, label: 'Club' },
  { value: ArmType.Tentacles, label: 'Tentacles' },
];

export const LEG_OPTIONS = [
  { value: LegType.Biped, label: 'Biped' },
  { value: LegType.Quad, label: 'Quad' },
  { value: LegType.Treads, label: 'Treads' },
];

export const WEAPON_OPTIONS = [
  { value: WeaponType.Fire, label: 'Fire Breath' },
  { value: WeaponType.Laser, label: 'Laser Eyes' },
  { value: WeaponType.Poison, label: 'Poison Darts' },
];

export const DIFFICULTY_OPTIONS = [
  Difficulty.Easy,
  Difficulty.Normal,
  Difficulty.Hard,
];

export interface KaijuConfig {
  name: string;
  arms: ArmType;
  legs: LegType;
  weapon: WeaponType;
}

export interface CityDefinition {
  id: string;
  name: string;
  difficulty: Difficulty;
  blocks: number;
}

export interface ScoreRecord {
  id: string;
  kaiju: KaijuConfig;
  cityId: string;
  score: number;
  createdAt: string;
}

export interface GameSettings {
  music: boolean;
  sfx: boolean;
  difficulty: Difficulty;
}
