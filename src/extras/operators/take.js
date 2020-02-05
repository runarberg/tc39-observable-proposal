import AbortController from "abort-controller";

import Observable from "../../Observable.js";

export default function take(n) {
  return upstream => {
    let i = 0;

    return new Observable(
      (nextHandler, errorHandler, completeHandler, signal) => {
        const controller = new AbortController();

        signal.addEventListener("abort", () => controller.abort());
        upstream.subscribe(
          value => {
            if (i >= n) {
              completeHandler();

              // Clean up upstream.
              controller.abort();
            }

            i += 1;
            nextHandler(value);
          },
          errorHandler,
          completeHandler,
          controller.signal,
        );
      },
    );
  };
}
