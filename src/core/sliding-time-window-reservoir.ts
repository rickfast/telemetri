import { Clock, defaultClock } from './clock';
import { Reservoir } from './reservoir';
import { Snapshot } from './snapshot';
import * as timeunit from './time';
import { UniformSnapshot } from './uniform-snapshot';

const COLLISION_BUFFER = 256;
const TRIM_THRESHOLD = 256;
const CLEAR_BUFFER = timeunit.hours.toNanos(1) * COLLISION_BUFFER;

interface MeasurementMap {
    [key: number]: number;
}

class SlidingTimeWindowReservoir implements Reservoir {
    private measurements: MeasurementMap = {};
    private lastTick: number;
    private count = 0;

    public constructor(
        private window: number,
        windowUnit: timeunit.TimeUnit,
        private clock: Clock = defaultClock()
    ) {
        this.window = windowUnit.toNanos(window) * COLLISION_BUFFER;
        this.lastTick = clock.getTick() * COLLISION_BUFFER;
    }

    public size(): number {
        this.trim();

        return Object.keys(this.measurements).length;
    }

    public update(value: number): void {
        this.count ++;
        if (this.count % TRIM_THRESHOLD === 0) {
            this.trim();
        }
        this.measurements[this.getTick()] = value;
    }

    public getSnapshot(): Snapshot {
        this.trim();

        return new UniformSnapshot(Object.keys(this.measurements).map(key => this.measurements[key]));
    }

    private getTick(): number {
        for (; ; ) {
            const oldTick = this.lastTick;
            const tick = this.clock.getTick() * COLLISION_BUFFER;
            this.lastTick = tick - oldTick > 0 ? tick : oldTick + 1;

            return this.lastTick;
        }
    }

    private trim(): void {
        const now = this.getTick();
        const windowStart = now - this.window;
        const windowEnd = now + CLEAR_BUFFER;
        if (windowStart < windowEnd) {
            measurements.headMap(windowStart).clear();
            measurements.tailMap(windowEnd).clear();
        } else {
            measurements.subMap(windowEnd, windowStart).clear();
        }
    }
}
