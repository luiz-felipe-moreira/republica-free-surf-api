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
        required: function () { return this.registrado; }
    },
    apelido: {
        type: String
    },
    telefoneCelular: {
        type: String,
        required: function () { return this.registrado; }
    },
    telefoneFixo: {
        type: String
    },
    numeroIdentidade: {
        type: String,
        required: function () { return this.registrado; }
    },
    orgaoEmissorIdentidade: {
        type: String,
        required: function () { return this.registrado; }
    },
    dataNascimento: {
        type: Date,
        required: function () { return this.registrado; }
    },
    sexo: {
        type: String,
        required: function () { return this.registrado; }
    },
    grupoSanguineo: {
        type: String,
        required: function () { return this.registrado; }
    },
    fatorRH: {
        type: String,
        required: function () { return this.registrado; }
    },
    alergias: {
        type: String
    },
    problemasSaude: {
        type: String
    },
    nomeContatoEmergencia: {
        type: String,
        required: function () { return this.registrado; }
    },
    telefoneContatoEmergencia: {
        type: String,
        required: function () { return this.registrado; }
    },
    nivel: {
        type: String,
        required: function () { return this.registrado; }
    },

    tiposPrancha: [String],

    anoComecoSurfe: {
        type: Number,
        required: function () { return this.registrado; }
    },
    praia: {
        type: String,
        required: function () { return this.registrado; }
    },
    urlFoto: {
        type: String,
        required: function () { return this.registrado; }
    },
    fotoFacebook: {
        type: Boolean,
        required: function () { return this.registrado; }
    },
    registrado: {
        type: Boolean,
        default: false
    },
    aprovado: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'Cadastro pendente'
    }
}, {
        timestamps: true
    });

var Membros = mongoose.model('Membro', membroSchema);

module.exports = Membros;
