import { encodeBase64 } from './encode-base64';

export const encodeBase64Json = <Value>(value: Value): string =>
  encodeBase64(JSON.stringify(value));
