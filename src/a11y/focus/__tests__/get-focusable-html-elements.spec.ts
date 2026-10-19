// @vitest-environment jsdom
import { getFocusableHtmlElements } from '~/a11y';

const render = (html: string): HTMLElement => {
  document.body.innerHTML = html;

  return document.body.firstElementChild as HTMLElement;
};

const getIds = (elements: HTMLElement[]) => elements.map(element => element.id);

describe('[getFocusableHtmlElements]: the focusable descendants of a container', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should return the focusable descendants in DOM order', () => {
    const container = render(`
      <div>
        <button id="save">Save</button>
        <div id="card">Card</div>
        <a id="link" href="/products">Products</a>
        <section>
          <span id="chip" tabindex="0">Chip</span>
          <input id="name" type="text">
        </section>
        <div id="editor" contenteditable="true"></div>
        <textarea id="notes"></textarea>
      </div>
    `);

    expect(getIds(getFocusableHtmlElements(container))).toStrictEqual([
      'save',
      'link',
      'chip',
      'name',
      'editor',
      'notes',
    ]);
  });

  it('should keep DOM order over positive tabindex values', () => {
    const container = render(`
      <div>
        <div id="third" tabindex="3"></div>
        <div id="first" tabindex="1"></div>
        <div id="second" tabindex="2"></div>
      </div>
    `);

    expect(getIds(getFocusableHtmlElements(container))).toStrictEqual(['third', 'first', 'second']);
  });

  it('should leave out disabled, hidden and removed-from-order elements', () => {
    const container = render(`
      <div>
        <button id="enabled">Save</button>
        <button id="disabled" disabled>Delete</button>
        <button id="hidden" hidden>Archive</button>
        <button id="none" style="display: none">Restore</button>
        <button id="invisible" style="visibility: hidden">Copy</button>
        <div id="removed" tabindex="-1"></div>
        <a id="placeholder">Products</a>
      </div>
    `);

    expect(getIds(getFocusableHtmlElements(container))).toStrictEqual(['enabled']);
  });

  it('should leave out the container itself', () => {
    const container = render(`
      <div id="container" tabindex="0">
        <button id="save">Save</button>
      </div>
    `);

    expect(getIds(getFocusableHtmlElements(container))).toStrictEqual(['save']);
  });

  it('should return an empty array when nothing in the container is focusable', () => {
    const container = render(`
      <div>
        <p>Text</p>
        <span>Label</span>
      </div>
    `);

    expect(getFocusableHtmlElements(container)).toStrictEqual([]);
  });
});
