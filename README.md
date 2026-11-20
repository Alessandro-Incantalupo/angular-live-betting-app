# Live odds: an Angular demo

Sports odds that change every few seconds, built with current Angular: zoneless change detection, signals end to end and an NgRx Signal Store that polls an API. The API is a mock that runs in the browser, so the whole thing deploys as static files.

**Demo:** DEMO_URL (prices are simulated; there are no real events and no bets)

## What it shows

- **A Signal Store as the one source of truth.** `EventsStore` holds the events (`withEntities`), the current view, the live/paused switch, the last price moves and a short price history per event. Pages derive everything else with `computed`: the filtered list, the sport and competition menu with counts, the events currently on screen.
- **Polling that knows when to stop.** One `rxMethod` takes a signal, `live && pageVisible`, and switches between a `timer` that fetches with `exhaustMap` and nothing at all. Pausing, or hiding the tab, stops the requests; coming back fetches at once. A failed refresh keeps the last prices and says so; the first load gets its own error with a retry button.
- **Zoneless Angular.** No zone.js. Signal inputs, `signalMethod` to bind route parameters to the store, the built-in control flow, standalone components and OnPush by default.
- **Live data that stays usable with a screen reader.** Prices move as an arrow you can see and a word you can hear ("2.20, up"). Spoken announcements are opt-in, go through one polite live region, are spaced at least 20 seconds apart, cover only the events on screen and summarise what changed since the last one, so nothing is lost and nothing floods. Updates can be paused (WCAG 2.2.2). Focus moves to the new page heading on navigation, every route sets the page title, and the skip link, the 44 px targets and the focus rings come with the layout.
- **Theming with design tokens.** Colours, spacing and type come from [`@a.incantalupo/design-tokens`](https://github.com/Alessandro-Incantalupo/design-tokens): components read roles such as `--surface`, `--text-muted` and `--accent`. Light and dark switch with `data-theme` on `<html>`; without a saved choice the page follows the system setting.

## Architecture

```
src/app/
├── core/
│   ├── events/      model, EventsApi (the only class that knows the API), odds and slug helpers
│   ├── mock-api/    seed data, OddsSimulator (a seeded random walk), the HTTP interceptor
│   ├── state/       EventsStore and a reusable request-status feature
│   ├── a11y/        OddsAnnouncer (what to say, and when) and the service that feeds the live region
│   └── platform/    page visibility, theme, safe localStorage
├── layout/          live controls, sport menu, theme toggle
├── features/        events list, event detail, not found (lazy routes)
└── shared/          event card, odds value
```

The mock sits behind a narrow seam. `EventsApi` calls `GET {API_BASE_URL}/events`; `mockApiInterceptor` answers anything under that prefix in the browser, with fake latency, from an `OddsSimulator` that moves prices on a clock. To use a real backend, remove the interceptor from `provideHttpClient` in `app.config.ts` and provide `API_BASE_URL`. Nothing else changes.

Add `?flaky` to the address to make a third of the requests fail and see the error states.

## Run it

Node and pnpm versions are pinned in `mise.toml` (`mise install`).

```sh
pnpm install
pnpm start          # http://localhost:4200
pnpm check          # format, lint, typecheck, tests, build, CSP hash
```

Tests run on Vitest through Angular's unit-test builder: the simulator, the interceptor, the store (polling, pause, moves, errors, filters, with fake timers), the announcer and the event card.

## Deploy

`netlify.toml` publishes `dist/live-odds/browser` with a fallback to `index.html` for every route, a Content Security Policy, and year-long caching for the hashed bundles. The one inline script (it applies a saved theme before first paint) is allowed by its hash; `pnpm check:csp` fails if the script and the hash drift apart.

## Licence

MIT © Alessandro Incantalupo
