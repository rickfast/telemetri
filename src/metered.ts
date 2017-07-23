import { Metric } from './metric';
import { Counting } from './counting';

interface Metered extends Metric, Counting {
    getCount(): number;
    getFifteenMinuteRate(): number;
    getFiveMinuteRate(): number;
    getMeanRate(): number;
    getOneMinuteRate(): number;
}

export { Metered };
