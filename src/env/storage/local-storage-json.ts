import type { Nullable } from '~/types';
import { parseJson } from '~/json';

/**
 * Reads the value stored as JSON under a key in `localStorage`.
 *
 * Never throws: storage that cannot be read at all (SSR, disabled storage, sandboxed iframes, strict
 * privacy modes) reads as nothing stored, as does a value that is not JSON.
 *
 * The value is only cast to `Value`, not checked against it - something stored by an older version
 * of the app, or by hand, can be of any shape, so check it before relying on it.
 *
 * @param key - The `localStorage` key to read.
 *
 * @returns The parsed value, or `null` when nothing is stored under the key, what is stored is not
 *          valid JSON, or storage cannot be read.
 */
export const readLocalStorageJson = <Value>(key: string): Nullable<Value> => {
  try {
    const value = window.localStorage.getItem(key);

    return value === null ? null : parseJson<Value>(value);
  } catch {
    return null;
  }
};

/**
 * Stores a value under a key in `localStorage`, as JSON.
 *
 * Never throws: a write that fails - storage full (`QuotaExceededError`), Safari Private Mode,
 * security-restricted contexts, SSR, or a value `JSON.stringify()` cannot serialise (a circular
 * reference, a `BigInt`) - reports `false` instead.
 *
 * @param key - The `localStorage` key to write.
 * @param value - Any JSON-serialisable value.
 *
 * @returns `true` once the value is stored, `false` when it could not be.
 */
export const writeLocalStorageJson = (key: string, value: unknown): boolean => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));

    return true;
  } catch {
    return false;
  }
};
