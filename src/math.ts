/**
 * Calculates the Euclidean distance between two points in 2D space.
 *
 * @param startX - The X coordinate of the starting point.
 * @param startY - The Y coordinate of the starting point.
 * @param endX - The X coordinate of the ending point.
 * @param endY - The Y coordinate of the ending point.
 *
 * @returns The Euclidean distance between the two points.
 */
export const calculateEuclideanDistance = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): number => {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  return Math.sqrt(deltaX ** 2 + deltaY ** 2);
};

/**
 * Calculates the moving speed.
 *
 * @param delta - The change in position (distance).
 * @param elapsedTime - The time taken to move the distance.
 *
 * @returns The calculated speed, which is the absolute value of delta divided by elapsed time.
 */
export const calculateMovingSpeed = (delta: number, elapsedTime: number): number =>
  Math.abs(delta / elapsedTime);

/**
 * Calculates the specified percentage of a given value.
 *
 * @param value - The value to calculate the percentage of.
 * @param percentage - The percentage to calculate.
 *
 * @returns The calculated percentage of the value.
 */
export const calculatePercentage = (value: number, percentage: number): number => {
  return (value * percentage) / 100;
};
