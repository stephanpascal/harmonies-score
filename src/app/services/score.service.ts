import { Injectable, signal, computed } from '@angular/core';
import { GameConfig, PlayerScore, WaterFace, defaultPlayerScore } from '../models/game.model';

const RIVER_BARÈME = [0, 0, 2, 5, 8, 11, 15];
const STORAGE_KEY = 'harmonies-score-state';

export type GamePhase = 'scoring' | 'results';

interface SavedState {
  config: GameConfig;
  scores: PlayerScore[];
  currentIndex: number;
  phase: GamePhase;
}

@Injectable({ providedIn: 'root' })
export class ScoreService {
  config = signal<GameConfig>({ players: [], waterFace: 'A' });
  scores = signal<PlayerScore[]>([]);
  currentIndex = signal(0);
  phase = signal<GamePhase>('scoring');

  hasSavedGame = computed(() => this.scores().length > 0);

  constructor() {
    this.loadFromStorage();
  }

  initGame(players: string[], waterFace: WaterFace) {
    this.config.set({ players, waterFace });
    this.scores.set(players.map(defaultPlayerScore));
    this.currentIndex.set(0);
    this.phase.set('scoring');
    this.saveToStorage();
  }

  updateScore(index: number, score: PlayerScore) {
    const updated = [...this.scores()];
    updated[index] = score;
    this.scores.set(updated);
    this.saveToStorage();
  }

  setCurrentIndex(index: number) {
    this.currentIndex.set(index);
    this.saveToStorage();
  }

  setPhase(phase: GamePhase) {
    this.phase.set(phase);
    this.saveToStorage();
  }

  clearGame() {
    this.scores.set([]);
    this.config.set({ players: [], waterFace: 'A' });
    this.currentIndex.set(0);
    this.phase.set('scoring');
    localStorage.removeItem(STORAGE_KEY);
  }

  private saveToStorage() {
    const state: SavedState = {
      config: this.config(),
      scores: this.scores(),
      currentIndex: this.currentIndex(),
      phase: this.phase(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const state: SavedState = JSON.parse(raw);
      if (!state.scores?.length) return;
      this.config.set(state.config);
      this.scores.set(state.scores);
      this.currentIndex.set(state.currentIndex ?? 0);
      this.phase.set(state.phase ?? 'scoring');
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  calculateTotal(score: PlayerScore, waterFace: WaterFace): number {
    return (
      this.treePoints(score) +
      this.mountainPoints(score) +
      this.fieldPoints(score) +
      this.waterPoints(score, waterFace) +
      this.buildingPoints(score) +
      score.animalCards.reduce((sum, v) => sum + v, 0)
    );
  }

  treePoints(score: PlayerScore): number {
    return score.trees.size2 * 1 + score.trees.size3 * 3;
  }

  mountainPoints(score: PlayerScore): number {
    return score.mountains.size1 * 1 + score.mountains.size2 * 3 + score.mountains.size3 * 7;
  }

  fieldPoints(score: PlayerScore): number {
    return score.fields * 5;
  }

  waterPoints(score: PlayerScore, waterFace: WaterFace): number {
    if (waterFace === 'B') return score.islands * 5;
    const len = score.riverLength;
    if (len <= 6) return RIVER_BARÈME[len] ?? 0;
    return 15 + (len - 6) * 4;
  }

  buildingPoints(score: PlayerScore): number {
    return score.buildings * 5;
  }
}
