import * as timeunit from "./time";

const INTERVAL = 5;
const SECONDS_PER_MINUTE = 60.0;
const ONE_MINUTE = 1;
const FIVE_MINUTES = 5;
const FIFTEEN_MINUTES = 15;
const M1_ALPHA = 1 - Math.exp(-INTERVAL / SECONDS_PER_MINUTE / ONE_MINUTE);
const M5_ALPHA = 1 - Math.exp(-INTERVAL / SECONDS_PER_MINUTE / FIVE_MINUTES);
const M15_ALPHA =
  1 - Math.exp(-INTERVAL / SECONDS_PER_MINUTE / FIFTEEN_MINUTES);

class Ewma {
  private initialized = false;
  private rate = 0.0;

  private uncounted = 0;
  private alpha: number;
  private interval: number;

  static oneMinuteEwma(): Ewma {
    return new Ewma(M1_ALPHA, INTERVAL, timeunit.seconds);
  }

  static fiveMinuteEwma(): Ewma {
    return new Ewma(M5_ALPHA, INTERVAL, timeunit.seconds);
  }

  static fifteenMinuteEwma(): Ewma {
    return new Ewma(M15_ALPHA, INTERVAL, timeunit.seconds);
  }

  constructor(alpha: number, interval: number, intervalUnit: any) {
    this.interval = intervalUnit.toNanos(interval);
    this.alpha = alpha;
  }

  update(n: number): void {
    this.uncounted = this.uncounted + n;
  }

  tick(): void {
    const count = this.uncounted;
    
    this.uncounted = 0;

    const instantRate = count / this.interval;
    
    if (this.initialized) {
      this.rate += this.alpha * (instantRate - this.rate);
    } else {
      this.rate = instantRate;
      this.initialized = true;
    }
  }

  getRate(rateUnit: any): number {
    return this.rate * rateUnit.toNanos(1);
  }
}

export { Ewma };
