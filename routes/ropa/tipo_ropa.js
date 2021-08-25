'use strict'
const express = require('express');
const tipoRopaController = require('../../controllers/ropa/tipo_ropa');
const verificarTokenUser = require('../../middlewares/auth_user');

var router = express.Router();

//Rutas
router.post('/save-data', verificarTokenUser ,tipoRopaController.saveTipoRopa);
router.put('/update-tipo/:_id', verificarTokenUser ,tipoRopaController.updateTipoRopa);
router.get('/get-tipo', verificarTokenUser , tipoRopaController.searchTipoRopa);
router.get('/get-all-tipo', verificarTokenUser , tipoRopaController.search_all_tipo_ropa);

module.exports = router;