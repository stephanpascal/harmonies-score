import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ScoreService } from '../../services/score.service';
import { PlayerScore } from '../../models/game.model';

interface RankedPlayer {
  score: PlayerScore;
  total: number;
  rank: number;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  waterFace = computed(() => this.scoreService.config().waterFace);

  ranked = computed<RankedPlayer[]>(() => {
    const face = this.waterFace();
    return this.scoreService.scores()
      .map(s => ({ score: s, total: this.scoreService.calculateTotal(s, face), rank: 0 }))
      .sort((a, b) => b.total - a.total)
      .map((p, i, arr) => ({
        ...p,
        rank: i === 0 ? 1 : (p.total === arr[i - 1].total ? arr[i - 1].rank : i + 1)
      }));
  });

  medals = ['🥇', '🥈', '🥉'];

  constructor(public scoreService: ScoreService, private router: Router) {}

  medal(rank: number): string {
    return this.medals[rank - 1] ?? `${rank}.`;
  }

  trees(s: PlayerScore) { return this.scoreService.treePoints(s); }
  mountains(s: PlayerScore) { return this.scoreService.mountainPoints(s); }
  fields(s: PlayerScore) { return this.scoreService.fieldPoints(s); }
  water(s: PlayerScore) { return this.scoreService.waterPoints(s, this.waterFace()); }
  buildings(s: PlayerScore) { return this.scoreService.buildingPoints(s); }
  animalTotal(s: PlayerScore) { return s.animalCards.reduce((sum, v) => sum + v, 0); }

  restart() {
    this.scoreService.clearGame();
    this.router.navigate(['/']);
  }
}