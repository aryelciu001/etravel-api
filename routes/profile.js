const router = require("express").Router();
let Profile = require("../models/profile.model");
let User = require("../models/user.model");

//get all users
router.route("/").get((req, res) => {
  Profile.find()
    .then(profiles => res.json(profiles))
    .catch(err => res.status(400).json("Error: " + err));
});

//get one user
router.route("/:email").get((req, res) => {
  Profile.find({ email: req.params.email })
    .then(profile => {
      //password checking
      // if(password is correct) {
      //     res.json(profile)
      // }else{
      //     res.json(error)
      // }
    })
    .catch(err => res.status(400).json("Error: " + err));
});

//add new profile
router.route("/add").post((req, res) => {
  const name = req.body.name;
  const phoneNumber = req.body.phone;
  const email = req.body.email;
  const country = req.body.country;
  const password = req.body.password; // hashed later (?)

  Profile.find({ name }, result => {
    if (result === null) {
      const newProfile = new Profile({
        name,
        phoneNumber,
        email,
        country,
        password
      });
      newProfile
        .save()
        .then(newProfile => {
          res.json("New Profile added !");
          console.log(newProfile);
          var newuser = new User({ profile: newProfile });
          newuser
            .save()
            .then(() => {
              console.log("user saved");
            })
            .catch(err => res.status(400).json("Error: " + err));
        })
        .catch(err => res.status(400).json("Error: " + err));
    } else {
      res.json("Profile exists!");
    }
  });
});

module.exports = router;
