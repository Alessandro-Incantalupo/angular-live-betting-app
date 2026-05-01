# Angular Betting App – Architecture Showcase

> A proof-of-concept sports betting interface built to demonstrate modern Angular architectural patterns. The domain is simple by design — the point is the engineering discipline beneath it.

---

## Demo

![Live odds updating every few seconds: events list, filtering by sport and category, real-time polling](./docs/demo.gif)

---

## What This Showcases

### Signal Store as the single entry point
`EventsStore` (provided in root) is the one authoritative source of truth for the entire application. Components inject the store directly — no services leaking state, no local component state for shared data. All mutations go through typed store methods with named state transitions visible in the devtools.

### Developer tooling built in
The store is wired to Redux DevTools via `withDevtools('EventsStore')` from `@angular-architects/ngrx-toolkit`. Every state mutation carries a semantic label (`'Events: Load Success'`, `'Events: Polled Success'`, `'Filter: Sync Routes'`), making the state timeline readable without digging into code.

### Route-based state management
Route parameters (`sport`, `category`) flow directly into the store via `withComponentInputBinding` + a reactive `rxMethod`. The `HomeComponent` declares `sport` and `category` as typed `input()` signals, then feeds them to `store.syncRouteParams()` in a single `computed()`. No manual `ActivatedRoute` subscriptions — the router owns navigation, the store owns selection state.

### Live polling via `rxMethod`
`loadEvents()` is an `rxMethod<void>` that fetches from the mock API and merges the response into the signal graph. A `setInterval` in `withHooks.onInit` drives it on a fixed cadence. The store distinguishes first-load from subsequent polls (`'Events: Load Success'` vs `'Events: Polled Success'`) so the UI can differentiate loading and background-refresh states.

### Computed signal graph for derived state
`filteredEvents`, `availableSports`, and `availableCategories` are all `computed()` signals on the store — derived from `events`, `selectedSport`, and `selectedCategory`. No selectors, no memoization boilerplate. The card list re-renders only when the filtered slice actually changes.

### Domain-driven folder structure

```
src/app/
├── core/
│   ├── constants/      # Route constants, app-wide values
│   ├── models/         # Domain types (SportEvent, etc.)
│   ├── pipes/          # Pure transform pipes
│   ├── services/       # HTTP layer — no state, no side effects
│   ├── state/
│   │   ├── events.store.ts            # Single Signal Store
│   │   └── features/
│   │       └── withEventsCallState.ts # Reusable loading-state feature
│   └── utils/          # Pure functions (slugify, etc.)
├── features/
│   ├── home/           # Events list + filter — parent container
│   └── event-detail/   # Single event view — routed child
├── layouts/            # Shell layout component
└── shared/
    └── components/     # Dumb presentational components (event-card, badge)
```

### Clear parent → child component boundaries
`HomeComponent` is the smart container: it injects the store and owns no local state. `EventCardComponent` and `BadgeComponent` are fully dumb — they receive data through `input()` signals, emit events upward, and have no knowledge of the store. The boundary is strict and visible in the folder structure.

### `ChangeDetectionStrategy.OnPush` everywhere
Every component in the tree runs `OnPush`. Combined with the signal-based store, Angular's scheduler only re-evaluates the components that actually consume changed signals. No zone-triggered full-tree checks.

### Accessibility on live-updating content
The odds grid uses `aria-live` regions and semantic roles so screen readers announce updates when polling refreshes the data — not just on user interaction. ARIA semantics are applied at the component level (`event-card.component.html`) rather than as an afterthought.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 17+ — standalone components, no NgModules |
| State | NgRx Signal Store + `@angular-architects/ngrx-toolkit` |
| Reactivity | Angular Signals, `rxMethod` (RxJS-to-signals bridge) |
| Routing | `withComponentInputBinding` — route params as typed `input()` signals |
| Styling | LESS with design tokens |
| Mock API | Koa.js (Node) |

---

## Getting Started

```bash
npm install
npm run dev
```

Frontend: `http://localhost:4200` | Mock API: `http://localhost:3000`

---

## Skills Reference

| Pattern | Location |
|---|---|
| Signal Store as single state entry point | `src/app/core/state/events.store.ts` |
| Redux DevTools integration with semantic labels | `withDevtools('EventsStore')` in the store |
| Route params → store sync via `rxMethod` | `syncRouteParams` + `home.component.ts` |
| Live polling with first-load vs. poll distinction | `loadEvents` + `withHooks.onInit` |
| Computed signal graph (filtering, sport/category lists) | `withComputed()` in the store |
| Reusable custom SignalStore feature | `src/app/core/state/features/withEventsCallState.ts` |
| Domain-driven folder structure | `core/` / `features/` / `shared/` |
| Smart container → dumb child boundary | `home.component.ts` → `event-card.component.ts` |
| `ChangeDetectionStrategy.OnPush` on every component | All components |
| Lazy-loaded routes via `loadComponent` | `src/app/app.routes.ts` |
| `aria-live` on polled content | `event-card.component.html` |
| `inject()` — no constructor injection | All stores and services |
