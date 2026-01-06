import type { Nullable } from '~/types';

interface ResolveBoundedDeltaOptions {
  /**
   * Incremental change to apply to the current value.
   *
   * The sign of this value determines the direction of movement:
   * - Negative values move toward the minimum bound
   * - Positive values move toward the maximum bound
   */
  delta: number;
  /**
   * Current numeric value before applying the delta.
   */
  value: number;
  /**
   * Minimum allowed value (inclusive).
   *
   * Movement beyond this boundary is prevented.
   */
  min: number;
  /**
   * Maximum allowed value (inclusive).
   *
   * Movement beyond this boundary is prevented.
   */
  max: number;
}

/**
 * Resolves the next value by consuming a delta within fixed numeric bounds.
 *
 * This function applies **bounded delta consumption** rather than naive clamping:
 *
 * - The delta is applied in the given direction as long as movement is possible.
 * - If the delta would overshoot a bound, it is partially consumed so the
 *   resulting value lands exactly on the boundary.
 * - If movement in the given direction is no longer possible, `null` is returned.
 *
 * This behavior mirrors how native scroll engines and drag constraints
 * handle fast input without jitter or overshoot.
 *
 * ### Key characteristics
 * - Direction-aware (positive and negative deltas behave independently)
 * - Prevents overshoot while preserving remaining movement
 * - Does **not** clamp unconditionally
 * - Side-effect free and fully deterministic
 *
 * ### Common use cases
 * - Synthetic scrolling
 * - Drag constraints
 * - Sliders and carousels
 * - Timelines and scrubbers
 * - Inertia and momentum systems
 *
 * @param delta - Incremental change to apply to the current value.
 *               The sign determines the movement direction.
 * @param value - Current numeric value before applying the delta.
 * @param min - Minimum allowed value (inclusive).
 * @param max - Maximum allowed value (inclusive).
 *
 * @returns The next resolved value after applying the delta,
 *          or `null` if movement in the given direction is not possible.
 *
 * @example
 * ```ts
 * // Simple bounded movement
 * resolveBoundedDelta({ value: 10, delta: -5, min: 0, max: 100 });
 * // → 5
 *
 * // Overshoot is clamped to the boundary
 * resolveBoundedDelta({ value: 2, delta: -10, min: 0, max: 100 });
 * // → 0
 *
 * // Movement blocked at the boundary
 * resolveBoundedDelta({ value: 0, delta: -5, min: 0, max: 100 });
 * // → null
 * ```
 */
export const resolveBoundedDelta = ({
  delta,
  value,
  min,
  max,
}: ResolveBoundedDeltaOptions): Nullable<number> => {
  if (delta === 0) {
    return null;
  }

  const candidate = value + delta;

  if (delta < 0) {
    return value <= min ? null : Math.max(candidate, min);
  }

  if (delta > 0) {
    return value >= max ? null : Math.min(candidate, max);
  }

  return null;
};
