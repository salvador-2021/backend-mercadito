'use strict'
const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentario');
//const verificarTokenNegocio= require('../middlewares/auth_user');
const verificarTokenNegocio = require('../middlewares/auth_negocio');

//Rutas
router.post('/save-data/:_idnegocio/:_idproducto', verificarTokenNegocio , comentarioController.saveComentario);

module.exports = router;