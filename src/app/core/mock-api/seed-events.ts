import { SportEvent } from '../events/event.model';

/** Opening odds for the demo. Sports that can't end level have no draw price. */
export const SEED_EVENTS: readonly SportEvent[] = [
  football(1, 'Premier League', 'Manchester United', 'Manchester City', [3.6, 3.8, 1.95]),
  football(2, 'Premier League', 'Arsenal', 'Liverpool', [2.45, 3.4, 2.8]),
  football(3, 'La Liga', 'Real Madrid', 'Barcelona', [2.2, 3.7, 3.1]),
  football(4, 'La Liga', 'Atlético Madrid', 'Sevilla', [1.75, 3.5, 4.8]),
  football(5, 'Bundesliga', 'Bayern Munich', 'Borussia Dortmund', [1.6, 4.4, 4.9]),
  football(6, 'Bundesliga', 'RB Leipzig', 'Bayer Leverkusen', [2.7, 3.5, 2.5]),
  football(7, 'Serie A', 'Inter', 'Juventus', [2.05, 3.3, 3.75]),
  football(8, 'Serie A', 'AC Milan', 'Napoli', [2.6, 3.25, 2.75]),
  football(9, 'Serie A', 'Roma', 'Lazio', [2.4, 3.2, 3.0]),
  football(10, 'Ligue 1', 'Paris Saint-Germain', 'Marseille', [1.45, 4.75, 6.5]),
  football(11, 'Eredivisie', 'Ajax', 'PSV Eindhoven', [2.9, 3.6, 2.3]),
  noDraw(12, 'Basketball', 'NBA', 'Golden State Warriors', 'Los Angeles Lakers', [1.85, 1.95]),
  noDraw(13, 'Basketball', 'NBA', 'Boston Celtics', 'Philadelphia 76ers', [1.55, 2.45]),
  noDraw(14, 'Basketball', 'EuroLeague', 'Olympiacos', 'Panathinaikos', [1.9, 1.9]),
  noDraw(15, 'Basketball', 'EuroLeague', 'Anadolu Efes', 'Real Madrid', [2.1, 1.72]),
  noDraw(16, 'Basketball', 'NCAA', 'Duke', 'North Carolina', [1.65, 2.25]),
  noDraw(17, 'Basketball', 'WNBA', 'Seattle Storm', 'Las Vegas Aces', [2.35, 1.6]),
  noDraw(18, 'Tennis', 'Davis Cup', 'Italy', 'Spain', [1.8, 2.0]),
  noDraw(19, 'Tennis', 'Davis Cup', 'Australia', 'United States', [2.2, 1.68]),
  noDraw(20, 'Tennis', 'United Cup', 'Germany', 'France', [1.95, 1.85]),
  withDraw(21, 'Cricket', 'Test Match', 'Australia', 'England', [2.1, 3.9, 3.2]),
  noDraw(22, 'Cricket', 'ODI', 'India', 'Pakistan', [1.5, 2.6]),
  noDraw(23, 'Cricket', 'Twenty20', 'South Africa', 'New Zealand', [1.95, 1.87]),
  withDraw(24, 'Golf', 'Ryder Cup', 'Europe', 'United States', [2.0, 13.0, 2.1]),
];

type ThreeWay = [home: number, draw: number, away: number];

function withDraw(
  id: number,
  sport: string,
  category: string,
  home: string,
  away: string,
  [h, d, a]: ThreeWay,
): SportEvent {
  return { id, sport, category, home, away, odds: { home: h, draw: d, away: a } };
}

function football(id: number, category: string, home: string, away: string, odds: ThreeWay) {
  return withDraw(id, 'Football', category, home, away, odds);
}

function noDraw(
  id: number,
  sport: string,
  category: string,
  home: string,
  away: string,
  [h, a]: [home: number, away: number],
): SportEvent {
  return { id, sport, category, home, away, odds: { home: h, draw: null, away: a } };
}
