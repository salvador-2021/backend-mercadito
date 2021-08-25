'use strict'
const express = require('express');
const computadoraController = require('../controllers/computadora');
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

            rutaDestino += _idNegocio + '/computadora';
            
            cb( null , rutaDestino );
         
        },

        filename: function(req, file, cb){
            cb(null,Date.now()+"_"+file.originalname);
        }
    }
);

const upload = multer( { storage: storage } );

//Rutas
/*GUARDAR DATOS DEL PRODUCTO */
router.post('/save-data', verificarTokenNegocio , computadoraController.save_data);
/*RECUPERACION DE TODOS LOS PRODUCTOS QUE SOLO LE PERTENECEN A UN NEGOCIO EN ESPECIFICO*/
router.get('/getAllProductNegocio/:estado?', verificarTokenNegocio , computadoraController.getAllProductNegocio);
/*RECUPERACION DE TODOS LOS PRODUCTOS DE TODOS LOS NEGOCIOS*/
router.get('/getAllComputer', computadoraController.getAllProducto);
/*BUSQUEDA DE TODOS LOS PRODUCTOS QUE COINCIDAN CON UN NOMBRE QUE SE MANDE POR PARAMETRO */
router.get('/searchproduct/:_id?' , computadoraController.searchproductId);
/*DEVUELVE LA CANTIDAD DE PRODUCTOS EXISTENTES*/
router.get('/countProduct' ,verificarTokenNegocio, computadoraController.countProductNegocio);
//ACTUALIZACION DEL PRODUCTO POR ID DEL NEGOCIO E IDPRODUCTO
router.put('/update-data/:_id', verificarTokenNegocio , computadoraController.updateData);
/*ACTIVAR O DESACTIVAR EL PRODUCTO*/
router.put('/update-status', verificarTokenNegocio , computadoraController.updateStatusProduct);
/*ELIMINACION DEL PRODUCTO */
router.delete('/delete-data/:_id', verificarTokenNegocio , computadoraController.deleteData);
/*ACTUALIZAR IMAGEN  IDPRODUCTO , ID de la imagen*/
router.put('/updateImage',[ verificarTokenNegocio , upload.single('file') ] , computadoraController.actualizarImage );
/*SUBIDA DE LA IMAGEN DEL PRODUCTO */
router.post('/upload-imagen/:_id',[verificarTokenNegocio ,upload.single('file') ] , computadoraController.uploadImage);
/*OBTENER IMAGEN POR NOMBRE , ID DEL PRODUCTO =>QUERY , ID DE LA IMAGEN =>QUERY*/
router.get('/get-img/:nameImage' ,verificarTokenNegocio, computadoraController.getImage);
/*ELIMINAR IMAGEN DEL PRODUCTO*/
router.delete('/delete-img/:nameImage' ,verificarTokenNegocio, computadoraController.deleteImageProduct);
/*ELIMINAR TODAS LAS IMAGENES DE LA CARPETA ABARROTE Y ELINAMOS LA LISTA DE DATOS EN MONGODB*/
router.delete('/delete-all-image' ,verificarTokenNegocio, computadoraController.deleteAllImageProduct);
/*AUMENTA LA CANTIDAD DE VISTA SOBRE EL PRODUCTO */
router.put('/aumentar-vista' ,computadoraController.aumentarVistas );
module.exports = router;