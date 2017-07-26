import { expect } from 'chai';
import 'mocha';

import { UniformSnapshot } from '../../src/core/uniform-snapshot';

describe('UniformSnapshot ', () => {
  const snapshot = new UniformSnapshot([5, 1, 2, 3, 4]);

  describe(`with values ${snapshot.getValues()}`, () => {
    it('should put small quantiles as first value', () => {
      expect(snapshot.getValue(0.0)).to.eq(1);
    });

    it('should put large quantiles as last value', () => {
      expect(snapshot.getValue(1.0)).to.eq(5);
    });

    it('should disallow NaN quantile', () => {
      expect(snapshot.getValue.bind(snapshot, NaN)).to.throw(
        Error,
        'NaN is not in [0..1]'
      );
    });

    it('should disallow negative quantile', () => {
      expect(snapshot.getValue.bind(snapshot, -1)).to.throw(
        Error,
        '-1 is not in [0..1]'
      );
    });

    it('should disallow quantile over one', () => {
      expect(snapshot.getValue.bind(snapshot, 1.5)).to.throw(
        Error,
        '1.5 is not in [0..1]'
      );
    });

    it('should have a median', () => {
      expect(snapshot.getMedian()).to.eq(3);
    });

    it('should have a p75', () => {
      expect(snapshot.get75thPercentile()).to.eq(4.5);
    });

    it('should have a p98', () => {
      expect(snapshot.get98thPercentile()).to.eq(5);
    });

    it('should have a p99', () => {
      expect(snapshot.get99thPercentile()).to.eq(5);
    });

    it('should have a p999', () => {
      expect(snapshot.get999thPercentile()).to.eq(5);
    });

    it('should have values', () => {
      [1, 2, 3, 4, 5].forEach(value =>
        expect(snapshot.getValues()).to.contain(value)
      );
    });

    it('should calculate the minimum value', () => {
      expect(snapshot.getMin()).to.eq(1);
    });

    it('should calculate the maximum value', () => {
      expect(snapshot.getMax()).to.eq(5);
    });

    it('should calculate the mean value', () => {
      expect(snapshot.getMean()).to.eq(3.0);
    });

    it('should calculate the standard deviation', () => {
      expect(snapshot.getStdDev()).to.closeTo(1.5811, 0.0001);
    });
  });

  const empty = new UniformSnapshot([]);

  describe('empty snapshot', () => {
    it('should calculate a minimum of zero for empty snapshot', () => {
      expect(empty.getMin()).to.eq(0);
    });

    it('should calculate a maximum of zero for empty snapshot', () => {
      expect(empty.getMax()).to.eq(0);
    });

    it('should calculate a mean of zero for empty snapshot', () => {
      expect(empty.getMean()).to.eq(0);
    });

    it('should calculate a standard deviation of zero for empty snapshot', () => {
      expect(empty.getStdDev()).to.eq(0);
    });
  });
});
