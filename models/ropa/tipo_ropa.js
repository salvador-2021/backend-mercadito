'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tipo_ropa = Schema({
    tipo : String
});

module.exports = mongoose.model('tipo_ropa', tipo_ropa);