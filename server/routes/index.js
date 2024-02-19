var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Welcome to CoderDex!");
});

const pokedexRouter = require("./pokedex.api.js");
router.use("/poke", pokedexRouterRouter);
module.exports = router;
