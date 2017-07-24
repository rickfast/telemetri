import "mocha";
import { expect } from "chai";

import { Ewma } from "../../src/core/ewma";
import * as timeunit from "timeunit";

function elapseMinute(ewma: Ewma): void {
  for (let i = 1; i <= 12; i++) {
    ewma.tick();
  }
}

describe("EWMA", () => {
  describe("One minute EWMA", () => {
    const ewma = Ewma.oneMinuteEwma();

    it("should set rate", () => {
      ewma.update(3);
      ewma.tick();
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(0.6, 0.000001);
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.22072766,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.08120117,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.02987224,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.01098938,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.00404277,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.00148725,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.00054713,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.00020128,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.00007405,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.00002724,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.00001002,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.00000369,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.00000136,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(0.0000005, 0.000001);
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.00000018,
        0.000001
      );
    });
  });

  describe("Five minute EWMA", () => {
    const ewma = Ewma.fiveMinuteEwma();

    it("should set rate", () => {
      ewma.update(3);
      ewma.tick();
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(0.6, 0.000001);
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.49123845,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.40219203,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.32928698,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.26959738,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.22072766,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.18071653,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.14795818,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.12113791,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.09917933,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.08120117,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(0.0664819, 0.000001);
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.05443077,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.04456415,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.03648604,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.02987224,
        0.000001
      );
    });
  });

  describe("Fifteen minute EWMA", () => {
    const ewma = Ewma.fifteenMinuteEwma();

    it("should set rate", () => {
      ewma.update(3);
      ewma.tick();
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(0.6, 0.000001);
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.56130419,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.52510399,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.49123845,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(0.459557, 0.000001);
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.42991879,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.40219203,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.37625345,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.35198773,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.32928698,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.30805027,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.28818318,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.26959738,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.25221023,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.23594443,
        0.000001
      );
      elapseMinute(ewma);
      expect(ewma.getRate(timeunit.seconds)).to.be.closeTo(
        0.22072766,
        0.000001
      );
    });
  });
});
