import { assert } from '~/guards';
import { applyInertiaStep } from './apply-inertia-step';

describe('applyInertiaStep', () => {
  test('should advance value based on velocity and delta time', () => {
    const result = applyInertiaStep({
      value: 0,
      min: -100,
      max: 100,
      velocityPxMs: 1,
      deltaTimeMs: 16,
      friction: 0,
    });

    expect(result).not.toBeNull();
    assert(result, 'Result should not be null');

    expect(result.value).toBe(16);
    expect(result.velocityPxMs).toBe(1);
  });

  test('should apply exponential friction to velocity', () => {
    const velocityPxMs = 1;
    const deltaTimeMs = 10;
    const friction = 0.1;

    const result = applyInertiaStep({
      value: 0,
      min: -100,
      max: 100,
      velocityPxMs,
      deltaTimeMs,
      friction,
      emaAlpha: 0,
    });

    expect(result).not.toBeNull();
    assert(result, 'Result should not be null');

    const expectedVelocity = velocityPxMs * Math.exp(-friction * deltaTimeMs);

    expect(result.velocityPxMs).toBe(expectedVelocity);
    expect(result.value).toBe(10);
  });

  test('should apply EMA smoothing after friction', () => {
    const velocityPxMs = 1;
    const friction = 0.1;
    const deltaTimeMs = 10;
    const emaAlpha = 0.5;

    const result = applyInertiaStep({
      value: 0,
      min: -100,
      max: 100,
      velocityPxMs,
      friction,
      deltaTimeMs,
      emaAlpha,
    });

    expect(result).not.toBeNull();
    assert(result, 'Result should not be null');

    const decayed = velocityPxMs * Math.exp(-friction * deltaTimeMs);
    const expectedVelocity = velocityPxMs * emaAlpha + decayed * emaAlpha;

    expect(result.velocityPxMs).toBe(expectedVelocity);
  });

  test('should return null when velocity is below minVelocityPxMs', () => {
    const result = applyInertiaStep({
      value: 0,
      min: -100,
      max: 100,
      velocityPxMs: 0.009,
      deltaTimeMs: 16,
      minVelocityPxMs: 0.01,
    });

    expect(result).toBeNull();
  });

  test('should return null when movement hits lower bound', () => {
    const result = applyInertiaStep({
      value: -100,
      min: -100,
      max: 100,
      velocityPxMs: -1,
      deltaTimeMs: 16,
    });

    expect(result).toBeNull();
  });

  test('should return null when movement hits upper bound', () => {
    const result = applyInertiaStep({
      value: 100,
      min: -100,
      max: 100,
      velocityPxMs: 1,
      deltaTimeMs: 16,
    });

    expect(result).toBeNull();
  });

  test('should handle negative velocity correctly', () => {
    const result = applyInertiaStep({
      value: 0,
      min: -100,
      max: 100,
      velocityPxMs: -2,
      deltaTimeMs: 10,
      friction: 0,
    });

    expect(result).not.toBeNull();
    assert(result, 'Result should not be null');

    expect(result.value).toBe(-20);
    expect(result.velocityPxMs).toBe(-2);
  });

  test('should terminate when EMA-smoothed velocity drops below threshold', () => {
    const result = applyInertiaStep({
      value: 0,
      min: -100,
      max: 100,
      velocityPxMs: 0.02,
      deltaTimeMs: 50,
      friction: 0.2,
      emaAlpha: 1,
      minVelocityPxMs: 0.01,
    });

    expect(result).toBeNull();
  });
});
