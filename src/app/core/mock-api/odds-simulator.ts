import { Odds, SELECTIONS, SportEvent } from '../events/event.model';

export interface SimulatorOptions {
  /** Milliseconds between two market moves. */
  stepMs: number;
  /** Share of events whose prices move on each step, from 0 to 1. */
  changeRate: number;
  /** The largest move of one price in one step, as a fraction (0.08 = 8%). */
  maxMove: number;
  /** Steps applied at most per request, so a tab that slept for an hour doesn't jump wildly. */
  maxStepsPerCall: number;
  /** Seed for the pseudo-random generator: the same seed gives the same market. */
  seed: number;
}

export const DEFAULT_SIMULATOR_OPTIONS: SimulatorOptions = {
  stepMs: 5_000,
  changeRate: 0.3,
  maxMove: 0.08,
  maxStepsPerCall: 6,
  seed: 20_240_601,
};

const MIN_ODDS = 1.01;
const MAX_ODDS = 50;

/**
 * A small market that moves over time. It knows nothing about HTTP: the mock interceptor asks
 * it for a snapshot at a given time, and tests drive it with a fake clock.
 */
export class OddsSimulator {
  private events: SportEvent[];
  private lastStepAt: number | null = null;
  private readonly random: () => number;
  private readonly options: SimulatorOptions;

  constructor(seed: readonly SportEvent[], options: Partial<SimulatorOptions> = {}) {
    this.options = { ...DEFAULT_SIMULATOR_OPTIONS, ...options };
    this.random = mulberry32(this.options.seed);
    this.events = seed.map((event) => ({ ...event, odds: { ...event.odds } }));
  }

  /** The market as it stands at `now`, after applying the steps that elapsed since last call. */
  snapshot(now: number): SportEvent[] {
    if (this.lastStepAt === null) {
      this.lastStepAt = now;
    } else {
      const due = Math.floor((now - this.lastStepAt) / this.options.stepMs);
      const steps = Math.min(due, this.options.maxStepsPerCall);
      for (let i = 0; i < steps; i++) this.step();
      if (due > 0) this.lastStepAt += due * this.options.stepMs;
    }
    return this.events.map((event) => ({ ...event, odds: { ...event.odds } }));
  }

  /** A number from 0 (inclusive) to 1 (exclusive) from the seeded generator. */
  next(): number {
    return this.random();
  }

  private step(): void {
    this.events = this.events.map((event) =>
      this.random() < this.options.changeRate ? { ...event, odds: this.move(event.odds) } : event,
    );
  }

  private move(odds: Odds): Odds {
    const next = { ...odds };
    for (const selection of SELECTIONS) {
      const price = next[selection];
      if (price === null || this.random() < 0.4) continue;
      const factor = 1 + (this.random() * 2 - 1) * this.options.maxMove;
      next[selection] = clampOdds(price * factor);
    }
    return next;
  }
}

export function clampOdds(value: number): number {
  const rounded = Math.round(value * 100) / 100;
  return Math.min(MAX_ODDS, Math.max(MIN_ODDS, rounded));
}

/** A tiny seeded PRNG (public domain), good enough for a demo market. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}
