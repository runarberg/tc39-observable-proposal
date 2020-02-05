import sinon from "sinon";

import register from "../../../../scripts/register.js";
import { fromIterable } from "../../generators/index.js";
import map from "../map.js";

const test = register("extras/operators/map");

test("maps the stream", t => {
  function* seq(n) {
    for (let i = 1; i <= n; i += 1) {
      yield i;
    }
  }

  const source = fromIterable(seq(10));
  const pipeline = map(x => x * 2);

  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  pipeline(source).subscribe(next, error, complete);

  t.equal(next.callCount, 10);
  t.equal(error.callCount, 0);
  t.equal(complete.callCount, 1);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
  );
});
