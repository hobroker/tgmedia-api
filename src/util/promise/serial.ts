export async function serialEvery<T, U>(
  data: T[][],
  fn: (item: T) => Promise<U>,
): Promise<U[]> {
  const results: U[] = [];

  for (const items of data) {
    const subResults = await Promise.all(items.map((item) => fn(item)));

    results.push(...subResults);
  }

  return results;
}

export async function serial<T, U>(
  data: T[],
  fn: (item: T) => Promise<U>,
): Promise<U[]> {
  const results: U[] = [];

  for (const items of data) {
    const subResults = await fn(items);

    results.push(subResults);
  }

  return results;
}
