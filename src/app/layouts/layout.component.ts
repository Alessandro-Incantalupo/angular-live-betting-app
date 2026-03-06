import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { EventsStore } from '../core/state/events.store';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
  host: {
    class: 'layout-container',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutComponent {
  store = inject(EventsStore);
  private router = inject(Router);

  onSportSelect(sport: string | null) {
    this.store.setSportFilter(sport);
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }

  onCategorySelect(category: string | null) {
    this.store.setCategoryFilter(category);
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }
}
