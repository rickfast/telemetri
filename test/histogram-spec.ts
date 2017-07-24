import "mocha";
import * as chai from "chai";
import { expect } from 'chai';
import { spy } from 'sinon';
import 'mocha-sinon';

// chai.use(require('sinon-chai'));

import { Histogram } from "../../src/core/histogram";
import { Reservoir } from '../../src/core/reservoir';
import { Snapshot } from '../../src/core/snapshot';

const reservoir: Reservoir = {
  size(): number { return 0 },
  update: spy((value: number): void => {}),
  getSnapshot: (): Snapshot => {
    return null;
  }
};
const histogram = new Histogram(reservoir);

describe("Histogram", () => {
  it("should update the count on updates", () => {
    expect(histogram.getCount()).to.eq(0);
    histogram.update(1);
    expect(histogram.getCount()).to.eq(1);
  });

  // it('should update the reservoir', () => {
  //   histogram.update(2);
  //   expect(reservoir.update).to.have.;
  // });
});