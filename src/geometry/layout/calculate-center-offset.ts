export interface CalculateCenterOffsetOptions {
  /**
   * Total overflow size for the axis.
   *
   * Represents how much larger the content is compared to the visible
   * container size (e.g. scroll width minus client width).
   */
  overflowSize: number;
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
 * Calculates the offset required to center an element within a container along a single axis.
 *
 * The returned value is clamped so that the resulting translation does not
 * exceed the container's scrollable bounds.
 *
 * This function performs pure math only and does not access the DOM.
 *
 * @returns A negative offset value suitable for use in a CSS `translate`
 * transform, or `0` when no overflow exists on the axis.
 */
export const calculateCenterOffset = ({
  overflowSize,
  containerSize,
  elementOffset,
  elementSize,
}: CalculateCenterOffsetOptions): number => {
  if (overflowSize <= 0) {
    return 0;
  }

  const containerCenter = containerSize / 2;
  const elementCenter = elementOffset + elementSize / 2;

  const targetOffset = elementCenter - containerCenter;

  return -Math.max(0, Math.min(targetOffset, overflowSize));
};
