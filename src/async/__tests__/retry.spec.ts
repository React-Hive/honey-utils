import { retry } from '~/async';

/**
 * A task that rejects with `Attempt N failed` on its first `failures` calls and then resolves,
 * logging the fake clock's time of each call.
 *
 * Its parameters are `unknown[]` because `retry`'s `Task` constraint, `(...args: unknown[]) =>`,
 * rejects a task with typed parameters under `strict`.
 */
const createFlakyTask = (failures: number) => {
  const calledAt: number[] = [];

  const task = vi.fn(async (...[id, quantity]: unknown[]) => {
    calledAt.push(Date.now());

    if (calledAt.length <= failures) {
      throw new Error(`Attempt ${calledAt.length} failed`);
    }

    return `${id} x${quantity}`;
  });

  return { task, calledAt };
};

describe('[retry]: call an async function again when it rejects', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: 0 });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve with the result of a first attempt that succeeds, without retrying', async () => {
    const { task } = createFlakyTask(0);
    const onRetry = vi.fn();

    await expect(retry(task, { onRetry })('p1', 2)).resolves.toBe('p1 x2');

    expect(task).toHaveBeenCalledTimes(1);
    expect(onRetry).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('should resolve with the result of a later attempt that succeeds', async () => {
    const { task } = createFlakyTask(2);

    const promise = retry(task)('p1', 2);

    await vi.runAllTimersAsync();

    await expect(promise).resolves.toBe('p1 x2');
    expect(task).toHaveBeenCalledTimes(3);
  });

  it('should pass the arguments through to every attempt', async () => {
    const { task } = createFlakyTask(1);

    const promise = retry(task)('p1', 2);

    await vi.runAllTimersAsync();
    await promise;

    expect(task).toHaveBeenCalledTimes(2);
    expect(task).toHaveBeenNthCalledWith(1, 'p1', 2);
    expect(task).toHaveBeenNthCalledWith(2, 'p1', 2);
  });

  it('should make 3 attempts by default and then reject with the last error', async () => {
    const { task } = createFlakyTask(Infinity);

    const promise = retry(task)('p1', 2);
    const assertion = expect(promise).rejects.toThrow('Attempt 3 failed');

    await vi.runAllTimersAsync();

    await assertion;
    expect(task).toHaveBeenCalledTimes(3);
  });

  it('should make maxAttempts attempts and then reject with the last error', async () => {
    const { task } = createFlakyTask(Infinity);

    const promise = retry(task, { maxAttempts: 5 })('p1', 2);
    const assertion = expect(promise).rejects.toThrow('Attempt 5 failed');

    await vi.runAllTimersAsync();

    await assertion;
    expect(task).toHaveBeenCalledTimes(5);
  });

  it('should reject at once, without retrying, when maxAttempts is 1', async () => {
    const { task } = createFlakyTask(Infinity);
    const onRetry = vi.fn();

    await expect(retry(task, { maxAttempts: 1, onRetry })('p1', 2)).rejects.toThrow(
      'Attempt 1 failed',
    );

    expect(task).toHaveBeenCalledTimes(1);
    expect(onRetry).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('should reject with whatever the task threw, as it was thrown', async () => {
    const reason = { code: 'NETWORK' };
    const task = vi.fn(() => Promise.reject(reason));

    const promise = retry(task, { maxAttempts: 2 })();
    const assertion = expect(promise).rejects.toBe(reason);

    await vi.runAllTimersAsync();

    await assertion;
  });

  it('should wait 300ms doubled after each failed attempt by default', async () => {
    const { task, calledAt } = createFlakyTask(Infinity);

    const promise = retry(task)('p1', 2);
    const assertion = expect(promise).rejects.toThrow();

    await vi.runAllTimersAsync();

    await assertion;
    expect(calledAt).toStrictEqual([0, 300, 900]);
  });

  it('should double delayMs after each failed attempt with backoff', async () => {
    const { task, calledAt } = createFlakyTask(Infinity);

    const promise = retry(task, { maxAttempts: 4, delayMs: 100, backoff: true })('p1', 2);
    const assertion = expect(promise).rejects.toThrow();

    await vi.runAllTimersAsync();

    await assertion;
    expect(calledAt).toStrictEqual([0, 100, 300, 700]);
  });

  it('should wait delayMs between attempts without backoff', async () => {
    const { task, calledAt } = createFlakyTask(Infinity);

    const promise = retry(task, { maxAttempts: 4, delayMs: 100, backoff: false })('p1', 2);
    const assertion = expect(promise).rejects.toThrow();

    await vi.runAllTimersAsync();

    await assertion;
    expect(calledAt).toStrictEqual([0, 100, 200, 300]);
  });

  it('should not retry before the delay has passed', async () => {
    const { task } = createFlakyTask(1);

    const promise = retry(task, { delayMs: 100 })('p1', 2);

    await vi.advanceTimersByTimeAsync(99);
    expect(task).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);
    expect(task).toHaveBeenCalledTimes(2);

    await expect(promise).resolves.toBe('p1 x2');
  });

  it('should reject as soon as the last attempt fails, without waiting again', async () => {
    const { task } = createFlakyTask(Infinity);
    const onReject = vi.fn();

    retry(task, { delayMs: 100 })('p1', 2).catch(onReject);

    await vi.advanceTimersByTimeAsync(299);
    expect(onReject).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(task).toHaveBeenCalledTimes(3);
    expect(onReject).toHaveBeenCalledWith(new Error('Attempt 3 failed'));
    expect(vi.getTimerCount()).toBe(0);
  });

  it('should call onRetry with the number and error of each failed attempt that is retried', async () => {
    const { task } = createFlakyTask(Infinity);
    const onRetry = vi.fn();

    const promise = retry(task, { onRetry })('p1', 2);
    const assertion = expect(promise).rejects.toThrow('Attempt 3 failed');

    await vi.runAllTimersAsync();

    await assertion;
    expect(onRetry).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenNthCalledWith(1, 1, new Error('Attempt 1 failed'));
    expect(onRetry).toHaveBeenNthCalledWith(2, 2, new Error('Attempt 2 failed'));
  });

  it('should call onRetry as an attempt fails, before waiting to retry', async () => {
    const { task } = createFlakyTask(Infinity);
    const onRetryAt: number[] = [];

    const promise = retry(task, { delayMs: 100, onRetry: () => onRetryAt.push(Date.now()) })(
      'p1',
      2,
    );
    const assertion = expect(promise).rejects.toThrow();

    await vi.runAllTimersAsync();

    await assertion;
    expect(onRetryAt).toStrictEqual([0, 100]);
  });

  it('should count the attempts of each call separately', async () => {
    const { task } = createFlakyTask(2);
    const fetchWithRetry = retry(task, { maxAttempts: 2 });

    const first = fetchWithRetry('p1', 2);
    const firstAssertion = expect(first).rejects.toThrow('Attempt 2 failed');

    await vi.runAllTimersAsync();
    await firstAssertion;

    const second = fetchWithRetry('p2', 1);

    await vi.runAllTimersAsync();

    await expect(second).resolves.toBe('p2 x1');
  });
});

describe('[retry]: typed tasks and attempt counts', () => {
  it('should take a task with typed parameters and keep its result type', async () => {
    const wrapped = retry(async (id: string, quantity: number) => `${id} x${quantity}`);

    const result: Promise<string> = wrapped('p1', 2);

    await expect(result).resolves.toBe('p1 x2');
  });

  it('should make one attempt where maxAttempts is below 1', async () => {
    const task = vi.fn(async () => {
      throw new Error('Failed');
    });

    await expect(retry(task, { maxAttempts: 0 })()).rejects.toThrow('Failed');

    expect(task).toHaveBeenCalledTimes(1);
  });
});
