import { Gauge } from './gauge';

class Ratio {
  static of(numerator: number, denominator: number): Ratio {
    return new Ratio(numerator, denominator);
  }

  private constructor(private numerator: number, private denominator: number) {}

  getValue(): number {
    const d = this.denominator;

    if (this.denominator !== this.denominator || d === 0 || d === Infinity) {
      return NaN;
    }

    return this.numerator / d;
  }

  toString(): string {
    return `${this.numerator}:${this.denominator}`;
  }
}

abstract class RatioGauge extends Gauge<number> {
  protected abstract getRatio(): Ratio;

  getValue(): number {
    return this.getRatio().getValue();
  }
}

export { Ratio, RatioGauge };
