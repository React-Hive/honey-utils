/**
 * Restricts a number to the inclusive range between `min` and `max`.
 *
 * @param value - The number to restrict.
 * @param min - The lower bound.
 * @param max - The upper bound. Wins over `min` when the two cross.
 *
 * @returns `min` when the value is below it, `max` when the value is above it, and the value
 * itself otherwise.
 *
 * @example
 * ```ts
 * clamp(5, 0, 10); // 5
 * clamp(-3, 0, 10); // 0
 * clamp(42, 0, 10); // 10
 * ```
 */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
