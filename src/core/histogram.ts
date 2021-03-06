import { Counting } from './counting';
import { Metric } from './metric';
import { MetricKind } from './metric-kind';
import { Reservoir } from './reservoir';
import { Sampling } from './sampling';
import { Snapshot } from './snapshot';

class Histogram implements Metric, Sampling, Counting {
  private count = 0;

  readonly kind = MetricKind.HISTOGRAM;

  constructor(private reservoir: Reservoir) {
    this.reservoir = reservoir;
  }

  update(value: number): void {
    this.count = this.count + 1;
    this.reservoir.update(value);
  }

  getCount(): number {
    return this.count;
  }

  getSnapshot(): Snapshot {
    return this.reservoir.getSnapshot();
  }

  toJson(): any {
    return {
      count: this.count,
      ...this.getSnapshot().toJson()
    };
  }
}

export { Histogram };
