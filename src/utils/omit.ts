export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const copy = { ...obj };
  keys.forEach((key) => delete copy[key]);
  return copy;
}
