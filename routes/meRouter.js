var express = require('express');
var bodyParser = require('body-parser');
var uploadS3 = require('../integration/uploadS3');
var Membros = require('../models/membros');
var security = require('./security');
var meRouter = express.Router();

meRouter.use(bodyParser.json());

let checkUserID = function (req, res, next) {
  if ((req.auth === undefined) || (!req.auth.id)) {
    var err = new Error('Unable to get user id. The endpoint /me needs authentication even in development enviroment');
    err.status = 401;
    return next(err);
  } else {
    next();
  }
};

meRouter.route('/')
  .get(security.authenticate, checkUserID, function (req, res, next) {

    Membros.findOne({
      'id': req.auth.id
    }, function (err, membro) {
      if (err) return next(err);

      if (membro === null) {
        console.log('Unable to find membro ' + req.auth.id);
        var erro = new Error('Not Found');
        erro.status = 404;
        return next(erro);
      }

      res.json(membro);
    });
  })

  .put(security.authenticate, checkUserID, function (req, res, next) {

    var membro = req.body;

    if (membro.fotoFacebook) {

      console.log('URL da foto: ' + membro.urlFoto);

      membro.urlFoto = uploadS3.salvarFotoFacebookNoBucketS3(req.auth.id, membro.urlFoto, function (error, response) {
        if (error) next(error);
        membro.urlFoto = response;
        console.log('URL retornada pelo AWS: ' + membro.urlFoto);

        Membros.findOneAndUpdate({
          'id': req.auth.id
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
          res.json(membroAtualizado);
        });
      });
    } else {
      Membros.findOneAndUpdate({
        'id': req.auth.id
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
        res.json(membroAtualizado);
      });
    }
  });

module.exports = meRouter;