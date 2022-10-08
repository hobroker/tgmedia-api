type ThrottledFunction<T extends (...args: any) => any> = (
  ...args: Parameters<T>
) => ReturnType<T>;

export function throttle<T extends (...args: any) => any>(
  func: T,
  limit = 500,
): ThrottledFunction<T> {
  let inThrottle: boolean;
  let lastResult: ReturnType<T>;

  return function (this: any): ReturnType<T> {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    if (!inThrottle) {
      inThrottle = true;

      setTimeout(() => (inThrottle = false), limit);

      lastResult = func.apply(context, args);
    }

    return lastResult;
  };
}
