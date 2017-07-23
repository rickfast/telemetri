import * as timeunit from 'timeunit';

import { Gauge } from './gauge';
import { defaultClock, Clock } from './clock';

abstract class CachedGauge<T> implements Gauge<T> {
    private reloadAt = 0;
    private timeoutNs: number;
    private value: T;

    constructor(timeout: number, timeoutUnit: timeunit, private clock: Clock = defaultClock()) {
        this.timeoutNs = timeoutUnit.toNanos(timeout);
    }

    protected abstract loadValue(): T;

    getValue(): T {
        if (this.shouldLoad()) {
            this.value = this.loadValue();
        }
        return this.value;
    }

    private shouldLoad(): boolean {
        for (; ; ) {
            const time = this.clock.getTick();
            const current = this.reloadAt;

            if (current > time) {
                return false;
            }
            
            this.reloadAt = time + this.timeoutNs;

            return true;
        }
    }
}

export { CachedGauge };
