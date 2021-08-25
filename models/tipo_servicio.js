'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var tipoServicioSchema = Schema({
    tipo_servicio : String
});

module.exports = mongoose.model('tipo_servicio', tipoServicioSchema );