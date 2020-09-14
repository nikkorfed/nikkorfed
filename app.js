const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const app = express();

app.use(express.static("public"));
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.body);
  next();
});

app.all("/api/ruslan", (req, res) => {
  let word = req.body.request.nlu.tokens[req.body.request.nlu.tokens.length - 1];
  let answer;

  let consonants = "бвгджзклмнпрстфхцчшщ";
  let vowels = "аеёийоуыэюя";

  if (!word) answer = "Теперь я буду вести себя как Руслан. Скажите мне любое слово.";
  else {
    if (consonants.includes(word[0])) word = word.slice(1);
    if (consonants.includes(word[0])) word = word.slice(1);

    if (word[0] == "а" || word[0] == "я") answer = "хуя" + word.slice(1);
    else if (word[0] == "е" || word[0] == "э") answer = "хуе" + word.slice(1);
    else if (word[0] == "ё" || word[0] == "о") answer = "хуё" + word.slice(1);
    else if (word[0] == "и" || word[0] == "й") answer = "хуи" + word.slice(1);
    else if (word[0] == "у" || word[0] == "ю") answer = "хую" + word.slice(1);
    else answer = "хуе" + word;
  }

  res.json({ response: { text: answer, tts: `${answer.slice(0, 2)} ${answer.slice(2)}`, end_session: false }, version: "1.0" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Что-то пошло не так...");
});

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
