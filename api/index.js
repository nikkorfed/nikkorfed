const express = require("express");
const router = express.Router();

const ruslan = require("./ruslan");
const fedrych = require("./fedrych");

router.use(express.json());

router.use((req, res, next) => {
  console.log("Время:", new Date().toLocaleString("en-GB"));
  console.log(req.body);
  next();
});

router.all("/ruslan", ruslan);
router.all("/fedrych", fedrychbot);

router.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Что-то пошло не так...");
});

module.exports = router;
