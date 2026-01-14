import type { Nullable } from '~/types';
import { resolveBoundedDelta } from '~/geometry';

export interface InertiaOptions {
  /**
   * Current velocity of the inertial motion.
   *
   * Expressed in **pixels per millisecond (`px/ms`)**.
   *
   * The sign determines direction:
   * - Positive → movement toward the upper bound
   * - Negative → movement toward the lower bound
   */
  velocityPxMs: number;
  /**
   * Time elapsed since the previous inertia step, in milliseconds.
   *
   * This value is typically derived from a high-resolution timestamp
   * (e.g. `performance.now()`), ensuring frame-rate-independent behavior.
   */
  deltaTimeMs: number;
  /**
   * Exponential friction coefficient controlling how quickly velocity decays.
   *
   * The decay is applied per millisecond using an exponential model:
   *
   * `velocityPxMs *= exp(-friction * deltaTimeMs)`
   *
   * Smaller values produce longer, floatier motion; larger values result in a quicker stop.
   *
   * Typical values:
   * - `0.001` — very long, floaty inertia
   * - `0.002` — balanced, natural decay (default)
   * - `0.005` — short, snappy stop
   *
   * @default 0.002
   */
  friction?: number;
  /**
   * Minimum absolute velocity below which inertia is considered complete.
   *
   * When `|velocityPxMs| < minVelocityPxMs`, inertia terminates and no further movement is applied.
   *
   * This prevents unnecessary micro-updates and visual jitter near rest.
   *
   * @default 0.01
   */
  minVelocityPxMs?: number;
}

interface ApplyInertiaStepOptions extends InertiaOptions {
  /**
   * Current numeric value before applying the inertia step.
   *
   * This commonly represents a translated position
   * (e.g. scroll offset or `translateX` value),
   * but may be any numeric value constrained by bounds.
   */
  value: number;
  /**
   * Lower bound for the value (inclusive).
   */
  min: number;
  /**
   * Upper bound for the value (inclusive).
   */
  max: number;
}

/**
 * Result of a single inertia simulation step.
 *
 * Returned when inertia is still active and further movement
 * in the current direction is possible.
 */
export interface InertiaStepResult {
  /**
   * Updated value after applying the inertial step.
   */
  value: number;
  /**
   * Updated velocity after applying exponential decay.
   *
   * Expressed in pixels per millisecond (`px/ms`).
   */
  velocityPxMs: number;
}

/**
 * Advances a value by a single inertial step using velocity,
 * elapsed time, exponential friction, and hard bounds.
 *
 * This function models **momentum-driven motion** and delegates
 * boundary enforcement to {@link resolveBoundedDelta}, which guarantees:
 * - no overshoot
 * - no jitter at bounds
 * - deterministic stopping behavior
 *
 * ---
 *
 * ### Termination conditions
 * Inertia stops immediately when:
 * - the absolute velocity falls below `minVelocityPxMs`, or
 * - movement in the current direction is blocked by a bound
 *
 * ---
 *
 * ⚠️ **Single-step function**
 * This function performs **one inertia step only**.
 * It must be called repeatedly from an animation loop
 * (e.g. `requestAnimationFrame`) to produce continuous motion.
 *
 * ---
 *
 * ### Common use cases
 * - Synthetic scrolling with momentum
 * - Drag-to-scroll interactions
 * - Carousels and sliders
 * - Timelines and scrubbers
 *
 * @returns An {@link InertiaStepResult} when inertia is still active,
 *          or `null` when inertia has completed or further movement
 *          is not possible.
 */
export const applyInertiaStep = ({
  value,
  min,
  max,
  velocityPxMs,
  deltaTimeMs,
  friction = 0.002,
  minVelocityPxMs = 0.01,
}: ApplyInertiaStepOptions): Nullable<InertiaStepResult> => {
  if (Math.abs(velocityPxMs) < minVelocityPxMs) {
    return null;
  }

  // Distance we want to move this frame
  const delta = velocityPxMs * deltaTimeMs;

  const nextValue = resolveBoundedDelta({
    delta,
    value,
    min,
    max,
  });

  // Hit a hard bound → stop inertia immediately
  if (nextValue === null) {
    return null;
  }

  // Apply exponential friction
  const decay = Math.exp(-friction * deltaTimeMs);
  const nextVelocityPxMs = velocityPxMs * decay;

  return {
    value: nextValue,
    velocityPxMs: nextVelocityPxMs,
  };
};
