'use strict'
const express = require('express');
const tipoServicioController = require('../../controllers/servicio/tipo_servicio');
const verificarTokenUser = require('../../middlewares/auth_user');

var router = express.Router();

//Rutas
router.post('/save-data', verificarTokenUser , tipoServicioController.saveData);
router.put('/update-servicio/:_id', verificarTokenUser , tipoServicioController.updateTipoServicio);
router.get('/get-tipo-servicio-name', verificarTokenUser , tipoServicioController.searchTipoServicio);
router.get('/get-all-tipo-servicio', verificarTokenUser , tipoServicioController.search_all_tipo_servicio);

module.exports = router;