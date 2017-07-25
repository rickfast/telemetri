import { Metric } from "./metric";
import { Gauge } from "./gauge";
import { Histogram } from "./histogram";
import { Meter } from "./meter";
import { Counter } from "./counter";
import { Timer } from "./timer";
import { ALL, MetricFilter } from "./metric-filter";
import { MetricKind } from "./metric-kind";
import { MetricSet } from "./metric-set";
import { MetricBuilder, COUNTERS, HISTOGRAMS, METERS } from "./metric-builder";

interface Metrics {
  [name: string]: Metric;
}

interface MetricMap<T extends Metric> {
  [name: string]: T;
}

type GaugeLambda = () => void;

const gaugeFromLambda = (lambda: GaugeLambda) => {
  return { getValue: lambda };
};

class MetricRegistry {
  static buildName(name: string, ...names: string[]): string {
    return [name].concat(names).join(".");
  }

  private metrics: Metrics = {};

  register<T extends Metric>(
    name: string,
    metric: T | GaugeLambda
  ): T | GaugeLambda {
    if (typeof metric == "function") {
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

  counter(name: string): Counter {
    return this.getOrAdd(name, COUNTERS);
  }

  histogram(name: string): Histogram {
    return this.getOrAdd(name, HISTOGRAMS);
  }

  meter(name: string): Meter {
    return this.getOrAdd(name, METERS);
  }

  private putIfAbsent(name: string, metric: Metric): Metric | null {
    const value = this.metrics[name];

    if (value == undefined) {
      this.metrics[name] = metric;
    } else {
      return value;
    }

    return null;
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

  getHistograms<T>(filter: MetricFilter = ALL): MetricMap<Histogram> {
    return this.getAllMetrics(MetricKind.HISTOGRAM, filter);
  }

  getCounters<T>(filter: MetricFilter = ALL): MetricMap<Counter> {
    return this.getAllMetrics(MetricKind.COUNTER, filter);
  }

  getMeters<T>(filter: MetricFilter = ALL): MetricMap<Meter> {
    return this.getAllMetrics(MetricKind.METER, filter);
  }

  getTimers<T>(filter: MetricFilter = ALL): MetricMap<Timer> {
    return this.getAllMetrics(MetricKind.TIMER, filter);
  }

  private getOrAdd<T extends Metric>(
    name: string,
    builder: MetricBuilder<T>
  ): T {
    const metric = this.metrics[name];
    if (metric && builder.isInstance(metric)) {
      return <T>metric;
    } else if (metric == null) {
      try {
        return <T>this.register(name, builder.getMetric());
      } catch (e) {
        const added = this.metrics[name];
        if (builder.isInstance(added)) {
          return <T>added;
        }
      }
    }
    throw new Error(name + " is already used for a different type of metric");
  }

  private getAllMetrics<T extends Metric>(
    kind: MetricKind,
    filter: MetricFilter
  ): MetricMap<T> {
    const result = {} as MetricMap<T>;

    Object.keys(this.metrics)
      .filter(name => this.metrics[name].kind === kind && filter(name, this.metrics[name]))
      .forEach(name => (result[name] = this.metrics[name] as T));

    return result;
  }

  registerAll(metrics: MetricSet, prefix: string = null): void {
    Object.keys(metrics).forEach(name => {
      this.register(MetricRegistry.buildName(prefix, name), metrics[name]);
    });
  }

  getMetrics(): Metrics {
    return this.metrics;
  }
}

export { MetricRegistry };
