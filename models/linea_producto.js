'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var linea_producto = Schema({
    linea : String
});

module.exports = mongoose.model('linea_producto', linea_producto);