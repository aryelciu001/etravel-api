const router = require("express").Router();
const axios = require("axios");
const itineraryJSON = require("../computation/data.json");

router.route("/").post((req, res) => {
  res.send(itineraryJSON);
});

module.exports = router;
