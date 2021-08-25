'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var marca_zapato = Schema({
    marca : String
});

module.exports = mongoose.model('marca_zapato', marca_zapato);