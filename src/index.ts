import { MetricRegistry } from './core/metric-registry';

// reporters
import { ConsoleReporter } from './core/console-reporter';
import { StatsdReporter } from './statsd/statsd-reporter';

const defaultRegistry = new MetricRegistry();

export {
  defaultRegistry,
  ConsoleReporter,
  MetricRegistry,
  StatsdReporter
};