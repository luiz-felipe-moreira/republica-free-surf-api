var express = require('express');
var bodyParser = require('body-parser');
var uploadS3 = require('../integration/uploadS3');
var Membros = require('../models/membros');
var security = require('./security');
var membroRouter = express.Router();

membroRouter.use(bodyParser.json());

membroRouter.route('/')
  .get(security.authenticate, security.verifyAdmin, function (req, res, next) {
    Membros.find(req.query, function (err, membros) {
      if (err) return next(err);
      res.json(membros);
    });
  })

  .post(security.authenticate, function (req, res, next) {

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

membroRouter.route('/:membroId')
  .get(security.authenticate, function (req, res, next) {

    // somente o próprio usuário ou um usuário administrador estão autorizados a alterar seus dados
    if ((req.auth.id !== req.params.membroId) && (!req.auth.admin)) {
      var err = new Error('You are not authorized to access this resource');
      err.status = 403;
      return next(err);
    }

    Membros.findOne({
      'id': req.params.membroId
    }, function (err, membro) {
      if (err) return next(err);

      if (membro === null) {
        var erro = new Error('Not Found');
        erro.status = 404;
        return next(erro);
      }

      res.json(membro);
    });
  })

  .put(security.authenticate, function (req, res, next) {

    // somente o próprio usuário está autorizado a alterar seus dados
    if (req.auth.id !== req.params.membroId) {
      var err = new Error('You are not authorized to access this resource');
      err.status = 403;
      return next(err);
    }

    var membro = req.body;

    if (membro.fotoFacebook) {

      console.log('URL da foto: ' + membro.urlFoto);

      membro.urlFoto = uploadS3.salvarFotoFacebookNoBucketS3(req.params.membroId, membro.urlFoto, function (error, response) {
        if (error) next(error);
        membro.urlFoto = response;
        console.log('URL retornada pelo AWS: ' + membro.urlFoto);

        Membros.findOneAndUpdate({
          'id': req.params.membroId
        }, {
          $set: membro
        }, {
          new: true
        }, function (err, membroAtualizado) {
          if (err) return next(err);
          if (membroAtualizado === null) {
            var erro = new Error('Not Found');
            erro.status = 404;
            return next(erro);
          }
          console.log('Membro atualizado!');
          res.json(membroAtualizado);
        });
      });
    } else {
      Membros.findOneAndUpdate({
        'id': req.params.membroId
      }, {
        $set: membro
      }, {
        new: true
      }, function (err, membroAtualizado) {
        if (err) return next(err);
        if (membroAtualizado === null) {
          var erro = new Error('Not Found');
          erro.status = 404;
          return next(erro);
        }
        console.log('Membro atualizado!');
        res.json(membroAtualizado);
      });
    }
  });

module.exports = membroRouter;