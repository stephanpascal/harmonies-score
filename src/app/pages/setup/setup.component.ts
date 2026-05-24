import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ScoreService } from '../../services/score.service';
import { WaterFace } from '../../models/game.model';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './setup.component.html',
  styleUrl: './setup.component.scss'
})
export class SetupComponent {
  playerCount = signal(2);
  playerNames = signal(['', '', '', '']);
  waterFace = signal<WaterFace>('A');

  constructor(public scoreService: ScoreService, private router: Router) {}

  setPlayerCount(n: number) { this.playerCount.set(n); }

  updateName(index: number, name: string) {
    const names = [...this.playerNames()];
    names[index] = name;
    this.playerNames.set(names);
  }

  get activePlayers(): string[] {
    return this.playerNames().slice(0, this.playerCount());
  }

  canStart(): boolean {
    return this.activePlayers.every(n => n.trim().length > 0);
  }

  resume() {
    if (this.scoreService.phase() === 'results') {
      this.router.navigate(['/results']);
    } else {
      this.router.navigate(['/score', this.scoreService.currentIndex()]);
    }
  }

  start() {
    if (!this.canStart()) return;
    this.scoreService.initGame(this.activePlayers.map(n => n.trim()), this.waterFace());
    this.router.navigate(['/score', 0]);
  }
}
