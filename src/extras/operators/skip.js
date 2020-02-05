import Observable from "../../Observable.js";

export default function skip(n) {
  return upstream => {
    let i = 0;

    return new Observable(
      (nextHandler, errorHandler, completeHandler, signal) => {
        upstream.subscribe(
          value => {
            if (i >= n) {
              nextHandler(value);
            }

            i += 1;
          },
          errorHandler,
          completeHandler,
          signal,
        );
      },
    );
  };
}
