'use strict'

const express = require('express');
const PerfilController = require('../controllers/perfil');
const verificarTokenNegocio = require('../middlewares/auth_negocio');

const router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage(
    {
        destination:function (req , file , cb){
            try {
                if (typeof req.negocio_autentificado._id === 'undefined') {
                    return res.status(400).send({
                        status: "error",
                        message: "Usuario no identificado"
                    });
    
                }
            } catch (error) {
                return res.status(400).send({
                    status: "error",
                    message: "Usuario no identificadod"
                });
            }
    
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


/*GUARDA O ACTUALIZA LOS DATOS DEL PERFIL DEL NEGOCIO QUE ESTA EN SESION */
router.post('/save-data',verificarTokenNegocio, PerfilController.save_update_data);
/*RECUPERAR DATOS*/
router.get('/get-data',verificarTokenNegocio, PerfilController.get_data);
/*ELIMINAR DATOS*/
router.delete('/delete-data', verificarTokenNegocio,PerfilController.delete_data);
/*SUBIDA DE LA IMAGEN */
router.post('/upload-imagen',[verificarTokenNegocio , upload.single('file') ] , PerfilController.uploadFileImg);
/*OBTENER IMAGEN POR NOMBRE*/
router.delete('/delete-imagen/:imageName' ,verificarTokenNegocio, PerfilController.deleteImage);
/*OBTENER IMAGEN POR NOMBRE*/
router.get('/get-img/:nameImage' ,verificarTokenNegocio, PerfilController.getImage);

module.exports = router;