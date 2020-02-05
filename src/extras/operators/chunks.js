import Observable from "../../Observable.js";

export default function chunks() {
  return upstream =>
    new Observable((nextHandler, errorHandler, completeHandler, signal) => {
      let chunk = [];

      upstream.subscribe(
        value => {
          if (chunk.length === 0) {
            globalThis.setTimeout(() => {
              nextHandler(chunk);

              chunk = [];
            }, 0);
          }

          chunk.push(value);
        },

        errorHandler,

        () => {
          if (chunk.length > 0) {
            nextHandler(chunk);
            completeHandler();
          }
        },

        signal,
      );
    });
}
