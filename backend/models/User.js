const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    mail_id: { type: String, required: false, unique: false},
    phone_number: { type: String },
    dob: { type: String },
    access_token: { type: String },
    refresh_token: { type: String },
    strava_id: { type: String },
    profile_image: { type: String}
});


module.exports = mongoose.model('Users', UserSchema);