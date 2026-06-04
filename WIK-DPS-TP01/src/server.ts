import http, { IncomingMessage, ServerResponse } from "http";
import { InMemoryCounterStore } from "./counter-store";
import { handlePing } from "./routes/ping";
import { handleStats } from "./routes/stats";

const PORT: number = parseInt(process.env.PING_LISTEN_PORT ?? "3000", 10);
const store = new InMemoryCounterStore();

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const { method, url } = req;

    if (method === "GET" && url === "/ping") {
      return handlePing(req, res, store);
    }

    if (method === "GET" && url === "/stats") {
      return handleStats(req, res, store);
    }

    res.writeHead(404);
    res.end();
  }
);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
