import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../core/platform/theme';

/**
 * An icon button: a moon offers the dark theme, a sun brings the light one back. The name stays
 * "Dark theme" and `aria-pressed` says whether it is on, so a screen reader hears one switch.
 */
@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      type="button"
      aria-label="Dark theme"
      [attr.aria-pressed]="isDark()"
      (click)="theme.toggle()"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        @if (isDark()) {
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"
          />
        } @else {
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        }
      </svg>
    </button>
  `,
  styles: `
    :host {
      display: block;
    }
    button {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      padding: 0;
      border: 0;
      border-radius: var(--control-radius);
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
    }
    button:hover {
      background: var(--surface-raised);
      color: var(--text);
    }
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  protected readonly isDark = computed(() => this.theme.theme() === 'dark');
}
