import type { Nullable } from '~/types';
import { getFocusableHtmlElements } from '~/a11y';

export type FocusMoveDirection = 'next' | 'previous';

export interface MoveFocusWithinContainerOptions {
  /**
   * Whether focus navigation should wrap around when reaching
   * the beginning or end of the focusable elements list.
   *
   * When enabled, moving past the last element focuses the first,
   * and moving before the first focuses the last.
   *
   * @default true
   */
  wrap?: boolean;
  /**
   * Custom resolver for determining the next focus index.
   *
   * When provided, this function overrides the default navigation logic
   * and receives full control over how the focus moves.
   *
   * @param currentIndex - Index of the currently focused element.
   * @param direction - Direction in which focus is moving.
   * @param elements - Ordered list of focusable elements within the container.
   *
   * @returns The index of the element to focus next, or `null` to prevent focus movement.
   */
  getNextIndex?: (
    currentIndex: number,
    direction: FocusMoveDirection,
    elements: HTMLElement[],
  ) => Nullable<number>;
}

/**
 * Moves focus to the next or previous focusable element within a container.
 *
 * This utility is commonly used to implement accessible keyboard navigation patterns such as:
 * - roving tabindex
 * - custom dropdowns
 * - tablists
 * - menus
 * - horizontal or vertical navigation groups
 *
 * Focus movement is scoped to a container and operates on the list of
 * focusable descendants returned by `getFocusableHtmlElements`.
 *
 * @param direction - Direction in which focus should move (`'next'` or `'previous'`).
 * @param container - Optional container that defines the focus scope.
 *  If omitted, the parent element of the currently focused element is used.
 * @param options - Optional configuration controlling wrapping behavior and custom index resolution.
 *
 * @remarks
 * - This function reads from and mutates the document's focus state.
 * - If no active element exists, no container can be resolved,
 *   or the active element is not part of the focusable set, no action is taken.
 * - When `getNextIndex` is provided, it fully overrides the default wrapping and directional logic.
 */
export const moveFocusWithinContainer = (
  direction: FocusMoveDirection,
  container: Nullable<HTMLElement> = null,
  { wrap = true, getNextIndex }: MoveFocusWithinContainerOptions = {},
): void => {
  const activeElement = document.activeElement as Nullable<HTMLElement>;
  const scope = container ?? activeElement?.parentElement;

  if (!activeElement || !scope) {
    return;
  }

  const focusableElements = getFocusableHtmlElements(scope);
  if (focusableElements.length === 0) {
    return;
  }

  const currentIndex = focusableElements.indexOf(activeElement);
  if (currentIndex === -1) {
    return;
  }

  let nextIndex: Nullable<number>;

  if (getNextIndex) {
    nextIndex = getNextIndex(currentIndex, direction, focusableElements);
  } else {
    if (direction === 'next') {
      nextIndex = currentIndex + 1;

      if (nextIndex >= focusableElements.length) {
        nextIndex = wrap ? 0 : null;
      }
    } else {
      nextIndex = currentIndex - 1;

      if (nextIndex < 0) {
        nextIndex = wrap ? focusableElements.length - 1 : null;
      }
    }
  }

  if (nextIndex === null) {
    return;
  }

  focusableElements[nextIndex]?.focus();
};
