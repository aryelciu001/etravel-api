const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const verify = require("./verifyToken");
let Profile = require("../models/profile.model");
let User = require("../models/user.model");

//after login, user is authenticated, get current user by req.currentUser
router.get("/afterLogin", verify, (req, res) => {
  const currentUser = req.currentUser; // get currentUser authenticated
  User.find({ _id: currentUser._id }).then(user => {
    res.send(user);
  });
});

//update profile

router.post("/updateProfile", verify, (req,res) => {
  const profileId = req.body.profileId;
  Profile.find({_id: profileId }).then(profile => {
    profile = profile[0];
    console.log(profile);
    console.log("Current password : ", profile.password);

    if(req.body.newName){
      profile.name = req.body.newName;
    }

    if(req.body.newEmail){
      profile.email = req.body.newEmail;
    }

    if(req.body.newPhoneNumber){
      profile.phoneNumber = req.body.newPhoneNumber;
    }

    if(req.body.newCountry){
      profile.country = req.body.newCountry;
    }

    var promises = []

    if(req.body.newPassword && req.body.oldPassword){
        var promise = bcrypt
            .compare(req.body.oldPassword, profile.password)
      promises.push(promise)
    }

     Promise.all(promises).then((result)=>{

       if(result.length === 0){
         profile.save();
         res.send(profile);
       }
       else{
         if(result[0] === true){
           console.log("Paswword matched")
           bcrypt.hash(req.body.newPassword, saltRounds).then(hashedPassword => {
             profile.password = hashedPassword;
             profile.save()
             res.send(profile);
           });
         }
         else{
           console.log("wrong password")
           res.send("Wrong Password");
         }
       }
     })
  })
})

//get the profile information
router.post("/getProfile", verify, (req, res) => {
  const profileId = req.body.profileId;
  Profile.find({ _id: profileId }).then(profile => {
    res.send(profile);
  });
});

//get all users
router.route("/").get((req, res) => {
  Profile.find()
    .then(profiles => res.json(profiles))
    .catch(err => res.status(400).json("Error: " + err));
});

//get one user
router.route("/login").post((req, res) => {
  Profile.find({ email: req.body.email }).then(profile => {
    var currentProfile = profile[0];
    if (currentProfile == null) {
      return res.status(404).send("Cannot find user");
    }
    try {
      bcrypt
        .compare(req.body.password, currentProfile.password)
        .then(function(result) {
          if (result == true) {
            User.find({ profile: currentProfile }).then(user => {
              const token = jwt.sign(
                { _id: user[0]._id },
                process.env.TOKEN_SECRET
              );
              res.header("auth-token", token);
              // front end can access this to check whether user logged in or not

              res.send(token);
            });
          } else {
            res.status(401).send("Wrong password");
          }
        });
    } catch {
      res.status(500).send();
    }
  });
});

//add new profile
router.route("/add").post((req, res) => {
  const name = req.body.name;
  const phoneNumber = req.body.phoneNumber;
  const email = req.body.email;
  const country = req.body.country;
  const cleanPassword = req.body.password;
  bcrypt.hash(cleanPassword, saltRounds).then(hashedPassword => {
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
