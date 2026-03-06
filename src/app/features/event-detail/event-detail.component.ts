import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventsStore } from '../../core/state/events.store';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class EventDetailComponent {
  private route = inject(ActivatedRoute);
  store = inject(EventsStore);

  // We could fetch a single event from the API,
  // but for this simple app, finding it in the loaded store events is faster and works well with the polling.
  eventId = computed(() => Number(this.route.snapshot.paramMap.get('id')));

  event = computed(() => {
    const id = this.eventId();
    return this.store.events().find((e) => e.id === id);
  });
}
