import sinon from "sinon";

import register from "../../../../scripts/register.js";
import Observable from "../../../Observable.js";
import chunks from "../chunks.js";

function sleep(ms) {
  return new Promise(resolve => globalThis.setTimeout(resolve, ms));
}

const test = register("extras/operators/chunks");

test("splits into chunks per sync loop", async t => {
  const source = new Observable(async (next, error, complete) => {
    next(0);
    next(1);
    next(2);

    await sleep(50);
    next(53);
    next(54);

    await sleep(100);
    next(155);

    await sleep(100);
    next(256);
    complete();
  });

  const pipeline = chunks();

  const next = sinon.fake();

  await new Promise((resolve, reject) => {
    pipeline(source).subscribe(next, reject, resolve);
  });

  t.equal(next.callCount, 4);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [[0, 1, 2], [53, 54], [155], [256]],
  );
});
