import { resolveAxisDelta } from '~/intersection';

describe('[resolveAxisDelta]: resolve an input delta along an axis', () => {
  describe('the x axis', () => {
    it('should keep the horizontal delta, inverted, and drop the vertical one', () => {
      expect(resolveAxisDelta({ deltaX: 30, deltaY: 10 }, 'x')).toStrictEqual({
        deltaX: -30,
        deltaY: 0,
      });
    });

    it('should use the vertical delta, inverted, when there is no horizontal delta', () => {
      expect(resolveAxisDelta({ deltaX: 0, deltaY: 40 }, 'x')).toStrictEqual({
        deltaX: -40,
        deltaY: 0,
      });
    });

    it('should prefer a negative horizontal delta over the vertical one', () => {
      expect(resolveAxisDelta({ deltaX: -5, deltaY: 40 }, 'x')).toStrictEqual({
        deltaX: 5,
        deltaY: 0,
      });
    });

    it('should not fall back to the vertical delta when the fallback is off', () => {
      const result = resolveAxisDelta({ deltaX: 0, deltaY: 40 }, 'x', {
        allowFallback: false,
        invert: false,
      });

      expect(result).toStrictEqual({ deltaX: 0, deltaY: 0 });
    });

    it('should keep the horizontal delta when the fallback is off', () => {
      const result = resolveAxisDelta({ deltaX: 12, deltaY: 40 }, 'x', { allowFallback: false });

      expect(result).toStrictEqual({ deltaX: -12, deltaY: 0 });
    });

    it('should keep the direction when inversion is off', () => {
      expect(resolveAxisDelta({ deltaX: 30, deltaY: 10 }, 'x', { invert: false })).toStrictEqual({
        deltaX: 30,
        deltaY: 0,
      });
      expect(resolveAxisDelta({ deltaX: 0, deltaY: -40 }, 'x', { invert: false })).toStrictEqual({
        deltaX: -40,
        deltaY: 0,
      });
    });
  });

  describe('the y axis', () => {
    it('should keep the vertical delta, inverted, and drop the horizontal one', () => {
      expect(resolveAxisDelta({ deltaX: 30, deltaY: 10 }, 'y')).toStrictEqual({
        deltaX: 0,
        deltaY: -10,
      });
    });

    it('should never fall back to the horizontal delta', () => {
      const result = resolveAxisDelta({ deltaX: 30, deltaY: 0 }, 'y', { invert: false });

      expect(result).toStrictEqual({ deltaX: 0, deltaY: 0 });
    });

    it('should keep the direction when inversion is off', () => {
      expect(resolveAxisDelta({ deltaX: 30, deltaY: -10 }, 'y', { invert: false })).toStrictEqual({
        deltaX: 0,
        deltaY: -10,
      });
    });
  });

  describe('both axes', () => {
    it('should keep both deltas, inverted', () => {
      expect(resolveAxisDelta({ deltaX: 30, deltaY: -10 }, 'both')).toStrictEqual({
        deltaX: -30,
        deltaY: 10,
      });
    });

    it('should keep both deltas as they are when inversion is off', () => {
      expect(
        resolveAxisDelta({ deltaX: 30, deltaY: -10 }, 'both', { invert: false }),
      ).toStrictEqual({ deltaX: 30, deltaY: -10 });
    });

    it('should not move a missing delta over to the other axis', () => {
      const result = resolveAxisDelta({ deltaX: 0, deltaY: 25 }, 'both', { invert: false });

      expect(result).toStrictEqual({ deltaX: 0, deltaY: 25 });
    });
  });

  it('should keep fractional deltas', () => {
    expect(resolveAxisDelta({ deltaX: 0.25, deltaY: 1.5 }, 'both')).toStrictEqual({
      deltaX: -0.25,
      deltaY: -1.5,
    });
  });

  it('should return a new object and leave the delta as it was', () => {
    const delta = { deltaX: 30, deltaY: -10 };

    const result = resolveAxisDelta(delta, 'both', { invert: false });

    expect(result).not.toBe(delta);
    expect(delta).toStrictEqual({ deltaX: 30, deltaY: -10 });
  });
});

describe('[resolveAxisDelta]: inverted zeros', () => {
  it('should return 0, not -0, for a zero delta inverted', () => {
    const resolved = resolveAxisDelta({ deltaX: 0, deltaY: 0 }, 'x');

    expect(Object.is(resolved.deltaX, 0)).toBe(true);
    expect(Object.is(resolved.deltaY, 0)).toBe(true);
  });
});
