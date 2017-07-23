import { Metric } from './metric';
import { Counting } from './counting';

class Counter implements Metric, Counting {
    private count = 0;

    inc(n: number = 1): void {
        this.count += n;
    }

    dec(n: number = 1): void {
        this.count -= n;
    }

    getCount(): number {
        return this.count;
    }
}

export { Counter };
