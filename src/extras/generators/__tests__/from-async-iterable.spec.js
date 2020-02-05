import AbortController from "abort-controller";
import sinon from "sinon";

import register from "../../../../scripts/register.js";
import fromAsyncIterable from "../from-async-iterable.js";

const test = register("extras/generators/fromAsyncIterable");

function sleep(ms) {
  return new Promise(resolve => globalThis.setTimeout(resolve, ms));
}

async function* seq(n) {
  for (let i = 1; i <= n; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await sleep(100);
    yield i;
  }
}

test("completes the stream", async t => {
  const next = sinon.fake();

  await new Promise((resolve, reject) => {
    fromAsyncIterable(seq(10)).subscribe(next, reject, resolve);
  });

  t.equal(next.callCount, 10);
  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
});

test("aborting stops the loop", async t => {
  const controller = new AbortController();
  const next = sinon.fake();

  await new Promise((resolve, reject) => {
    controller.signal.addEventListener("abort", resolve);

    fromAsyncIterable(seq(Number.POSITIVE_INFINITY)).subscribe(
      x => {
        next(x);

        if (x > 3) {
          controller.abort();
        }
      },
      reject,
      resolve,
      controller.signal,
    );
  });

  t.equal(next.callCount, 4);
});
