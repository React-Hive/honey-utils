export interface CalculateCenterOffsetOptions {
  /**
   * Visible size of the container along the axis.
   *
   * Typically, `clientWidth` for the X axis or `clientHeight` for the Y axis.
   */
  containerSize: number;
  /**
   * Offset of the target element from the start of the container along the axis.
   *
   * Typically, `offsetLeft` (X axis) or `offsetTop` (Y axis).
   */
  elementOffset: number;
  /**
   * Size of the target element along the axis.
   *
   * Typically, `clientWidth` (X axis) or `clientHeight` (Y axis).
   */
  elementSize: number;
}

/**
 * Calculates the raw offset required to center an element within a container along a single axis.
 *
 * @param options - The container's visible size, and the element's offset and size, along the axis.
 *
 * @returns The offset to translate the container by: negative for an element past the container's
 *          centre, positive for one before it, and `0` for one already centred. Clamp it with
 *          `clampOffsetToOverflow` to keep the container within its overflow.
 *
 * @example
 * ```ts
 * calculateCenterOffset({ containerSize: 100, elementOffset: 200, elementSize: 20 });
 * // -160
 * ```
 */
export const calculateCenterOffset = ({
  containerSize,
  elementOffset,
  elementSize,
}: CalculateCenterOffsetOptions): number => {
  const containerCenter = containerSize / 2;
  const elementCenter = elementOffset + elementSize / 2;
  const targetOffset = elementCenter - containerCenter;

  // `|| 0` turns the `-0` of an element already centred into `0`
  return -targetOffset || 0;
};
