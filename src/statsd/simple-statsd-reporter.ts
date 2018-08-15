import { flatten } from 'flat';
import * as Statsd from 'statsd-client';
import { MetricRegistry } from '../core';
import { Counter } from '../core/counter';
import { Gauge } from '../core/gauge';
import { Histogram } from '../core/histogram';
import { Meter } from '../core/meter';
import { Metric } from '../core/metric';
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

export class SimpleStatsdReporter extends ScheduledReporter {
  private statsd: Statsd;

  constructor(
    registry: MetricRegistry,
    filter: MetricFilter,
    rateUnit: timeunit.TimeUnit,
    durationUnit: timeunit.TimeUnit,
    config: StatsdConfig
  ) {
    super(registry, 'simple-statsd-reporter', ALL, rateUnit, durationUnit);
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
    const metrics = flatten({
      gauges: this.convert(gauges),
      counters: this.convert(counters),
      histograms: this.convert(histograms),
      meters: this.convert(meters),
      timers: this.convert(timers)
    });

    Object.keys(metrics)
      .forEach(name => this.statsd.gauge(name, metrics[name]));
  }

  private convert(metrics: Metrics<Metric>): any {
    const result = {};

    Object.keys(metrics)
      .map(sanitizeName)
      .forEach(name => (result[name] = metrics[name].toJson()));

    return result;
  }
}
