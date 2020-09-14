const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const app = express();

const api = require("./api");
app.use("/api", api);

app.use(express.static("public"));

app.use((req, res) => {
  res.status(404).sendFile("404.html", { root: "public" });
});

const options = {};

try {
  options.key = fs.readFileSync("/etc/letsencrypt/live/nikkorfed.ru/privkey.pem");
  options.cert = fs.readFileSync("/etc/letsencrypt/live/nikkorfed.ru/cert.pem");
} catch {}

http.createServer(app).listen(80);
https.createServer(options, app).listen(443, () => {
  console.log("Сервер запущен...");
});
