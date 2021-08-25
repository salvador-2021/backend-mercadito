'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pagoNegocioSchema = Schema({
    nombre_cliente: { type: String, required: true },
    descripcion:{ type: String, required: true },
    _idnegocio:{type:String, required:true},
    monto:{type:Number, required:true},
    fecha: { type: Date, default: Date.now },
    id_card : { type:String , required: true}
});

module.exports = mongoose.model('pagos_negocios', pagoNegocioSchema);