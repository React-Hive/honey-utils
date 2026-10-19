// @vitest-environment jsdom
import { downloadFile } from '~/dom';

const OBJECT_URL = 'blob:http://localhost:3000/6f1c2b9e-0c55-4c1e-9d8a-2a4f7f0b3c11';

interface ClickedLink {
  link: HTMLAnchorElement;
  href: string | null;
  download: string | null;
  target: string | null;
  isInDocument: boolean;
}

const spyOnLinkClick = () => {
  const clicks: ClickedLink[] = [];

  const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    clicks.push({
      link: this,
      href: this.getAttribute('href'),
      download: this.getAttribute('download'),
      target: this.getAttribute('target'),
      isInDocument: document.body.contains(this),
    });
  });

  return { click, clicks };
};

const spyOnObjectUrls = () => ({
  createObjectURL: vi.spyOn(URL, 'createObjectURL').mockReturnValue(OBJECT_URL),
  revokeObjectURL: vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined),
});

describe('[downloadFile]: download a URL or a binary object through a link', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('should click a link to a URL string', () => {
    const { click, clicks } = spyOnLinkClick();
    const { createObjectURL } = spyOnObjectUrls();

    downloadFile('https://example.com/files/report.pdf');

    expect(click).toHaveBeenCalledTimes(1);
    expect(clicks[0].href).toBe('https://example.com/files/report.pdf');
    expect(createObjectURL).not.toHaveBeenCalled();
  });

  it('should set the file name as the download attribute', () => {
    const { clicks } = spyOnLinkClick();

    downloadFile('/files/report.pdf', { fileName: 'Report 2026.pdf' });

    expect(clicks[0].download).toBe('Report 2026.pdf');
  });

  it('should leave the download attribute out without a file name', () => {
    const { clicks } = spyOnLinkClick();

    downloadFile('/files/report.pdf');

    expect(clicks[0].download).toBeNull();
  });

  it('should set the target when one is given', () => {
    const { clicks } = spyOnLinkClick();

    downloadFile('/files/report.pdf', { target: '_blank' });
    downloadFile('/files/report.pdf');

    expect(clicks[0].target).toBe('_blank');
    expect(clicks[1].target).toBeNull();
  });

  it('should click the link while it is in the document and remove it after', () => {
    const { clicks } = spyOnLinkClick();

    downloadFile('/files/report.pdf');

    expect(clicks[0].isInDocument).toBe(true);
    expect(clicks[0].link.isConnected).toBe(false);
    expect(document.body.childNodes).toHaveLength(0);
  });

  it('should download a Blob through an object URL', () => {
    const { clicks } = spyOnLinkClick();
    const { createObjectURL } = spyOnObjectUrls();

    const blob = new Blob(['id,name\n1,Widget'], { type: 'text/csv' });

    downloadFile(blob, { fileName: 'products.csv' });

    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(clicks[0].href).toBe(OBJECT_URL);
    expect(clicks[0].download).toBe('products.csv');
  });

  it('should revoke the object URL on a later task, after the click', () => {
    const { click } = spyOnLinkClick();
    const { revokeObjectURL } = spyOnObjectUrls();

    downloadFile(new Blob(['data']));

    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).not.toHaveBeenCalled();

    vi.runAllTimers();

    expect(revokeObjectURL).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith(OBJECT_URL);
  });

  it('should not revoke anything for a URL string', () => {
    spyOnLinkClick();
    const { revokeObjectURL } = spyOnObjectUrls();

    downloadFile('/files/report.pdf');
    vi.runAllTimers();

    expect(revokeObjectURL).not.toHaveBeenCalled();
  });

  it('should remove the link and revoke the object URL when the click throws', () => {
    const error = new Error('Click failed');

    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {
      throw error;
    });
    const { revokeObjectURL } = spyOnObjectUrls();

    expect(() => downloadFile(new Blob(['data']))).toThrow(error);
    expect((click.mock.contexts[0] as HTMLAnchorElement).isConnected).toBe(false);
    expect(document.body.childNodes).toHaveLength(0);

    vi.runAllTimers();

    expect(revokeObjectURL).toHaveBeenCalledWith(OBJECT_URL);
  });
});

describe('[downloadFile]: without a document', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return without throwing where there is no document', () => {
    vi.stubGlobal('document', undefined);

    expect(() => downloadFile('https://example.com/report.pdf')).not.toThrow();
  });
});
