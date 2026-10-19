import { clampOffsetToOverflow } from '~/geometry';

describe('[clampOffsetToOverflow]: bound a negative offset to the overflow', () => {
  it('should return an offset within the overflow as it is', () => {
    expect(clampOffsetToOverflow(-30, 100)).toBe(-30);
  });

  it('should return the negative overflow for an offset past it', () => {
    expect(clampOffsetToOverflow(-150, 100)).toBe(-100);
    expect(clampOffsetToOverflow(-Infinity, 100)).toBe(-100);
  });

  it('should return an offset equal to the negative overflow as it is', () => {
    expect(clampOffsetToOverflow(-100, 100)).toBe(-100);
  });

  it('should return 0 for a positive offset', () => {
    expect(clampOffsetToOverflow(40, 100)).toBe(0);
    expect(clampOffsetToOverflow(Infinity, 100)).toBe(0);
  });

  it('should return 0 for an offset of 0', () => {
    expect(clampOffsetToOverflow(0, 100)).toBe(0);
  });

  it('should return 0 when there is no overflow', () => {
    expect(clampOffsetToOverflow(-50, 0)).toBe(0);
    expect(clampOffsetToOverflow(50, 0)).toBe(0);
  });

  it('should return 0 for a negative overflow', () => {
    expect(clampOffsetToOverflow(-50, -10)).toBe(0);
  });

  it('should bound fractional offsets to a fractional overflow', () => {
    expect(clampOffsetToOverflow(-12.5, 10.25)).toBe(-10.25);
    expect(clampOffsetToOverflow(-0.5, 10.25)).toBe(-0.5);
  });
});
