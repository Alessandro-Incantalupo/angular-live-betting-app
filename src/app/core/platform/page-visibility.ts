import { DOCUMENT, DestroyRef, Signal, inject, signal } from '@angular/core';

/** `true` while the tab is visible. Call it in an injection context. */
export function injectPageVisible(): Signal<boolean> {
  const document = inject(DOCUMENT);
  const visible = signal(document.visibilityState !== 'hidden');
  const update = () => visible.set(document.visibilityState !== 'hidden');
  document.addEventListener('visibilitychange', update);
  inject(DestroyRef).onDestroy(() => document.removeEventListener('visibilitychange', update));
  return visible.asReadonly();
}
