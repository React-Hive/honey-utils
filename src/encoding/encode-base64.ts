const encodeBase64Bytes = (bytes: Uint8Array): string => {
  if (typeof bytes.toBase64 === 'function') {
    return bytes.toBase64();
  }

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('base64');
  }

  let binary = '';

  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary);
};

export const encodeBase64 = (value: string): string =>
  encodeBase64Bytes(new TextEncoder().encode(value));
