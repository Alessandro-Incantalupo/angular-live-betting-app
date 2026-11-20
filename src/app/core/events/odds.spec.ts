import { diffOdds, formatOdds, hasMoves } from './odds';

describe('diffOdds', () => {
  it('reports which outcomes went up or down', () => {
    const moves = diffOdds({ home: 2, draw: 3.4, away: 3 }, { home: 2.1, draw: 3.4, away: 2.9 });
    expect(moves).toEqual({ home: 'up', away: 'down' });
  });

  it('ignores the draw when a sport has none', () => {
    expect(diffOdds({ home: 2, draw: null, away: 2 }, { home: 2, draw: null, away: 2 })).toEqual(
      {},
    );
  });
});

describe('hasMoves', () => {
  it('is false for no entry or an empty one', () => {
    expect(hasMoves(undefined)).toBe(false);
    expect(hasMoves({})).toBe(false);
    expect(hasMoves({ draw: 'up' })).toBe(true);
  });
});

describe('formatOdds', () => {
  it('always shows two decimals', () => {
    expect(formatOdds(2.1)).toBe('2.10');
    expect(formatOdds(13)).toBe('13.00');
  });
});
