import { InjectionToken, computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { setAllEntities, withEntities } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, Observable, exhaustMap, switchMap, timer } from 'rxjs';
import { EventsApi } from '../events/events-api';
import { EventsResponse, Odds, SportEvent } from '../events/event.model';
import { OddsMoves, diffOdds, hasMoves } from '../events/odds';
import { slugify } from '../events/slug';
import { injectPageVisible } from '../platform/page-visibility';
import { setError, setLoaded, setLoading, withRequestStatus } from './with-request-status';

/** How often the store asks for fresh odds while updates are on and the tab is visible. */
export const POLL_INTERVAL_MS = new InjectionToken<number>('POLL_INTERVAL_MS', {
  providedIn: 'root',
  factory: () => 5_000,
});

/** Price points kept per event for the "recent movement" table. */
export const HISTORY_LENGTH = 6;

export interface OddsPoint {
  at: string;
  odds: Odds;
}

export interface SportGroup {
  name: string;
  slug: string;
  count: number;
  categories: { name: string; slug: string; count: number }[];
}

/** What the current page shows: a sport, a sport and a category, or one event. */
export interface View {
  sport: string | null;
  category: string | null;
  eventId: number | null;
}

interface EventsState {
  view: View;
  /** Off when the reader pauses updates. Polling also stops while the tab is hidden. */
  live: boolean;
  updatedAt: string | null;
  /** How prices moved in the latest update. Events that didn't move have no entry. */
  moves: Record<number, OddsMoves>;
  history: Record<number, OddsPoint[]>;
}

const initialState: EventsState = {
  view: { sport: null, category: null, eventId: null },
  live: true,
  updatedAt: null,
  moves: {},
  history: {},
};

export const EventsStore = signalStore(
  { providedIn: 'root' },
  withEntities<SportEvent>(),
  withState(initialState),
  withRequestStatus(),
  withProps(() => ({
    _api: inject(EventsApi),
    _interval: inject(POLL_INTERVAL_MS),
    _pageVisible: injectPageVisible(),
  })),
  withComputed(({ entities, view }) => {
    const sports = computed(() => groupBySport(entities()));
    const selectedSport = computed(() => sports().find((s) => s.slug === view().sport) ?? null);
    return {
      sports,
      selectedSport,
      selectedCategory: computed(
        () => selectedSport()?.categories.find((c) => c.slug === view().category) ?? null,
      ),
      filteredEvents: computed(() => {
        const { sport, category } = view();
        return entities().filter(
          (e) =>
            (!sport || slugify(e.sport) === sport) &&
            (!category || slugify(e.category) === category),
        );
      }),
    };
  }),
  withComputed(({ entityMap, filteredEvents, view }) => ({
    /** The events the reader can see right now: one on a detail page, else the filtered list. */
    visibleEvents: computed(() => {
      const id = view().eventId;
      if (id === null) return filteredEvents();
      const event = entityMap()[id];
      return event ? [event] : [];
    }),
  })),
  withComputed(({ live, _pageVisible }) => ({
    isPolling: computed(() => live() && _pageVisible()),
  })),
  withMethods((store) => {
    const fetchEvents = (): Observable<EventsResponse> =>
      store._api.list().pipe(
        tapResponse({
          next: (response) => applyResponse(response),
          error: () => patchState(store, setError("Couldn't refresh the odds.")),
        }),
      );

    function applyResponse({ events, updatedAt }: EventsResponse): void {
      const previous = store.entityMap();
      const moves: Record<number, OddsMoves> = {};
      const history = { ...store.history() };
      for (const event of events) {
        const before = previous[event.id];
        const changed = before ? diffOdds(before.odds, event.odds) : {};
        if (hasMoves(changed)) moves[event.id] = changed;
        if (!before || hasMoves(changed)) {
          const points = [{ at: updatedAt, odds: event.odds }, ...(history[event.id] ?? [])];
          history[event.id] = points.slice(0, HISTORY_LENGTH);
        }
      }
      patchState(store, setAllEntities(events), { updatedAt, moves, history }, setLoaded());
    }

    return {
      /** Bind the route to the store: pass a signal and the store follows it. */
      setView: signalMethod<View>((view) => patchState(store, { view })),
      setLive(live: boolean): void {
        patchState(store, { live });
      },
      /** Fetch now, outside the polling rhythm (the "Try again" button). */
      refresh: rxMethod<void>(exhaustMap(fetchEvents)),
      /** Poll while the input is `true`; stop as soon as it turns `false`. */
      _pollWhile: rxMethod<boolean>(
        switchMap((active) => {
          if (!active) return EMPTY;
          if (store.entities().length === 0) patchState(store, setLoading());
          return timer(0, store._interval).pipe(exhaustMap(fetchEvents));
        }),
      ),
    };
  }),
  withHooks({
    onInit(store) {
      store._pollWhile(store.isPolling);
    },
  }),
);

function groupBySport(events: SportEvent[]): SportGroup[] {
  const groups = new Map<string, SportGroup>();
  for (const event of events) {
    let group = groups.get(event.sport);
    if (!group) {
      group = { name: event.sport, slug: slugify(event.sport), count: 0, categories: [] };
      groups.set(event.sport, group);
    }
    group.count++;
    const category = group.categories.find((c) => c.name === event.category);
    if (category) category.count++;
    else group.categories.push({ name: event.category, slug: slugify(event.category), count: 1 });
  }
  const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);
  return [...groups.values()]
    .map((g) => ({ ...g, categories: g.categories.sort(byName) }))
    .sort(byName);
}
