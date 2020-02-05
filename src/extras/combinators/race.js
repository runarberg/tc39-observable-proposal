import AbortController from "abort-controller";

import Observable from "../../Observable.js";

export default function race(sources) {
  return new Observable(
    (nextHandler, errorHandler, completeHandler, signal) => {
      let winner;
      const controllers = [];

      sources.forEach(source => {
        const controller = new AbortController();

        signal.addEventListener("abort", () => controller.abort());

        if (winner) {
          controller.abort();
        }

        controllers.push(controller);
        source.subscribe(
          next => {
            if (!winner) {
              winner = source;

              controllers.forEach(other => {
                if (other !== controller) {
                  other.abort();
                }
              });
            }

            nextHandler(next);
          },
          errorHandler,
          completeHandler,
          controller.signal,
        );
      });
    },
  );
}
