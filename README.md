# Angular Betting App – Skills Showcase

> A proof-of-concept sports betting application built to demonstrate Angular expertise. Every architectural decision is deliberate — from NgRx Signal Store composition, to live polling, to full accessibility on dynamic odds data.

## Why I Built It

Most Angular demos pick one state management paradigm and stop there. This one runs NgRx Signal Store and classic NgRx Effects side-by-side in the same application, and explains exactly why: the Signal Store owns local UI state, while a classic `timer`-driven Effect handles polling — a cross-cutting concern that has no clean home inside the signal graph. The domain (sports betting) is intentionally simple. The point is the engineering discipline beneath it: `OnPush` everywhere, reusable custom SignalStore features, `withComponentInputBinding` to keep components clean, and full ARIA semantics on live-updating odds data.

---

## Tech Stack

| Layer | Technology | Decision |
|---|---|---|
| Framework | Angular 17+ (standalone components) | No NgModules — fully standalone component architecture |
| Primary state | NgRx Signal Store | Signals-first, declarative, composable via custom features |
| Secondary state | NgRx Classic (Store / Effects / Selectors) | Retained for `timer`-based polling — a cross-cutting concern that belongs outside the signal graph |
| Reactivity bridge | Angular Signals, RxJS, `rxMethod` | Bridges RxJS streams into the signal store without leaking Observables into components |
| Styling | LESS with design tokens via variables | Variables-based theming, no utility-class sprawl |
| Mock Server | Koa.js (Node) | Zero-framework overhead for a pure API mock |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start Angular dev server (port 4200) + Koa mock server (port 3000) in parallel
npm run dev
```

### Mock Server Endpoints

| Endpoint | Description |
|---|---|
| `GET http://localhost:3000/events` | All sporting events |
| `GET http://localhost:3000/event/:id` | Single event by ID |

---

## Screenshot

<!-- Add screenshot or GIF here: npm run dev, navigate to localhost:4200, capture events list with odds -->
![Events list with live odds updating every 15 seconds](./docs/screenshot.png)

---

## Key Technical Highlights

### NgRx Signal Store with Custom Feature

The application state is managed with **NgRx Signal Store** (`@ngrx/signals`), the modern signals-based successor to the classic NgRx store. The store composes multiple declarative features:

```ts
export const EventsStore = signalStore(
  { providedIn: 'root' },
  withDevtools('EventsStore'),   // Redux DevTools integration
  withState(initialState),
  withEventsCallState(),         // custom reusable call-state feature
  withComputed(/* derived signals */),
  withMethods(/* reactive methods via rxMethod */)
);
```

A custom **SignalStore Feature** (`withEventsCallState`) encapsulates loading/error/loaded states using `@angular-architects/ngrx-toolkit`, making the pattern fully reusable across stores.

---

### Real-Time Polling (NgRx Effects)

Live odds update automatically every **15 seconds** via a dedicated NgRx Effect using `timer`:

```ts
pollEvents$ = createEffect(() =>
  timer(15000, 15000).pipe(
    map(() => EventsActions.loadEvents())
  )
);
```

The classic NgRx slice (`actions / reducer / effects / selectors`) runs in parallel with the Signal Store, demonstrating familiarity with both paradigms.

---

### Routing with `withComponentInputBinding` & Route-Derived State

Router is configured with `withComponentInputBinding()`, enabling Angular to **bind route params directly to component `@Input()` signals** — no `ActivatedRoute` injection needed:

```ts
// app.config.ts
provideRouter(routes, withComponentInputBinding())

// home.component.ts
sport    = input<string>();    // bound from :sport route param
category = input<string>();   // bound from :category route param
```

Route params are synced into the Signal Store via `rxMethod`, which drives computed filtered state:

```ts
filteredEvents: computed(() => {
  // derives filtered list from sport + category slugs
}),
availableSports:     computed(() => { ... }),
availableCategories: computed(() => { ... }),
```

---

### Accessibility (a11y)

ARIA semantics applied throughout every interactive component:

```html
<!-- event-card.component.html -->
<div class="tags" role="group" aria-label="Event Categories">...</div>

<div class="odds-row" role="group" aria-label="Betting Odds">
  <div role="group" [attr.aria-label]="'Home win at ' + event().odds['1']">
    <span aria-hidden="true">1</span>
    <strong aria-hidden="true">{{ event().odds['1'] | number:'1.2-2' }}</strong>
  </div>
</div>
```

- Semantic HTML with correct landmark and heading hierarchy
- `role` and `aria-label` on all interactive odds buttons
- `aria-hidden` on decorative text to avoid screen reader noise
- Screen readers announce full context ("Home win at 2.40") instead of bare numbers

---

### State-of-the-Art Folder Structure

```
src/app/
├── core/                          # Singleton, app-wide concerns
│   ├── constants/                 # Route constants
│   ├── models/                    # TypeScript interfaces (SportEvent)
│   ├── pipes/                     # SlugifyPipe
│   ├── services/                  # EventsService (HTTP)
│   ├── state/
│   │   ├── events.store.ts        # NgRx Signal Store (primary)
│   │   ├── classic/               # NgRx classic (actions/reducer/effects/selectors)
│   │   └── features/              # Reusable SignalStore features
│   └── utils/                     # Pure utility functions
│
├── features/                      # Lazy-loaded page components
│   ├── home/
│   └── event-detail/
│
├── layouts/                       # Shell / chrome components
└── shared/                        # Dumb/presentational components & pipes
    └── components/
        ├── badge/
        └── event-card/
```

---

### Performance

- **`ChangeDetectionStrategy.OnPush`** on every component — zero wasted checks
- **Lazy-loaded routes** via `loadComponent` for every page — minimal initial bundle
- **Memoized computed signals** in the Signal Store — recompute only on relevant state changes
- **`@for … track`** for efficient DOM diffing in lists

---

## What This Demonstrates

| Skill | Where |
|---|---|
| NgRx Signal Store with custom reusable feature | `src/core/state/events.store.ts`, `features/withEventsCallState.ts` |
| Classic NgRx slice (actions/reducer/effects/selectors) running alongside Signal Store | `src/core/state/classic/` |
| `rxMethod` — RxJS-to-signals bridge | `withMethods()` in the store |
| `withComponentInputBinding` — route params as typed `@Input()` signals | `app.config.ts`, `home.component.ts` |
| `ChangeDetectionStrategy.OnPush` on every component | All components |
| Lazy-loaded routes via `loadComponent` | `app.routes.ts` |
| Full ARIA semantics on live-updating odds data | `event-card.component.html` |
| Standalone components — zero NgModules | All components |
| `inject()` function — no constructor injection | All services and stores |
| Custom SignalStore feature composition | `withEventsCallState` |
| Feature-based folder structure (`core/`, `features/`, `shared/`) | `src/app/` |
