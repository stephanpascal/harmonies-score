import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="counter">
      <button class="btn-counter" (click)="decrement()" [disabled]="value() <= min()">−</button>
      <span class="counter-value">{{ value() }}</span>
      <button class="btn-counter" (click)="increment()">+</button>
    </div>
  `,
  styles: [`
    .counter {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-counter {
      width: 2.2rem;
      height: 2.2rem;
      border-radius: 50%;
      border: 2px solid var(--color-primary);
      background: white;
      color: var(--color-primary);
      font-size: 1.2rem;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, color 0.15s;
    }
    .btn-counter:hover:not(:disabled) {
      background: var(--color-primary);
      color: white;
    }
    .btn-counter:disabled {
      opacity: 0.3;
      cursor: default;
    }
    .counter-value {
      min-width: 2rem;
      text-align: center;
      font-size: 1.2rem;
      font-weight: bold;
      color: var(--color-dark);
    }
  `]
})
export class CounterComponent {
  value = input.required<number>();
  min = input<number>(0);
  changed = output<number>();

  increment() { this.changed.emit(this.value() + 1); }
  decrement() { if (this.value() > this.min()) this.changed.emit(this.value() - 1); }
}