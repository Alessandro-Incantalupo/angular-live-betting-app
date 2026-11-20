import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SEED_EVENTS } from '../core/mock-api/seed-events';
import { EventCard } from './event-card';

describe('EventCard', () => {
  async function render(id: number, moves = {}) {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(EventCard);
    fixture.componentRef.setInput(
      'event',
      SEED_EVENTS.find((e) => e.id === id)!,
    );
    fixture.componentRef.setInput('moves', moves);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('links the event name to its page', async () => {
    const link = (await render(3)).querySelector('h2 a')!;
    expect(link.textContent?.trim()).toBe('Real Madrid vs Barcelona');
    expect(link.getAttribute('href')).toBe('/events/3');
  });

  it('labels each price for screen readers and hides the 1 X 2 shorthand', async () => {
    const terms = [...(await render(3)).querySelectorAll('dt')].map((dt) =>
      dt.querySelector('.visually-hidden')?.textContent?.trim(),
    );
    expect(terms).toEqual(['Real Madrid to win', 'Draw', 'Barcelona to win']);
  });

  it('has no draw for a sport that cannot end level', async () => {
    expect((await render(12)).querySelectorAll('dt')).toHaveLength(2);
  });

  it('shows a move as an arrow and says it in words', async () => {
    const el = await render(3, { home: 'up' });
    const move = el.querySelector('.move')!;
    expect(move.querySelector('[aria-hidden="true"]')?.textContent).toBe('▲');
    expect(move.querySelector('.visually-hidden')?.textContent).toBe(', up');
  });

  it('marks only the prices that moved for the flash', async () => {
    const boxes = [...(await render(3, { away: 'down' })).querySelectorAll('.price')];
    expect(boxes.map((box) => box.className.replace('price', '').trim())).toEqual([
      '',
      '',
      'price-down',
    ]);
  });
});
