import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SportEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getEvents() {
    // forced error to test the Error state UI:
    // return throwError(() => new Error('Simulated Backend Error')).pipe(
    //   delay(3000),
    // );
    // Artificial 3-second delay:
    // return this.http
    //   .get<SportEvent[]>(`${this.apiUrl}/events`)
    //   .pipe(delay(3000));
    return this.http.get<SportEvent[]>(`${this.apiUrl}/events`);
  }

  getEventById(id: number) {
    return this.http.get<SportEvent>(`${this.apiUrl}/event/${id}`);
  }
}
