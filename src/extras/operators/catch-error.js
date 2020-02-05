import Observable from "../../Observable.js";

export default function catchError(fn) {
  return upstream =>
    new Observable((nextHandler, errorHandler, completeHandler, signal) => {
      upstream.subscribe(
        nextHandler,
        error => {
          try {
            nextHandler(fn(error));
          } catch (innerError) {
            errorHandler(innerError);
          }

          const inner = new Observable((...innerHandlers) => {
            upstream.subscribe(...innerHandlers);
          });

          const recatch = catchError(fn);

          recatch(inner).subscribe(
            nextHandler,
            errorHandler,
            completeHandler,
            signal,
          );
        },
        completeHandler,
        signal,
      );
    });
}
