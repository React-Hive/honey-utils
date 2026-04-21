/**
 * Clamps a negative translation offset to the available overflow bounds.
 *
 * @param offset - Negative translate offset.
 * @param overflowSize - Maximum overflow size along the axis.
 *
 * @returns Clamped negative offset, or `0` when no overflow exists.
 */
export const clampOffsetToOverflow = (offset: number, overflowSize: number): number => {
  if (overflowSize <= 0) {
    return 0;
  }

  return Math.max(-overflowSize, Math.min(offset, 0));
};
