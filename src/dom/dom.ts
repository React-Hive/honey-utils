/**
 * Creates a clone of a Blob object.
 *
 * @param blob - The Blob object to clone.
 *
 * @returns A new Blob with the same content and type as the original.
 */
export const cloneBlob = (blob: Blob): Blob => new Blob([blob], { type: blob.type });

/**
 * Returns the bounding DOMRect of an element based on offset and client dimensions.
 *
 * This utility is useful when you need a stable, layout-based rect
 * without triggering a reflow via `getBoundingClientRect()`.
 *
 * @param element - The target HTML element.
 * @returns A `DOMRect` representing the element’s offset position and size.
 */
export const getElementOffsetRect = (element: HTMLElement): DOMRect =>
  new DOMRect(element.offsetLeft, element.offsetTop, element.clientWidth, element.clientHeight);

/**
 * Determines whether the given HTMLElement is an HTMLAnchorElement.
 *
 * Acts as a type guard so that TypeScript narrows `element` to
 * `HTMLAnchorElement` when the function returns `true`.
 *
 * An element qualifies as an anchor by having a tag name of `"A"`.
 *
 * @param element - The element to test.
 *
 * @returns Whether the element is an anchor element.
 */
export const isAnchorHtmlElement = (element: HTMLElement): element is HTMLAnchorElement =>
  element.tagName === 'A';

/**
 * Checks whether an element is explicitly marked as contenteditable.
 *
 * Browsers treat elements with `contenteditable="true"` as focusable,
 * even if they are not normally keyboard-focusable.
 *
 * @param element - The element to inspect.
 *
 * @returns True if `contenteditable="true"` is set.
 */
export const isContentEditableHtmlElement = (element: HTMLElement) =>
  element.getAttribute('contenteditable') === 'true';
