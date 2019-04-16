
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
const S3_BUCKET_REGION = process.env.S3_REGION;
AWS.config.update({ region: S3_BUCKET_REGION });

// Create S3 service object
s3 = new AWS.S3({ apiVersion: '2006-03-01' });

const S3_BUCKET_NAME = (process.env.S3_BUCKET);
// call S3 to retrieve upload file to specified bucket
var uploadParams = { Bucket: S3_BUCKET_NAME, Key: '', Body: '' };

var request = require('request').defaults({ encoding: null });

// let urlFotoFacebook = 'https://scontent.xx.fbcdn.net/v/t1.0-1/p480x480/15179124_1166060816805763_6689092811824921723_n.jpg?oh=44a4128ca55387816c62f09275276ce4&oe=5AC1E969';

var urlFotoS3 = '';

exports.salvarFotoFacebookNoBucketS3 = function (facebookId, urlFotoFacebook, callBackFunction) {

    request(urlFotoFacebook, function (error, response, body) {

        if (error || response.statusCode !== 200) {
            console.log("Falha ao baixar a foto do usuário do facebook", error);
            callBackFunction(error,null);
        } else {

            uploadParams.Body = body;
            uploadParams.Key = facebookId + '.jpg';
            // call S3 to retrieve upload file to specified bucket
            s3.upload(uploadParams, function (err, data) {
                if (err) {
                    console.log("Erro ao fazer o upload da foto para o S3", err);
                    callBackFunction(err,null);
                } if (data) {
                    console.log("Upload para o S3 realizado com sucesso", data.Location);
                    urlFotoS3 = data.Location;
                    console.log('Valor de urlFotosS3: ' + urlFotoS3);
                    callBackFunction(null,urlFotoS3);
                }
            });
        }

    });
};

// exports.urlFoto = urlFotoS3;