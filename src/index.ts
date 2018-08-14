import { MetricRegistry } from './core';

const defaultRegistry = new MetricRegistry();

export * from './core';
export * from './express';
export * from './statsd';
export * from './node';
export { defaultRegistry };
