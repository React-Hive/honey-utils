import {
  assert,
  isNull,
  isNil,
  isDefined,
  isUndefined,
  isNumber,
  isBool,
  isObject,
  isEmptyObject,
  isDate,
  isBlob,
  isError,
  isValidDate,
  isRegExp,
  isMap,
  isSet,
  isSymbol,
  isFiniteNumber,
  isInteger,
  isDecimal,
} from '~/guards';

describe('[assert]: throw when a condition does not hold', () => {
  it('should not throw for truthy conditions', () => {
    expect(() => assert(true, 'Never thrown')).not.toThrow();
    expect(() => assert(1, 'Never thrown')).not.toThrow();
    expect(() => assert('text', 'Never thrown')).not.toThrow();
    expect(() => assert({}, 'Never thrown')).not.toThrow();
    expect(() => assert([], 'Never thrown')).not.toThrow();
  });

  it('should throw an Error with the given message for a false condition', () => {
    expect(() => assert(false, 'Cannot divide by zero')).toThrow(
      new Error('Cannot divide by zero'),
    );
  });

  it('should throw for every falsy condition', () => {
    expect(() => assert(0, 'Zero')).toThrow('Zero');
    expect(() => assert('', 'Empty string')).toThrow('Empty string');
    expect(() => assert(null, 'Null')).toThrow('Null');
    expect(() => assert(undefined, 'Undefined')).toThrow('Undefined');
    expect(() => assert(NaN, 'NaN')).toThrow('NaN');
  });

  it('should narrow the asserted value', () => {
    const value: unknown = 'apple';

    assert(typeof value === 'string', 'Expected a string');

    expect(value.toUpperCase()).toBe('APPLE');
  });
});

describe('[isNull]: check a value is null', () => {
  it('should return true for null', () => {
    expect(isNull(null)).toBe(true);
  });

  it('should return false for undefined', () => {
    expect(isNull(undefined)).toBe(false);
  });

  it('should return false for other falsy values', () => {
    expect(isNull(0)).toBe(false);
    expect(isNull('')).toBe(false);
    expect(isNull(false)).toBe(false);
    expect(isNull(NaN)).toBe(false);
  });

  it('should return false for objects', () => {
    expect(isNull({})).toBe(false);
    expect(isNull(Object.create(null))).toBe(false);
  });
});

describe('[isNil]: check a value is null or undefined', () => {
  it('should return true for null and undefined', () => {
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
  });

  it('should return false for other falsy values', () => {
    expect(isNil(0)).toBe(false);
    expect(isNil('')).toBe(false);
    expect(isNil(false)).toBe(false);
    expect(isNil(NaN)).toBe(false);
  });

  it('should return false for objects and arrays', () => {
    expect(isNil({})).toBe(false);
    expect(isNil([])).toBe(false);
  });
});

describe('[isDefined]: check a value is neither null nor undefined', () => {
  it('should return false for null and undefined', () => {
    expect(isDefined(null)).toBe(false);
    expect(isDefined(undefined)).toBe(false);
  });

  it('should return true for falsy values that are not nil', () => {
    expect(isDefined(0)).toBe(true);
    expect(isDefined('')).toBe(true);
    expect(isDefined(false)).toBe(true);
    expect(isDefined(NaN)).toBe(true);
  });

  it('should return true for objects and arrays', () => {
    expect(isDefined({})).toBe(true);
    expect(isDefined([])).toBe(true);
  });

  it('should drop only nil items when used as a filter', () => {
    const result = [0, null, 'a', undefined, false].filter(isDefined);

    expect(result).toStrictEqual([0, 'a', false]);
  });
});

describe('[isUndefined]: check a value is undefined', () => {
  it('should return true for undefined', () => {
    expect(isUndefined(undefined)).toBe(true);
    expect(isUndefined(void 0)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isUndefined(null)).toBe(false);
  });

  it('should return false for other falsy values', () => {
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined('')).toBe(false);
    expect(isUndefined(false)).toBe(false);
    expect(isUndefined(NaN)).toBe(false);
  });

  it('should return false for the string "undefined"', () => {
    expect(isUndefined('undefined')).toBe(false);
  });
});

describe('[isNumber]: check a value is a number', () => {
  it('should return true for numbers', () => {
    expect(isNumber(123)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-0)).toBe(true);
    expect(isNumber(-1.5)).toBe(true);
  });

  it('should return true for NaN and the infinities', () => {
    expect(isNumber(NaN)).toBe(true);
    expect(isNumber(Infinity)).toBe(true);
    expect(isNumber(-Infinity)).toBe(true);
  });

  it('should return false for numeric strings', () => {
    expect(isNumber('123')).toBe(false);
    expect(isNumber('')).toBe(false);
  });

  it('should return false for boxed numbers and bigints', () => {
    expect(isNumber(new Number(1))).toBe(false);
    expect(isNumber(BigInt(1))).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
  });
});

describe('[isBool]: check a value is a boolean', () => {
  it('should return true for true and false', () => {
    expect(isBool(true)).toBe(true);
    expect(isBool(false)).toBe(true);
  });

  it('should return false for boolean-like values', () => {
    expect(isBool('true')).toBe(false);
    expect(isBool(0)).toBe(false);
    expect(isBool(1)).toBe(false);
  });

  it('should return false for boxed booleans', () => {
    expect(isBool(new Boolean(false))).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isBool(null)).toBe(false);
    expect(isBool(undefined)).toBe(false);
  });
});

describe('[isObject]: check a value is an object', () => {
  it('should return true for plain objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ key: 'value' })).toBe(true);
    expect(isObject(Object.create(null))).toBe(true);
  });

  it('should return true for arrays and built-in instances', () => {
    expect(isObject([])).toBe(true);
    expect(isObject(new Date())).toBe(true);
    expect(isObject(new Map())).toBe(true);
    expect(isObject(/a/)).toBe(true);
  });

  it('should return true for boxed primitives', () => {
    expect(isObject(new String('text'))).toBe(true);
    expect(isObject(new Number(1))).toBe(true);
  });

  it('should return false for primitives', () => {
    expect(isObject('object')).toBe(false);
    expect(isObject(1)).toBe(false);
    expect(isObject(true)).toBe(false);
    expect(isObject(Symbol('a'))).toBe(false);
    expect(isObject(undefined)).toBe(false);
  });
});

describe('[isEmptyObject]: check a value is an object with no own enumerable properties', () => {
  it('should return true for an empty object', () => {
    expect(isEmptyObject({})).toBe(true);
    expect(isEmptyObject(Object.create(null))).toBe(true);
  });

  it('should return false for an object with a property', () => {
    expect(isEmptyObject({ key: 'value' })).toBe(false);
  });

  it('should return false for an object whose property is undefined', () => {
    expect(isEmptyObject({ key: undefined })).toBe(false);
  });

  it('should ignore inherited and non-enumerable properties', () => {
    const inherited = Object.create({ key: 'value' });
    const nonEnumerable = Object.defineProperty({}, 'key', { value: 'value', enumerable: false });

    expect(isEmptyObject(inherited)).toBe(true);
    expect(isEmptyObject(nonEnumerable)).toBe(true);
  });

  it('should return false for null and undefined', () => {
    expect(isEmptyObject(null)).toBe(false);
    expect(isEmptyObject(undefined)).toBe(false);
  });

  it('should return false for primitives', () => {
    expect(isEmptyObject('')).toBe(false);
    expect(isEmptyObject(0)).toBe(false);
    expect(isEmptyObject(false)).toBe(false);
  });
});

describe('[isDate]: check a value is a Date object', () => {
  it('should return true for a Date', () => {
    expect(isDate(new Date())).toBe(true);
  });

  it('should return true for an invalid Date', () => {
    expect(isDate(new Date('invalid'))).toBe(true);
  });

  it('should return false for date strings and timestamps', () => {
    expect(isDate('2023-01-01')).toBe(false);
    expect(isDate(Date.now())).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isDate(null)).toBe(false);
    expect(isDate(undefined)).toBe(false);
  });
});

describe('[isBlob]: check a value is a Blob', () => {
  it('should return true for a Blob', () => {
    expect(isBlob(new Blob(['text']))).toBe(true);
  });

  it('should return true for a File', () => {
    expect(isBlob(new File(['text'], 'file.txt'))).toBe(true);
  });

  it('should return false for a Blob-like object', () => {
    expect(isBlob({ size: 0, type: '', text: () => Promise.resolve('') })).toBe(false);
  });

  it('should return false for binary data that is not a Blob', () => {
    expect(isBlob(new ArrayBuffer(1))).toBe(false);
    expect(isBlob(new Uint8Array(1))).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isBlob(null)).toBe(false);
    expect(isBlob(undefined)).toBe(false);
  });
});

describe('[isError]: check a value is an Error', () => {
  it('should return true for an Error', () => {
    expect(isError(new Error('Failed'))).toBe(true);
  });

  it('should return true for built-in and custom Error subclasses', () => {
    class NetworkError extends Error {}

    expect(isError(new TypeError('Failed'))).toBe(true);
    expect(isError(new NetworkError('Failed'))).toBe(true);
  });

  it('should return false for an Error-like object', () => {
    expect(isError({ name: 'Error', message: 'Failed' })).toBe(false);
  });

  it('should return false for an error message', () => {
    expect(isError('Failed')).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isError(null)).toBe(false);
    expect(isError(undefined)).toBe(false);
  });
});

describe('[isValidDate]: check a value is a Date holding a valid time', () => {
  it('should return true for a valid Date', () => {
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate(new Date(0))).toBe(true);
  });

  it('should return false for an invalid Date', () => {
    expect(isValidDate(new Date('invalid'))).toBe(false);
    expect(isValidDate(new Date(NaN))).toBe(false);
  });

  it('should return false for valid date strings and timestamps', () => {
    expect(isValidDate('2023-01-01')).toBe(false);
    expect(isValidDate(0)).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(undefined)).toBe(false);
  });
});

describe('[isRegExp]: check a value is a RegExp', () => {
  it('should return true for a regular expression literal', () => {
    expect(isRegExp(/apple/i)).toBe(true);
  });

  it('should return true for a constructed RegExp', () => {
    expect(isRegExp(new RegExp('apple'))).toBe(true);
  });

  it('should return false for a pattern string', () => {
    expect(isRegExp('/apple/')).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isRegExp(null)).toBe(false);
    expect(isRegExp(undefined)).toBe(false);
  });
});

describe('[isMap]: check a value is a Map', () => {
  it('should return true for empty and filled Maps', () => {
    expect(isMap(new Map())).toBe(true);
    expect(isMap(new Map([['key', 'value']]))).toBe(true);
  });

  it('should return false for a WeakMap', () => {
    expect(isMap(new WeakMap())).toBe(false);
  });

  it('should return false for a plain object', () => {
    expect(isMap({ key: 'value' })).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isMap(null)).toBe(false);
    expect(isMap(undefined)).toBe(false);
  });
});

describe('[isSet]: check a value is a Set', () => {
  it('should return true for empty and filled Sets', () => {
    expect(isSet(new Set())).toBe(true);
    expect(isSet(new Set([1, 2]))).toBe(true);
  });

  it('should return false for a WeakSet', () => {
    expect(isSet(new WeakSet())).toBe(false);
  });

  it('should return false for an array', () => {
    expect(isSet([1, 2])).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isSet(null)).toBe(false);
    expect(isSet(undefined)).toBe(false);
  });
});

describe('[isSymbol]: check a value is a symbol', () => {
  it('should return true for symbols', () => {
    expect(isSymbol(Symbol('key'))).toBe(true);
    expect(isSymbol(Symbol.for('key'))).toBe(true);
    expect(isSymbol(Symbol.iterator)).toBe(true);
  });

  it('should return false for a boxed symbol', () => {
    expect(isSymbol(Object(Symbol('key')))).toBe(false);
  });

  it('should return false for a symbol description', () => {
    expect(isSymbol('Symbol(key)')).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isSymbol(null)).toBe(false);
    expect(isSymbol(undefined)).toBe(false);
  });
});

describe('[isFiniteNumber]: check a value is a finite number', () => {
  it('should return true for finite numbers', () => {
    expect(isFiniteNumber(10)).toBe(true);
    expect(isFiniteNumber(3.14)).toBe(true);
    expect(isFiniteNumber(-5)).toBe(true);
    expect(isFiniteNumber(0)).toBe(true);
    expect(isFiniteNumber(Number.MAX_VALUE)).toBe(true);
  });

  it('should return false for NaN and the infinities', () => {
    expect(isFiniteNumber(NaN)).toBe(false);
    expect(isFiniteNumber(Infinity)).toBe(false);
    expect(isFiniteNumber(-Infinity)).toBe(false);
  });

  it('should return false for numeric strings', () => {
    expect(isFiniteNumber('10')).toBe(false);
    expect(isFiniteNumber('')).toBe(false);
  });

  it('should return false for values the global isFinite coerces to numbers', () => {
    expect(isFiniteNumber(true)).toBe(false);
    expect(isFiniteNumber([])).toBe(false);
    expect(isFiniteNumber(new Number(10))).toBe(false);
  });

  it('should return false for null and undefined', () => {
    expect(isFiniteNumber(null)).toBe(false);
    expect(isFiniteNumber(undefined)).toBe(false);
  });
});

describe('[isInteger]: check a value is an integer', () => {
  it('should return true for integers', () => {
    expect(isInteger(1)).toBe(true);
    expect(isInteger(0)).toBe(true);
    expect(isInteger(-10)).toBe(true);
    expect(isInteger(-0)).toBe(true);
  });

  it('should return true for a number written with a zero fraction', () => {
    expect(isInteger(5.0)).toBe(true);
  });

  it('should return true for integers beyond the safe range', () => {
    expect(isInteger(Number.MAX_SAFE_INTEGER + 2)).toBe(true);
  });

  it('should return false for decimals', () => {
    expect(isInteger(1.5)).toBe(false);
    expect(isInteger(-0.25)).toBe(false);
  });

  it('should return false for NaN and the infinities', () => {
    expect(isInteger(NaN)).toBe(false);
    expect(isInteger(Infinity)).toBe(false);
    expect(isInteger(-Infinity)).toBe(false);
  });

  it('should return false for numeric strings, boxed numbers, null and undefined', () => {
    expect(isInteger('1')).toBe(false);
    expect(isInteger(new Number(1))).toBe(false);
    expect(isInteger(null)).toBe(false);
    expect(isInteger(undefined)).toBe(false);
  });
});

describe('[isDecimal]: check a value is a finite number with a fractional part', () => {
  it('should return true for decimals', () => {
    expect(isDecimal(1.5)).toBe(true);
    expect(isDecimal(-0.25)).toBe(true);
    expect(isDecimal(0.1)).toBe(true);
    expect(isDecimal(Number.EPSILON)).toBe(true);
  });

  it('should return false for integers', () => {
    expect(isDecimal(1)).toBe(false);
    expect(isDecimal(0)).toBe(false);
    expect(isDecimal(-10)).toBe(false);
    expect(isDecimal(2.0)).toBe(false);
  });

  it('should return false for NaN and the infinities', () => {
    expect(isDecimal(NaN)).toBe(false);
    expect(isDecimal(Infinity)).toBe(false);
    expect(isDecimal(-Infinity)).toBe(false);
  });

  it('should return false for decimal strings, null and undefined', () => {
    expect(isDecimal('1.5')).toBe(false);
    expect(isDecimal(null)).toBe(false);
    expect(isDecimal(undefined)).toBe(false);
  });
});

describe('[isObject]: null', () => {
  it('should return false for null', () => {
    expect(isObject(null)).toBe(false);
  });
});

describe('[isEmptyObject]: symbol keys', () => {
  it('should return false for an object holding only an enumerable symbol key', () => {
    expect(isEmptyObject({ [Symbol('key')]: 1 })).toBe(false);
  });

  it('should return true for an object holding only a non-enumerable symbol key', () => {
    const value = {};
    Object.defineProperty(value, Symbol('key'), { value: 1, enumerable: false });

    expect(isEmptyObject(value)).toBe(true);
  });
});
