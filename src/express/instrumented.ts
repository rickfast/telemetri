import { Request, RequestHandler, Response, NextFunction } from 'express';
import * as onFinished from 'finished';

import { defaultRegistry, MetricRegistry } from '../index';

const instrumented = (name: string, registry: MetricRegistry = defaultRegistry) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const stopwatch = registry.timer(`${name}.httpIn`).time();

    req['metricRegistry'] = registry;

    onFinished(res, () => {
      stopwatch.stop();
      registry.meter(`httpIn.${res.statusCode}`).mark();
    });

    next();
  }
};

export { instrumented };