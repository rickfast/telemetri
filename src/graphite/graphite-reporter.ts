import { MetricFilter } from '../core/metric-filter';
import { MetricRegistry } from '../core/metric-registry';
import { ScheduledReporter } from '../core/scheduled-reporter';

import { Clock } from '../core/clock';
import { Counter } from '../core/counter';
import { Gauge } from '../core/gauge';
import { Histogram } from '../core/histogram';
import { Meter } from '../core/meter';
import { Metered } from '../core/metered';
import { Metrics } from '../core/metrics';
import * as timeunit from '../core/time';
import { Timer } from '../core/timer';

import { Graphite } from './graphite';
import { GraphiteConfig } from './graphite-config';
import { GraphiteMetric } from './graphite-metric';

const GRAPHITE_DEFAULT_HOST = 'localhost';
const GRAPHITE_DEFAULT_PORT = 1;

class GraphiteReporter extends ScheduledReporter {

  private graphite: Graphite;

  constructor(
    registry: MetricRegistry,
    private clock: Clock,
    filter: MetricFilter,
    rateUnit: timeunit.TimeUnit,
    durationUnit: timeunit.TimeUnit,
    config: GraphiteConfig
  ) {
    super(registry, 'graphite-reporter', filter, rateUnit, durationUnit);
    this.graphite = new Graphite(
      config.host || GRAPHITE_DEFAULT_HOST,
      config.port || GRAPHITE_DEFAULT_PORT
    );
  }

  report(
    gauges: Metrics<Gauge<any>>,
    counters: Metrics<Counter>,
    histograms: Metrics<Histogram>,
    meters: Metrics<Meter>,
    timers: Metrics<Timer>
  ): void {
    // tslint:disable-next-line:no-magic-numbers
    const timestamp = this.clock.getTime() / 1000;

    Object.keys(gauges).forEach(name => this.reportGauge(name, gauges[name], timestamp));
    Object.keys(counters).forEach(name =>
      this.reportCounter(name, counters[name], timestamp)
    );
    Object.keys(histograms).forEach(name =>
      this.reportHistogram(name, histograms[name], timestamp)
    );
    Object.keys(meters).forEach(name => this.reportMetered(name, meters[name], timestamp));
    Object.keys(timers).forEach(name => this.reportTimer(name, timers[name], timestamp));
  }

  private reportGauge(name: string, gauge: Gauge<any>, timestamp: number): void {
    this.statsd.gauge(name, gauge.getValue());
  }

  private reportCounter(name: string, counter: Counter, timestamp: number): void {
    this.statsd.increment(name, counter.getCount());
  }

  private reportMetered(name: string, meter: Metered, timestamp: number): void {
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'count'),
      meter.getCount()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'm1_rate'),
      this.convertRate(meter.getOneMinuteRate())
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'm5_rate'),
      this.convertRate(meter.getFiveMinuteRate())
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'm15_rate'),
      this.convertRate(meter.getFifteenMinuteRate())
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'mean_rate'),
      this.convertRate(meter.getMeanRate())
    );
  }

  private reportHistogram(name: string, histogram: Histogram, timestamp: number): void {
    const snapshot = histogram.getSnapshot();
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'count'),
      histogram.getCount()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'max'),
      snapshot.getMax()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'mean'),
      snapshot.getMean()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'min'),
      snapshot.getMin()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'stddev'),
      snapshot.getStdDev()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'p50'),
      snapshot.getMedian()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'p75'),
      snapshot.get75thPercentile()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'p95'),
      snapshot.get95thPercentile()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'p98'),
      snapshot.get98thPercentile()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'p99'),
      snapshot.get99thPercentile()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'p999'),
      snapshot.get999thPercentile()
    );
  }

  private reportTimer(name: string, timer: Timer, timestamp: number): void {
    const snapshot = timer.getSnapshot();
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'count'),
      timer.getCount()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'max'),
      snapshot.getMax()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'mean'),
      snapshot.getMean()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'min'),
      snapshot.getMin()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'stddev'),
      snapshot.getStdDev()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'p50'),
      snapshot.getMedian()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'p75'),
      snapshot.get75thPercentile()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'p95'),
      snapshot.get95thPercentile()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'p98'),
      snapshot.get98thPercentile()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'p99'),
      snapshot.get99thPercentile()
    );
    this.statsd.timing(
      MetricRegistry.buildName(name, 'p999'),
      snapshot.get999thPercentile()
    );

    this.reportMetered(name, timer);
  }
}

export { StatsdReporter };
