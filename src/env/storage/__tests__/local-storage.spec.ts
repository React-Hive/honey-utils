import { getLocalStorageCapabilities, isLocalStorageReadable } from '~/env';

const stubLocalStorage = (items: Record<string, string> = {}) => {
  const store = new Map(Object.entries(items));

  const localStorage = {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
  };

  vi.stubGlobal('window', {
    localStorage,
  });

  return { store, localStorage };
};

const throwSecurityError = () => {
  throw new DOMException('The operation is insecure.', 'SecurityError');
};

const throwQuotaExceededError = () => {
  throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
};

describe('[isLocalStorageReadable]: check whether localStorage can be read', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should return true when getItem does not throw', () => {
    const { localStorage } = stubLocalStorage();

    expect(isLocalStorageReadable()).toBe(true);
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
  });

  it('should return true when only writes fail', () => {
    const { localStorage } = stubLocalStorage();
    localStorage.setItem.mockImplementation(throwQuotaExceededError);

    expect(isLocalStorageReadable()).toBe(true);
  });

  it('should not write to localStorage', () => {
    const { store, localStorage } = stubLocalStorage({ basket: '[]' });

    isLocalStorageReadable();

    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(Object.fromEntries(store)).toStrictEqual({ basket: '[]' });
  });

  it('should return false when getItem throws', () => {
    const { localStorage } = stubLocalStorage();
    localStorage.getItem.mockImplementation(throwSecurityError);

    expect(isLocalStorageReadable()).toBe(false);
  });

  it('should return false when window has no localStorage', () => {
    vi.stubGlobal('window', {});

    expect(isLocalStorageReadable()).toBe(false);
  });

  it('should return false where there is no window', () => {
    expect(isLocalStorageReadable()).toBe(false);
  });
});

describe('[getLocalStorageCapabilities]: detect whether localStorage can be read and written', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should report readable and writable when reads and writes succeed', () => {
    stubLocalStorage();

    expect(getLocalStorageCapabilities()).toStrictEqual({
      readable: true,
      writable: true,
    });
  });

  it('should remove the key it writes and leave stored items as they were', () => {
    const { store, localStorage } = stubLocalStorage({ basket: '[]' });

    getLocalStorageCapabilities();

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(localStorage.removeItem).toHaveBeenCalledWith(localStorage.setItem.mock.calls[0][0]);
    expect(Object.fromEntries(store)).toStrictEqual({ basket: '[]' });
  });

  it('should report readable but not writable when setItem throws', () => {
    const { localStorage } = stubLocalStorage();
    localStorage.setItem.mockImplementation(throwQuotaExceededError);

    expect(getLocalStorageCapabilities()).toStrictEqual({
      readable: true,
      writable: false,
    });
  });

  it('should report readable but not writable when removeItem throws', () => {
    const { localStorage } = stubLocalStorage();
    localStorage.removeItem.mockImplementation(throwSecurityError);

    expect(getLocalStorageCapabilities()).toStrictEqual({
      readable: true,
      writable: false,
    });
  });

  it('should report neither, without trying to write, when getItem throws', () => {
    const { localStorage } = stubLocalStorage();
    localStorage.getItem.mockImplementation(throwSecurityError);

    expect(getLocalStorageCapabilities()).toStrictEqual({
      readable: false,
      writable: false,
    });
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('should report neither when window has no localStorage', () => {
    vi.stubGlobal('window', {});

    expect(getLocalStorageCapabilities()).toStrictEqual({
      readable: false,
      writable: false,
    });
  });

  it('should report neither where there is no window', () => {
    expect(getLocalStorageCapabilities()).toStrictEqual({
      readable: false,
      writable: false,
    });
  });
});

describe('[isLocalStorageReadable] and [getLocalStorageCapabilities]: a localStorage that throws when reached', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const stubThrowingLocalStorage = () => {
    vi.stubGlobal(
      'window',
      Object.defineProperty({}, 'localStorage', {
        get: throwSecurityError,
      }),
    );
  };

  it('should report it unreadable rather than throw', () => {
    stubThrowingLocalStorage();

    expect(isLocalStorageReadable()).toBe(false);
  });

  it('should report neither read nor write rather than throw', () => {
    stubThrowingLocalStorage();

    expect(getLocalStorageCapabilities()).toStrictEqual({
      readable: false,
      writable: false,
    });
  });
});
