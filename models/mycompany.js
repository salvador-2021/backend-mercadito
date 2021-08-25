'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const mycompanySchema = Schema({
    cantidad_img_abarrote : { type: Number, required: true },
    cantidad_img_ropa : { type: Number, required: true },
    cantidad_img_calzado : { type: Number, required: true }
});

module.exports = mongoose.model('mycompany', mycompanySchema);