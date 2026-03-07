import { createAction, props } from '@ngrx/store';
import { SportEvent } from '../../models/event.model';

export const loadEvents = createAction('[Events] Load Events');

export const loadEventsSuccess = createAction(
  '[Events] Load Events Success',
  props<{ events: SportEvent[] }>(),
);

export const loadEventsFailure = createAction(
  '[Events] Load Events Failure',
  props<{ error: string }>(),
);

export const syncRouteParams = createAction(
  '[Events Filter] Sync Routes',
  props<{ sport: string | null; category: string | null }>(),
);
