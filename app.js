const express = require("express");
const https = require("https");
const http = require("http");
const fs = require("fs");
const app = express();

const PORT = process.env.PORT || 3000;

app.use("/api", require("./api"));

app.use(express.static("public"));

app.use((req, res) => res.status(404).sendFile("404.html", { root: "public" }));

app.listen(PORT, () => console.log(`Сервер успешно запущен на порту ${PORT}...`));
