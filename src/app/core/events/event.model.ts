/** One of the outcomes of a match: the home side wins, a draw, or the away side wins. */
export type Selection = 'home' | 'draw' | 'away';

/** Decimal odds per outcome. `draw` is `null` for sports where a match can't end level. */
export interface Odds {
  home: number;
  draw: number | null;
  away: number;
}

export interface SportEvent {
  id: number;
  sport: string;
  category: string;
  home: string;
  away: string;
  odds: Odds;
}

/** What `GET /events` returns. */
export interface EventsResponse {
  events: SportEvent[];
  /** When the server produced this snapshot (ISO 8601). */
  updatedAt: string;
}

export const SELECTIONS: readonly Selection[] = ['home', 'draw', 'away'];

export function eventName(event: Pick<SportEvent, 'home' | 'away'>): string {
  return `${event.home} vs ${event.away}`;
}

/** The label a reader hears or sees for one outcome, for example "Real Madrid to win". */
export function selectionLabel(event: Pick<SportEvent, 'home' | 'away'>, selection: Selection) {
  switch (selection) {
    case 'home':
      return `${event.home} to win`;
    case 'away':
      return `${event.away} to win`;
    case 'draw':
      return 'Draw';
  }
}

/** The short betting notation: 1, X, 2. */
export const SELECTION_CODE: Record<Selection, string> = { home: '1', draw: 'X', away: '2' };
