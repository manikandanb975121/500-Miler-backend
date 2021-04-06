const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


const app = express();


// const branch = require('./routes/Branch');
// const category = require('./routes/Category');


const admin = require('./routes/Admin');
const events = require('./routes/Events');
const users = require('./routes/Users');
const usersEvent = require('./routes/UsersEvents');
const strava = require('./routes/Strava');
const eventActivity = require('./routes/EventActivity');


mongoose.connect('mongodb+srv://manikandan:WpHQi4JPJUSc3EVb@cluster0.en3xl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
                    { useNewUrlParser: true,  useUnifiedTopology: true }
    ).then(() => {
        console.log('Connected to Database!');
    })
    .catch(() => {
        console.log('Connections Failed !');
    })

    
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

// app.use('/iconic_image', express.static(path.join('backend/iconic_image')));
// app.use('/images', express.static(path.join('backend/images')));
// app.use('/profile_pic', express.static(path.join('backend/profile_pic')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});


// app.use('/api/branch', branch);
// app.use('/api/category', category);

app.use('/api/admin', admin);
app.use('/api/events', events);
app.use('/api/users', users);
app.use('/api/usersEvent', usersEvent);
app.use('/api/strava', strava);
app.use('/api/eventActivity', eventActivity);

module.exports = app;