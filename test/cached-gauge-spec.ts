import "mocha";
import { expect } from "chai";

import { CachedGauge } from "../src/cached-gauge";
import * as timeunit from "timeunit";
import * as sleep from "sleep";

let value = 0;
class TestGauge extends CachedGauge<number> {
  loadValue(): number {
    value = value + 1;
    return value;
  }
}
const gauge = new TestGauge(100, timeunit.milliseconds);

describe("CachedGauge", () => {
  it("should cache the value for a given period", () => {
    expect(gauge.getValue()).to.be.eq(1);
    expect(gauge.getValue()).to.be.eq(1);
  });

  it("should reload the cached value after the given period", () => {
    expect(gauge.getValue()).to.be.eq(1);

    sleep.sleep(1);

    expect(gauge.getValue()).to.be.eq(2);
    expect(gauge.getValue()).to.be.eq(2);
  });
});
