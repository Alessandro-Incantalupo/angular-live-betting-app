# Betting Hiring – Angular Technical Showcase

> A production-ready Angular application built on top of a hiring exercise skeleton, demonstrating modern frontend engineering practices.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 17+ (standalone components) |
| State Management | NgRx Signal Store + NgRx Classic (Store / Effects / Selectors) |
| Reactivity | Angular Signals, RxJS, `rxMethod` |
| Styling | LESS with design tokens via variables |
| Mock Server | Koa.js (Node) |

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

### Modern Angular Patterns

| Pattern | Where |
|---|---|
| Standalone components | All components — no NgModules |
| `inject()` function | All services/stores injected without constructor |
| `input()` / `computed()` signals | Components and store |
| `rxMethod` | Bridging RxJS streams into the Signal Store |
| Functional route config | `app.routes.ts` — no routing modules |
| `withComponentInputBinding` | Route params as typed `@Input()` signals |
| Custom SignalStore feature | `withEventsCallState` |

---

## Project Origin

This application was built on top of a hiring exercise skeleton for a sports betting platform. The task required routing, NgRx state, RxJS data streams, component architecture, LESS styling, and optional polling. Every requirement was implemented and extended with production-grade patterns.
