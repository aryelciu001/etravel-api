const ex = require("express");
const router = ex.Router();
const ProfilingResult = require("../models/profilingresult.model");

router.post("/addprofres", (req, res) => {
  const hotel = req.body.hotel;
  const transit = req.body.transit;
  const flight = req.body.flight;
  const itinerary = req.body.itinerary;
  var newProfRes = new ProfilingResult({
    hotel,
    transit,
    flight,
    itinerary
  });
  newProfRes.save().then(theProfResult => {
    const User = require("../models/user.model");
    User.findOne({ _id: req.body.user }).then(user => {
      user.profilingResult = theProfResult;
      user
        .save()
        .then(() => {
          console.log("OKAY");
          res.send({ err: "" });
        })
        .catch(err => {
          res.send({ err });
        });
    });
  });
});

router.post("/getprofres", (req, res) => {
  const User = require("../models/user.model");
  const _id = req.body.id;
  User.findOne({ _id }).then(theUser => {
    res.send(theUser.profilingResult);
  });
});

module.exports = router;
