import { ALL, MetricFilter } from '../core/metric-filter';
import { MetricRegistry } from '../core/metric-registry';
import { ScheduledReporter } from '../core/scheduled-reporter';

import { Counter } from '../core/counter';
import { Gauge } from '../core/gauge';
import { Histogram } from '../core/histogram';
import { Meter } from '../core/meter';
import { Metered } from '../core/metered';
import { Metric } from '../core/metric';
import { Metrics } from '../core/metrics';
import * as timeunit from '../core/time';
import { Timer } from '../core/timer';

import { StatsdConfig } from './statsd-config';

import { flatten } from 'flat';
import * as Statsd from 'statsd-client';

const STATSD_HOST_OPTION = 'host';
const STATSD_PORT_OPTION = 'port';
const REPORTING_METRIC_PREFIX = 'prefix';
const STATSD_DEFAULT_HOST = 'localhost';
const STATSD_DEFAULT_PORT = 8125;

class SimpleStatsdReporter extends ScheduledReporter {
  private statsd: Statsd;

  constructor(
    registry: MetricRegistry,
    filter: MetricFilter,
    rateUnit: timeunit.TimeUnit,
    durationUnit: timeunit.TimeUnit,
    config: StatsdConfig
  ) {
    super(
      registry,
      'simple-statsd-reporter',
      ALL,
      rateUnit,
      durationUnit
    );
    this.statsd = new Statsd({
      host: config[STATSD_HOST_OPTION] || STATSD_DEFAULT_HOST,
      port: config[STATSD_PORT_OPTION] || STATSD_DEFAULT_PORT,
      prefix: config[REPORTING_METRIC_PREFIX] || ''
    });
  }

  report(
    gauges: Metrics<Gauge<any>>,
    counters: Metrics<Counter>,
    histograms: Metrics<Histogram>,
    meters: Metrics<Meter>,
    timers: Metrics<Timer>
  ): void {
    const metrics = flatten(
      {
        gauges: this.convert(gauges),
        counters: this.convert(counters),
        histograms: this.convert(histograms),
        meters: this.convert(meters),
        timers: this.convert(timers)
      }
    );

    Object.keys(metrics).forEach(name => {
      this.statsd.gauge(name, metrics[name]);
    });
  }

  private convert(metrics: Metrics<Metric>): any {
    const result = {};

    Object.keys(metrics).forEach(
      name => (result[name] = metrics[name].toJson())
    );

    return result;
  }

  private reportGauge(name: string, gauge: Gauge<any>): void {
    this.statsd.gauge(name, gauge.getValue());
  }

  private reportCounter(name: string, counter: Counter): void {
    this.statsd.increment(name, counter.getCount());
  }

  private reportMetered(name: string, meter: Metered): void {
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

  private reportHistogram(name: string, histogram: Histogram): void {
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

  private reportTimer(name: string, timer: Timer): void {
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

export { SimpleStatsdReporter };
