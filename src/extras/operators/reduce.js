export default function reduce(fn, startValue) {
  return upstream => {
    let acc = startValue;

    return new Promise((resolve, reject) => {
      upstream.subscribe(
        value => {
          try {
            acc = fn(acc, value);
          } catch (error) {
            reject(error);
          }
        },
        reject,
        () => resolve(acc),
      );
    });
  };
}
