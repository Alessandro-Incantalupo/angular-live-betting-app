import { Odds, SELECTIONS, SportEvent, eventName, selectionLabel } from '../events/event.model';
import { formatOdds } from '../events/odds';

export interface AnnouncerOptions {
  /** The shortest gap between two announcements, in milliseconds. */
  minGapMs: number;
  /** Events named in one announcement; the rest are counted. */
  maxEvents: number;
}

export const DEFAULT_ANNOUNCER_OPTIONS: AnnouncerOptions = { minGapMs: 20_000, maxEvents: 2 };

/**
 * Turns a stream of odds updates into short, spaced-out sentences for a polite live region.
 *
 * It compares what is on screen with what it last announced, not with the previous poll, so
 * changes held back by the gap are still reported, once, in the next sentence. Events that come
 * into view (a new filter, a new page) start from their current price without being read out.
 */
export class OddsAnnouncer {
  private baseline = new Map<number, Odds>();
  private lastSpokenAt = Number.NEGATIVE_INFINITY;
  private readonly options: AnnouncerOptions;

  constructor(options: Partial<AnnouncerOptions> = {}) {
    this.options = { ...DEFAULT_ANNOUNCER_OPTIONS, ...options };
  }

  /** Forget everything: the next update only sets the baseline. */
  reset(): void {
    this.baseline.clear();
    this.lastSpokenAt = Number.NEGATIVE_INFINITY;
  }

  /** The sentence to announce for these visible events at `now`, or `null` to stay quiet. */
  update(visible: readonly SportEvent[], now: number): string | null {
    // Keep only what is on screen; anything new starts from its current price.
    this.baseline = new Map(visible.map((e) => [e.id, this.baseline.get(e.id) ?? e.odds]));
    if (now - this.lastSpokenAt < this.options.minGapMs) return null;

    const changed = visible.filter((e) => oddsDiffer(this.baseline.get(e.id)!, e.odds));
    if (changed.length === 0) return null;

    const parts = changed
      .slice(0, this.options.maxEvents)
      .map((event) => describeEvent(event, this.baseline.get(event.id)!));
    const others = changed.length - parts.length;
    if (others > 0) parts.push(`${others} more ${others === 1 ? 'event' : 'events'} changed.`);

    for (const event of changed) this.baseline.set(event.id, event.odds);
    this.lastSpokenAt = now;
    return `Odds update. ${parts.join(' ')}`;
  }
}

function oddsDiffer(a: Odds, b: Odds): boolean {
  return SELECTIONS.some((s) => a[s] !== b[s]);
}

/** "Inter vs Juventus: Inter to win 2.10, up from 2.05; Draw 3.20, down from 3.30." */
export function describeEvent(event: SportEvent, before: Odds): string {
  const moves = SELECTIONS.flatMap((selection) => {
    const from = before[selection];
    const to = event.odds[selection];
    if (from === null || to === null || from === to) return [];
    const direction = to > from ? 'up' : 'down';
    return [
      `${selectionLabel(event, selection)} ${formatOdds(to)}, ${direction} from ${formatOdds(from)}`,
    ];
  });
  return `${eventName(event)}: ${moves.join('; ')}.`;
}
