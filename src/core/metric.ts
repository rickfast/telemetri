import { MetricKind } from './metric-kind';

interface Metric {
  readonly kind: MetricKind;
  toJson(): any;
}

export { Metric };
