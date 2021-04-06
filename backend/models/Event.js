const mongoose = require('mongoose');

const ParticipantsSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    activity:    { type: mongoose.Schema.Types.ObjectId, ref: 'EventActivity' }
});



const EventSchema = mongoose.Schema({
    event_name: { type: String, required: true, unique: true },
    event_start_date: { type: String, require: true },
    event_end_date: { type: String, required: true },
    event_descriptions: { type: String, required: true },
    event_amount: { type: String, required: true },
    event_registration_close_date: { type: String, required: true },
    event_target_km: { type: String, required: true },
    event_participants: [ ParticipantsSchema ],
    event_title_image: { type: String, required: true },
    event_coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin'},
    event_days: { type: String, required: true },
    event_status: { type: String, required: true },
    event_images: [ { type: String } ]
});

module.exports = mongoose.model('Events', EventSchema);