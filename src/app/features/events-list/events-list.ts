import { Component, computed, effect, inject, input } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { EventsStore } from '../../core/state/events.store';
import { EventCard } from '../../shared/event-card';

@Component({
  selector: 'app-events-list',
  imports: [RouterLink, EventCard],
  templateUrl: './events-list.html',
  styleUrl: './events-list.css',
})
export default class EventsList {
  protected readonly store = inject(EventsStore);

  /** Route parameters, bound by the router (`withComponentInputBinding`). */
  readonly sport = input<string>();
  readonly category = input<string>();

  protected readonly heading = computed(() => {
    const sport = this.store.selectedSport();
    const category = this.store.selectedCategory();
    if (category) return category.name;
    if (sport) return sport.name;
    return this.sport() ? 'Unknown sport' : 'All sports';
  });

  /** The line under the heading: which sport a competition belongs to, and how many events. */
  protected readonly summary = computed(() => {
    const count = this.store.filteredEvents().length;
    const events = `${count} ${count === 1 ? 'event' : 'events'}`;
    const category = this.store.selectedCategory();
    return category ? `${this.store.selectedSport()?.name} · ${events}` : events;
  });

  constructor() {
    this.store.setView(
      computed(() => ({
        sport: this.sport() ?? null,
        category: this.category() ?? null,
        eventId: null,
      })),
    );
    const title = inject(Title);
    effect(() => title.setTitle(`${this.heading()} · Live odds`));
  }
}
