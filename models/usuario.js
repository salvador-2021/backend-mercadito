'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = Schema({
        nombre:  {type: String, required: true },
        correo:  {type: String, required: true } ,
        password: {type: String, required: true } ,
        tipo : { type:String, default:"usuario" },
        estado:   { type:Boolean, default:true },
        fecha:    { type:Date, default: Date.now }
    });

module.exports=mongoose.model('Usuario', usuarioSchema);


/*
        direccion:{type: String, default: null },
        telefono:{type: String, default: null },
        localidad:{type: String, default: null },
        referencia_lugar:{type: String, default: null },
*/