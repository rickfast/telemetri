import { ScheduledReporter } from '../core/scheduled-reporter';
import { Metric } from "../core/metric";
import { ALL, MetricFilter } from "../core/metric-filter";
import { MetricRegistry } from "../core/metric-registry";

import { Gauge } from "../core/gauge";
import { Histogram } from "../core/histogram";
import { Meter } from "../core/meter";
import { Counter } from "../core/counter";
import { Timer } from "../core/timer";
import { Metrics } from "../core/metrics";

class StatsdReporter extends ScheduledReporter {
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

    console.log(result);

    return result;
  }
}