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
 * Unlike `getBoundingClientRect()`, the rect is the element's layout box, before any CSS
 * transform - so it stays put while the element or its container is being translated or scaled.
 * Reading it still needs layout, as `getBoundingClientRect()` does.
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
 * Browsers treat editable elements as focusable, even if they are not normally
 * keyboard-focusable. An element is editable with `contenteditable` set to `""` (the bare
 * attribute), `"true"` or `"plaintext-only"`, in any case.
 *
 * @param element - The element to inspect.
 *
 * @returns True if the element's own `contenteditable` makes it editable.
 */
export const isContentEditableHtmlElement = (element: HTMLElement): boolean => {
  const value = element.getAttribute('contenteditable');

  return value !== null && ['', 'true', 'plaintext-only'].includes(value.toLowerCase());
};
