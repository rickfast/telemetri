import { Metric } from './metric';
import { MetricKind } from './metric-kind';

abstract class Gauge<T> implements Metric {
  readonly kind = MetricKind.GAUGE;
  abstract getValue(): T;
  toJson(): any {
    return { value: this.getValue() };
  }

  static forLambda<X>(getValue: () => X): Gauge<X> {
    return new class LambdaGauge extends Gauge<X> {
      getValue(): X {
        return getValue();
      }
    }();
  }
}

export { Gauge };
