const router = require("express").Router();
const itineraryJSON = require("../computation/data.json");

router.route("/").post((req, res) => {
  const city = req.body.city;
  var response = itineraryJSON[city];
  res.send(response);
});

module.exports = router;
