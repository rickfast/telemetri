import "mocha";
import { expect } from "chai";

import { CachedGauge } from "../../src/core/cached-gauge";
import { Ratio, RatioGauge } from "../../src/core/ratio-gauge";

import * as timeunit from "timeunit";
import * as sleep from "sleep";

describe("RatioGauge", () => {
  it("should produce human readable ratio", () => {
    const ratio = Ratio.of(100, 200);

    expect(ratio.toString()).to.eq("100:200");
  });

  it("should calculate the ratio of the numerator to the denominator", () => {
    class Gauge extends RatioGauge {
      getRatio(): Ratio {
        return Ratio.of(2, 4);
      }
    }
    const regular = new Gauge();

    expect(regular.getValue()).to.eq(0.5);
  });

  it("should handle divide by zero issues", () => {
    class Gauge extends RatioGauge {
      getRatio(): Ratio {
        return Ratio.of(100, 0);
      }
    }
    const divByZero = new Gauge();

    expect(divByZero.getValue()).to.not.eq(divByZero.getValue());
  });

  it("should handle infinite denominators", () => {
    class Gauge extends RatioGauge {
      getRatio(): Ratio {
        return Ratio.of(10, Infinity);
      }
    }
    const infinite = new Gauge();

    expect(infinite.getValue()).to.not.eq(infinite.getValue());
  });
});
