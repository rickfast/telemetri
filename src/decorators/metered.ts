import { defaultRegistry, MetricRegistry } from '../index';

const metered = (metric: string): any => (target, name, descriptor) => {
  const fn = descriptor.value;

  const decorated = () => {
    defaultRegistry.meter(metric).mark();
    fn.apply(target, arguments);
  };

  descriptor.value = decorated;

  return descriptor;
};

export { metered };
