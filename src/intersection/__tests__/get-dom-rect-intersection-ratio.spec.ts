import { getDOMRectIntersectionRatio } from '~/intersection';

const createRect = (x: number, y: number, width: number, height: number): DOMRect =>
  ({
    x,
    y,
    width,
    height,
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
  }) as DOMRect;

describe('[getDOMRectIntersectionRatio]: share of a rectangle covered by another', () => {
  it('should return 1 when the source covers the target exactly', () => {
    const rect = createRect(10, 20, 100, 50);

    expect(getDOMRectIntersectionRatio(rect, createRect(10, 20, 100, 50))).toBe(1);
  });

  it('should return 1 when the source is larger than the target and contains it', () => {
    expect(
      getDOMRectIntersectionRatio(createRect(0, 0, 500, 500), createRect(100, 100, 50, 50)),
    ).toBe(1);
  });

  it('should return the share of the target that the source covers', () => {
    const target = createRect(0, 0, 100, 100);

    expect(getDOMRectIntersectionRatio(createRect(50, 0, 100, 100), target)).toBe(0.5);
    expect(getDOMRectIntersectionRatio(createRect(-50, -50, 100, 100), target)).toBe(0.25);
    expect(getDOMRectIntersectionRatio(createRect(0, 75, 100, 100), target)).toBe(0.25);
  });

  it('should return the source area over the target area for a source inside the target', () => {
    expect(
      getDOMRectIntersectionRatio(createRect(10, 10, 20, 50), createRect(0, 0, 100, 100)),
    ).toBe(0.1);
  });

  it('should measure against the target, not the source', () => {
    const small = createRect(0, 0, 10, 10);
    const large = createRect(0, 0, 100, 10);

    expect(getDOMRectIntersectionRatio(small, large)).toBe(0.1);
    expect(getDOMRectIntersectionRatio(large, small)).toBe(1);
  });

  it('should return 0 when the rectangles do not overlap', () => {
    const target = createRect(0, 0, 100, 100);

    expect(getDOMRectIntersectionRatio(createRect(200, 0, 50, 50), target)).toBe(0);
    expect(getDOMRectIntersectionRatio(createRect(0, -300, 50, 50), target)).toBe(0);
    expect(getDOMRectIntersectionRatio(createRect(-80, 150, 50, 50), target)).toBe(0);
  });

  it('should return 0 when the rectangles overlap on one axis only', () => {
    const target = createRect(0, 0, 100, 100);

    expect(getDOMRectIntersectionRatio(createRect(20, 150, 50, 50), target)).toBe(0);
    expect(getDOMRectIntersectionRatio(createRect(150, 20, 50, 50), target)).toBe(0);
  });

  it('should return 0 when the rectangles only touch at an edge or a corner', () => {
    const target = createRect(0, 0, 100, 100);

    expect(getDOMRectIntersectionRatio(createRect(100, 0, 50, 100), target)).toBe(0);
    expect(getDOMRectIntersectionRatio(createRect(0, -50, 100, 50), target)).toBe(0);
    expect(getDOMRectIntersectionRatio(createRect(100, 100, 50, 50), target)).toBe(0);
  });

  it('should return 0 for a source with no area', () => {
    expect(getDOMRectIntersectionRatio(createRect(50, 50, 0, 0), createRect(0, 0, 100, 100))).toBe(
      0,
    );
  });

  it('should measure fractional rectangles', () => {
    expect(
      getDOMRectIntersectionRatio(createRect(0.5, 0, 10, 10), createRect(0, 0, 10, 10)),
    ).toBeCloseTo(0.95);
  });
});

describe('[getDOMRectIntersectionRatio]: a target with no area', () => {
  it('should return 0 rather than NaN', () => {
    const source = { left: 0, top: 0, right: 10, bottom: 10, width: 10, height: 10 } as DOMRect;
    const target = { left: 5, top: 5, right: 5, bottom: 5, width: 0, height: 0 } as DOMRect;

    expect(getDOMRectIntersectionRatio(source, target)).toBe(0);
  });
});
