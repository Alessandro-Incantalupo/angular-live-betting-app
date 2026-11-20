import { Odds, SportEvent } from '../events/event.model';
import { OddsAnnouncer } from './odds-announcer';

const GAP = 20_000;

function event(id: number, odds: Partial<Odds> = {}): SportEvent {
  return {
    id,
    sport: 'Football',
    category: 'Serie A',
    home: `Home ${id}`,
    away: `Away ${id}`,
    odds: { home: 2, draw: 3, away: 4, ...odds },
  };
}

describe('OddsAnnouncer', () => {
  let announcer: OddsAnnouncer;
  beforeEach(() => (announcer = new OddsAnnouncer({ minGapMs: GAP, maxEvents: 2 })));

  it('stays quiet on the first update: it only learns the prices', () => {
    expect(announcer.update([event(1)], 0)).toBeNull();
  });

  it('reads one sentence per changed event, naming the outcome and both prices', () => {
    announcer.update([event(1)], 0);
    expect(announcer.update([event(1, { home: 2.2, draw: 2.9 })], GAP)).toBe(
      'Odds update. Home 1 vs Away 1: Home 1 to win 2.20, up from 2.00; Draw 2.90, down from 3.00.',
    );
  });

  it('says nothing when nothing changed', () => {
    announcer.update([event(1)], 0);
    expect(announcer.update([event(1)], GAP)).toBeNull();
  });

  it('holds changes back until the gap has passed, then reports them once', () => {
    announcer.update([event(1)], 0);
    expect(announcer.update([event(1, { home: 2.2 })], GAP)).not.toBeNull();
    expect(announcer.update([event(1, { home: 2.4 })], GAP + 1_000)).toBeNull();
    expect(announcer.update([event(1, { home: 2.5 })], GAP * 2)).toContain(
      'Home 1 to win 2.50, up from 2.20',
    );
    expect(announcer.update([event(1, { home: 2.5 })], GAP * 3)).toBeNull();
  });

  it('names a few events and counts the rest', () => {
    const before = [event(1), event(2), event(3), event(4)];
    announcer.update(before, 0);
    const after = before.map((e) => event(e.id, { away: 5 }));
    const text = announcer.update(after, GAP)!;
    expect(text).toContain('Home 1 vs Away 1');
    expect(text).toContain('Home 2 vs Away 2');
    expect(text).not.toContain('Home 3 vs Away 3');
    expect(text).toMatch(/2 more events changed\.$/);
  });

  it('does not read out events that just came into view, or ones that left it', () => {
    announcer.update([event(1)], 0);
    expect(announcer.update([event(2, { home: 9 })], GAP)).toBeNull();
    // Event 1 comes back with a new price: it starts again from that price.
    expect(announcer.update([event(1, { home: 7 })], GAP * 2)).toBeNull();
  });

  it('starts over after a reset', () => {
    announcer.update([event(1)], 0);
    announcer.reset();
    expect(announcer.update([event(1, { home: 5 })], GAP)).toBeNull();
  });
});
