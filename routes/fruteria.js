'use strict'
const express = require('express');
const fruteriaController = require('../controllers/fruteria');
const verificarTokenNegocio = require('../middlewares/auth_negocio');

var router = express.Router();

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
            
            rutaDestino += _idNegocio +'/fruteria';

            cb( null , rutaDestino );
         
        },
        filename: function(req, file, cb){
            cb(null,Date.now()+"_"+file.originalname);
        }
    }
);
const upload = multer( { storage: storage } );

//Rutas
/*GUARDA LOS DATOS DEL PRODUCTO */
router.post('/save-data', verificarTokenNegocio , fruteriaController.saveData);
/*ACTUALIZA LOS DATOS DEL PRODUCTO POR ID */
router.put('/update-data/:_id', verificarTokenNegocio , fruteriaController.updateData);
/*RECUPERA TODOS LOS PRODUCTOS DEL NEGOCIO QUE ESTA EN LOGUEO*/
router.get('/getAllProductNegocio/:estado?', verificarTokenNegocio , fruteriaController.getAllProductNegocio);
/*RECUPERA TODO LOS PRODUCTOS DE TODO LOS NEGOCIOS */
router.get('/getAllProduct', fruteriaController.getAllProduct);
/*BUSCAR EL PRODUCTO POR ID*/
router.get('/searchproduct/:_id', fruteriaController.searchproductId);
/*BUSCAR POR NOMBRE*/
router.get('/searchproductName/:nombre' ,verificarTokenNegocio, fruteriaController.searchproductName);
/*DEVUELVE LA CANTIDAD DE PRODUCTOS EXISTENTES*/
router.get('/countProduct' ,verificarTokenNegocio, fruteriaController.countProductNegocio);
/*ACTUALIZA EL ESTADO DEL PRODUCTOS POR ID */
router.put('/update-status', verificarTokenNegocio , fruteriaController.updateStatus);
/*ELIMINA LOS DATOS DEL PRODUCTOS POR ID */
router.delete('/delete-data/:_id', verificarTokenNegocio , fruteriaController.deleteData);
/*ACTUALIZAR IMAGEN  IDPRODUCTO , ID de la imagen*/
router.put('/updateImage',[ verificarTokenNegocio , upload.single('file') ] , fruteriaController.actualizarImage );
/*SUBIDA DE LA IMAGEN DEL PRODUCTO */
router.post('/upload-imagen/:_id',[verificarTokenNegocio ,upload.single('file') ] , fruteriaController.uploadImage);
/*OBTENER IMAGEN POR NOMBRE , ID DEL PRODUCTO =>QUERY , ID DE LA IMAGEN =>QUERY*/
router.get('/get-img/:nameImage' ,verificarTokenNegocio, fruteriaController.getImage);
/*ELIMINAR IMAGEN DEL PRODUCTO*/
router.delete('/delete-img/:nameImage' ,verificarTokenNegocio, fruteriaController.deleteImageProduct);
/*ELIMINAR TODAS LAS IMAGENES DE LA CARPETA ABARROTE Y ELINAMOS LA LISTA DE DATOS EN MONGODB*/
router.delete('/delete-all-image' ,verificarTokenNegocio, fruteriaController.deleteAllImageProduct);
/*AUMENTA LA CANTIDAD DE VISTA SOBRE EL PRODUCTO */
router.put('/aumentar-vista' ,fruteriaController.aumentarVistas);
module.exports = router;