const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth-user');
const EventActivity = require('../models/EventActivity');
const Events = require('../models/Event');

router.get('/:id', checkAuth, (req, res, next) => {

    const stravaId = req.params.id;
    var activity = [];
    var count = 0;
    EventActivity.find({ user: req.userData.userId})
        .populate('eventId')
        .then((result) => {

            for(var i in result) {
                for(var j in result[i].activity) {
                    console.log(result[i].activity[j].activityId)
                    if (result[i].activity[j].activityId !== stravaId) {
                        count = count + 1;
                    }
                }
                console.log(count);
                console.log(result[i].activity.length);
                if (count === result[i].activity.length) {
                    activity.push(result[i]);
                }
                count = 0;
            }

            res.status(200)
            .json({
                message: 'Fetched',
                result: activity
            });
        })
});


router.post('', checkAuth, (req, res, next) => {
    EventActivity.findById(req.body.id)
        .then((events) => {
            console.log(events);
            events.activity.push({
                date: req.body.date,
                activityId: req.body.activityId,
                activityName: req.body.activityName,
                km: req.body.km
            });
            events.save()
                .then((activity) => {
                    res.status(200)
                        .json({
                            message: 'Activity Add to Event successfully',
                            result: activity
                        });
                });
        });
});


router.get('/dashboard/events', checkAuth, (req, res, next) =>{

    console.log('dashboard');

    Events.find({event_status: 'Not Yet Started'})
        .populate('event_coordinator')
        .populate({
            path: 'event_participants',
            // populate: 'user activity',
            // populate: 'activity'
            // populate: {
            //     path: 'activity',
            //     populate: {
            //         path: 'user',
            //         model: 'Users'
            //     }
            //     // model: 'EventActivity'
            // }
            populate: [
                {
                    path: 'user'
                },
                {
                    path: 'activity',
                    populate: {
                        path: 'user'
                    }
                }
            ]
        })
        .lean()
        .then((events) => {
            console.log(events);
            var userEvents = events;
            var registeredEvents = [];
            for(var i in userEvents) {
                if (userEvents[i].event_participants.length > 0) {
                    for (var j in userEvents[i].event_participants) {
                        console.log(userEvents[i].event_participants);
                        if ((userEvents[i].event_participants[j].user._id).toString() === req.userData.userId) {
                            userEvents[i].isRegisterd = true;
                            break;
                        } else {
                            userEvents[i].isRegisterd = false;   
                        }
                    }
                } else {
                    userEvents[i].isRegisterd = false;   
                }
            }

            for(var i in userEvents) {
                if (userEvents[i].isRegisterd) {
                    registeredEvents.push(userEvents[i]);
                }
            }
            res.status(200)
                .json({
                    message: 'Registered Events Fetched Successfully',
                    result: registeredEvents.reverse(),
                });
        });
});


module.exports = router;