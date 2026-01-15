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
   */
  deltaTimeMs: number;
  /**
   * Exponential friction coefficient controlling velocity decay.
   *
   * Friction is applied per millisecond using an exponential model:
   *
   * `velocityPxMs *= exp(-friction * deltaTimeMs)`
   *
   * Smaller values result in longer, floatier inertia;
   * larger values cause quicker deceleration.
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
  /**
   * Exponential Moving Average (EMA) factor used to smooth velocity changes.
   *
   * This is applied **after friction**, blending the previous velocity
   * with the newly decayed velocity to reduce jitter and sudden spikes.
   *
   * Value range: `0..1`
   *
   * - `0` → EMA disabled (raw exponential decay only)
   * - `0.2` → light smoothing (recommended for scroll / drag inertia)
   * - `0.5` → heavy smoothing (very soft, less responsive)
   *
   * Formula:
   * `vNext = vPrev * (1 - emaAlpha) + vDecayed * emaAlpha`
   *
   * @default 0.2
   */
  emaAlpha?: number;
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
 * Returned when inertia is still active and further movement in the current direction is possible.
 */
export interface InertiaStepResult {
  /**
   * Updated value after applying this inertia step.
   *
   * Guaranteed to be within `[min, max]`.
   */
  value: number;
  /**
   * Updated velocity after friction decay and optional EMA smoothing.
   *
   * Expressed in pixels per millisecond (`px/ms`).
   */
  velocityPxMs: number;
}

/**
 * Applies a **single step** of bounded, velocity-based inertia.
 *
 * This function models **momentum-driven motion** by:
 * - integrating velocity over elapsed time
 * - applying exponential friction
 * - optionally smoothing velocity using EMA
 * - enforcing hard bounds via {@link resolveBoundedDelta}
 *
 * Boundary handling guarantees:
 * - no overshoot
 * - no oscillation at limits
 * - deterministic stopping behavior
 *
 * ---
 *
 * ### Termination conditions
 * Inertia ends immediately when:
 * - the absolute velocity falls below `minVelocityPxMs`, or
 * - movement in the current direction is blocked by a bound
 *
 * ---
 *
 * ⚠️ **Single-step function**
 * This function advances inertia **once only**.
 * It must be invoked repeatedly from an animation loop
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
 * @returns An {@link InertiaStepResult} while inertia remains active,
 *          or `null` when inertia has completed or cannot proceed.
 */
export const applyInertiaStep = ({
  value,
  min,
  max,
  velocityPxMs,
  deltaTimeMs,
  friction = 0.002,
  minVelocityPxMs = 0.01,
  emaAlpha = 0.2,
}: ApplyInertiaStepOptions): Nullable<InertiaStepResult> => {
  if (Math.abs(velocityPxMs) < minVelocityPxMs) {
    return null;
  }

  const nextValue = resolveBoundedDelta({
    delta: velocityPxMs * deltaTimeMs,
    value,
    min,
    max,
  });

  // Hit a hard bound → stop inertia immediately
  if (nextValue === null) {
    return null;
  }

  /**
   * Apply exponential friction.
   * The exponent is **negative** because friction must continuously *reduce* velocity over time.
   */
  const decay = Math.exp(-friction * deltaTimeMs);
  const pureVelocityPxMs = velocityPxMs * decay;

  const nextVelocityPxMs =
    emaAlpha > 0 ? velocityPxMs * (1 - emaAlpha) + pureVelocityPxMs * emaAlpha : pureVelocityPxMs;

  if (Math.abs(nextVelocityPxMs) < minVelocityPxMs) {
    return null;
  }

  return {
    value: nextValue,
    velocityPxMs: nextVelocityPxMs,
  };
};
