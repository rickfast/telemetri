import { Counter } from './counter';
import { Gauge } from './gauge';
import { Histogram } from './histogram';
import { Meter } from './meter';
import { Metric } from './metric';
import {
  COUNTERS,
  HISTOGRAMS,
  METERS,
  MetricBuilder,
  TIMERS
} from './metric-builder';
import { ALL, MetricFilter } from './metric-filter';
import { MetricKind } from './metric-kind';
import { MetricSet } from './metric-set';
import { Timer } from './timer';

export interface Metrics {
  [name: string]: Metric;
}

export interface MetricMap<T extends Metric> {
  [name: string]: T;
}

export type GaugeLambda = () => void;

export class MetricRegistry {
  static buildName(name: string, ...names: string[]): string {
    return [name].concat(names).join('.');
  }

  private metrics: Metrics = {};

  register<T extends Metric>(
    name: string,
    metric: T | GaugeLambda
  ): T | GaugeLambda {
    if (typeof metric === 'function') {
      const gauge = Gauge.forLambda(metric);
      this.register(name, gauge);
    } else {
      const existing = this.putIfAbsent(name, metric as Metric);
      if (existing) {
        throw new Error(`A metric named ${name} already exists`);
      }
    }

    return metric;
  }

  gauge(name: string, gauge: Gauge<any> | GaugeLambda): Gauge<any> {
    if (typeof gauge === 'function') {
      const wrapped = Gauge.forLambda<any>(gauge);

      return this.getOrAdd(
        name,
        new MetricBuilder(MetricKind.GAUGE, () => wrapped)
      );
    } else {
      return this.getOrAdd(
        name,
        new MetricBuilder(MetricKind.GAUGE, () => gauge)
      );
    }
  }

  counter(name: string): Counter {
    return this.getOrAdd(name, COUNTERS);
  }

  histogram(name: string): Histogram {
    return this.getOrAdd(name, HISTOGRAMS);
  }

  meter(name: string): Meter {
    return this.getOrAdd(name, METERS);
  }

  timer(name: string): Timer {
    return this.getOrAdd(name, TIMERS);
  }

  private putIfAbsent(name: string, metric: Metric): Metric | undefined {
    const value = this.metrics[name];

    if (value === undefined) {
      this.metrics[name] = metric;
    } else {
      return value;
    }

    return undefined;
  }

  remove(name: string): boolean {
    const metric = this.metrics[name];

    if (metric) {
      delete this.metrics[name];

      return true;
    } else {
      return false;
    }
  }

  get names(): string[] {
    return Object.keys(this.metrics).sort();
  }

  getGauges<T>(filter: MetricFilter = ALL): MetricMap<Gauge<T>> {
    return this.getAllMetrics(MetricKind.GAUGE, filter);
  }

  getHistograms(filter: MetricFilter = ALL): MetricMap<Histogram> {
    return this.getAllMetrics(MetricKind.HISTOGRAM, filter);
  }

  getCounters(filter: MetricFilter = ALL): MetricMap<Counter> {
    return this.getAllMetrics(MetricKind.COUNTER, filter);
  }

  getMeters(filter: MetricFilter = ALL): MetricMap<Meter> {
    return this.getAllMetrics(MetricKind.METER, filter);
  }

  getTimers(filter: MetricFilter = ALL): MetricMap<Timer> {
    return this.getAllMetrics(MetricKind.TIMER, filter);
  }

  private getOrAdd<T extends Metric>(
    name: string,
    builder: MetricBuilder<T>
  ): T {
    const metric = this.metrics[name];
    if (metric && builder.isInstance(metric)) {
      return metric as T;
    } else if (metric === undefined) {
      try {
        return this.register(name, builder.getMetric()) as T;
      } catch (e) {
        const added = this.metrics[name];
        if (builder.isInstance(added)) {
          return added as T;
        }
      }
    }
    throw new Error(`${name} is already used for a different type of metric`);
  }

  private getAllMetrics<T extends Metric>(
    kind: MetricKind,
    filter: MetricFilter
  ): MetricMap<T> {
    // tslint:disable-next-line:no-object-literal-type-assertion
    const result = {} as MetricMap<T>;

    Object.keys(this.metrics)
      .filter(
        name =>
          this.metrics[name].kind === kind && filter(name, this.metrics[name])
      )
      .forEach(name => (result[name] = this.metrics[name] as T));

    return result;
  }

  registerAll(metrics: MetricSet, prefix?: string): void {
    Object.keys(metrics).forEach(name => {
      this.register(MetricRegistry.buildName(prefix, name), metrics[name]);
    });
  }

  getMetrics(): Metrics {
    return this.metrics;
  }
}
