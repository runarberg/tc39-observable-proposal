import sinon from "sinon";

import register from "../../../../scripts/register.js";
import { fromIterable } from "../../generators/index.js";
import filter from "../filter.js";

const test = register("extras/operators/filter");

test("filters the stream", t => {
  function* seq(n) {
    for (let i = 1; i <= n; i += 1) {
      yield i;
    }
  }

  const source = fromIterable(seq(10));
  const pipeline = filter(x => x % 2 === 0);

  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  pipeline(source).subscribe(next, error, complete);

  t.equal(next.callCount, 5);
  t.equal(error.callCount, 0);
  t.equal(complete.callCount, 1);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [2, 4, 6, 8, 10],
  );
});
