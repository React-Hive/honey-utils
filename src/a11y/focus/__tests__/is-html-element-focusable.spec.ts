// @vitest-environment jsdom
import { isHtmlElementFocusable } from '~/a11y';

const render = (html: string): HTMLElement => {
  document.body.innerHTML = html;

  return document.body.firstElementChild as HTMLElement;
};

describe('[isHtmlElementFocusable]: whether an element can take focus', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should return false for null', () => {
    expect(isHtmlElementFocusable(null)).toBe(false);
  });

  it('should return true for native form controls and buttons', () => {
    expect(isHtmlElementFocusable(render('<input type="text">'))).toBe(true);
    expect(isHtmlElementFocusable(render('<select><option>One</option></select>'))).toBe(true);
    expect(isHtmlElementFocusable(render('<textarea></textarea>'))).toBe(true);
    expect(isHtmlElementFocusable(render('<button>Save</button>'))).toBe(true);
  });

  it('should return false for disabled form controls and buttons', () => {
    expect(isHtmlElementFocusable(render('<input type="text" disabled>'))).toBe(false);
    expect(isHtmlElementFocusable(render('<select disabled><option>One</option></select>'))).toBe(
      false,
    );
    expect(isHtmlElementFocusable(render('<textarea disabled></textarea>'))).toBe(false);
    expect(isHtmlElementFocusable(render('<button disabled>Save</button>'))).toBe(false);
  });

  it('should return true for a link with an href', () => {
    expect(isHtmlElementFocusable(render('<a href="/products">Products</a>'))).toBe(true);
    expect(isHtmlElementFocusable(render('<a href="">Home</a>'))).toBe(true);
  });

  it('should return false for a link without an href', () => {
    expect(isHtmlElementFocusable(render('<a>Products</a>'))).toBe(false);
  });

  it('should return true for an element with tabindex 0', () => {
    expect(isHtmlElementFocusable(render('<div tabindex="0">Card</div>'))).toBe(true);
  });

  it('should return true for an element with a positive tabindex', () => {
    expect(isHtmlElementFocusable(render('<span tabindex="3">Card</span>'))).toBe(true);
  });

  it('should return false for an element with tabindex -1', () => {
    expect(isHtmlElementFocusable(render('<div tabindex="-1">Card</div>'))).toBe(false);
  });

  it('should return false for a native control with tabindex -1', () => {
    expect(isHtmlElementFocusable(render('<button tabindex="-1">Save</button>'))).toBe(false);
    expect(isHtmlElementFocusable(render('<a href="/products" tabindex="-1">Products</a>'))).toBe(
      false,
    );
  });

  it('should return true for a contenteditable element', () => {
    expect(isHtmlElementFocusable(render('<div contenteditable="true">Notes</div>'))).toBe(true);
  });

  it('should return false for contenteditable="false"', () => {
    expect(isHtmlElementFocusable(render('<div contenteditable="false">Notes</div>'))).toBe(false);
  });

  it('should return false for an element with nothing that makes it focusable', () => {
    expect(isHtmlElementFocusable(render('<div>Card</div>'))).toBe(false);
    expect(isHtmlElementFocusable(render('<span>Label</span>'))).toBe(false);
    expect(isHtmlElementFocusable(render('<p>Text</p>'))).toBe(false);
  });

  it('should return false for an element with display: none', () => {
    expect(isHtmlElementFocusable(render('<button style="display: none">Save</button>'))).toBe(
      false,
    );
  });

  it('should return false for a hidden element', () => {
    expect(isHtmlElementFocusable(render('<button hidden>Save</button>'))).toBe(false);
  });

  it('should return false for an element with visibility: hidden', () => {
    expect(isHtmlElementFocusable(render('<button style="visibility: hidden">Save</button>'))).toBe(
      false,
    );
  });

  it('should return false for an element that inherits visibility: hidden', () => {
    render('<div style="visibility: hidden"><button>Save</button></div>');

    expect(isHtmlElementFocusable(document.querySelector('button'))).toBe(false);
  });
});

describe('[isHtmlElementFocusable]: ancestors, tabindex values and editable elements', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should return false inside an ancestor with display: none', () => {
    render('<div style="display: none"><button>Save</button></div>');

    expect(isHtmlElementFocusable(document.querySelector('button'))).toBe(false);
  });

  it('should return false for a control inside a disabled fieldset', () => {
    render('<fieldset disabled><button>Save</button></fieldset>');

    expect(isHtmlElementFocusable(document.querySelector('button'))).toBe(false);
  });

  it('should return true for a link without an href that has tabindex 0', () => {
    expect(isHtmlElementFocusable(render('<a tabindex="0">Products</a>'))).toBe(true);
  });

  it('should ignore a tabindex that is not an integer', () => {
    expect(isHtmlElementFocusable(render('<div tabindex="abc">Card</div>'))).toBe(false);
  });

  it('should read a tabindex by the HTML integer rules', () => {
    expect(isHtmlElementFocusable(render('<div tabindex=" 3abc">Card</div>'))).toBe(true);
  });

  it('should return false for any negative tabindex', () => {
    expect(isHtmlElementFocusable(render('<div tabindex="-2">Card</div>'))).toBe(false);
    expect(isHtmlElementFocusable(render('<button tabindex="-2">Save</button>'))).toBe(false);
  });

  it('should return true for a bare contenteditable and plaintext-only', () => {
    expect(isHtmlElementFocusable(render('<div contenteditable>Note</div>'))).toBe(true);
    expect(isHtmlElementFocusable(render('<div contenteditable="plaintext-only">Note</div>'))).toBe(
      true,
    );
  });
});
