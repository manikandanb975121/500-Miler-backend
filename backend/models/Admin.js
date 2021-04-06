const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    mail_id: { type: String, required: true, unique: true},
    phoneNumber: { type: String, required: true, unique: true},
    dob: { type: String, required: false },
    isAdmin: { type: Boolean, default: true},
    isVerified: { type: Boolean, default: false },
    password: { type: String, required: true, unique: true },
    profile_image: { type: String, default: 'https://e7.pngegg.com/pngimages/352/66/png-clipart-computer-icons-login-adityaram-properties-business-business-blue-people.png'}
});


module.exports = mongoose.model('Admin', AdminSchema);