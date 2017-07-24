import * as Long from "long";

import { Metric } from "./metric";
import { MetricKind } from "./metric-kind";
import { Sampling } from "./sampling";
import { Counting } from "./counting";
import { Reservoir } from "./reservoir";
import { Snapshot } from "./snapshot";

class Histogram implements Metric, Sampling, Counting {
  private count: Long;

  readonly kind = MetricKind.HISTOGRAM;

  constructor(private reservoir: Reservoir) {
    this.reservoir = reservoir;
    this.count = Long.fromInt(0);
  }

  update(value: number): void {
    this.count = this.count.add(1);
    this.reservoir.update(value);
  }

  getCount(): number {
    return this.count.toInt();
  }

  getSnapshot(): Snapshot {
    return this.reservoir.getSnapshot();
  }
}

export { Histogram };
