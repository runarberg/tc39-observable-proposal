import sinon from "sinon";

import register from "../../scripts/register.js";
import Observable from "../Observable.js";

const test = register("Symbol.asyncIterator");

function sleep(ms) {
  return new Promise(resolve => globalThis.setTimeout(resolve, ms));
}

test("a complete stream", async t => {
  const source = new Observable(async (next, error, complete) => {
    await sleep(100);
    next(1);
    next(2);
    await sleep(100);
    next(3);
    await sleep(200);
    next(4);
    next(5);
    // error(new Error("whoops"));
    next(6);
    complete();
  });

  const next = sinon.fake();

  for await (const x of source) {
    next(x);
  }

  t.equal(next.callCount, 6);
  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [1, 2, 3, 4, 5, 6],
  );
});

test("a failed stream", async t => {
  const source = new Observable(async (next, error, complete) => {
    await sleep(100);
    next(1);
    next(2);
    await sleep(100);
    next(3);
    await sleep(200);
    next(4);
    next(5);
    error(new Error("whoops"));
    next(6);
    complete();
  });

  const next = sinon.fake();

  await t.rejects(
    async () => {
      for await (const x of source) {
        next(x);
      }
    },
    {
      name: "Error",
      message: "whoops",
    },
  );

  t.equal(next.callCount, 5);
  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [1, 2, 3, 4, 5],
  );
});
