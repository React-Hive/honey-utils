import type { Nullable } from '../../types';
import { isAnchorHtmlElement, isContentEditableHtmlElement } from '../../dom';

export const FOCUSABLE_HTML_TAGS = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'A'];

/**
 * Determines whether an HTMLElement is focusable under standard browser rules.
 *
 * The function checks a combination of factors:
 * - The element must be rendered (not `display: none` or `visibility: hidden`).
 * - Disabled form controls are never focusable.
 * - Elements with `tabindex="-1"` are intentionally removed from the focus order.
 * - Certain native HTML elements are inherently focusable (e.g. inputs, buttons, anchors with `href`).
 * - Elements with `contenteditable="true"` are treated as focusable.
 * - Any element with a valid `tabindex` (not null) is considered focusable.
 *
 * This logic approximates how browsers and the accessibility tree
 * determine real-world focusability—not just tabindex presence.
 *
 * @param element - The element to test. `null` or `undefined` will return `false`.
 *
 * @returns Whether the element is focusable.
 */
export const isHtmlElementFocusable = (element: Nullable<HTMLElement>): boolean => {
  if (!element) {
    return false;
  }

  const style = window.getComputedStyle(element);
  if (style.visibility === 'hidden' || style.display === 'none') {
    return false;
  }

  if ('disabled' in element && element.disabled) {
    return false;
  }

  // Explicitly removed from tab order
  const tabIndex = element.getAttribute('tabindex');
  if (tabIndex === '-1') {
    return false;
  }

  if (FOCUSABLE_HTML_TAGS.includes(element.tagName)) {
    if (isAnchorHtmlElement(element)) {
      return element.href !== '';
    }

    return true;
  }

  if (isContentEditableHtmlElement(element)) {
    return true;
  }

  return tabIndex !== null;
};
