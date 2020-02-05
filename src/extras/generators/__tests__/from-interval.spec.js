import AbortController from "abort-controller";
import sinon from "sinon";

import register from "../../../../scripts/register.js";
import fromInterval from "../from-interval.js";

const test = register("extras/generators/fromAsyncIterable");

function sleep(ms) {
  return new Promise(resolve => {
    globalThis.setTimeout(resolve, ms);
  });
}

test("periodically emits", async t => {
  const period = 50;
  const controller = new AbortController();

  // Make sure we clean up.
  const done = sleep(4 * period).then(() => {
    controller.abort();
  });

  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  fromInterval(period).subscribe(next, error, complete, controller.signal);

  // Go between periods to be safe.
  await sleep(period / 2);

  t.equal(next.callCount, 0);

  await sleep(period);

  t.equal(next.callCount, 1);

  await sleep(2 * period);

  t.equal(next.callCount, 3);
  controller.abort();

  await done;

  t.equal(next.callCount, 3);
  t.equal(error.callCount, 0);
  t.equal(complete.callCount, 0);
});
