import sinon from "sinon";

import register from "../../../../scripts/register.js";
import { pipe } from "../../index.js";
import { fromIterable } from "../../generators/index.js";
import { catchError, map } from "../index.js";

const test = register("extras/operators/catchError");

test("error fizz buzz", t => {
  function* seq(n) {
    for (let i = 1; i <= n; i += 1) {
      yield i;
    }
  }

  function errorFizzBuzz(x) {
    let error = "";

    if (x % 3 === 0) {
      error += "fizz";
    }

    if (x % 5 === 0) {
      error += "buzz";
    }

    if (error) {
      throw new Error(error);
    }

    return x;
  }

  const stream = pipe(
    fromIterable(seq(20)),
    map(errorFizzBuzz),
    catchError(error => error.message),
  );

  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  stream.subscribe(next, error, complete);

  t.equal(next.callCount, 20);
  t.equal(error.callCount, 0);
  t.equal(complete.callCount, 1);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [
      1,
      2,
      "fizz",
      4,
      "buzz",
      "fizz",
      7,
      8,
      "fizz",
      "buzz",
      11,
      "fizz",
      13,
      14,
      "fizzbuzz",
      16,
      17,
      "fizz",
      19,
      "buzz",
    ],
  );
});
