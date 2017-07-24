import { Snapshot } from "./snapshot";
import * as Long from "long";
import * as stream from "stream";

interface WeightedSample {
  value: number;
  weight: number;
}

class WeightedSnapshot extends Snapshot {
  private values: number[];
  private normWeights: number[];
  private quantiles: number[];

  constructor(values: WeightedSample[]) {
    super();
    const copy = values.slice();

    copy.sort((o1, o2) => {
      if (o1.value > o2.value) return 1;
      if (o1.value < o2.value) return -1;
      return 0;
    });

    this.values = [];
    this.normWeights = [];
    this.quantiles = [];

    let sumWeight = 0;

    copy.forEach(sample => (sumWeight += sample.weight));
    copy.forEach(sample => {
      this.values.push(sample.value);
      this.normWeights.push(sample.weight / sumWeight);
      this.quantiles.push(0)
    });

    for (let i = 1; i < copy.length; i++) {
      this.quantiles[i] = this.quantiles[i - 1] + this.normWeights[i - 1];
    }
  }

  getValue(quantile: number): number {
    if (quantile < 0.0 || quantile > 1.0 || quantile !== quantile) {
      throw new Error(`${quantile} is not in [0..1]`);
    }

    if (this.values.length == 0) {
      return 0.0;
    }

    let pos = this.quantiles.findIndex(item => item > quantile);

    pos = pos == -1 || pos == this.size() ? this.size() - 1 : pos - 1; 
    
    return this.values[~~pos];
  }

  size(): number {
    return this.values.length;
  }

  getValues(): number[] {
    return this.values.slice();
  }

  getMax(): number {
    return this.values.length == 0 ? 0 : this.values[this.values.length - 1];
  }

  getMin() {
    return this.values.length == 0 ? 0 : this.values[0];
  }

  getMean(): number {
    if (this.values.length == 0) {
      return 0;
    }

    let sum = 0;

    for (let i = 0; i < this.values.length; i++) {
      sum += this.values[i] * this.normWeights[i];
    }

    return sum;
  }

  getStdDev(): number {
    if (this.values.length <= 1) {
      return 0;
    }

    const mean = this.getMean();
    let variance = 0;

    for (let i = 0; i < this.values.length; i++) {
      const diff = this.values[i] - mean;
      variance += this.normWeights[i] * diff * diff;
    }

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

export { WeightedSample, WeightedSnapshot };