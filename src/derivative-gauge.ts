import { Gauge } from './gauge';

abstract class DerivativeGauge<F, T> implements Gauge<T> {
    protected constructor(private base: Gauge<F> ) {
        
    }

    getValue(): T {
        return this.transform(this.base.getValue());
    }

    protected abstract transform(value: F): T;
}
