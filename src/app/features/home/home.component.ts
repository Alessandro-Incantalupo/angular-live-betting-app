import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
    class: 'home-layout'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  store = inject(EventsStore);
}
