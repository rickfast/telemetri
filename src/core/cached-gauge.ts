
import { Clock, defaultClock } from './clock';
import { Gauge } from './gauge';

import { TimeUnit } from './time';

abstract class CachedGauge<T> extends Gauge<T> {
  private reloadAt = 0;
  private timeoutNs: number;
  private value: T;

  constructor(
    timeout: number,
    timeoutUnit: TimeUnit,
    private clock: Clock = defaultClock()
  ) {
    super();
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
