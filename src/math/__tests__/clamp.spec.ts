import { clamp } from '~/math';

describe('[clamp]: restrict a number to a range', () => {
  it('should return the value when it is within the range', () => {
    const result = clamp(5, 0, 10);

    expect(result).toBe(5);
  });

  it('should return the lower bound when the value is below it', () => {
    const result = clamp(-3, 0, 10);

    expect(result).toBe(0);
  });

  it('should return the upper bound when the value is above it', () => {
    const result = clamp(42, 0, 10);

    expect(result).toBe(10);
  });

  it('should return the value when it equals a bound', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it('should restrict to a negative range', () => {
    expect(clamp(-50, -20, -10)).toBe(-20);
    expect(clamp(5, -20, -10)).toBe(-10);
  });

  it('should restrict infinite values to the bounds', () => {
    expect(clamp(Infinity, 0, 10)).toBe(10);
    expect(clamp(-Infinity, 0, 10)).toBe(0);
  });

  it('should return the upper bound when the bounds cross', () => {
    const result = clamp(5, 10, 0);

    expect(result).toBe(0);
  });

  it('should return NaN for NaN', () => {
    const result = clamp(NaN, 0, 10);

    expect(result).toBeNaN();
  });
});
