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
  host: {
    class: 'home-layout'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent {
  store = inject(EventsStore);
}
