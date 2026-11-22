import { definedProps } from '~/object';

describe('[definedProps]: drop the properties whose values are undefined', () => {
  it('should remove undefined properties', () => {
    const result = definedProps({ a: 1, b: undefined, c: 'x' });

    expect(result).toStrictEqual({ a: 1, c: 'x' });
    expect('b' in result).toBe(false);
  });

  it('should keep null and other falsy values', () => {
    const result = definedProps({ a: null, b: 0, c: false, d: '', e: NaN });

    expect(result).toStrictEqual({ a: null, b: 0, c: false, d: '', e: NaN });
  });

  it('should return a new object and leave the source untouched', () => {
    const source = { a: 1, b: undefined };

    const result = definedProps(source);

    expect(result).not.toBe(source);
    expect(source).toStrictEqual({ a: 1, b: undefined });
  });

  it('should return a new object when nothing is undefined', () => {
    const source = { a: 1, b: 'x' };

    const result = definedProps(source);

    expect(result).toStrictEqual(source);
    expect(result).not.toBe(source);
  });

  it('should return an empty object when every value is undefined', () => {
    const result = definedProps({ a: undefined, b: undefined });

    expect(result).toStrictEqual({});
  });

  it('should return an empty object for an empty object', () => {
    expect(definedProps({})).toStrictEqual({});
  });

  it('should only clean the top level', () => {
    const nested = { b: undefined };

    const result = definedProps({ a: nested });

    expect(result).toStrictEqual({ a: { b: undefined } });
    expect(result.a).toBe(nested);
  });

  it('should keep the key order of the source', () => {
    const result = definedProps({ c: 3, a: undefined, b: 2, d: 1 });

    expect(Object.keys(result)).toStrictEqual(['c', 'b', 'd']);
  });

  it('should drop optional properties set to undefined', () => {
    interface Options {
      size?: number;
      label?: string;
    }

    const options: Options = { size: 10, label: undefined };

    const result = definedProps(options);

    expect(result).toStrictEqual({ size: 10 });
  });
});

describe('[definedProps]: symbol keys and optional keys', () => {
  it('should keep a symbol key with a defined value and drop one without', () => {
    const kept = Symbol('kept');
    const dropped = Symbol('dropped');

    const result = definedProps({ [kept]: 1, [dropped]: undefined });

    expect(result[kept]).toBe(1);
    expect(Object.getOwnPropertySymbols(result)).toStrictEqual([kept]);
  });

  it('should type a key that may be undefined as optional', () => {
    const result = definedProps({ a: 1, c: undefined as string | undefined });

    // @ts-expect-error - `c` may have been dropped, so it is not a plain string
    const c: string = result.c;

    expect(c).toBeUndefined();
    expect(result.a).toBe(1);
  });
});
