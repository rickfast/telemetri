import "mocha";
import { expect } from "chai";
import * as timeunit from "../../src/core/time";

import { ManualClock } from "./manual-clock";
import { Snapshot } from "../../src/core/snapshot";
import { ExponentiallyDecayingReservoir } from "../../src/core/exponentially-decaying-reservoir";

const assertAllValuesBetween = (
  reservoir: ExponentiallyDecayingReservoir,
  min: number,
  max: number
) => {
  reservoir.getSnapshot().getValues().forEach(i => {
    expect(i).to.be.lessThan(max).and.gte(min);
  });
};
describe("ExponentiallyDecayingReservoir", () => {
  describe("with 100 out of 1000 elements", () => {
    it("should match snapshot", () => {
      const reservoir = new ExponentiallyDecayingReservoir(100, 0.99);

      for (var i = 0; i < 1000; i++) {
        reservoir.update(i);
      }

      expect(reservoir.size()).to.eq(100);

      const snapshot = reservoir.getSnapshot();

      expect(snapshot.size()).to.eq(100);
      assertAllValuesBetween(reservoir, 0, 1000);
    });
  });

  describe("with 100 out of 10 elements", () => {
    it("should match snapshot", () => {
      const reservoir = new ExponentiallyDecayingReservoir(100, 0.99);

      for (var i = 0; i < 10; i++) {
        reservoir.update(i);
      }

      expect(reservoir.size()).to.eq(10);

      const snapshot = reservoir.getSnapshot();

      expect(snapshot.size()).to.eq(10);
      assertAllValuesBetween(reservoir, 0, 10);
    });
  });

  describe("heavily biased with 100 out of 1000 elements", () => {
    it("should match snapshot", () => {
      const reservoir = new ExponentiallyDecayingReservoir(1000, 0.01);

      for (var i = 0; i < 100; i++) {
        reservoir.update(i);
      }

      expect(reservoir.size()).to.eq(100);

      const snapshot = reservoir.getSnapshot();

      expect(snapshot.size()).to.eq(100);
      assertAllValuesBetween(reservoir, 0, 100);
    });
  });

  describe("long periods of inactivity", () => {
    it("should not corrupt sampling state", () => {
      const clock = new ManualClock();
      const reservoir = new ExponentiallyDecayingReservoir(10, 0.015, clock);

      for (let i = 0; i < 1000; i++) {
        reservoir.update(1000 + i);
        clock.addMillis(100);
      }
      expect(reservoir.getSnapshot().size()).to.eq(10);
      assertAllValuesBetween(reservoir, 1000, 2000);

      // wait for 15 hours and add another value.
      // this should trigger a rescale. Note that the number of samples will be reduced to 2
      // because of the very small scaling factor that will make all existing priorities equal to
      // zero after rescale.
      clock.addHours(15);
      reservoir.update(2000);
      expect(reservoir.getSnapshot().size()).to.eq(1);
      assertAllValuesBetween(reservoir, 1000, 3000);

      // add 1000 values at a rate of 10 values/second
      for (let i = 0; i < 1000; i++) {
        reservoir.update(3000 + i);
        clock.addMillis(100);
      }
      expect(reservoir.getSnapshot().size()).to.eq(10);
      assertAllValuesBetween(reservoir, 3000, 4000);
    });

    it("fetch should resample", () => {
      const clock = new ManualClock();
      const reservoir = new ExponentiallyDecayingReservoir(10, 0.015, clock);

      // add 1000 values at a rate of 10 values/second
      for (let i = 0; i < 1000; i++) {
        reservoir.update(1000 + i);
        clock.addMillis(100);
      }
      expect(reservoir.getSnapshot().size()).to.eq(10);
      assertAllValuesBetween(reservoir, 1000, 2000);

      // wait for 15 hours and add another value.
      // this should trigger a rescale. Note that the number of samples will be reduced to 2
      // because of the very small scaling factor that will make all existing priorities equal to
      // zero after rescale.
      clock.addHours(20);

      const snapshot = reservoir.getSnapshot();
      expect(snapshot.getMax()).to.eq(0);
      expect(snapshot.getMean()).to.eq(0);
      expect(snapshot.getMedian()).to.eq(0);
      expect(snapshot.size()).to.eq(0);
    });
  });

  describe("empty reservoir snapshot", () => {
    it("should return zero for all values", () => {
      const reservoir = new ExponentiallyDecayingReservoir(
        100,
        0.015,
        new ManualClock()
      );

      const snapshot = reservoir.getSnapshot();
      expect(snapshot.getMax()).to.eq(0);
      expect(snapshot.getMean()).to.eq(0);
      expect(snapshot.getMedian()).to.eq(0);
      expect(snapshot.size()).to.eq(0);
    });
  });

  describe("spot lift", () => {
    it("works", () => {
      const clock = new ManualClock();
      const reservoir = new ExponentiallyDecayingReservoir(1000, 0.015, clock);

      const valuesRatePerMinute = 10;
      const valuesIntervalMillis =
        timeunit.minutes.toMillis(1) / valuesRatePerMinute;
      // mode 1: steady regime for 120 minutes
      for (let i = 0; i < 120 * valuesRatePerMinute; i++) {
        reservoir.update(177);
        clock.addMillis(valuesIntervalMillis);
      }

      // switching to mode 2: 10 minutes more with the same rate, but larger value
      for (let i = 0; i < 10 * valuesRatePerMinute; i++) {
        reservoir.update(9999);
        clock.addMillis(valuesIntervalMillis);
      }

      // expect that quantiles should be more about mode 2 after 10 minutes
      expect(reservoir.getSnapshot().getMedian()).to.eq(9999);
    });
  });

  describe("spot fall", () => {
    it("works", () => {
      const clock = new ManualClock();
      const reservoir = new ExponentiallyDecayingReservoir(1000, 0.015, clock);

      const valuesRatePerMinute = 10;
      const valuesIntervalMillis =
        timeunit.minutes.toMillis(1) / valuesRatePerMinute;
      // mode 1: steady regime for 120 minutes
      for (let i = 0; i < 120 * valuesRatePerMinute; i++) {
        reservoir.update(9998);
        clock.addMillis(valuesIntervalMillis);
      }

      // switching to mode 2: 10 minutes more with the same rate, but smaller value
      for (let i = 0; i < 10 * valuesRatePerMinute; i++) {
        reservoir.update(178);
        clock.addMillis(valuesIntervalMillis);
      }

      // expect that quantiles should be more about mode 2 after 10 minutes
      expect(reservoir.getSnapshot().get95thPercentile()).to.eq(178);
    });
  });

  it("should have quantiles based on weights", () => {
    const clock = new ManualClock();
    const reservoir = new ExponentiallyDecayingReservoir(1000, 0.015, clock);
    
    for (let i = 0; i < 40; i++) {
      reservoir.update(177);
    }

    clock.addSeconds(120);

    for (let i = 0; i < 10; i++) {
      reservoir.update(9999);
    }

    expect(reservoir.getSnapshot().size()).to.eq(50);

    // the first added 40 items (177) have weights 1
    // the next added 10 items (9999) have weights ~6
    // so, it's 40 vs 60 distribution, not 40 vs 10
    expect(reservoir.getSnapshot().getMedian()).to.eq(9999);
    expect(reservoir.getSnapshot().get75thPercentile()).to.eq(9999);
  });
});
