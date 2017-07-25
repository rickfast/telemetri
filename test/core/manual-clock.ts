import * as timeunit from "../../src/core/time";

import { Clock } from "../../src/core/clock";

class ManualClock extends Clock {
  ticksInNanos = 0;

  addNanos(nanos: number): void {
    this.ticksInNanos += nanos;
  }

  addSeconds(seconds: number): void {
    this.ticksInNanos += timeunit.seconds.toNanos(seconds);
  }

  addMillis(millis: number): void {
    this.ticksInNanos += timeunit.milliseconds.toNanos(millis);
  }

  addHours(hours: number): void {
    this.ticksInNanos += timeunit.hours.toNanos(hours);
  }

  getTick(): number {
    return this.ticksInNanos;
  }

  getTime(): number {
    return timeunit.nanoseconds.toMillis(this.ticksInNanos);
  }
}

export { ManualClock };
