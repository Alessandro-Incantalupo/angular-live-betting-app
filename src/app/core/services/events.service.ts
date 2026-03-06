import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BettingEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  /**
   * Fetches all events from the mock server.
   * Note: The mock server randomly changes the odds on every request.
   */
  getEvents(): Observable<BettingEvent[]> {
    return this.http.get<BettingEvent[]>(`${this.apiUrl}/events`);
  }

  /**
   * Fetches a single event by ID.
   */
  getEventById(id: number): Observable<BettingEvent> {
    return this.http.get<BettingEvent>(`${this.apiUrl}/event/${id}`);
  }
}
