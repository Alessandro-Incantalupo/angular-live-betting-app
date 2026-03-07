import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from '../../core/constants/routes.constants';
import { SlugifyPipe } from '../../core/pipes/slugify.pipe';
import { EventsStore } from '../../core/state/events.store';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BadgeComponent, SlugifyPipe],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.less'],
  host: {
    class: 'event-detail-container',
    style: 'display: block; max-width: 800px; margin: 0 auto; width: 100%;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EventDetailComponent {
  store = inject(EventsStore);
  APP_ROUTES = APP_ROUTES;

  id = input.required<string>();
  sport = input<string>();
  category = input<string>();

  eventId = computed(() => Number(this.id()));

  event = computed(() => {
    const id = this.eventId();
    return this.store.events().find((e) => e.id === id);
  });

  protected readonly syncRoute = this.store.syncRouteParams(
    computed(() => ({
      sport: this.sport(),
      category: this.category(),
    })),
  );
}
