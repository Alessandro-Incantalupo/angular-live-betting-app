/**
 * Small wrappers around localStorage. Storage can be missing or throw (private windows,
 * blocked site data), and the app must work the same without it.
 */
export function readPreference(storage: Storage | undefined, key: string): string | null {
  try {
    return storage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writePreference(storage: Storage | undefined, key: string, value: string | null) {
  try {
    if (value === null) storage?.removeItem(key);
    else storage?.setItem(key, value);
  } catch {
    // Not saved: the choice still applies until the page is closed.
  }
}
