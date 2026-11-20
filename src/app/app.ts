import { DOCUMENT, Component, Injector, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';
import { OddsAnnouncements } from './core/a11y/announcements';
import { LiveControls } from './layout/live-controls';
import { SportNav } from './layout/sport-nav';
import { ThemeToggle } from './layout/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, LiveControls, SportNav, ThemeToggle],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly announcements = inject(OddsAnnouncements);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);

  constructor() {
    // A route change in a single-page app doesn't move focus. Put it on the new page's heading,
    // so keyboard and screen reader users start from the top of what changed.
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        skip(1),
        takeUntilDestroyed(),
      )
      .subscribe(() =>
        afterNextRender({ read: () => this.focusHeading() }, { injector: this.injector }),
      );
  }

  /** The skip link focuses <main> without changing the address (the base href would). */
  protected skipToMain(event: Event): void {
    event.preventDefault();
    this.document.getElementById('main')?.focus();
  }

  private focusHeading(): void {
    const heading = this.document.querySelector<HTMLElement>('main h1');
    heading?.focus({ preventScroll: true });
  }
}
