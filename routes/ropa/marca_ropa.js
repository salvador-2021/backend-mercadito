'use strict'
const express = require('express');
const marcaRopaController = require('../../controllers/ropa/marca_ropa');
const verificarTokenUser = require('../../middlewares/auth_user');

var router = express.Router();

//Rutas
router.post('/save-data', verificarTokenUser ,marcaRopaController.saveMarca);
router.put('/update-marca/:_id', verificarTokenUser ,marcaRopaController.updateMarca);
router.get('/get-marca-name', verificarTokenUser , marcaRopaController.searchMarca);
router.get('/get-all-marca', verificarTokenUser , marcaRopaController.search_all_marca);

module.exports = router;