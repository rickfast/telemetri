import { Gauge } from "../core/gauge";

import * as os from "os";

const gauges = {};

gauges["cpu.load.1m"] = Gauge.forLambda(() => os.loadavg()[0]);
gauges["cpu.load.5m"] = Gauge.forLambda(() => os.loadavg()[1]);
gauges["cpu.load.15m"] = Gauge.forLambda(() => os.loadavg()[3]);
gauges["cpu.user"] = Gauge.forLambda(() => process.cpuUsage().user);
gauges["cpu.system"] = Gauge.forLambda(() => process.cpuUsage().system);
gauges["mem.heap.total"] = Gauge.forLambda(() => process.memoryUsage().heapTotal);
gauges["mem.heap.used"] = Gauge.forLambda(() => process.memoryUsage().heapUsed);
gauges["mem.external"] = Gauge.forLambda(() => process.memoryUsage()["external"]);
gauges["mem.rss"] = Gauge.forLambda(() => process.memoryUsage().rss);

export { gauges };