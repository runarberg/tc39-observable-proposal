import Observable from "../../Observable.js";

export default function fromIterable(iterable) {
  return new Observable(
    (nextHandler, errorHandler, completeHandler, signal) => {
      for (const item of iterable) {
        if (signal.aborted) {
          return;
        }

        nextHandler(item);
      }

      completeHandler();
    },
  );
}
