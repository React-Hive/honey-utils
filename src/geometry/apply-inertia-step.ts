import type { Nullable } from '~/types';
import { resolveBoundedDelta } from '~/geometry';

export interface InertiaOptions {
  /**
   * Current velocity of the motion, expressed in units per millisecond.
   *
   * The unit depends on the context in which inertia is applied:
   * - `px/ms` for scrolling or dragging
   * - arbitrary units for sliders or timelines
   *
   * The sign indicates direction (positive or negative).
   */
  velocity: number;
  /**
   * Time elapsed since the previous inertia step, in milliseconds.
   *
   * This value is typically derived from a high-resolution clock such as `performance.now()`
   * and allows inertia behavior to remain frame-rate independent.
   */
  deltaTime: number;
  /**
   * Exponential friction coefficient controlling how quickly velocity decays over time.
   *
   * This value is applied per millisecond and produces smooth, natural-feeling
   * deceleration when used with an exponential decay model.
   *
   * Smaller values result in a longer glide; larger values cause inertia
   * to stop more quickly.
   *
   * Typical values:
   * - `0.001` – very long, floaty motion
   * - `0.002` – balanced, natural decay (default)
   * - `0.005` – quick stop
   *
   * @default 0.002
   */
  friction?: number;
  /**
   * Minimum absolute velocity below which inertia is considered complete.
   *
   * When the absolute value of the current velocity drops below this threshold,
   * no further movement is applied and inertia terminates.
   *
   * This prevents unnecessary micro-updates and jitter near rest.
   *
   * @default 0.01
   */
  minVelocity?: number;
}

interface ApplyInertiaStepOptions extends InertiaOptions {
  /**
   * Current value before applying the inertia step.
   *
   * This typically represents a translated position (e.g. scroll offset),
   * but may be any bounded numeric value.
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
 * Advances a value by one inertia step using velocity, friction, and hard bounds.
 *
 * This utility models **inertial motion** (momentum + decay) on top of
 * {@link resolveBoundedDelta}, which acts as the authoritative constraint layer.
 *
 * The function:
 * - Integrates velocity over the elapsed time to produce a movement delta
 * - Resolves that delta against fixed bounds
 * - Applies exponential friction to gradually reduce velocity
 * - Stops immediately when a bound is hit or velocity falls below a threshold
 *
 * ⚠️ This function performs **one step only** and is intended to be called
 * repeatedly from an animation loop (e.g. `requestAnimationFrame`).
 *
 * ### Common use cases
 * - Synthetic scrolling with momentum
 * - Carousels and sliders
 * - Timelines and scrubbers
 * - Drag-to-scroll interactions with inertia
 *
 * @param value - Current value before applying inertia (e.g. translate position).
 * @param min - Minimum allowed value (inclusive).
 * @param max - Maximum allowed value (inclusive).
 * @param velocity - Current velocity in units per millisecond (e.g. px/ms).
 * @param deltaTime - Time elapsed since the previous step, in milliseconds.
 * @param friction - Exponential friction coefficient controlling decay rate.
 * @param minVelocity - Minimum velocity below which inertia stops.
 *
 * @returns An object containing the updated value and velocity,
 *          or `null` when inertia has completed or movement is no longer possible.
 *
 * @example
 * ```ts
 * let value = translateX;
 * let velocity = releaseVelocity; // px/ms from drag end
 * let lastTime = performance.now();
 *
 * const step = (time: number) => {
 *   const deltaTime = time - lastTime;
 *   lastTime = time;
 *
 *   const result = applyInertiaStep({
 *     value,
 *     velocity,
 *     min: -maxOverflow,
 *     max: 0,
 *     deltaTime,
 *   });
 *
 *   if (!result) {
 *     return; // inertia finished
 *   }
 *
 *   value = result.value;
 *   velocity = result.velocity;
 *
 *   container.style.transform = `translateX(${value}px)`;
 *   requestAnimationFrame(step);
 * };
 *
 * requestAnimationFrame(step);
 * ```
 */
export const applyInertiaStep = ({
  value,
  min,
  max,
  velocity,
  deltaTime,
  friction = 0.002,
  minVelocity = 0.01,
}: ApplyInertiaStepOptions): Nullable<{
  value: number;
  velocity: number;
}> => {
  if (Math.abs(velocity) < minVelocity) {
    return null;
  }

  // Distance we want to move this frame
  const delta = velocity * deltaTime;

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
  const decay = Math.exp(-friction * deltaTime);
  const nextVelocity = velocity * decay;

  return {
    value: nextValue,
    velocity: nextVelocity,
  };
};
