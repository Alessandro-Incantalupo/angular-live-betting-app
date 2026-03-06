import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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

  onSportSelect(sport: string | null) {
    this.store.setSportFilter(sport);
  }

  onCategorySelect(category: string | null) {
    this.store.setCategoryFilter(category);
  }
}
