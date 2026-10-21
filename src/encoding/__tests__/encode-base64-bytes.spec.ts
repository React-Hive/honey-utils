import { decodeBase64Bytes, encodeBase64Bytes } from '~/encoding';

const ALL_BYTES = Uint8Array.from({ length: 256 }, (_, byte) => byte);

describe('[encodeBase64Bytes]: encode bytes to base64 utility', () => {
  it('should encode no bytes as an empty string', () => {
    expect(encodeBase64Bytes(new Uint8Array())).toBe('');
  });

  it('should encode bytes to base64', () => {
    expect(encodeBase64Bytes(new Uint8Array([72, 101, 108, 108, 111]))).toBe('SGVsbG8=');
  });

  it('should encode bytes that are not text', () => {
    expect(encodeBase64Bytes(new Uint8Array([0xff, 0x00, 0x80]))).toBe('/wCA');
  });

  it('should encode only the bytes a subarray views', () => {
    const bytes = new Uint8Array([1, 72, 101, 108, 108, 111, 2]);

    expect(encodeBase64Bytes(bytes.subarray(1, 6))).toBe('SGVsbG8=');
  });

  it('should round-trip every byte value through decodeBase64Bytes', () => {
    expect(decodeBase64Bytes(encodeBase64Bytes(ALL_BYTES))).toStrictEqual(ALL_BYTES);
  });

  describe('without Buffer', () => {
    beforeEach(() => {
      vi.stubGlobal('Buffer', undefined);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should encode bytes to base64', () => {
      expect(encodeBase64Bytes(new Uint8Array([72, 101, 108, 108, 111]))).toBe('SGVsbG8=');
    });

    it('should encode every byte value as with Buffer', () => {
      vi.unstubAllGlobals();

      const withBuffer = encodeBase64Bytes(ALL_BYTES);

      vi.stubGlobal('Buffer', undefined);

      expect(encodeBase64Bytes(ALL_BYTES)).toBe(withBuffer);
    });
  });
});
