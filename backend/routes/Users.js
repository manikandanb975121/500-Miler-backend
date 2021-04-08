const express = require('express');
const router = express.Router();
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../models/User');

axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

router.post('', async (req, res, next) => {

    let fetchUser;
    await await axios({
        method: 'post',
        url: 'https://www.strava.com/oauth/token',
        params: {
            client_id: 52278,
            client_secret: 'f2d92f7198e933dddcb875517079fe865659b804',
            code: req.body.code,
            grant_type: 'authorization_code'
        }
    })
    .then((response) => {
        console.log('Responseeeeeee');
        console.log(response.data);

        Users.findOne({ strava_id: response.data.athlete.id})
            .then((user) => {

                console.log('Userssssss:')
                console.log(user);

                if (!user) {
                    // return res.status(401)
                    //   .json({
                    //     message: 'Auth Faild !'
                    //   })


                    const user = new Users({
                        first_name: response.data.athlete.firstname,
                        last_name: response.data.athlete.lastname,
                        access_token: response.data.access_token,
                        refresh_token: response.data.refresh_token,
                        profile_image: response.data.athlete.profile_medium,
                        strava_id: response.data.athlete.id,
                        mail_id: 'harivignesh261998@gmail.com',
                        phone_number: '',
                        dob: '',
                    });
            
                     user.save()
                        .then((newUser) => {
                            console.log('fetch User from new User');
                            fetchUser = newUser;
                            console.log(fetchUser);
                            // res.status(200)
                            // .json({
                            //     message: 'Response',
                            //     result: response.data
                            // });

                            const token = jwt.sign(
                                { stravaId: fetchUser.strava_id, userId: fetchUser._id, 
                                  accessToken: fetchUser.access_token, refreshToken: fetchUser.refresh_token},
                                'secret_this_should_be_longer',
                                { expiresIn: '1h'}
                              );
                            
                              res.status(200).json({
                                  message: 'New User',
                                token: token,
                                expiresIn: 3600,
                                userId: fetchUser._id,
                                // role: fetchUser.user_type,
                                image: fetchUser.profile_image
                              });

                        });
                  }
                  fetchUser = user;
                  Users.updateMany({_id: fetchUser._id},
                    {$set: {
                      'access_token': response.data.access_token,
                      'refresh_token': response.data.refresh_token
                    }}).then(() => {
                      console.log('Updated Successfully');
                    })
                  console.log('fetchUser');
                  console.log(fetchUser);
                  return true;
            })
            .then((result) => {

                console.log('Result');
                console.log(result);

                if (!result) {
                  return res.status(401).json({
                    message: 'User Not Found'
                  });
                }

                const token = jwt.sign(
                    { stravaId: fetchUser.strava_id, userId: fetchUser._id, 
                      accessToken: response.data.access_token, refreshToken: response.data.refresh_token},
                    'secret_this_should_be_longer',
                    { expiresIn: '1h'}
                  );
                
                  res.status(200).json({
                      message: 'Exsisting User',
                    token: token,
                    expiresIn: 3600,
                    userId: fetchUser._id,
                    // role: fetchUser.user_type,
                    image: fetchUser.profile_image
                  });
            })
            .catch(() => {

                // const user = new Users({
                //     first_name: response.data.athlete.firstname,
                //     last_name: response.data.athlete.lastname,
                //     access_token: response.data.access_token,
                //     refresh_token: response.data.refresh_token,
                //     profile_image: response.data.athlete.profile_medium,
                //     strava_id: response.data.athlete.id
                // });
        
                // user.save()
                //     .then(() => {
                //         res.status(200)
                //         .json({
                //             message: 'Response',
                //             result: response.data
                //         });
                //     });
            });
    })
    .catch(e => {
        console.log(e);
    });

    // await axios.post('https://www.strava.com/oauth/token',
    // {
    //     params: {
    //         client_id: 52278,
    //         client_secret: 'f2d92f7198e933dddcb875517079fe865659b804',
    //         code: '9dec389c75635b3eb989e9e66046b27bdf762b83',
    //         grant_type: 'authorization_code'
    //     }
    // })
    // .then((response) => {
    //     console.log(response);
    // });

});

module.exports = router;