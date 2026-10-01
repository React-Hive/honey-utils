import { decodeBase64Json, encodeBase64Json } from '~/encoding';

describe('[encodeBase64Json]: encode JSON value to base64 utility', () => {
  it('should encode object JSON to base64', () => {
    const result = encodeBase64Json({
      fruit: 'apple',
      quantity: 3,
    });

    expect(result).toBe('eyJmcnVpdCI6ImFwcGxlIiwicXVhbnRpdHkiOjN9');
  });

  it('should encode array JSON to base64', () => {
    const result = encodeBase64Json(['apple', 'banana', 'orange']);

    expect(result).toBe('WyJhcHBsZSIsImJhbmFuYSIsIm9yYW5nZSJd');
  });

  it('should encode string JSON to base64', () => {
    const result = encodeBase64Json('apple');

    expect(result).toBe('ImFwcGxlIg==');
  });

  it('should encode number JSON to base64', () => {
    const result = encodeBase64Json(3);

    expect(result).toBe('Mw==');
  });

  it('should encode boolean JSON to base64', () => {
    const result = encodeBase64Json(true);

    expect(result).toBe('dHJ1ZQ==');
  });

  it('should encode null JSON to base64', () => {
    const result = encodeBase64Json(null);

    expect(result).toBe('bnVsbA==');
  });

  it('should encode unicode JSON as UTF-8', () => {
    const result = encodeBase64Json({
      fruit: 'яблоко',
    });

    expect(result).toBe('eyJmcnVpdCI6ItGP0LHQu9C+0LrQviJ9');
  });

  it('should round-trip through decodeBase64Json', () => {
    const value = {
      fruit: 'яблоко',
      tags: ['🍎', 'red'],
      quantity: 3,
      isRipe: true,
      note: null,
    };

    const result = decodeBase64Json<typeof value>(encodeBase64Json(value));

    expect(result).toStrictEqual(value);
  });

  it('should throw for a value JSON cannot serialize', () => {
    const value: Record<string, unknown> = {};
    value.self = value;

    expect(() => encodeBase64Json(value)).toThrow(TypeError);
  });
});
