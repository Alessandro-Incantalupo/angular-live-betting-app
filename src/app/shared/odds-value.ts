import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Move } from '../core/events/odds';

/** A price with the direction of its last move: an arrow to see, a word to hear. */
@Component({
  selector: 'app-odds-value',
  imports: [DecimalPipe],
  template: `
    <span class="value">{{ value() | number: '1.2-2' }}</span>
    @if (move(); as move) {
      <span class="move" [class]="move">
        <span aria-hidden="true">{{ move === 'up' ? '▲' : '▼' }}</span>
        <span class="visually-hidden">, {{ move === 'up' ? 'up' : 'down' }}</span>
      </span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: baseline;
      gap: var(--space-1);
      font-variant-numeric: tabular-nums;
    }
    .value {
      font-weight: 700;
    }
    .move {
      font-size: 0.75em;
    }
    .up {
      color: var(--success-text);
    }
    .down {
      color: var(--danger-text);
    }
  `,
})
export class OddsValue {
  readonly value = input.required<number>();
  readonly move = input<Move | undefined>();
}
