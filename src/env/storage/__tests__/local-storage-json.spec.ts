import { readLocalStorageJson, writeLocalStorageJson } from '~/env';

const stubLocalStorage = (items: Record<string, string> = {}) => {
  const store = new Map(Object.entries(items));

  const localStorage = {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
  };

  vi.stubGlobal('window', {
    localStorage,
  });

  return { store, localStorage };
};

const blockLocalStorage = () => {
  vi.stubGlobal('window', {
    localStorage: {
      getItem: () => {
        throw new DOMException('The operation is insecure.', 'SecurityError');
      },
      setItem: () => {
        throw new DOMException('The quota has been exceeded.', 'QuotaExceededError');
      },
    },
  });
};

describe('[readLocalStorageJson]: read a JSON value from localStorage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should parse the value stored under the key', () => {
    stubLocalStorage({
      basket: '[{"productId":"p1","quantity":2}]',
    });

    expect(readLocalStorageJson<{ productId: string; quantity: number }[]>('basket')).toStrictEqual(
      [{ productId: 'p1', quantity: 2 }],
    );
  });

  it('should read primitives stored as their JSON', () => {
    stubLocalStorage({
      open: 'true',
      until: '1760000000000',
    });

    expect(readLocalStorageJson<boolean>('open')).toBe(true);
    expect(readLocalStorageJson<number>('until')).toBe(1760000000000);
  });

  it('should return null when nothing is stored under the key', () => {
    stubLocalStorage();

    expect(readLocalStorageJson('basket')).toBeNull();
  });

  it('should return null when what is stored is not JSON', () => {
    stubLocalStorage({
      basket: '{basket',
    });

    expect(readLocalStorageJson('basket')).toBeNull();
  });

  it('should return null when localStorage cannot be read', () => {
    blockLocalStorage();

    expect(readLocalStorageJson('basket')).toBeNull();
  });

  it('should return null where there is no window', () => {
    expect(readLocalStorageJson('basket')).toBeNull();
  });
});

describe('[writeLocalStorageJson]: write a value to localStorage as JSON', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should store the value as JSON and report it stored', () => {
    const { store } = stubLocalStorage();

    expect(writeLocalStorageJson('consent', { analytics: false })).toBe(true);
    expect(store.get('consent')).toBe('{"analytics":false}');
  });

  it('should round-trip through readLocalStorageJson', () => {
    stubLocalStorage();

    writeLocalStorageJson('basket', [{ productId: 'p1', quantity: 2 }]);

    expect(readLocalStorageJson('basket')).toStrictEqual([{ productId: 'p1', quantity: 2 }]);
  });

  it('should return false when localStorage cannot be written', () => {
    blockLocalStorage();

    expect(writeLocalStorageJson('basket', [])).toBe(false);
  });

  it('should return false when the value cannot be serialised', () => {
    const { localStorage } = stubLocalStorage();

    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(writeLocalStorageJson('basket', circular)).toBe(false);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('should return false where there is no window', () => {
    expect(writeLocalStorageJson('basket', [])).toBe(false);
  });
});
