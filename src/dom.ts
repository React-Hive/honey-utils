export const FOCUSABLE_HTML_TAGS = ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'A'];

interface HTMLElementTransformationValues {
  translateX: number;
  translateY: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
}

/**
 * Extracts transformation values (translate, scale, skew) from the 2D transformation matrix of a given HTML element.
 *
 * Only works with 2D transforms (i.e., `matrix(a, b, c, d, e, f)`).
 *
 * @param element - The element with a CSS transform applied.
 * @returns An object with parsed transformation values.
 *
 * @example
 * ```ts
 * const values = parse2DMatrix(myElement);
 * console.log(values.translateX);
 * console.log(values.scaleX);
 * ```
 */
export const parse2DMatrix = (element: HTMLElement): HTMLElementTransformationValues => {
  const computedStyles = window.getComputedStyle(element);
  const transformValue = computedStyles.getPropertyValue('transform');

  const matrixMatch = transformValue.match(/^matrix\((.+)\)$/);
  if (!matrixMatch) {
    return {
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      skewY: 0,
    };
  }

  const [scaleX, skewY, skewX, scaleY, translateX, translateY] = matrixMatch[1]
    .split(', ')
    .map(parseFloat);

  return {
    translateX,
    translateY,
    scaleX,
    scaleY,
    skewX,
    skewY,
  };
};

/**
 * Creates a clone of a Blob object.
 *
 * @param blob - The Blob object to clone.
 *
 * @returns A new Blob with the same content and type as the original.
 */
export const cloneBlob = (blob: Blob): Blob => new Blob([blob], { type: blob.type });

/**
 * Calculates the intersection ratio between two DOM rectangles.
 *
 * The ratio represents the proportion of the `targetRect` that is covered by `sourceRect`.
 * A value of `1` means `sourceRect` completely covers `targetRect`, and `0` means no overlap.
 *
 * @param sourceRect - The rectangle used to measure overlap against the target.
 * @param targetRect - The rectangle whose covered area is measured.
 *
 * @returns A number between `0` and `1` representing the intersection ratio.
 */
export const getDOMRectIntersectionRatio = (sourceRect: DOMRect, targetRect: DOMRect): number => {
  const xOverlap = Math.max(
    0,
    Math.min(sourceRect.right, targetRect.right) - Math.max(sourceRect.left, targetRect.left),
  );

  const yOverlap = Math.max(
    0,
    Math.min(sourceRect.bottom, targetRect.bottom) - Math.max(sourceRect.top, targetRect.top),
  );

  const intersectionArea = xOverlap * yOverlap;
  const targetArea = targetRect.width * targetRect.height;

  return intersectionArea / targetArea;
};

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
export const isHtmlElementFocusable = (element: HTMLElement | null): boolean => {
  if (!element) {
    return false;
  }

  // Hidden or not rendered
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

/**
 * Determines whether the browser environment allows safe read access to
 * `localStorage`. Some platforms (e.g., Safari Private Mode, sandboxed iframes)
 * expose `localStorage` but still throw when accessed.
 *
 * This function **only tests read access**, making it safe even when write
 * operations would fail due to `QuotaExceededError` or storage restrictions.
 *
 * @returns `true` if `localStorage` exists and calling `getItem()` does not
 *          throw; otherwise `false`.
 */
export const isLocalStorageReadable = (): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.getItem('__non_existing_key__');
    return true;
  } catch {
    return false;
  }
};

interface LocalStorageCapabilities {
  readable: boolean;
  writable: boolean;
}

interface LocalStorageCapabilities {
  readable: boolean;
  writable: boolean;
}

/**
 * Determines whether the browser's `localStorage` supports safe read and write operations.
 * This function performs two independent checks:
 *
 * **1. Readability**
 * - Verified by calling `localStorage.getItem()` inside a `try` block.
 * - Fails in environments where storage access throws immediately (e.g., disabled storage,
 *   sandboxed iframes, strict privacy modes, SSR).
 *
 * **2. Writeability**
 * - Verified by attempting to `setItem()` and then `removeItem()` using a temporary key.
 * - Can fail due to:
 *   - `QuotaExceededError` when storage is full.
 *   - Disabled write access (e.g., Safari Private Mode).
 *   - Security-restricted contexts (third-party frames, hardened privacy settings)
 *
 * @returns An object describing the detected `localStorage` capabilities.
 */
export const getLocalStorageCapabilities = (): LocalStorageCapabilities => {
  const readable = isLocalStorageReadable();
  if (!readable) {
    return {
      readable: false,
      writable: false,
    };
  }

  try {
    const key = '__test_write__';

    window.localStorage.setItem(key, '1');
    window.localStorage.removeItem(key);

    return {
      readable: true,
      writable: true,
    };
  } catch {
    // Readable but not writable (QuotaExceededError, private mode, security restrictions)
  }

  return {
    readable: true,
    writable: false,
  };
};
