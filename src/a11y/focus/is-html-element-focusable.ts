import type { Nullable } from '~/types';
import { isAnchorHtmlElement, isContentEditableHtmlElement } from '~/dom';

export const FOCUSABLE_HTML_TAGS = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'A'];

/**
 * A `tabindex` attribute's value, read by the HTML rules for parsing integers - leading whitespace
 * and a sign allowed, anything after the digits ignored - or `null` where there is none to read.
 */
const parseTabIndex = (value: Nullable<string>): Nullable<number> => {
  const match = value === null ? null : /^\s*([+-]?\d+)/.exec(value);

  return match ? parseInt(match[1], 10) : null;
};

/**
 * Determines whether an HTMLElement is focusable under standard browser rules.
 *
 * The function checks a combination of factors:
 * - The element must be rendered: neither it nor an ancestor has `display: none`, and it is not
 *   `visibility: hidden`.
 * - Disabled form controls are never focusable - including those inside a disabled `<fieldset>`.
 * - Elements with a negative `tabindex` are intentionally removed from the focus order.
 * - Any element with a valid, non-negative `tabindex` is focusable. A `tabindex` that is not an
 *   integer is ignored, as browsers ignore it.
 * - Certain native HTML elements are inherently focusable (e.g. inputs, buttons, anchors with `href`).
 * - Editable elements (`contenteditable`) are treated as focusable.
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

  if (window.getComputedStyle(element).visibility === 'hidden') {
    return false;
  }

  // `display: none` does not inherit, so a hidden ancestor has to be looked for
  for (let node: Nullable<Element> = element; node; node = node.parentElement) {
    if (window.getComputedStyle(node).display === 'none') {
      return false;
    }
  }

  // `:disabled` covers a control inside a disabled `<fieldset>`, which `element.disabled` does not
  if (element.matches(':disabled')) {
    return false;
  }

  const tabIndex = parseTabIndex(element.getAttribute('tabindex'));

  if (tabIndex !== null) {
    return tabIndex >= 0;
  }

  if (FOCUSABLE_HTML_TAGS.includes(element.tagName)) {
    if (isAnchorHtmlElement(element)) {
      return element.href !== '';
    }

    return true;
  }

  return isContentEditableHtmlElement(element);
};
