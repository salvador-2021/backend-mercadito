'use strict'
const express = require('express');
const marcaZapatoController = require('../../controllers/zapato/marca_zapato');
const verificarTokenUser = require('../../middlewares/auth_user');

var router = express.Router();

//Rutas
router.post('/save-data', verificarTokenUser ,marcaZapatoController.saveMarca);
router.put('/update-marca/:_id', verificarTokenUser ,marcaZapatoController.updateMarca);
router.get('/get-marca-name', verificarTokenUser , marcaZapatoController.searchMarca);
router.get('/get-all-marca', verificarTokenUser , marcaZapatoController.search_all_marca);

module.exports = router;