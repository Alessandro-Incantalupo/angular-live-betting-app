import { DOCUMENT, computed, effect, inject, signal, Service } from '@angular/core';
import { readPreference, writePreference } from './preferences';

export type Theme = 'light' | 'dark';

/** Kept in sync with the inline script in index.html, which applies it before first paint. */
const STORAGE_KEY = 'theme';

/**
 * Light or dark, through `data-theme` on <html>. With no saved choice, the page follows the
 * system setting and the attribute stays off, so the tokens' own media query applies.
 */
@Service()
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = this.document.defaultView?.localStorage;
  private readonly systemDark = signal(false);

  /** The reader's explicit choice, or `null` to follow the system. */
  readonly choice = signal<Theme | null>(parseTheme(readPreference(this.storage, STORAGE_KEY)));
  readonly theme = computed<Theme>(() => this.choice() ?? (this.systemDark() ? 'dark' : 'light'));

  constructor() {
    const query = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    if (query) {
      this.systemDark.set(query.matches);
      query.addEventListener('change', (e) => this.systemDark.set(e.matches));
    }
    effect(() => {
      const choice = this.choice();
      const root = this.document.documentElement;
      if (choice) root.setAttribute('data-theme', choice);
      else root.removeAttribute('data-theme');
    });
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.choice.set(next);
    writePreference(this.storage, STORAGE_KEY, next);
  }
}

function parseTheme(value: string | null): Theme | null {
  return value === 'light' || value === 'dark' ? value : null;
}
