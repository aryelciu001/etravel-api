const router = require("express").Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
let Profile = require("../models/profile.model");
let User = require("../models/user.model");

//get all users
router.route("/").get((req, res) => {
  Profile.find()
    .then(profiles => res.json(profiles))
    .catch(err => res.status(400).json("Error: " + err));
});

//get one user
router.route("/login").post((req, res) => {
  Profile.find({email: req.body.email}).then((profile)=>{
    var currentProfile = profile[0]
    if(currentProfile == null){
      return res.status(404).send("Cannot find user");
    }
    try{
      bcrypt.compare(req.body.password, currentProfile.password).then(function(result) {
        if(result == true){
          User.find({profile: currentProfile}).then((user)=>{
            res.send(user);
          })
        }
        else{
          res.status(401).send("Wrong password");
        }
      });
    }
    catch{
      res.status(500).send();
    }
  });
})

//add new profile
router.route("/add").post((req, res) => {
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;
  const country = req.body.country;
  const cleanPassword = req.body.password;
  bcrypt.hash(cleanPassword, saltRounds).then((hashedPassword)=>{
    password = hashedPassword;

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
  
});

module.exports = router;
