var express = require('express');
var bodyParser = require('body-parser');
var uploadS3 = require('../integration/uploadS3');
var expressJwt = require('express-jwt');
var Membros = require('../models/membros');
var membroRouter = express.Router();

var authenticate = expressJwt({
  secret: process.env.JWT_SECRET,
  requestProperty: 'auth',
  getToken: function (req) {
    if (req.headers['x-auth-token']) {
      return req.headers['x-auth-token'];
    }
    return null;
  }
});

membroRouter.use(bodyParser.json());

membroRouter.route('/').
  get(authenticate, function (req, res, next) {
    //somente os administradores estão autorizados a resuperar a lista de membros
    if (req.auth.admin) {
      Membros.find(req.query, function (err, membros) {
        if (err) return next(err);
        res.json(membros);
      });
    } else {
      var err = new Error('You are not authorized to access this resource');
      err.status = 403;
      return next(err);
    }
  })

  /* .post(function (req, res, next) {
    
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
  }); */

membroRouter.route('/:membroId').
  get(authenticate, function (req, res, next) {

    // somente o próprio usuário ou um usuário administrador estão autorizados a alterar seus dados
    if ((req.auth.id !== req.params.membroId) && (!req.auth.admin)){
      var err = new Error('You are not authorized to access this resource');
      err.status = 403;
      return next(err);
    }

    Membros.findOne({ 'id': req.params.membroId }, function (err, membro) {
      if (err) return next(err);

      if (membro === null) {
        var erro = new Error('Not Found');
        erro.status = 404;
        return next(erro);
      }
      
      res.json(membro);
    });
  })
  .put(authenticate, function (req, res, next) {
    
    // somente o próprio usuário está autorizado a alterar seus dados
    if (req.auth.id !== req.params.membroId){
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

        Membros.findOneAndUpdate({ 'id': req.params.membroId }, { $set: membro }, { new: true }, function (err, membroAtualizado) {
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
      Membros.findOneAndUpdate({ 'id': req.params.membroId }, { $set: membro }, { new: true }, function (err, membroAtualizado) {
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
