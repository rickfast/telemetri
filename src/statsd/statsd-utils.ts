import * as StatsdClient from 'statsd-client';
import { StatsdConfig } from "./statsd-config";

export const sanitizeName = (name: string): string => name.replace(/^\./, '');

const STATSD_HOST_OPTION = 'host';
const STATSD_PORT_OPTION = 'port';
const REPORTING_METRIC_PREFIX = 'prefix';
const STATSD_DEFAULT_HOST = 'localhost';
const STATSD_DEFAULT_PORT = 8125;

export const defaultStatsd = (config: StatsdConfig): StatsdClient => new StatsdClient({
    host: config[STATSD_HOST_OPTION] || STATSD_DEFAULT_HOST,
    port: config[STATSD_PORT_OPTION] || STATSD_DEFAULT_PORT,
    prefix: config[REPORTING_METRIC_PREFIX] || ''
  });
