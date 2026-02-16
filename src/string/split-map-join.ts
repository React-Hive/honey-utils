/**
 * Splits a string into parts, transforms each part, then joins them back together.
 *
 * Common use cases:
 *
 * - Transforming selector groups:
 *
 * ```ts
 * splitMapJoin(".a, .b", ",", part => `.scope ${part}`);
 * // ".scope .a, .scope .b"
 * ```
 *
 * - Normalizing spacing:
 *
 * ```ts
 * splitMapJoin("a ,  b ,c", ",", part => part);
 * // "a,b,c"
 * ```
 *
 * - Custom join formatting:
 *
 * ```ts
 * splitMapJoin("a,b,c", ",", part => part.toUpperCase(), ".");
 * // "A.B.C"
 * ```
 *
 * @param input - The raw input string to process.
 * @param separator - The delimiter used to split the input (e.g. `","`, `" "`).
 * @param mapFn - Function applied to each trimmed part.
 * @param joinWith - Optional join separator (defaults to the same value as `separator`).
 *
 * @returns The transformed and re-joined string.
 */
export const splitMapJoin = (
  input: string,
  separator: string,
  mapFn: (part: string, index: number) => string,
  joinWith: string = separator,
): string =>
  input
    .split(separator)
    .map((part, index) => mapFn(part.trim(), index))
    .join(joinWith);
