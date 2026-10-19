/**
 * Calculates the intersection ratio between two DOM rectangles.
 *
 * The ratio represents the proportion of the `targetRect` that is covered by `sourceRect`.
 * A value of `1` means `sourceRect` completely covers `targetRect`, and `0` means no overlap.
 *
 * @param sourceRect - The rectangle used to measure overlap against the target.
 * @param targetRect - The rectangle whose covered area is measured.
 *
 * @returns A number between `0` and `1` representing the intersection ratio - `0` for a target
 *          with no area, which nothing can cover.
 *
 * @example
 * ```ts
 * getDOMRectIntersectionRatio(new DOMRect(0, 0, 100, 100), new DOMRect(50, 0, 100, 100));
 * // 0.5
 * ```
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

  if (targetArea <= 0) {
    return 0;
  }

  return intersectionArea / targetArea;
};
