import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, timer } from 'rxjs';
import { EventsService } from '../../services/events.service';
import * as EventsActions from './events.actions';

@Injectable()
export class EventsEffects {
  private actions$ = inject(Actions);
  private eventsService = inject(EventsService);
  private store = inject(Store);

  init$ = createEffect(() => of(EventsActions.loadEvents()));

  pollEvents$ = createEffect(() =>
    timer(15000, 15000).pipe(map(() => EventsActions.loadEvents())),
  );

  loadEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EventsActions.loadEvents),
      switchMap(() =>
        this.eventsService.getEvents().pipe(
          map((events) => EventsActions.loadEventsSuccess({ events })),
          catchError((error: HttpErrorResponse | Error) =>
            of(
              EventsActions.loadEventsFailure({
                error: error?.message || 'Failed to load events',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
