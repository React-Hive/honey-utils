import { toggleArrayItem } from '~/array';

describe('[toggleArrayItem]: add or remove an array item', () => {
  it('should add a missing item when it should be included', () => {
    const result = toggleArrayItem(['a', 'b'], 'c', true);

    expect(result).toStrictEqual(['a', 'b', 'c']);
  });

  it('should return the source array when adding an item already present', () => {
    const array = ['a', 'b'];

    const result = toggleArrayItem(array, 'b', true);

    expect(result).toBe(array);
  });

  it('should remove every occurrence of a present item when it should not be included', () => {
    const result = toggleArrayItem(['a', 'b', 'a'], 'a', false);

    expect(result).toStrictEqual(['b']);
  });

  it('should return the source array when removing a missing item', () => {
    const array = ['a', 'b'];

    const result = toggleArrayItem(array, 'c', false);

    expect(result).toBe(array);
  });

  it('should add a missing item when inclusion is not specified', () => {
    const result = toggleArrayItem(['a', 'b'], 'c');

    expect(result).toStrictEqual(['a', 'b', 'c']);
  });

  it('should remove a present item when inclusion is not specified', () => {
    const result = toggleArrayItem(['a', 'b'], 'a');

    expect(result).toStrictEqual(['b']);
  });

  it('should not mutate the source array', () => {
    const array = ['a', 'b'];

    toggleArrayItem(array, 'c', true);
    toggleArrayItem(array, 'a', false);

    expect(array).toStrictEqual(['a', 'b']);
  });

  it('should match NaN as includes does', () => {
    const result = toggleArrayItem([NaN, 1], NaN, false);

    expect(result).toStrictEqual([1]);
  });

  it('should match objects by reference', () => {
    const item = { id: 1 };

    const result = toggleArrayItem([item], { id: 1 }, true);

    expect(result).toStrictEqual([item, { id: 1 }]);
  });
});
