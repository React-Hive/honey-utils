interface HTMLElementTransformationValues {
  translateX: number;
  translateY: number;
}

/**
 * Get various transformation values from the transformation matrix of an element.
 *
 * @param element - The element with a transformation applied.
 *
 * @returns An object containing transformation values.
 */
export const getTransformationValues = (element: HTMLElement): HTMLElementTransformationValues => {
  const computedStyles = window.getComputedStyle(element);
  const transformValue = computedStyles.getPropertyValue('transform');

  const matrix = transformValue.match(/^matrix\((.+)\)$/);
  if (!matrix) {
    return {
      translateX: 0,
      translateY: 0,
    };
  }

  const transformMatrix = matrix[1].split(', ');

  const translateX = parseFloat(transformMatrix[4]);
  const translateY = parseFloat(transformMatrix[5]);

  return {
    translateX,
    translateY,
  };
};
