import { Reporter } from "./reporter";
import { Metric } from "./metric";
import { ALL, MetricFilter } from "./metric-filter";
import { MetricRegistry } from "./metric-registry";

import { Gauge } from "./gauge";
import { Histogram } from "./histogram";
import { Meter } from "./meter";
import { Counter } from "./counter";
import { Timer } from "./timer";
import { Metrics } from "./metrics";

import * as timeunit from "./time";
import * as prettyjson from 'prettyjson';

abstract class ScheduledReporter implements Reporter {
  private registry: MetricRegistry;
  private filter: MetricFilter = ALL;
  private durationFactor: number;
  protected durationUnit: string;
  private rateFactor: number;
  protected rateUnit: string;

  private interval: any;

  protected constructor(
    registry: MetricRegistry,
    name: string,
    filter: MetricFilter,
    rateUnit: timeunit.TimeUnit,
    durationUnit: timeunit.TimeUnit
  ) {
    this.registry = registry;
    this.filter = filter;
    this.rateFactor = rateUnit.toSeconds(1);
    this.rateUnit = this.calculateRateUnit(rateUnit);
    this.durationFactor = durationUnit.toNanos(1);
    this.durationUnit = durationUnit.toString().toLowerCase();
  }

  start(periodMs: number): void {
    this.interval = setInterval(() => {
      this._report();
    }, periodMs);
  }

  stop(): void {
    clearInterval(this.interval);
  }

  _report(): void {
    this.report(
      this.registry.getGauges(this.filter),
      this.registry.getCounters(this.filter),
      this.registry.getHistograms(this.filter),
      this.registry.getMeters(this.filter),
      this.registry.getTimers(this.filter)
    );
  }

  abstract report(
    gauges: Metrics<Gauge<any>>,
    counters: Metrics<Counter>,
    histograms: Metrics<Histogram>,
    meters: Metrics<Meter>,
    timers: Metrics<Timer>
  ): void;

  protected convertDuration(duration: number): number {
    return duration / this.durationFactor;
  }

  protected convertRate(rate: number): number {
    return rate * this.rateFactor;
  }

  private calculateRateUnit(unit: timeunit.TimeUnit): string {
    const s = unit.toString().toLowerCase();
    return s.substring(0, s.length - 1);
  }
}

class ConsoleReporter extends ScheduledReporter {
  report(
    gauges: Metrics<Gauge<any>>,
    counters: Metrics<Counter>,
    histograms: Metrics<Histogram>,
    meters: Metrics<Meter>,
    timers: Metrics<Timer>
  ): void {
    this.out.log(prettyjson.render({
      gauges: this.convert(gauges),
      counters: this.convert(counters),
      histograms: this.convert(histograms),
      meters: this.convert(meters),
      timers: this.convert(timers)
    }));
  }

  constructor(registry: MetricRegistry, private out: any = console) {
    super(registry, '', ALL, timeunit.seconds, timeunit.seconds);
  }

  private convert(metrics: Metrics<Metric>): any {
    const result = {};

    Object.keys(metrics).forEach(
      name => (result[name] = metrics[name].toJson())
    );

    return result;
  }
}

export { ConsoleReporter, ScheduledReporter };
