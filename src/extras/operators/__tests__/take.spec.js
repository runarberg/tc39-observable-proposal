import sinon from "sinon";

import register from "../../../../scripts/register.js";
import { fromIterable } from "../../generators/index.js";
import take from "../take.js";

const test = register("extras/operators/take");

function* seq(n) {
  for (let i = 1; i <= n; i += 1) {
    yield i;
  }
}

test("takes the first n from a stream", t => {
  const source = fromIterable(seq(Number.POSITIVE_INFINITY));
  const pipeline = take(3);

  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  pipeline(source).subscribe(next, error, complete);

  t.equal(next.callCount, 3);
  t.equal(error.callCount, 0);
  t.equal(complete.callCount, 1);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [1, 2, 3],
  );
});
