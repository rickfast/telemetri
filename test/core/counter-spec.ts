import { expect } from 'chai';
import 'mocha';

import { Counter } from '../../src/core/counter';

describe('Counter', () => {
  it('should start at zero', () => {
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
