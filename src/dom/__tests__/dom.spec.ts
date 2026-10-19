// @vitest-environment jsdom
import {
  cloneBlob,
  getElementOffsetRect,
  isAnchorHtmlElement,
  isContentEditableHtmlElement,
} from '~/dom';

const defineLayout = (element: HTMLElement, layout: Record<string, number>) => {
  Object.entries(layout).forEach(([property, value]) => {
    Object.defineProperty(element, property, { value, configurable: true });
  });
};

describe('[cloneBlob]: copy a Blob', () => {
  it('should return a new Blob with the same content', async () => {
    const blob = new Blob(['Hello world'], { type: 'text/plain' });

    const clone = cloneBlob(blob);

    expect(clone).not.toBe(blob);
    expect(clone).toBeInstanceOf(Blob);
    expect(clone.size).toBe(blob.size);
    expect(await clone.text()).toBe('Hello world');
  });

  it('should keep the type of the Blob', () => {
    expect(cloneBlob(new Blob(['{}'], { type: 'application/json' })).type).toBe('application/json');
  });

  it('should keep an empty type empty', () => {
    expect(cloneBlob(new Blob(['data'])).type).toBe('');
  });

  it('should copy binary content byte for byte', async () => {
    const bytes = new Uint8Array([0, 1, 127, 128, 255]);

    const clone = cloneBlob(new Blob([bytes], { type: 'application/octet-stream' }));

    expect(new Uint8Array(await clone.arrayBuffer())).toStrictEqual(bytes);
  });
});

describe('[getElementOffsetRect]: rect from the offset position and client size', () => {
  it('should take the position from offsetLeft and offsetTop', () => {
    const element = document.createElement('div');
    defineLayout(element, { offsetLeft: 10, offsetTop: 20, clientWidth: 300, clientHeight: 150 });

    const rect = getElementOffsetRect(element);

    expect(rect).toBeInstanceOf(DOMRect);
    expect(rect.x).toBe(10);
    expect(rect.y).toBe(20);
    expect(rect.left).toBe(10);
    expect(rect.top).toBe(20);
  });

  it('should take the size from clientWidth and clientHeight', () => {
    const element = document.createElement('div');
    defineLayout(element, {
      offsetLeft: 10,
      offsetTop: 20,
      offsetWidth: 320,
      offsetHeight: 170,
      clientWidth: 300,
      clientHeight: 150,
    });

    const rect = getElementOffsetRect(element);

    expect(rect.width).toBe(300);
    expect(rect.height).toBe(150);
    expect(rect.right).toBe(310);
    expect(rect.bottom).toBe(170);
  });
});

describe('[isAnchorHtmlElement]: whether an element is an anchor', () => {
  it('should return true for an anchor with an href', () => {
    const anchor = document.createElement('a');
    anchor.href = '/products';

    expect(isAnchorHtmlElement(anchor)).toBe(true);
  });

  it('should return true for an anchor without an href', () => {
    expect(isAnchorHtmlElement(document.createElement('a'))).toBe(true);
  });

  it('should return false for other elements', () => {
    expect(isAnchorHtmlElement(document.createElement('div'))).toBe(false);
    expect(isAnchorHtmlElement(document.createElement('button'))).toBe(false);
    expect(isAnchorHtmlElement(document.createElement('area'))).toBe(false);
    expect(isAnchorHtmlElement(document.createElement('abbr'))).toBe(false);
  });
});

describe('[isContentEditableHtmlElement]: whether an element is marked contenteditable="true"', () => {
  it('should return true for contenteditable="true"', () => {
    const element = document.createElement('div');
    element.setAttribute('contenteditable', 'true');

    expect(isContentEditableHtmlElement(element)).toBe(true);
  });

  it('should return false for contenteditable="false"', () => {
    const element = document.createElement('div');
    element.setAttribute('contenteditable', 'false');

    expect(isContentEditableHtmlElement(element)).toBe(false);
  });

  it('should return false without the attribute', () => {
    expect(isContentEditableHtmlElement(document.createElement('div'))).toBe(false);
  });

  it('should return false for an element that is only editable through its ancestor', () => {
    const parent = document.createElement('div');
    parent.setAttribute('contenteditable', 'true');

    const child = document.createElement('span');
    parent.appendChild(child);

    expect(isContentEditableHtmlElement(child)).toBe(false);
  });
});

describe('[isContentEditableHtmlElement]: every editable value', () => {
  it('should accept the bare attribute, true and plaintext-only, in any case', () => {
    const element = document.createElement('div');

    ['', 'true', 'TRUE', 'plaintext-only'].forEach(value => {
      element.setAttribute('contenteditable', value);

      expect(isContentEditableHtmlElement(element)).toBe(true);
    });
  });

  it('should reject false', () => {
    const element = document.createElement('div');
    element.setAttribute('contenteditable', 'false');

    expect(isContentEditableHtmlElement(element)).toBe(false);
  });
});
