// @vitest-environment jsdom
import { getXOverflowWidth, getYOverflowHeight, hasXOverflow, hasYOverflow } from '~/dom';

const createElement = (layout: Record<string, number>): HTMLElement => {
  const element = document.createElement('div');

  Object.entries(layout).forEach(([property, value]) => {
    Object.defineProperty(element, property, { value, configurable: true });
  });

  return element;
};

describe('[hasXOverflow]: whether the content is wider than the element', () => {
  it('should return true when the content is wider', () => {
    expect(hasXOverflow(createElement({ scrollWidth: 500, clientWidth: 300 }))).toBe(true);
  });

  it('should return false when the content fits exactly', () => {
    expect(hasXOverflow(createElement({ scrollWidth: 300, clientWidth: 300 }))).toBe(false);
  });

  it('should only look at the width', () => {
    expect(
      hasXOverflow(
        createElement({ scrollWidth: 300, clientWidth: 300, scrollHeight: 900, clientHeight: 200 }),
      ),
    ).toBe(false);
  });
});

describe('[getXOverflowWidth]: how much wider the content is than the element', () => {
  it('should return the difference between the scroll and client widths', () => {
    expect(getXOverflowWidth(createElement({ scrollWidth: 500, clientWidth: 300 }))).toBe(200);
  });

  it('should return 0 when the content fits exactly', () => {
    expect(getXOverflowWidth(createElement({ scrollWidth: 300, clientWidth: 300 }))).toBe(0);
  });

  it('should never return a negative width', () => {
    expect(getXOverflowWidth(createElement({ scrollWidth: 299, clientWidth: 300 }))).toBe(0);
  });
});

describe('[hasYOverflow]: whether the content is taller than the element', () => {
  it('should return true when the content is taller', () => {
    expect(hasYOverflow(createElement({ scrollHeight: 900, clientHeight: 200 }))).toBe(true);
  });

  it('should return false when the content fits exactly', () => {
    expect(hasYOverflow(createElement({ scrollHeight: 200, clientHeight: 200 }))).toBe(false);
  });

  it('should only look at the height', () => {
    expect(
      hasYOverflow(
        createElement({ scrollWidth: 500, clientWidth: 300, scrollHeight: 200, clientHeight: 200 }),
      ),
    ).toBe(false);
  });
});

describe('[getYOverflowHeight]: how much taller the content is than the element', () => {
  it('should return the difference between the scroll and client heights', () => {
    expect(getYOverflowHeight(createElement({ scrollHeight: 900, clientHeight: 200 }))).toBe(700);
  });

  it('should return 0 when the content fits exactly', () => {
    expect(getYOverflowHeight(createElement({ scrollHeight: 200, clientHeight: 200 }))).toBe(0);
  });

  it('should never return a negative height', () => {
    expect(getYOverflowHeight(createElement({ scrollHeight: 199, clientHeight: 200 }))).toBe(0);
  });
});
