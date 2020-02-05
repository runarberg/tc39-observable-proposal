async function main() {
  const suits = [
    import("../src/__tests__/Observable.spec.js"),
    import("../src/__tests__/async-iterator.spec.js"),

    import("../src/extras/__tests__/pipe.spec.js"),

    import("../src/extras/combinators/__tests__/merge.spec.js"),
    import("../src/extras/combinators/__tests__/race.spec.js"),

    import("../src/extras/generators/__tests__/from-async-iterable.spec.js"),
    import("../src/extras/generators/__tests__/from-interval.spec.js"),
    import("../src/extras/generators/__tests__/from-iterable.spec.js"),

    import("../src/extras/operators/__tests__/catch-error.spec.js"),
    import("../src/extras/operators/__tests__/chunks.spec.js"),
    import("../src/extras/operators/__tests__/filter.spec.js"),
    import("../src/extras/operators/__tests__/flat-map.spec.js"),
    import("../src/extras/operators/__tests__/flat.spec.js"),
    import("../src/extras/operators/__tests__/map.spec.js"),
    import("../src/extras/operators/__tests__/reduce.spec.js"),
    import("../src/extras/operators/__tests__/skip.spec.js"),
    import("../src/extras/operators/__tests__/take.spec.js"),
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
