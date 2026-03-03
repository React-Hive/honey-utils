import { assert } from '~/guards';

/**
 * Represents a hexadecimal CSS color value.
 *
 * This type enforces a leading `#`, but does not validate length
 * at the type level (e.g. `#RGB`, `#RRGGBB`, `#RRGGBBAA`).
 *
 * Valid runtime examples:
 * - `#fff`
 * - `#ffffff`
 * - `#ffffffff`
 */
export type HexColor = `#${string}`;

/**
 * Adds an alpha channel to a 3- or 6-digit HEX color.
 *
 * Accepts `#RGB`, `#RRGGBB`, `RGB`, or `RRGGBB` formats
 * and returns a normalized 8-digit HEX color in `#RRGGBBAA` format.
 *
 * The alpha value is converted to a two-digit hexadecimal
 * representation using `Math.round(alpha * 255)`.
 *
 * @param input - Base HEX color (3 or 6 hex digits, with or without `#`).
 * @param alpha - Opacity value between `0` (transparent) and `1` (opaque).
 *
 * @throws {Error}
 * - If `alpha` is outside the `[0, 1]` range.
 * - If `hex` is not a valid 3- or 6-digit hexadecimal color.
 *
 * @returns A normalized 8-digit HEX color in `#RRGGBBAA` format.
 *
 * @example
 * ```ts
 * hexWithAlpha('#ff0000', 0.5) // '#FF000080'
 * hexWithAlpha('0f0', 1)       // '#00FF00FF'
 * ```
 */
export const hexWithAlpha = (input: string, alpha: number): HexColor => {
  assert(
    alpha >= 0 && alpha <= 1,
    `[@react-hive/honey-utils]: Alpha "${alpha}" must be a number between 0 and 1.`,
  );

  const hexRegex = /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

  const match = input.match(hexRegex);
  assert(match, `[@react-hive/honey-utils]: Invalid hex format: ${input}`);

  const cleanHex = match[1];

  // Expand 3-character hex to 6-character hex if necessary
  const fullHex =
    cleanHex.length === 3
      ? cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2]
      : cleanHex;

  // Convert to 8-character hex with alpha
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .toUpperCase()
    .padStart(2, '0');

  return `#${fullHex + alphaHex}`;
};
