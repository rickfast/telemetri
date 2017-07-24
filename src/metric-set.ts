import { Metric } from './metric';

interface MetricSet extends Metric {
    [name: string]: Metric
}

export { MetricSet };