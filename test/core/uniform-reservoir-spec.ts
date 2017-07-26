import { expect } from 'chai';
import 'mocha';

import { Snapshot } from '../../src/core/snapshot';
import { UniformReservoir } from '../../src/core/uniform-reservoir';

describe('UniformReservoir', () => {
  describe('with 100 out of 1000 elements', () => {
    it('should match snapshot', () => {
      const reservoir = new UniformReservoir(100);
      for (let i = 0; i < 1000; i++) {
        reservoir.update(i);
      }

      const snapshot = reservoir.getSnapshot();

      expect(reservoir.size()).to.eq(100);
      expect(snapshot.size()).to.eq(100);

      snapshot.getValues().forEach(value => {
        expect(value).to.be.lessThan(1000).and.to.be.gte(0);
      });
    });
  });
});
