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

/**
 * Creates a clone of a Blob object.
 *
 * @param blob - The Blob object to clone.
 *
 * @returns A new Blob with the same content and type as the original.
 */
export const cloneBlob = (blob: Blob): Blob => new Blob([blob], { type: blob.type });

/**
 * Converts a `Blob` object into a `File` object with the specified name.
 *
 * This is useful when you receive a `Blob` (e.g., from canvas, fetch, or file manipulation)
 * and need to convert it into a `File` to upload via `FormData` or file inputs.
 *
 * @param blob - The `Blob` to convert.
 * @param fileName - The desired name for the resulting file (including extension).
 *
 * @returns A `File` instance with the same content and MIME type as the input `Blob`.
 *
 * @example
 * ```ts
 * const blob = new Blob(['Hello world'], { type: 'text/plain' });
 * const file = convertBlobToFile(blob, 'hello.txt');
 *
 * console.log(file instanceof File); // true
 * ```
 */
export const convertBlobToFile = (blob: Blob, fileName: string): File =>
  new File([blob], fileName, {
    type: blob.type,
  });
