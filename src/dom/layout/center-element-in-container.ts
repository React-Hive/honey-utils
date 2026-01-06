import { getXOverflowWidth, getYOverflowHeight } from '~/dom';
import { calculateCenterOffset } from '~/geometry';

type Axis = 'x' | 'y' | 'both';

export interface CenterElementInContainerOptions {
  /**
   * Axis (or axes) along which centering is applied.
   *
   * @default 'both'
   */
  axis?: Axis;
}

/**
 * Translates a container so that a target element is visually centered within its visible bounds.
 *
 * Centering is achieved by applying a CSS `transform: translate(...)` to the
 * container element rather than using native scrolling.
 *
 * ### Behavior
 * - Centering is calculated independently for each enabled axis.
 * - Translation is applied only when the container content overflows on that axis.
 * - When no overflow exists, the container remains untransformed for that axis.
 *
 * ### Notes
 * - This function performs immediate DOM reads and writes.
 * - The resulting transform is clamped to valid scrollable bounds.
 *
 * @param containerElement - The container whose content is translated.
 * @param elementToCenter - The descendant element to align to the container’s center.
 * @param options - Optional configuration controlling which axis or axes are centered.
 */
export const centerElementInContainer = (
  containerElement: HTMLElement,
  elementToCenter: HTMLElement,
  { axis = 'both' }: CenterElementInContainerOptions = {},
): void => {
  let translateX = 0;
  let translateY = 0;

  if (axis === 'x' || axis === 'both') {
    translateX = calculateCenterOffset({
      overflowSize: getXOverflowWidth(containerElement),
      containerSize: containerElement.clientWidth,
      elementOffset: elementToCenter.offsetLeft,
      elementSize: elementToCenter.clientWidth,
    });
  }

  if (axis === 'y' || axis === 'both') {
    translateY = calculateCenterOffset({
      overflowSize: getYOverflowHeight(containerElement),
      containerSize: containerElement.clientHeight,
      elementOffset: elementToCenter.offsetTop,
      elementSize: elementToCenter.clientHeight,
    });
  }

  containerElement.style.transform = `translate(${translateX}px, ${translateY}px)`;
};
