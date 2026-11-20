# AGENTS.md

Angular 22 demo: live odds, zoneless, NgRx Signal Store, an in-browser mock API, static deploy on Netlify. See README.md for the architecture.

## Rules

- Zoneless and signals: no zone.js, no `ChangeDetectorRef`, no manual subscriptions in components. Inputs are `input()`, state lives in `EventsStore`, derived values are `computed`.
- `EventsApi` is the only code that knows the API's shape. The mock (`core/mock-api`) must stay removable: nothing outside `app.config.ts` imports it except its own tests.
- Styles use the design-token roles (`--surface`, `--text`, `--accent`...), never palette values or hex colours. Targets are at least 44 px; colour is never the only signal.
- Live updates must not talk over the reader: announcements go through `OddsAnnouncements` only, polite and spaced out. Don't add `aria-live` to anything that changes on every poll.
- If you change the inline script in `src/index.html`, run `pnpm build && pnpm check:csp --print` and update the hash in `netlify.toml`.

## Before you call a change done

```sh
pnpm check
```
