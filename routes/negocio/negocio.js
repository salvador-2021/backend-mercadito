'use strict'
const express = require('express');
const negocioController = require('../../controllers/mycompany/negocio');
const verificarTokenNegocio = require('../../middlewares/auth_negocio');
const verificarTokenUser = require('../../middlewares/auth_user');
const router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage(
    {
        destination:function (req , file , cb){
    
            var _idNegocio = req.negocio_autentificado._id;

            var rutaDestino = './uploads/';

            rutaDestino += _idNegocio;

            cb( null , rutaDestino );
         
        },
        filename: function(req, file, cb){
            cb(null,Date.now()+"_"+file.originalname);
        }
    }
);

const upload = multer( { storage: storage } );

//CUANDO EL USUARIO ESTA LOGUEADO USARA ESTA 
router.put('/update-data', verificarTokenNegocio , negocioController.actualizarDatos);
router.get('/getDataNegocio' ,verificarTokenNegocio ,  negocioController.getDataNegocio);

router.delete('/delete_data', verificarTokenNegocio, negocioController.delete_negocio);
router.put('/update-password', verificarTokenNegocio ,negocioController.updatePassword);
router.put('/activar-negocio', verificarTokenNegocio , negocioController.activarNegocio);
router.put('/activar-negocio-admin/:_id', verificarTokenUser , negocioController.activarNegocioAdministrador);
router.get('/buscar-por-nombre/:nombre', negocioController.buscarNegocioNombre);
router.get('/cantidad-existente/:estado?' , verificarTokenUser , negocioController.cantidadNegociosExistente);
router.post('/upload-imagen',[verificarTokenNegocio , upload.single('file') ] , negocioController.uploadFileImg );
router.get('/get-img/:_nameImage' , verificarTokenNegocio , negocioController.getImageNegocio);
router.get('/logo-negocio' , verificarTokenNegocio , negocioController.logo_negocio);
/*ELIMINAR IMAGEN DEL PRODUCTO*/
router.delete('/delete-img/:nameImage' ,verificarTokenNegocio, negocioController.deleteImageNegocio);
router.get('/get_data_negocio_perfil/:_id' , negocioController.getDataNegocioForPerfil);
router.put('/inc_view/:_id' , negocioController.aumentarVistas );

router.get('/get-Linea-negocio',verificarTokenNegocio, negocioController.getLineaNegocio);

module.exports = router;
