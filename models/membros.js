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
      required: this.registrado
    },
    apelido: {
      type: String
    },
    telefoneCelular: {
        type: String,
        required: this.registrado
    },
    telefoneFixo: {
        type: String
    },
    profissao: {
        type: String,
        required: this.registrado
    },
    dataNascimento: {
        type: Date,
        required: this.registrado
    },
    sexo: {
        type: String,
        required: this.registrado
    },
    grupoSanguineo: {
        type: String,
        required: this.registrado
    },
    fatorRH: {
        type: String,
        required: this.registrado
    },
    alergias: {
        type: String
    },
    problemasSaude: {
        type: String
    },
    nomeContatoEmergencia: {
        type: String,
        required: this.registrado
    },
    telefoneContatoEmergencia: {
        type: String,
        required: this.registrado
    },
    nivel: {
        type: String,
        required: this.registrado
    },

    tiposPrancha: [String],

    anoComecoSurfe: {
        type: Number,
        required: this.registrado
    },
    praia: {
        type: String,
        required: this.registrado
    },
    urlFoto: {
        type: String,
        required: this.registrado
    },
    fotoFacebook: {
        type: Boolean,
        required: this.registrado
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
    }
}, {
    timestamps: true
});

var Membros = mongoose.model('Membro', membroSchema);

module.exports = Membros;
