/**
 * Calculates the intersection ratio between two DOM rectangles.
 *
 * The ratio represents the proportion of the `targetRect` that is covered by `sourceRect`.
 * A value of `1` means `sourceRect` completely covers `targetRect`, and `0` means no overlap.
 *
 * @param sourceRect - The rectangle used to measure overlap against the target.
 * @param targetRect - The rectangle whose covered area is measured.
 *
 * @returns A number between `0` and `1` representing the intersection ratio.
 */
export const getDOMRectIntersectionRatio = (sourceRect: DOMRect, targetRect: DOMRect): number => {
  const xOverlap = Math.max(
    0,
    Math.min(sourceRect.right, targetRect.right) - Math.max(sourceRect.left, targetRect.left),
  );

  const yOverlap = Math.max(
    0,
    Math.min(sourceRect.bottom, targetRect.bottom) - Math.max(sourceRect.top, targetRect.top),
  );

  const intersectionArea = xOverlap * yOverlap;
  const targetArea = targetRect.width * targetRect.height;

  return intersectionArea / targetArea;
};
