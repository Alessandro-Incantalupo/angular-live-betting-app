import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { EventsStore } from '../core/state/events.store';

@Component({
  selector: 'app-sport-nav',
  imports: [RouterLink],
  templateUrl: './sport-nav.html',
  styleUrl: './sport-nav.css',
})
export class SportNav {
  protected readonly store = inject(EventsStore);
  /** On small screens the list folds behind a button; on wide screens it is always shown. */
  protected readonly open = signal(false);
  protected readonly total = computed(() => this.store.entities().length);

  /** The page being shown is the sport or category itself, not an event inside it. */
  protected readonly onList = computed(() => this.store.view().eventId === null);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.open.set(false));
  }
}
