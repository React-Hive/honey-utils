// @vitest-environment jsdom
import { parse2DMatrix } from '~/dom';

const IDENTITY = {
  translateX: 0,
  translateY: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
};

const stubComputedTransform = (transform: string) =>
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    getPropertyValue: (property: string) => (property === 'transform' ? transform : ''),
  } as CSSStyleDeclaration);

describe('[parse2DMatrix]: read the values of an element’s 2D transform matrix', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should read the values in the order of matrix(a, b, c, d, e, f)', () => {
    stubComputedTransform('matrix(2, 0.5, -0.25, 3, 10, -20)');

    expect(parse2DMatrix(document.createElement('div'))).toStrictEqual({
      scaleX: 2,
      skewY: 0.5,
      skewX: -0.25,
      scaleY: 3,
      translateX: 10,
      translateY: -20,
    });
  });

  it('should read a translation alone', () => {
    stubComputedTransform('matrix(1, 0, 0, 1, -120.5, 48)');

    expect(parse2DMatrix(document.createElement('div'))).toStrictEqual({
      ...IDENTITY,
      translateX: -120.5,
      translateY: 48,
    });
  });

  it('should read values in exponent notation', () => {
    stubComputedTransform('matrix(1, 0, 0, 1, 1e-05, -2.5e+06)');

    const { translateX, translateY } = parse2DMatrix(document.createElement('div'));

    expect(translateX).toBe(0.00001);
    expect(translateY).toBe(-2500000);
  });

  it('should read the computed style of the given element', () => {
    const getComputedStyle = stubComputedTransform('matrix(1, 0, 0, 1, 0, 0)');
    const element = document.createElement('div');

    parse2DMatrix(element);

    expect(getComputedStyle).toHaveBeenCalledWith(element);
  });

  it('should return the identity values when there is no transform', () => {
    stubComputedTransform('none');

    expect(parse2DMatrix(document.createElement('div'))).toStrictEqual(IDENTITY);
  });

  it('should return the identity values for an empty transform', () => {
    stubComputedTransform('');

    expect(parse2DMatrix(document.createElement('div'))).toStrictEqual(IDENTITY);
  });

  it('should return the identity values for a 3D matrix', () => {
    stubComputedTransform('matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 30, 1)');

    expect(parse2DMatrix(document.createElement('div'))).toStrictEqual(IDENTITY);
  });
});
