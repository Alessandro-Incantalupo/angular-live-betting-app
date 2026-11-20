import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../core/platform/theme';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button type="button" [attr.aria-pressed]="isDark()" (click)="theme.toggle()">
      <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20">
        <path
          d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"
          fill="currentColor"
          [attr.fill-opacity]="isDark() ? 1 : 0"
          stroke="currentColor"
          stroke-width="2"
          stroke-linejoin="round"
        />
      </svg>
      Dark theme
    </button>
  `,
  styles: `
    button {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      min-height: 44px;
      padding: 0 var(--space-3);
      border: 1px solid var(--border-strong);
      border-radius: var(--control-radius);
      background: var(--surface-raised);
      color: var(--text);
      cursor: pointer;
    }
    button:hover {
      background: var(--surface-sunken);
    }
    button[aria-pressed='true'] {
      background: var(--accent-subtle);
      color: var(--on-accent-subtle);
      border-color: var(--accent);
    }
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  protected readonly isDark = computed(() => this.theme.theme() === 'dark');
}
