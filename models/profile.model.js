const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 4
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        minlength: 8
    },
    country: {
        type: String,
        required: true,
        trim: true,
        minlength: 4
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 4
    }
}, {
    timestamps: true,
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;