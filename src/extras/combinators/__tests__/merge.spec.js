import sinon from "sinon";

import register from "../../../../scripts/register.js";
import { fromIterable } from "../../generators/index.js";
import merge from "../merge.js";

const test = register("extras/combinators/merge");

function* seq(start, end) {
  for (let i = start; i < end; i += 1) {
    yield i;
  }
}

test("merges sources", t => {
  const source = merge([
    fromIterable(seq(1, 4)),
    fromIterable(seq(4, 7)),
    fromIterable(seq(7, 11)),
  ]);

  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  source.subscribe(next, error, complete);

  t.equal(next.callCount, 10);
  t.equal(error.callCount, 0);
  t.equal(complete.callCount, 1);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
});
