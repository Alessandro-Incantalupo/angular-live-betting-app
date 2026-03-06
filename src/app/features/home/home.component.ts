import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventsStore } from '../../core/state/events.store';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  store = inject(EventsStore);

  onSportSelect(sport: string | null) {
    this.store.setSportFilter(sport);
  }

  onCategorySelect(category: string | null) {
    this.store.setCategoryFilter(category);
  }
}
