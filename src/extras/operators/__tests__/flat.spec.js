import sinon from "sinon";

import register from "../../../../scripts/register.js";
import Observable from "../../../Observable.js";
import { fromIterable } from "../../generators/index.js";
import flat from "../flat.js";

const test = register("extras/operators/flat");

function* seq(start, end) {
  for (let i = start; i < end; i += 1) {
    yield i;
  }
}

test("defaults to one level", t => {
  const sources = new Observable((next, _, complete) => {
    next(fromIterable(seq(1, 4)));
    next(fromIterable(seq(4, 7)));
    next(fromIterable(seq(7, 11)));
    complete();
  });

  const pipeline = flat();

  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  pipeline(sources).subscribe(next, error, complete);

  t.equal(next.callCount, 10);
  t.equal(error.callCount, 0);
  t.equal(complete.callCount, 1);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
});

test("deep levels", t => {
  const sources = new Observable((next, _, complete) => {
    next(
      new Observable((innerNext, __, innerComplete) => {
        innerNext(fromIterable(seq(1, 2)));
        innerNext(fromIterable(seq(2, 4)));
        innerComplete();
      }),
    );

    next(
      new Observable((innerNext, __, innerComplete) => {
        innerNext(fromIterable(seq(4, 5)));
        innerNext(fromIterable(seq(5, 7)));
        innerComplete();
      }),
    );

    next(
      new Observable((innerNext, __, innerComplete) => {
        innerNext(fromIterable(seq(7, 8)));
        innerNext(fromIterable(seq(8, 11)));
        innerComplete();
      }),
    );

    complete();
  });

  const pipeline = flat(2);

  const next = sinon.fake();
  const error = sinon.fake();
  const complete = sinon.fake();

  pipeline(sources).subscribe(next, error, complete);

  t.equal(next.callCount, 10);
  t.equal(error.callCount, 0);
  t.equal(complete.callCount, 1);

  t.deepEqual(
    next.getCalls().flatMap(call => call.args),
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  );
});
