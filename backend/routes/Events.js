const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const Events = require('../models/Event');

router.post('', checkAuth, (req, res, next) => {

    console.log(req.userData);

    const events = new Events({
        event_name: req.body.event_name,
        event_start_date: req.body.event_start_date,
        event_end_date: req.body.event_end_date,
        event_descriptions: req.body.event_descriptions,
        event_amount: req.body.event_amount,
        event_registration_close_date: req.body.event_registration_close_date,
        event_target_km: req.body.event_target_km,
        // event_participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],
        event_title_image: req.body.event_title_image,
        event_coordinator: req.userData.userId,
        event_days: req.body.event_days,
        event_status: 'Not Yet Started',
        // event_images: [ { type: string } ]
    })

    events.save()
        .then(event => {
            res.status(200)
                .json({
                    message: 'Event Created Successfully',
                    result: events
                });
        });

});


router.get('', checkAuth, (req, res, next) =>{

    Events.find()
        .then((events) => {
            res.status(200)
                .json({
                    message: 'Events Fetched Successfully',
                    result: events.reverse()
                });
        });
});


router.get('/:id', checkAuth, (req, res, next) => {
    Events.findById(req.params.id)
        .populate('event_coordinator')
        .then((events) => {
            res.status(200)
                .json({
                    message: `${ events.event_name } fetched Successfully`,
                    result: events
                });
        });
});


router.delete('/:id', checkAuth, (req, res, next) => {
    Events.deleteOne({ _id: req.params.id})
        .then((result) => {
            res.status(200)
                .json({
                    message: 'Event Deleted Successfully',
                    result: result
                })
        })
});




module.exports = router;