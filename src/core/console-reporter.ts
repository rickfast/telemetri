import * as prettyjson from 'prettyjson';
import { Counter } from './counter';
import { Gauge } from './gauge';
import { Histogram } from './histogram';
import { Meter } from './meter';
import { Metric } from './metric';
import { ALL } from './metric-filter';
import { MetricRegistry } from './metric-registry';
import { Metrics } from './metrics';
import { ScheduledReporter } from './scheduled-reporter';
import * as timeunit from './time';
import { Timer } from './timer';

export class ConsoleReporter extends ScheduledReporter {
  constructor(registry: MetricRegistry, private out: any = console) {
    super(registry, '', ALL, timeunit.seconds, timeunit.seconds);
  }

  report(
    gauges: Metrics<Gauge<any>>,
    counters: Metrics<Counter>,
    histograms: Metrics<Histogram>,
    meters: Metrics<Meter>,
    timers: Metrics<Timer>
  ): void {
    this.out.log(
      prettyjson.render({
        gauges: this.convert(gauges),
        counters: this.convert(counters),
        histograms: this.convert(histograms),
        meters: this.convert(meters),
        timers: this.convert(timers)
      })
    );
  }

  private convert(metrics: Metrics<Metric>): any {
    const result = {};

    Object.keys(metrics).forEach(
      name => (result[name] = metrics[name].toJson())
    );

    return result;
  }
}
