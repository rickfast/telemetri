const C0 = 1;
const C1 = C0 * 1000;
const C2 = C1 * 1000;
const C3 = C2 * 1000;
const C4 = C3 * 60;
const C5 = C4 * 60;
const C6 = C5 * 24;

const MAX = Number.MAX_VALUE;

const x = (d: number, m: number, over: number): number => {
  if (d > over) return Number.MAX_VALUE;
  if (d < -over) return Number.MIN_VALUE;
  return d * m;
};

interface TimeUnit {
  convert(sourceDuration: number, sourceUnit: TimeUnit): number;
  toNanos(d: number): number;
  toMicros(d: number): number;
  toMillis(d: number): number;
  toSeconds(d: number): number;
  toMinutes(d: number): number;
  toHours(d: number): number;
  toDays(d: number): number;
  excessNanos(d: number, m: number): number;
}

const nanoseconds = {
  toNanos: (d: number): number => {
    return d;
  },
  toMicros: (d: number): number => {
    return d / (C1 / C0);
  },
  toMillis: (d: number): number => {
    return d / (C2 / C0);
  },
  toSeconds: (d: number): number => {
    return d / (C3 / C0);
  },
  toMinutes: (d: number): number => {
    return d / (C4 / C0);
  },
  toHours: (d: number): number => {
    return d / (C5 / C0);
  },
  toDays: (d: number): number => {
    return d / (C6 / C0);
  },
  convert: (d: number, u: TimeUnit) => {
    return u.toNanos(d);
  },
  excessNanos: (d: number, m: number): number => {
    return d - m * C2;
  }
};

const microseconds = {
  toNanos: (d: number): number => {
    return x(d, C1 / C0, MAX / (C1 / C0));
  },
  toMicros: (d: number): number => {
    return d;
  },
  toMillis: (d: number): number => {
    return d / (C2 / C1);
  },
  toSeconds: (d: number): number => {
    return d / (C3 / C1);
  },
  toMinutes: (d: number): number => {
    return d / (C4 / C1);
  },
  toHours: (d: number): number => {
    return d / (C5 / C1);
  },
  toDays: (d: number): number => {
    return d / (C6 / C1);
  },
  convert: (d: number, u: TimeUnit) => {
    return u.toMicros(d);
  },
  excessNanos: (d: number, m: number): number => {
    return d * C1 - m * C2;
  }
};

const milliseconds = {
  toNanos: (d: number): number => {
    return x(d, C2 / C0, MAX / (C2 / C0));
  },
  toMicros: (d: number): number => {
    return x(d, C2 / C1, MAX / (C2 / C1));
  },
  toMillis: (d: number): number => {
    return d;
  },
  toSeconds: (d: number): number => {
    return d / (C3 / C2);
  },
  toMinutes: (d: number): number => {
    return d / (C4 / C2);
  },
  toHours: (d: number): number => {
    return d / (C5 / C2);
  },
  toDays: (d: number): number => {
    return d / (C6 / C2);
  },
  convert: (d: number, u: TimeUnit) => {
    return u.toMillis(d);
  },
  excessNanos: (d: number, m: number): number => {
    return 0;
  }
};

const seconds = {
  toNanos: (d: number): number => {
    return x(d, C3 / C0, MAX / (C3 / C0));
  },
  toMicros: (d: number): number => {
    return x(d, C3 / C1, MAX / (C3 / C1));
  },
  toMillis: (d: number): number => {
    return x(d, C3 / C2, MAX / (C3 / C2));
  },
  toSeconds: (d: number): number => {
    return d;
  },
  toMinutes: (d: number): number => {
    return d / (C4 / C3);
  },
  toHours: (d: number): number => {
    return d / (C5 / C3);
  },
  toDays: (d: number): number => {
    return d / (C6 / C3);
  },
  convert: (d: number, u: TimeUnit) => {
    return u.toSeconds(d);
  },
  excessNanos: (d: number, m: number): number => {
    return 0;
  }
};

const minutes = {
  toNanos: (d: number): number => {
    return x(d, C4 / C0, MAX / (C4 / C0));
  },
  toMicros: (d: number): number => {
    return x(d, C4 / C1, MAX / (C4 / C1));
  },
  toMillis: (d: number): number => {
    return x(d, C4 / C2, MAX / (C4 / C2));
  },
  toSeconds: (d: number): number => {
    return x(d, C4 / C3, MAX / (C4 / C3));
  },
  toMinutes: (d: number): number => {
    return d;
  },
  toHours: (d: number): number => {
    return d / (C5 / C4);
  },
  toDays: (d: number): number => {
    return d / (C6 / C4);
  },
  convert: (d: number, u: TimeUnit) => {
    return u.toMinutes(d);
  },
  excessNanos: (d: number, m: number): number => {
    return 0;
  }
};

const hours = {
  toNanos: (d: number): number => {
    return x(d, C5 / C0, MAX / (C5 / C0));
  },
  toMicros: (d: number): number => {
    return x(d, C5 / C1, MAX / (C5 / C1));
  },
  toMillis: (d: number): number => {
    return x(d, C5 / C2, MAX / (C5 / C2));
  },
  toSeconds: (d: number): number => {
    return x(d, C5 / C3, MAX / (C5 / C3));
  },
  toMinutes: (d: number): number => {
    return x(d, C5 / C4, MAX / (C5 / C4));
  },
  toHours: (d: number): number => {
    return d;
  },
  toDays: (d: number): number => {
    return d / (C6 / C5);
  },
  convert: (d: number, u: TimeUnit) => {
    return u.toHours(d);
  },
  excessNanos: (d: number, m: number): number => {
    return 0;
  }
};

const days = {
  toNanos: (d: number): number => {
    return x(d, C6 / C0, MAX / (C6 / C0));
  },
  toMicros: (d: number): number => {
    return x(d, C6 / C1, MAX / (C6 / C1));
  },
  toMillis: (d: number): number => {
    return x(d, C6 / C2, MAX / (C6 / C2));
  },
  toSeconds: (d: number): number => {
    return x(d, C6 / C3, MAX / (C6 / C3));
  },
  toMinutes: (d: number): number => {
    return x(d, C6 / C4, MAX / (C6 / C4));
  },
  toHours: (d: number): number => {
    return x(d, C6 / C5, MAX / (C6 / C5));
  },
  toDays: (d: number): number => {
    return d;
  },
  convert: (d: number, u: TimeUnit) => {
    return u.toDays(d);
  },
  excessNanos: (d: number, m: number): number => {
    return 0;
  }
};

export {
  TimeUnit,
  nanoseconds,
  microseconds,
  milliseconds,
  seconds,
  minutes,
  hours,
  days
};
