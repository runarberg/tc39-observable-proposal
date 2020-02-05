import Observable from "../../Observable.js";

export default function fromInterval(ms) {
  return new Observable(
    (nextHandler, errorHandler, completeHandler, signal) => {
      const id = globalThis.setInterval(nextHandler, ms);

      signal.addEventListener("abort", () => {
        clearInterval(id);
      });
    },
  );
}
