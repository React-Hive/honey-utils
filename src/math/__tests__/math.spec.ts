import { calculateEuclideanDistance, calculateMovingSpeed, calculatePercentage } from '~/math';

describe('[calculateEuclideanDistance]: distance between two points', () => {
  it('should return the straight-line distance', () => {
    expect(calculateEuclideanDistance(0, 0, 3, 4)).toBe(5);
    expect(calculateEuclideanDistance(1, 2, 7, 10)).toBe(10);
  });

  it('should return the difference along one axis for points on a line', () => {
    expect(calculateEuclideanDistance(2, 5, 9, 5)).toBe(7);
    expect(calculateEuclideanDistance(4, -1, 4, -7)).toBe(6);
  });

  it('should return 0 for the same point', () => {
    expect(calculateEuclideanDistance(12.5, -3, 12.5, -3)).toBe(0);
  });

  it('should give the same distance in either direction', () => {
    expect(calculateEuclideanDistance(3, 4, 0, 0)).toBe(5);
    expect(calculateEuclideanDistance(-2, 7, 10, -9)).toBe(
      calculateEuclideanDistance(10, -9, -2, 7),
    );
  });

  it('should measure between negative coordinates', () => {
    expect(calculateEuclideanDistance(-1, -1, -4, -5)).toBe(5);
  });

  it('should measure fractional coordinates', () => {
    expect(calculateEuclideanDistance(0, 0, 1, 1)).toBeCloseTo(Math.SQRT2);
    expect(calculateEuclideanDistance(0.5, 0.5, 2, 2.5)).toBeCloseTo(2.5);
  });

  it('should not overflow for very large coordinates', () => {
    const distance = calculateEuclideanDistance(0, 0, 3e200, 4e200);

    expect(distance).not.toBe(Infinity);
    expect(distance / 5e200).toBeCloseTo(1);
  });
});

describe('[calculateMovingSpeed]: speed from a distance and a time', () => {
  it('should divide the distance by the time', () => {
    expect(calculateMovingSpeed(100, 4)).toBe(25);
    expect(calculateMovingSpeed(1, 4)).toBe(0.25);
  });

  it('should return a positive speed for a negative distance', () => {
    expect(calculateMovingSpeed(-100, 4)).toBe(25);
  });

  it('should return a positive speed for a negative time', () => {
    expect(calculateMovingSpeed(100, -4)).toBe(25);
    expect(calculateMovingSpeed(-100, -4)).toBe(25);
  });

  it('should return 0 when nothing moved', () => {
    expect(calculateMovingSpeed(0, 16)).toBe(0);
  });
});

describe('[calculatePercentage]: a percentage of a value', () => {
  it('should return the percentage of the value', () => {
    expect(calculatePercentage(200, 50)).toBe(100);
    expect(calculatePercentage(80, 25)).toBe(20);
  });

  it('should return the value for 100 percent', () => {
    expect(calculatePercentage(37, 100)).toBe(37);
  });

  it('should return 0 for 0 percent or a value of 0', () => {
    expect(calculatePercentage(200, 0)).toBe(0);
    expect(calculatePercentage(0, 50)).toBe(0);
  });

  it('should return more than the value above 100 percent', () => {
    expect(calculatePercentage(40, 250)).toBe(100);
  });

  it('should take fractional percentages', () => {
    expect(calculatePercentage(80, 12.5)).toBe(10);
    expect(calculatePercentage(10, 0.5)).toBeCloseTo(0.05);
  });

  it('should keep the sign of a negative value or percentage', () => {
    expect(calculatePercentage(-200, 10)).toBe(-20);
    expect(calculatePercentage(200, -10)).toBe(-20);
    expect(calculatePercentage(-200, -10)).toBe(20);
  });
});
