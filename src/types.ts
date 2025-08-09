export type WeaponType = 'fire' | 'laser' | 'poison';

export interface KaijuConfig {
  name: string;
  arms: 'claws' | 'club' | 'tentacles';
  legs: 'biped' | 'quad' | 'treads';
  weapon: WeaponType;
}

export interface ScoreRecord {
  id: string;
  kaiju: KaijuConfig;
  city: string;
  score: number;
  createdAt: string;
}

export interface GameSettings {
  music: boolean;
  sfx: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
}
