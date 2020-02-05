import { strict as assert } from "assert";

async function runSuite(name, tests) {
  const runs = tests.map(([msg, test]) => {
    let result;

    try {
      result = test(assert);
    } catch (error) {
      return Promise.resolve([
        msg,
        {
          success: false,
          error,
        },
      ]);
    }

    if (!(result instanceof Promise)) {
      return Promise.resolve([msg, { success: true }]);
    }

    return result.then(
      () => [msg, { success: true }],
      error => [msg, { success: false, error }],
    );
  });

  const results = await Promise.all(runs);

  /* eslint-disable no-console */
  console.log(`\n# ${name}`);

  for (const [msg, { success, error }] of results) {
    console.log(`  ${success ? "✔" : "✘"} ${msg}`);

    if (error) {
      process.exitCode = 1;
      process.on("beforeExit", () => {
        console.log({ ...error });
        console.log(`\n${name} → ${msg}:`);
        console.log(error.message);
      });
    }
  }
  /* eslint-enable no-console */
}

export default function register(name) {
  const tests = [];

  globalThis.setTimeout(() => runSuite(name, tests));

  return (msg, fn) => {
    tests.push([msg, fn]);
  };
}
