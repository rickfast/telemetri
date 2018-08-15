import * as Statsd from 'statsd-client';
import { MetricRegistry } from '../core';
import { Counter } from '../core/counter';
import { Gauge } from '../core/gauge';
import { Histogram } from '../core/histogram';
import { Meter } from '../core/meter';
import { Metered } from '../core/metered';
import { ALL, MetricFilter } from '../core/metric-filter';
import { Metrics } from '../core/metrics';
import { ScheduledReporter } from '../core/scheduled-reporter';
import * as timeunit from '../core/time';
import { Timer } from '../core/timer';
import { StatsdConfig } from './statsd-config';
import { sanitizeName } from './statsd-utils';

const STATSD_HOST_OPTION = 'host';
const STATSD_PORT_OPTION = 'port';
const REPORTING_METRIC_PREFIX = 'prefix';
const STATSD_DEFAULT_HOST = 'localhost';
const STATSD_DEFAULT_PORT = 8125;

export class StatsdReporter extends ScheduledReporter {
  private statsd: Statsd;

  constructor(
    registry: MetricRegistry,
    filter: MetricFilter,
    rateUnit: timeunit.TimeUnit,
    durationUnit: timeunit.TimeUnit,
    config: StatsdConfig
  ) {
    super(registry, 'statsd-reporter', ALL, rateUnit, durationUnit);
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
    Object.keys(gauges)
      .map(sanitizeName)
      .forEach(name => this.reportGauge(name, gauges[name]));

    Object.keys(counters)
      .map(sanitizeName)
      .forEach(name => this.reportCounter(name, counters[name]));

    Object.keys(histograms)
      .map(sanitizeName)
      .forEach(name => this.reportHistogram(name, histograms[name]));

    Object.keys(meters)
      .map(sanitizeName)
      .forEach(name => this.reportMetered(name, meters[name]));

    Object.keys(timers)
      .map(sanitizeName)
      .forEach(name => this.reportTimer(name, timers[name]));
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
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'm1_rate'),
      this.convertRate(meter.getOneMinuteRate())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'm5_rate'),
      this.convertRate(meter.getFiveMinuteRate())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'm15_rate'),
      this.convertRate(meter.getFifteenMinuteRate())
    );
    this.statsd.gauge(
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
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'max'),
      this.convertDuration(snapshot.getMax())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'mean'),
      this.convertDuration(snapshot.getMean())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'min'),
      this.convertDuration(snapshot.getMin())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'stddev'),
      this.convertDuration(snapshot.getStdDev())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'p50'),
      this.convertDuration(snapshot.getMedian())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'p75'),
      this.convertDuration(snapshot.get75thPercentile())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'p95'),
      this.convertDuration(snapshot.get95thPercentile())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'p98'),
      this.convertDuration(snapshot.get98thPercentile())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'p99'),
      this.convertDuration(snapshot.get99thPercentile())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'p999'),
      this.convertDuration(snapshot.get999thPercentile())
    );
  }

  private reportTimer(name: string, timer: Timer): void {
    const snapshot = timer.getSnapshot();
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'count'),
      timer.getCount()
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'max'),
      this.convertDuration(snapshot.getMax())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'mean'),
      this.convertDuration(snapshot.getMean())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'min'),
      this.convertDuration(snapshot.getMin())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'stddev'),
      this.convertDuration(snapshot.getStdDev())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'p50'),
      this.convertDuration(snapshot.getMedian())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'p75'),
      this.convertDuration(snapshot.get75thPercentile())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'p95'),
      this.convertDuration(snapshot.get95thPercentile())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'p98'),
      this.convertDuration(snapshot.get98thPercentile())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'p99'),
      this.convertDuration(snapshot.get99thPercentile())
    );
    this.statsd.gauge(
      MetricRegistry.buildName(name, 'p999'),
      this.convertDuration(snapshot.get999thPercentile())
    );

    this.reportMetered(name, timer);
  }
}
