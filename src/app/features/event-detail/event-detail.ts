import { DatePipe } from '@angular/common';
import { Component, computed, effect, inject, input, numberAttribute } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import {
  SELECTIONS,
  SELECTION_CODE,
  Selection,
  eventName,
  selectionLabel,
} from '../../core/events/event.model';
import { slugify } from '../../core/events/slug';
import { EventsStore } from '../../core/state/events.store';
import { OddsValue } from '../../shared/odds-value';

@Component({
  selector: 'app-event-detail',
  imports: [RouterLink, DatePipe, OddsValue],
  templateUrl: './event-detail.html',
  styleUrl: './event-detail.css',
})
export default class EventDetail {
  protected readonly store = inject(EventsStore);

  /** Route parameter, bound by the router. */
  readonly id = input.required({ transform: numberAttribute });

  protected readonly event = computed(() => this.store.entityMap()[this.id()]);
  protected readonly name = computed(() => {
    const event = this.event();
    return event ? eventName(event) : null;
  });
  protected readonly sportSlug = computed(() => slugify(this.event()?.sport ?? ''));
  protected readonly categorySlug = computed(() => slugify(this.event()?.category ?? ''));
  protected readonly history = computed(() => this.store.history()[this.id()] ?? []);

  /** The outcomes this sport has: no draw column for basketball or tennis. */
  protected readonly selections = computed(() => {
    const event = this.event();
    return event ? SELECTIONS.filter((s) => event.odds[s] !== null) : [];
  });

  /** Each outcome's current price and its last move. */
  protected readonly prices = computed(() => {
    const event = this.event();
    if (!event) return [];
    const moves = this.store.moves()[event.id];
    return this.selections().map((selection) => ({
      selection,
      value: event.odds[selection]!,
      move: moves?.[selection],
    }));
  });

  protected readonly code = (s: Selection) => SELECTION_CODE[s];
  protected readonly label = (s: Selection) => {
    const event = this.event();
    return event ? selectionLabel(event, s) : '';
  };

  constructor() {
    this.store.setView(
      computed(() => ({
        sport: this.event() ? this.sportSlug() : null,
        category: this.event() ? this.categorySlug() : null,
        eventId: this.id(),
      })),
    );
    const title = inject(Title);
    effect(() => {
      const name = this.name();
      title.setTitle(name ? `${name} odds · Live odds` : 'Event · Live odds');
    });
  }
}
