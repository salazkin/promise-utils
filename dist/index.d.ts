/**
 * Executes an array of Promise-returning functions sequentially.
 * @param arr - Array of functions returning Promises.
 * @returns Resolves when all Promises complete in sequence.
 */
export declare const sequence: (arr: Array<() => Promise<any>>) => Promise<any>;
/**
 * Executes an array of Promise-returning functions in parallel.
 * @param arr - Array of functions returning Promises.
 * @returns Resolves when all Promises complete.
 */
export declare const parallel: (arr: Array<() => Promise<any>>) => Promise<any[]>;
/**
 * Simple tween.
 * @param duration - Duration in milliseconds.
 * @param onUpdate - Callback with progress (0 to 1).
 * @param signal - Optional AbortSignal to cancel the animation.
 * @returns Resolves on completion or cancellation.
 */
export declare const tween: (duration: number, onUpdate: (t: number, aborted?: boolean) => void, signal?: AbortSignal) => Promise<void>;
/**
 * Delay using a promise.
 * @param duration - Duration in milliseconds.
 * @param signal - Optional AbortSignal to cancel the delay.
 * @returns Resolves on completion or cancellation.
 */
export declare const delay: (duration: number, signal?: AbortSignal) => Promise<void>;
export type StateHandler<State extends string> = (next: (state: State) => void, exit: () => void) => Promise<void> | void;
type StateConfig<State extends string> = {
    start: StateHandler<State>;
} & {
    [K in State]: StateHandler<State>;
};
/**
 * Micro state machine.
 * @param config - States object where each parameter is a state handler.
 * @returns Resolves when the state machine exits.
 * @example
 * await states({
 *   async start(next) {
 *     console.log("Starting...");
 *     next("idle");
 *   },
 *   async idle(next) {
 *     console.log("In the idle...");
 *     await delay(500);
 *     next("end");
 *   },
 *   async end(next, exit) {
 *     console.log("Ending...");
 *     await delay(500);
 *     exit();
 *    },
 * });
 */
export declare const states: <State extends string>(config: StateConfig<State>) => Promise<void>;
export {};
