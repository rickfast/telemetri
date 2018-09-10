import { flatten } from 'flat';
import * as StatsdClient from 'statsd-client';
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
import { sanitizeName } from './statsd-utils';

class SimpleStatsdReporter extends ScheduledReporter {
  private statsd: StatsdClient;

  constructor(
    registry: MetricRegistry,
    filter: MetricFilter,
    rateUnit: timeunit.TimeUnit,
    durationUnit: timeunit.TimeUnit,
    statsd: StatsdClient
  ) {
    super(registry, 'simple-statsd-reporter', ALL, rateUnit, durationUnit);
    this.statsd = statsd;
  }

  report(
    gauges: Metrics<Gauge<any>>,
    counters: Metrics<Counter>,
    histograms: Metrics<Histogram>,
    meters: Metrics<Meter>,
    timers: Metrics<Timer>
  ): void {
    const convertedMetrics = {
      gauges: this.convert(gauges),
      counters: this.convert(counters),
      histograms: this.convert(histograms),
      meters: this.convert(meters),
      timers: this.convert(timers)
    };
    const filteredMetrics = {};
    Object.keys(convertedMetrics)
      .forEach(key => {
        const metric = convertedMetrics[key] || {};
        if (Object.keys(metric).length > 0) {
          filteredMetrics[key] = metric;
        }
      });
    const flattenedMetrics = flatten(filteredMetrics);
    Object.keys(flattenedMetrics)
      .forEach(name =>
        this.statsd.gauge(name, flattenedMetrics[name])
      );
  }

  private convert(metrics: Metrics<Metric>): any {
    const result = {};

    Object.keys(metrics)
      .forEach(
        name => (result[sanitizeName(name)] = metrics[name].toJson())
      );

    return result;
  }
}

export { SimpleStatsdReporter };
