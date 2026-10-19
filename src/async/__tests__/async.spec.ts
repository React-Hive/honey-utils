import {
  everyAsync,
  filterParallel,
  filterSequential,
  findAsync,
  isPromise,
  reduceAsync,
  runParallel,
  runSequential,
  someAsync,
} from '~/async';

const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Logs when each call starts and ends on the fake clock, so a spec can tell calls that ran one
 * after another from calls that ran at once.
 */
const createRecorder = () => {
  const events: string[] = [];

  const run = async <Result>(index: number, ms: number, result: Result): Promise<Result> => {
    events.push(`start ${index} at ${Date.now()}`);
    await wait(ms);
    events.push(`end ${index} at ${Date.now()}`);

    return result;
  };

  return { events, run };
};

beforeEach(() => {
  vi.useFakeTimers({ now: 0 });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('[isPromise]: check whether a value is a promise', () => {
  it('should return true for promises', () => {
    const rejected = Promise.reject(new Error('boom'));
    rejected.catch(() => {});

    expect(isPromise(Promise.resolve(1))).toBe(true);
    expect(isPromise(rejected)).toBe(true);
    expect(isPromise(new Promise(() => {}))).toBe(true);
    expect(isPromise((async () => 1)())).toBe(true);
  });

  it('should return false for values that are not promises', () => {
    expect(isPromise(null)).toBe(false);
    expect(isPromise(undefined)).toBe(false);
    expect(isPromise(0)).toBe(false);
    expect(isPromise('then')).toBe(false);
    expect(isPromise({})).toBe(false);
    expect(isPromise([])).toBe(false);
    expect(isPromise(() => {})).toBe(false);
    expect(isPromise(async () => {})).toBe(false);
    expect(isPromise({ then: 'not a function' })).toBe(false);
  });
});

describe('[runSequential]: run an async function on each item, one after another', () => {
  it('should resolve with the results in the order of the items', async () => {
    await expect(runSequential([1, 2, 3], async item => item * 2)).resolves.toStrictEqual([
      2, 4, 6,
    ]);
  });

  it('should pass each item with its index and the array', async () => {
    const array = ['a', 'b'];
    const fn = vi.fn(async (item: string) => item);

    await runSequential(array, fn);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, 'a', 0, array);
    expect(fn).toHaveBeenNthCalledWith(2, 'b', 1, array);
  });

  it('should start each call only once the previous one has settled', async () => {
    const { events, run } = createRecorder();

    const promise = runSequential([30, 10, 20], (ms, index) => run(index, ms, ms * 2));

    await vi.runAllTimersAsync();

    await expect(promise).resolves.toStrictEqual([60, 20, 40]);
    expect(events).toStrictEqual([
      'start 0 at 0',
      'end 0 at 30',
      'start 1 at 30',
      'end 1 at 40',
      'start 2 at 40',
      'end 2 at 60',
    ]);
  });

  it('should resolve with an empty array without calling the function for an empty array', async () => {
    const fn = vi.fn(async (item: number) => item);

    await expect(runSequential([], fn)).resolves.toStrictEqual([]);
    expect(fn).not.toHaveBeenCalled();
  });

  it('should reject with the first error and not call the function for the remaining items', async () => {
    const fn = vi.fn(async (item: number) => {
      if (item === 2) {
        throw new Error('Item 2 failed');
      }

      return item;
    });

    await expect(runSequential([1, 2, 3], fn)).rejects.toThrow('Item 2 failed');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('[runParallel]: run an async function on every item at once', () => {
  it('should resolve with the results in the order of the items', async () => {
    await expect(runParallel([1, 2, 3], async item => item * 2)).resolves.toStrictEqual([2, 4, 6]);
  });

  it('should pass each item with its index and the array', async () => {
    const array = ['a', 'b'];
    const fn = vi.fn(async (item: string) => item);

    await runParallel(array, fn);

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, 'a', 0, array);
    expect(fn).toHaveBeenNthCalledWith(2, 'b', 1, array);
  });

  it('should start every call at once and keep the order of the items when they finish out of order', async () => {
    const { events, run } = createRecorder();

    const promise = runParallel([30, 10, 20], (ms, index) => run(index, ms, ms * 2));

    await vi.runAllTimersAsync();

    await expect(promise).resolves.toStrictEqual([60, 20, 40]);
    expect(events).toStrictEqual([
      'start 0 at 0',
      'start 1 at 0',
      'start 2 at 0',
      'end 1 at 10',
      'end 2 at 20',
      'end 0 at 30',
    ]);
  });

  it('should resolve with an empty array without calling the function for an empty array', async () => {
    const fn = vi.fn(async (item: number) => item);

    await expect(runParallel([], fn)).resolves.toStrictEqual([]);
    expect(fn).not.toHaveBeenCalled();
  });

  it('should reject with the error of a failing call after starting every call', async () => {
    const fn = vi.fn(async (item: number) => {
      if (item === 2) {
        throw new Error('Item 2 failed');
      }

      return item;
    });

    await expect(runParallel([1, 2, 3], fn)).rejects.toThrow('Item 2 failed');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});

describe('[filterSequential]: filter an array with an async predicate, one item after another', () => {
  it('should keep the items the predicate accepts, in their order', async () => {
    await expect(
      filterSequential([1, 2, 3, 4], async item => item % 2 === 0),
    ).resolves.toStrictEqual([2, 4]);
  });

  it('should keep falsy items the predicate accepts', async () => {
    await expect(
      filterSequential([0, '', false, null, 1], async item => item !== 1),
    ).resolves.toStrictEqual([0, '', false, null]);
  });

  it('should pass each item with its index and the array', async () => {
    const array = ['a', 'b'];
    const predicate = vi.fn(async () => true);

    await filterSequential(array, predicate);

    expect(predicate).toHaveBeenCalledTimes(2);
    expect(predicate).toHaveBeenNthCalledWith(1, 'a', 0, array);
    expect(predicate).toHaveBeenNthCalledWith(2, 'b', 1, array);
  });

  it('should call the predicate for each item only once the previous call has settled', async () => {
    const { events, run } = createRecorder();

    const promise = filterSequential([30, 10, 20], (ms, index) => run(index, ms, ms > 15));

    await vi.runAllTimersAsync();

    await expect(promise).resolves.toStrictEqual([30, 20]);
    expect(events).toStrictEqual([
      'start 0 at 0',
      'end 0 at 30',
      'start 1 at 30',
      'end 1 at 40',
      'start 2 at 40',
      'end 2 at 60',
    ]);
  });

  it('should resolve with an empty array without calling the predicate for an empty array', async () => {
    const predicate = vi.fn(async () => true);

    await expect(filterSequential([], predicate)).resolves.toStrictEqual([]);
    expect(predicate).not.toHaveBeenCalled();
  });

  it('should reject with the predicate error and not call it for the remaining items', async () => {
    const predicate = vi.fn(async (item: number) => {
      if (item === 2) {
        throw new Error('Item 2 failed');
      }

      return true;
    });

    await expect(filterSequential([1, 2, 3], predicate)).rejects.toThrow('Item 2 failed');
    expect(predicate).toHaveBeenCalledTimes(2);
  });
});

describe('[filterParallel]: filter an array with an async predicate run on every item at once', () => {
  it('should keep the items the predicate accepts, in their order', async () => {
    await expect(filterParallel([1, 2, 3, 4], async item => item % 2 === 0)).resolves.toStrictEqual(
      [2, 4],
    );
  });

  it('should pass each item with its index and the array', async () => {
    const array = ['a', 'b'];
    const predicate = vi.fn(async () => true);

    await filterParallel(array, predicate);

    expect(predicate).toHaveBeenCalledTimes(2);
    expect(predicate).toHaveBeenNthCalledWith(1, 'a', 0, array);
    expect(predicate).toHaveBeenNthCalledWith(2, 'b', 1, array);
  });

  it('should call the predicate on every item at once and keep the order of the items', async () => {
    const { events, run } = createRecorder();

    const promise = filterParallel([30, 10, 20], (ms, index) => run(index, ms, ms > 15));

    await vi.runAllTimersAsync();

    await expect(promise).resolves.toStrictEqual([30, 20]);
    expect(events).toStrictEqual([
      'start 0 at 0',
      'start 1 at 0',
      'start 2 at 0',
      'end 1 at 10',
      'end 2 at 20',
      'end 0 at 30',
    ]);
  });

  it('should resolve with an empty array without calling the predicate for an empty array', async () => {
    const predicate = vi.fn(async () => true);

    await expect(filterParallel([], predicate)).resolves.toStrictEqual([]);
    expect(predicate).not.toHaveBeenCalled();
  });

  it('should reject with the predicate error after calling it on every item', async () => {
    const predicate = vi.fn(async (item: number) => {
      if (item === 2) {
        throw new Error('Item 2 failed');
      }

      return true;
    });

    await expect(filterParallel([1, 2, 3], predicate)).rejects.toThrow('Item 2 failed');
    expect(predicate).toHaveBeenCalledTimes(3);
  });
});

describe('[someAsync]: check whether any item passes an async predicate', () => {
  it('should resolve true when an item passes', async () => {
    await expect(someAsync([1, 3, 4], async item => item % 2 === 0)).resolves.toBe(true);
  });

  it('should resolve false when no item passes', async () => {
    await expect(someAsync([1, 3, 5], async item => item % 2 === 0)).resolves.toBe(false);
  });

  it('should resolve false without calling the predicate for an empty array', async () => {
    const predicate = vi.fn(async () => true);

    await expect(someAsync([], predicate)).resolves.toBe(false);
    expect(predicate).not.toHaveBeenCalled();
  });

  it('should pass each item with its index and the array', async () => {
    const array = ['a', 'b'];
    const predicate = vi.fn(async () => false);

    await someAsync(array, predicate);

    expect(predicate).toHaveBeenNthCalledWith(1, 'a', 0, array);
    expect(predicate).toHaveBeenNthCalledWith(2, 'b', 1, array);
  });

  it('should check the items one after another and stop at the first that passes', async () => {
    const { events, run } = createRecorder();

    const promise = someAsync([1, 2, 3, 4], (item, index) => run(index, 10, item % 2 === 0));

    await vi.runAllTimersAsync();

    await expect(promise).resolves.toBe(true);
    expect(events).toStrictEqual(['start 0 at 0', 'end 0 at 10', 'start 1 at 10', 'end 1 at 20']);
  });

  it('should reject with the predicate error', async () => {
    await expect(
      someAsync([1], async () => {
        throw new Error('Predicate failed');
      }),
    ).rejects.toThrow('Predicate failed');
  });
});

describe('[everyAsync]: check whether every item passes an async predicate', () => {
  it('should resolve true when every item passes', async () => {
    await expect(everyAsync([2, 4, 6], async item => item % 2 === 0)).resolves.toBe(true);
  });

  it('should resolve false when an item fails', async () => {
    await expect(everyAsync([2, 3, 6], async item => item % 2 === 0)).resolves.toBe(false);
  });

  it('should resolve true without calling the predicate for an empty array', async () => {
    const predicate = vi.fn(async () => false);

    await expect(everyAsync([], predicate)).resolves.toBe(true);
    expect(predicate).not.toHaveBeenCalled();
  });

  it('should pass each item with its index and the array', async () => {
    const array = ['a', 'b'];
    const predicate = vi.fn(async () => true);

    await everyAsync(array, predicate);

    expect(predicate).toHaveBeenNthCalledWith(1, 'a', 0, array);
    expect(predicate).toHaveBeenNthCalledWith(2, 'b', 1, array);
  });

  it('should check the items one after another and stop at the first that fails', async () => {
    const { events, run } = createRecorder();

    const promise = everyAsync([2, 3, 4, 6], (item, index) => run(index, 10, item % 2 === 0));

    await vi.runAllTimersAsync();

    await expect(promise).resolves.toBe(false);
    expect(events).toStrictEqual(['start 0 at 0', 'end 0 at 10', 'start 1 at 10', 'end 1 at 20']);
  });

  it('should reject with the predicate error', async () => {
    await expect(
      everyAsync([1], async () => {
        throw new Error('Predicate failed');
      }),
    ).rejects.toThrow('Predicate failed');
  });
});

describe('[reduceAsync]: reduce an array to one value with an async reducer', () => {
  it('should resolve with the accumulated value', async () => {
    await expect(
      reduceAsync([1, 2, 3], async (accumulator, item) => accumulator + item, 0),
    ).resolves.toBe(6);
  });

  it('should accumulate into a type other than the items', async () => {
    await expect(
      reduceAsync(
        ['a', 'bb', 'ccc'],
        async (accumulator, item) => ({ ...accumulator, [item]: item.length }),
        {} as Record<string, number>,
      ),
    ).resolves.toStrictEqual({ a: 1, bb: 2, ccc: 3 });
  });

  it('should pass the accumulator, each item with its index, and the array', async () => {
    const array = ['a', 'b'];
    const fn = vi.fn(async (accumulator: string, item: string) => accumulator + item);

    await reduceAsync(array, fn, '');

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(1, '', 'a', 0, array);
    expect(fn).toHaveBeenNthCalledWith(2, 'a', 'b', 1, array);
  });

  it('should resolve with the initial value without calling the reducer for an empty array', async () => {
    const fn = vi.fn(async (accumulator: number) => accumulator + 1);

    await expect(reduceAsync([], fn, 10)).resolves.toBe(10);
    expect(fn).not.toHaveBeenCalled();
  });

  it('should call the reducer for each item only once the previous call has settled', async () => {
    const { events, run } = createRecorder();

    const promise = reduceAsync(
      [30, 10, 20],
      (accumulator, ms, index) => run(index, ms, accumulator + ms),
      0,
    );

    await vi.runAllTimersAsync();

    await expect(promise).resolves.toBe(60);
    expect(events).toStrictEqual([
      'start 0 at 0',
      'end 0 at 30',
      'start 1 at 30',
      'end 1 at 40',
      'start 2 at 40',
      'end 2 at 60',
    ]);
  });

  it('should reject with the reducer error and not call it for the remaining items', async () => {
    const fn = vi.fn(async (accumulator: number, item: number) => {
      if (item === 2) {
        throw new Error('Item 2 failed');
      }

      return accumulator + item;
    });

    await expect(reduceAsync([1, 2, 3], fn, 0)).rejects.toThrow('Item 2 failed');
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('[findAsync]: find the first item that passes an async predicate', () => {
  it('should resolve with the first item that passes', async () => {
    await expect(findAsync([1, 3, 4, 5, 6], async item => item % 2 === 0)).resolves.toBe(4);
  });

  it('should resolve null when no item passes', async () => {
    await expect(findAsync([1, 3, 5], async item => item % 2 === 0)).resolves.toBeNull();
  });

  it('should resolve null without calling the predicate for an empty array', async () => {
    const predicate = vi.fn(async () => true);

    await expect(findAsync([], predicate)).resolves.toBeNull();
    expect(predicate).not.toHaveBeenCalled();
  });

  it('should pass each item with its index and the array', async () => {
    const array = ['a', 'b'];
    const predicate = vi.fn(async () => false);

    await findAsync(array, predicate);

    expect(predicate).toHaveBeenNthCalledWith(1, 'a', 0, array);
    expect(predicate).toHaveBeenNthCalledWith(2, 'b', 1, array);
  });

  it('should check the items one after another and stop at the first that passes', async () => {
    const { events, run } = createRecorder();

    const promise = findAsync([1, 2, 3, 4], (item, index) => run(index, 10, item % 2 === 0));

    await vi.runAllTimersAsync();

    await expect(promise).resolves.toBe(2);
    expect(events).toStrictEqual(['start 0 at 0', 'end 0 at 10', 'start 1 at 10', 'end 1 at 20']);
  });

  it('should reject with the predicate error', async () => {
    await expect(
      findAsync([1], async () => {
        throw new Error('Predicate failed');
      }),
    ).rejects.toThrow('Predicate failed');
  });
});

describe('[filterParallel]: falsy items', () => {
  it('should keep falsy items the predicate accepts', async () => {
    await expect(filterParallel([0, '', false, null, 1], async () => true)).resolves.toStrictEqual([
      0,
      '',
      false,
      null,
      1,
    ]);
  });
});
