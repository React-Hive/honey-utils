export const noop = () => {};

/**
 * Invokes the given input if it is a function, passing the provided arguments.
 * Otherwise, returns the input as-is.
 *
 * @template Args - Tuple of argument types to pass to the function.
 * @template Result - Return type of the function or the value.
 *
 * @param input - A function to invoke with `args`, or a direct value of type `Result`.
 * @param args - Arguments to pass if `input` is a function.
 *
 * @returns The result of invoking the function, or the original value if it's not a function.
 */
export const invokeIfFunction = <Args extends any[], Result>(
  input: ((...args: Args) => Result) | Result,
  ...args: Args
): Result => (typeof input === 'function' ? (input as (...args: Args) => Result)(...args) : input);
