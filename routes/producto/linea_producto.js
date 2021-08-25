'use strict'
const express = require('express');
const LineaProductoController = require('../../controllers/producto/linea_producto');
const verificarTokenUser = require('../../middlewares/auth_user');

var router = express.Router();

//Rutas
router.post('/save-linea', verificarTokenUser ,LineaProductoController.saveLinea);
router.put('/update-linea/:_id', verificarTokenUser ,LineaProductoController.updateLinea);
router.get('/get-linea-name', verificarTokenUser , LineaProductoController.searchLinea);
router.get('/get-all-line', verificarTokenUser , LineaProductoController.search_all_linea);

module.exports = router;
