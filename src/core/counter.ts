import { Metric } from "./metric";
import { MetricKind } from "./metric-kind";
import { Counting } from "./counting";

class Counter implements Metric, Counting {
  private count = 0;

  readonly kind = MetricKind.COUNTER;

  inc(n: number = 1): void {
    this.count += n;
  }

  dec(n: number = 1): void {
    this.count -= n;
  }

  getCount(): number {
    return this.count;
  }

  toJson(): any {
    return {
      count: this.count
    };
  }
}

export { Counter };
