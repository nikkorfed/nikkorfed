const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use("/api/ruslan", (req, res) => {
  const word = req.body.request.nlu.tokens[req.body.request.nlu.tokens.length - 1];
  let answer;

  if (!word) answer = "Хорошо! Теперь я буду вести себя как Руслан. Скажите мне любое слово.";
  else {
    word = word.slice(1);
    if (word[0] == "е") answer = "хуе" + word.slice(1);
    else answer = "хуе" + word;
  }

  res.json({ response: { text: answer, end_session: false }, version: "1.0" });
});

app.use((req, res) => {
  res.status(404).sendFile("404.html", { root: "public" });
});

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/nikkorfed.ru/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/nikkorfed.ru/cert.pem"),
};

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
