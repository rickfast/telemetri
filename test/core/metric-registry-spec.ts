import "mocha";
import { expect } from "chai";

import { ConsoleReporter } from "../../src/core/scheduled-reporter";
import { defaultRegistry } from "../../src/index";

import * as timeunit from "../../src/core/time";

describe("MetricRegistry", () => {
  it("collects metrics", () => {
    const reporter = new ConsoleReporter(defaultRegistry);

    defaultRegistry.register("one.gauge", () => 1.0);

    const counter = defaultRegistry.counter("a.counter");

    counter.inc();
    counter.inc();
    counter.inc();

    const histogram = defaultRegistry.histogram("a.histogram");

    histogram.update(1);
    histogram.update(2);
    histogram.update(3);
    histogram.update(4);
    histogram.update(5);

    const counters = defaultRegistry.getCounters();

    expect(Object.keys(counters).length).to.eq(1);
    expect(counters["a.counter"].getCount()).to.eq(3);

    const histograms = defaultRegistry.getHistograms();

    expect(Object.keys(histograms).length).to.eq(1);
    expect(histograms["a.histogram"].getCount()).to.eq(5);
    expect(histograms["a.histogram"].getSnapshot().get999thPercentile()).to.eq(
      5
    );
    expect(histograms["a.histogram"].getSnapshot().get99thPercentile()).to.eq(
      5
    );
    expect(histograms["a.histogram"].getSnapshot().get98thPercentile()).to.eq(
      5
    );
    expect(histograms["a.histogram"].getSnapshot().get75thPercentile()).to.eq(
      4
    );
    expect(histograms["a.histogram"].getSnapshot().getMean()).to.be.closeTo(
      3,
      0.01
    );
  });
});
