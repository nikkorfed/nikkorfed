const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const app = express();

// app.use(express.static("public"));
app.use(express.json());

app.all("/api/ruslan", (req, res) => {
  let word = req.body.request.nlu.tokens[req.body.request.nlu.tokens.length - 1];
  let answer;

  if (!word) answer = "Хорошо! Теперь я буду вести себя как Руслан. Скажите мне любое слово.";
  else {
    word = word.slice(1);
    if (word[0] == "е") answer = "хуе" + word.slice(1);
    else if (word[0] == "а") answer = "хуя" + word.slice(1);
    else if (word[0] == "э") answer = "хуе" + word.slice(1);
    else if (word[0] == "о") answer = "хуё" + word.slice(1);
    else answer = "хуе" + word;
  }

  res.json({ response: { text: answer, end_session: false }, version: "1.0" });
});

app.use((req, res) => {
  res.status(404).sendFile("404.html", { root: "public" });
});

const options = {};

try {
  options.key = fs.readFileSync("/etc/letsencrypt/live/nikkorfed.ru/privkey.pem");
  options.cert = fs.readFileSync("/etc/letsencrypt/live/nikkorfed.ru/cert.pem");
} catch {}

// http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
