// @vitest-environment jsdom
import { getDataTransferJson, setDataTransferJson } from '~/dom';

const createDataTransfer = (data: Record<string, string> = {}) => {
  const store = new Map(Object.entries(data));

  const dataTransfer = {
    getData: vi.fn((format: string) => store.get(format) ?? ''),
    setData: vi.fn((format: string, value: string) => {
      store.set(format, value);
    }),
  };

  return {
    store,
    dataTransfer: dataTransfer as unknown as DataTransfer,
  };
};

describe('[setDataTransferJson]: store a value in a DataTransfer as JSON', () => {
  it('should store the value as JSON under the application/json type', () => {
    const { store, dataTransfer } = createDataTransfer();

    setDataTransferJson(dataTransfer, { id: 'card-1', index: 2 });

    expect(store.get('application/json')).toBe('{"id":"card-1","index":2}');
  });

  it('should store arrays and primitives as their JSON', () => {
    const { store, dataTransfer } = createDataTransfer();

    setDataTransferJson(dataTransfer, ['a', 'b']);
    expect(store.get('application/json')).toBe('["a","b"]');

    setDataTransferJson(dataTransfer, 'card-1');
    expect(store.get('application/json')).toBe('"card-1"');

    setDataTransferJson(dataTransfer, 0);
    expect(store.get('application/json')).toBe('0');
  });

  it('should leave the other types of the DataTransfer alone', () => {
    const { store, dataTransfer } = createDataTransfer({ 'text/plain': 'Card 1' });

    setDataTransferJson(dataTransfer, { id: 'card-1' });

    expect(store.get('text/plain')).toBe('Card 1');
    expect(dataTransfer.setData).toHaveBeenCalledTimes(1);
  });
});

describe('[getDataTransferJson]: read a JSON value from a DataTransfer', () => {
  it('should parse the JSON stored under the application/json type', () => {
    const { dataTransfer } = createDataTransfer({
      'application/json': '{"id":"card-1","index":2}',
    });

    expect(getDataTransferJson<{ id: string; index: number }>(dataTransfer)).toStrictEqual({
      id: 'card-1',
      index: 2,
    });
    expect(dataTransfer.getData).toHaveBeenCalledWith('application/json');
  });

  it('should read falsy values stored as their JSON', () => {
    expect(getDataTransferJson(createDataTransfer({ 'application/json': '0' }).dataTransfer)).toBe(
      0,
    );
    expect(
      getDataTransferJson(createDataTransfer({ 'application/json': 'false' }).dataTransfer),
    ).toBe(false);
    expect(getDataTransferJson(createDataTransfer({ 'application/json': '""' }).dataTransfer)).toBe(
      '',
    );
  });

  it('should return null when nothing is stored under the application/json type', () => {
    const { dataTransfer } = createDataTransfer({ 'text/plain': '{"id":"card-1"}' });

    expect(getDataTransferJson(dataTransfer)).toBeNull();
  });

  it('should return null when what is stored is not JSON', () => {
    const { dataTransfer } = createDataTransfer({ 'application/json': '{id:card-1' });

    expect(getDataTransferJson(dataTransfer)).toBeNull();
  });

  it('should round-trip through setDataTransferJson', () => {
    const { dataTransfer } = createDataTransfer();
    const value = { id: 'card-1', tags: ['a', 'b'], position: { x: 1, y: 2 }, parentId: null };

    setDataTransferJson(dataTransfer, value);

    expect(getDataTransferJson(dataTransfer)).toStrictEqual(value);
  });
});
