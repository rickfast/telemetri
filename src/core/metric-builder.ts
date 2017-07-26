import { Counter } from './counter';
import { ExponentiallyDecayingReservoir } from './exponentially-decaying-reservoir';
import { Histogram } from './histogram';
import { Meter } from './meter';
import { Metric } from './metric';
import { MetricKind } from './metric-kind';
import { Timer } from './timer';

class MetricBuilder<T extends Metric> {
  constructor(private kind: MetricKind, private supplier: () => T) {}

  isInstance(metric: Metric): boolean {
    return this.kind === metric.kind;
  }

  getMetric(): T {
    return this.supplier();
  }
}

const COUNTERS = new MetricBuilder<Counter>(
  MetricKind.COUNTER,
  () => new Counter()
);
const HISTOGRAMS = new MetricBuilder<Histogram>(
  MetricKind.HISTOGRAM,
  () => new Histogram(new ExponentiallyDecayingReservoir())
);
const METERS = new MetricBuilder<Meter>(MetricKind.METER, () => new Meter());
const TIMERS = new MetricBuilder<Timer>(MetricKind.TIMER, () => new Timer());

export { MetricBuilder, COUNTERS, HISTOGRAMS, METERS, TIMERS };
