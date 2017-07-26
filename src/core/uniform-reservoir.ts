import { Reservoir } from './reservoir';
import { Snapshot } from './snapshot';
import { UniformSnapshot } from './uniform-snapshot';

import * as range from 'js-range';

const DEFAULT_SIZE = 1028;

class UniformReservoir implements Reservoir {
  private count = 0;
  private values: number[];

  constructor(size: number = DEFAULT_SIZE) {
    this.values = [];
    range(0, size).forEach(i => this.values.push(0));
  }

  size(): number {
    if (this.count > this.values.length) {
      return this.values.length;
    }

    return this.count;
  }

  update(value: number): void {
    this.count = this.count + 1;
    if (this.count <= this.values.length) {
      this.values[this.count - 1] = value;
    } else {
      const r = UniformReservoir.getRandomInt(this.count);
      if (r < this.values.length) {
        this.values[r] = value;
      }
    }
  }

  private static getRandomInt(num): number {
    return Math.floor(Math.random() * num);
  }

  getSnapshot(): Snapshot {
    return new UniformSnapshot(this.values.slice());
  }
}

export { UniformReservoir };
