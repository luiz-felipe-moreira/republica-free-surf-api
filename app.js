var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');
var mongoose = require('mongoose');
var aws = require('aws-sdk');

var config = require('./config');

mongoose.connect((process.env.MONGODB_URI || config.mongoUrl), {
  useMongoClient: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected correctly to database server");
});

var index = require('./routes/index');
var users = require('./routes/users');
var membros = require('./routes/membrosRouter');

var app = express();

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

passport.use(new FacebookTokenStrategy({
  clientID: (process.env.FACEBOOK_APP_ID || config.facebookAppId),
  clientSecret: (process.env.FACEBOOK_APP_SECRET || config.facebookAppSecret)
},
function (accessToken, refreshToken, profile, done) {
  // User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
    return done(err, user);
  // });
}));

app.use('/', index);
app.use('/users', users);
app.use('/membros', membros);

aws.config.region = 'sa-east-1';
const S3_BUCKET = (process.env.S3_BUCKET || config.s3Bucket);
app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['nomeArquivo'];
  const fileType = req.query['tipoArquivo'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    ContentType: fileType,
    ACL: 'public-read'
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
      err.status = 400;
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
    err.status = 400;
  }
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
