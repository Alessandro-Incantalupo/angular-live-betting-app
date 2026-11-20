import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

/**
 * - `idle`: nothing asked yet
 * - `loading`: the first request is on its way (later polls don't go back to `loading`)
 * - `loaded`: the last request succeeded
 * - `{ error }`: the last request failed; data from earlier requests is kept
 */
export type RequestStatus = 'idle' | 'loading' | 'loaded' | { error: string };

/** A reusable store feature: one request status and the flags templates read. */
export function withRequestStatus() {
  return signalStoreFeature(
    withState<{ requestStatus: RequestStatus }>({ requestStatus: 'idle' }),
    withComputed(({ requestStatus }) => ({
      isLoading: computed(() => requestStatus() === 'loading'),
      error: computed(() => {
        const status = requestStatus();
        return typeof status === 'object' ? status.error : null;
      }),
    })),
  );
}

export const setLoading = () => ({ requestStatus: 'loading' as RequestStatus });
export const setLoaded = () => ({ requestStatus: 'loaded' as RequestStatus });
export const setError = (error: string) => ({ requestStatus: { error } as RequestStatus });
