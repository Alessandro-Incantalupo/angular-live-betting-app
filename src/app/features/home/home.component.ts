import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { EventsStore } from '../../core/state/events.store';
import { EventCardComponent } from '../../shared/components/event-card/event-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, EventCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
  host: {
    class: 'home-layout',
    style: 'display: flex; flex: 1; min-height: 0; width: 100%;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  store = inject(EventsStore);

  sport = input<string>();
  category = input<string>();

  protected readonly syncRoute = this.store.syncRouteParams(
    computed(() => ({
      sport: this.sport(),
      category: this.category(),
    })),
  );
}
