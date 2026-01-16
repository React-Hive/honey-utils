/**
 * Generates a lightweight, ephemeral identifier for short-lived, client-side use.
 *
 * The identifier combines a high-resolution timestamp with a
 * pseudo-random suffix to reduce collision probability.
 *
 * ⚠️ Uniqueness is **best-effort only**:
 * - No guarantee of global uniqueness
 * - Not suitable for persistence or cross-session usage
 * - Not safe for security-sensitive or externally visible identifiers
 *
 * Intended use cases:
 * - Temporary UI keys (e.g. React lists, animations)
 * - In-memory references scoped to a single runtime
 *
 * @returns An ephemeral identifier string.
 */
export const generateEphemeralId = (): string => {
  const timestampPart = Math.floor(performance.now() * 1000).toString(36);
  const randomPart = Math.random().toString(36).slice(2, 10);

  return `${timestampPart}${randomPart}`;
};
