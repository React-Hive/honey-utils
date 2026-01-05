/**
 * Checks whether an element has horizontal overflow.
 *
 * @param element - The element to check.
 *
 * @returns `true` if the content overflows horizontally.
 */
export const hasXOverflow = (element: HTMLElement): boolean =>
  element.scrollWidth > element.clientWidth;

/**
 * Calculates the horizontal overflow width of an element.
 *
 * The overflow width represents how much wider the content is compared
 * to the visible container area.
 *
 * @param element - The scrollable container element.
 *
 * @returns The overflow width in pixels. Returns `0` when the content does not overflow horizontally.
 */
export const getXOverflowWidth = (element: HTMLElement): number =>
  Math.max(0, element.scrollWidth - element.clientWidth);

/**
 * Checks whether an element has vertical overflow.
 *
 * @param element - The element to check.
 *
 * @returns `true` if the content overflows vertically.
 */
export const hasYOverflow = (element: HTMLElement): boolean =>
  element.scrollHeight > element.clientHeight;

/**
 * Calculates the vertical overflow height of an element.
 *
 * The overflow height represents how much taller the content is compared
 * to the visible container area.
 *
 * @param element - The scrollable container element.
 *
 * @returns The overflow height in pixels. Returns `0` when the content does not overflow vertically.
 */
export const getYOverflowHeight = (element: HTMLElement): number =>
  Math.max(0, element.scrollHeight - element.clientHeight);
