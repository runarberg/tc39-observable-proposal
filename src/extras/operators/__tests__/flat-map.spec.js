import sinon from "sinon";

import register from "../../../../scripts/register.js";
import { pipe } from "../../index.js";
import { fromInterval, fromIterable } from "../../generators/index.js";
import { map, take } from "../index.js";
import flatMap from "../flat-map.js";

const test = register("extras/operators/flatMap");

function* seq(start, end) {
  for (let i = start; i < end; i += 1) {
    yield i;
  }
}

test("maps and merges the resulting stream of observables", t => {
  const source = fromIterable(seq(0, 3));
  const pipeline = flatMap(x => fromIterable(seq(x * 3 + 1, x * 3 + 4)));

  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  pipeline(source).subscribe(next, error, complete);

  t.equal(next.callCount, 9);
  t.equal(error.callCount, 0);
  t.equal(complete.callCount, 1);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  );
});

test("cleans up upstream", async t => {
  const stream = pipe(
    fromIterable(seq(1, 4)),
    flatMap(x =>
      pipe(
        fromInterval(x * 50),
        map(() => x),
      ),
    ),
    take(12),
  );
  const next = sinon.fake();

  await new Promise((resolve, reject) => {
    stream.subscribe(next, reject, resolve);
  });

  t.equal(next.callCount, 12);
});
