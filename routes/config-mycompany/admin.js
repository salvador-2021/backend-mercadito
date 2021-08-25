'use strict'
const express = require('express');
const companyController = require('../../controllers/mycompany/admin');
//FALTA AUNTENFICAR EL ADMINISTRADOR
const verificarTokenAdmin = require('../../middlewares/auth_user');

var router = express.Router();

//Rutas
router.delete('/delete-negocio/:_id', verificarTokenAdmin, companyController.delete_negocio);
router.get('/get-list-negocio/:_estado', verificarTokenAdmin, companyController.getListNegocio);
router.put('/update-status-negocio/:_id', verificarTokenAdmin, companyController.updateStatusNegocio);
router.put('/update-pago-mes-negocio',verificarTokenAdmin, companyController.updatePagoMesNegocio);
router.delete('/delete-file_negocio/:_id', verificarTokenAdmin, companyController.delete_file_negocio);

router.get('/get-list-usuario/:_estado', verificarTokenAdmin, companyController.getListUsuario);
router.delete('/delete-usuario/:_id', verificarTokenAdmin, companyController.delete_usuario);
router.put('/update-status-usuario/:_id', verificarTokenAdmin, companyController.updateStatusUsuario);

module.exports = router;