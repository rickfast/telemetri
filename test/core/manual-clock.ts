import * as timeunit from "timeunit";

import { Clock } from "../../src/core/clock";

class ManualClock extends Clock {
  ticksInNanos = 0;

  addNanos(nanos) {
    this.ticksInNanos += nanos;
  }

  addSeconds(seconds) {
    this.ticksInNanos += timeunit.seconds.toNanos(seconds);
  }

  addMillis(millis) {
    this.ticksInNanos += timeunit.milliseconds.toNanos(millis);
  }

  addHours(hours) {
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
