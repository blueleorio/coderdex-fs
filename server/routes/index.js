var express = require("express");
// var cors = require("cors");
var router = express.Router();

// Enable CORS for all routes
// router.use(cors());
/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Welcome to CoderDex!");
});

const pokedexRouter = require("./pokedex.api.js");
router.use("/pokemons", pokedexRouter);
module.exports = router;
