export * from './string';
export * from './array';
export * from './function';
export * from './guards';

export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
