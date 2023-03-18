export function sortBy<T>(extractor: (f: T) => string) {
  return (a: T, b: T) => extractor(a).localeCompare(extractor(b));
}
