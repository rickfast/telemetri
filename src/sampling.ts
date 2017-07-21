import { Snapshot } from './snapshot';

interface Sampling {
  getSnapshot(): Snapshot;
}

export { Sampling };