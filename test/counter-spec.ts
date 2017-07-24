import "mocha";
import { expect } from "chai";

import { Counter } from "../src/counter";
import * as timeunit from "timeunit";

describe("Counter", () => {
  it("should start at zero", () => {
    const counter = new Counter();
    expect(counter.getCount()).to.eq(0);
  });

  it('should increment by one', () => {
    const counter = new Counter();
    counter.inc();
    expect(counter.getCount()).to.eq(1);
  });

  it('should increment by an arbitrary delta', () => {
    const counter = new Counter();
    counter.inc(12);
    expect(counter.getCount()).to.eq(12);
  });

  it('should decrement by one', () => {
    const counter = new Counter();
    counter.dec();
    expect(counter.getCount()).to.eq(-1);
  });

  it('should decrement by an arbitrary delta', () => {
    const counter = new Counter();
    counter.dec(12);
    expect(counter.getCount()).to.eq(-12);
  });

  it('should increment by a negative delta', () => {
    const counter = new Counter();
    counter.inc(-12);
    expect(counter.getCount()).to.eq(-12);
  });

  it('should decrement by a negative delta', () => {
    const counter = new Counter();
    counter.dec(-12);
    expect(counter.getCount()).to.eq(12);
  });
});