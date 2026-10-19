import { toMapBy } from '~/array';

interface User {
  id: string;
  name: string;
}

const USERS: User[] = [
  { id: 'u1', name: 'Ann' },
  { id: 'u2', name: 'Bob' },
];

describe('[toMapBy]: index an array by a key', () => {
  it('should map each key to its item', () => {
    const result = toMapBy(USERS, user => user.id);

    expect(result).toStrictEqual(
      new Map([
        ['u1', USERS[0]],
        ['u2', USERS[1]],
      ]),
    );
    expect(result.get('u2')).toBe(USERS[1]);
  });

  it('should map each key to the value given for its item', () => {
    const result = toMapBy(
      USERS,
      user => user.id,
      user => user.name,
    );

    expect(result).toStrictEqual(
      new Map([
        ['u1', 'Ann'],
        ['u2', 'Bob'],
      ]),
    );
  });

  it('should pass each item its index', () => {
    const result = toMapBy(
      ['a', 'b'],
      (_, index) => index,
      (item, index) => `${item}${index}`,
    );

    expect(result).toStrictEqual(
      new Map([
        [0, 'a0'],
        [1, 'b1'],
      ]),
    );
  });

  it('should keep the later item where two share a key', () => {
    const result = toMapBy(
      [...USERS, { id: 'u1', name: 'Anna' }],
      user => user.id,
      user => user.name,
    );

    expect(result.size).toBe(2);
    expect(result.get('u1')).toBe('Anna');
  });

  it('should return an empty map for no items', () => {
    expect(toMapBy([] as User[], user => user.id).size).toBe(0);
  });

  it('should type the values as the items where no value is given', () => {
    // @ts-expect-error - a map of users is not a map of strings
    const names: Map<string, string> = toMapBy(USERS, user => user.id);

    expect(names.get('u1')).toBe(USERS[0]);
  });

  it('should keep insertion order', () => {
    const result = toMapBy(['c', 'a', 'b'], item => item);

    expect([...result.keys()]).toStrictEqual(['c', 'a', 'b']);
  });
});
