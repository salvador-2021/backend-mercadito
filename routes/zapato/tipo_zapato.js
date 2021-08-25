'use strict'
const express = require('express');
const tipoZapatoController = require('../../controllers/zapato/tipo_zapato');
const verificarTokenUser = require('../../middlewares/auth_user');

var router = express.Router();

//Rutas
router.post('/save-data', verificarTokenUser , tipoZapatoController.saveTipoZapato);
router.put('/update-tipo/:_id', verificarTokenUser , tipoZapatoController.updateTipoZapato);
router.get('/get-tipo', verificarTokenUser , tipoZapatoController.searchTipoZapato);
router.get('/get-all-tipo', verificarTokenUser , tipoZapatoController.search_all_tipo_zapato);

module.exports = router;