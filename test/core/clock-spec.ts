import { expect } from 'chai';
import 'mocha';

import { defaultClock } from '../../src/core/clock';
import * as timeunit from '../../src/core/time';

describe('UserClock', () => {
  it('works', () => {
    const clock = defaultClock();

    expect(clock.getTime()).to.be.closeTo(new Date().getTime(), 1000.0);
    expect(clock.getTick()).to.be.closeTo(
      timeunit.milliseconds.toNanos(new Date().getTime()),
      1000.0
    );
  });
});
