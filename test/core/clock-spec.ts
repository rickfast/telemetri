import "mocha";
import { expect } from "chai";

import { defaultClock } from "../../src/core/clock";
import * as timeunit from "timeunit";

describe("UserClock", () => {
  it("works", () => {
    const clock = defaultClock();

    expect(clock.getTime()).to.be.closeTo(new Date().getTime(), 100.0);
    expect(clock.getTick()).to.be.closeTo(
      timeunit.milliseconds.toNanos(new Date().getTime()),
      100.0
    );
  });
});
