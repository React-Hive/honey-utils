export * from './string';
export * from './array';
export * from './function';
export * from './guards';
export * from './math';
export * from './dom';

export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
