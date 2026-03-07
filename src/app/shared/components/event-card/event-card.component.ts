import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../../../core/constants/routes.constants';
import { SportEvent } from '../../../core/models/event.model';
import { slugify } from '../../../core/utils/string.utils';
import { BadgeComponent } from '../badge/badge.component';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.less'],
  host: {
    class: 'event-card',
    role: 'button',
    tabindex: '0',
    '(click)': 'onCardClick()',
    '(keydown.enter)': 'onCardClick()',
    '(keydown.space)': 'onCardClick($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
  event = input.required<SportEvent>();

  private router = inject(Router);

  onCardClick(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    const evt = this.event();
    this.router.navigate([
      '/' + APP_ROUTES.BETS,
      slugify(evt.sport),
      slugify(evt.category),
      evt.id,
    ]);
  }
}
