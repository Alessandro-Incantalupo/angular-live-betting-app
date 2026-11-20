import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

export type CallState = 'init' | 'loading' | 'loaded' | { error: string };

export function withEventsCallState() {
  return signalStoreFeature(
    withState<{ eventsCallState: CallState }>({ eventsCallState: 'init' }),
    withComputed(({ eventsCallState }) => ({
      eventsLoading: computed(() => eventsCallState() === 'loading'),
      eventsLoaded: computed(() => eventsCallState() === 'loaded'),
      eventsError: computed(() => {
        const state = eventsCallState();
        return typeof state === 'object' ? state.error : null;
      }),
    })),
  );
}

export function setEventsLoading() {
  return { eventsCallState: 'loading' as CallState };
}
export function setEventsLoaded() {
  return { eventsCallState: 'loaded' as CallState };
}
export function setEventsError(error: string) {
  return { eventsCallState: { error } as CallState };
}
