import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ScoreService } from '../../services/score.service';
import { PlayerScore } from '../../models/game.model';
import { CounterComponent } from '../../components/counter/counter.component';

@Component({
  selector: 'app-score-entry',
  standalone: true,
  imports: [CommonModule, CounterComponent],
  templateUrl: './score-entry.component.html',
  styleUrl: './score-entry.component.scss'
})
export class ScoreEntryComponent implements OnInit {
  playerIndex = signal(0);
  score = signal<PlayerScore | null>(null);

  waterFace = computed(() => this.scoreService.config().waterFace);
  isLastPlayer = computed(() =>
    this.playerIndex() === this.scoreService.config().players.length - 1
  );

  total = computed(() => {
    const s = this.score();
    if (!s) return 0;
    return this.scoreService.calculateTotal(s, this.waterFace());
  });

  treePoints = computed(() => this.score() ? this.scoreService.treePoints(this.score()!) : 0);
  mountainPoints = computed(() => this.score() ? this.scoreService.mountainPoints(this.score()!) : 0);
  fieldPoints = computed(() => this.score() ? this.scoreService.fieldPoints(this.score()!) : 0);
  waterPoints = computed(() => this.score() ? this.scoreService.waterPoints(this.score()!, this.waterFace()) : 0);
  buildingPoints = computed(() => this.score() ? this.scoreService.buildingPoints(this.score()!) : 0);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public scoreService: ScoreService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const index = +params['index'];
      const scores = this.scoreService.scores();
      if (!scores.length) {
        this.router.navigate(['/']);
        return;
      }
      if (index >= scores.length) {
        this.router.navigate(['/results']);
        return;
      }
      this.playerIndex.set(index);
      this.scoreService.setCurrentIndex(index);
      this.score.set({ ...scores[index], trees: { ...scores[index].trees }, mountains: { ...scores[index].mountains } });
    });
  }

  update(patch: Partial<PlayerScore>) {
    this.score.update(s => s ? { ...s, ...patch } : s);
  }

  updateTrees(field: 'size2' | 'size3', val: number) {
    this.score.update(s => s ? { ...s, trees: { ...s.trees, [field]: val } } : s);
  }

  updateMountains(field: 'size1' | 'size2' | 'size3', val: number) {
    this.score.update(s => s ? { ...s, mountains: { ...s.mountains, [field]: val } } : s);
  }

  addAnimalCard() {
    this.score.update(s => s ? { ...s, animalCards: [...s.animalCards, 0] } : s);
  }

  updateAnimalCard(index: number, val: number) {
    this.score.update(s => {
      if (!s) return s;
      const cards = [...s.animalCards];
      cards[index] = val;
      return { ...s, animalCards: cards };
    });
  }

  removeAnimalCard(index: number) {
    this.score.update(s => {
      if (!s) return s;
      const cards = s.animalCards.filter((_, i) => i !== index);
      return { ...s, animalCards: cards };
    });
  }

  animalCardTotal = computed(() =>
    this.score()?.animalCards.reduce((sum, v) => sum + v, 0) ?? 0
  );

  next() {
    const s = this.score();
    if (!s) return;
    this.scoreService.updateScore(this.playerIndex(), s);
    if (this.isLastPlayer()) {
      this.scoreService.setPhase('results');
      this.router.navigate(['/results']);
    } else {
      this.router.navigate(['/score', this.playerIndex() + 1]);
    }
  }

  newGame() {
    this.scoreService.clearGame();
    this.router.navigate(['/']);
  }
}
