import { DOCUMENT, effect, inject, signal, untracked, Service } from '@angular/core';
import { EventsStore } from '../state/events.store';
import { readPreference, writePreference } from '../platform/preferences';
import { OddsAnnouncer } from './odds-announcer';

const STORAGE_KEY = 'announce-odds';

/**
 * Reads odds changes to screen readers, if the reader opts in. Off by default: a page that
 * talks every few seconds is hard to use. When on, it speaks at most every 20 seconds, only
 * about the events on screen, and through a polite live region, so it never interrupts.
 */
@Service()
export class OddsAnnouncements {
  private readonly store = inject(EventsStore);
  private readonly storage = inject(DOCUMENT).defaultView?.localStorage;
  private readonly announcer = new OddsAnnouncer();

  readonly enabled = signal(readPreference(this.storage, STORAGE_KEY) === 'on');
  /** The text of the live region. */
  readonly message = signal('');

  constructor() {
    effect(() => {
      const enabled = this.enabled();
      const visible = this.store.visibleEvents();
      untracked(() => {
        if (!enabled) {
          this.announcer.reset();
          this.message.set('');
          return;
        }
        const text = this.announcer.update(visible, Date.now());
        if (text) this.message.set(text);
      });
    });
  }

  setEnabled(enabled: boolean): void {
    this.enabled.set(enabled);
    writePreference(this.storage, STORAGE_KEY, enabled ? 'on' : null);
  }
}
