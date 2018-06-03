var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var loginRouter = express.Router();

var createToken = function (auth) {
  return jwt.sign({
    id: auth.id,
    aprovado: auth.aprovado,
    admin: auth.admin
  },
    process.env.JWT_SECRET,
    {
      expiresIn: 60 * 120
    });
};

loginRouter.route('/').
  post(passport.authenticate('facebook-token', { session: false }), function (req, res, next) {
   
    if (!req.user) {
      return res.send(401, 'User Not Authenticated');
    }

    req.auth = {
      id: req.user.id,
      aprovado: req.user.aprovado,
      admin: req.user.admin
    };

    req.auth.token = createToken(req.auth);

    res.status(200).send(req.auth);
  });

module.exports = loginRouter;