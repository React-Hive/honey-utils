import { generateEphemeralId } from './generate-ephemeral-id';

describe('generateEphemeralId', () => {
  const originalNow = performance.now;
  const originalRandom = Math.random;

  afterEach(() => {
    performance.now = originalNow;
    Math.random = originalRandom;
  });

  test('should return a non-empty string', () => {
    const id = generateEphemeralId();

    expect(id.length).toBeGreaterThan(0);
  });

  test('should produce different values for consecutive calls', () => {
    const id1 = generateEphemeralId();
    const id2 = generateEphemeralId();

    expect(id1).not.toBe(id2);
  });

  test('should include timestamp-derived prefix', () => {
    performance.now = () => 123.456;

    const id = generateEphemeralId();

    const expectedPrefix = Math.floor(123.456 * 1000).toString(36);

    expect(id.startsWith(expectedPrefix)).toBe(true);
  });

  test('should include random-derived suffix', () => {
    Math.random = () => 0.123456789;

    const id = generateEphemeralId();

    const expectedSuffix = Math.random().toString(36).slice(2, 10);

    expect(id.endsWith(expectedSuffix)).toBe(true);
  });

  test('should be stable for fixed time and random inputs', () => {
    performance.now = () => 1;
    Math.random = () => 0.5;

    const id1 = generateEphemeralId();
    const id2 = generateEphemeralId();

    expect(id1).toBe(id2);
  });
});
