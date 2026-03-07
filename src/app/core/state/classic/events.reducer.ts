import { createReducer, on } from '@ngrx/store';
import { SportEvent } from '../../models/event.model';
import * as EventsActions from './events.actions';

export interface ClassicEventsState {
  events: SportEvent[];
  selectedSport: string | null;
  selectedCategory: string | null;
  loading: boolean;
  error: string | null;
}

export const initialState: ClassicEventsState = {
  events: [],
  selectedSport: null,
  selectedCategory: null,
  loading: false,
  error: null,
};

export const eventsReducer = createReducer(
  initialState,

  on(EventsActions.syncRouteParams, (state, { sport, category }) => ({
    ...state,
    selectedSport: sport,
    selectedCategory: category,
  })),

  on(EventsActions.loadEvents, (state) => ({
    ...state,
    loading: state.events.length === 0,
    error: null,
  })),

  on(EventsActions.loadEventsSuccess, (state, { events }) => ({
    ...state,
    events,
    loading: false,
  })),

  on(EventsActions.loadEventsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
);
