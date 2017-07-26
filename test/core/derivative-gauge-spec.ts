import { expect } from 'chai';
import 'mocha';

import { DerivativeGauge } from '../../src/core/derivative-gauge';
import { Gauge } from '../../src/core/gauge';


class InnerGauge extends Gauge<string> {
  getValue(): string {
    return 'some-value';
  }
}

class DerivedGauge extends DerivativeGauge<string, number> {
  transform(value: string): number {
    return value.length;
  }
}

describe('DerivativeGauge', () => {
  it('should return a transformed value', () => {
    expect(new DerivedGauge(new InnerGauge()).getValue()).to.eq(10);
  });
});
