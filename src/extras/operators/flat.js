import Observable from "../../Observable.js";

export default function flat(level = 1) {
  if (level < 1) {
    return upstream => upstream;
  }

  return upstream => {
    const nextLevel = flat(level - 1);

    return nextLevel(
      new Observable((nextHandler, errorHandler, completeHandler, signal) => {
        let done = false;
        let observing = 0;
        let completed = 0;

        upstream.subscribe(
          downstream => {
            observing += 1;

            downstream.subscribe(
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
      }),
    );
  };
}
