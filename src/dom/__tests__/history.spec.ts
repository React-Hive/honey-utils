import { replaceHistorySearchParams } from '~/dom';

const stubWindow = (url: string, state: unknown = null) => {
  const { pathname, hash } = new URL(url);
  const replaceState = vi.fn();

  vi.stubGlobal('window', {
    history: {
      state,
      replaceState,
    },
    location: {
      pathname,
      hash,
    },
  });

  return replaceState;
};

describe('[replaceHistorySearchParams]: replace the query string of the current URL', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should replace the query string and keep the path', () => {
    const replaceState = stubWindow('https://example.com/products?page=1');

    replaceHistorySearchParams(new URLSearchParams({ page: '2' }));

    expect(replaceState).toHaveBeenCalledWith(null, '', '/products?page=2');
  });

  it('should keep the hash', () => {
    const replaceState = stubWindow('https://example.com/products?page=1#reviews');

    replaceHistorySearchParams(new URLSearchParams({ page: '2' }));

    expect(replaceState).toHaveBeenCalledWith(null, '', '/products?page=2#reviews');
  });

  it('should keep the history entry state', () => {
    const state = { key: 'abc', idx: 3 };
    const replaceState = stubWindow('https://example.com/products', state);

    replaceHistorySearchParams(new URLSearchParams({ page: '2' }));

    expect(replaceState.mock.calls[0][0]).toBe(state);
  });

  it('should remove the query string for empty search params', () => {
    const replaceState = stubWindow('https://example.com/products?page=1#reviews');

    replaceHistorySearchParams(new URLSearchParams());

    expect(replaceState).toHaveBeenCalledWith(null, '', '/products#reviews');
  });

  it('should encode the search params', () => {
    const replaceState = stubWindow('https://example.com/search');

    replaceHistorySearchParams(new URLSearchParams({ query: 'red & blue', tag: 'яблоко' }));

    expect(replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/search?query=red+%26+blue&tag=%D1%8F%D0%B1%D0%BB%D0%BE%D0%BA%D0%BE',
    );
  });
});
