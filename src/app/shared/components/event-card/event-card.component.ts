import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import { SportEvent } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
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
      // Prevent default scrolling down when hitting spacebar
      event.preventDefault();
    }
    this.router.navigate(['/event', this.event().id]);
  }
}
