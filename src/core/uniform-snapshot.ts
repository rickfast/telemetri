import * as stream from 'stream';
import { Snapshot } from './snapshot';

class UniformSnapshot extends Snapshot {
  private values: number[];

  constructor(values: number[]) {
    super();
    this.values = values.slice();
    this.values.sort();
  }

  getValue(quantile: number): number {
    if (quantile < 0 || quantile > 1 || quantile !== quantile) {
      throw new Error(`${quantile} is not in [0..1]`);
    }

    if (this.values.length === 0) {
      return 0;
    }

    const pos = quantile * (this.values.length + 1);
    const index = ~~pos;

    if (index < 1) {
      return this.values[0];
    }

    if (index >= this.values.length) {
      return this.values[this.values.length - 1];
    }

    const lower = this.values[index - 1];
    const upper = this.values[index];

    return lower + (pos - Math.floor(pos)) * (upper - lower);
  }

  size(): number {
    return this.values.length;
  }

  getValues(): number[] {
    return this.values.slice();
  }

  getMax(): number {
    return this.values.length === 0 ? 0 : this.values[this.values.length - 1];
  }

  getMin() {
    return this.values.length === 0 ? 0 : this.values[0];
  }

  getMean(): number {
    if (this.values.length === 0) {
      return 0;
    }

    const sum = this.values.reduce((total, value) => total + value);

    return sum / this.values.length;
  }

  getStdDev(): number {
    if (this.values.length <= 1) {
      return 0;
    }

    const mean = this.getMean();
    let sum = 0;

    this.getValues().forEach(value => {
      const diff = value - mean;
      sum += diff * diff;
    });

    const variance = sum / (this.size() - 1);

    return Math.sqrt(variance);
  }

  dump(out: stream.Writable): void {
    try {
      this.values.forEach(value => {
        out.write(value);
      });
    } finally {
      out.end();
    }
  }
}

export { UniformSnapshot };
