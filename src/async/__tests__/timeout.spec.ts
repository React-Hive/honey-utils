import { timeout } from '~/async';

const resolveAfter = <T>(ms: number, value: T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(value), ms));

const rejectAfter = (ms: number, error: Error): Promise<never> =>
  new Promise((_, reject) => setTimeout(() => reject(error), ms));

describe('[timeout]: reject a promise that does not settle in time', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should resolve with the value of a promise that has already resolved', async () => {
    await expect(timeout(Promise.resolve('done'), 1000)).resolves.toBe('done');
  });

  it('should resolve with the value of a promise that resolves before the timeout', async () => {
    const promise = timeout(resolveAfter(999, 'done'), 1000);

    await vi.advanceTimersByTimeAsync(999);

    await expect(promise).resolves.toBe('done');
  });

  it('should reject with the error of a promise that rejects before the timeout', async () => {
    const promise = timeout(rejectAfter(500, new Error('Request failed')), 1000);
    const assertion = expect(promise).rejects.toThrow('Request failed');

    await vi.advanceTimersByTimeAsync(1000);

    await assertion;
  });

  it('should reject with a timeout error once the time is up, not before', async () => {
    const onReject = vi.fn();

    timeout(new Promise(() => {}), 1000).catch(onReject);

    await vi.advanceTimersByTimeAsync(999);
    expect(onReject).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    expect(onReject).toHaveBeenCalledTimes(1);
    expect(onReject).toHaveBeenCalledWith(new Error('Operation timed out'));
    expect(onReject.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it('should reject with the custom message once the time is up', async () => {
    const promise = timeout(resolveAfter(5000, 'too late'), 2000, 'Too long');
    const assertion = expect(promise).rejects.toThrow(new Error('Too long'));

    await vi.advanceTimersByTimeAsync(2000);

    await assertion;
  });
});

describe('[timeout]: its timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should leave no timer behind once the promise settles', async () => {
    await timeout(Promise.resolve('done'), 1000);

    expect(vi.getTimerCount()).toBe(0);
  });

  it('should leave no timer behind once the promise rejects', async () => {
    await expect(timeout(Promise.reject(new Error('Failed')), 1000)).rejects.toThrow('Failed');

    expect(vi.getTimerCount()).toBe(0);
  });
});
