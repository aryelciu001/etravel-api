// Profiling Result Model in

const ex = require("express");
const router = ex.Router();
const ProfilingResult = require("../models/profilingresult.model");
const User = require("../models/user.model");

// router to store the profiling result into the database
router.post("/addprofres", (req, res) => {
  const hotel = req.body.hotel;
  const transit = req.body.transit;
  const flight = req.body.flight;
  const itinerary = req.body.itinerary;
  const time = req.body.time;
  var newProfRes = new ProfilingResult({
    hotel,
    transit,
    flight,
    itinerary,
    time
  });
  newProfRes.save().then(theProfResult => {
    User.findOne({ _id: req.body.user }).then(user => {
      user.profilingResult = theProfResult["_id"];
      user
        .save()
        .then(() => {
          console.log();
          res.send({ err: "" });
        })
        .catch(err => {
          res.send({ err });
        });
    });
  });
});

router.post("/getprofres", (req, res) => {
  const _id = req.body.user;
  User.findOne({ _id }).then(theUser => {
    ProfilingResult.findOne({ _id: theUser.profilingResult }).then(profres => {
      res.send(profres);
    });
  });
});

module.exports = router;
