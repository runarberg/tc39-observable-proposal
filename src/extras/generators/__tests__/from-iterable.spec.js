import sinon from "sinon";
import AbortController from "abort-controller";

import register from "../../../../scripts/register.js";
import fromIterable from "../from-iterable.js";

const test = register("extras/generators/fromIterable");

function* seq(n) {
  for (let i = 1; i <= n; i += 1) {
    yield i;
  }
}

test("basic", t => {
  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  fromIterable(seq(10)).subscribe(next, error, complete);

  t.equal(next.callCount, 10);
  t.equal(error.callCount, 0);
  t.equal(complete.callCount, 1);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
});

test("aborting", t => {
  const controller = new AbortController();

  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  fromIterable(seq(Number.POSITIVE_INFINITY)).subscribe(
    x => {
      next(x);

      if (x > 3) {
        controller.abort();
      }
    },
    error,
    complete,
    controller.signal,
  );

  t.equal(next.callCount, 4);
  t.equal(error.callCount, 0);
  t.equal(complete.callCount, 0);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [1, 2, 3, 4],
  );
});
