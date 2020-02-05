import Observable from "../../Observable.js";

export default function merge(sources) {
  return new Observable(
    (nextHandler, errorHandler, completeHandler, signal) => {
      const { length } = sources;
      let completed = 0;

      sources.forEach(source => {
        source.subscribe(
          nextHandler,
          errorHandler,
          () => {
            completed += 1;

            if (completed === length) {
              completeHandler();
            }
          },
          signal,
        );
      });
    },
  );
}
