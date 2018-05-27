var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var loginRouter = express.Router();

var createToken = function(auth) {
    return jwt.sign({
      id: auth.id
    }, process.env.JWT_SECRET,
    {
      expiresIn: 60 * 120
    });
  };
  
  var generateToken = function (req, res, next) {
    req.token = createToken(req.auth);
    next();
  };
  
  var sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    res.status(200).send(req.auth);
  };

loginRouter.route('/').
    post(passport.authenticate('facebook-token', { session: false }), function (req, res, next) {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }

        // prepare token for API
        req.auth = {
            id: req.user.id
        };

        next();
    }, generateToken, sendToken);

module.exports = loginRouter;
