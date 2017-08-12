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
      type: String,
      default: ""
    },
    //TODO Atualizar campos daqui pra baixo
    price: {
      type: Currency,
      required: true
    },
    featured: {
        type: Boolean,
        default:false
    },
    description: {
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
