import { delay } from '~/async';

describe('[delay]: resolve after a number of milliseconds', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve once the delay has passed, not before', async () => {
    const onResolve = vi.fn();

    delay(100).then(onResolve);

    await vi.advanceTimersByTimeAsync(99);
    expect(onResolve).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(onResolve).toHaveBeenCalledTimes(1);
  });

  it('should resolve with undefined', async () => {
    const promise = delay(10);

    await vi.advanceTimersByTimeAsync(10);

    await expect(promise).resolves.toBeUndefined();
  });

  it('should resolve a zero delay on the next timer tick', async () => {
    const onResolve = vi.fn();

    delay(0).then(onResolve);

    await Promise.resolve();
    expect(onResolve).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(0);
    expect(onResolve).toHaveBeenCalledTimes(1);
  });

  it('should resolve concurrent delays in the order of their durations', async () => {
    const resolved: number[] = [];

    for (const ms of [30, 10, 20]) {
      delay(ms).then(() => resolved.push(ms));
    }

    await vi.advanceTimersByTimeAsync(30);

    expect(resolved).toStrictEqual([10, 20, 30]);
  });
});
