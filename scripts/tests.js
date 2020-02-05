async function main() {
  const suits = [
    import("../src/__tests__/Observable.spec.js"),
    import("../src/__tests__/async-iterator.spec.js"),
  ];

  for (const suite of suits) {
    suite.catch(error => {
      // eslint-disable-next-line no-console
      console.error(error);
      process.exitCode = 1;
    });
  }
}

main();
