import { getXOverflowWidth, getYOverflowHeight } from '~/dom';
import { calculateCenterOffset, clampOffsetToOverflow } from '~/geometry';

type Axis = 'x' | 'y' | 'both';

export interface CenterElementInContainerOptions {
  /**
   * Axis (or axes) along which centering is applied.
   *
   * @default 'both'
   */
  axis?: Axis;
  /**
   * Whether the calculated translate offset should be clamped
   * to the container overflow bounds.
   *
   * @default true
   */
  shouldClamp?: boolean;
}

/**
 * Translates a container so that a target element is visually centered within its visible bounds.
 *
 * Centering is achieved by applying a CSS `transform: translate(...)` to the
 * container element rather than using native scrolling.
 *
 * ### Behavior
 * - Centering is calculated independently for each enabled axis.
 * - Raw centering offset is always calculated first.
 * - Offset clamping is optional and controlled by `shouldClamp`.
 *
 * ### Notes
 * - This function performs immediate DOM reads and writes.
 *
 * @param containerElement - The container whose content is translated.
 * @param elementToCenter - The descendant element to align to the container’s center.
 * @param options - Optional configuration controlling centering behavior.
 */
export const centerElementInContainer = (
  containerElement: HTMLElement,
  elementToCenter: HTMLElement,
  { axis = 'both', shouldClamp = true }: CenterElementInContainerOptions = {},
): void => {
  let translateX = 0;
  let translateY = 0;

  if (axis === 'x' || axis === 'both') {
    const offsetX = calculateCenterOffset({
      containerSize: containerElement.clientWidth,
      elementOffset: elementToCenter.offsetLeft,
      elementSize: elementToCenter.clientWidth,
    });

    translateX = shouldClamp
      ? clampOffsetToOverflow(offsetX, getXOverflowWidth(containerElement))
      : offsetX;
  }

  if (axis === 'y' || axis === 'both') {
    const offsetY = calculateCenterOffset({
      containerSize: containerElement.clientHeight,
      elementOffset: elementToCenter.offsetTop,
      elementSize: elementToCenter.clientHeight,
    });

    translateY = shouldClamp
      ? clampOffsetToOverflow(offsetY, getYOverflowHeight(containerElement))
      : offsetY;
  }

  containerElement.style.transform = `translate(${translateX}px, ${translateY}px)`;
};
