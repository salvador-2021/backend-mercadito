'use strict'

const express = require('express');
const verificarController = require('../controllers/verificarToken');

const router = express.Router();

router.get('/verificar-Token-Negocio', verificarController.verificarToken);

module.exports = router;