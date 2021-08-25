'use strict'
const express = require('express');
const negocioController = require('../../controllers/mycompany/negocio');
const router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage(
    {
        destination:function (req , file , cb){
    
            var _idNegocio = req.params._id;

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

//Rutas
//CUANDO EL USUARIO NO ESTA LOGUEADO USARA ESTAS RUTAS
router.post('/save-data', negocioController.guardarDatos);
router.get('/getAnyDataNegocio/:_id' , negocioController.getAnyDataNegocio);
//router.get('/get_data_negocio_perfil/:_id' , negocioController.getDataNegocioForPerfil);
router.get('/all-negocios/:estado?',  negocioController.getNegocios);
router.delete('/delete-any-img/:_id/:nameImage' , negocioController.deleteImageAnyNegocio)
router.put('/update-data-any-negocio/:_id',  negocioController.actualizarDatosAnyNegocio);
router.post('/subida-imagen/:_id', upload.single('file')  , negocioController.subidaImg );
router.get('/get-img/:_id/:_nameImage' , negocioController.getAnyNegocioImage);
router.get('/get-list-name-negocios' , negocioController.getListNameNegocio);
router.put('/update-Linea-negocio/:_id', negocioController.updateLineaNegocio);

module.exports = router;
