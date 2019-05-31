var express = require('express');
var bodyParser = require('body-parser');
var uploadS3 = require('../integration/uploadS3');
var Membro = require('../models/membros');
var security = require('./security');
var membroRouter = express.Router();

membroRouter.use(bodyParser.json());

membroRouter.route('/')
  .get(security.authenticate, security.verifyAdmin, function (req, res, next) {
    Membro.find(req.query, function (err, membros) {
      if (err) return next(err);

      membros = membros.filter(function (membro){
        return (membro.status !== 'Cadastro pendente');
        });
        
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

        Membro.create(membro, function (err, membro) {
          if (err) {
            console.error('Erro na criação do membro.')
            return next(err);
          }
          console.log('Membro criado!');
          res.json(membro);
        });
      });

    } else {
      Membro.create(membro, function (err, membro) {
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
  .get(security.authenticate, security.verifyAdmin, function (req, res, next) {

    Membro.findOne({
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

  .delete(security.authenticate, security.verifyAdmin, function (req, res, next) {

    if (req.auth){
      console.log(`Usuário de id ${req.auth.id} efetuando exclusão de um membro`);
    }
    console.log(`Excluindo membro de id ${req.params.membroId}`);

    Membro.findOneAndRemove({
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

  .put(security.authenticate, security.verifyAdmin, function (req, res, next) {

    var membro = req.body;

    if (membro.fotoFacebook) {

      console.log('URL da foto: ' + membro.urlFoto);

      membro.urlFoto = uploadS3.salvarFotoFacebookNoBucketS3(req.params.membroId, membro.urlFoto, function (error, response) {
        if (error) next(error);
        membro.urlFoto = response;
        console.log('URL retornada pelo AWS: ' + membro.urlFoto);

        Membro.findOneAndUpdate({
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
      Membro.findOneAndUpdate({
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