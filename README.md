# Promise Utility Library

A minimalistic utility library for managing states and executing asynchronous operations using promises. Includes functions for running tasks in sequence or parallel, tweening values, and managing a micro state machine.

---

## Sequence and Parallel

Run promises in sequence or parallel.

### Example

```javascript
import { sequence, parallel, delay } from "@salazkin/promise-utils";

const tasks = [
  async () => {
    await delay(1000);
    console.log("Task 1 done");
  },
  async () => {
    await delay(200);
    console.log("Task 2 done");
  },
  async () => {
    await delay(500);
    console.log("Task 3 done");
  },
];

(async () => {
  await sequence(tasks); // Output: Task 1 done, Task 2 done, Task 3 done
  console.log("Sequence complete");

  await parallel(tasks); // Output: Task 2 done, Task 3 done, Task 1 done
  console.log("Parallel complete");
})();
```

---

## Tween

A simple tween that resolves as a promise. Tweens a value from `0` to `1` over a specified duration. Can be canceled using an AbortSignal.

### Example

```javascript
import { tween } from "@salazkin/promise-utils";

const lerp = (start, end, t) => start + (end - start) * t;

(async () => {
  await tween(1000, (progress) => {
    const value = lerp(0, 100, progress); // Interpolate from 0 to 100
    console.log(`Value: ${value}`);
  });
  console.log("Tween 1 complete");

  // Example with cancellation
  await tween(
    1000,
    (progress, aborted) => {
      console.log(`Progress: ${progress}`);
      if (aborted) console.log("Tween aborted");
    },
    AbortSignal.timeout(500) // Skip after 500ms
  );
  console.log("Tween 2 complete");
})();
```

---

## Delay

A simple delay function that resolves after a specified duration.

### Example

```javascript
import { delay } from "@salazkin/promise-utils";

(async () => {
  await delay(1000);
  console.log("1 second delay complete");
})();
```

---

## States

A micro state machine that resolves as a promise. Each state is a handler function that can transition to the next state or exit.

### Example

```javascript
import { states, delay } from "@salazkin/promise-utils";

(async () => {
  await states({
    async start(next) {
      console.log("Starting...");
      next("idle");
    },
    async idle(next) {
      console.log("In the idle...");
      await delay(500);
      next("end");
    },
    async end(next, exit) {
      console.log("Ending...");
      await delay(500);
      exit();
    },
  });
  console.log("State machine exited");
})();
```

---

## Installation

```bash
npm install @salazkin/promise-utils
```

---

## License

MIT
