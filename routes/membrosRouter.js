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
    })
  })
  
  .post(function (req, res, next) {
    Membros.create(req.body, function (err, membro) {
        if (err) next(err);
        console.log('Membro criado!');
        res.json(membro);
        // var nome = membro.nome;
        // res.writeHead(200, {
        //     'Content-Type': 'text/plain'
        // });

        // res.end('Adicionado membro: ' + nome);
    });
});

module.exports = membroRouter;
