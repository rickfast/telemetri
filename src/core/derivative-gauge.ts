import { Gauge } from './gauge';

abstract class DerivativeGauge<F, T> extends Gauge<T> {
  constructor(private base: Gauge<F>) {
    super();
  }

  getValue(): T {
    return this.transform(this.base.getValue());
  }

  protected abstract transform(value: F): T;
}

export { DerivativeGauge };
