import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/setup/setup.component').then(m => m.SetupComponent) },
  { path: 'score/:index', loadComponent: () => import('./pages/score-entry/score-entry.component').then(m => m.ScoreEntryComponent) },
  { path: 'results', loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsComponent) },
  { path: '**', redirectTo: '' }
];
