import sinon from "sinon";

import register from "../../../../scripts/register.js";
import { pipe } from "../../index.js";
import { fromInterval, fromIterable } from "../../generators/index.js";
import { map, take } from "../../operators/index.js";
import race from "../race.js";

const test = register("extras/combinators/race");

function* seq(start, end) {
  for (let i = start; i < end; i += 1) {
    yield i;
  }
}

test("picks the first sync stream", t => {
  const source = race([
    fromIterable(seq(1, 6)),
    fromIterable(seq(6, 11)),
    fromIterable(seq(11, 16)),
  ]);

  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  source.subscribe(next, error, complete);

  t.equal(next.callCount, 5);
  t.equal(error.callCount, 0);
  t.equal(complete.callCount, 1);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [1, 2, 3, 4, 5],
  );
});

test("picks the fastest async stream", async t => {
  const source = race([
    pipe(
      fromInterval(150),
      map(() => "slow"),
    ),

    pipe(
      fromInterval(100),
      map(() => "medium"),
    ),

    pipe(
      fromInterval(50),
      map(() => "fast"),
    ),
  ]);

  const next = sinon.fake();

  await new Promise((resolve, reject) => {
    pipe(source, take(10)).subscribe(next, reject, resolve);
  });

  t.equal(next.callCount, 10);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    Array.from({ length: 10 }).fill("fast"),
  );
});
