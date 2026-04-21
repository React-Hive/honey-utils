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
 * @returns A negative offset value suitable for use in a CSS `translate` transform.
 */
export const calculateCenterOffset = ({
  containerSize,
  elementOffset,
  elementSize,
}: CalculateCenterOffsetOptions): number => {
  const containerCenter = containerSize / 2;
  const elementCenter = elementOffset + elementSize / 2;
  const targetOffset = elementCenter - containerCenter;

  return -targetOffset;
};
