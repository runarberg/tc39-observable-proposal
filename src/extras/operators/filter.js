import Observable from "../../Observable.js";

export default function filter(fn) {
  return upstream =>
    new Observable((nextHandler, errorHandler, completeHandler, signal) => {
      upstream.subscribe(
        value => {
          try {
            if (fn(value)) {
              nextHandler(value);
            }
          } catch (error) {
            errorHandler(error);
          }
        },
        errorHandler,
        completeHandler,
        signal,
      );
    });
}
