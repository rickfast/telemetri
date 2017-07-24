import "mocha";
import { expect } from "chai";

import { Timer } from "../../src/core/timer";
import { UniformReservoir } from "../../src/core/uniform-reservoir";
import { Clock } from "../../src/core/clock";

import * as timeunit from "timeunit";
import * as sleep from 'sleep';

const reservoir = new UniformReservoir();
class FiftyClock extends Clock {
  val: number = 0;

  getTick(): number {
    this.val += 50000000;

    return this.val;
  }
}

describe("Timer", () => {
  describe("new timer", () => {
    const timer = new Timer(reservoir, new FiftyClock());

    it("has rate", () => {
      expect(timer.getCount()).to.eq(0);
      expect(timer.getMeanRate()).to.be.closeTo(0.0, 0.001);
      expect(timer.getOneMinuteRate()).to.be.closeTo(0.0, 0.001);
      expect(timer.getFiveMinuteRate()).to.be.closeTo(0.0, 0.001);
      expect(timer.getFifteenMinuteRate()).to.be.closeTo(0.0, 0.001);
    });
  });

  describe("a timer", () => {
    const timer = new Timer(reservoir, new FiftyClock());

    it("increments the count on updates", () => {
      expect(timer.getCount()).to.eq(0);

      timer.update(1, timeunit.seconds);

      expect(timer.getCount()).to.eq(1);
    });
  });

  describe("a timer", () => {
    const clock = new FiftyClock();
    const timer = new Timer(reservoir, clock);

    it("times", () => {
      const context = timer.time();
      const duration = context.stop();

      expect(duration).to.eq(50000000);
    });
  });
});
