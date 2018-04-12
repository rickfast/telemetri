import { MetricRegistry } from './core/metric-registry';

// reporters
import { ConsoleReporter } from './core/console-reporter';
import { StatsdReporter } from './statsd/statsd-reporter';
export { SimpleStatsdReporter } from './statsd/simple-statsd-reporter';
export { StatsdConfig } from './statsd/statsd-config';

// node
import { gauges } from './node/gauges';

// express
import { instrumented } from './express/instrumented';

const defaultRegistry = new MetricRegistry();

export {
  defaultRegistry,
  ConsoleReporter,
  gauges,
  instrumented,
  MetricRegistry,
  StatsdReporter
};

export * from './core/time';
