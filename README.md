# @react-hive/honey-utils

[![npm version](https://img.shields.io/npm/v/@react-hive/honey-utils.svg)](https://www.npmjs.com/package/@react-hive/honey-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center">
  <img src="./logo.png" alt="honey-utils logo" width="200" height="200">
</p>

A lightweight TypeScript utility library providing a collection of helper functions for common programming tasks.

## Features

- 🔍 **Type Guards** - Functions for runtime type checking
- 🧵 **String Utilities** - String manipulation and transformation
- 🔢 **Array Utilities** - Array filtering and manipulation
- 🧮 **Math Utilities** - Common mathematical calculations
- 🎯 **Function Utilities** - Function handling helpers
- 🖥️ **DOM Utilities** - Browser DOM manipulation helpers
- 📦 **Zero Dependencies** - Lightweight and dependency-free
- 📝 **TypeScript Support** - Full TypeScript type definitions

## Installation

```bash
# Using npm
npm install @react-hive/honey-utils

# Using yarn
yarn add @react-hive/honey-utils

# Using pnpm
pnpm add @react-hive/honey-utils
```

## Usage

### Importing

```ts
// Import specific utilities
import { toKebabCase, isString, boolFilter } from '@react-hive/honey-utils';

// Or import everything
import * as HoneyUtils from '@react-hive/honey-utils';
```

### String Utilities

```ts
import { toKebabCase, camelToDashCase, splitStringIntoWords, hashString } from '@react-hive/honey-utils';

/**
 * Convert string to kebab-case
 */
toKebabCase('helloWorld'); // 'hello-world'

/**
 * Convert camelCase to dash-case
 */
camelToDashCase('helloWorld'); // 'hello-world'

/**
 * Split string into words
 */
splitStringIntoWords('hello world'); // ['hello', 'world']

/**
 * Generate a hash from a string
 */
const hash = hashString('background-color: red;'); // 'e4k1z0x'
```

### Array Utilities

```ts
import {
    compact,
    unique,
    chunk,
    intersection,
    difference,
    pipe,
    compose,
} from '@react-hive/honey-utils';

/**
 * Filter out falsy values from an array
 */
compact([0, 1, false, 2, '', 3, null, undefined, true]);
// ➜ [1, 2, 3, true]

/**
 * Remove duplicate values from an array
 */
unique([1, 2, 2, 3, 1, 4]);
// ➜ [1, 2, 3, 4]

/**
 * Split an array into chunks of specified size
 */
chunk([1, 2, 3, 4, 5], 2);
// ➜ [[1, 2], [3, 4], [5]]

/**
 * Find common elements between arrays
 */
intersection([1, 2, 3], [2, 3, 4]);
// ➜ [2, 3]

/**
 * Find elements in one array not in another
 */
difference([1, 2, 3, 4], [2, 4]);
// ➜ [1, 3]

/**
 * Compose functions from left to right
 */
const double = (n: number) => n * 2;
const increment = (n: number) => n + 1;

pipe(double, increment)(3);
// ➜ 7  → increment(double(3)) → increment(6)

/**
 * Compose functions from right to left
 */
compose(increment, double)(3);
// ➜ 7  → increment(double(3)) → increment(6)
```

### Asynchronous Utilities

```ts
import {
    runParallel,
    runSequential,
    reduceAsync,
    filterParallel,
    someAsync,
    everyAsync,
    findAsync,
} from '@react-hive/honey-utils';

/**
 * Run async operations in parallel and collect results
 */
await runParallel([1, 2, 3], async (n) => {
    await delay(100);
    return n * 2;
});
// ➜ [2, 4, 6]

/**
 * Run async operations sequentially and collect results
 */
await runSequential([1, 2, 3], async (n, i) => {
    await delay(100);
    return n * i;
});
// ➜ [0, 2, 6]

/**
 * Reduce array asynchronously
 */
await reduceAsync([1, 2, 3], async (acc, n) => {
    await delay(50);
    return acc + n;
}, 0);
// ➜ 6

/**
 * Filter array asynchronously
 */
await filterParallel([1, 2, 3, 4], async (n) => {
    await delay(30);
    return n % 2 === 0;
});
// ➜ [2, 4]

/**
 * Check if some items match condition asynchronously
 */
await someAsync([1, 3, 5], async (n) => {
    await delay(10);
    return n % 2 === 0;
});
// ➜ false

/**
 * Check if all items match condition asynchronously
 */
await everyAsync([2, 4, 6], async (n) => {
    await delay(10);
    return n % 2 === 0;
});
// ➜ true

/**
 * Find first matching item asynchronously
 */
await findAsync([1, 3, 4, 5], async (n) => {
    await delay(20);
    return n % 2 === 0;
});
// ➜ 4
```

### Function Utilities

```ts
import { noop, invokeIfFunction, delay, retry } from '@react-hive/honey-utils';

/**
 * No-operation function. Does nothing
 */
noop();

/**
 * Invoke if function, otherwise return value
 */
const fn = (x: number) => x * 2;

invokeIfFunction(fn, 5); // 10
invokeIfFunction('not a function', 5); // 'not a function'

/**
 * Waits for 1 second before continuing
 */
await delay(1000);

/**
 * Retry an async function with configurable options
 */
async function fetchData() {
  const response = await fetch('/api/data');
  
  if (!response.ok) {
    throw new Error('Network error');
  }
  
  return await response.json();
}

const fetchWithRetry = retry(fetchData, {
  maxAttempts: 5,
  delayMs: 500,
  backoff: true,
  onRetry: (attempt, error) => {
    console.warn(`Attempt ${attempt} failed:`, error);
  }
});

fetchWithRetry()
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Failed after retries:', error));
```

### Type Guards

```ts
import { 
  isString, 
  isNumber, 
  isBool, 
  isObject, 
  isFunction, 
  isPromise, 
  isNil, 
  isNilOrEmptyString,
  isArray,
  isEmptyArray,
  isEmptyObject,
  isNull,
  isUndefined,
  isDate,
  isValidDate,
  isRegExp,
  isMap,
  isSet
} from '@react-hive/honey-utils';

/**
 * Check if value is a string
 */
isString('hello'); // true
isString(123); // false

/**
 * Check if value is a number
 */
isNumber(123); // true
isNumber('123'); // false

/**
 * Check if value is a boolean
 */
isBool(true); // true
isBool('true'); // false

/**
 * Check if value is an object
 */
isObject({}); // true
isObject('object'); // false

/**
 * Check if value is a function
 */
isFunction(() => {}); // true
isFunction({}); // false

/**
 * Check if value is a Promise
 */
isPromise(Promise.resolve()); // true
isPromise({}); // false

/**
 * Check if value is null or undefined
 */
isNil(null); // true
isNil(undefined); // true
isNil(''); // false

/**
 * Check if value is null, undefined, or empty string
 */
isNilOrEmptyString(''); // true
isNilOrEmptyString(null); // true
isNilOrEmptyString('hello'); // false

/**
 * Check if value is an array
 */
isArray([1, 2, 3]); // true
isArray({}); // false

/**
 * Check if value is an empty array
 */
isEmptyArray([]); // true
isEmptyArray([1, 2, 3]); // false

/**
 * Check if value is an empty object
 */
isEmptyObject({}); // true
isEmptyObject({ key: 'value' }); // false

/**
 * Check if value is a Date object
 */
isDate(new Date()); // true
isDate('2023-01-01'); // false

/**
 * Check if value is a valid Date object
 */
isValidDate(new Date()); // true
isValidDate(new Date('invalid')); // false

/**
 * Check if value is a RegExp
 */
isRegExp(/test/); // true
isRegExp('test'); // false

/**
 * Check if value is a Map or Set
 */
isMap(new Map()); // true
isSet(new Set()); // true
```

### Math Utilities

```ts
import { 
  calculateEuclideanDistance, 
  calculateMovingSpeed, 
  calculatePercentage 
} from '@react-hive/honey-utils';

/**
 * Calculate Euclidean distance between two points
 */
calculateEuclideanDistance(0, 0, 3, 4); // 5

/**
 * Calculate moving speed
 */
calculateMovingSpeed(100, 5); // 20

/**
 * Calculate percentage of a value
 */
calculatePercentage(200, 25); // 50
```

### DOM Utilities

```ts
import { parse2DMatrix, cloneBlob, convertBlobToFile } from '@react-hive/honey-utils';

// Extract transformation values from an HTML element's 2D matrix
const element = document.getElementById('my-element');
if (element) {
  const { translateX, translateY, scaleX, scaleY, skewX, skewY } = parse2DMatrix(element);
  
  console.log(`Element is translated by ${translateX}px horizontally and ${translateY}px vertically`);
  console.log(`Element is scaled by ${scaleX} horizontally and ${scaleY} vertically`);
  console.log(`Element is skewed by ${skewX} horizontally and ${skewY} vertically`);
}

// Clone a Blob object
const originalBlob = new Blob(['Hello World'], { type: 'text/plain' });
const clonedBlob = cloneBlob(originalBlob);

console.log(clonedBlob.type); // 'text/plain'

// Convert a Blob to a File
const blob = new Blob(['Hello world'], { type: 'text/plain' });
const file = convertBlobToFile(blob, 'hello.txt');

console.log(file instanceof File); // true
console.log(file.name); // 'hello.txt'
console.log(file.type); // 'text/plain'
```

### Assert Function

```ts
import { assert } from '@react-hive/honey-utils';

// Assert a condition
function divide(a: number, b: number): number {
  assert(b !== 0, 'Cannot divide by zero');
  return a / b;
}
```

## API Documentation

### String Utilities

- `toKebabCase(input: string): string` - Converts a string to kebab-case.
- `camelToDashCase(input: string): string` - Converts camelCase to dash-case.
- `splitStringIntoWords(input: string): string[]` - Splits a string into an array of words.
- `hashString(input: string): string` - Generates a short hash from a string.

### Array Utilities

- `compact<T>(array: (T | Falsy)[]): T[]` – Returns a new array with all falsy values (false, null, undefined, 0, '', NaN) removed, preserving only truthy items of type `T`.
- `unique<T>(array: T[]): T[]` - Returns a new array with all duplicate elements removed. Keeps only the first occurrence of each value.
- `chunk<T>(array: T[], size: number): T[][]` - Splits an array into smaller arrays ("chunks") of the specified size.
- `intersection<T>(...arrays: T[][]): T[]` - Returns an array of elements that exist in all provided arrays.
- `difference<T>(array: T[], exclude: T[]): T[]` - Returns a new array that contains items from `array` that are not present in `exclude`.
- `pipe(...fns: Function[]): Function` - Composes unary functions left-to-right. Returns a new function that applies all given functions in a sequence.
- `compose(...fns: Function[]): Function` - Composes unary functions **right-to-left**. Same as `pipe`, but applies functions in reverse order.

### Function Utilities

- `noop(): void` - A no-operation function.
- `not<Args extends any[]>(fn: (...args: Args) => any): (...args: Args) => boolean` - Creates a new function that negates the result of the given predicate function. Useful for logical inversions, e.g., turning `isEven` into `isOdd`.
- `invokeIfFunction<Args extends any[], Result>(input: ((...args: Args) => Result) | Result, ...args: Args): Result` - Invokes the input if it's a function, otherwise returns it as-is.
- `delay(delayMs: number): Promise<void>` - Creates a promise that resolves after the specified delay in milliseconds.
- `timeout<T>(promise: Promise<T>, timeoutMs: number, message?: string): Promise<T>` - Wraps a promise with a timeout. If the promise does not settle within the given duration, it rejects with a timeout error.
- `retry<Task, TaskResult>(task: Task, options?: RetryOptions): Function` - Wraps an asynchronous function with retry logic, with configurable max attempts, delay between retries, exponential backoff, and retry callbacks.

### Type Guards

- `assert(condition: any, message: string): asserts condition` - Asserts that a condition is truthy, throwing an error with the provided message if it's not.
- `isString(value: unknown): value is string` - Checks if a value is a `string`.
- `isNumber(value: unknown): value is number` - Checks if a value is a `number`.
- `isBool(value: unknown): value is boolean` - Checks if a value is a `boolean`.
- `isObject(value: unknown): value is object` - Checks if a value is an `object`.
- `isFunction(value: unknown): value is Function` - Checks if a value is a `function`.
- `isPromise<T = unknown>(value: unknown): value is Promise<T>` - Checks if a value is a `Promise`.
- `isNil(value: unknown): value is null | undefined` - Checks if a value is `null` or `undefined`.
- `isNilOrEmptyString(value: unknown): value is null | undefined` - Checks if a value is `null`, `undefined`, or an empty string.
- `isArray(value: unknown): value is unknown[]` - Checks if a value is an array.
- `isEmptyArray(value: unknown): value is []` - Checks if a value is an empty array.
- `isEmptyObject(value: unknown): value is Record<string, never>` - Checks if a value is an empty object.
- `isNull(value: unknown): value is null` - Checks if a value is `null`.
- `isUndefined(value: unknown): value is undefined` - Checks if a value is `undefined`.
- `isDefined<T>(value: T): value is NonNullable<T>` - Checks if a value is neither `null` nor `undefined`.
- `isFiniteNumber(value: unknown): value is number` - Checks if a value is a finite number.
- `isInteger(value: unknown): value is number` - Checks if a value is an integer.
- `isDate(value: unknown): value is Date` - Checks if a value is a `Date` object.
- `isValidDate(value: unknown): value is Date` - Checks if a value is a valid `Date` object.
- `isRegExp(value: unknown): value is RegExp` - Checks if a value is a `RegExp` object.
- `isMap(value: unknown): value is Map<unknown, unknown>` - Checks if a value is a `Map`.
- `isSet(value: unknown): value is Set<unknown>` - Checks if a value is a `Set`.
- `isSymbol(value: unknown): value is symbol` - Checks if a value is a `Symbol`.

### Math Utilities

- `calculateEuclideanDistance(startX: number, startY: number, endX: number, endY: number): number` - Calculates the Euclidean distance between two points.
- `calculateMovingSpeed(distance: number, elapsedTime: number): number` - Calculates moving speed.
- `calculatePercentage(value: number, percentage: number): number` - Calculates the specified percentage of a value.

### DOM Utilities

- `parse2DMatrix(element: HTMLElement): { translateX: number, translateY: number, scaleX: number, scaleY: number, skewX: number, skewY: number }` - Extracts transformation values (translate, scale, skew) from the 2D transformation matrix of a given HTML element.
- `cloneBlob(blob: Blob): Blob` - Creates a clone of a Blob object with the same content and type as the original.
- `convertBlobToFile(blob: Blob, fileName: string): File` - Converts a Blob object into a File object with the specified name.
- `getDOMRectIntersectionRatio(sourceRect: DOMRect, targetRect: DOMRect): number` - Calculates the ratio of the `targetRect` that is overlapped by the `sourceRect`. Returns a number between `0` (no overlap) and `1` (fully covered).
- `getElementOffsetRect(element: HTMLElement): DOMRect` - Returns a `DOMRect` representing the element's layout position using `offsetLeft`, `offsetTop`, and `clientWidth`/`clientHeight`.

### Asynchronous Utilities

- `runSequential<Item, Result>(array: Item[], fn: (item, index, array) => Promise<Result>): Promise<Result[]>` - Runs asynchronous operations on each array item *sequentially* and returns the results in the original order.
- `runParallel<Item, Result>(array: Item[], fn: (item, index, array) => Promise<Result>): Promise<Result[]>` - Executes an asynchronous function for each array item *in parallel* and returns a promise of all results.
- `reduceAsync<Item, Accumulator>(array: Item[], fn, initialValue): Promise<Accumulator>` - Asynchronously reduces an array to a single accumulated value. Each step waits for the previous promise to resolve.
- `filterSequential<Item>(array: Item[], predicate): Promise<Item[]>` – Filters an array using an asynchronous predicate sequentially. Each item is processed one after another, and only those for which predicate(item) returns true are included in the result.
- `filterParallel<Item>(array: Item[], predicate): Promise<Item[]>` – Filters an array using an asynchronous predicate in parallel. Returns a promise that resolves with only the items for which predicate(item) returns `true`.
- `someAsync<Item>(array: Item[], predicate): Promise<boolean>` - Returns `true` if **any** item in the array passes the async predicate.
- `everyAsync<Item>(array: Item[], predicate): Promise<boolean>` - Returns `true` if **all** items in the array pass the async predicate.
- `findAsync<Item>(array: Item[], predicate): Promise<Item | null>` - Returns the first array item that passes the async predicate, or `null` if no match is found.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Mykhailo Aliinyk <m.aliynik@gmail.com>