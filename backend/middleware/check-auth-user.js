const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        // console.log(token);
        const decodedToken = jwt.verify(token , 'secret_this_should_be_longer');
        req.userData = { stravaId: decodedToken.stravaId, userId: decodedToken.userId, accessToken: decodedToken.accessToken, refreshToken: decodedToken.refreshToken }
        console.log(req.userData);
        next();
    } catch (error) {
        res.status(401).json({
           message: 'Auth Failed!'
        });
    }
};