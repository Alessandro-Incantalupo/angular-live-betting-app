import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { EventsResponse } from '../events/event.model';
import { MOCK_API_OPTIONS, MockApiOptions, mockApiInterceptor } from './mock-api';
import { SEED_EVENTS } from './seed-events';

function setup(options: Partial<MockApiOptions> = {}) {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(withInterceptors([mockApiInterceptor])),
      provideHttpClientTesting(),
      {
        provide: MOCK_API_OPTIONS,
        useValue: {
          latencyMs: [0, 0],
          failureRate: 0,
          now: () => Date.parse('2026-01-01T12:00:00Z'),
          simulator: {},
          ...options,
        },
      },
    ],
  });
  return TestBed.inject(HttpClient);
}

describe('mockApiInterceptor', () => {
  it('answers GET /api/events with every event and the time of the snapshot', async () => {
    const http = setup();
    const body = await firstValueFrom(http.get<EventsResponse>('/api/events'));
    expect(body.events).toHaveLength(SEED_EVENTS.length);
    expect(body.updatedAt).toBe('2026-01-01T12:00:00.000Z');
  });

  it('answers 404 for a path it does not know', async () => {
    const http = setup();
    const error = await firstValueFrom(http.get('/api/nothing')).catch((e) => e);
    expect(error).toBeInstanceOf(HttpErrorResponse);
    expect((error as HttpErrorResponse).status).toBe(404);
  });

  it('fails with 503 as often as asked', async () => {
    const http = setup({ failureRate: 1 });
    const error = await firstValueFrom(http.get('/api/events')).catch((e) => e);
    expect((error as HttpErrorResponse).status).toBe(503);
  });

  it('lets requests outside the API through to the real backend', () => {
    const http = setup();
    http.get('/assets/config.json').subscribe();
    TestBed.inject(HttpTestingController).expectOne('/assets/config.json').flush({});
  });
});
