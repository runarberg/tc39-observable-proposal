import AbortController from "abort-controller";
import sinon from "sinon";

import register from "../../scripts/register.js";
import Observable from "../Observable.js";

const test = register("Observable");

test("should at least work", t => {
  const source = new Observable((next, error, complete) => {
    next(1);
    next(2);
    next(3);
    complete();
  });

  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  source.subscribe(next, error, complete);

  t.equal(next.callCount, 3);
  t.equal(error.callCount, 0);
  t.equal(complete.callCount, 1);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [1, 2, 3],
  );
});

test("should handle firehose", t => {
  const source = new Observable((next, err, complete, signal) => {
    for (let i = 0; i < 100 && !signal.aborted; i += 1) {
      next(i);
    }
    // this will noop due to protections after abort below
    // which is "unsubscription".
    complete();
  });

  const controller = new AbortController();

  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  let loops = 0;
  source.subscribe(
    value => {
      next(value);
      loops += 1;

      if (loops === 3) {
        // "unsubscribe"
        controller.abort();
      }
    },
    error,
    complete,
    controller.signal,
  );

  t.equal(next.callCount, 3);
  t.equal(error.callCount, 0);

  // complete should not be called, because of the
  // abort (unsubscription) above
  t.equal(complete.callCount, 0);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [0, 1, 2],
  );
});

test("a basic interval", async t => {
  /**
   * This test is a bit non-deterministic because of the
   * use of `setInterval` and `setTimeout`. It's mostly
   * meant to show usage.
   */
  function completeIn(ms, upstream) {
    return new Observable((next, error, complete, signal) => {
      upstream.subscribe(next, error, complete, signal);

      globalThis.setTimeout(complete, ms);
    });
  }

  const source = new Observable((next, error, complete, signal) => {
    let n = 0;

    const id = globalThis.setInterval(() => {
      next(n);
      n += 1;
    }, 100);

    signal.addEventListener("abort", () => {
      clearInterval(id);
    });
  });

  const next = sinon.fake();

  await new Promise((resolve, reject) => {
    completeIn(550, source).subscribe(next, reject, resolve);
  });

  t.equal(next.callCount, 5);
  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [0, 1, 2, 3, 4],
  );
});
