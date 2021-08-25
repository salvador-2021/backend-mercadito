'use strict'
const express = require('express');
const pagosController = require('../../controllers/pagos/pago_negocio');
const verificarTokenNegocio = require('../../middlewares/auth_negocio');

var router = express.Router();

//Rutas
/*GUARDAR PAGO*/
router.post('/guardar-pago' , verificarTokenNegocio , pagosController.savePago);

module.exports = router;
