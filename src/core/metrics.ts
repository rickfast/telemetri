import { Metric } from './metric';

interface Metrics<T extends Metric> {
  [name: string]: T;
}

export { Metrics };
