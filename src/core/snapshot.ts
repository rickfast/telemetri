import * as stream from 'stream';

const MEDIAN = 0.5;
const _75 = 0.75;
const _95 = 0.95;
const _98 = 0.98;
const _99 = 0.99;
const _999 = 0.999;

abstract class Snapshot {
  abstract getValue(quantile: number): number;
  abstract getValues(): number[];
  abstract size(): number;
  abstract getMax(): number;
  abstract getMean(): number;
  abstract getMin(): number;
  abstract getStdDev(): number;
  abstract dump(output: stream.Writable);

  getMedian(): number {
    return this.getValue(MEDIAN);
  }

  get75thPercentile(): number {
    return this.getValue(_75);
  }

  get95thPercentile(): number {
    return this.getValue(_95);
  }

  get98thPercentile(): number {
    return this.getValue(_98);
  }

  get99thPercentile(): number {
    return this.getValue(_99);
  }

  get999thPercentile(): number {
    return this.getValue(_999);
  }

  toJson(): any {
    return {
      min: this.getMin(),
      max: this.getMax(),
      mean: this.getMean(),
      stddev: this.getStdDev(),
      median: this.getMedian(),
      p75: this.get75thPercentile(),
      p95: this.get95thPercentile(),
      p98: this.get98thPercentile(),
      p99: this.get99thPercentile(),
      p999: this.get999thPercentile()
    };
  }
}

export { Snapshot };
