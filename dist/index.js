/**
 * Executes an array of Promise-returning functions sequentially.
 * @param arr - Array of functions returning Promises.
 * @returns Resolves when all Promises complete in sequence.
 */
const sequence = (arr) => arr.reduce((prev, job) => prev.then(job), Promise.resolve());
/**
 * Executes an array of Promise-returning functions in parallel.
 * @param arr - Array of functions returning Promises.
 * @returns Resolves when all Promises complete.
 */
const parallel = (arr) => Promise.all(arr.map(job => job()));
const tick = typeof window !== "undefined" && typeof window.requestAnimationFrame === "function"
    ? window.requestAnimationFrame
    : (callback) => setTimeout(callback, 16); // ~60 FPS in node
/**
 * Simple tween.
 * @param duration - Duration in milliseconds.
 * @param onUpdate - Callback with progress (0 to 1) and skip flag.
 * @param flag - Optional flag to skip the animation.
 * @returns Resolves on completion or skip.
 */
const tween = async (duration, onUpdate, flag) => {
    const start = performance.now();
    return new Promise(resolve => {
        function step() {
            const now = performance.now();
            const elapsed = now - start;
            const t = Math.min(elapsed / duration, 1);
            if (flag?.skip) {
                onUpdate(t, true);
                resolve();
                return;
            }
            onUpdate(t);
            if (t < 1) {
                tick(step);
            }
            else {
                resolve();
            }
        }
        if (duration <= 0) {
            tick(() => {
                onUpdate(1, flag?.skip);
                resolve();
            });
        }
        else {
            step();
        }
    });
};
/**
 * Delay using a promise.
 * @param duration - Duration in milliseconds.
 * @param flag - Optional flag to skip the delay.
 * @returns Resolves on completion or skip.
 */
const delay = async (duration, flag) => {
    const start = performance.now();
    return new Promise(resolve => {
        function step() {
            const now = performance.now();
            const elapsed = now - start;
            const t = Math.min(elapsed / duration, 1);
            if (flag?.skip) {
                resolve();
                return;
            }
            if (t < 1) {
                tick(step);
            }
            else {
                resolve();
            }
        }
        if (duration <= 0) {
            tick(resolve);
        }
        else {
            step();
        }
    });
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
const states = async (config) => {
    return new Promise(resolve => {
        const exit = () => resolve();
        const next = (state) => processState(state);
        const processState = async (state) => {
            const stateHandler = config[state];
            if (!stateHandler) {
                throw new Error(`State "${state}" is not defined.`);
            }
            await stateHandler(next, exit);
        };
        processState("start");
    });
};

export { delay, parallel, sequence, states, tween };
//# sourceMappingURL=index.js.map
