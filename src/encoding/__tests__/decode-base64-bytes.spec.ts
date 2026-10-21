import { decodeBase64, decodeBase64Bytes } from '~/encoding';

describe('[decodeBase64Bytes]: decode base64 to bytes utility', () => {
  it('should decode an empty string to no bytes', () => {
    expect(decodeBase64Bytes('')).toStrictEqual(new Uint8Array());
  });

  it('should decode base64 to its bytes', () => {
    expect(decodeBase64Bytes('SGVsbG8=')).toStrictEqual(new Uint8Array([72, 101, 108, 108, 111]));
  });

  it('should decode bytes that are not text, which decodeBase64 refuses', () => {
    expect(decodeBase64Bytes('/wCA')).toStrictEqual(new Uint8Array([0xff, 0x00, 0x80]));
    expect(decodeBase64('/wCA')).toBeNull();
  });

  it('should give a plain Uint8Array, not a Buffer', () => {
    expect(decodeBase64Bytes('SGVsbG8=')?.constructor).toBe(Uint8Array);
  });

  it('should give null for a value that is not base64', () => {
    expect(decodeBase64Bytes('not base64!')).toBeNull();
    expect(decodeBase64Bytes('SGVsbG8')).toBeNull();
    expect(decodeBase64Bytes('SGVs bG8=')).toBeNull();
    expect(decodeBase64Bytes('SGVsbG8-')).toBeNull();
  });

  describe('without Buffer', () => {
    beforeEach(() => {
      vi.stubGlobal('Buffer', undefined);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should decode base64 to its bytes', () => {
      expect(decodeBase64Bytes('/wCA')).toStrictEqual(new Uint8Array([0xff, 0x00, 0x80]));
    });

    it('should give null for a value that is not base64', () => {
      expect(decodeBase64Bytes('not base64!')).toBeNull();
    });
  });
});
