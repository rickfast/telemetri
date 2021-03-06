import { Clock, defaultClock } from './clock';
import { ExponentiallyDecayingReservoir } from './exponentially-decaying-reservoir';
import { Histogram } from './histogram';
import { Meter } from './meter';
import { Metered } from './metered';
import { MetricKind } from './metric-kind';
import { Reservoir } from './reservoir';
import { Sampling } from './sampling';
import { Snapshot } from './snapshot';
import * as timeunit from './time';

export class TimeContext {
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

export class Timer implements Metered, Sampling {
  private meter: Meter;
  private histogram: Histogram;

  readonly kind = MetricKind.TIMER;

  constructor(
    reservoir: Reservoir = new ExponentiallyDecayingReservoir(),
    private clock: Clock = defaultClock()
  ) {
    this.meter = new Meter(clock);
    this.histogram = new Histogram(reservoir);
  }

  update(
    duration: number,
    unit: timeunit.TimeUnit = timeunit.nanoseconds
  ): void {
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
      ...this.histogram.toJson(),
      ...this.meter.toJson()
    };
  }
}
