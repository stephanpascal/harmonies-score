export type WaterFace = 'A' | 'B';

export interface TreeScore {
  size2: number;
  size3: number;
}

export interface MountainScore {
  size1: number;
  size2: number;
  size3: number;
}

export interface PlayerScore {
  name: string;
  trees: TreeScore;
  mountains: MountainScore;
  fields: number;
  riverLength: number;
  islands: number;
  buildings: number;
  animalCards: number[];
}

export interface GameConfig {
  players: string[];
  waterFace: WaterFace;
}

export const defaultPlayerScore = (name: string): PlayerScore => ({
  name,
  trees: { size2: 0, size3: 0 },
  mountains: { size1: 0, size2: 0, size3: 0 },
  fields: 0,
  riverLength: 0,
  islands: 0,
  buildings: 0,
  animalCards: [],
});