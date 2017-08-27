var express = require('express');
var bodyParser = require('body-parser');

var Membros = require('../models/membros');
var membroRouter = express.Router();
membroRouter.use(bodyParser.json());

membroRouter.route('/').
  get(function (req, res, next) {
    Membros.find(function (err, membros) {
      if (err) next(err);
      res.json(membros);
    });
  })
  
  .post(function (req, res, next) {
    Membros.create(req.body, function (err, membro) {
        if (err) next(err);
        console.log('Membro criado!');
        res.json(membro);
    });
});

membroRouter.route('/:membroId').
get(function (req, res, next) {
  // Membros.findById(req.params.membroId, function (err, membro) {
    Membros.findOne({'id':req.params.membroId}, function (err, membro) {
    if (err) next(err);
    console.log('Membro encontrado');
    res.json(membro);
  });
});

module.exports = membroRouter;
