import { Metered } from "./metered";
import { Sampling } from "./sampling";
import { Clock, defaultClock } from "./clock";
import { Meter } from "./meter";
import { MetricKind } from "./metric-kind";
import { Histogram } from "./histogram";
import { Reservoir } from "./reservoir";
import { Snapshot } from "./snapshot";
import { ExponentiallyDecayingReservoir } from "./exponentially-decaying-reservoir";

import * as timeunit from "timeunit";

class TimeContext {
  private startTime: number;

  constructor(private timer: Timer, private clock: Clock) {
    this.startTime = clock.getTick();
  }

  stop(): number {
    const elapsed = this.clock.getTick() - this.startTime;
    this.timer.update(elapsed, timeunit.nanoseconds);
    return elapsed;
  }
}

class Timer implements Metered, Sampling {
  private meter: Meter;
  private histogram: Histogram;
  
  readonly kind: MetricKind;

  constructor(
    reservoir: Reservoir = new ExponentiallyDecayingReservoir(),
    private clock: Clock = defaultClock()
  ) {
    this.meter = new Meter(clock);
    this.histogram = new Histogram(reservoir);
  }

  update(duration: number, unit: timeunit = timeunit.nanoseconds): void {
    const dur = unit.toNanos(duration);

    if (dur >= 0) {
      this.histogram.update(dur);
      this.meter.mark();
    }
  }

  time(): TimeContext {
    return new TimeContext(this, this.clock);
  }

  getCount(): number {
    return this.histogram.getCount();
  }

  getFifteenMinuteRate(): number {
    return this.meter.getFifteenMinuteRate();
  }

  getFiveMinuteRate(): number {
    return this.meter.getFiveMinuteRate();
  }

  getMeanRate(): number {
    return this.meter.getMeanRate();
  }

  getOneMinuteRate(): number {
    return this.meter.getOneMinuteRate();
  }

  getSnapshot(): Snapshot {
    return this.histogram.getSnapshot();
  }

  toJson(): any {
    return {
      ...this.histogram,
      ...this.meter
    };
  }
}

export { Timer };
