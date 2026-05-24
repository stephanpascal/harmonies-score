import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ScoreService } from './services/score.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />'
})
export class AppComponent implements OnInit {
  constructor(private scoreService: ScoreService, private router: Router) {}

  ngOnInit() {
    if (!this.scoreService.hasSavedGame()) return;

    if (this.scoreService.phase() === 'results') {
      this.router.navigate(['/results']);
    } else {
      this.router.navigate(['/score', this.scoreService.currentIndex()]);
    }
  }
}
