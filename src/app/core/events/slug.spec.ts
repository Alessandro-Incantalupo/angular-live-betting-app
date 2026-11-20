import { slugify } from './slug';

describe('slugify', () => {
  it('makes readable URL segments', () => {
    expect(slugify('Serie A')).toBe('serie-a');
    expect(slugify('Atlético Madrid')).toBe('atletico-madrid');
    expect(slugify('Paris Saint-Germain')).toBe('paris-saint-germain');
  });
});
