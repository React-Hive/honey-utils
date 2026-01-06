import { isHtmlElementFocusable } from '~/a11y';

/**
 * Collects all focusable descendant elements within a container.
 *
 * The function queries *all* elements under the container and filters them
 * using `isHtmlElementFocusable`, producing a reliable list of elements
 * that can receive keyboard focus in real-world browser conditions.
 *
 * @param container - The root container whose focusable children will be found.
 *
 * @returns An array of focusable HTMLElements in DOM order.
 */
export const getFocusableHtmlElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>('*')).filter(isHtmlElementFocusable);
