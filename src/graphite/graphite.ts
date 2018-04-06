import { Socket } from 'net';
import { promisify } from 'util';

import { GraphiteMetric } from './graphite-metric';

class Graphite {
  private socket: Socket;
  private initialized: boolean;
  // tslint:disable-next-line:ban-types
  private connect: Function;

  constructor(private host: string, private port: number) {
    this.socket = new Socket();
    this.connect = promisify(this.socket.connect);
  }

  init(): Promise<boolean> {
    return this.connect(this.port, this.host).then(() => {
      this.initialized = true;

      return true;
    });
  }

  send(metrics: GraphiteMetric[]): void {
    const payload = metrics
      .map(metric => `${metric.name} ${metric.value} ${metric.time}`)
      .join('\n');

    this.socket.write(new Buffer(payload));
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('Graphite socket not initialized.');
    }
  }
}

export { Graphite };
