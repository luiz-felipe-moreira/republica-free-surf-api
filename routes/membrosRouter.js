var express = require('express');
var bodyParser = require('body-parser');
var uploadS3 = require('../integration/uploadS3');

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
    // 
    var membro = req.body;
    membro.urlFoto = uploadS3.salvarFotoFacebookNoBucketS3(membro.id, membro.urlFoto, function (error, response) {
      if (error) next(error);
      membro.urlFoto = response;
      console.log('URL retornada pelo AWS: ' + membro.urlFoto);

      // Membros.create(req.body, function (err, membro) {
      Membros.create(membro, function (err, membro) {
        if (err) next(err);
        console.log('Membro criado!');
        res.json(membro);
      });
    });
  });

membroRouter.route('/:membroId').
  get(function (req, res, next) {
    // Membros.findById(req.params.membroId, function (err, membro) {
    Membros.findOne({ 'id': req.params.membroId }, function (err, membro) {
      if (err) next(err);

      console.log('Membro: ' + membro);
      if (membro === null) {
        //TODO usar o tratamento de erro com next(erro)
        return res.status(404).json('Nao encontrado');
        // var erro = new Error('Not Found');
        // erro.status = 404;
        // next(erro);
      }
      console.log('Membro encontrado');
      res.json(membro);
    });
  });

module.exports = membroRouter;
