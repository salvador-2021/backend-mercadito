'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var marca_ropa = Schema({
    marca : String
});

module.exports = mongoose.model('marca_ropa', marca_ropa);