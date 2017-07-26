import { Metric } from './metric';

type MetricFilter = (name: string, metric: Metric) => boolean;
const ALL = (name: string, metric: Metric): boolean => true;

export { ALL, MetricFilter };
