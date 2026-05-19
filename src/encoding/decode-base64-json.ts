import type { Nullable } from '~/types';
import { parseJson } from '~/json';
import { decodeBase64 } from './decode-base64';

export const decodeBase64Json = <Value>(value: string): Nullable<Value> => {
  const decodedValue = decodeBase64(value);
  if (decodedValue === null) {
    return null;
  }

  return parseJson<Value>(decodedValue);
};
