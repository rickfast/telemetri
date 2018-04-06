import { Reservoir } from './reservoir';
import { Snapshot } from './snapshot';
import { UniformSnapshot } from './uniform-snapshot';

class SlidingWindowReservoir implements Reservoir {
    measurements: number[] = [];
    count = 0;

    public size(): number {
        return Math.min(this.count, this.measurements.length);
    }

    public update(value: number) {
        this.measurements[(this.count++ % this.measurements.length)] = value;
    }

    public getSnapshot(): Snapshot {
        const values: number[] = [];
        for (let i = 0; i < this.size(); i++) {
            values[i] = this.measurements[i];
        }

        return new UniformSnapshot(values);
    }
}
