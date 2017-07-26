import { Counting } from './counting';
import { Metric } from './metric';

interface Metered extends Metric, Counting {
  getCount(): number;
  getFifteenMinuteRate(): number;
  getFiveMinuteRate(): number;
  getMeanRate(): number;
  getOneMinuteRate(): number;
}

export { Metered };
