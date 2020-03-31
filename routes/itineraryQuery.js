const router = require("express").Router();
const axios = require("axios");
const itineraryJSON = require("../computation/data.json");

router.route("/").post((req, res) => {
  const city = req.body.city;
  const preference = req.body.preference;
  var response = itineraryJSON[city][preference];
  var indices = [];
  var toBeSent = [];
  var index;
  while (toBeSent.length < 10) {
    index = Math.floor(Math.random() * response.length - 1);
    if (!indices.includes(index)) {
      toBeSent.push(response[index]);
      indices.push(index);
    }
  }
  res.send(toBeSent);
});

module.exports = router;
