export interface EventOdds {
  '1': number;
  x: number;
  '2': number;
}

export interface BettingEvent {
  id: number;
  sport: string;
  category: string;
  name: string;
  odds: EventOdds;
}
