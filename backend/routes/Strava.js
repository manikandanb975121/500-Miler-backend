const express = require('express');
const axios = require('axios');
const checkAuth = require('../middleware/check-auth-user');
const router = express.Router();

const polyline = require('google-polyline');

router.get('', checkAuth, async (req, res, next) => {

    await await axios({
        method: 'get',
        url: 'https://www.strava.com/api/v3/athlete/activities',
        params: {
            access_token: req.userData.accessToken,
        }
    })
    .then((response) => {
        console.log(response);
        var activity = response.data;
        route = [];
        for(var i in activity) {
            console.log(activity[i].map.summary_polyline);
            route.push(polyline.decode(activity[i].map.summary_polyline))
            activity[i].route = polyline.decode(activity[i].map.summary_polyline);
        }
        res.status(200)
            .json({
                message: 'Strava Activity Fetched Successfully',
                result: activity,
                route: route
            });
    });

});


router.get('/:id', checkAuth, async (req, res, next) => {

    await await axios({
        method: 'get',
        url: `https://www.strava.com/api/v3/activities/${req.params.id}`,
        params: {
            access_token: req.userData.accessToken,
        }
    })
    .then((response) => {
        console.log(response);
        var activity = response.data;
        activity.route = polyline.decode(activity.map.summary_polyline);
        route = activity.route;
        // for(var i in activity) {
        //     console.log(activity[i].map.summary_polyline);
        //     route.push(polyline.decode(activity[i].map.summary_polyline))
        //     activity[i].route = polyline.decode(activity[i].map.summary_polyline);
        // }
        res.status(200)
            .json({
                message: `${ response.data.name}'s Activity Fetched Successfully`,
                result: activity,
                route: route
            });
    });

});

module.exports = router;