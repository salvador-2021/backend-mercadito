'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tipoZapatoSchema = Schema({
    tipo : String
});

module.exports = mongoose.model('tipo_zapato', tipoZapatoSchema );