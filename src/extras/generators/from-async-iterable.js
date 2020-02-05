import Observable from "../../Observable.js";

export default function fromIterable(iterable) {
  return new Observable(
    async (nextHandler, errorHandler, completeHandler, signal) => {
      for await (const item of iterable) {
        if (signal.aborted) {
          return;
        }

        nextHandler(item);
      }

      completeHandler();
    },
  );
}
