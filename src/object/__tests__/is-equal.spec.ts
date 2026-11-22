import { isEqual } from '~/object';

describe('[isEqual]: compare two values by what they hold', () => {
  it('should compare primitives as SameValueZero', () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual('a', 'a')).toBe(true);
    expect(isEqual(NaN, NaN)).toBe(true);
    expect(isEqual(0, -0)).toBe(true);
    expect(isEqual(1, '1')).toBe(false);
    expect(isEqual(null, undefined)).toBe(false);
    expect(isEqual(null, {})).toBe(false);
  });

  it('should compare arrays item by item, in order', () => {
    expect(isEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
    expect(isEqual([1, 2], [2, 1])).toBe(false);
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
    expect(isEqual([], [])).toBe(true);
  });

  it('should compare objects by their keys in any order, nested ones included', () => {
    const stored = {
      technologies: [{ technology: 'fdm', largestPartMm: { width: 256, depth: 256 }, count: 2 }],
      pickupLocationNames: ['Headingley'],
      flags: { fdm: true, sla: false },
    };

    const worked = {
      flags: { sla: false, fdm: true },
      pickupLocationNames: ['Headingley'],
      technologies: [{ count: 2, largestPartMm: { depth: 256, width: 256 }, technology: 'fdm' }],
    };

    expect(isEqual(stored, worked)).toBe(true);
    expect(isEqual(stored, { ...worked, flags: { fdm: true, sla: true } })).toBe(false);
  });

  it('should tell a key holding undefined from a key left out, and count every key', () => {
    expect(isEqual({ a: undefined }, {})).toBe(false);
    expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(isEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
  });

  it('should compare objects only with objects of the same prototype', () => {
    class Point {
      constructor(
        readonly x: number,
        readonly y: number,
      ) {}
    }

    expect(isEqual(new Point(1, 2), new Point(1, 2))).toBe(true);
    expect(isEqual(new Point(1, 2), { x: 1, y: 2 })).toBe(false);
    expect(isEqual([1], { 0: 1, length: 1 })).toBe(false);
    expect(isEqual(new Uint8Array([1]), new Int8Array([1]))).toBe(false);
  });

  it('should compare dates by time and regular expressions by source and flags', () => {
    expect(isEqual(new Date(0), new Date(0))).toBe(true);
    expect(isEqual(new Date(0), new Date(1))).toBe(false);
    expect(isEqual(new Date(NaN), new Date(NaN))).toBe(true);
    expect(isEqual(/a/g, /a/g)).toBe(true);
    expect(isEqual(/a/g, /a/i)).toBe(false);
  });

  it('should compare maps by key and value, and sets by member', () => {
    expect(isEqual(new Map([['a', { b: 1 }]]), new Map([['a', { b: 1 }]]))).toBe(true);
    expect(isEqual(new Map([['a', 1]]), new Map([['a', 2]]))).toBe(false);
    expect(isEqual(new Map([['a', 1]]), new Map([['b', 1]]))).toBe(false);
    expect(isEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true);
    expect(isEqual(new Set([1]), new Set([1, 2]))).toBe(false);
    expect(isEqual(new Set([{ a: 1 }]), new Set([{ a: 1 }]))).toBe(false);
  });

  it('should compare buffers, typed arrays and views by their bytes', () => {
    expect(isEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2]))).toBe(true);
    expect(isEqual(new Uint8Array([1, 2]), new Uint8Array([1, 3]))).toBe(false);
    expect(isEqual(new Uint8Array([1, 2]).buffer, new Uint8Array([1, 2]).buffer)).toBe(true);
    expect(isEqual(new Uint8Array([1, 2]).buffer, new Uint8Array([2, 1]).buffer)).toBe(false);

    const bytes = new Uint8Array([9, 1, 2, 9]);

    expect(
      isEqual(new DataView(bytes.buffer, 1, 2), new DataView(new Uint8Array([1, 2]).buffer)),
    ).toBe(true);
  });

  it('should compare errors by name and message', () => {
    expect(isEqual(new Error('a'), new Error('a'))).toBe(true);
    expect(isEqual(new Error('a'), new Error('b'))).toBe(false);
    expect(isEqual(new TypeError('a'), new RangeError('a'))).toBe(false);
  });

  it('should compare functions and symbols by identity', () => {
    const fn = () => 1;

    expect(isEqual(fn, fn)).toBe(true);
    expect(isEqual(fn, () => 1)).toBe(false);
    expect(isEqual(Symbol('a'), Symbol('a'))).toBe(false);
  });

  it('should compare circular structures without recursing forever', () => {
    const a: Record<string, unknown> = { name: 'a' };
    const b: Record<string, unknown> = { name: 'a' };

    a.self = a;
    b.self = b;

    expect(isEqual(a, b)).toBe(true);

    const c: Record<string, unknown> = { name: 'c' };

    c.self = c;

    expect(isEqual(a, c)).toBe(false);
  });
});
