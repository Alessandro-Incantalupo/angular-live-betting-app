import {
  setError,
  setLoaded,
  setLoading,
  withCallState,
} from '@angular-architects/ngrx-toolkit';
import { signalStoreFeature } from '@ngrx/signals';

export function withEventsCallState() {
  return signalStoreFeature(withCallState({ collection: 'events' }));
}

export function setEventsLoading() {
  return setLoading('events');
}
export function setEventsLoaded() {
  return setLoaded('events');
}
export function setEventsError(error: string) {
  return setError(error, 'events');
}
