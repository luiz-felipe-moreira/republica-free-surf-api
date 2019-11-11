const Agenda = require('agenda');
const Membro = require('../models/membros');
const mongoose = require('mongoose');


const agenda = new Agenda({ db: { address: process.env.MONGODB_URI } });

agenda.define('alerta pendencia aprovacao', (job, done) => {
    Membro.find({}, function (err, membros) {
        if (err) {
            console.log('Ocorreu um erro na execução do job alerta pendencia aprovacao');
        } else {
            const membrosParaAprovar = membros.filter(function (membro) {
                return (membro.status == 'Aprovação pendente');
            });
            console.log('Quantidade de membros pendentes de aprovação: ' + membrosParaAprovar.length);
        }
        done();
    });
});

(async function () { // IIFE to give access to async/await

    mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("Connected correctly to database server");
    });

    await agenda.start();

    await agenda.every('2 minutes', 'alerta pendencia aprovacao');

})();