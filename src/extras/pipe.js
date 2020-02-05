export default function pipe(initial, ...fns) {
  return fns.reduce((source, fn) => fn(source), initial);
}
