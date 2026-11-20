import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { EventsApi } from '../events/events-api';
import { EventsResponse, SportEvent } from '../events/event.model';
import { SEED_EVENTS } from '../mock-api/seed-events';
import { EventsStore, POLL_INTERVAL_MS } from './events.store';

const INTERVAL = 1_000;

/** A fake API whose next answer each test decides. */
class FakeApi {
  calls = 0;
  next: () => Observable<EventsResponse> = () => respond(SEED_EVENTS);
  list(): Observable<EventsResponse> {
    this.calls++;
    return this.next();
  }
}

function respond(events: readonly SportEvent[], at = '2026-01-01T12:00:00.000Z') {
  return of({ events: [...events], updatedAt: at });
}

function withPrice(id: number, home: number): SportEvent[] {
  return SEED_EVENTS.map((e) => (e.id === id ? { ...e, odds: { ...e.odds, home } } : e));
}

function setup() {
  const api = new FakeApi();
  TestBed.configureTestingModule({
    providers: [
      { provide: EventsApi, useValue: api },
      { provide: POLL_INTERVAL_MS, useValue: INTERVAL },
    ],
  });
  const store = TestBed.inject(EventsStore);
  TestBed.tick();
  vi.advanceTimersByTime(0);
  return { api, store };
}

describe('EventsStore', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('loads the events as soon as it is created', () => {
    const { api, store } = setup();
    expect(api.calls).toBe(1);
    expect(store.entities()).toHaveLength(SEED_EVENTS.length);
    expect(store.requestStatus()).toBe('loaded');
  });

  it('polls on an interval', () => {
    const { api } = setup();
    vi.advanceTimersByTime(INTERVAL * 3);
    expect(api.calls).toBe(4);
  });

  it('stops polling while paused and fetches again on resume', () => {
    const { api, store } = setup();
    store.setLive(false);
    TestBed.tick();
    vi.advanceTimersByTime(INTERVAL * 5);
    expect(api.calls).toBe(1);

    store.setLive(true);
    TestBed.tick();
    vi.advanceTimersByTime(0);
    expect(api.calls).toBe(2);
  });

  it('records which prices moved and keeps a short history per event', () => {
    const { api, store } = setup();
    api.next = () => respond(withPrice(3, 9.99), '2026-01-01T12:00:01.000Z');
    vi.advanceTimersByTime(INTERVAL);

    expect(store.moves()).toEqual({ 3: { home: 'up' } });
    expect(store.history()[3].map((p) => p.odds.home)).toEqual([9.99, SEED_EVENTS[2].odds.home]);
    expect(store.history()[1]).toHaveLength(1);

    // The next update without changes clears the arrows.
    vi.advanceTimersByTime(INTERVAL);
    expect(store.moves()).toEqual({});
  });

  it('keeps the last prices when a refresh fails, and says so', () => {
    const { api, store } = setup();
    api.next = () => throwError(() => new Error('offline'));
    vi.advanceTimersByTime(INTERVAL);

    expect(store.entities()).toHaveLength(SEED_EVENTS.length);
    expect(store.error()).toBe("Couldn't refresh the odds.");

    api.next = () => respond(SEED_EVENTS);
    vi.advanceTimersByTime(INTERVAL);
    expect(store.error()).toBeNull();
  });

  it('filters by sport and category and groups the navigation', () => {
    const { store } = setup();
    store.setView({ sport: 'football', category: 'serie-a', eventId: null });
    TestBed.tick();

    expect(store.filteredEvents().map((e) => e.home)).toEqual(['Inter', 'AC Milan', 'Roma']);
    expect(store.selectedSport()?.name).toBe('Football');
    expect(store.selectedCategory()).toEqual({ name: 'Serie A', slug: 'serie-a', count: 3 });
    expect(store.sports().map((s) => s.name)).toEqual([
      'Basketball',
      'Cricket',
      'Football',
      'Golf',
      'Tennis',
    ]);
  });

  it('narrows the visible events to one on a detail page', () => {
    const { store } = setup();
    store.setView({ sport: 'football', category: 'la-liga', eventId: 3 });
    TestBed.tick();
    expect(store.visibleEvents().map((e) => e.id)).toEqual([3]);
  });
});
