export type Axis = 'x' | 'y' | 'both';

/**
 * Values typically originate from wheel, drag, touch, or other pointer-based input sources.
 */
export interface AxisDelta {
  deltaX: number;
  deltaY: number;
}

export interface ResolveAxisDeltaOptions {
  /**
   * Whether vertical input may be used as a fallback source
   * for horizontal movement when no horizontal delta is present.
   *
   * This is especially useful for mouse wheels that emit only
   * vertical deltas while scrolling horizontal content (e.g. tab lists or carousels).
   *
   * @default true
   */
  allowFallback?: boolean;
  /**
   * Whether to invert the resolved delta direction.
   *
   * Inversion is commonly required for synthetic scrolling,
   * where positive input deltas should move content in the
   * opposite direction of the pointer or wheel movement.
   *
   * @default true
   */
  invert?: boolean;
}

/**
 * Resolves a raw two-dimensional input delta into an axis-aligned delta
 * according to the specified axis and resolution rules.
 *
 * This function is input-agnostic and does not perform any DOM mutations.
 * It is intended to be used as a normalization step for wheel, drag,
 * touch, or other pointer-based input before applying scroll physics.
 *
 * ### Resolution rules
 * - `'x'`:
 *   - Uses horizontal input when available.
 *   - Optionally falls back to vertical input when horizontal input is zero.
 * - `'y'`:
 *   - Uses vertical input only.
 * - `'both'`:
 *   - Preserves both horizontal and vertical input.
 *
 * ### Direction handling
 * - When `invert` is enabled, the resolved delta direction is inverted
 *   to match typical synthetic scrolling behavior.
 *
 * @param delta - Raw input movement delta.
 * @param axis - Axis along which movement should be resolved.
 * @param options - Resolution behavior configuration.
 *
 * @returns A normalized, axis-aligned delta suitable for further scroll or movement processing.
 */
export const resolveAxisDelta = (
  delta: AxisDelta,
  axis: Axis,
  { allowFallback = true, invert = true }: ResolveAxisDeltaOptions = {},
): AxisDelta => {
  const sign = invert ? -1 : 1;

  switch (axis) {
    case 'x': {
      const value = delta.deltaX !== 0 ? delta.deltaX : allowFallback ? delta.deltaY : 0;

      return {
        deltaX: sign * value,
        deltaY: 0,
      };
    }

    case 'y':
      return {
        deltaX: 0,
        deltaY: sign * delta.deltaY,
      };

    default:
      return {
        deltaX: sign * delta.deltaX,
        deltaY: sign * delta.deltaY,
      };
  }
};
