import { Metric } from './metric';

interface Gauge<T> extends Metric {
  getValue(): T;
}

export { Gauge };
