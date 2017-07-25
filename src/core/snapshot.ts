import * as stream from 'stream';

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
    return this.getValue(0.5);
  }

  get75thPercentile(): number {
    return this.getValue(0.75);
  }

  get95thPercentile(): number {
    return this.getValue(0.95);
  }

  get98thPercentile(): number {
    return this.getValue(0.98);
  }

  get99thPercentile(): number {
    return this.getValue(0.99);
  }

  get999thPercentile(): number {
    return this.getValue(0.999);
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
