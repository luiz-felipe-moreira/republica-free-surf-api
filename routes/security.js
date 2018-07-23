var expressJwt = require('express-jwt');

var authenticationRequired = (process.env.NODE_ENV === 'development' ? false : true);

exports.authenticate = expressJwt({
    secret: process.env.JWT_SECRET,
    requestProperty: 'auth',
    credentialsRequired: authenticationRequired,
    getToken: function (req) {
        if (req.headers['x-auth-token']) {
            return req.headers['x-auth-token'];
        }
        return null;
    }
});

exports.verifyAdmin = function (req, res, next) {

    if (authenticationRequired && ((req.auth === undefined) || (!req.auth.admin))) {
        var err = new Error('You are not authorized to access this resource');
        err.status = 403;
        return next(err);
    } else {
        next();
    }
};