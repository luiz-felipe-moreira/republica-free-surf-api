// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'sa-east-1' });

// Create S3 service object
s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// call S3 to retrieve upload file to specified bucket
var uploadParams = { Bucket: 'republica-free-surf-photos', Key: '', Body: '' };

var request = require('request').defaults({ encoding: null });

let url = 'https://scontent.xx.fbcdn.net/v/t1.0-1/p480x480/15179124_1166060816805763_6689092811824921723_n.jpg?oh=44a4128ca55387816c62f09275276ce4&oe=5AC1E969';

request(url, function (error, response, body) {

  if (error || response.statusCode !== 200) {
    console.log("Falha ao baixar a foto do usuário do facebook", error);
  } else {

    uploadParams.Body = body;
    uploadParams.Key = 'teste3.jpg';
    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        console.log("Erro ao fazer o upload da foto para o S3", err);
      } if (data) {
        console.log("Upload para o S3 realizado com sucesso", data.Location);
      }
    });
  }


});