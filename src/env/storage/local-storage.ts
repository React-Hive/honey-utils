/**
 * Determines whether the browser environment allows safe read access to
 * `localStorage`. Some platforms (e.g., Safari Private Mode, sandboxed iframes)
 * expose `localStorage` but still throw when accessed.
 *
 * This function **only tests read access**, making it safe even when write
 * operations would fail due to `QuotaExceededError` or storage restrictions.
 *
 * @returns `true` if `localStorage` exists and calling `getItem()` does not
 *          throw; otherwise `false`.
 */
export const isLocalStorageReadable = (): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.getItem('__non_existing_key__');
    return true;
  } catch {
    return false;
  }
};

interface LocalStorageCapabilities {
  readable: boolean;
  writable: boolean;
}

interface LocalStorageCapabilities {
  readable: boolean;
  writable: boolean;
}

/**
 * Determines whether the browser's `localStorage` supports safe read and write operations.
 * This function performs two independent checks:
 *
 * **1. Readability**
 * - Verified by calling `localStorage.getItem()` inside a `try` block.
 * - Fails in environments where storage access throws immediately (e.g., disabled storage,
 *   sandboxed iframes, strict privacy modes, SSR).
 *
 * **2. Writeability**
 * - Verified by attempting to `setItem()` and then `removeItem()` using a temporary key.
 * - Can fail due to:
 *   - `QuotaExceededError` when storage is full.
 *   - Disabled write access (e.g., Safari Private Mode).
 *   - Security-restricted contexts (third-party frames, hardened privacy settings)
 *
 * @returns An object describing the detected `localStorage` capabilities.
 */
export const getLocalStorageCapabilities = (): LocalStorageCapabilities => {
  const readable = isLocalStorageReadable();
  if (!readable) {
    return {
      readable: false,
      writable: false,
    };
  }

  try {
    const key = '__test_write__';

    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);

    return {
      readable: true,
      writable: true,
    };
  } catch {
    // Readable but not writable (QuotaExceededError, private mode, security restrictions)
  }

  return {
    readable: true,
    writable: false,
  };
};
