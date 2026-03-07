import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SlugifyPipe } from '../core/pipes/slugify.pipe';
import { EventsStore } from '../core/state/events.store';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, SlugifyPipe],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
  host: {
    class: 'layout-container',
    style:
      'display: flex; flex-direction: column; height: 100vh; background-color: #f4f7f6;',
    '(click)': 'closeMobileMenu()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutComponent {
  store = inject(EventsStore);

  isMobileMenuOpen = signal(false);

  toggleMobileMenu(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu() {
    if (this.isMobileMenuOpen()) {
      this.isMobileMenuOpen.set(false);
    }
  }
}
