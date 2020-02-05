import sinon from "sinon";

import register from "../../../../scripts/register.js";
import { fromIterable } from "../../generators/index.js";
import skip from "../skip.js";

const test = register("extras/operators/skip");

function* seq(n) {
  for (let i = 1; i <= n; i += 1) {
    yield i;
  }
}

test("skips n from stream", t => {
  const source = fromIterable(seq(10));
  const pipeline = skip(3);

  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  pipeline(source).subscribe(next, error, complete);

  t.equal(next.callCount, 7);
  t.equal(error.callCount, 0);
  t.equal(complete.callCount, 1);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [4, 5, 6, 7, 8, 9, 10],
  );
});
