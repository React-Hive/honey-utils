import type { Nullable } from '~/types';

export const parseJson = <Value>(value: string): Nullable<Value> => {
  try {
    return JSON.parse(value) as Value;
  } catch {
    return null;
  }
};
