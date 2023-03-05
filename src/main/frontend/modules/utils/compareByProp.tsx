export function compareByProp<T>(fn: (o: T) => string): (a: T, b: T) => number {
  return (a, b) => fn(a).localeCompare(fn(b));
}
