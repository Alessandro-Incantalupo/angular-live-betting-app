import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EventsStore } from '../core/state/events.store';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
  host: {
    class: 'layout-container',
    style:
      'display: flex; flex-direction: column; height: 100vh; background-color: #f4f7f6;',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutComponent {
  store = inject(EventsStore);
}
