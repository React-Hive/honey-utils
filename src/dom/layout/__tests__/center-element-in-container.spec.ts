// @vitest-environment jsdom
import { centerElementInContainer } from '~/dom';

const createElement = (layout: Record<string, number>): HTMLElement => {
  const element = document.createElement('div');

  Object.entries(layout).forEach(([property, value]) => {
    Object.defineProperty(element, property, { value, configurable: true });
  });

  return element;
};

/**
 * 300 x 200 visible, 1000 x 800 of content: up to 700px of overflow across and 600px down.
 */
const createContainer = () =>
  createElement({ clientWidth: 300, clientHeight: 200, scrollWidth: 1000, scrollHeight: 800 });

/**
 * Centre at (550, 425): 400px right of the container's centre (150) and 325px below it (100).
 */
const createMiddleElement = () =>
  createElement({ offsetLeft: 500, clientWidth: 100, offsetTop: 400, clientHeight: 50 });

/**
 * Centre at (70, 35): left of and above the container's centre.
 */
const createStartElement = () =>
  createElement({ offsetLeft: 20, clientWidth: 100, offsetTop: 10, clientHeight: 50 });

/**
 * Centre at (975, 790): 825px right of the container's centre and 690px below it.
 */
const createEndElement = () =>
  createElement({ offsetLeft: 950, clientWidth: 50, offsetTop: 780, clientHeight: 20 });

describe('[centerElementInContainer]: translate a container to centre an element in it', () => {
  it('should translate the container on both axes by default', () => {
    const container = createContainer();

    centerElementInContainer(container, createMiddleElement());

    expect(container.style.transform).toBe('translate(-400px, -325px)');
  });

  it('should only translate across for the x axis', () => {
    const container = createContainer();

    centerElementInContainer(container, createMiddleElement(), { axis: 'x' });

    expect(container.style.transform).toBe('translate(-400px, 0px)');
  });

  it('should only translate down for the y axis', () => {
    const container = createContainer();

    centerElementInContainer(container, createMiddleElement(), { axis: 'y' });

    expect(container.style.transform).toBe('translate(0px, -325px)');
  });

  it('should not translate past the start of the content', () => {
    const container = createContainer();

    centerElementInContainer(container, createStartElement());

    expect(container.style.transform).toBe('translate(0px, 0px)');
  });

  it('should not translate past the end of the content', () => {
    const container = createContainer();

    centerElementInContainer(container, createEndElement());

    expect(container.style.transform).toBe('translate(-700px, -600px)');
  });

  it('should not translate along an axis whose content does not overflow', () => {
    const container = createElement({
      clientWidth: 300,
      clientHeight: 200,
      scrollWidth: 300,
      scrollHeight: 800,
    });

    centerElementInContainer(container, createMiddleElement());

    expect(container.style.transform).toBe('translate(0px, -325px)');
  });

  it('should apply the raw centring offset when clamping is off', () => {
    const startContainer = createContainer();
    const endContainer = createContainer();

    centerElementInContainer(startContainer, createStartElement(), { shouldClamp: false });
    centerElementInContainer(endContainer, createEndElement(), { shouldClamp: false });

    expect(startContainer.style.transform).toBe('translate(80px, 65px)');
    expect(endContainer.style.transform).toBe('translate(-825px, -690px)');
  });

  it('should replace the transform the container had', () => {
    const container = createContainer();
    container.style.transform = 'translate(-100px, -50px)';

    centerElementInContainer(container, createMiddleElement());

    expect(container.style.transform).toBe('translate(-400px, -325px)');
  });

  it('should leave the element to centre untouched', () => {
    const element = createMiddleElement();

    centerElementInContainer(createContainer(), element);

    expect(element.style.transform).toBe('');
  });
});
