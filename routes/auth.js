'use strict'
const express = require('express');
const AuthController = require('../controllers/auth/auth');
const AuthNegocioControler = require('../controllers/auth/auth_negocio');

const router = express.Router();

//Rutas
router.post('/autentificar-usuario' ,AuthController.autentication);
router.post('/autentificar-negocio' ,AuthNegocioControler.autenticationNegocio);


module.exports = router; 