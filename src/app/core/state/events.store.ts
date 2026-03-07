import { updateState } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
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
import {
  setEventsError,
  setEventsLoaded,
  setEventsLoading,
  withEventsCallState,
} from './features/withEventsCallState';

import { withDevtools } from '@angular-architects/ngrx-toolkit';

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
  withDevtools('EventsStore'),
  withState(initialState),
  withEventsCallState(),
  withComputed((state) => ({
    filteredEvents: computed(() => {
      const allEvents = state.events();
      const sport = state.selectedSport();
      const category = state.selectedCategory();

      return allEvents.filter((event) => {
        const matchSport = sport ? event.sport === sport : true;
        const matchCategory = category ? event.category === category : true;
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
        ? state.events().filter((e) => e.sport === currentSport)
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
          updateState(state, 'Filter: Sync Routes', {
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
            updateState(state, 'Events: Loading', setEventsLoading());
          }
        }),
        switchMap(() => {
          return eventsService.getEvents().pipe(
            tapResponse({
              next: (events) => {
                const isPolling = state.events().length > 0;

                updateState(
                  state,
                  isPolling ? 'Events: Polled Success' : 'Events: Load Success',
                  { events },
                  setEventsLoaded(),
                );
              },
              error: (err: { message?: string }) => {
                console.error('Failed to load events', err);
                updateState(
                  state,
                  'Events: Load Error',
                  setEventsError('Failed to load events'),
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
