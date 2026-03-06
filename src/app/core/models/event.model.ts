export type OddKey = '1' | '2' | 'x';

export type Odds = Record<OddKey, number>;

export interface SportEvent {
  id: number;
  sport: string;
  category: string;
  name: string;
  odds: Odds;
}

export interface SportItem {
  name: string;
  categories: string[];
}
