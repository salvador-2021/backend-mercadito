'use strict'
var express = require('express');
var UsuarioController = require('../controllers/usuario');
const verificarTokenUser = require('../middlewares/auth_user');
var router = express.Router();

//Rutass
router.post('/save-data', UsuarioController.crear_usuario );
router.get('/get-data', verificarTokenUser, UsuarioController.getDataUser );
router.get('/get-name-user/:_id', UsuarioController.getNameUser );
router.put('/update-data',verificarTokenUser , UsuarioController.update_usuario);
router.put('/update-password',verificarTokenUser, UsuarioController.updatePassword );
router.delete('/delete-datos/:_id', UsuarioController.delete_user );
router.get('/cantidad-existente/:estado?', UsuarioController.cantidadUsuariosExistente)
router.get('/all-users/:estado?', UsuarioController.getUsuarios);
router.get('/existeAdmin',UsuarioController.existeUserAdmin);


module.exports = router; 