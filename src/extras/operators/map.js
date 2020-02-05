import Observable from "../../Observable.js";

export default function map(fn) {
  return upstream =>
    new Observable((nextHandler, errorHandler, completeHandler, signal) => {
      upstream.subscribe(
        value => {
          try {
            nextHandler(fn(value));
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
