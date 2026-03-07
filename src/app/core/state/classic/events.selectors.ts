import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClassicEventsState } from './events.reducer';

export const selectEventsState =
  createFeatureSelector<ClassicEventsState>('classicEvents');

export const selectAllEvents = createSelector(
  selectEventsState,
  (state) => state.events,
);

export const selectSelectedSport = createSelector(
  selectEventsState,
  (state) => state.selectedSport,
);

export const selectSelectedCategory = createSelector(
  selectEventsState,
  (state) => state.selectedCategory,
);

export const selectEventsLoading = createSelector(
  selectEventsState,
  (state) => state.loading,
);

export const selectEventsError = createSelector(
  selectEventsState,
  (state) => state.error,
);

export const selectFilteredEvents = createSelector(
  selectAllEvents,
  selectSelectedSport,
  selectSelectedCategory,
  (events, sport, category) => {
    return events.filter((event) => {
      const matchSport = sport ? event.sport === sport : true;
      const matchCategory = category ? event.category === category : true;
      return matchSport && matchCategory;
    });
  },
);

export const selectAvailableSports = createSelector(
  selectAllEvents,
  (events) => {
    const sports = new Set(events.map((e) => e.sport));
    return Array.from(sports).sort();
  },
);

export const selectAvailableCategories = createSelector(
  selectAllEvents,
  selectSelectedSport,
  (events, currentSport) => {
    const baseEvents = currentSport
      ? events.filter((e) => e.sport === currentSport)
      : events;
    const categories = new Set(baseEvents.map((e) => e.category));
    return Array.from(categories).sort();
  },
);
