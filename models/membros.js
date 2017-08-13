var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var membroSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    nome: {
      type: String,
      required: true
    },
    apelido: {
      type: String
    },
    telefoneCelular: {
        type: String,
        required: true
    },
    telefoneFixo: {
        type: String
    },
    profissao: {
        type: String,
        required: true
    },
    dataNascimento: {
        type: Date,
        required: true
    },
    sexo: {
        type: String,
        required: true
    },
    grupoSanguineo: {
        type: String,
        required: true
    },
    fatorRH: {
        type: String,
        required: true
    },
    alergias: {
        type: String
    },
    problemasSaude: {
        type: String
    },
    nomeContatoEmergencia: {
        type: String,
        required: true
    },
    telefoneContatoEmergencia: {
        type: String,
        required: true
    },
    nivel: {
        type: String,
        required: true
    },

    tiposPrancha: [String],

    anoComecoSurfe: {
        type: Number,
        required: true
    },
    praia: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Membros = mongoose.model('Membro', membroSchema);

// make this available to our Node applications
module.exports = Membros;
