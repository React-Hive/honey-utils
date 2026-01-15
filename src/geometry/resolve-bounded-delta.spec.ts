import { resolveBoundedDelta } from './resolve-bounded-delta';

describe('resolveBoundedDelta', () => {
  test('should return null when delta is zero', () => {
    const result = resolveBoundedDelta({
      value: 50,
      delta: 0,
      min: 0,
      max: 100,
    });

    expect(result).toBeNull();
  });

  test('should apply negative delta within bounds', () => {
    const result = resolveBoundedDelta({
      value: 50,
      delta: -10,
      min: 0,
      max: 100,
    });

    expect(result).toBe(40);
  });

  test('should apply positive delta within bounds', () => {
    const result = resolveBoundedDelta({
      value: 50,
      delta: 20,
      min: 0,
      max: 100,
    });

    expect(result).toBe(70);
  });

  test('should clamp to minimum bound when negative delta overshoots', () => {
    const result = resolveBoundedDelta({
      value: 5,
      delta: -20,
      min: 0,
      max: 100,
    });

    expect(result).toBe(0);
  });

  test('should clamp to maximum bound when positive delta overshoots', () => {
    const result = resolveBoundedDelta({
      value: 90,
      delta: 50,
      min: 0,
      max: 100,
    });

    expect(result).toBe(100);
  });

  test('should return null when movement is blocked at minimum bound', () => {
    const result = resolveBoundedDelta({
      value: 0,
      delta: -10,
      min: 0,
      max: 100,
    });

    expect(result).toBeNull();
  });

  test('should return null when movement is blocked at maximum bound', () => {
    const result = resolveBoundedDelta({
      value: 100,
      delta: 10,
      min: 0,
      max: 100,
    });

    expect(result).toBeNull();
  });

  test('should allow movement away from minimum bound', () => {
    const result = resolveBoundedDelta({
      value: 0,
      delta: 15,
      min: 0,
      max: 100,
    });

    expect(result).toBe(15);
  });

  test('should allow movement away from maximum bound', () => {
    const result = resolveBoundedDelta({
      value: 100,
      delta: -25,
      min: 0,
      max: 100,
    });

    expect(result).toBe(75);
  });

  test('should behave symmetrically for negative bounds', () => {
    const result = resolveBoundedDelta({
      value: -20,
      delta: -15,
      min: -50,
      max: 50,
    });

    expect(result).toBe(-35);
  });

  test('should clamp correctly with negative bounds overshoot', () => {
    const result = resolveBoundedDelta({
      value: -45,
      delta: -20,
      min: -50,
      max: 50,
    });

    expect(result).toBe(-50);
  });
});
