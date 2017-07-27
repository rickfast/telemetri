import { defaultRegistry } from '../index';

const isPromise = (obj: any) =>
  !!obj &&
  (typeof obj === 'object' || typeof obj === 'function') &&
  typeof obj.then === 'function';

const timed = (metric: string) => (target, name, descriptor) => {
  const fn = descriptor.value;

  const decorated = () => {
    const stopwatch = defaultRegistry.timer(metric).time();
    const result = fn.apply(target, arguments);

    if (isPromise(result)) {
      result.then(
        o => {
          stopwatch.stop();

          return o;
        },
        o => {
          stopwatch.stop();

          return o;
        }
      );
    } else {
      stopwatch.stop();
    }
  };

  descriptor.value = decorated;

  return descriptor;
};

export { timed };
