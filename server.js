const http = require("http");

const PORT = Number(process.env.PORT) || 3000;

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

  res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ ok: false, error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
