import { MetricRegistry } from './core/metric-registry';

// reporters
import { ConsoleReporter } from './core/console-reporter';
import { StatsdReporter } from './statsd/statsd-reporter';
import { StatsdConfig } from './statsd/statsd-config';

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