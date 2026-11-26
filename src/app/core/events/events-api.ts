import { HttpClient } from '@angular/common/http';
import { InjectionToken, inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { EventsResponse } from './event.model';

/** Where the odds API lives. The in-browser mock answers on this prefix too. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => '/api',
});

/**
 * The only class that knows the API's shape. It holds no state: the store decides when to call
 * it and what to keep.
 */
@Service()
export class EventsApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  list(): Observable<EventsResponse> {
    return this.http.get<EventsResponse>(`${this.baseUrl}/events`);
  }
}
