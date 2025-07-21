# @react-hive/honey-utils

[![npm version](https://img.shields.io/npm/v/@react-hive/honey-utils.svg)](https://www.npmjs.com/package/@react-hive/honey-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

```typescript
// Import specific utilities
import { toKebabCase, isString, boolFilter } from '@react-hive/honey-utils';

// Or import everything
import * as HoneyUtils from '@react-hive/honey-utils';
```

### String Utilities

```typescript
import { toKebabCase, camelToDashCase, splitStringIntoWords, hashString } from '@react-hive/honey-utils';

// Convert string to kebab-case
toKebabCase('helloWorld'); // 'hello-world'

// Convert camelCase to dash-case
camelToDashCase('helloWorld'); // 'hello-world'

// Split string into words
splitStringIntoWords('hello world'); // ['hello', 'world']

// Generate a hash from a string
const hash = hashString('background-color: red;'); // 'e4k1z0x'
```

### Array Utilities

```typescript
import { 
  boolFilter, 
  unique, 
  chunk, 
  intersection, 
  difference 
} from '@react-hive/honey-utils';

// Filter out falsy values from an array
boolFilter([0, 1, false, 2, '', 3, null, undefined, true]); // [1, 2, 3, true]

// Remove duplicate values from an array
unique([1, 2, 2, 3, 1, 4]); // [1, 2, 3, 4]

// Split an array into chunks of specified size
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// Find common elements between arrays
intersection([1, 2, 3], [2, 3, 4]); // [2, 3]

// Find elements in one array not in another
difference([1, 2, 3, 4], [2, 4]); // [1, 3]
```

### Function Utilities

```typescript
import { noop, invokeIfFunction } from '@react-hive/honey-utils';

// No-operation function
noop(); // does nothing

// Invoke if function, otherwise return value
const fn = (x: number) => x * 2;

invokeIfFunction(fn, 5); // 10
invokeIfFunction('not a function', 5); // 'not a function'
```

### Type Guards

```typescript
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

// Check if value is a string
isString('hello'); // true
isString(123); // false

// Check if value is a number
isNumber(123); // true
isNumber('123'); // false

// Check if value is a boolean
isBool(true); // true
isBool('true'); // false

// Check if value is an object
isObject({}); // true
isObject('object'); // false

// Check if value is a function
isFunction(() => {}); // true
isFunction({}); // false

// Check if value is a Promise
isPromise(Promise.resolve()); // true
isPromise({}); // false

// Check if value is null or undefined
isNil(null); // true
isNil(undefined); // true
isNil(''); // false

// Check if value is null, undefined, or empty string
isNilOrEmptyString(''); // true
isNilOrEmptyString(null); // true
isNilOrEmptyString('hello'); // false

// Check if value is an array
isArray([1, 2, 3]); // true
isArray({}); // false

// Check if value is an empty array
isEmptyArray([]); // true
isEmptyArray([1, 2, 3]); // false

// Check if value is an empty object
isEmptyObject({}); // true
isEmptyObject({ key: 'value' }); // false

// Check if value is a Date object
isDate(new Date()); // true
isDate('2023-01-01'); // false

// Check if value is a valid Date object
isValidDate(new Date()); // true
isValidDate(new Date('invalid')); // false

// Check if value is a RegExp
isRegExp(/test/); // true
isRegExp('test'); // false

// Check if value is a Map or Set
isMap(new Map()); // true
isSet(new Set()); // true
```

### Math Utilities

```typescript
import { 
  calculateEuclideanDistance, 
  calculateMovingSpeed, 
  calculatePercentage 
} from '@react-hive/honey-utils';

// Calculate Euclidean distance between two points
calculateEuclideanDistance(0, 0, 3, 4); // 5

// Calculate moving speed
calculateMovingSpeed(100, 5); // 20

// Calculate percentage of a value
calculatePercentage(200, 25); // 50
```

### DOM Utilities

```typescript
import { getTransformationValues } from '@react-hive/honey-utils';

// Get transformation values from an HTML element
const element = document.getElementById('my-element');
if (element) {
  const { translateX, translateY } = getTransformationValues(element);
  
  console.log(`Element is translated by ${translateX}px horizontally and ${translateY}px vertically`);
}
```

### Assert Function

```typescript
import { assert } from '@react-hive/honey-utils';

// Assert a condition
function divide(a: number, b: number): number {
  assert(b !== 0, 'Cannot divide by zero');
  return a / b;
}
```

## API Documentation

### String Utilities

- **toKebabCase(input: string): string** - Converts a string to kebab-case
- **camelToDashCase(input: string): string** - Converts camelCase to dash-case
- **splitStringIntoWords(input: string): string[]** - Splits a string into an array of words
- **hashString(input: string): string** - Generates a short hash from a string

### Array Utilities

- **boolFilter<T>(array: (T | false | null | undefined)[]): T[]** - Filters out falsy values from an array
- **unique<T>(array: T[]): T[]** - Returns a new array with duplicate values removed
- **chunk<T>(array: T[], size: number): T[][]** - Splits an array into chunks of the specified size
- **intersection<T>(...arrays: T[][]): T[]** - Returns an array containing elements that exist in all provided arrays
- **difference<T>(array: T[], exclude: T[]): T[]** - Returns elements from the first array that don't exist in the second array

### Function Utilities

- **noop(): void** - A no-operation function
- **invokeIfFunction<Args extends any[], Result>(input: ((...args: Args) => Result) | Result, ...args: Args): Result** - Invokes the input if it's a function, otherwise returns it as-is

### Type Guards

- **isString(value: unknown): value is string** - Checks if a value is a string
- **isNumber(value: unknown): value is number** - Checks if a value is a number
- **isBool(value: unknown): value is boolean** - Checks if a value is a boolean
- **isObject(value: unknown): value is object** - Checks if a value is an object
- **isFunction(value: unknown): value is Function** - Checks if a value is a function
- **isPromise<T = unknown>(value: unknown): value is Promise<T>** - Checks if a value is a Promise
- **isNil(value: unknown): value is null | undefined** - Checks if a value is null or undefined
- **isNilOrEmptyString(value: unknown): value is null | undefined** - Checks if a value is null, undefined, or an empty string
- **isArray(value: unknown): value is unknown[]** - Checks if a value is an array
- **isEmptyArray(value: unknown): value is []** - Checks if a value is an empty array
- **isEmptyObject(value: unknown): value is Record<string, never>** - Checks if a value is an empty object
- **isNull(value: unknown): value is null** - Checks if a value is null
- **isUndefined(value: unknown): value is undefined** - Checks if a value is undefined
- **isFiniteNumber(value: unknown): value is number** - Checks if a value is a finite number
- **isInteger(value: unknown): value is number** - Checks if a value is an integer
- **isNaN(value: unknown): boolean** - Checks if a value is NaN
- **isDate(value: unknown): value is Date** - Checks if a value is a Date object
- **isValidDate(value: unknown): value is Date** - Checks if a value is a valid Date object (not Invalid Date)
- **isRegExp(value: unknown): value is RegExp** - Checks if a value is a RegExp object
- **isMap(value: unknown): value is Map<unknown, unknown>** - Checks if a value is a Map
- **isSet(value: unknown): value is Set<unknown>** - Checks if a value is a Set
- **isSymbol(value: unknown): value is symbol** - Checks if a value is a Symbol

### Math Utilities

- **calculateEuclideanDistance(startX: number, startY: number, endX: number, endY: number): number** - Calculates the Euclidean distance between two points
- **calculateMovingSpeed(delta: number, elapsedTime: number): number** - Calculates moving speed
- **calculatePercentage(value: number, percentage: number): number** - Calculates the specified percentage of a value

### DOM Utilities

- **getTransformationValues(element: HTMLElement): { translateX: number, translateY: number }** - Gets transformation values from an HTML element

### Other Utilities

- **assert(condition: any, message: string): asserts condition** - Asserts that a condition is truthy, throwing an error with the provided message if it's not

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