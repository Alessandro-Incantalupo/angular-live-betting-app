import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { InjectionToken, inject } from '@angular/core';
import { Observable, of, switchMap, throwError, timer } from 'rxjs';
import { API_BASE_URL } from '../events/events-api';
import { EventsResponse } from '../events/event.model';
import { OddsSimulator, SimulatorOptions } from './odds-simulator';
import { SEED_EVENTS } from './seed-events';

export interface MockApiOptions {
  /** Network delay to fake, in milliseconds: [shortest, longest]. */
  latencyMs: [number, number];
  /** Share of requests that fail with a 503, from 0 to 1. Lets you see the error states. */
  failureRate: number;
  /** The clock the market moves on. Tests pass a fake one. */
  now: () => number;
  simulator: Partial<SimulatorOptions>;
}

export const MOCK_API_OPTIONS = new InjectionToken<MockApiOptions>('MOCK_API_OPTIONS', {
  providedIn: 'root',
  factory: () => ({ latencyMs: [150, 450], failureRate: 0, now: Date.now, simulator: {} }),
});

/** One market per app instance, so every request sees the same moving prices. */
export const ODDS_SIMULATOR = new InjectionToken<OddsSimulator>('ODDS_SIMULATOR', {
  providedIn: 'root',
  factory: () => new OddsSimulator(SEED_EVENTS, inject(MOCK_API_OPTIONS).simulator),
});

/**
 * Answers requests under the API base URL in the browser, as a real backend would, so the app
 * runs as static files. Any other request passes through. To use a real API, remove this
 * interceptor from `provideHttpClient` and point `API_BASE_URL` at it.
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = inject(API_BASE_URL);
  if (!req.url.startsWith(`${baseUrl}/`)) return next(req);

  const options = inject(MOCK_API_OPTIONS);
  const simulator = inject(ODDS_SIMULATOR);
  const path = req.url.slice(baseUrl.length);
  const [min, max] = options.latencyMs;
  const latency = min + Math.round(simulator.next() * (max - min));

  const respond = (): Observable<HttpEvent<unknown>> => {
    if (simulator.next() < options.failureRate) {
      return throwError(() => error(req, 503, 'Service Unavailable'));
    }
    if (req.method === 'GET' && path === '/events') {
      const body: EventsResponse = {
        events: simulator.snapshot(options.now()),
        updatedAt: new Date(options.now()).toISOString(),
      };
      return of(new HttpResponse({ status: 200, statusText: 'OK', url: req.url, body }));
    }
    return throwError(() => error(req, 404, 'Not Found'));
  };

  // The market is read after the fake delay, like a server that answers when it's ready.
  return timer(latency).pipe(switchMap(respond));
};

function error(req: HttpRequest<unknown>, status: number, statusText: string) {
  return new HttpErrorResponse({ status, statusText, url: req.url });
}
