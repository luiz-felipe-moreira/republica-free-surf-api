var express = require('express');
var bodyParser = require('body-parser');
var uploadS3 = require('../integration/uploadS3');

var Membros = require('../models/membros');
var membroRouter = express.Router();
membroRouter.use(bodyParser.json());

membroRouter.route('/').
  get(function (req, res, next) {
    Membros.find(function (err, membros) {
      if (err) return next(err);
      res.json(membros);
    });
  })

  .post(function (req, res, next) {
    // 
    var membro = req.body;

    if (membro.fotoFacebook) {

      console.log('URL da foto: ' + membro.urlFoto);

      membro.urlFoto = uploadS3.salvarFotoFacebookNoBucketS3(membro.id, membro.urlFoto, function (error, response) {
        if (error) next(error);
        membro.urlFoto = response;
        console.log('URL retornada pelo AWS: ' + membro.urlFoto);

        Membros.create(membro, function (err, membro) {
          if (err) {
            console.error('Erro na criação do membro.')
            return next(err);
          }
          console.log('Membro criado!');
          res.json(membro);
        });
      });

    } else {
      Membros.create(membro, function (err, membro) {
        if (err) {
          console.error('Erro na criação do membro.');
          return next(err);
        }
        console.log('Membro criado!');
        res.status(201).json(membro);
      });
    }
  });

membroRouter.route('/:membroId').
  get(function (req, res, next) {
    Membros.findOne({ 'id': req.params.membroId }, function (err, membro) {
      if (err) next(err);

      console.log('Membro: ' + membro);
      if (membro === null) {
        var erro = new Error('Not Found');
        erro.status = 404;
        return next(erro);
      }
      console.log('Membro encontrado');
      res.json(membro);
    });
  });

module.exports = membroRouter;
