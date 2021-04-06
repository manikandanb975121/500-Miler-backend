const mongoose = require('mongoose');

const ActivitySchema = mongoose.Schema({
    date: { type: String },
    activityId: { type: String },
    activityName: { type: String },
    km: { type: String }
});

const EventActivitySchema = mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
   eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Events' },
   activity: [ ActivitySchema ]
});

module.exports = mongoose.model('EventActivity', EventActivitySchema);