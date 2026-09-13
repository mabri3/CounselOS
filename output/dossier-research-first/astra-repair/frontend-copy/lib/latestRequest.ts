export function createLatestRequestLoader<T>(
  read: () => Promise<T>,
  apply: (value: T) => void,
  fail: (error: unknown) => void,
) {
  let generation = 0;
  return async function loadLatest(): Promise<T | undefined> {
    const requestGeneration = ++generation;
    try {
      const value = await read();
      if (requestGeneration === generation) apply(value);
      return value;
    } catch (error) {
      if (requestGeneration !== generation) return undefined;
      fail(error);
      throw error;
    }
  };
}
