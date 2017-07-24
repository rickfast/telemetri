import { Snapshot } from './snapshot';

interface Reservoir {
    size(): number;
    update(value: number): void;
    getSnapshot(): Snapshot;
}

export { Reservoir };
