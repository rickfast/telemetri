import * as timeunit from "timeunit";

import { defaultClock, Clock } from "./clock";
import { Ewma } from "./ewma";
import { Metered } from "./metered";
import { MetricKind } from './metric-kind';

const TICK_INTERVAL = timeunit.seconds.toNanos(5);

class Meter implements Metered {
  private m1Rate = Ewma.oneMinuteEwma();
  private m5Rate = Ewma.fiveMinuteEwma();
  private m15Rate = Ewma.fifteenMinuteEwma();

  private count = 0;
  private startTime: number;
  private lastTick: number;

  readonly kind = MetricKind.METER;

  constructor(private clock: Clock = defaultClock()) {
    this.clock = clock;
    this.startTime = this.clock.getTick();
    this.lastTick = this.startTime;
  }

  mark(n: number = 1): void {
    this.tickIfNecessary();
    this.count += n;
    this.m1Rate.update(n);
    this.m5Rate.update(n);
    this.m15Rate.update(n);
  }

  tickIfNecessary(): void {
    const oldTick = this.lastTick;
    const newTick = this.clock.getTick();
    const age = newTick - oldTick;

    if (age > TICK_INTERVAL) {
      const newIntervalStartTick = newTick - age % TICK_INTERVAL;
      this.lastTick = newIntervalStartTick;
      const requiredTicks = age / TICK_INTERVAL;
      for (let i = 0; i < requiredTicks; i++) {
        this.m1Rate.tick();
        this.m5Rate.tick();
        this.m15Rate.tick();
      }
    }
  }

  getCount(): number {
    return this.count;
  }

  getFifteenMinuteRate(): number {
    this.tickIfNecessary();
    return this.m15Rate.getRate(timeunit.seconds);
  }

  getFiveMinuteRate(): number {
    this.tickIfNecessary();
    return this.m5Rate.getRate(timeunit.seconds);
  }

  getMeanRate(): number {
    if (this.count == 0) {
      return 0.0;
    } else {
      const elapsed = this.clock.getTick() - this.startTime;
      return this.count / elapsed * timeunit.seconds.toNanos(1);
    }
  }

  getOneMinuteRate(): number {
    this.tickIfNecessary();
    return this.m1Rate.getRate(timeunit.seconds);
  }

  toJson(): any {
    return {
      m1_rate: this.getOneMinuteRate(),
      m5_rate: this.getFiveMinuteRate(),
      m15_rate: this.getFifteenMinuteRate(),
      mean_rate: this.getMeanRate()
    };
  }
}

export { Meter };
