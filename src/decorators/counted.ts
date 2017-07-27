import { defaultRegistry } from '../index';

const counted = (metric: string) => (target, name, descriptor) => {
  const fn = descriptor.value;

  const decorated = () => {
    defaultRegistry.counter(metric).inc();
    fn.apply(target, arguments);
  };

  descriptor.value = decorated;

  return descriptor;
};

export { counted };
