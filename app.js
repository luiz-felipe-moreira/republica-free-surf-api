var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');
var mongoose = require('mongoose');
var aws = require('aws-sdk');
var normalizePort = require('normalize-port');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected correctly to database server");
});

var membrosRouter = require('./routes/membrosRouter');
var meRouter = require('./routes/meRouter');
var loginRouter = require('./routes/loginRouter');

var app = express();

//caso a aplicação esteja sendo iniciado usando o node-foreman, essa configuração de porta é ignorada, pois ele usa sempre a porta 5000
/* var port = normalizePort(process.env.PORT || '5000');
app.set('port', port); */

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// enable cors
var corsOption = {
  //TODO essa configuração deve ser modificada para produção, pois origin true permite acesso de qualquer origem
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

var FacebookTokenStrategy = require('passport-facebook-token');
var Membros = require('./models/membros');

passport.use(new FacebookTokenStrategy({
  clientID: (process.env.FACEBOOK_APP_ID),
  clientSecret: (process.env.FACEBOOK_APP_SECRET)
},
  function (accessToken, refreshToken, profile, done) {
    Membros.findOne({ 'id': profile.id }, function (err, membro) {
      if (membro === null) {

        console.log('Membro não encontrado na autenticação. Criando novo membro...');

        var novoMembro = {
          id: profile.id,
          email: profile.emails[0].value,
          registrado: false
        };

        Membros.create(novoMembro, function (error, savedUser) {
          if (error) {
            console.log(error);
          }
          return done(error, savedUser);
        });
      } else {
        console.log('Membro encontrado na autenticação');
        return done(err, membro);
      }
    });
  }));

app.use('/login', loginRouter);
app.use('/me', meRouter);
app.use('/membros', membrosRouter);

aws.config.region = process.env.S3_REGION;
const S3_BUCKET = (process.env.S3_BUCKET);
app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['nomeArquivo'];
  const fileType = req.query['tipoArquivo'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    ContentType: fileType,
    ACL: 'private'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    if (err.name == 'ValidationError') {
      //se for erro de validação disparado pelo mongoose
      err.status = 400;
    } else if (err.oauthError) {
      // se for erro disparado pelo passport-facebook-token na consulta ao Facebook para autenticacao
      err.status = err.oauthError.statusCode
    }
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}


// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {

  if (err.name == 'ValidationError') {
    // se for erro de validação disparado pelo mongoose
    err.status = 400;
  } else if (err.oauthError) {
    // se for erro disparado pelo passport-facebook-token na consulta ao Facebook para autenticacao
    err.status = err.oauthError.statusCode
  }
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
