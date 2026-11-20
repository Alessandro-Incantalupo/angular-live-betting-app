import { Odds, SELECTIONS, Selection } from './event.model';

export type Move = 'up' | 'down';
/** How each outcome moved since the previous snapshot. Missing key: no change. */
export type OddsMoves = Partial<Record<Selection, Move>>;

export function diffOdds(previous: Odds, next: Odds): OddsMoves {
  const moves: OddsMoves = {};
  for (const selection of SELECTIONS) {
    const before = previous[selection];
    const after = next[selection];
    if (before === null || after === null || before === after) continue;
    moves[selection] = after > before ? 'up' : 'down';
  }
  return moves;
}

export function hasMoves(moves: OddsMoves | undefined): boolean {
  return !!moves && Object.keys(moves).length > 0;
}

/** Odds always show two decimals: 2.10, not 2.1. */
export function formatOdds(value: number): string {
  return value.toFixed(2);
}
