import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { SportEvent } from '../models/event.model';
import { EventsService } from '../services/events.service';
import { slugify } from '../utils/string.utils';
import {
  setEventsError,
  setEventsLoaded,
  setEventsLoading,
  withEventsCallState,
} from './features/withEventsCallState';

interface EventsState {
  events: SportEvent[];
  selectedSport: string | null;
  selectedCategory: string | null;
}

const initialState: EventsState = {
  events: [],
  selectedSport: null,
  selectedCategory: null,
};

export const EventsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEventsCallState(),
  withComputed((state) => ({
    filteredEvents: computed(() => {
      const allEvents = state.events();
      const sport = state.selectedSport();
      const category = state.selectedCategory();

      return allEvents.filter((event) => {
        const matchSport = sport ? slugify(event.sport) === sport : true;
        const matchCategory = category
          ? slugify(event.category) === category
          : true;
        return matchSport && matchCategory;
      });
    }),
    availableSports: computed(() => {
      const sports = new Set(state.events().map((e) => e.sport));
      return Array.from(sports).sort();
    }),
    availableCategories: computed(() => {
      const currentSport = state.selectedSport();
      const baseEvents = currentSport
        ? state.events().filter((e) => slugify(e.sport) === currentSport)
        : state.events();
      const categories = new Set(baseEvents.map((e) => e.category));
      return Array.from(categories).sort();
    }),
  })),
  withMethods((state, eventsService = inject(EventsService)) => ({
    syncRouteParams: rxMethod<{
      sport: string | undefined;
      category: string | undefined;
    }>(
      pipe(
        tap(({ sport, category }) => {
          patchState(state, {
            selectedSport: sport ?? null,
            selectedCategory: category ?? null,
          });
        }),
      ),
    ),

    loadEvents: rxMethod<void>(
      pipe(
        tap(() => {
          if (state.events().length === 0) {
            patchState(state, setEventsLoading());
          }
        }),
        switchMap(() => {
          return eventsService.getEvents().pipe(
            tapResponse({
              next: (events) => {
                patchState(state, { events },
                  setEventsLoaded(),
                );
              },
              error: (err: { message?: string }) => {
                console.error('Failed to load events', err);
                patchState(state, setEventsError('Failed to load events'),
                );
              },
            }),
          );
        }),
      ),
    ),
  })),
  withHooks({
    onInit(store) {
      store.loadEvents();

      setInterval(() => {
        store.loadEvents();
      }, 15000);
    },
  }),
);
