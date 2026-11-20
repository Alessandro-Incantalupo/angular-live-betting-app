import { OddsSimulator, clampOdds } from './odds-simulator';
import { SEED_EVENTS } from './seed-events';

const STEP = 1_000;

function simulator(options = {}) {
  return new OddsSimulator(SEED_EVENTS, { stepMs: STEP, seed: 42, ...options });
}

describe('OddsSimulator', () => {
  it('returns the opening prices on the first call', () => {
    expect(simulator().snapshot(0)).toEqual(SEED_EVENTS);
  });

  it('does not move before a full step has passed', () => {
    const sim = simulator({ changeRate: 1 });
    const first = sim.snapshot(0);
    expect(sim.snapshot(STEP - 1)).toEqual(first);
  });

  it('moves some prices once a step has passed', () => {
    const sim = simulator({ changeRate: 1 });
    const first = sim.snapshot(0);
    const next = sim.snapshot(STEP);
    expect(next).not.toEqual(first);
    expect(next.map((e) => e.id)).toEqual(first.map((e) => e.id));
  });

  it('is repeatable: the same seed gives the same market', () => {
    const a = simulator();
    const b = simulator();
    a.snapshot(0);
    b.snapshot(0);
    expect(a.snapshot(STEP * 3)).toEqual(b.snapshot(STEP * 3));
  });

  it('keeps prices valid: two decimals, within bounds, no draw where there was none', () => {
    const sim = simulator({ changeRate: 1, maxMove: 0.5, maxStepsPerCall: 50 });
    sim.snapshot(0);
    const events = sim.snapshot(STEP * 50);
    for (const event of events) {
      const seed = SEED_EVENTS.find((e) => e.id === event.id)!;
      expect(event.odds.draw === null).toBe(seed.odds.draw === null);
      for (const price of [event.odds.home, event.odds.away, event.odds.draw]) {
        if (price === null) continue;
        expect(price).toBeGreaterThanOrEqual(1.01);
        expect(price).toBeLessThanOrEqual(50);
        expect(Math.round(price * 100) / 100).toBe(price);
      }
    }
  });

  it('caps the steps applied after a long pause', () => {
    const capped = simulator({ maxStepsPerCall: 2 });
    const twoSteps = simulator({ maxStepsPerCall: 2 });
    capped.snapshot(0);
    twoSteps.snapshot(0);
    expect(capped.snapshot(STEP * 100)).toEqual(twoSteps.snapshot(STEP * 2));
  });

  it('never hands out its own objects', () => {
    const sim = simulator();
    const snapshot = sim.snapshot(0);
    snapshot[0].odds.home = 999;
    expect(sim.snapshot(0)[0].odds.home).toBe(SEED_EVENTS[0].odds.home);
  });
});

describe('clampOdds', () => {
  it('rounds to two decimals and keeps prices between 1.01 and 50', () => {
    expect(clampOdds(2.3456)).toBe(2.35);
    expect(clampOdds(0.5)).toBe(1.01);
    expect(clampOdds(120)).toBe(50);
  });
});
