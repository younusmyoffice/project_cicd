const http = require("http");
const os = require("os");

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

const server = http.createServer((req, res) => {
  const path = req.url.split("?")[0];

  if (path === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        ok: true,
        message: "Server is running",
        path: "/",
      })
    );
    return;
  }

  if (path === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  if (path === "/api/server" && req.method === "GET") {
    const mem = process.memoryUsage();
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        ok: true,
        hostname: os.hostname(),
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        pid: process.pid,
        uptimeSeconds: process.uptime(),
        listen: { host: HOST, port: PORT },
        memory: {
          rss: mem.rss,
          heapTotal: mem.heapTotal,
          heapUsed: mem.heapUsed,
          external: mem.external,
        },
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  if (path === "/data" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        ok: true,
        message: "this is a cicd server message",
      })
    );
    return;
  }
  if (path === "/api/sum" && req.method === "GET") {
    const url = new URL(req.url, `http://localhost`);
    const rawA = 2;
    const rawB = 4;
    if (rawA === null || rawB === null || rawA === "" || rawB === "") {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          ok: false,
          error:
            "Missing a or b. Use: /api/sum?a=3&b=5",
        })
      );
      return;
    }
    const a = Number(rawA);
    const b = Number(rawB);
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          ok: false,
          error: "a and b must be valid numbers",
        })
      );
      return;
    }
    const result = a + b;
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        ok: true,
        a,
        b,
        result,
      })
    );
    return;
  }
  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ ok: false, error: "Not found" }));
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the other process or set PORT to another value.`
    );
  } else {
    console.error("Server failed to start node server:", err.message);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`Listening on http://${HOST}:${PORT}`);
});
