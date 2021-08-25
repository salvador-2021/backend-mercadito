//usado para guardar imagenes para despues mostrarla en la configuracion de cada negocio cuando se registren
'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const img_linea_negocio_Schema = Schema({
    ruta : String,
    title : String,
    description : String,
});

module.exports = mongoose.model('img-linea-negocio', img_linea_negocio_Schema);