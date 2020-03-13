const router = require('express').Router();
let Profile = require('../models/profile.model');

router.route('/').get((req, res) => {
    Profile.find()
        .then(profiles => res.json(profiles))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) =>{
    const name = req.body.name;
    const phoneNumber = req.body.phone;
    const email = req.body.email;
    const country = req.body.country;
    const password = req.body.password;     // hashed later (?)

    const newProfile = new Profile({name, phoneNumber, email, country, password})

    newProfile.save()
        .then(() => res.json('New Profile added !'))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;