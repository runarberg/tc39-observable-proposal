import register from "../../../../scripts/register.js";
import { fromIterable } from "../../generators/index.js";
import reduce from "../reduce.js";

const test = register("extras/operators/reduce");

function* seq(n) {
  for (let i = 1; i <= n; i += 1) {
    yield i;
  }
}

test("reduces the stream to a promise", async t => {
  const source = fromIterable(seq(10));
  const pipeline = reduce((sum, x) => sum + x, 0);

  t.equal(await pipeline(source), 55);
});
