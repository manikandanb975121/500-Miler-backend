const express = require('express');
const { restart } = require('nodemon');
// const checkAuthUser = require('../middleware/check-auth-user');
const router = express.Router();
const axios = require('axios');
const polyline = require('google-polyline');

const checkAuth = require('../middleware/check-auth-user');

const Events = require('../models/Event');
const EventActivity = require('../models/EventActivity');


stravaActivity = async (stravaId, accessToken) => {
    // var activity;
    await axios({
        method: 'get',
        url: `https://www.strava.com/api/v3/activities/${stravaId}`,
        params: {
            access_token: accessToken,
        }
    })
    .then((response) => {
        // console.log(response.data);
        var activity = response.data;
        activity.route = polyline.decode(activity.map.summary_polyline);
        route = activity.route;
        return activity;
        // userEvent.event_participants[i].activity.activity[j].stravaActivity = 'Hello'
    });

}


router.get('', checkAuth, (req, res, next) =>{

    Events.find({event_status: 'Not Yet Started'})
        .lean()
        .then((events) => {
            var userEvents = events; 
            for(var i in userEvents) {
                if (userEvents[i].event_participants.length > 0) {
                    console.log(userEvents[i].event_name);
                    console.log(userEvents[i].event_participants);
                    for (var j in userEvents[i].event_participants) {
                        // console.log(userEvents[i].event_participants);
                        if ((userEvents[i].event_participants[j].user).toString() === req.userData.userId) {
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
            res.status(200)
                .json({
                    message: 'Events Fetched Successfully',
                    result: userEvents.reverse(),
                });
        });
});

router.get('/:id', checkAuth, async (req, res, next) => {

    Events.findById(req.params.id)
        .lean()
        .populate('event_coordinator')
        .populate({
            path: 'event_participants',
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
        .then((events) => {
            var userEvent = events;
            userEvent.isRegisterd = false;

            for (var i in userEvent.event_participants) {
                if ((userEvent.event_participants[i].user._id).toString() === req.userData.userId) {
                    userEvent.isRegisterd = true;
                }
            }

            
            res.status(200)
                .json({
                    message: `${ events.event_name } fetched Successfullys`,
                    result: userEvent,
                    //stravaIds: stravaId
                });
        });
});


router.post('/register', checkAuth, (req, res, next) => {

    const eventActivity = new EventActivity({
        user: req.userData.userId,
        eventId: req.body.eventId
    })

    eventActivity.save()
        .then((result) => {
            Events.findById(req.body.eventId)
                .then((events) => {
                    events.event_participants.push(
                        {
                            user: req.userData.userId,
                            activity: result._id
                        }
                    )

                    events.save()
                        .then(() => {
                            res.status(200)
                                .json({
                                    message: 'Event Registered',
                                    result: result
                                });
                        })
                })
    });
});




module.exports = router;