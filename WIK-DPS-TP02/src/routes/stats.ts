import { IncomingMessage, ServerResponse } from "http";
import { CounterStore } from "../counter-store";
import { randomUUID } from "crypto";

export const INSTANCE_ID: string = randomUUID();
const START_TIME: number = Date.now();

export function handleStats(
  _req: IncomingMessage,
  res: ServerResponse,
  store: CounterStore
): void {
  const uptimeMs = Date.now() - START_TIME;

  const body = {
    instanceId: INSTANCE_ID,
    totalPingRequests: store.getCount(),
    uptime: {
      ms: uptimeMs,
      seconds: Math.floor(uptimeMs / 1000),
      human: formatUptime(uptimeMs),
    },
  };

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body, null, 2));
}

function formatUptime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
}
