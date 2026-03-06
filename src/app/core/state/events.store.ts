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
import { BettingEvent } from '../models/event.model';
import { EventsService } from '../services/events.service';
import {
  setEventsError,
  setEventsLoaded,
  setEventsLoading,
  withEventsCallState,
} from './features/withEventsCallState';

interface EventsState {
  events: BettingEvent[];
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
    setSportFilter(sport: string | null) {
      updateState(state, 'Filter: Selected Sport', {
        selectedSport: sport,
        selectedCategory: null,
      });
    },
    setCategoryFilter(category: string | null) {
      updateState(state, 'Filter: Selected Category', {
        selectedCategory: category,
      });
    },
    clearFilters() {
      updateState(state, 'Filter: Clear All', {
        selectedSport: null,
        selectedCategory: null,
      });
    },

    loadEvents: rxMethod<void>(
      pipe(
        tap(() => setEventsLoading()),
        switchMap(() => {
          return eventsService.getEvents().pipe(
            tapResponse({
              next: (events) => {
                updateState(state, 'Events: Load Success', { events });
                setEventsLoaded();
              },
              error: (err: { message?: string }) => {
                console.error('Failed to load events', err);
                setEventsError('Failed to load events');
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

      // Auto-polling every 15 seconds for updated odds
      setInterval(() => {
        store.loadEvents();
      }, 15000);
    },
  }),
);
