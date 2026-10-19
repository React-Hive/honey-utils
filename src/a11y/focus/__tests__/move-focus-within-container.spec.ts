// @vitest-environment jsdom
import type { Nullable } from '~/types';
import type { FocusMoveDirection } from '~/a11y';
import { moveFocusWithinContainer } from '~/a11y';

const getElement = (id: string) => document.getElementById(id) as HTMLElement;

const getIds = (elements: HTMLElement[]) => elements.map(element => element.id);

describe('[moveFocusWithinContainer]: move focus to the next or previous element of a container', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="menu">
        <button id="first">First</button>
        <span>Separator</span>
        <button id="disabled" disabled>Disabled</button>
        <a id="second" href="/second">Second</a>
        <div id="third" tabindex="0">Third</div>
      </div>
      <button id="outside">Outside</button>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should move focus to the next focusable element', () => {
    getElement('first').focus();

    moveFocusWithinContainer('next', getElement('menu'));

    expect(document.activeElement).toBe(getElement('second'));
  });

  it('should move focus to the previous focusable element', () => {
    getElement('third').focus();

    moveFocusWithinContainer('previous', getElement('menu'));

    expect(document.activeElement).toBe(getElement('second'));
  });

  it('should wrap from the last element to the first by default', () => {
    getElement('third').focus();

    moveFocusWithinContainer('next', getElement('menu'));

    expect(document.activeElement).toBe(getElement('first'));
  });

  it('should wrap from the first element to the last by default', () => {
    getElement('first').focus();

    moveFocusWithinContainer('previous', getElement('menu'));

    expect(document.activeElement).toBe(getElement('third'));
  });

  it('should keep focus on the last element when wrapping is off', () => {
    getElement('third').focus();

    moveFocusWithinContainer('next', getElement('menu'), { wrap: false });

    expect(document.activeElement).toBe(getElement('third'));
  });

  it('should keep focus on the first element when wrapping is off', () => {
    getElement('first').focus();

    moveFocusWithinContainer('previous', getElement('menu'), { wrap: false });

    expect(document.activeElement).toBe(getElement('first'));
  });

  it('should still move between elements when wrapping is off', () => {
    getElement('first').focus();

    moveFocusWithinContainer('next', getElement('menu'), { wrap: false });

    expect(document.activeElement).toBe(getElement('second'));
  });

  it('should use the parent of the focused element without a container', () => {
    document.body.innerHTML = `
      <div>
        <button id="bold">Bold</button>
        <button id="italic">Italic</button>
      </div>
      <div>
        <button id="undo">Undo</button>
      </div>
    `;
    getElement('italic').focus();

    moveFocusWithinContainer('next');

    expect(document.activeElement).toBe(getElement('bold'));
  });

  it('should do nothing when the focused element is outside the container', () => {
    getElement('outside').focus();

    moveFocusWithinContainer('next', getElement('menu'));

    expect(document.activeElement).toBe(getElement('outside'));
  });

  it('should do nothing when nothing is focused', () => {
    moveFocusWithinContainer('next', getElement('menu'));

    expect(document.activeElement).toBe(document.body);
  });

  it('should do nothing when the container has no focusable elements', () => {
    document.body.innerHTML = `
      <div id="empty"><span>Text</span></div>
      <button id="outside">Outside</button>
    `;
    getElement('outside').focus();

    moveFocusWithinContainer('next', getElement('empty'));

    expect(document.activeElement).toBe(getElement('outside'));
  });

  it('should pass the current index, the direction and the elements to getNextIndex', () => {
    const getNextIndex = vi.fn<
      (
        currentIndex: number,
        direction: FocusMoveDirection,
        elements: HTMLElement[],
      ) => Nullable<number>
    >(() => null);
    getElement('second').focus();

    moveFocusWithinContainer('previous', getElement('menu'), { getNextIndex });

    expect(getNextIndex).toHaveBeenCalledTimes(1);

    const [currentIndex, direction, elements] = getNextIndex.mock.calls[0];

    expect(currentIndex).toBe(1);
    expect(direction).toBe('previous');
    expect(getIds(elements)).toStrictEqual(['first', 'second', 'third']);
  });

  it('should focus the element at the index getNextIndex returns', () => {
    getElement('first').focus();

    moveFocusWithinContainer('next', getElement('menu'), {
      getNextIndex: (_currentIndex, _direction, elements) => elements.length - 1,
    });

    expect(document.activeElement).toBe(getElement('third'));
  });

  it('should let getNextIndex override wrapping', () => {
    getElement('third').focus();

    moveFocusWithinContainer('next', getElement('menu'), {
      wrap: false,
      getNextIndex: () => 0,
    });

    expect(document.activeElement).toBe(getElement('first'));
  });

  it('should keep focus where it is when getNextIndex returns null', () => {
    getElement('first').focus();

    moveFocusWithinContainer('next', getElement('menu'), { getNextIndex: () => null });

    expect(document.activeElement).toBe(getElement('first'));
  });
});
