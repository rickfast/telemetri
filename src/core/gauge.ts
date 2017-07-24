import { Metric } from './metric';
import { MetricKind } from './metric-kind';

abstract class Gauge<T> implements Metric {
  readonly kind = MetricKind.GAUGE;
  abstract getValue(): T;
  toJson(): any {
    return { value: this.getValue() };
  }

  static forLambda<T>(getValue: () => T): Gauge<T> {
    return new (class _Gauge extends Gauge<T> {
      getValue(): T {
        return getValue();
      };
    })()
  }
}

export { Gauge };
