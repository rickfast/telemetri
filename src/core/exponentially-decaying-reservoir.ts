import * as timeunit from "./time";

import { Clock, defaultClock } from "./clock";
import { nextNumber } from "./random";
import { WeightedSample, WeightedSnapshot } from "./weighted-snapshot";
import { Reservoir } from "./reservoir";
import { Snapshot } from "./snapshot";

const DEFAULT_SIZE = 1028;
const DEFAULT_ALPHA = 0.015;
const RESCALE_THRESHOLD = timeunit.hours.toNanos(1);

interface SampleMap {
  [key: number]: WeightedSample;
}

class ExponentiallyDecayingReservoir implements Reservoir {
  private values: SampleMap;
  private count = 0;
  private startTime: number;
  private nextScaleTime: number;

  constructor(
    private _size: number = DEFAULT_SIZE,
    private alpha: number = DEFAULT_ALPHA,
    private clock: Clock = defaultClock()
  ) {
    this.values = {};
    this.startTime = this.currentTimeInSeconds();
    this.nextScaleTime = clock.getTick() + RESCALE_THRESHOLD;
  }

  size(): number {
    return Math.min(this._size, this.count);
  }

  update(value: number, timestamp: number = this.currentTimeInSeconds()): void {
    this.rescaleIfNeeded();
    const weight = this.weight(timestamp - this.startTime);
    const sample = { value, weight };
    const priority = weight / nextNumber();

    const newCount = ++this.count;
    if (newCount <= this._size) {
      this.values[priority] = sample;
    } else {
      const first = Object.keys(this.values)[0];
      if (
        parseFloat(first) < priority &&
        this.putIfAbsent(priority, sample) == null
      ) {
        // ensure we always remove an item
        delete this.values[Object.keys(this.values)[0]];
      }
    }
  }

  private putIfAbsent(
    priority: number,
    sample: WeightedSample
  ): WeightedSample | null {
    const value = this.values[priority];

    if (!value) {
      this.values[priority] = sample;
    } else {
      return value;
    }

    return null;
  }

  private rescaleIfNeeded(): void {
    const now = this.clock.getTick();
    const next = this.nextScaleTime;
    if (now >= next) {
      this.rescale(now, next);
    }
  }

  getSnapshot(): Snapshot {
    this.rescaleIfNeeded();
    return new WeightedSnapshot(Object.values(this.values));
  }

  private currentTimeInSeconds(): number {
    return timeunit.milliseconds.toSeconds(this.clock.getTime());
  }

  private weight(t: number): number {
    return Math.exp(this.alpha * t);
  }

  private rescale(now: number, next: number): void {
    this.nextScaleTime = now + RESCALE_THRESHOLD;
    const oldStartTime = this.startTime;
    this.startTime = this.currentTimeInSeconds();
    const scalingFactor = Math.exp(
      -this.alpha * (this.startTime - oldStartTime)
    );
    if (scalingFactor === 0) {
      this.values = {};
    } else {
      const keys: number[] = Object.keys(this.values).map(key =>
        parseFloat(key)
      );
      keys.forEach(key => {
        const sample = this.values[key];
        delete this.values[key];
        const newSample = {
          value: sample.value,
          weight: sample.weight * scalingFactor
        };
        this.values[key * scalingFactor] = newSample;
      });
    }

    // make sure the counter is in sync with the number of stored samples.
    this.count = Object.keys(this.values).length;
  }
}

export { ExponentiallyDecayingReservoir };
