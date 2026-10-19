import { calculateCenterOffset, clampOffsetToOverflow } from '~/geometry';

describe('[calculateCenterOffset]: offset that centres an element in a container', () => {
  it('should return the negative distance from the element centre to the container centre', () => {
    const result = calculateCenterOffset({
      containerSize: 100,
      elementOffset: 200,
      elementSize: 50,
    });

    expect(result).toBe(-175);
  });

  it('should return no offset for an element already centred', () => {
    const result = calculateCenterOffset({
      containerSize: 100,
      elementOffset: 40,
      elementSize: 20,
    });

    expect(result).toBeCloseTo(0);
  });

  it('should centre an element wider than the container', () => {
    const result = calculateCenterOffset({
      containerSize: 100,
      elementOffset: 0,
      elementSize: 300,
    });

    expect(result).toBe(-100);
  });

  it('should centre on half pixels for odd sizes', () => {
    const result = calculateCenterOffset({
      containerSize: 101,
      elementOffset: 100,
      elementSize: 15,
    });

    expect(result).toBe(-57);
  });

  it('should centre the element on the start of an empty container', () => {
    const result = calculateCenterOffset({
      containerSize: 0,
      elementOffset: 30,
      elementSize: 20,
    });

    expect(result).toBe(-40);
  });

  it('should give an offset that clampOffsetToOverflow bounds to the overflow', () => {
    // A strip 500 wide in a container 200 wide overflows by 300; its last item ends at 500.
    const offset = calculateCenterOffset({
      containerSize: 200,
      elementOffset: 450,
      elementSize: 50,
    });

    expect(offset).toBe(-375);
    expect(clampOffsetToOverflow(offset, 300)).toBe(-300);
  });
});

describe('[calculateCenterOffset]: positive and zero offsets', () => {
  it('should return a positive offset for an element before the container centre', () => {
    expect(calculateCenterOffset({ containerSize: 100, elementOffset: 0, elementSize: 20 })).toBe(
      40,
    );
  });

  it('should return 0, not -0, for an element already centred', () => {
    expect(
      Object.is(
        calculateCenterOffset({ containerSize: 100, elementOffset: 40, elementSize: 20 }),
        0,
      ),
    ).toBe(true);
  });
});
