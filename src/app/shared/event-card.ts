import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  SELECTIONS,
  SELECTION_CODE,
  SportEvent,
  eventName,
  selectionLabel,
} from '../core/events/event.model';
import { OddsMoves } from '../core/events/odds';
import { OddsValue } from './odds-value';

@Component({
  selector: 'app-event-card',
  imports: [RouterLink, OddsValue],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
})
export class EventCard {
  readonly event = input.required<SportEvent>();
  readonly moves = input<OddsMoves>({});

  protected readonly name = computed(() => eventName(this.event()));
  protected readonly prices = computed(() => {
    const event = this.event();
    return SELECTIONS.flatMap((selection) => {
      const value = event.odds[selection];
      return value === null
        ? []
        : [
            {
              selection,
              value,
              code: SELECTION_CODE[selection],
              label: selectionLabel(event, selection),
              move: this.moves()[selection],
            },
          ];
    });
  });
}
