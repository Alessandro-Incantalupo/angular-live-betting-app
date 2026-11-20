import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OddsAnnouncements } from '../core/a11y/announcements';
import { EventsStore } from '../core/state/events.store';

@Component({
  selector: 'app-live-controls',
  imports: [DatePipe],
  templateUrl: './live-controls.html',
  styleUrl: './live-controls.css',
})
export class LiveControls {
  protected readonly store = inject(EventsStore);
  protected readonly announcements = inject(OddsAnnouncements);

  protected toggleAnnouncements(event: Event): void {
    this.announcements.setEnabled((event.target as HTMLInputElement).checked);
  }
}
