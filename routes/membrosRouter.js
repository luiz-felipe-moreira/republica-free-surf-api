var express = require('express');

var Membros = require('../models/membros');
var membroRouter = express.Router();

membroRouter.route('/').
  get(function (req, res, next) {
    Membros.find(function (err, membros) {
      if (err) next(err);
      res.json(membros);
    })
  });

module.exports = membroRouter;
