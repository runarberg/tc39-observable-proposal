import sinon from "sinon";

import register from "../../../scripts/register.js";
import Observable from "../../Observable.js";
import { fromIterable } from "../generators/index.js";
import {
  filter,
  flatMap,
  map,
  reduce,
  skip,
  take,
} from "../operators/index.js";
import pipe from "../pipe.js";

const test = register("extras/pipe");

function sleep(ms) {
  return new Promise(resolve => globalThis.setTimeout(resolve, ms));
}

function* seq(n) {
  for (let i = 1; i <= n; i += 1) {
    yield i;
  }
}

test("pipe to a promise", async t => {
  const result = await pipe(
    fromIterable(seq(Number.POSITIVE_INFINITY)),
    skip(10),
    filter(x => x % 2 === 0),
    map(x => x * 2),
    take(5),
    reduce((sum, x) => sum + x, 0),
  );

  t.equal(result, 160);
});

test("pipe to an async stream", async t => {
  const stream = pipe(
    fromIterable(seq(10)),
    flatMap(
      x =>
        new Observable(async (next, _, complete) => {
          await sleep(10 * x);
          next(x);
          complete();
        }),
    ),
  );

  const next = sinon.fake();

  await new Promise((resolve, reject) => {
    stream.subscribe(next, reject, resolve);
  });

  t.equal(next.callCount, 10);
  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
});
