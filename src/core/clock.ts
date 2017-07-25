import * as timeunit from './time';

abstract class Clock {
  abstract getTick(): number;

  getTime(): number {
    return new Date().getTime();
  }
}

class UserTimeClock extends Clock {
  getTick(): number {
    return timeunit.milliseconds.toNanos(new Date().getTime());
  }
}

const DEFAULT: Clock = new UserTimeClock();

const defaultClock = (): Clock => {
  return DEFAULT;
};

export { Clock, defaultClock };
