import { IncomingMessage, ServerResponse } from "http";
import { CounterStore } from "../counter-store";
import { hostname } from "os";

export function handlePing(
  req: IncomingMessage,
  res: ServerResponse,
  store: CounterStore
): void {
  store.increment();

  console.log(`[${hostname()}] GET /ping`);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(req.headers, null, 2));
}