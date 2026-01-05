interface HTMLElementTransformationValues {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
}

/**
 * Extracts transformation values (translate, scale, skew) from the 2D transformation matrix of a given HTML element.
 *
 * Only works with 2D transforms (i.e., `matrix(a, b, c, d, e, f)`).
 *
 * @param element - The element with a CSS transform applied.
 * @returns An object with parsed transformation values.
 *
 * @example
 * ```ts
 * const values = parse2DMatrix(myElement);
 * console.log(values.translateX);
 * console.log(values.scaleX);
 * ```
 */
export const parse2DMatrix = (element: HTMLElement): HTMLElementTransformationValues => {
  const computedStyles = window.getComputedStyle(element);
  const transformValue = computedStyles.getPropertyValue('transform');

  const matrixMatch = transformValue.match(/^matrix\((.+)\)$/);
  if (!matrixMatch) {
    return {
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
    };
  }

  const [scaleX, skewY, skewX, scaleY, translateX, translateY] = matrixMatch[1]
    .split(', ')
    .map(parseFloat);

  return {
    translateX,
    translateY,
    scaleX,
    scaleY,
    skewX,
    skewY,
  };
};
