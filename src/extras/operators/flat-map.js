import Observable from "../../Observable.js";

export default function flatMap(fn) {
  return upstream =>
    new Observable((nextHandler, errorHandler, completeHandler, signal) => {
      let done = false;
      let observing = 0;
      let completed = 0;

      upstream.subscribe(
        value => {
          observing += 1;

          let inner;

          try {
            inner = fn(value);
          } catch (error) {
            errorHandler(error);
          }

          inner.subscribe(
            nextHandler,
            errorHandler,
            () => {
              completed += 1;

              if (done && observing === completed) {
                completeHandler();
              }
            },
            signal,
          );
        },

        errorHandler,

        () => {
          done = true;

          if (observing === completed) {
            completeHandler();
          }
        },

        signal,
      );
    });
}
