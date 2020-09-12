const express = require("express");
const app = express();
const port = 80;

app.use(express.static("public"));

app.use("/api/ruslan", (req, res) => {
  const word = req.body.request.nlu.tokens[req.body.request.nlu.tokens.length - 1];
  let answer = "ху" + word;
  res.json({
    response: { text: answer, end_session: false },
    version: "1.0",
  });
});

app.use((req, res) => {
  res.status(404).sendFile("404.html", { root: "public" });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}...`);
});
